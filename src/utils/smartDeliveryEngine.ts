
interface DeliveryOrder {
  id: string;
  bookingId: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  binSerialNumber: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  estimatedWeight: number;
  scheduledTime: string;
  coordinates: { lat: number; lng: number };
}

interface Driver {
  id: string;
  name: string;
  currentLocation: { lat: number; lng: number };
  status: 'available' | 'busy' | 'offline';
  lorryId: string;
  lorryCapacity: number;
  expertise: string[];
  currentLoad: number;
}

interface AssignmentResult {
  orderId: string;
  driverId: string;
  estimatedDuration: number;
  routeDistance: number;
  confidence: number;
}

class SmartDeliveryEngine {
  static calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static calculateDriverScore(driver: Driver, order: DeliveryOrder): number {
    if (driver.status !== 'available') return 0;
    if (driver.currentLoad + order.estimatedWeight > driver.lorryCapacity) return 0;

    let score = 100;

    // Distance factor (closer is better)
    const distance = this.calculateDistance(driver.currentLocation, order.coordinates);
    const proximityScore = Math.max(0, 50 - distance * 2);
    score += proximityScore;

    // Priority matching
    const priorityBonus = order.priority === 'emergency' ? 30 : 
                         order.priority === 'high' ? 20 : 
                         order.priority === 'medium' ? 10 : 0;
    score += priorityBonus;

    // Load capacity utilization (optimal around 70-80%)
    const loadRatio = (driver.currentLoad + order.estimatedWeight) / driver.lorryCapacity;
    const capacityScore = loadRatio < 0.8 ? 20 : Math.max(0, 20 - (loadRatio - 0.8) * 50);
    score += capacityScore;

    // Expertise match
    const serviceType = order.binSerialNumber.startsWith('ASR') ? 'construction' : 'general';
    const expertiseBonus = driver.expertise.includes(serviceType) ? 15 : 0;
    score += expertiseBonus;

    return Math.max(0, score);
  }

  static autoAssignOrder(drivers: Driver[], order: DeliveryOrder): AssignmentResult | null {
    const scoredDrivers = drivers
      .map(driver => ({
        driver,
        score: this.calculateDriverScore(driver, order),
        distance: this.calculateDistance(driver.currentLocation, order.coordinates)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scoredDrivers.length === 0) return null;

    const best = scoredDrivers[0];
    return {
      orderId: order.id,
      driverId: best.driver.id,
      estimatedDuration: Math.round(best.distance / 40 * 60 + 30), // Travel time + service time
      routeDistance: best.distance,
      confidence: Math.min(100, best.score)
    };
  }

  static optimizeMultipleDeliveries(orders: DeliveryOrder[], startLocation: { lat: number; lng: number }): DeliveryOrder[] {
    if (orders.length <= 1) return orders;

    // Sort by priority first
    const prioritySorted = orders.sort((a, b) => {
      const priorityWeight = { emergency: 4, high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    // Apply nearest neighbor algorithm for route optimization
    const optimized: DeliveryOrder[] = [];
    const remaining = [...prioritySorted];
    let currentLocation = startLocation;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(currentLocation, remaining[0].coordinates);

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(currentLocation, remaining[i].coordinates);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      const nextOrder = remaining.splice(nearestIndex, 1)[0];
      optimized.push(nextOrder);
      currentLocation = nextOrder.coordinates;
    }

    return optimized;
  }

  static validateQRCode(qrData: string, expectedSerial: string): { valid: boolean; message: string } {
    try {
      const data = JSON.parse(qrData);
      if (data.serialNumber === expectedSerial) {
        return { valid: true, message: "QR code validated successfully" };
      } else {
        return { valid: false, message: "Serial number mismatch" };
      }
    } catch {
      return { valid: false, message: "Invalid QR code format" };
    }
  }

  static calculateOptimalRoute(waypoints: { lat: number; lng: number }[]): any {
    // Mock implementation for traffic-aware routing
    const totalDistance = waypoints.reduce((acc, point, index) => {
      if (index === 0) return 0;
      return acc + this.calculateDistance(waypoints[index - 1], point);
    }, 0);

    const baseTime = totalDistance / 40 * 60; // 40 km/h average
    const trafficMultiplier = 1 + Math.random() * 0.5; // 0-50% traffic delay
    const optimizedTime = baseTime * trafficMultiplier;

    return {
      distance: Math.round(totalDistance * 100) / 100,
      duration: Math.round(optimizedTime),
      trafficDelay: Math.round((trafficMultiplier - 1) * baseTime),
      waypoints: waypoints
    };
  }
}

export default SmartDeliveryEngine;
