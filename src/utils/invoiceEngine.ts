
interface InvoiceTemplate {
  id: string;
  name: string;
  type: 'corporate' | 'individual' | 'government';
  fields: string[];
  branding: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
    footer: string;
  };
}

interface TaxRule {
  region: string;
  type: 'GST' | 'VAT' | 'SST';
  rate: number;
  applicableCategories: string[];
}

interface PaymentReminder {
  id: string;
  invoiceId: string;
  reminderLevel: 1 | 2 | 3 | 4;
  scheduledDate: Date;
  status: 'pending' | 'sent' | 'failed';
  escalated: boolean;
}

class InvoiceEngine {
  private static templates: InvoiceTemplate[] = [
    {
      id: 'corporate',
      name: 'Corporate Template',
      type: 'corporate',
      fields: ['company_name', 'registration_number', 'tax_id', 'purchase_order'],
      branding: {
        logo: '/assets/corporate-logo.png',
        colors: { primary: '#1f2937', secondary: '#3b82f6' },
        footer: 'Thank you for your business partnership'
      }
    },
    {
      id: 'individual',
      name: 'Individual Template',
      type: 'individual',
      fields: ['full_name', 'ic_number', 'phone', 'email'],
      branding: {
        logo: '/assets/individual-logo.png',
        colors: { primary: '#059669', secondary: '#10b981' },
        footer: 'We appreciate your trust in our services'
      }
    },
    {
      id: 'government',
      name: 'Government Template',
      type: 'government',
      fields: ['department', 'officer_name', 'reference_number', 'budget_code'],
      branding: {
        logo: '/assets/government-logo.png',
        colors: { primary: '#7c2d12', secondary: '#ea580c' },
        footer: 'Serving the community with excellence'
      }
    }
  ];

  private static taxRules: TaxRule[] = [
    { region: 'MY', type: 'GST', rate: 0.06, applicableCategories: ['waste_collection', 'recycling'] },
    { region: 'SG', type: 'GST', rate: 0.07, applicableCategories: ['waste_collection', 'recycling'] },
    { region: 'UK', type: 'VAT', rate: 0.20, applicableCategories: ['waste_collection'] }
  ];

  private static exchangeRates: { [key: string]: number } = {
    'USD': 4.73,
    'SGD': 3.52,
    'EUR': 5.15,
    'GBP': 5.98,
    'MYR': 1.00
  };

  static generateInvoiceFromOrders(orderIds: string[], template: string, currency: string = 'MYR'): any {
    const selectedTemplate = this.templates.find(t => t.id === template);
    if (!selectedTemplate) throw new Error('Template not found');

    // Mock order data - in real implementation, fetch from database
    const orders = orderIds.map(id => ({
      id,
      customerName: 'Sample Customer',
      amount: 150.00,
      description: 'Waste Collection Service',
      category: 'waste_collection',
      date: new Date().toISOString().split('T')[0]
    }));

    const subtotal = orders.reduce((sum, order) => sum + order.amount, 0);
    const taxAmount = this.calculateTax(subtotal, 'waste_collection', 'MY');
    const totalAmount = subtotal + taxAmount;

    // Convert to target currency
    const convertedAmounts = this.convertCurrency({
      subtotal,
      taxAmount,
      totalAmount
    }, 'MYR', currency);

    return {
      invoiceNumber: this.generateInvoiceNumber(),
      template: selectedTemplate,
      currency,
      orders,
      amounts: convertedAmounts,
      generatedAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      taxDetails: {
        type: 'GST',
        rate: 0.06,
        amount: convertedAmounts.taxAmount
      }
    };
  }

  static calculateTax(amount: number, category: string, region: string): number {
    const rule = this.taxRules.find(r => r.region === region && r.applicableCategories.includes(category));
    return rule ? amount * rule.rate : 0;
  }

  static convertCurrency(amounts: any, fromCurrency: string, toCurrency: string): any {
    if (fromCurrency === toCurrency) return amounts;
    
    const fromRate = this.exchangeRates[fromCurrency] || 1;
    const toRate = this.exchangeRates[toCurrency] || 1;
    const conversionRate = toRate / fromRate;

    return {
      subtotal: amounts.subtotal * conversionRate,
      taxAmount: amounts.taxAmount * conversionRate,
      totalAmount: amounts.totalAmount * conversionRate,
      exchangeRate: conversionRate,
      originalCurrency: fromCurrency
    };
  }

  static generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return `INV-${year}${month}-${sequence}`;
  }

  static generatePDF(invoice: any): Promise<Blob> {
    // Mock PDF generation - in real implementation, use jsPDF or similar
    return new Promise((resolve) => {
      setTimeout(() => {
        const pdfContent = `
          Invoice: ${invoice.invoiceNumber}
          Customer: ${invoice.customerName}
          Amount: ${invoice.currency} ${invoice.amounts.totalAmount.toFixed(2)}
          Generated: ${invoice.generatedAt.toLocaleDateString()}
        `;
        
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        resolve(blob);
      }, 1000);
    });
  }

  static schedulePaymentReminders(invoiceId: string, dueDate: Date): PaymentReminder[] {
    const reminders: PaymentReminder[] = [];
    const dueDateMs = dueDate.getTime();
    
    // First reminder: 7 days before due date
    reminders.push({
      id: `${invoiceId}-R1`,
      invoiceId,
      reminderLevel: 1,
      scheduledDate: new Date(dueDateMs - 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      escalated: false
    });

    // Second reminder: 1 day before due date
    reminders.push({
      id: `${invoiceId}-R2`,
      invoiceId,
      reminderLevel: 2,
      scheduledDate: new Date(dueDateMs - 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
      escalated: false
    });

    // Third reminder: 7 days after due date (escalated)
    reminders.push({
      id: `${invoiceId}-R3`,
      invoiceId,
      reminderLevel: 3,
      scheduledDate: new Date(dueDateMs + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      escalated: true
    });

    // Final reminder: 30 days after due date (legal action warning)
    reminders.push({
      id: `${invoiceId}-R4`,
      invoiceId,
      reminderLevel: 4,
      scheduledDate: new Date(dueDateMs + 30 * 24 * 60 * 60 * 1000),
      status: 'pending',
      escalated: true
    });

    return reminders;
  }

  static createCreditNote(invoiceId: string, reason: string, amount: number): any {
    return {
      id: `CN-${Date.now()}`,
      invoiceId,
      creditNoteNumber: this.generateCreditNoteNumber(),
      reason,
      amount,
      status: 'pending_approval',
      createdAt: new Date(),
      approvedBy: null,
      approvedAt: null
    };
  }

  static createDebitNote(invoiceId: string, reason: string, amount: number): any {
    return {
      id: `DN-${Date.now()}`,
      invoiceId,
      debitNoteNumber: this.generateDebitNoteNumber(),
      reason,
      amount,
      status: 'pending_approval',
      createdAt: new Date(),
      approvedBy: null,
      approvedAt: null
    };
  }

  private static generateCreditNoteNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `CN-${year}-${sequence}`;
  }

  private static generateDebitNoteNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `DN-${year}-${sequence}`;
  }

  static getTemplates(): InvoiceTemplate[] {
    return this.templates;
  }

  static updateExchangeRates(rates: { [key: string]: number }): void {
    this.exchangeRates = { ...this.exchangeRates, ...rates };
  }

  static getExchangeRates(): { [key: string]: number } {
    return this.exchangeRates;
  }
}

export default InvoiceEngine;
