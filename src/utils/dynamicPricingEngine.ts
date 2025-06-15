
interface PricingFactors {
  basePrice: number;
  distance: number;
  wasteType: string;
  weight: number;
  timeOfDay: string;
  dayOfWeek: string;
  urgency: 'low' | 'medium' | 'high';
  location: { lat: number; lng: number };
  seasonality: 'low' | 'medium' | 'high';
}

interface PricingRules {
  distanceRate: number; // per km
  weightRate: number; // per kg
  timeMultipliers: {
    peak: number; // 8-10 AM, 5-7 PM
    normal: number;
    offPeak: number; // 10 PM - 6 AM
  };
  dayMultipliers: {
    weekday: number;
    weekend: number;
    holiday: number;
  };
  urgencyMultipliers: {
    low: number;
    medium: number;
    high: number;
  };
  wasteTypeMultipliers: {
    [key: string]: number;
  };
  locationMultipliers: {
    urban: number;
    suburban: number;
    rural: number;
  };
  demandMultiplier: number; // Based on current demand
  seasonalityMultipliers: {
    low: number;
    medium: number;
    high: number;
  };
}

interface PricingResult {
  basePrice: number;
  adjustments: {
    distance: number;
    weight: number;
    timeOfDay: number;
    dayOfWeek: number;
    urgency: number;
    wasteType: number;
    location: number;
    demand: number;
    seasonality: number;
  };
  finalPrice: number;
  breakdown: string[];
}

class DynamicPricingEngine {
  private defaultRules: PricingRules = {
    distanceRate: 2.5, // RM per km
    weightRate: 0.5, // RM per kg
    timeMultipliers: {
      peak: 1.3,
      normal: 1.0,
      offPeak: 0.8
    },
    dayMultipliers: {
      weekday: 1.0,
      weekend: 1.2,
      holiday: 1.5
    },
    urgencyMultipliers: {
      low: 1.0,
      medium: 1.2,
      high: 1.5
    },
    wasteTypeMultipliers: {
      'Construction Debris': 1.4,
      'Household Waste': 1.0,
      'Commercial Waste': 1.1,
      'Recyclable Materials': 0.9,
      'Hazardous Waste': 2.0,
      'Electronic Waste': 1.6,
      'Garden Waste': 0.8
    },
    locationMultipliers: {
      urban: 1.0,
      suburban: 1.1,
      rural: 1.3
    },
    demandMultiplier: 1.0, // Will be calculated based on current orders
    seasonalityMultipliers: {
      low: 0.9,
      medium: 1.0,
      high: 1.2
    }
  };

