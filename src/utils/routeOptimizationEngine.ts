
interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string;
  timeWindow?: { start: string; end: string };
  serviceTime: number; // minutes required at location
  priority: number; // 1-10, higher is more important
}

interface OptimizedRoute {
  driverId: string;
  locations: Location[];
  totalDistance: number;
  totalTime: number;
  estimatedFuelCost: number;
  efficiency: number;
}

interface RouteConstraints {
  maxDistance: number;
  maxTime: number; // in minutes
  vehicleCapacity: number;
  fuelEfficiency: number; // km per liter
  fuelPrice: number; // per liter
}

class RouteOptimizationEngine {
  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
    const dLng = (point2.lng - point1.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * (Math.PI / 180)) * Math.cos(point2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateRouteDistance(locations: Location[]): number {
    let totalDistance = 0;
    for (let i = 0; i < locations.length - 1; i++) {
      totalDistance += this.calculateDistance(locations[i], locations[i + 1]);
    }
    return totalDistance;
  }

  private calculateRouteTime(locations: Location[]): number {
    let totalTime = 0;
    const avgSpeed = 40; // km/h average speed in city
    
    // Add travel time
    for (let i = 0; i < locations.length - 1; i++) {
      const distance = this.calculateDistance(locations[i], locations[i + 1]);
      totalTime += (distance / avgSpeed) * 60; // Convert to minutes
    }
    
    // Add service time at each location
    totalTime += locations.reduce((sum, loc) => sum + loc.serviceTime, 0);
    
    return totalTime;
  }

  // Nearest Neighbor Algorithm with improvements
  private nearestNeighborTSP(locations: Location[], startIndex: number = 0): Location[] {
    const visited = new Set<number>();
    const route: Location[] = [];
    let currentIndex = startIndex;
    
    route.push(locations[currentIndex]);
    visited.add(currentIndex);
    
    while (visited.size < locations.length) {
      let nearestIndex = -1;
      let nearestDistance = Infinity;
      
      for (let i = 0; i < locations.length; i++) {
        if (!visited.has(i)) {
          const distance = this.calculateDistance(locations[currentIndex], locations[i]);
          
          // Factor in priority - higher priority locations are "closer"
          const adjustedDistance = distance / (locations[i].priority / 5);
          
          if (adjustedDistance < nearestDistance) {
            nearestDistance = adjustedDistance;
            nearestIndex = i;
          }
        }
      }
      
      if (nearestIndex !== -1) {
        route.push(locations[nearestIndex]);
        visited.add(nearestIndex);
        currentIndex = nearestIndex;
      }
    }
    
    return route;
  }

  // 2-opt improvement algorithm
  private twoOptImprovement(route: Location[]): Location[] {
    let improved = true;
    let bestRoute = [...route];
    let bestDistance = this.calculateRouteDistance(bestRoute);
    
    while (improved) {
      improved = false;
      
      for (let i = 1; i < route.length - 2; i++) {
        for (let j = i + 1; j < route.length; j++) {
          if (j - i === 1) continue; // Skip adjacent edges
          
          // Create new route by reversing the segment between i and j
          const newRoute = [
            ...bestRoute.slice(0, i),
            ...bestRoute.slice(i, j).reverse(),
            ...bestRoute.slice(j)
          ];
          
          const newDistance = this.calculateRouteDistance(newRoute);
          
          if (newDistance < bestDistance) {
            bestRoute = newRoute;
            bestDistance = newDistance;
            improved = true;
          }
        }
      }
    }
    
    return bestRoute;
  }

  public optimizeRoute(
    driverId: string,
    locations: Location[],
    constraints: RouteConstraints,
    startLocation?: Location
  ): OptimizedRoute {
    if (locations.length === 0) {
      return {
        driverId,
        locations: [],
        totalDistance: 0,
        totalTime: 0,
        estimatedFuelCost: 0,
        efficiency: 0
      };
    }

    // Sort locations by priority first
    const prioritySortedLocations = [...locations].sort((a, b) => b.priority - a.priority);
    
    // Apply nearest neighbor algorithm
    let optimizedLocations = this.nearestNeighborTSP(prioritySortedLocations);
    
    // Apply 2-opt improvement
    optimizedLocations = this.twoOptImprovement(optimizedLocations);
    
    // If we have a start location, prepend it
    if (startLocation) {
      optimizedLocations = [startLocation, ...optimizedLocations];
    }
    
    const totalDistance = this.calculateRouteDistance(optimizedLocations);
    const totalTime = this.calculateRouteTime(optimizedLocations);
    const estimatedFuelCost = (totalDistance / constraints.fuelEfficiency) * constraints.fuelPrice;
    
    // Calculate efficiency score (higher is better)
    const efficiency = Math.max(0, 100 - (totalDistance / 10) - (totalTime / 60));
    
    return {
      driverId,
      locations: optimizedLocations,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime),
      estimatedFuelCost: Math.round(estimatedFuelCost * 100) / 100,
      efficiency: Math.round(efficiency)
    };
  }

  public optimizeMultipleRoutes(
    driverLocations: Array<{ driverId: string; currentLocation: Location }>,
    deliveryLocations: Location[],
    constraints: RouteConstraints
  ): OptimizedRoute[] {
    const routes: OptimizedRoute[] = [];
    const remainingLocations = [...deliveryLocations];
    
    // Distribute locations among drivers
    const locationsPerDriver = Math.ceil(remainingLocations.length / driverLocations.length);
    
    for (const { driverId, currentLocation } of driverLocations) {
      const assignedLocations = remainingLocations.splice(0, locationsPerDriver);
      
      if (assignedLocations.length > 0) {
        const optimizedRoute = this.optimizeRoute(
          driverId,
          assignedLocations,
          constraints,
          currentLocation
        );
        routes.push(optimizedRoute);
      }
    }
    
    return routes;
  }
}

export default RouteOptimizationEngine;
export type { Location, OptimizedRoute, RouteConstraints };
