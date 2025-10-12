import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DollarSign,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Receipt,
  FileText,
  AlertCircle,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  value: "cash" | "online" | "cdm" | "ewallet" | "cheque";
  label: string;
  description: string;
  icon: typeof CreditCard;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    value: "cash",
    label: "Cash",
    description: "Payment received in cash",
    icon: Banknote,
    color: "green",
  },
  {
    value: "online",
    label: "Online Transfer",
    description: "Bank transfer or online payment",
    icon: CreditCard,
    color: "blue",
  },
  {
    value: "cdm",
    label: "CDM (Cash Deposit Machine)",
    description: "Payment via cash deposit machine",
    icon: Wallet,
    color: "purple",
  },
  {
    value: "ewallet",
    label: "E-Wallet",
    description: "Payment via e-wallet (Touch 'n Go, GrabPay, etc.)",
    icon: Smartphone,
    color: "orange",
  },
  {
    value: "cheque",
    label: "Cheque",
    description: "Payment by cheque",
    icon: FileText,
    color: "indigo",
  },
];

const TripRecordPayment = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [generateReceipt, setGenerateReceipt] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Mock trip data
  const tripData = {
    id: tripId,
    doNumber: "DO-2024-1234",
    customer: "Tech Plaza Mall",
    totalAmount: 250.00,
    outstandingAmount: 250.00,
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    if (parseFloat(amount) > tripData.outstandingAmount) {
      toast.error("Payment amount cannot exceed outstanding amount");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    // Update trip payment status in localStorage
    const savedTrips = localStorage.getItem("driverTrips");
    if (savedTrips) {
      const trips = JSON.parse(savedTrips) as Array<Record<string, unknown>>;
      const updatedTrips = trips.map((trip) => {
        if (trip.id === tripId) {
          const hasStatusUpdate = trip.statusUpdated === true;
          return {
            ...trip,
            paymentRecorded: true,
            paymentMethod: paymentMethod,
            paymentAmount: parseFloat(amount),
            // Mark as completed if status is also updated
            status: hasStatusUpdate ? "completed" : trip.status,
          };
        }
        return trip;
      });
      localStorage.setItem("driverTrips", JSON.stringify(updatedTrips));
    }
    
    toast.success("Payment recorded successfully!", {
      description: "Payment details have been sent to admin for reconciliation",
    });

    if (generateReceipt && paymentMethod === "cash") {
      setTimeout(() => {
        toast.info("Generating receipt...", {
          description: "Receipt will be available for printing shortly",
        });
      }, 1000);
    }

    // Navigate back to trip details
    setTimeout(() => {
      navigate(`/driver/trips/${tripId}`);
    }, 2000);
  };

  const handleCancel = () => {
    navigate(`/driver/trips/${tripId}`);
  };

  const getPaymentMethodColor = (color: string) => {
    switch (color) {
      case "green":
        return "border-green-300 bg-green-50 hover:bg-green-100";
      case "blue":
        return "border-blue-300 bg-blue-50 hover:bg-blue-100";
      case "purple":
        return "border-purple-300 bg-purple-50 hover:bg-purple-100";
      case "orange":
        return "border-orange-300 bg-orange-50 hover:bg-orange-100";
      case "indigo":
        return "border-indigo-300 bg-indigo-50 hover:bg-indigo-100";
      default:
        return "border-gray-300 bg-gray-50 hover:bg-gray-100";
    }
  };

  const requiresReferenceNumber = ["online", "cdm", "ewallet", "cheque"].includes(paymentMethod);

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              Record Payment
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Record payment received from customer
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trip Information */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Trip Information</span>
            </CardTitle>
          </div>
          <CardContent className="pt-4 px-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Trip ID</p>
                <p className="font-semibold text-gray-900">{tripData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">DO Number</p>
                <p className="font-semibold text-gray-900">{tripData.doNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{tripData.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding Amount</p>
                <p className="text-2xl font-bold text-emerald-600">
                  RM {tripData.outstandingAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Select Payment Method *</span>
            </CardTitle>
          </div>
          <CardContent className="pt-4 px-5">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.value}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? `${getPaymentMethodColor(method.color)} border-${method.color}-500 ring-2 ring-${method.color}-200`
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <RadioGroupItem value={method.value} id={method.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-5 w-5 text-${method.color}-600`} />
                          <span className="font-semibold text-gray-900">{method.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Payment Details</span>
            </CardTitle>
          </div>
          <CardContent className="pt-4 px-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Received (RM) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  RM
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={tripData.outstandingAmount}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-gray-500">
                Maximum: RM {tripData.outstandingAmount.toFixed(2)}
              </p>
            </div>

            {requiresReferenceNumber && (
              <div className="space-y-2">
                <Label htmlFor="reference">
                  Reference Number / Transaction ID *
                </Label>
                <Input
                  id="reference"
                  type="text"
                  placeholder="Enter reference number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Required for verification and reconciliation
                </p>
              </div>
            )}

            {paymentMethod === "cheque" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 mb-1">Cheque Payment</p>
                    <p className="text-sm text-yellow-800">
                      Please collect the cheque and enter the cheque number in the reference field.
                      Payment will be marked as pending until cheque clears.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

          {/* Cash Receipt Option */}
          {paymentMethod === "cash" && (
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold">Receipt Options</span>
                </CardTitle>
              </div>
              <CardContent className="pt-4 px-5 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateReceipt}
                  onChange={(e) => setGenerateReceipt(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Generate Cash Receipt</p>
                  <p className="text-sm text-gray-600">
                    Generate and print a receipt for the customer
                  </p>
                </div>
                <Printer className="h-5 w-5 text-green-600" />
              </label>
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any additional notes about the payment (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={
                  !paymentMethod ||
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  (requiresReferenceNumber && !referenceNumber)
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Confirm Payment Record
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Please verify the payment details before confirming:</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Payment Summary:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Method: <strong className="capitalize">{paymentMethod?.replace("-", " ")}</strong></li>
                  <li>• Amount: <strong className="text-emerald-600">RM {parseFloat(amount || "0").toFixed(2)}</strong></li>
                  {referenceNumber && <li>• Reference: <strong>{referenceNumber}</strong></li>}
                  {generateReceipt && <li>• Receipt: <strong>Will be generated</strong></li>}
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Payment details will be sent to admin for reconciliation and invoice update.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalConfirm}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TripRecordPayment;

