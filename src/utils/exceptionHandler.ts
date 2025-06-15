
interface DeliveryException {
  id: string;
  orderId: string;
  type: 'customer_unavailable' | 'access_denied' | 'bin_issue' | 'vehicle_breakdown' | 'weather' | 'other';
  description: string;
  timestamp: Date;
  location: { lat: number; lng: number };
  driverId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoResolvable: boolean;
  suggestedActions: string[];
  photos?: string[];
  customerContact?: boolean;
}

interface ResolutionAction {
  id: string;
  exceptionId: string;
  action: string;
  assignedTo: string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
}

class ExceptionHandler {
  static createException(
    orderId: string,
    type: DeliveryException['type'],
    description: string,
    driverId: string,
    location: { lat: number; lng: number }
  ): DeliveryException {
    const exception: DeliveryException = {
      id: `EXC-${Date.now()}`,
      orderId,
      type,
      description,
      timestamp: new Date(),
      location,
      driverId,
      severity: this.calculateSeverity(type),
      autoResolvable: this.isAutoResolvable(type),
      suggestedActions: this.getSuggestedActions(type),
    };

    return exception;
  }

  private static calculateSeverity(type: DeliveryException['type']): DeliveryException['severity'] {
    const severityMap = {
      customer_unavailable: 'medium',
      access_denied: 'medium',
      bin_issue: 'high',
      vehicle_breakdown: 'critical',
      weather: 'high',
      other: 'medium'
    } as const;

    return severityMap[type];
  }

  private static isAutoResolvable(type: DeliveryException['type']): boolean {
    return ['customer_unavailable', 'access_denied'].includes(type);
  }

  private static getSuggestedActions(type: DeliveryException['type']): string[] {
    const actionMap = {
      customer_unavailable: [
        'Contact customer via phone',
        'Send SMS notification',
        'Reschedule for next available slot',
        'Leave delivery notice'
      ],
      access_denied: [
        'Contact building management',
        'Verify access permissions',
        'Coordinate with customer for escort',
        'Schedule alternative pickup point'
      ],
      bin_issue: [
        'Inspect bin for damage',
        'Document issue with photos',
        'Contact maintenance team',
        'Arrange replacement bin'
      ],
      vehicle_breakdown: [
        'Contact emergency support',
        'Arrange backup vehicle',
        'Notify affected customers',
        'Update delivery schedules'
      ],
      weather: [
        'Assess safety conditions',
        'Delay non-critical deliveries',
        'Update customer notifications',
        'Monitor weather updates'
      ],
      other: [
        'Document the issue',
        'Contact supervisor',
        'Assess impact on schedule',
        'Implement contingency plan'
      ]
    };

    return actionMap[type] || [];
  }

  static generateResolutionPlan(exception: DeliveryException): ResolutionAction[] {
    const actions: ResolutionAction[] = [];
    const baseDeadline = new Date();
    baseDeadline.setHours(baseDeadline.getHours() + 2);

    exception.suggestedActions.forEach((action, index) => {
      const deadline = new Date(baseDeadline);
      deadline.setMinutes(deadline.getMinutes() + (index * 30));

      actions.push({
        id: `ACT-${exception.id}-${index + 1}`,
        exceptionId: exception.id,
        action,
        assignedTo: exception.severity === 'critical' ? 'supervisor' : 'driver',
        deadline,
        status: 'pending'
      });
    });

    return actions;
  }

  static escalateException(exception: DeliveryException): DeliveryException {
    const escalatedSeverity = {
      low: 'medium',
      medium: 'high',
      high: 'critical',
      critical: 'critical'
    } as const;

    return {
      ...exception,
      severity: escalatedSeverity[exception.severity],
      suggestedActions: [
        'Immediate supervisor intervention required',
        'Customer service team notification',
        'Management escalation',
        ...exception.suggestedActions
      ]
    };
  }

  static getExceptionMetrics(exceptions: DeliveryException[]) {
    const total = exceptions.length;
    const bySeverity = exceptions.reduce((acc, ex) => {
      acc[ex.severity] = (acc[ex.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = exceptions.reduce((acc, ex) => {
      acc[ex.type] = (acc[ex.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resolution = {
      resolved: exceptions.filter(ex => ex.autoResolvable).length,
      pending: exceptions.filter(ex => !ex.autoResolvable).length,
      resolutionRate: total > 0 ? Math.round((exceptions.filter(ex => ex.autoResolvable).length / total) * 100) : 0
    };

    return {
      total,
      bySeverity,
      byType,
      resolution
    };
  }
}

export default ExceptionHandler;
