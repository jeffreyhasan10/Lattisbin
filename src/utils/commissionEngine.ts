
interface CommissionTier {
  id: string;
  name: string;
  minTarget: number;
  maxTarget: number | null;
  baseRate: number;
  bonusThreshold: number;
  bonusRate: number;
  kpiMultiplier: number;
}

interface PerformanceKPI {
  deliveryTime: number;
  customerSatisfaction: number;
  safetyScore: number;
  fuelEfficiency: number;
  attendanceRate: number;
}

interface CommissionCalculation {
  baseCommission: number;
  performanceBonus: number;
  referralBonus: number;
  totalGross: number;
  taxDeduction: number;
  netAmount: number;
  kpiScore: number;
}

interface ReferralReward {
  referrerId: string;
  refereeId: string;
  rewardType: 'flat' | 'percentage';
  amount: number;
  conditions: string[];
  status: 'pending' | 'qualified' | 'paid';
}

interface DisputeCase {
  id: string;
  commissionId: string;
  reason: string;
  amount: number;
  submittedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  resolution?: string;
  resolvedBy?: string;
}

class CommissionEngine {
  private static tiers: CommissionTier[] = [
    {
      id: 'BRONZE',
      name: 'Bronze Tier',
      minTarget: 0,
      maxTarget: 30000,
      baseRate: 3.0,
      bonusThreshold: 20000,
      bonusRate: 1.0,
      kpiMultiplier: 1.0
    },
    {
      id: 'SILVER',
      name: 'Silver Tier',
      minTarget: 30000,
      maxTarget: 60000,
      baseRate: 5.0,
      bonusThreshold: 45000,
      bonusRate: 2.0,
      kpiMultiplier: 1.2
    },
    {
      id: 'GOLD',
      name: 'Gold Tier',
      minTarget: 60000,
      maxTarget: 100000,
      baseRate: 7.0,
      bonusThreshold: 80000,
      bonusRate: 3.0,
      kpiMultiplier: 1.5
    },
    {
      id: 'PLATINUM',
      name: 'Platinum Tier',
      minTarget: 100000,
      maxTarget: null,
      baseRate: 10.0,
      bonusThreshold: 120000,
      bonusRate: 5.0,
      kpiMultiplier: 2.0
    }
  ];

  private static referralPrograms = [
    {
      type: 'CUSTOMER_REFERRAL',
      reward: 200,
      conditions: ['first_order_completed', 'minimum_order_value_500']
    },
    {
      type: 'DRIVER_REFERRAL',
      reward: 500,
      conditions: ['30_days_active', 'minimum_10_deliveries']
    }
  ];

  static calculateCommission(
    salesAmount: number,
    kpiScores: PerformanceKPI,
    referralCount: number = 0,
    tierId?: string
  ): CommissionCalculation {
    const tier = tierId 
      ? this.tiers.find(t => t.id === tierId) 
      : this.getTierBySalesAmount(salesAmount);
    
    if (!tier) throw new Error('No applicable tier found');

    // Calculate KPI score (0-100)
    const kpiScore = this.calculateKPIScore(kpiScores);
    
    // Base commission calculation
    const baseCommission = salesAmount * (tier.baseRate / 100);
    
    // Performance bonus if threshold is met
    let performanceBonus = 0;
    if (salesAmount >= tier.bonusThreshold) {
      const bonusAmount = (salesAmount - tier.bonusThreshold) * (tier.bonusRate / 100);
      performanceBonus = bonusAmount * (kpiScore / 100) * tier.kpiMultiplier;
    }
    
    // Referral bonus
    const referralBonus = referralCount * 100; // RM 100 per referral
    
    const totalGross = baseCommission + performanceBonus + referralBonus;
    const taxDeduction = totalGross * 0.1; // 10% tax
    const netAmount = totalGross - taxDeduction;

    return {
      baseCommission,
      performanceBonus,
      referralBonus,
      totalGross,
      taxDeduction,
      netAmount,
      kpiScore
    };
  }

  static calculateKPIScore(kpi: PerformanceKPI): number {
    const weights = {
      deliveryTime: 0.25,
      customerSatisfaction: 0.30,
      safetyScore: 0.20,
      fuelEfficiency: 0.15,
      attendanceRate: 0.10
    };

    return (
      kpi.deliveryTime * weights.deliveryTime +
      kpi.customerSatisfaction * weights.customerSatisfaction +
      kpi.safetyScore * weights.safetyScore +
      kpi.fuelEfficiency * weights.fuelEfficiency +
      kpi.attendanceRate * weights.attendanceRate
    );
  }

  static getTierBySalesAmount(amount: number): CommissionTier | null {
    return this.tiers.find(tier => 
      amount >= tier.minTarget && (tier.maxTarget === null || amount <= tier.maxTarget)
    ) || null;
  }

  static processReferralReward(referral: ReferralReward): boolean {
    // Simulate referral qualification check
    const qualified = Math.random() > 0.3; // 70% qualification rate
    return qualified;
  }

  static createDispute(commissionId: string, reason: string, amount: number, submittedBy: string): DisputeCase {
    return {
      id: `DISP-${Date.now()}`,
      commissionId,
      reason,
      amount,
      submittedBy,
      status: 'open'
    };
  }

  static schedulePayment(recipientId: string, amount: number, paymentDate: Date) {
    return {
      id: `PAY-${Date.now()}`,
      recipientId,
      amount,
      scheduledDate: paymentDate,
      status: 'scheduled',
      processingFee: amount * 0.02, // 2% processing fee
      netAmount: amount * 0.98
    };
  }

  static getTiers(): CommissionTier[] {
    return this.tiers;
  }

  static getReferralPrograms() {
    return this.referralPrograms;
  }
}

export default CommissionEngine;
