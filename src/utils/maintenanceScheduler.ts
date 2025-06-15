
interface Vehicle {
  id: string;
  model: string;
  registration: string;
  mileage: number;
  lastMaintenance: string;
  maintenanceInterval: number; // in km
  timeBasedInterval: number; // in months
  alerts: MaintenanceAlert[];
}

interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: 'mileage' | 'time' | 'inspection' | 'insurance' | 'roadTax';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  dueDate: string;
  overdue: boolean;
  estimatedCost: number;
  category: string;
}

interface MaintenanceSchedule {
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedCost: number;
  priority: number;
  recurring: boolean;
  nextDueDate?: string;
}

class MaintenanceScheduler {
  private maintenanceTypes = {
    'Oil Change': { interval: 5000, cost: 150, priority: 'medium' },
    'Tire Inspection': { interval: 10000, cost: 200, priority: 'medium' },
    'Brake Service': { interval: 15000, cost: 400, priority: 'high' },
    'Engine Service': { interval: 20000, cost: 800, priority: 'high' },
    'Transmission Service': { interval: 30000, cost: 600, priority: 'medium' },
    'Major Service': { interval: 40000, cost: 1500, priority: 'high' },
    'Annual Inspection': { interval: 12, cost: 300, priority: 'high', timeBased: true },
    'Insurance Renewal': { interval: 12, cost: 2000, priority: 'critical', timeBased: true },
    'Road Tax Renewal': { interval: 12, cost: 500, priority: 'critical', timeBased: true }
  };

  private calculateNextDueDate(lastDate: string, intervalMonths: number): string {
    const date = new Date(lastDate);
    date.setMonth(date.getMonth() + intervalMonths);
    return date.toISOString().split('T')[0];
  }

  private calculateDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getPriorityLevel(daysUntilDue: number, maintenanceType: string): 'low' | 'medium' | 'high' | 'critical' {
    const isInsuranceOrTax = maintenanceType.includes('Insurance') || maintenanceType.includes('Road Tax');
    
    if (daysUntilDue < 0) return 'critical'; // Overdue
    if (daysUntilDue <= 7) return isInsuranceOrTax ? 'critical' : 'high';
    if (daysUntilDue <= 30) return isInsuranceOrTax ? 'high' : 'medium';
    if (daysUntilDue <= 60) return 'medium';
    return 'low';
  }

  public generateMaintenanceAlerts(vehicles: Vehicle[]): MaintenanceAlert[] {
    const alerts: MaintenanceAlert[] = [];
    
    for (const vehicle of vehicles) {
      // Mileage-based maintenance
      for (const [type, config] of Object.entries(this.maintenanceTypes)) {
        if (config.timeBased) continue;
        
        const kmSinceLastMaintenance = vehicle.mileage - this.getLastMaintenanceMileage(vehicle, type);
        const kmUntilDue = config.interval - kmSinceLastMaintenance;
        
        if (kmUntilDue <= 1000) { // Alert when within 1000km
          const estimatedDays = Math.max(1, Math.ceil(kmUntilDue / 50)); // Assume 50km/day average
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + estimatedDays);
          
          alerts.push({
            id: `${vehicle.id}-${type}-${Date.now()}`,
            vehicleId: vehicle.id,
            type: 'mileage',
            priority: kmUntilDue <= 0 ? 'critical' : this.getPriorityLevel(estimatedDays, type),
            description: `${type} due in ${kmUntilDue}km for ${vehicle.registration}`,
            dueDate: dueDate.toISOString().split('T')[0],
            overdue: kmUntilDue <= 0,
            estimatedCost: config.cost,
            category: type
          });
        }
      }
      
      // Time-based maintenance
      for (const [type, config] of Object.entries(this.maintenanceTypes)) {
        if (!config.timeBased) continue;
        
        const lastMaintenanceDate = vehicle.lastMaintenance;
        const nextDueDate = this.calculateNextDueDate(lastMaintenanceDate, config.interval);
        const daysUntilDue = this.calculateDaysUntilDue(nextDueDate);
        
        if (daysUntilDue <= 90) { // Alert 3 months in advance
          alerts.push({
            id: `${vehicle.id}-${type}-${Date.now()}`,
            vehicleId: vehicle.id,
            type: 'time',
            priority: this.getPriorityLevel(daysUntilDue, type),
            description: `${type} due on ${nextDueDate} for ${vehicle.registration}`,
            dueDate: nextDueDate,
            overdue: daysUntilDue < 0,
            estimatedCost: config.cost,
            category: type
          });
        }
      }
    }
    
    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private getLastMaintenanceMileage(vehicle: Vehicle, type: string): number {
    // This would typically come from maintenance records
    // For demo purposes, using vehicle's last maintenance mileage
    return vehicle.mileage - 3000; // Assume last maintenance was 3000km ago
  }

