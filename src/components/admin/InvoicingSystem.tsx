
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Receipt, Plus, Download, Send, Eye, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

const InvoicingSystem: React.FC = () => {
  const [invoices, setInvoices] = useState([
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
      readReceipt: true
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
      readReceipt: false
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-blue-600" />
            Comprehensive Invoicing System
          </h2>
          <p className="text-gray-600 mt-1">Auto-generation, PDF creation, and multi-currency support</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer1">ABC Construction Sdn Bhd</SelectItem>
                    <SelectItem value="customer2">Sarah Lim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={() => setShowCreateModal(false)}>Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Paid</p>
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
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {invoice.invoiceNumber}
                      <Badge variant="outline" className="text-xs">
                        {invoice.template}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{invoice.customerName}</p>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount Details</p>
                  <div className="space-y-1">
                    <p className="font-medium">Subtotal: {invoice.currency} {invoice.subtotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">GST: {invoice.currency} {invoice.gstAmount.toFixed(2)}</p>
                    <p className="font-bold text-lg text-green-600">Total: {invoice.currency} {invoice.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <div className="space-y-1">
                    <p className="font-medium">Paid: {invoice.currency} {invoice.paidAmount.toFixed(2)}</p>
                    <p className="font-medium text-red-600">Balance: {invoice.currency} {invoice.balanceAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dates</p>
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
                  <div className="flex flex-wrap gap-1">
                    {invoice.orderIds.map((orderId) => (
                      <Badge key={orderId} variant="outline" className="text-xs">
                        {orderId}
                      </Badge>
                    ))}
                  </div>
                  {invoice.readReceipt && (
                    <p className="text-xs text-green-600 mt-1">Email read by customer</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="h-3 w-3 mr-1" />
                  Send Email
                </Button>
                <Button size="sm">
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvoicingSystem;
