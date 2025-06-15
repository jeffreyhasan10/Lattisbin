
interface CachedMapData {
  id: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  zoomLevel: number;
  tiles: MapTile[];
  lastUpdated: number;
  size: number; // in bytes
}

interface MapTile {
  x: number;
  y: number;
  z: number;
  data: string; // base64 encoded tile data
  timestamp: number;
}

interface OfflineArea {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  priority: 'high' | 'medium' | 'low';
  downloadStatus: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  size: number;
  lastUpdated: number;
}

class OfflineMapManager {
  private static readonly DB_NAME = 'OfflineMapDB';
  private static readonly DB_VERSION = 1;
  private static readonly TILE_STORE = 'tiles';
  private static readonly AREA_STORE = 'areas';
  private static readonly MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB
  private static readonly TILE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  private db: IDBDatabase | null = null;

  async initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(OfflineMapManager.DB_NAME, OfflineMapManager.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create tiles store
        if (!db.objectStoreNames.contains(OfflineMapManager.TILE_STORE)) {
          const tileStore = db.createObjectStore(OfflineMapManager.TILE_STORE, { keyPath: 'id' });
          tileStore.createIndex('timestamp', 'timestamp');
          tileStore.createIndex('bounds', ['x', 'y', 'z']);
        }

        // Create areas store
        if (!db.objectStoreNames.contains(OfflineMapManager.AREA_STORE)) {
          const areaStore = db.createObjectStore(OfflineMapManager.AREA_STORE, { keyPath: 'id' });
          areaStore.createIndex('priority', 'priority');
          areaStore.createIndex('lastUpdated', 'lastUpdated');
        }
      };
    });
  }

  async downloadArea(area: Omit<OfflineArea, 'downloadStatus' | 'progress' | 'size' | 'lastUpdated'>): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const offlineArea: OfflineArea = {
      ...area,
      downloadStatus: 'downloading',
      progress: 0,
      size: 0,
      lastUpdated: Date.now(),
    };

    // Save area to database
    await this.saveArea(offlineArea);

    try {
      const tiles = await this.generateTileList(area.bounds, 10, 16); // zoom levels 10-16
      let downloadedTiles = 0;
      const totalTiles = tiles.length;
      let totalSize = 0;

      for (const tileCoord of tiles) {
        try {
          const tileData = await this.downloadTile(tileCoord.x, tileCoord.y, tileCoord.z);
          if (tileData) {
            const tile: MapTile = {
              x: tileCoord.x,
              y: tileCoord.y,
              z: tileCoord.z,
              data: tileData,
              timestamp: Date.now(),
            };

            await this.saveTile(tile);
            totalSize += tileData.length;
            downloadedTiles++;

            // Update progress
            offlineArea.progress = Math.round((downloadedTiles / totalTiles) * 100);
            offlineArea.size = totalSize;
            await this.saveArea(offlineArea);
          }
        } catch (error) {
          console.error(`Failed to download tile ${tileCoord.x},${tileCoord.y},${tileCoord.z}:`, error);
        }
      }

      // Mark as completed
      offlineArea.downloadStatus = 'completed';
      offlineArea.progress = 100;
      offlineArea.lastUpdated = Date.now();
      await this.saveArea(offlineArea);

      return true;
    } catch (error) {
      // Mark as failed
      offlineArea.downloadStatus = 'failed';
      await this.saveArea(offlineArea);
      throw error;
    }
  }

  private async downloadTile(x: number, y: number, z: number): Promise<string | null> {
    // Simulate tile download from map service
    // In real implementation, this would fetch from Google Maps, Mapbox, etc.
    const tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    
    try {
      const response = await fetch(tileUrl);
      if (!response.ok) return null;
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Tile download failed:', error);
      return null;
    }
  }

  private generateTileList(bounds: OfflineArea['bounds'], minZoom: number, maxZoom: number): { x: number; y: number; z: number }[] {
    const tiles: { x: number; y: number; z: number }[] = [];

    for (let z = minZoom; z <= maxZoom; z++) {
      const minTileX = Math.floor(this.long2tile(bounds.west, z));
      const maxTileX = Math.floor(this.long2tile(bounds.east, z));
      const minTileY = Math.floor(this.lat2tile(bounds.north, z));
      const maxTileY = Math.floor(this.lat2tile(bounds.south, z));

      for (let x = minTileX; x <= maxTileX; x++) {
        for (let y = minTileY; y <= maxTileY; y++) {
          tiles.push({ x, y, z });
        }
      }
    }

    return tiles;
  }

  private long2tile(lon: number, zoom: number): number {
    return ((lon + 180) / 360) * Math.pow(2, zoom);
  }

  private lat2tile(lat: number, zoom: number): number {
    return ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom);
  }

  async getTile(x: number, y: number, z: number): Promise<MapTile | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OfflineMapManager.TILE_STORE], 'readonly');
      const store = transaction.objectStore(OfflineMapManager.TILE_STORE);
      const request = store.get(`${x}-${y}-${z}`);

      request.onsuccess = () => {
        const tile = request.result as MapTile;
        if (tile && Date.now() - tile.timestamp < OfflineMapManager.TILE_EXPIRY) {
          resolve(tile);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async saveTile(tile: MapTile): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OfflineMapManager.TILE_STORE], 'readwrite');
      const store = transaction.objectStore(OfflineMapManager.TILE_STORE);
      const tileWithId = { ...tile, id: `${tile.x}-${tile.y}-${tile.z}` };
      const request = store.put(tileWithId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async saveArea(area: OfflineArea): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OfflineMapManager.AREA_STORE], 'readwrite');
      const store = transaction.objectStore(OfflineMapManager.AREA_STORE);
      const request = store.put(area);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineAreas(): Promise<OfflineArea[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OfflineMapManager.AREA_STORE], 'readonly');
      const store = transaction.objectStore(OfflineMapManager.AREA_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteArea(areaId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([OfflineMapManager.AREA_STORE], 'readwrite');
    const store = transaction.objectStore(OfflineMapManager.AREA_STORE);
    await store.delete(areaId);

    // Also delete associated tiles
    await this.cleanupTilesForArea(areaId);
  }

  private async cleanupTilesForArea(areaId: string): Promise<void> {
    // Implementation would delete tiles within the area bounds
    // This is a simplified version
    console.log(`Cleaning up tiles for area: ${areaId}`);
  }

  async getCacheSize(): Promise<number> {
    const areas = await this.getOfflineAreas();
    return areas.reduce((total, area) => total + area.size, 0);
  }

  async cleanupExpiredTiles(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([OfflineMapManager.TILE_STORE], 'readwrite');
    const store = transaction.objectStore(OfflineMapManager.TILE_STORE);
    const index = store.index('timestamp');
    const cutoffTime = Date.now() - OfflineMapManager.TILE_EXPIRY;
    
    const request =  index.openCursor(IDBKeyRange.upperBound(cutoffTime));
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }
}

export default OfflineMapManager;
export type { OfflineArea, MapTile, CachedMapData };
