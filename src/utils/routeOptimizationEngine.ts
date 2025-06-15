
interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface DeliveryPoint {
  id: string;
  location: Location;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high';
}

interface OptimizedRoute {
  totalDistance: number;
  totalDuration: number;
  estimatedFuel: number;
  waypoints: DeliveryPoint[];
  efficiency: number;
}

class RouteOptimizationEngine {
  private static calculateDistance(point1: Location, point2: Location): number {
    // Haversine formula for distance calculation
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

  static optimizeRoute(deliveryPoints: DeliveryPoint[], startLocation: Location): OptimizedRoute {
    if (deliveryPoints.length === 0) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        estimatedFuel: 0,
        waypoints: [],
        efficiency: 100
      };
    }

    // Sort by priority first, then optimize for distance
    const prioritySorted = deliveryPoints.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    // Simple nearest neighbor algorithm for distance optimization
    const optimizedWaypoints: DeliveryPoint[] = [];
    const remaining = [...prioritySorted];
    let currentLocation = startLocation;
    let totalDistance = 0;
    let totalDuration = 0;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(currentLocation, remaining[0].location);

      // Find nearest point considering priority
      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(currentLocation, remaining[i].location);
        const priorityBonus = remaining[i].priority === 'high' ? 0.8 : 
                             remaining[i].priority === 'medium' ? 0.9 : 1.0;
        const adjustedDistance = distance * priorityBonus;
        
        if (adjustedDistance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      const nextPoint = remaining.splice(nearestIndex, 1)[0];
      optimizedWaypoints.push(nextPoint);
      totalDistance += nearestDistance;
      totalDuration += nextPoint.estimatedDuration + (nearestDistance / 40 * 60); // Assume 40km/h average speed
      currentLocation = nextPoint.location;
    }

    const estimatedFuel = totalDistance * 0.08; // 8L per 100km
    const efficiency = Math.max(0, 100 - (totalDistance / deliveryPoints.length) * 2);

    return {
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration: Math.round(totalDuration),
      estimatedFuel: Math.round(estimatedFuel * 100) / 100,
      waypoints: optimizedWaypoints,
      efficiency: Math.round(efficiency)
    };
  }

  static calculateRouteMetrics(orders: any[]): any {
    // Mock implementation for context compatibility
    const mockLocation: Location = { lat: 3.1390, lng: 101.6869, address: "Kuala Lumpur" };
    const deliveryPoints: DeliveryPoint[] = orders.map(order => ({
      id: order.id,
      location: { lat: 3.1390 + Math.random() * 0.1, lng: 101.6869 + Math.random() * 0.1, address: order.location || "Unknown" },
      estimatedDuration: order.estimatedDuration || 60,
      priority: order.priority || 'medium'
    }));

    return this.optimizeRoute(deliveryPoints, mockLocation);
  }
}

export default RouteOptimizationEngine;
