
interface AssignmentCriteria {
  proximity: number;
  availability: boolean;
  capacity: number;
  expertise: string[];
  currentWorkload: number;
}

interface Driver {
  id: string;
  name: string;
  location: string;
  status: string;
  capacity: number;
  expertise: string[];
  currentOrders: number;
}

interface Order {
  id: string;
  location: string;
  requirements: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number;
}

class SmartAssignmentEngine {
  static calculateDriverScore(driver: Driver, order: Order): number {
    let score = 0;
    
    // Availability check
    if (driver.status !== 'active') return 0;
    
    // Capacity check
    if (driver.currentOrders >= driver.capacity) return 0;
    
    // Base score for available driver
    score += 50;
    
    // Proximity bonus (mock calculation)
    const proximityBonus = Math.random() * 30; // In real app, calculate actual distance
    score += proximityBonus;
    
    // Expertise match
    const expertiseMatch = order.requirements.some(req => 
      driver.expertise.includes(req)
    );
    if (expertiseMatch) score += 20;
    
    // Workload penalty
    const workloadPenalty = driver.currentOrders * 5;
    score -= workloadPenalty;
    
    // Priority bonus
    const priorityBonus = order.priority === 'high' ? 10 : 
                         order.priority === 'medium' ? 5 : 0;
    score += priorityBonus;
    
    return Math.max(0, score);
  }

  static assignOptimalDriver(drivers: Driver[], order: Order): Driver | null {
    const scoredDrivers = drivers
      .map(driver => ({
        driver,
        score: this.calculateDriverScore(driver, order)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredDrivers.length > 0 ? scoredDrivers[0].driver : null;
  }

  static batchAssignOrders(drivers: Driver[], orders: Order[]): Map<string, string> {
    const assignments = new Map<string, string>();
    const availableDrivers = [...drivers];
    
    // Sort orders by priority
    const sortedOrders = orders.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    for (const order of sortedOrders) {
      const assignedDriver = this.assignOptimalDriver(availableDrivers, order);
      if (assignedDriver) {
        assignments.set(order.id, assignedDriver.id);
        // Update driver workload
        const driverIndex = availableDrivers.findIndex(d => d.id === assignedDriver.id);
        if (driverIndex >= 0) {
          availableDrivers[driverIndex].currentOrders += 1;
        }
      }
    }

    return assignments;
  }
}

export default SmartAssignmentEngine;
