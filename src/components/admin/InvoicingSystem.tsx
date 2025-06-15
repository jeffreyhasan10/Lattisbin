
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Receipt, Plus, Download, Send, Eye, DollarSign, Calendar, CheckCircle, Clock, AlertCircle, FileText, CreditCard, RefreshCw, Bell, Settings, Zap } from "lucide-react";
import InvoiceEngine from "@/utils/invoiceEngine";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  orderIds: string[];
  issueDate: string;
  dueDate: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  currency: string;
  paymentTerms: string;
  template: string;
  emailSent: boolean;
  readReceipt: boolean;
  exchangeRate?: number;
  originalCurrency?: string;
  remindersSent: number;
  lastReminderDate?: string;
  creditNotes: any[];
  debitNotes: any[];
}

const InvoicingSystem: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV001",
      invoiceNumber: "INV-2024-001",
      customerName: "ABC Construction Sdn Bhd",
      customerType: "Corporate",
      orderIds: ["DO001", "DO002"],
      issueDate: "2024-03-01",
      dueDate: "2024-03-31",
      subtotal: 1850.00,
      gstAmount: 111.00,
      totalAmount: 1961.00,
      paidAmount: 1961.00,
      balanceAmount: 0.00,
      status: "paid",
      currency: "MYR",
      paymentTerms: "30 days",
      template: "corporate",
      emailSent: true,
      readReceipt: true,
      remindersSent: 0,
      creditNotes: [],
      debitNotes: []
    },
    {
      id: "INV002",
      invoiceNumber: "INV-2024-002",
      customerName: "Sarah Lim",
      customerType: "Individual",
      orderIds: ["DO003"],
      issueDate: "2024-03-05",
      dueDate: "2024-03-20",
      subtotal: 320.00,
      gstAmount: 19.20,
      totalAmount: 339.20,
      paidAmount: 0.00,
      balanceAmount: 339.20,
      status: "overdue",
      currency: "MYR",
      paymentTerms: "15 days",
      template: "individual",
      emailSent: true,
      readReceipt: false,
      remindersSent: 2,
      lastReminderDate: "2024-03-18",
      creditNotes: [],
      debitNotes: []
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [showDebitNoteModal, setShowDebitNoteModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [autoRemindersEnabled, setAutoRemindersEnabled] = useState(true);

  // Load exchange rates on component mount
  useEffect(() => {
    const rates = InvoiceEngine.getExchangeRates();
    setExchangeRates(rates);
  }, []);

  // Simulate real-time exchange rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedRates = { ...exchangeRates };
      Object.keys(updatedRates).forEach(currency => {
        if (currency !== 'MYR') {
          updatedRates[currency] *= (0.98 + Math.random() * 0.04); // ±2% fluctuation
        }
      });
      setExchangeRates(updatedRates);
      InvoiceEngine.updateExchangeRates(updatedRates);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "cancelled":
        return <Badge className="bg-orange-100 text-orange-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleAutoGenerate = (selectedOrders: string[], template: string, currency: string) => {
    try {
      const generatedInvoice = InvoiceEngine.generateInvoiceFromOrders(selectedOrders, template, currency);
      
      const newInvoice: Invoice = {
        id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
        invoiceNumber: generatedInvoice.invoiceNumber,
        customerName: "Generated Customer",
        customerType: template === 'corporate' ? 'Corporate' : template === 'government' ? 'Government' : 'Individual',
        orderIds: selectedOrders,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: generatedInvoice.dueDate.toISOString().split('T')[0],
        subtotal: generatedInvoice.amounts.subtotal,
        gstAmount: generatedInvoice.amounts.taxAmount,
        totalAmount: generatedInvoice.amounts.totalAmount,
        paidAmount: 0,
        balanceAmount: generatedInvoice.amounts.totalAmount,
        status: "draft",
        currency: currency,
        paymentTerms: "30 days",
        template: template,
        emailSent: false,
        readReceipt: false,
        exchangeRate: generatedInvoice.amounts.exchangeRate,
        originalCurrency: generatedInvoice.amounts.originalCurrency,
        remindersSent: 0,
        creditNotes: [],
        debitNotes: []
      };

      setInvoices([...invoices, newInvoice]);
      setShowAutoGenerateModal(false);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      const pdfBlob = await InvoiceEngine.generatePDF(invoice);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSendReminder = (invoice: Invoice) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoice.id 
        ? { 
            ...inv, 
            remindersSent: inv.remindersSent + 1,
            lastReminderDate: new Date().toISOString().split('T')[0]
          }
        : inv
    );
    setInvoices(updatedInvoices);
    setShowReminderModal(false);
  };

  const handleCreateCreditNote = (invoiceId: string, reason: string, amount: number) => {
    const creditNote = InvoiceEngine.createCreditNote(invoiceId, reason, amount);
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, creditNotes: [...inv.creditNotes, creditNote] }
        : inv
    );
    setInvoices(updatedInvoices);
    setShowCreditNoteModal(false);
  };

  const handleCreateDebitNote = (invoiceId: string, reason: string, amount: number) => {
    const debitNote = InvoiceEngine.createDebitNote(invoiceId, reason, amount);
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, debitNotes: [...inv.debitNotes, debitNote] }
        : inv
    );
    setInvoices(updatedInvoices);
    setShowDebitNoteModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-blue-600" />
            Phase 9: Comprehensive Invoicing System
          </h2>
          <p className="text-gray-600 mt-1">Advanced auto-generation, multi-currency, tax compliance, and workflow automation</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAutoGenerateModal} onOpenChange={setShowAutoGenerateModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Auto-Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Auto-Generate Invoice from Delivery Orders</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Delivery Orders</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["DO001", "DO002", "DO003", "DO004"].map(orderId => (
                      <div key={orderId} className="flex items-center space-x-2">
                        <input type="checkbox" id={orderId} />
                        <label htmlFor={orderId}>{orderId} - Waste Collection</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAutoGenerateModal(false)}>Cancel</Button>
                  <Button onClick={() => handleAutoGenerate(["DO001", "DO002"], "corporate", "MYR")}>
                    Generate Invoice
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Manual Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="template">Template & Tax</TabsTrigger>
                  <TabsTrigger value="currency">Currency & Terms</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Customer</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer1">ABC Construction Sdn Bhd</SelectItem>
                          <SelectItem value="customer2">Sarah Lim</SelectItem>
                          <SelectItem value="customer3">Ministry of Environment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="template" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Template</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Branding</SelectItem>
                          <SelectItem value="individual">Individual Service</SelectItem>
                          <SelectItem value="government">Government Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Region</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MY">Malaysia (GST 6%)</SelectItem>
                          <SelectItem value="SG">Singapore (GST 7%)</SelectItem>
                          <SelectItem value="UK">United Kingdom (VAT 20%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="currency" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(exchangeRates).map(currency => (
                            <SelectItem key={currency} value={currency}>
                              {currency} {currency !== 'MYR' && `(${exchangeRates[currency]?.toFixed(4)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Auto-Reminders</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch checked={autoRemindersEnabled} onCheckedChange={setAutoRemindersEnabled} />
                        <span className="text-sm">Enable</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={() => setShowCreateModal(false)}>Create Invoice</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">RM {invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold">{invoices.filter(inv => inv.status === 'paid').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold">RM {invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{invoices.filter(inv => inv.status === 'overdue').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Multi-Currency</p>
                <p className="text-2xl font-bold">{new Set(invoices.map(inv => inv.currency)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Invoice List */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Receipt className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {invoice.invoiceNumber}
                      <Badge variant="outline" className="text-xs">
                        {invoice.template}
                      </Badge>
                      {invoice.exchangeRate && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Rate: {invoice.exchangeRate.toFixed(4)}
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{invoice.customerName} ({invoice.customerType})</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(invoice.status)}
                  {invoice.emailSent && (
                    <Badge variant="outline" className="text-xs">
                      <Send className="h-3 w-3 mr-1" />
                      Sent
                    </Badge>
                  )}
                  {invoice.readReceipt && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Read
                    </Badge>
                  )}
                  {invoice.remindersSent > 0 && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      {invoice.remindersSent}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount Details</p>
                  <div className="space-y-1">
                    <p className="font-medium">Subtotal: {invoice.currency} {invoice.subtotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Tax: {invoice.currency} {invoice.gstAmount.toFixed(2)}</p>
                    <p className="font-bold text-lg text-green-600">Total: {invoice.currency} {invoice.totalAmount.toFixed(2)}</p>
                    {invoice.originalCurrency && invoice.originalCurrency !== invoice.currency && (
                      <p className="text-xs text-gray-500">Original: {invoice.originalCurrency}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <div className="space-y-1">
                    <p className="font-medium">Paid: {invoice.currency} {invoice.paidAmount.toFixed(2)}</p>
                    <p className="font-medium text-red-600">Balance: {invoice.currency} {invoice.balanceAmount.toFixed(2)}</p>
                    {invoice.balanceAmount > 0 && (
                      <p className="text-xs text-orange-600">Payment pending</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Dates & Terms</p>
                  <div className="space-y-1">
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Issue: {invoice.issueDate}
                    </p>
                    <p className="font-medium">Due: {invoice.dueDate}</p>
                    <p className="text-sm text-gray-600">Terms: {invoice.paymentTerms}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Related Orders</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {invoice.orderIds.map((orderId) => (
                      <Badge key={orderId} variant="outline" className="text-xs">
                        {orderId}
                      </Badge>
                    ))}
                  </div>
                  {invoice.creditNotes.length > 0 && (
                    <p className="text-xs text-blue-600">{invoice.creditNotes.length} Credit Notes</p>
                  )}
                  {invoice.debitNotes.length > 0 && (
                    <p className="text-xs text-purple-600">{invoice.debitNotes.length} Debit Notes</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Automation Status</p>
                  <div className="space-y-1">
                    {invoice.remindersSent > 0 && (
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        {invoice.remindersSent} reminders sent
                      </p>
                    )}
                    {invoice.lastReminderDate && (
                      <p className="text-xs text-gray-500">Last: {invoice.lastReminderDate}</p>
                    )}
                    {autoRemindersEnabled && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Auto-reminders active
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(invoice)}>
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowReminderModal(true);
                  }}
                  disabled={invoice.status === 'paid'}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Remind
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowCreditNoteModal(true);
                  }}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Credit Note
                </Button>
                <Button size="sm">
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Reminder Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reminder Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gentle">Gentle Reminder</SelectItem>
                  <SelectItem value="firm">Firm Reminder</SelectItem>
                  <SelectItem value="final">Final Notice</SelectItem>
                  <SelectItem value="legal">Legal Action Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Custom Message</Label>
              <Textarea placeholder="Add custom message (optional)..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReminderModal(false)}>Cancel</Button>
              <Button onClick={() => selectedInvoice && handleSendReminder(selectedInvoice)}>
                Send Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Note Modal */}
      <Dialog open={showCreditNoteModal} onOpenChange={setShowCreditNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Credit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service_not_rendered">Service Not Rendered</SelectItem>
                  <SelectItem value="billing_error">Billing Error</SelectItem>
                  <SelectItem value="damaged_goods">Damaged Goods</SelectItem>
                  <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Credit Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Detailed description of the credit..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreditNoteModal(false)}>Cancel</Button>
              <Button onClick={() => selectedInvoice && handleCreateCreditNote(selectedInvoice.id, "service_not_rendered", 100)}>
                Create Credit Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Debit Note Modal */}
      <Dialog open={showDebitNoteModal} onOpenChange={setShowDebitNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Debit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="additional_charges">Additional Charges</SelectItem>
                  <SelectItem value="penalty_fee">Penalty Fee</SelectItem>
                  <SelectItem value="interest_charges">Interest Charges</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Debit Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Detailed description of the debit..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDebitNoteModal(false)}>Cancel</Button>
              <Button onClick={() => selectedInvoice && handleCreateDebitNote(selectedInvoice.id, "additional_charges", 50)}>
                Create Debit Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicingSystem;
