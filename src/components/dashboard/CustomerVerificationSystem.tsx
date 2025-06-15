
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, AlertCircle, Upload, Phone, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface VerificationData {
  otpSent: boolean;
  otpVerified: boolean;
  documentsUploaded: boolean;
  identityVerified: boolean;
  creditScoreCalculated: boolean;
}

interface CustomerVerificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerPhone: string;
  customerEmail: string;
  onVerificationComplete: (verificationData: VerificationData) => void;
}

const CustomerVerificationSystem: React.FC<CustomerVerificationSystemProps> = ({
  isOpen,
  onClose,
  customerId,
  customerPhone,
  customerEmail,
  onVerificationComplete
}) => {
  const [otpCode, setOtpCode] = useState("");
  const [verificationData, setVerificationData] = useState<VerificationData>({
    otpSent: false,
    otpVerified: false,
    documentsUploaded: false,
    identityVerified: false,
    creditScoreCalculated: false
  });

  const sendOTP = async (method: 'sms' | 'email' | 'whatsapp') => {
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const contact = method === 'sms' ? customerPhone : 
                    method === 'email' ? customerEmail : customerPhone;
      
      setVerificationData(prev => ({ ...prev, otpSent: true }));
      toast.success(`OTP sent to ${contact} via ${method.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification (accept any 6-digit code for demo)
      if (otpCode.length === 6) {
        setVerificationData(prev => ({ 
          ...prev, 
          otpVerified: true,
          creditScoreCalculated: true // Auto-calculate credit score after OTP verification
        }));
        toast.success("OTP verified successfully");
        
        // Auto-complete verification after OTP
        setTimeout(() => {
          const completeVerification = {
            ...verificationData,
            otpVerified: true,
            documentsUploaded: true,
            identityVerified: true,
            creditScoreCalculated: true
          };
          setVerificationData(completeVerification);
          onVerificationComplete(completeVerification);
        }, 1000);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("OTP verification failed");
    }
  };

  const uploadDocument = async (docType: string) => {
    // Simulate document upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVerificationData(prev => ({ ...prev, documentsUploaded: true }));
    toast.success(`${docType} uploaded successfully`);
  };

  const getStepStatus = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Verification - ID: {customerId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verification Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 1: OTP Verification */}
              <div className="flex items-center gap-3">
                {getStepStatus(verificationData.otpVerified)}
                <div className="flex-1">
                  <div className="font-medium">Mobile/Email Verification</div>
                  <div className="text-sm text-gray-500">Verify customer contact information</div>
                </div>
                {!verificationData.otpVerified && (
                  <Badge variant="outline">Pending</Badge>
                )}
                {verificationData.otpVerified && (
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                )}
              </div>

              {/* Step 2: Document Upload */}
              <div className="flex items-center gap-3">
                {getStepStatus(verificationData.documentsUploaded)}
                <div className="flex-1">
                  <div className="font-medium">Identity Documents</div>
                  <div className="text-sm text-gray-500">Upload IC/Passport and supporting documents</div>
                </div>
                {!verificationData.documentsUploaded && (
                  <Badge variant="outline">Pending</Badge>
                )}
                {verificationData.documentsUploaded && (
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                )}
              </div>

              {/* Step 3: Identity Verification */}
              <div className="flex items-center gap-3">
                {getStepStatus(verificationData.identityVerified)}
                <div className="flex-1">
                  <div className="font-medium">Identity Verification</div>
                  <div className="text-sm text-gray-500">Automated identity verification process</div>
                </div>
                {!verificationData.identityVerified && (
                  <Badge variant="outline">Pending</Badge>
                )}
                {verificationData.identityVerified && (
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                )}
              </div>

              {/* Step 4: Credit Score */}
              <div className="flex items-center gap-3">
                {getStepStatus(verificationData.creditScoreCalculated)}
                <div className="flex-1">
                  <div className="font-medium">Credit Score Assessment</div>
                  <div className="text-sm text-gray-500">Calculate customer credit rating</div>
                </div>
                {!verificationData.creditScoreCalculated && (
                  <Badge variant="outline">Pending</Badge>
                )}
                {verificationData.creditScoreCalculated && (
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* OTP Verification Section */}
          {!verificationData.otpVerified && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => sendOTP('sms')}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    SMS
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => sendOTP('email')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => sendOTP('whatsapp')}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>

                {verificationData.otpSent && (
                  <div className="space-y-3">
                    <Label>Enter 6-digit OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="flex-1"
                      />
                      <Button onClick={verifyOTP}>Verify</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Document Upload Section */}
          {verificationData.otpVerified && !verificationData.documentsUploaded && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('Identity Card')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload IC
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('Bank Statement')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bank Statement
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('Utility Bill')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Utility Bill
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('Income Statement')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Income Proof
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Complete */}
          {verificationData.otpVerified && verificationData.documentsUploaded && verificationData.identityVerified && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Verification Complete</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Customer has been successfully verified and credit score calculated.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerVerificationSystem;
