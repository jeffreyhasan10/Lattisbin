
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

interface ROCValidationResult {
  rocNumber: string;
  companyName: string;
  status: "Active" | "Inactive" | "Dissolved";
  registrationDate: string;
  businessType: string;
  registeredAddress: string;
  paidCapital: string;
  directors: string[];
  isValid: boolean;
}

interface ROCValidationServiceProps {
  onValidationResult: (result: ROCValidationResult | null) => void;
  initialROC?: string;
}

const ROCValidationService: React.FC<ROCValidationServiceProps> = ({
  onValidationResult,
  initialROC = ""
}) => {
  const [rocNumber, setRocNumber] = useState(initialROC);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ROCValidationResult | null>(null);

  const validateROCFormat = (roc: string): boolean => {
    // Malaysian ROC format validation (12 digits)
    const rocPattern = /^\d{12}$/;
    return rocPattern.test(roc.replace(/[-\s]/g, ''));
  };

  const simulateROCLookup = async (roc: string): Promise<ROCValidationResult> => {
    // Simulate API call to government ROC database
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation logic
    const cleanROC = roc.replace(/[-\s]/g, '');
    const isValidFormat = validateROCFormat(cleanROC);
    
    if (!isValidFormat) {
      throw new Error("Invalid ROC number format");
    }

    // Mock data based on ROC number
    const mockResults: { [key: string]: Partial<ROCValidationResult> } = {
      "202301234567": {
        companyName: "ABC Construction Sdn Bhd",
        status: "Active",
        businessType: "Construction and Engineering",
        registeredAddress: "No. 123, Jalan Teknologi 3/1, Taman Sains Selangor 1",
        paidCapital: "RM 500,000",
        directors: ["Ahmad Rahman", "Siti Nurhaliza"]
      },
      "202301234568": {
        companyName: "XYZ Trading Sdn Bhd",
        status: "Active",
        businessType: "Import and Export Trading",
        registeredAddress: "No. 456, Jalan Industri 2/3, Kawasan Perindustrian",
        paidCapital: "RM 100,000",
        directors: ["Lee Wei Ming", "Tan Ah Kow"]
      }
    };

    const mockData = mockResults[cleanROC];
    
    return {
      rocNumber: cleanROC,
      companyName: mockData?.companyName || "Unknown Company",
      status: mockData?.status as "Active" | "Inactive" | "Dissolved" || "Inactive",
      registrationDate: "2023-01-15",
      businessType: mockData?.businessType || "Unknown",
      registeredAddress: mockData?.registeredAddress || "Address not available",
      paidCapital: mockData?.paidCapital || "Not disclosed",
      directors: mockData?.directors || [],
      isValid: !!mockData
    };
  };

  const handleValidateROC = async () => {
    if (!rocNumber.trim()) {
      toast.error("Please enter a ROC number");
      return;
    }

    if (!validateROCFormat(rocNumber)) {
      toast.error("Invalid ROC number format. Must be 12 digits.");
      return;
    }

    setValidating(true);
    try {
      const result = await simulateROCLookup(rocNumber);
      setValidationResult(result);
      onValidationResult(result);
      
      if (result.isValid) {
        toast.success("ROC number validated successfully");
      } else {
        toast.warning("ROC number not found in database");
      }
    } catch (error) {
      toast.error("Validation failed. Please try again.");
      setValidationResult(null);
      onValidationResult(null);
    } finally {
      setValidating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-yellow-100 text-yellow-800";
      case "Dissolved": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            ROC Number Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="rocNumber">ROC Number *</Label>
              <Input
                id="rocNumber"
                value={rocNumber}
                onChange={(e) => setRocNumber(e.target.value)}
                placeholder="202301234567"
                maxLength={12}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 12-digit company registration number
              </p>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleValidateROC} 
                disabled={validating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {validating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Validate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <Card className={`border-2 ${validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  {validationResult.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {validationResult.isValid ? 'Valid ROC Number' : 'ROC Number Not Found'}
                  </span>
                </div>
                
                {validationResult.isValid && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Company Name:</strong>
                      <p>{validationResult.companyName}</p>
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge className={getStatusColor(validationResult.status)}>
                        {validationResult.status}
                      </Badge>
                    </div>
                    <div>
                      <strong>Business Type:</strong>
                      <p>{validationResult.businessType}</p>
                    </div>
                    <div>
                      <strong>Registration Date:</strong>
                      <p>{validationResult.registrationDate}</p>
                    </div>
                    <div className="md:col-span-2">
                      <strong>Registered Address:</strong>
                      <p>{validationResult.registeredAddress}</p>
                    </div>
                    <div>
                      <strong>Paid Capital:</strong>
                      <p>{validationResult.paidCapital}</p>
                    </div>
                    <div>
                      <strong>Directors:</strong>
                      <p>{validationResult.directors.join(", ") || "Not disclosed"}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ROCValidationService;
