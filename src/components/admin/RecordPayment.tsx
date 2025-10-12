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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Receipt,
  CheckCircle,
  X,
  AlertCircle,
  Clock,
  Smartphone,
  Banknote,
  CreditCard as CreditCardIcon,
  Smartphone as EWalletIcon,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  currency: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

interface PaymentForm {
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
  bankName: string;
  accountNumber: string;
  eWalletProvider: string;
  eWalletNumber: string;
}

const RecordPayment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Sample invoice data - in a real app, this would be fetched based on the ID
  const [invoice] = useState<Invoice>({
    id: "INV001",
    invoiceNumber: "INV-2024-001",
    customerName: "ABC Construction Sdn Bhd",
    customerType: "Corporate",
    totalAmount: 1961.0,
    paidAmount: 0.0,
    balanceAmount: 1961.0,
    currency: "MYR",
    dueDate: "2024-03-31",
    status: "sent",
  });

  const [formData, setFormData] = useState<PaymentForm>({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    referenceNumber: "",
    notes: "",
    bankName: "",
    accountNumber: "",
    eWalletProvider: "",
    eWalletNumber: "",
  });

  const [errors, setErrors] = useState<Partial<PaymentForm>>({});

  const paymentMethods = [
    { value: "cash", label: "Cash", icon: Banknote, description: "Cash payment received" },
    { value: "bank_transfer", label: "Bank Transfer", icon: CreditCardIcon, description: "Direct bank transfer" },
    { value: "online_banking", label: "Online Banking", icon: CreditCardIcon, description: "Online banking payment" },
    { value: "cdm", label: "CDM", icon: CreditCardIcon, description: "Cash Deposit Machine" },
    { value: "grabpay", label: "GrabPay", icon: EWalletIcon, description: "GrabPay e-wallet" },
    { value: "touchngo", label: "Touch 'n Go", icon: EWalletIcon, description: "Touch 'n Go e-wallet" },
    { value: "boost", label: "Boost", icon: EWalletIcon, description: "Boost e-wallet" },
    { value: "fave", label: "Fave", icon: EWalletIcon, description: "Fave e-wallet" },
    { value: "bigpay", label: "BigPay", icon: EWalletIcon, description: "BigPay e-wallet" },
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.value === formData.paymentMethod);

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentForm> = {};

    if (!formData.amount) {
      newErrors.amount = "Payment amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid amount";
      } else if (amount > invoice.balanceAmount) {
        newErrors.amount = `Amount cannot exceed balance of ${invoice.currency} ${invoice.balanceAmount.toFixed(2)}`;
      }
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    if (formData.paymentMethod !== "cash" && !formData.referenceNumber) {
      newErrors.referenceNumber = "Reference number is required for this payment method";
    }

    if (formData.paymentMethod === "bank_transfer" && !formData.bankName) {
      newErrors.bankName = "Bank name is required";
    }

    if (formData.paymentMethod === "bank_transfer" && !formData.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    }

    if (formData.paymentMethod.startsWith("grabpay") || formData.paymentMethod.startsWith("touchngo") || 
        formData.paymentMethod.startsWith("boost") || formData.paymentMethod.startsWith("fave") || 
        formData.paymentMethod.startsWith("bigpay")) {
      if (!formData.eWalletNumber) {
        newErrors.eWalletNumber = "E-wallet number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = () => {
    if (!validateForm()) {
      return;
    }

    // Here you would typically send the payment data to your backend
    console.log("Recording payment:", formData);
    
    // Navigate to receipt confirmation
    navigate(`/admin/invoicing/receipt/${invoice.id}`, {
      state: {
        paymentData: formData,
        invoiceData: invoice,
      }
    });
  };

  const handleCancel = () => {
    navigate(`/admin/invoicing/details/${invoice.id}`);
  };

  const handleAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, amount: value }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    // Clear related fields when payment method changes
    setFormData(prev => ({
      ...prev,
      bankName: "",
      accountNumber: "",
      eWalletProvider: "",
      eWalletNumber: "",
      referenceNumber: "",
    }));
    if (errors.paymentMethod) {
      setErrors(prev => ({ ...prev, paymentMethod: undefined }));
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodInfo = paymentMethods.find(m => m.value === method);
    return methodInfo ? methodInfo.icon : CreditCard;
  };

  const isEWallet = (method: string) => {
    return ["grabpay", "touchngo", "boost", "fave", "bigpay"].includes(method);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoice Details
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Record Payment
            </h2>
            <p className="text-gray-600 mt-1">
              Record payment details for invoice {invoice.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Amount */}
              <div>
                <Label htmlFor="amount">Payment Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Maximum: {invoice.currency} {invoice.balanceAmount.toFixed(2)}
                </p>
              </div>

              {/* Payment Date */}
              <div>
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                  className={errors.paymentDate ? "border-red-500" : ""}
                />
                {errors.paymentDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.paymentDate}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <Label>Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                >
                  <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <method.icon className="h-4 w-4" />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <p className="text-sm text-red-600 mt-1">{errors.paymentMethod}</p>
                )}
                {selectedPaymentMethod && (
                  <p className="text-sm text-gray-600 mt-1">{selectedPaymentMethod.description}</p>
                )}
              </div>

              {/* Reference Number */}
              {formData.paymentMethod && formData.paymentMethod !== "cash" && (
                <div>
                  <Label htmlFor="referenceNumber">Reference Number *</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                    placeholder="Enter reference/transaction number"
                    className={errors.referenceNumber ? "border-red-500" : ""}
                  />
                  {errors.referenceNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.referenceNumber}</p>
                  )}
                </div>
              )}

              {/* Bank Transfer Details */}
              {formData.paymentMethod === "bank_transfer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Select
                      value={formData.bankName}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}
                    >
                      <SelectTrigger className={errors.bankName ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maybank">Maybank</SelectItem>
                        <SelectItem value="cimb">CIMB Bank</SelectItem>
                        <SelectItem value="public">Public Bank</SelectItem>
                        <SelectItem value="rhb">RHB Bank</SelectItem>
                        <SelectItem value="hong_leong">Hong Leong Bank</SelectItem>
                        <SelectItem value="ambank">AmBank</SelectItem>
                        <SelectItem value="bank_islam">Bank Islam</SelectItem>
                        <SelectItem value="bank_rakyat">Bank Rakyat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.bankName && (
                      <p className="text-sm text-red-600 mt-1">{errors.bankName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="Enter account number"
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-600 mt-1">{errors.accountNumber}</p>
                    )}
                  </div>
                </div>
              )}

              {/* E-wallet Details */}
              {isEWallet(formData.paymentMethod) && (
                <div>
                  <Label htmlFor="eWalletNumber">E-wallet Number *</Label>
                  <Input
                    id="eWalletNumber"
                    value={formData.eWalletNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, eWalletNumber: e.target.value }))}
                    placeholder="Enter e-wallet number"
                    className={errors.eWalletNumber ? "border-red-500" : ""}
                  />
                  {errors.eWalletNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.eWalletNumber}</p>
                  )}
                </div>
              )}

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about this payment..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-4">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-semibold">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{invoice.customerName}</p>
                  <p className="text-sm text-gray-600">{invoice.customerType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-semibold">{invoice.dueDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Amount Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">{invoice.currency} {invoice.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-semibold text-green-600">{invoice.currency} {invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Balance Due:</span>
                    <span className="font-bold text-red-600">{invoice.currency} {invoice.balanceAmount.toFixed(2)}</span>
                  </div>
                </div>
                {formData.amount && (
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Payment Amount:</span>
                      <span className="font-semibold text-blue-600">{invoice.currency} {parseFloat(formData.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">New Balance:</span>
                      <span className={`font-bold ${(invoice.balanceAmount - parseFloat(formData.amount)) <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {invoice.currency} {(invoice.balanceAmount - parseFloat(formData.amount)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Payment Recording</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Receipt Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Invoice Update</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordPayment;
