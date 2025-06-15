
interface ExpenseCategory {
  id: string;
  name: string;
  subcategories: string[];
  budgetLimit: number;
  approvalRequired: boolean;
  ocrEnabled: boolean;
}

interface Receipt {
  id: string;
  filename: string;
  extractedData: {
    vendor: string;
    amount: number;
    date: string;
    taxAmount?: number;
    items?: string[];
    confidence: number;
  };
  verified: boolean;
}

interface ApprovalWorkflow {
  expenseId: string;
  currentStep: number;
  steps: ApprovalStep[];
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalStep {
  level: number;
  approverRole: string;
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ExpenseReport {
  id: string;
  period: string;
  totalAmount: number;
  categoryBreakdown: { [category: string]: number };
  budgetVariance: { [category: string]: number };
  recommendations: string[];
}

class ExpenseEngine {
  private static categories: ExpenseCategory[] = [
    {
      id: 'VEHICLE',
      name: 'Vehicle & Fleet',
      subcategories: ['Fuel', 'Maintenance', 'Insurance', 'Registration'],
      budgetLimit: 25000,
      approvalRequired: false,
      ocrEnabled: true
    },
    {
      id: 'PERSONNEL',
      name: 'Personnel Costs',
      subcategories: ['Salaries', 'Benefits', 'Training', 'Overtime'],
      budgetLimit: 50000,
      approvalRequired: true,
      ocrEnabled: false
    },
    {
      id: 'EQUIPMENT',
      name: 'Equipment & Supplies',
      subcategories: ['Bins', 'Tools', 'Safety Equipment', 'Office Supplies'],
      budgetLimit: 15000,
      approvalRequired: true,
      ocrEnabled: true
    },
    {
      id: 'OPERATIONS',
      name: 'Operations',
      subcategories: ['Utilities', 'Rent', 'Communications', 'Marketing'],
      budgetLimit: 20000,
      approvalRequired: false,
      ocrEnabled: true
    }
  ];

  static processReceiptOCR(file: File): Promise<Receipt> {
    return new Promise((resolve) => {
      // Simulate OCR processing
      setTimeout(() => {
        const mockData = {
          id: `REC-${Date.now()}`,
          filename: file.name,
          extractedData: {
            vendor: this.generateRandomVendor(),
            amount: Math.floor(Math.random() * 1000) + 50,
            date: new Date().toISOString().split('T')[0],
            taxAmount: Math.floor(Math.random() * 100) + 10,
            items: ['Service Item 1', 'Service Item 2'],
            confidence: 0.85 + Math.random() * 0.14 // 85-99% confidence
          },
          verified: false
        };
        resolve(mockData);
      }, 2000);
    });
  }

  static generateRandomVendor(): string {
    const vendors = [
      'Petronas Station',
      'Shell Malaysia',
      'Industrial Supplies Sdn Bhd',
      'Fleet Maintenance Co',
      'Safety Equipment Store',
      'Office Depot Malaysia'
    ];
    return vendors[Math.floor(Math.random() * vendors.length)];
  }

  static createApprovalWorkflow(expenseAmount: number, categoryId: string): ApprovalWorkflow {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');

    const steps: ApprovalStep[] = [];

    // Determine approval levels based on amount and category
    if (category.approvalRequired || expenseAmount > 1000) {
      steps.push({
        level: 1,
        approverRole: 'Department Manager',
        status: 'pending'
      });
    }

    if (expenseAmount > 5000) {
      steps.push({
        level: 2,
        approverRole: 'Finance Manager',
        status: 'pending'
      });
    }

    if (expenseAmount > 15000) {
      steps.push({
        level: 3,
        approverRole: 'CEO',
        status: 'pending'
      });
    }

    return {
      expenseId: `EXP-${Date.now()}`,
      currentStep: 1,
      steps,
      status: 'pending'
    };
  }

  static processApproval(workflow: ApprovalWorkflow, approverRole: string, approved: boolean, comments?: string): ApprovalWorkflow {
    const currentStep = workflow.steps.find(s => s.level === workflow.currentStep);
    if (!currentStep || currentStep.approverRole !== approverRole) {
      throw new Error('Invalid approver for current step');
    }

    currentStep.status = approved ? 'approved' : 'rejected';
    currentStep.approvedBy = approverRole;
    currentStep.approvedAt = new Date();
    currentStep.comments = comments;

    if (!approved) {
      workflow.status = 'rejected';
    } else if (workflow.currentStep >= workflow.steps.length) {
      workflow.status = 'approved';
    } else {
      workflow.currentStep++;
    }

    return workflow;
  }

  static generateExpenseReport(expenses: any[], period: string): ExpenseReport {
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const categoryBreakdown: { [category: string]: number } = {};
    const budgetVariance: { [category: string]: number } = {};

    this.categories.forEach(category => {
      const categoryExpenses = expenses.filter(exp => exp.categoryId === category.id);
      const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      categoryBreakdown[category.name] = categoryTotal;
      budgetVariance[category.name] = category.budgetLimit - categoryTotal;
    });

    const recommendations = this.generateRecommendations(categoryBreakdown, budgetVariance);

    return {
      id: `RPT-${Date.now()}`,
      period,
      totalAmount,
      categoryBreakdown,
      budgetVariance,
      recommendations
    };
  }

  static generateRecommendations(breakdown: { [category: string]: number }, variance: { [category: string]: number }): string[] {
    const recommendations: string[] = [];

    Object.entries(variance).forEach(([category, variance]) => {
      if (variance < 0) {
        recommendations.push(`${category}: Over budget by RM ${Math.abs(variance).toLocaleString()}. Review spending and implement cost controls.`);
      } else if (variance < breakdown[category] * 0.1) {
        recommendations.push(`${category}: Near budget limit. Monitor closely to avoid overspending.`);
      }
    });

    // Add general recommendations
    const totalSpent = Object.values(breakdown).reduce((sum, amount) => sum + amount, 0);
    const totalBudget = this.categories.reduce((sum, cat) => sum + cat.budgetLimit, 0);

    if (totalSpent > totalBudget * 0.9) {
      recommendations.push('Overall spending is approaching budget limits. Consider cost optimization initiatives.');
    }

    return recommendations;
  }

  static getCategories(): ExpenseCategory[] {
    return this.categories;
  }

  static validateExpense(amount: number, categoryId: string, receipts: Receipt[]): {
    valid: boolean;
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];

    const category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      issues.push('Invalid expense category');
      return { valid: false, issues, warnings };
    }

    // Check if receipts are required and provided
    if (amount > 100 && receipts.length === 0) {
      issues.push('Receipts required for expenses over RM 100');
    }

    // Check OCR confidence for receipts
    const lowConfidenceReceipts = receipts.filter(r => r.extractedData.confidence < 0.8);
    if (lowConfidenceReceipts.length > 0) {
      warnings.push(`${lowConfidenceReceipts.length} receipt(s) have low OCR confidence and may need manual verification`);
    }

    // Check amount vs receipt total
    const receiptTotal = receipts.reduce((sum, r) => sum + r.extractedData.amount, 0);
    if (Math.abs(amount - receiptTotal) > 10) {
      warnings.push('Expense amount does not match receipt total');
    }

    return {
      valid: issues.length === 0,
      issues,
      warnings
    };
  }
}

export default ExpenseEngine;
