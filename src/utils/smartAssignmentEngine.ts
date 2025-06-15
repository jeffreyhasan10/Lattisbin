
interface Driver {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: string;
  rating: number;
  vehicle: string;
  capacity: number;
  currentLoad: number;
  expertise: string[];
}

interface Order {
  id: string;
  location: { lat: number; lng: number };
  wasteType: string;
  estimatedWeight: number;
  priority: 'high' | 'medium' | 'low';
  timeWindow: { start: string; end: string };
  specialRequirements?: string[];
}

interface AssignmentResult {
  driverId: string;
  orderId: string;
  score: number;
  estimatedDistance: number;
  estimatedTime: number;
}

class SmartAssignmentEngine {
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

  private calculateAssignmentScore(driver: Driver, order: Order): number {
    let score = 0;
    const distance = this.calculateDistance(driver.location, order.location);
    
    // Distance factor (closer is better)
    score += Math.max(0, 100 - distance * 2);
    
    // Driver rating factor
    score += driver.rating * 10;
    
    // Capacity utilization factor
    const utilizationRate = (driver.currentLoad + order.estimatedWeight) / driver.capacity;
    if (utilizationRate <= 1) {
      score += (1 - utilizationRate) * 20;
    } else {
      score -= 50; // Penalty for overload
    }
    
    // Expertise matching
    if (driver.expertise.includes(order.wasteType)) {
      score += 30;
    }
    
    // Priority bonus
    if (order.priority === 'high') {
      score += 20;
    } else if (order.priority === 'medium') {
      score += 10;
    }
    
    return Math.max(0, score);
  }

  public findBestDriverForOrder(drivers: Driver[], order: Order): AssignmentResult | null {
    const availableDrivers = drivers.filter(driver => 
      driver.status === 'active' && 
      (driver.currentLoad + order.estimatedWeight) <= driver.capacity
    );

    if (availableDrivers.length === 0) {
      return null;
    }

    let bestAssignment: AssignmentResult | null = null;
    let bestScore = 0;

    for (const driver of availableDrivers) {
      const score = this.calculateAssignmentScore(driver, order);
      const distance = this.calculateDistance(driver.location, order.location);
      const estimatedTime = distance * 3; // Rough estimate: 3 minutes per km

      if (score > bestScore) {
        bestScore = score;
        bestAssignment = {
          driverId: driver.id,
          orderId: order.id,
          score,
          estimatedDistance: distance,
          estimatedTime
        };
      }
    }

    return bestAssignment;
  }

  public optimizeMultipleAssignments(drivers: Driver[], orders: Order[]): AssignmentResult[] {
    const assignments: AssignmentResult[] = [];
    const availableDrivers = [...drivers];
    const remainingOrders = [...orders].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    for (const order of remainingOrders) {
      const assignment = this.findBestDriverForOrder(availableDrivers, order);
      if (assignment) {
        assignments.push(assignment);
        
        // Update driver's current load
        const driverIndex = availableDrivers.findIndex(d => d.id === assignment.driverId);
        if (driverIndex !== -1) {
          availableDrivers[driverIndex].currentLoad += order.estimatedWeight;
        }
      }
    }

    return assignments;
  }
}

export default SmartAssignmentEngine;
export type { Driver, Order, AssignmentResult };
