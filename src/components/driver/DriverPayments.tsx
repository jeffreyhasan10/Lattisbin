
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ArrowLeft, DollarSign, Camera, CheckCircle, Upload, CreditCard, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const DriverPayments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingPaymentData = location.state;

  const [paymentData, setPaymentData] = useState({
    orderId: incomingPaymentData?.orderId || "",
    paymentType: "",
    amountReceived: incomingPaymentData?.amount?.toString() || "",
    customerName: incomingPaymentData?.customerName || "",
    reference: "",
    notes: ""
  });

  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const paymentTypes = [
    { value: "cash", label: "Cash", icon: "💵" },
    { value: "online-transfer", label: "Online Transfer", icon: "📱" },
    { value: "cheque", label: "Cheque", icon: "📋" },
    { value: "cdm", label: "CDM (Cash Deposit Machine)", icon: "🏧" },
    { value: "terms", label: "Terms (Credit)", icon: "📝" }
  ];

  const [recentPayments, setRecentPayments] = useState([
    {
      id: "PAY001",
      orderId: "JOB003",
      customerName: "Green Valley Resort",
      amount: 450.00,
      paymentType: "Cash",
      timestamp: "2024-01-15 10:20",
      status: "completed"
    },
    {
      id: "PAY002", 
      orderId: "JOB004",
      customerName: "Sunshine Apartments",
      amount: 280.00,
      paymentType: "Cheque",
      timestamp: "2024-01-15 11:45",
      status: "completed"
    },
    {
      id: "PAY003",
      orderId: "JOB005",
      customerName: "ABC Construction",
      amount: 350.00,
      paymentType: "Online Transfer",
      timestamp: "2024-01-15 09:20",
      status: "completed"
    }
  ]);

  // Auto-populate form if coming from dashboard
  useEffect(() => {
    if (incomingPaymentData) {
      setPaymentData(prev => ({
        ...prev,
        orderId: incomingPaymentData.orderId || "",
        amountReceived: incomingPaymentData.amount?.toString() || "",
        customerName: incomingPaymentData.customerName || "",
        paymentType: "cash" // Default to cash
      }));
      toast.info("Payment form pre-filled from completed order");
    }
  }, [incomingPaymentData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.paymentType || !paymentData.amountReceived) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create new payment record
    const newPayment = {
      id: `PAY${String(recentPayments.length + 1).padStart(3, '0')}`,
      orderId: paymentData.orderId,
      customerName: paymentData.customerName,
      amount: parseFloat(paymentData.amountReceived),
      paymentType: paymentTypes.find(t => t.value === paymentData.paymentType)?.label || paymentData.paymentType,
      timestamp: new Date().toLocaleString(),
      status: "completed"
    };

    setRecentPayments(prev => [newPayment, ...prev]);
    toast.success(`Payment of RM${paymentData.amountReceived} recorded successfully!`);
    
    // Reset form
    setPaymentData({
      orderId: "",
      paymentType: "",
      amountReceived: "",
      customerName: "",
      reference: "",
      notes: ""
    });
    setPaymentProof(null);

    // Navigate back to dashboard after successful payment recording
    setTimeout(() => {
      navigate('/driver/dashboard');
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      toast.success("Payment proof uploaded");
    }
  };

  const totalCollected = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Breadcrumbs */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  Payment Collection
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/driver/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Show pre-fill notification */}
      {incomingPaymentData && (
        <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Payment Ready for Collection</p>
                <p className="text-sm text-green-700">
                  Order #{incomingPaymentData.orderId} completed - RM{incomingPaymentData.amount} from {incomingPaymentData.customerName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
                Payment Collection
              </h1>
              <p className="text-green-100">Record and track customer payments</p>
            </div>
            <div className="text-center">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-bold">RM{totalCollected.toFixed(2)}</p>
                <p className="text-sm text-green-100">Today's Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
                <CreditCard className="h-5 w-5" />
                Record New Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId" className="text-sm font-medium text-gray-700">Order ID *</Label>
                    <Input
                      id="orderId"
                      value={paymentData.orderId}
                      onChange={(e) => setPaymentData(prev => ({...prev, orderId: e.target.value}))}
                      placeholder="e.g., JOB001"
                      className="border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={paymentData.customerName}
                      onChange={(e) => setPaymentData(prev => ({...prev, customerName: e.target.value}))}
                      placeholder="Customer name"
                      className="border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Payment Type *</Label>
                  <Select 
                    value={paymentData.paymentType} 
                    onValueChange={(value) => setPaymentData(prev => ({...prev, paymentType: value}))}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount Received (RM) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={paymentData.amountReceived}
                      onChange={(e) => setPaymentData(prev => ({...prev, amountReceived: e.target.value}))}
                      placeholder="0.00"
                      className="pl-10 border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference" className="text-sm font-medium text-gray-700">Reference Number</Label>
                  <Input
                    id="reference"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData(prev => ({...prev, reference: e.target.value}))}
                    placeholder="Transaction/Cheque number (optional)"
                    className="border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                  <Input
                    id="notes"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Additional notes (optional)"
                    className="border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                {/* Payment Proof Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Payment Proof</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="payment-proof"
                    />
                    <label htmlFor="payment-proof" className="cursor-pointer">
                      {paymentProof ? (
                        <div className="text-emerald-600">
                          <CheckCircle className="h-12 w-12 mx-auto mb-3" />
                          <p className="font-medium">{paymentProof.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Camera className="h-12 w-12 mx-auto mb-3" />
                          <p className="font-medium">Upload Payment Proof</p>
                          <p className="text-sm mt-1">Click to take photo or select file</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Record Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                  <DollarSign className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">RM{totalCollected.toFixed(2)}</p>
                  <p className="text-sm text-emerald-700 font-medium">Total Collected</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{recentPayments.length}</p>
                  <p className="text-sm text-blue-700 font-medium">Payments Recorded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{payment.customerName}</p>
                      <p className="text-sm text-gray-600">#{payment.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-lg">RM{payment.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                        {payment.paymentType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{payment.timestamp}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
              
              {recentPayments.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent payments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverPayments;