  public scheduleMaintenace(alerts: MaintenanceAlert[]): MaintenanceSchedule[] {
    const schedules: MaintenanceSchedule[] = [];
    
    for (const alert of alerts) {
      if (alert.priority === 'critical' || alert.priority === 'high') {
        schedules.push({
          vehicleId: alert.vehicleId,
          scheduledDate: alert.dueDate,
          type: alert.category,
          description: alert.description,
          estimatedCost: alert.estimatedCost,
          priority: alert.priority === 'critical' ? 5 : 4,
          recurring: this.isRecurringMaintenance(alert.category),
          nextDueDate: this.calculateNextMaintenanceDate(alert.dueDate, alert.category)
        });
      }
    }
    
    return schedules.sort((a, b) => b.priority - a.priority);
  }

  private isRecurringMaintenance(type: string): boolean {
    const recurringTypes = [
      'Oil Change', 'Tire Inspection', 'Annual Inspection',
      'Insurance Renewal', 'Road Tax Renewal'
    ];
    return recurringTypes.includes(type);
  }

  private calculateNextMaintenanceDate(currentDueDate: string, type: string): string {
    const config = this.maintenanceTypes[type as keyof typeof this.maintenanceTypes];
    if (!config) return currentDueDate;
    
    if (config.timeBased) {
      return this.calculateNextDueDate(currentDueDate, config.interval);
    } else {
      // For mileage-based, estimate based on average usage
      const estimatedMonths = Math.ceil(config.interval / 1500); // Assume 1500km/month
      return this.calculateNextDueDate(currentDueDate, estimatedMonths);
    }
  }

  public getMaintenanceCostProjection(vehicles: Vehicle[], months: number = 12): {
    totalCost: number;
    monthlyCosts: Array<{ month: string; cost: number }>;
    breakdown: Array<{ type: string; cost: number; frequency: number }>;
  } {
    const alerts = this.generateMaintenanceAlerts(vehicles);
    const schedules = this.scheduleMaintenace(alerts);
    
    const monthlyCosts: Array<{ month: string; cost: number }> = [];
    const breakdown: Array<{ type: string; cost: number; frequency: number }> = [];
    let totalCost = 0;
    
    // Calculate costs by month
    for (let i = 0; i < months; i++) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + i);
      const monthStr = targetDate.toISOString().slice(0, 7);
      
      const monthCost = schedules
        .filter(s => s.scheduledDate.startsWith(monthStr))
        .reduce((sum, s) => sum + s.estimatedCost, 0);
      
      monthlyCosts.push({ month: monthStr, cost: monthCost });
      totalCost += monthCost;
    }
    
    // Calculate breakdown by type
    const typeMap = new Map<string, { cost: number; frequency: number }>();
    
    for (const schedule of schedules) {
      const existing = typeMap.get(schedule.type) || { cost: 0, frequency: 0 };
      typeMap.set(schedule.type, {
        cost: existing.cost + schedule.estimatedCost,
        frequency: existing.frequency + 1
      });
    }
    
    for (const [type, data] of typeMap.entries()) {
      breakdown.push({ type, cost: data.cost, frequency: data.frequency });
    }
    
    return { totalCost, monthlyCosts, breakdown };
  }
}

export default MaintenanceScheduler;
export type { Vehicle, MaintenanceAlert, MaintenanceSchedule };
