import React, { useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  ArrowLeft,
  Download,
  Share2,
  Printer,
  CheckCircle,
  Calendar,
  User,
  MapPin,
  Package,
  CreditCard,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface ReceiptData {
  receiptNumber: string;
  doNumber: string;
  tripId: string;
  customerName: string;
  location: string;
  paymentMethod: string;
  amount: number;
  paymentDate: string;
  paymentTime: string;
  driverName: string;
  binSize?: string;
  notes?: string;
}

const ViewReceipt: React.FC = () => {
  const navigate = useNavigate();
  const { receiptId } = useParams();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Get receipt data from location state or generate mock data
  const receiptData: ReceiptData = location.state?.receiptData || {
    receiptNumber: `RCPT-2025-${String(Math.floor(Math.random() * 1000)).padStart(5, "0")}`,
    doNumber: "DO-2024-1234",
    tripId: "TRP-2024-001",
    customerName: "Tech Plaza Mall",
    location: "Cyberjaya, Selangor",
    paymentMethod: "Cash",
    amount: 350.00,
    paymentDate: new Date().toLocaleDateString("en-MY"),
    paymentTime: new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" }),
    driverName: "Ahmad Rahman",
    binSize: "20 Yard (11ft x 6ft x 8ft)",
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    toast.success("Receipt downloaded successfully!", {
      description: `${receiptData.receiptNumber}.pdf`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Receipt ${receiptData.receiptNumber}`,
        text: `Payment receipt for DO ${receiptData.doNumber}`,
        url: window.location.href,
      }).then(() => {
        toast.success("Receipt shared successfully!");
      }).catch((error) => {
        console.error("Error sharing:", error);
        toast.error("Failed to share receipt");
      });
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Receipt link copied to clipboard!");
    }
  };

  const handleSendToCustomer = () => {
    toast.success("Receipt sent to customer!", {
      description: "Email and WhatsApp notification sent",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>

        {/* Receipt */}
        <div ref={receiptRef} className="print:p-8">
          <Card className="shadow-2xl border-2 border-gray-200">
            {/* Header Section */}
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                    <Receipt className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">PAYMENT RECEIPT</h1>
                  <p className="text-green-100 text-sm mt-1">
                    Lattis Bin Management System
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
                  <p className="text-sm text-green-100">Receipt Number</p>
                  <p className="text-2xl font-bold">{receiptData.receiptNumber}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Success Badge */}
              <div className="flex justify-center">
                <div className="bg-green-50 border-2 border-green-200 rounded-full px-6 py-3 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="font-bold text-green-900">Payment Received</span>
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {receiptData.paymentMethod}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-bold text-green-600 text-2xl">
                      RM {receiptData.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Payment Date</p>
                    <p className="font-semibold text-gray-900">
                      {receiptData.paymentDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Payment Time</p>
                    <p className="font-semibold text-gray-900">
                      {receiptData.paymentTime}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer & Order Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Order Information
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-semibold text-gray-900">
                        {receiptData.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">
                        {receiptData.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">DO Number</p>
                      <p className="font-semibold text-gray-900">
                        {receiptData.doNumber}
                      </p>
                    </div>
                  </div>
                  {receiptData.binSize && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Bin Size</p>
                        <p className="font-semibold text-gray-900">
                          {receiptData.binSize}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Collected By */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Collected By</p>
                <p className="font-bold text-gray-900 text-lg">
                  {receiptData.driverName}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Driver - Lattis Bin Services
                </p>
              </div>

              {receiptData.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Notes:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {receiptData.notes}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Footer */}
              <div className="space-y-3 pt-4">
                <div className="text-center text-sm text-gray-600">
                  <p className="font-semibold">Thank you for your payment!</p>
                  <p className="mt-1">
                    For inquiries, please contact us at +603-1234-5678
                  </p>
                </div>
                <div className="text-center text-xs text-gray-500">
                  <p>This is a computer-generated receipt and is valid without signature.</p>
                  <p className="mt-1">
                    Generated on {new Date().toLocaleString("en-MY")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons (not printed) */}
        <div className="print:hidden flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSendToCustomer}
            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Share2 className="h-4 w-4" />
            Send to Customer (Email/WhatsApp)
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/driver/trips/${receiptData.tripId}`)}
            className="flex-1"
          >
            Back to Trip Details
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${receiptRef.current} * {
            visibility: visible;
          }
          ${receiptRef.current} {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewReceipt;

