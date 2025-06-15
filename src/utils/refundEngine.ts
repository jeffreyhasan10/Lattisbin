
interface RefundPolicy {
  id: string;
  category: string;
  conditions: string[];
  refundPercentage: number;
  processingFee: number;
  timeLimit: number; // hours
  autoApprove: boolean;
  impactFactors: {
    operationalCost: number;
    customerRetention: number;
    driverCompensation: number;
  };
}

interface RefundRequest {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  reason: string;
  category: string;
  description: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  impactAnalysis?: ImpactAnalysis;
}

interface ImpactAnalysis {
  financialImpact: number;
  operationalImpact: string;
  customerSatisfactionImpact: string;
  preventionRecommendations: string[];
}

interface CancellationReason {
  category: string;
  subcategory: string;
  frequency: number;
  averageImpact: number;
  preventable: boolean;
}

class RefundEngine {
  private static policies: RefundPolicy[] = [
    {
      id: 'SERVICE_NOT_PROVIDED',
      category: 'Service Not Provided',
      conditions: ['driver_unable_to_access', 'customer_not_available'],
      refundPercentage: 100,
      processingFee: 0,
      timeLimit: 72,
      autoApprove: true,
      impactFactors: {
        operationalCost: 0.15,
        customerRetention: 0.95,
        driverCompensation: 0.5
      }
    },
    {
      id: 'EARLY_CANCELLATION',
      category: 'Early Cancellation',
      conditions: ['cancelled_before_24h', 'customer_initiated'],
      refundPercentage: 90,
      processingFee: 25,
      timeLimit: 24,
      autoApprove: true,
      impactFactors: {
        operationalCost: 0.1,
        customerRetention: 0.85,
        driverCompensation: 0.2
      }
    },
    {
      id: 'SERVICE_QUALITY',
      category: 'Service Quality Issue',
      conditions: ['customer_complaint', 'quality_below_standard'],
      refundPercentage: 50,
      processingFee: 0,
      timeLimit: 168, // 7 days
      autoApprove: false,
      impactFactors: {
        operationalCost: 0.25,
        customerRetention: 0.7,
        driverCompensation: 0
      }
    },
    {
      id: 'BILLING_ERROR',
      category: 'Billing Error',
      conditions: ['incorrect_amount', 'system_error'],
      refundPercentage: 100,
      processingFee: 0,
      timeLimit: 720, // 30 days
      autoApprove: true,
      impactFactors: {
        operationalCost: 0.05,
        customerRetention: 0.9,
        driverCompensation: 0
      }
    }
  ];

  private static cancellationReasons: CancellationReason[] = [
    {
      category: 'Customer Issues',
      subcategory: 'Change of Mind',
      frequency: 35,
      averageImpact: 150,
      preventable: false
    },
    {
      category: 'Service Issues',
      subcategory: 'Driver Delay',
      frequency: 25,
      averageImpact: 300,
      preventable: true
    },
    {
      category: 'Technical Issues',
      subcategory: 'App Problems',
      frequency: 15,
      averageImpact: 200,
      preventable: true
    },
    {
      category: 'External Factors',
      subcategory: 'Weather Conditions',
      frequency: 25,
      averageImpact: 250,
      preventable: false
    }
  ];

  static processRefundRequest(request: RefundRequest): {
    approved: boolean;
    refundAmount: number;
    processingFee: number;
    netRefund: number;
    autoProcessed: boolean;
    impactAnalysis: ImpactAnalysis;
  } {
    const policy = this.policies.find(p => p.category === request.category);
    if (!policy) throw new Error('No policy found for this category');

    const refundAmount = request.amount * (policy.refundPercentage / 100);
    const processingFee = policy.processingFee;
    const netRefund = refundAmount - processingFee;

    // Check if request is within time limit
    const hoursElapsed = (Date.now() - request.requestDate.getTime()) / (1000 * 60 * 60);
    const withinTimeLimit = hoursElapsed <= policy.timeLimit;

    const approved = withinTimeLimit && this.meetsConditions(request, policy.conditions);
    const autoProcessed = approved && policy.autoApprove;

    const impactAnalysis = this.analyzeImpact(request, policy);

    return {
      approved,
      refundAmount,
      processingFee,
      netRefund,
      autoProcessed,
      impactAnalysis
    };
  }

  static analyzeImpact(request: RefundRequest, policy: RefundPolicy): ImpactAnalysis {
    const financialImpact = request.amount * policy.impactFactors.operationalCost;
    
    const operationalImpact = financialImpact > 500 
      ? 'High - requires process review'
      : financialImpact > 200 
      ? 'Medium - monitor frequency'
      : 'Low - standard processing';

    const customerSatisfactionImpact = policy.impactFactors.customerRetention > 0.8
      ? 'Positive - maintains customer relationship'
      : 'Negative - may lose customer';

    const preventionRecommendations = this.generatePreventionRecommendations(request.category);

    return {
      financialImpact,
      operationalImpact,
      customerSatisfactionImpact,
      preventionRecommendations
    };
  }

  static generatePreventionRecommendations(category: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'Service Not Provided': [
        'Improve route planning and accessibility checks',
        'Enhance driver training for difficult locations',
        'Implement pre-service customer contact protocol'
      ],
      'Early Cancellation': [
        'Send confirmation reminders 24h before service',
        'Implement flexible rescheduling options',
        'Provide clear cancellation policy communication'
      ],
      'Service Quality Issue': [
        'Increase quality control inspections',
        'Provide additional driver training',
        'Implement customer feedback collection system'
      ],
      'Billing Error': [
        'Audit pricing calculation systems',
        'Implement automated billing verification',
        'Provide transparent billing breakdown'
      ]
    };

    return recommendations[category] || ['Review and improve standard procedures'];
  }

  static meetsConditions(request: RefundRequest, conditions: string[]): boolean {
    // Simulate condition checking - in real implementation, this would check actual conditions
    return Math.random() > 0.2; // 80% approval rate for demo
  }

  static getCancellationAnalytics() {
    return {
      reasons: this.cancellationReasons,
      totalCancellations: this.cancellationReasons.reduce((sum, r) => sum + r.frequency, 0),
      preventableCancellations: this.cancellationReasons.filter(r => r.preventable).reduce((sum, r) => sum + r.frequency, 0),
      averageImpactPerCancellation: this.cancellationReasons.reduce((sum, r) => sum + r.averageImpact, 0) / this.cancellationReasons.length
    };
  }

  static getPolicies(): RefundPolicy[] {
    return this.policies;
  }
}

export default RefundEngine;
