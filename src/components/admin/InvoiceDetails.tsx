import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Receipt,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
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
  serviceDetails: string;
  notes: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: "completed" | "pending" | "failed";
}

const InvoiceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Sample invoice data - in a real app, this would be fetched based on the ID
  const [invoice] = useState<Invoice>({
    id: "INV001",
    invoiceNumber: "INV-2024-001",
    customerName: "ABC Construction Sdn Bhd",
    customerType: "Corporate",
    customerEmail: "billing@abcconstruction.com",
    customerPhone: "+60 3-1234 5678",
    customerAddress: "123 Construction Site, Kuala Lumpur, Malaysia",
    orderIds: ["DO001", "DO002"],
    issueDate: "2024-03-01",
    dueDate: "2024-03-31",
    subtotal: 1850.0,
    gstAmount: 111.0,
    totalAmount: 1961.0,
    paidAmount: 1961.0,
    balanceAmount: 0.0,
    status: "paid",
    currency: "MYR",
    paymentTerms: "30 days",
    template: "corporate",
    emailSent: true,
    readReceipt: true,
    remindersSent: 0,
    creditNotes: [],
    debitNotes: [],
    serviceDetails: "Waste collection services for construction site and office building. Includes scheduled pickups and proper disposal of construction debris.",
    notes: "Payment received in full. Thank you for your business.",
  });

  const [paymentHistory] = useState<PaymentRecord[]>([
    {
      id: "PAY001",
      amount: 1961.0,
      date: "2024-03-25",
      method: "Bank Transfer",
      reference: "TXN20240325001",
      status: "completed",
    },
  ]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "sent":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleBackToList = () => {
    navigate("/admin/invoicing");
  };

  const handleRecordPayment = () => {
    navigate(`/admin/invoicing/payment/${invoice.id}`);
  };

  const handleSendInvoice = () => {
    // Simulate sending invoice
    alert(`Invoice ${invoice.invoiceNumber} has been sent to ${invoice.customerEmail}`);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading PDF for invoice ${invoice.invoiceNumber}`);
  };

  const handleSendWhatsApp = () => {
    const message = `Invoice ${invoice.invoiceNumber} - Amount: ${invoice.currency} ${invoice.totalAmount.toFixed(2)} - Due Date: ${invoice.dueDate}`;
    const whatsappUrl = `https://wa.me/${invoice.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoice List
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="h-6 w-6 text-blue-600" />
              Invoice Details
            </h2>
            <p className="text-gray-600 mt-1">
              Detailed breakdown of invoice {invoice.invoiceNumber} with payment tracking and status
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status !== "paid" && (
            <Button
              onClick={handleRecordPayment}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {invoice.invoiceNumber}
                      <Badge variant="outline" className="text-xs">
                        {invoice.template}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {invoice.customerName} ({invoice.customerType})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(invoice.status)}
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span>{invoice.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span>{invoice.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-gray-500 mt-0.5" />
                      <span>{invoice.customerAddress}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Invoice Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Date:</span>
                      <span>{invoice.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span>{invoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Terms:</span>
                      <span>{invoice.paymentTerms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span>{invoice.template}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Amount Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST):</span>
                  <span className="font-medium">{invoice.currency} {invoice.gstAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">{invoice.currency} {invoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span>Paid Amount:</span>
                    <span className="font-medium text-green-600">{invoice.currency} {invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance Amount:</span>
                    <span className={`font-medium ${invoice.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {invoice.currency} {invoice.balanceAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Related Orders</h4>
                  <div className="flex flex-wrap gap-2">
                    {invoice.orderIds.map((orderId) => (
                      <Badge key={orderId} variant="outline" className="text-xs">
                        {orderId}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Description</h4>
                  <p className="text-sm text-gray-700">{invoice.serviceDetails}</p>
                </div>
                {invoice.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-gray-700">{invoice.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">{payment.method}</p>
                          <p className="text-sm text-gray-600">Ref: {payment.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{invoice.currency} {payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSendInvoice}
                disabled={invoice.emailSent}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSendWhatsApp}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.print()}
              >
                <Eye className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Invoice Status */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Sent:</span>
                  <Badge className={invoice.emailSent ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {invoice.emailSent ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Read Receipt:</span>
                  <Badge className={invoice.readReceipt ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {invoice.readReceipt ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reminders Sent:</span>
                  <span className="text-sm font-medium">{invoice.remindersSent}</span>
                </div>
                {invoice.lastReminderDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Reminder:</span>
                    <span className="text-sm">{invoice.lastReminderDate}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-medium">{invoice.currency} {invoice.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">{invoice.currency} {invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Balance:</span>
                    <span className={`font-semibold ${invoice.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {invoice.currency} {invoice.balanceAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(invoice.paidAmount / invoice.totalAmount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round((invoice.paidAmount / invoice.totalAmount) * 100)}% Paid
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
