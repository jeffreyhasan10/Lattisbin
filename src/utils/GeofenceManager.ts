
import { GPSPosition } from '@/contexts/NavigationProvider';
import { toast } from 'sonner';

export interface Geofence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // in meters
  type: 'customer_location' | 'depot' | 'service_area' | 'restricted_zone';
  isActive: boolean;
  triggers: GeofenceTrigger[];
  metadata?: {
    orderId?: string;
    customerId?: string;
    address?: string;
    notes?: string;
  };
}

export interface GeofenceTrigger {
  event: 'enter' | 'exit' | 'dwell';
  action: 'update_status' | 'send_notification' | 'start_timer' | 'capture_photo';
  parameters: {
    newStatus?: string;
    message?: string;
    dwellTime?: number; // in seconds
    recipients?: string[];
  };
}

export interface GeofenceEvent {
  geofenceId: string;
  event: 'enter' | 'exit' | 'dwell';
  timestamp: number;
  position: GPSPosition;
  driverId?: string;
  orderId?: string;
}

class GeofenceManager {
  private geofences: Map<string, Geofence> = new Map();
  private activeMonitoring: Map<string, {
    isInside: boolean;
    enterTime?: number;
    lastPosition?: GPSPosition;
  }> = new Map();
  private eventListeners: Array<(event: GeofenceEvent) => void> = [];
  private monitoringInterval: number | null = null;

  constructor() {
    this.loadGeofences();
  }

  // Add geofence
  addGeofence(geofence: Geofence): void {
    this.geofences.set(geofence.id, geofence);
    this.activeMonitoring.set(geofence.id, { isInside: false });
    this.saveGeofences();
    console.log(`Geofence added: ${geofence.name}`);
  }

  // Remove geofence
  removeGeofence(geofenceId: string): void {
    this.geofences.delete(geofenceId);
    this.activeMonitoring.delete(geofenceId);
    this.saveGeofences();
    console.log(`Geofence removed: ${geofenceId}`);
  }

  // Update geofence
  updateGeofence(geofence: Geofence): void {
    this.geofences.set(geofence.id, geofence);
    this.saveGeofences();
    console.log(`Geofence updated: ${geofence.name}`);
  }

  // Get all geofences
  getGeofences(): Geofence[] {
    return Array.from(this.geofences.values());
  }

  // Get geofence by ID
  getGeofence(id: string): Geofence | undefined {
    return this.geofences.get(id);
  }

  // Start monitoring position against all active geofences
  startMonitoring(getCurrentPosition: () => Promise<GPSPosition | null>): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.monitoringInterval = window.setInterval(async () => {
      const position = await getCurrentPosition();
      if (position) {
        this.checkGeofences(position);
      }
    }, 5000); // Check every 5 seconds

