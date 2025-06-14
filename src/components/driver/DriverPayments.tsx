
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, Camera, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";

const DriverPayments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [paymentData, setPaymentData] = useState({
    orderId: orderId || "",
    paymentType: "",
    amountReceived: "",
    customerName: "",
    reference: "",
    notes: ""
  });

  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const paymentTypes = [
    { value: "cash", label: "Cash" },
    { value: "online-transfer", label: "Online Transfer" },
    { value: "cheque", label: "Cheque" },
    { value: "cdm", label: "CDM (Cash Deposit Machine)" },
    { value: "terms", label: "Terms (Credit)" }
  ];

  // Recent payments for display
  const [recentPayments] = useState([
    {
      id: "PAY001",
      orderId: "JOB001",
      customerName: "ABC Construction Sdn Bhd",
      amount: 350.00,
      paymentType: "Cash",
      timestamp: "2024-01-15 14:30",
      status: "completed"
    },
    {
      id: "PAY002", 
      orderId: "JOB003",
      customerName: "Sunshine Apartments",
      amount: 280.00,
      paymentType: "Cheque",
      timestamp: "2024-01-15 11:45",
      status: "completed"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.paymentType || !paymentData.amountReceived) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate payment recording
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      toast.success("Payment proof uploaded");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/driver/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Payment Collection</h1>
              <p className="text-sm text-gray-600">Record customer payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Record Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={paymentData.orderId}
                  onChange={(e) => setPaymentData(prev => ({...prev, orderId: e.target.value}))}
                  placeholder="e.g., JOB001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={paymentData.customerName}
                  onChange={(e) => setPaymentData(prev => ({...prev, customerName: e.target.value}))}
                  placeholder="Customer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select 
                  value={paymentData.paymentType} 
                  onValueChange={(value) => setPaymentData(prev => ({...prev, paymentType: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount Received (RM)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={paymentData.amountReceived}
                  onChange={(e) => setPaymentData(prev => ({...prev, amountReceived: e.target.value}))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number (Optional)</Label>
                <Input
                  id="reference"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData(prev => ({...prev, reference: e.target.value}))}
                  placeholder="Transaction/Cheque number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Additional notes"
                />
              </div>

              {/* Payment Proof Upload */}
              <div className="space-y-2">
                <Label>Payment Proof</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" className="cursor-pointer">
                    {paymentProof ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{paymentProof.name}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Tap to upload payment proof</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Record Payment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{payment.customerName}</p>
                    <p className="text-xs text-gray-600">{payment.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">RM{payment.amount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {payment.paymentType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{payment.timestamp}</span>
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">RM630.00</p>
                <p className="text-sm text-gray-600">Total Collected</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">2</p>
                <p className="text-sm text-gray-600">Payments Recorded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverPayments;
