
interface PricingFactors {
  basePrice: number;
  distance: number;
  demandMultiplier: number;
  timeOfDay: number;
  binType: string;
  urgency: 'normal' | 'urgent';
  weatherConditions?: string;
  trafficConditions?: number;
}

interface PricingBreakdown {
  basePrice: number;
  distanceCharge: number;
  demandSurcharge: number;
  timeMultiplier: number;
  urgencyFee: number;
  weatherAdjustment: number;
  trafficAdjustment: number;
  totalPrice: number;
  savings?: number;
}

class DynamicPricingEngine {
  private static readonly DISTANCE_RATE = 2.5; // RM per km
  private static readonly PEAK_HOURS = [7, 8, 9, 17, 18, 19]; // Rush hours
  private static readonly BIN_TYPE_MULTIPLIERS = {
    'Recycling': 1.0,
    'Waste': 1.2,
    'Compost': 0.9
  };

  static calculatePrice(factors: PricingFactors): number {
    const breakdown = this.calculatePriceWithBreakdown(factors);
    return breakdown.totalPrice;
  }

  static calculatePriceWithBreakdown(factors: PricingFactors): PricingBreakdown {
    let totalPrice = factors.basePrice;
    
    // Distance charge
    const distanceCharge = factors.distance * this.DISTANCE_RATE;
    totalPrice += distanceCharge;

    // Demand multiplier (market conditions)
    const demandSurcharge = factors.basePrice * (factors.demandMultiplier - 1);
    totalPrice += demandSurcharge;

    // Time of day multiplier
    const isPeakHour = this.PEAK_HOURS.includes(factors.timeOfDay);
    const timeMultiplier = isPeakHour ? factors.basePrice * 0.3 : 0;
    totalPrice += timeMultiplier;

    // Bin type adjustment
    const binTypeMultiplier = this.BIN_TYPE_MULTIPLIERS[factors.binType as keyof typeof this.BIN_TYPE_MULTIPLIERS] || 1.0;
    totalPrice *= binTypeMultiplier;

    // Urgency fee
    const urgencyFee = factors.urgency === 'urgent' ? factors.basePrice * 0.5 : 0;
    totalPrice += urgencyFee;

    // Weather adjustment
    const weatherAdjustment = this.calculateWeatherAdjustment(factors.weatherConditions || 'clear');
    totalPrice += weatherAdjustment;

    // Traffic adjustment
    const trafficAdjustment = this.calculateTrafficAdjustment(factors.trafficConditions || 1);
    totalPrice += trafficAdjustment;

    return {
      basePrice: factors.basePrice,
      distanceCharge,
      demandSurcharge,
      timeMultiplier,
      urgencyFee,
      weatherAdjustment,
      trafficAdjustment,
      totalPrice: Math.round(totalPrice * 100) / 100
    };
  }

  private static calculateWeatherAdjustment(weather: string): number {
    const adjustments = {
      'rain': 10,
      'heavy_rain': 20,
      'storm': 30,
      'clear': 0,
      'cloudy': 0
    };
    return adjustments[weather as keyof typeof adjustments] || 0;
  }

  private static calculateTrafficAdjustment(trafficLevel: number): number {
    // Traffic level: 1 = light, 2 = moderate, 3 = heavy
    return (trafficLevel - 1) * 5;
  }

  static getDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return originalPrice * (1 - discountPercentage / 100);
  }

  static calculateBulkDiscount(orders: number): number {
    if (orders >= 10) return 15; // 15% discount for 10+ orders
    if (orders >= 5) return 10;  // 10% discount for 5+ orders
    if (orders >= 3) return 5;   // 5% discount for 3+ orders
    return 0;
  }
}

export default DynamicPricingEngine;