    console.log('Geofence monitoring started');
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Geofence monitoring stopped');
  }

  // Check current position against all geofences
  private checkGeofences(position: GPSPosition): void {
    this.geofences.forEach((geofence, geofenceId) => {
      if (!geofence.isActive) return;

      const monitoring = this.activeMonitoring.get(geofenceId);
      if (!monitoring) return;

      const isInsideNow = this.isPositionInGeofence(position, geofence);
      const wasInside = monitoring.isInside;

      // Handle enter event
      if (isInsideNow && !wasInside) {
        this.handleGeofenceEvent({
          geofenceId,
          event: 'enter',
          timestamp: Date.now(),
          position,
        });
        
        monitoring.isInside = true;
        monitoring.enterTime = Date.now();
        monitoring.lastPosition = position;
      }
      // Handle exit event
      else if (!isInsideNow && wasInside) {
        this.handleGeofenceEvent({
          geofenceId,
          event: 'exit',
          timestamp: Date.now(),
          position,
        });
        
        monitoring.isInside = false;
        monitoring.enterTime = undefined;
      }
      // Handle dwell event
      else if (isInsideNow && wasInside && monitoring.enterTime) {
        const dwellTime = Date.now() - monitoring.enterTime;
        const requiredDwell = this.getRequiredDwellTime(geofence);
        
        if (dwellTime >= requiredDwell) {
          this.handleGeofenceEvent({
            geofenceId,
            event: 'dwell',
            timestamp: Date.now(),
            position,
          });
          
          // Reset enter time to prevent repeated dwell events
          monitoring.enterTime = Date.now();
        }
      }

      monitoring.lastPosition = position;
    });
  }

  // Check if position is within geofence
  private isPositionInGeofence(position: GPSPosition, geofence: Geofence): boolean {
    const distance = this.calculateDistance(
      position.lat,
      position.lng,
      geofence.center.lat,
      geofence.center.lng
    );
    return distance <= geofence.radius;
  }

  // Calculate distance between two points in meters
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get required dwell time for geofence
  private getRequiredDwellTime(geofence: Geofence): number {
    const dwellTrigger = geofence.triggers.find(t => t.event === 'dwell');
    return dwellTrigger?.parameters.dwellTime || 60000; // Default 1 minute
  }

  // Handle geofence event
  private handleGeofenceEvent(event: GeofenceEvent): void {
    const geofence = this.geofences.get(event.geofenceId);
    if (!geofence) return;

    console.log(`Geofence ${event.event}: ${geofence.name}`);

    // Execute triggers
    geofence.triggers
      .filter(trigger => trigger.event === event.event)
      .forEach(trigger => this.executeTrigger(trigger, event, geofence));

    // Notify listeners
    this.eventListeners.forEach(listener => listener(event));

    // Show notification
    this.showNotification(event.event, geofence);
  }

  // Execute trigger action
  private executeTrigger(trigger: GeofenceTrigger, event: GeofenceEvent, geofence: Geofence): void {
    switch (trigger.action) {
      case 'update_status':
        if (trigger.parameters.newStatus && geofence.metadata?.orderId) {
          this.updateOrderStatus(geofence.metadata.orderId, trigger.parameters.newStatus);
        }
        break;
        
      case 'send_notification':
        if (trigger.parameters.message) {
          this.sendNotification(trigger.parameters.message, trigger.parameters.recipients);
        }
        break;
        
      case 'start_timer':
        this.startTimer(event.geofenceId);
        break;
        
      case 'capture_photo':
        this.requestPhotoCapture(geofence);
        break;
    }
  }

  // Update order status
  private updateOrderStatus(orderId: string, newStatus: string): void {
    // This would integrate with your order management system
    console.log(`Updating order ${orderId} status to: ${newStatus}`);
    
    // Emit custom event for order status update
    window.dispatchEvent(new CustomEvent('orderStatusUpdate', {
      detail: { orderId, status: newStatus, trigger: 'geofence' }
    }));
  }

  // Send notification
  private sendNotification(message: string, recipients?: string[]): void {
    console.log(`Sending notification: ${message}`, recipients);
    
    // This would integrate with your notification system
    if ('serviceWorker' in navigator && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Geofence Alert', { body: message });
      }
    }
  }

  // Start timer
  private startTimer(geofenceId: string): void {
    console.log(`Starting timer for geofence: ${geofenceId}`);
    // Implementation for timer functionality
  }

  // Request photo capture
  private requestPhotoCapture(geofence: Geofence): void {
    console.log(`Photo capture requested for: ${geofence.name}`);
    toast.info(`Please take a photo at ${geofence.name}`);
    
    // Emit custom event for photo capture request
    window.dispatchEvent(new CustomEvent('photoCaptureRequest', {
      detail: { geofenceId: geofence.id, location: geofence.name }
    }));
  }

  // Show notification
  private showNotification(event: string, geofence: Geofence): void {
    const eventMessages = {
      enter: `Entered ${geofence.name}`,
      exit: `Exited ${geofence.name}`,
      dwell: `Dwelling at ${geofence.name}`,
    };

    toast.info(eventMessages[event as keyof typeof eventMessages]);
  }

  // Add event listener
  addEventListener(listener: (event: GeofenceEvent) => void): void {
    this.eventListeners.push(listener);
  }

  // Remove event listener
  removeEventListener(listener: (event: GeofenceEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  // Create geofence for customer location
  createCustomerGeofence(orderId: string, customerId: string, address: string, coordinates: { lat: number; lng: number }): Geofence {
    return {
      id: `customer_${orderId}`,
      name: `Customer Location - ${address}`,
      center: coordinates,
      radius: 100, // 100 meters
      type: 'customer_location',
      isActive: true,
      triggers: [
        {
          event: 'enter',
          action: 'update_status',
          parameters: { newStatus: 'arrived' }
        },
        {
          event: 'exit',
          action: 'update_status',
          parameters: { newStatus: 'completed' }
        }
      ],
      metadata: {
        orderId,
        customerId,
        address
      }
    };
  }

  // Load geofences from storage
  private loadGeofences(): void {
    try {
      const stored = localStorage.getItem('geofences');
      if (stored) {
        const geofences = JSON.parse(stored) as Geofence[];
        geofences.forEach(geofence => {
          this.geofences.set(geofence.id, geofence);
          this.activeMonitoring.set(geofence.id, { isInside: false });
        });
      }
    } catch (error) {
      console.error('Failed to load geofences:', error);
    }
  }

  // Save geofences to storage
  private saveGeofences(): void {
    try {
      const geofences = Array.from(this.geofences.values());
      localStorage.setItem('geofences', JSON.stringify(geofences));
    } catch (error) {
      console.error('Failed to save geofences:', error);
    }
  }
}

export default GeofenceManager;
