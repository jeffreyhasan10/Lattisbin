import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  CheckCircle,
  Receipt,
  Download,
  Send,
  Printer,
  DollarSign,
  Calendar,
  CreditCard,
  MessageSquare,
  Mail,
  FileText,
  Clock,
  User,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  customerEmail: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  currency: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

interface PaymentData {
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
  bankName: string;
  accountNumber: string;
  eWalletNumber: string;
}

const ReceiptConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  // Sample data - in a real app, this would come from location.state or API
  useEffect(() => {
    if (location.state) {
      setInvoice(location.state.invoiceData);
      setPaymentData(location.state.paymentData);
    } else {
      // Fallback sample data
      setInvoice({
        id: "INV001",
        invoiceNumber: "INV-2024-001",
        customerName: "ABC Construction Sdn Bhd",
        customerType: "Corporate",
        customerEmail: "billing@abcconstruction.com",
        totalAmount: 1961.0,
        paidAmount: 1961.0,
        balanceAmount: 0.0,
        currency: "MYR",
        dueDate: "2024-03-31",
        status: "paid",
      });
      setPaymentData({
        amount: "1961.00",
        paymentDate: "2024-03-25",
        paymentMethod: "bank_transfer",
        referenceNumber: "TXN20240325001",
        notes: "Payment received in full",
        bankName: "Maybank",
        accountNumber: "1234567890",
        eWalletNumber: "",
      });
    }
    
    // Generate receipt number
    const receiptNum = `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    setReceiptNumber(receiptNum);
  }, [location.state]);

  const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      cash: "Cash",
      bank_transfer: "Bank Transfer",
      online_banking: "Online Banking",
      cdm: "CDM",
      grabpay: "GrabPay",
      touchngo: "Touch 'n Go",
      boost: "Boost",
      fave: "Fave",
      bigpay: "BigPay",
    };
    return methods[method] || method;
  };

  const handleIssueReceipt = () => {
    setIsGeneratingReceipt(true);
    
    // Simulate receipt generation
    setTimeout(() => {
      setIsGeneratingReceipt(false);
      alert(`Receipt ${receiptNumber} has been generated successfully!`);
    }, 2000);
  };

  const handleDownloadReceipt = () => {
    alert(`Downloading receipt ${receiptNumber}...`);
  };

  const handleSendReceipt = () => {
    if (invoice?.customerEmail) {
      alert(`Receipt ${receiptNumber} has been sent to ${invoice.customerEmail}`);
    }
  };

  const handleSendWhatsApp = () => {
    const message = `Receipt ${receiptNumber} - Payment of ${invoice?.currency} ${paymentData?.amount} received for Invoice ${invoice?.invoiceNumber}`;
    alert(`Sending WhatsApp message: ${message}`);
  };

  const handleBackToInvoice = () => {
    navigate(`/admin/invoicing/details/${id}`);
  };

  const handleBackToList = () => {
    navigate("/admin/invoicing");
  };

  if (!invoice || !paymentData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment confirmation...</p>
        </div>
      </div>
    );
  }

  const isFullyPaid = parseFloat(paymentData.amount) >= invoice.balanceAmount;
  const newBalance = invoice.balanceAmount - parseFloat(paymentData.amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToInvoice}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoice
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Receipt Confirmation
            </h2>
            <p className="text-gray-600 mt-1">
              Payment recorded successfully for invoice {invoice.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Recorded Successfully!</h3>
              <p className="text-green-700">
                Payment of {invoice.currency} {paymentData.amount} has been recorded for invoice {invoice.invoiceNumber}.
                {isFullyPaid ? " The invoice is now fully paid." : ` Balance remaining: ${invoice.currency} ${newBalance.toFixed(2)}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receipt Number:</span>
                      <span className="font-medium">{receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Amount:</span>
                      <span className="font-medium text-green-600">{invoice.currency} {paymentData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">{paymentData.paymentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{getPaymentMethodLabel(paymentData.paymentMethod)}</span>
                    </div>
                    {paymentData.referenceNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium">{paymentData.referenceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Invoice Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-medium">{invoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{invoice.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{invoice.currency} {invoice.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Paid:</span>
                      <span className="font-medium">{invoice.currency} {invoice.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">New Balance:</span>
                        <span className={`font-semibold ${newBalance <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {invoice.currency} {newBalance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {paymentData.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">Payment Notes</h4>
                  <p className="text-sm text-gray-700">{paymentData.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receipt Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={handleIssueReceipt}
                  disabled={isGeneratingReceipt}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isGeneratingReceipt ? "Generating..." : "Issue Receipt"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendReceipt}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendWhatsApp}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Payment Recorded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Invoice Updated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isGeneratingReceipt ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-sm">Receipt Generated</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-medium">{getPaymentMethodLabel(paymentData.paymentMethod)}</p>
                </div>
                {paymentData.bankName && (
                  <div>
                    <p className="text-sm text-gray-600">Bank</p>
                    <p className="font-medium">{paymentData.bankName}</p>
                  </div>
                )}
                {paymentData.accountNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium">{paymentData.accountNumber}</p>
                  </div>
                )}
                {paymentData.eWalletNumber && (
                  <div>
                    <p className="text-sm text-gray-600">E-wallet Number</p>
                    <p className="font-medium">{paymentData.eWalletNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Reference</p>
                  <p className="font-medium">{paymentData.referenceNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={isFullyPaid ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                    {isFullyPaid ? "Fully Paid" : "Partially Paid"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-medium">{invoice.currency} {invoice.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">{invoice.currency} {(parseFloat(paymentData.amount) + invoice.paidAmount).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Balance:</span>
                    <span className={`font-semibold ${newBalance <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {invoice.currency} {newBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={handleBackToInvoice}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  View Updated Invoice
                </Button>
                <Button
                  onClick={handleBackToList}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Back to Invoice List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceiptConfirmation;