  private getTimeCategory(timeOfDay: string): keyof PricingRules['timeMultipliers'] {
    const hour = parseInt(timeOfDay.split(':')[0]);
    
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
      return 'peak';
    } else if (hour >= 22 || hour <= 6) {
      return 'offPeak';
    }
    return 'normal';
  }

  private getDayCategory(dayOfWeek: string): keyof PricingRules['dayMultipliers'] {
    const holidays = ['2024-01-01', '2024-05-01', '2024-08-31']; // Sample holidays
    const today = new Date().toISOString().split('T')[0];
    
    if (holidays.includes(today)) {
      return 'holiday';
    }
    
    const weekends = ['Saturday', 'Sunday'];
    return weekends.includes(dayOfWeek) ? 'weekend' : 'weekday';
  }

  private getLocationCategory(location: { lat: number; lng: number }): keyof PricingRules['locationMultipliers'] {
    // Simplified location categorization
    // In real implementation, this would use actual geographic data
    const urbanCenters = [
      { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur
      { lat: 5.4164, lng: 100.3327 }, // Penang
    ];

    for (const center of urbanCenters) {
      const distance = this.calculateDistance(location, center);
      if (distance < 20) return 'urban';
      if (distance < 50) return 'suburban';
    }
    
    return 'rural';
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
    const dLng = (point2.lng - point1.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * (Math.PI / 180)) * Math.cos(point2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateDemandMultiplier(currentOrderCount: number, averageOrderCount: number): number {
    if (averageOrderCount === 0) return 1.0;
    
    const demandRatio = currentOrderCount / averageOrderCount;
    
    if (demandRatio > 1.5) return 1.4; // High demand
    if (demandRatio > 1.2) return 1.2; // Medium high demand
    if (demandRatio < 0.8) return 0.9; // Low demand
    
    return 1.0; // Normal demand
  }

  public calculatePrice(
    factors: PricingFactors,
    customRules?: Partial<PricingRules>,
    currentDemandData?: { currentOrders: number; averageOrders: number }
  ): PricingResult {
    const rules = { ...this.defaultRules, ...customRules };
    const breakdown: string[] = [];
    
    // Base price
    let price = factors.basePrice;
    breakdown.push(`Base price: RM ${factors.basePrice.toFixed(2)}`);
    
    // Distance adjustment
    const distanceAdjustment = factors.distance * rules.distanceRate;
    price += distanceAdjustment;
    breakdown.push(`Distance (${factors.distance}km × RM ${rules.distanceRate}): +RM ${distanceAdjustment.toFixed(2)}`);
    
    // Weight adjustment
    const weightAdjustment = factors.weight * rules.weightRate;
    price += weightAdjustment;
    breakdown.push(`Weight (${factors.weight}kg × RM ${rules.weightRate}): +RM ${weightAdjustment.toFixed(2)}`);
    
    // Time of day multiplier
    const timeCategory = this.getTimeCategory(factors.timeOfDay);
    const timeMultiplier = rules.timeMultipliers[timeCategory];
    const timeAdjustment = price * (timeMultiplier - 1);
    price *= timeMultiplier;
    breakdown.push(`Time multiplier (${timeCategory}): ${timeMultiplier > 1 ? '+' : ''}${(timeAdjustment).toFixed(2)}`);
    
    // Day of week multiplier
    const dayCategory = this.getDayCategory(factors.dayOfWeek);
    const dayMultiplier = rules.dayMultipliers[dayCategory];
    const dayAdjustment = price * (dayMultiplier - 1);
    price *= dayMultiplier;
    breakdown.push(`Day multiplier (${dayCategory}): ${dayMultiplier > 1 ? '+' : ''}${(dayAdjustment).toFixed(2)}`);
    
    // Urgency multiplier
    const urgencyMultiplier = rules.urgencyMultipliers[factors.urgency];
    const urgencyAdjustment = price * (urgencyMultiplier - 1);
    price *= urgencyMultiplier;
    breakdown.push(`Urgency multiplier (${factors.urgency}): ${urgencyMultiplier > 1 ? '+' : ''}${(urgencyAdjustment).toFixed(2)}`);
    
    // Waste type multiplier
    const wasteTypeMultiplier = rules.wasteTypeMultipliers[factors.wasteType] || 1.0;
    const wasteTypeAdjustment = price * (wasteTypeMultiplier - 1);
    price *= wasteTypeMultiplier;
    breakdown.push(`Waste type multiplier (${factors.wasteType}): ${wasteTypeMultiplier > 1 ? '+' : ''}${(wasteTypeAdjustment).toFixed(2)}`);
    
    // Location multiplier
    const locationCategory = this.getLocationCategory(factors.location);
    const locationMultiplier = rules.locationMultipliers[locationCategory];
    const locationAdjustment = price * (locationMultiplier - 1);
    price *= locationMultiplier;
    breakdown.push(`Location multiplier (${locationCategory}): ${locationMultiplier > 1 ? '+' : ''}${(locationAdjustment).toFixed(2)}`);
    
    // Demand multiplier
    let demandMultiplier = 1.0;
    let demandAdjustment = 0;
    if (currentDemandData) {
      demandMultiplier = this.calculateDemandMultiplier(
        currentDemandData.currentOrders,
        currentDemandData.averageOrders
      );
      demandAdjustment = price * (demandMultiplier - 1);
      price *= demandMultiplier;
      breakdown.push(`Demand multiplier: ${demandMultiplier > 1 ? '+' : ''}${(demandAdjustment).toFixed(2)}`);
    }
    
    // Seasonality multiplier
    const seasonalityMultiplier = rules.seasonalityMultipliers[factors.seasonality];
    const seasonalityAdjustment = price * (seasonalityMultiplier - 1);
    price *= seasonalityMultiplier;
    breakdown.push(`Seasonality multiplier (${factors.seasonality}): ${seasonalityMultiplier > 1 ? '+' : ''}${(seasonalityAdjustment).toFixed(2)}`);
    
    return {
      basePrice: factors.basePrice,
      adjustments: {
        distance: distanceAdjustment,
        weight: weightAdjustment,
        timeOfDay: timeAdjustment,
        dayOfWeek: dayAdjustment,
        urgency: urgencyAdjustment,
        wasteType: wasteTypeAdjustment,
        location: locationAdjustment,
        demand: demandAdjustment,
        seasonality: seasonalityAdjustment
      },
      finalPrice: Math.round(price * 100) / 100,
      breakdown
    };
  }

  public calculateBulkDiscount(orderCount: number, totalValue: number): number {
    if (orderCount >= 10) return 0.15; // 15% discount for 10+ orders
    if (orderCount >= 5) return 0.10;  // 10% discount for 5+ orders
    if (totalValue >= 1000) return 0.05; // 5% discount for orders over RM 1000
    return 0;
  }
}

export default DynamicPricingEngine;
export type { PricingFactors, PricingRules, PricingResult };
