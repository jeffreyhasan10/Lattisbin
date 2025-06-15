
interface QRScanResult {
  data: string;
  format: string;
  timestamp: Date;
  location?: { lat: number; lng: number };
}

interface PhotoCaptureResult {
  id: string;
  uri: string;
  base64?: string;
  metadata: {
    timestamp: Date;
    location?: { lat: number; lng: number };
    size: { width: number; height: number };
    fileSize: number;
  };
}

interface OfflineData {
  id: string;
  type: 'order_update' | 'photo_capture' | 'qr_scan' | 'signature';
  data: any;
  timestamp: Date;
  synced: boolean;
}

class MobileIntegrationService {
  private offlineQueue: OfflineData[] = [];
  private syncInProgress = false;

  // QR Code Scanning
  public async scanQRCode(): Promise<QRScanResult | null> {
    try {
      // Check if we're in a mobile environment with camera capabilities
      if (!this.isMobileEnvironment()) {
        throw new Error('QR scanning not available on this device');
      }

      // In a real implementation, this would use Capacitor's camera plugin
      // For demo purposes, we'll simulate QR scanning
      const result = await this.simulateQRScan();
      
      // Get current location if available
      const location = await this.getCurrentLocation();
      
      return {
        data: result.data,
        format: result.format,
        timestamp: new Date(),
        location
      };
    } catch (error) {
      console.error('QR scan failed:', error);
      return null;
    }
  }

  // Photo Capture
  public async capturePhoto(options?: {
    quality?: number;
    allowEdit?: boolean;
    resultType?: 'uri' | 'base64' | 'both';
  }): Promise<PhotoCaptureResult | null> {
    try {
      const defaultOptions = {
        quality: 80,
        allowEdit: false,
        resultType: 'uri' as const,
        ...options
      };

      // In a real implementation, this would use Capacitor's camera plugin
      const result = await this.simulatePhotoCapture(defaultOptions);
      
      const location = await this.getCurrentLocation();
      
      const photoResult: PhotoCaptureResult = {
        id: `photo_${Date.now()}`,
        uri: result.uri,
        base64: result.base64,
        metadata: {
          timestamp: new Date(),
          location,
          size: { width: 1920, height: 1080 }, // Would be actual dimensions
          fileSize: 2.5 * 1024 * 1024 // Would be actual file size
        }
      };

      // Add to offline queue for syncing
      await this.addToOfflineQueue({
        id: photoResult.id,
        type: 'photo_capture',
        data: photoResult,
        timestamp: new Date(),
        synced: false
      });

      return photoResult;
    } catch (error) {
      console.error('Photo capture failed:', error);
      return null;
    }
  }

  // Location Services
  public async getCurrentLocation(): Promise<{ lat: number; lng: number } | undefined> {
    try {
      if (!navigator.geolocation) {
        return undefined;
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Location error:', error);
            resolve(undefined);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      });
    } catch (error) {
      console.error('Get location failed:', error);
      return undefined;
    }
  }

  // Signature Capture
  public async captureSignature(): Promise<string | null> {
    try {
      // This would typically use a signature pad component
      // For demo purposes, return a placeholder
      const signatureData = await this.simulateSignatureCapture();
      
      // Add to offline queue
      await this.addToOfflineQueue({
        id: `signature_${Date.now()}`,
        type: 'signature',
        data: { signature: signatureData, timestamp: new Date() },
        timestamp: new Date(),
        synced: false
      });

      return signatureData;
    } catch (error) {
      console.error('Signature capture failed:', error);
      return null;
    }
  }

  // Offline Synchronization
  public async addToOfflineQueue(data: OfflineData): Promise<void> {
    this.offlineQueue.push(data);
    await this.saveOfflineQueue();
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncOfflineData();
    }
  }

  public async syncOfflineData(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      const unsyncedData = this.offlineQueue.filter(item => !item.synced);
      
      for (const item of unsyncedData) {
        try {
          await this.syncSingleItem(item);
          item.synced = true;
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }
      
      // Remove synced items older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      this.offlineQueue = this.offlineQueue.filter(
        item => !item.synced || item.timestamp > sevenDaysAgo
      );
      
      await this.saveOfflineQueue();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncSingleItem(item: OfflineData): Promise<void> {
    // In a real implementation, this would make API calls to sync data
    // For demo purposes, we'll simulate the sync process
    
    switch (item.type) {
      case 'photo_capture':
        await this.syncPhotoToServer(item.data);
        break;
      case 'qr_scan':
        await this.syncQRDataToServer(item.data);
        break;
      case 'signature':
        await this.syncSignatureToServer(item.data);
        break;
      case 'order_update':
        await this.syncOrderUpdateToServer(item.data);
        break;
    }
  }

  private async syncPhotoToServer(photoData: PhotoCaptureResult): Promise<void> {
    // Simulate API call to upload photo
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Photo ${photoData.id} synced to server`);
        resolve();
      }, 1000);
    });
  }

  private async syncQRDataToServer(qrData: QRScanResult): Promise<void> {
    // Simulate API call to sync QR data
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`QR data synced: ${qrData.data}`);
        resolve();
      }, 500);
    });
  }

  private async syncSignatureToServer(signatureData: any): Promise<void> {
    // Simulate API call to sync signature
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Signature synced to server');
        resolve();
      }, 800);
    });
  }

  private async syncOrderUpdateToServer(orderData: any): Promise<void> {
    // Simulate API call to sync order update
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Order update synced: ${orderData.orderId}`);
        resolve();
      }, 600);
    });
  }

  // Storage management
  private async saveOfflineQueue(): Promise<void> {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private async loadOfflineQueue(): Promise<void> {
    try {
      const saved = localStorage.getItem('offlineQueue');
      if (saved) {
        this.offlineQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.offlineQueue = [];
    }
  }

  // Utility methods
  private isMobileEnvironment(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private async simulateQRScan(): Promise<{ data: string; format: string }> {
    // Simulate QR scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleQRData = [
      'BIN-12345-KUALA-LUMPUR',
      'ORDER-67890-PRIORITY-HIGH',
      'DRIVER-ID-11223-ACTIVE',
      'WASTE-TYPE-CONSTRUCTION-2024'
    ];
    
    return {
      data: sampleQRData[Math.floor(Math.random() * sampleQRData.length)],
      format: 'QR_CODE'
    };
  }

  private async simulatePhotoCapture(options: any): Promise<{ uri: string; base64?: string }> {
    // Simulate photo capture delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const uri = `file:///storage/photos/capture_${Date.now()}.jpg`;
    const base64 = options.resultType === 'base64' || options.resultType === 'both' 
      ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...' // Sample base64
      : undefined;
    
    return { uri, base64 };
  }

  private async simulateSignatureCapture(): Promise<string> {
    // Simulate signature capture delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }

  // Initialize service
  public async initialize(): Promise<void> {
    await this.loadOfflineQueue();
    
    // Set up online/offline event listeners
    window.addEventListener('online', () => {
      console.log('Device back online, syncing data...');
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      console.log('Device offline, queuing data for later sync');
    });
    
    // Initial sync if online
    if (navigator.onLine) {
      this.syncOfflineData();
    }
  }

  // Public getters for status
  public getOfflineQueueCount(): number {
    return this.offlineQueue.filter(item => !item.synced).length;
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public isSyncing(): boolean {
    return this.syncInProgress;
  }
}

// Singleton instance
const mobileIntegrationService = new MobileIntegrationService();

export default mobileIntegrationService;
export type { QRScanResult, PhotoCaptureResult, OfflineData };
