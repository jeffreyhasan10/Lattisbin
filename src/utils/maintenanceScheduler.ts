
import { MaintenanceSchedule } from "@/data/dummyData";

interface MaintenanceRule {
  type: 'oil_change' | 'tire_rotation' | 'brake_inspection' | 'engine_service' | 'transmission' | 'battery' | 'filters' | 'belts';
  interval: number; // days
  cost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeBased: boolean;
  mileageBased?: number;
}

interface VehicleData {
  id: string;
  mileage: number;
  lastMaintenanceDate: Date;
  maintenanceHistory: MaintenanceSchedule[];
}

export class MaintenanceScheduler {
  private static maintenanceRules: MaintenanceRule[] = [
    { type: 'oil_change', interval: 90, cost: 150, priority: 'high', timeBased: true, mileageBased: 5000 },
    { type: 'tire_rotation', interval: 180, cost: 80, priority: 'medium', timeBased: true, mileageBased: 8000 },
    { type: 'brake_inspection', interval: 180, cost: 120, priority: 'high', timeBased: true, mileageBased: 12000 },
    { type: 'engine_service', interval: 365, cost: 500, priority: 'critical', timeBased: true, mileageBased: 15000 },
    { type: 'transmission', interval: 730, cost: 800, priority: 'critical', timeBased: true, mileageBased: 30000 },
    { type: 'battery', interval: 1095, cost: 200, priority: 'medium', timeBased: true },
    { type: 'filters', interval: 120, cost: 60, priority: 'medium', timeBased: true, mileageBased: 6000 },
    { type: 'belts', interval: 365, cost: 150, priority: 'medium', timeBased: true, mileageBased: 20000 }
  ];

  static scheduleNextMaintenance(vehicleId: string, currentDate: Date): MaintenanceSchedule {
    // Get vehicle data (mock for now)
    const vehicleData: VehicleData = {
      id: vehicleId,
      mileage: 50000,
      lastMaintenanceDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      maintenanceHistory: []
    };

    // Find next due maintenance
    const nextMaintenance = this.calculateNextDueMaintenance(vehicleData, currentDate);
    
    return {
      id: `maint_${Date.now()}`,
      vehicleId,
      type: nextMaintenance.type,
      scheduledDate: this.calculateNextMaintenanceDate(vehicleData, nextMaintenance, currentDate),
      estimatedCost: nextMaintenance.cost,
      priority: nextMaintenance.priority,
      status: 'scheduled',
      description: this.getMaintenanceDescription(nextMaintenance.type),
      technician: 'Auto-assigned',
      estimatedDuration: this.getEstimatedDuration(nextMaintenance.type)
    };
  }

  private static calculateNextDueMaintenance(vehicleData: VehicleData, currentDate: Date): MaintenanceRule {
    const overdueMaintenance: Array<{rule: MaintenanceRule, daysPastDue: number}> = [];

    for (const rule of this.maintenanceRules) {
      const daysSinceLastMaintenance = this.getDaysSinceLastMaintenance(
        vehicleData, 
        rule.type, 
        currentDate
      );

      if (rule.timeBased && daysSinceLastMaintenance >= rule.interval) {
        overdueMaintenance.push({
          rule,
          daysPastDue: daysSinceLastMaintenance - rule.interval
        });
      }
    }

    // Return highest priority overdue maintenance, or next due maintenance
    if (overdueMaintenance.length > 0) {
      const sortedByPriority = overdueMaintenance.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.rule.priority] - priorityOrder[a.rule.priority];
      });
      return sortedByPriority[0].rule;
    }

    // Return next scheduled maintenance
    const upcomingMaintenance = this.maintenanceRules
      .map(rule => ({
        rule,
        daysUntilDue: rule.interval - this.getDaysSinceLastMaintenance(vehicleData, rule.type, currentDate)
      }))
      .filter(item => item.daysUntilDue > 0)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    return upcomingMaintenance[0]?.rule || this.maintenanceRules[0];
  }

  private static calculateNextMaintenanceDate(
    vehicleData: VehicleData, 
    rule: MaintenanceRule, 
    currentDate: Date
  ): string {
    const lastMaintenanceForType = this.getLastMaintenanceDate(vehicleData, rule.type);
    const nextDate = new Date(lastMaintenanceForType.getTime() + rule.interval * 24 * 60 * 60 * 1000);
    
    // If overdue, schedule for current date + 3 days
    if (nextDate < currentDate) {
      const urgentDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      return urgentDate.toISOString().split('T')[0];
    }

    return nextDate.toISOString().split('T')[0];
  }

  private static getDaysSinceLastMaintenance(
    vehicleData: VehicleData, 
    maintenanceType: string, 
    currentDate: Date
  ): number {
    const lastDate = this.getLastMaintenanceDate(vehicleData, maintenanceType);
    return Math.floor((currentDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
  }

  private static getLastMaintenanceDate(vehicleData: VehicleData, maintenanceType: string): Date {
    const lastMaintenance = vehicleData.maintenanceHistory
      .filter(m => m.type === maintenanceType)
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0];

    return lastMaintenance 
      ? new Date(lastMaintenance.scheduledDate)
      : vehicleData.lastMaintenanceDate;
  }

  private static getMaintenanceDescription(type: string): string {
    const descriptions = {
      oil_change: 'Engine oil and filter replacement',
      tire_rotation: 'Tire rotation and pressure check',
      brake_inspection: 'Brake system inspection and adjustment',
      engine_service: 'Complete engine service and tune-up',
      transmission: 'Transmission fluid change and inspection',
      battery: 'Battery test and replacement if needed',
      filters: 'Air and fuel filter replacement',
      belts: 'Drive belt inspection and replacement'
    };
    return descriptions[type as keyof typeof descriptions] || 'General maintenance';
  }

  private static getEstimatedDuration(type: string): number {
    const durations = {
      oil_change: 60,
      tire_rotation: 45,
      brake_inspection: 90,
      engine_service: 240,
      transmission: 180,
      battery: 30,
      filters: 45,
      belts: 120
    };
    return durations[type as keyof typeof durations] || 60;
  }

  static generateMaintenanceAlerts(vehicles: string[]): MaintenanceSchedule[] {
    const currentDate = new Date();
    return vehicles.map(vehicleId => this.scheduleNextMaintenance(vehicleId, currentDate));
  }

  static prioritizeMaintenanceTasks(schedules: MaintenanceSchedule[]): MaintenanceSchedule[] {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return schedules.sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      return bPriority - aPriority;
    });
  }

  static estimateCostSavings(proactiveSchedule: MaintenanceSchedule[], reactiveEstimate: number): number {
    const proactiveCost = proactiveSchedule.reduce((sum, schedule) => sum + schedule.estimatedCost, 0);
    return Math.max(0, reactiveEstimate - proactiveCost);
  }
}
