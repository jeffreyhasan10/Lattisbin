import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Trash2, Recycle, AlertTriangle, Info, ChevronRight } from "lucide-react";
import React from "react";

// Error Boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2">An error occurred while rendering this section.</p>
          <p className="mt-1 text-sm">{this.state.error?.message}</p>
          <Button
            variant="outline"
            className="mt-4 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const WasteItemRegister = () => {
  const [formData, setFormData] = useState({
    wasteType: "",
    description: "",
    handlingInstructions: "",
    complianceRequirements: "",
    weightLimit: "",
    disposalMethod: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const wasteTypes = [
    { value: "general", label: "General", icon: <Trash2 className="h-4 w-4 mr-2" /> },
    { value: "hazardous", label: "Hazardous", icon: <AlertTriangle className="h-4 w-4 mr-2" /> },
    { value: "recyclable", label: "Recyclable", icon: <Recycle className="h-4 w-4 mr-2" /> },
    { value: "organic", label: "Organic", icon: <Info className="h-4 w-4 mr-2" /> }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.wasteType) newErrors.wasteType = "Waste type is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.weightLimit && (isNaN(formData.weightLimit) || formData.weightLimit <= 0))
      newErrors.weightLimit = "Weight limit must be a positive number";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Submitting waste item data:", formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          wasteType: "",
          description: "",
          handlingInstructions: "",
          complianceRequirements: "",
          weightLimit: "",
          disposalMethod: "",
        });
      }, 2000);
      setErrors({});
    } catch (error) {
      console.error("Error submitting waste item data:", error);
      setErrors({ submit: "Failed to register waste item. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get icon for selected waste type
  const getWasteTypeIcon = () => {
    const selectedType = wasteTypes.find(type => type.value === formData.wasteType);
    return selectedType?.icon || null;
  };

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-8 max-w-2xl mx-auto bg-gray-100 dark:bg-gray-950 min-h-screen"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Waste Management</h2>
            </div>
          </div>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Register Waste Item
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Categorize a new waste item for compliance and bin assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
                    <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-emerald-800 dark:text-emerald-300">Waste Item Registered Successfully</h3>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">The waste item has been added to your system</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="wasteType" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Waste Type
                  </Label>
                  <Select
                    name="wasteType"
                    value={formData.wasteType}
                    onValueChange={(value) => handleSelectChange("wasteType", value)}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
                      {wasteTypes.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.wasteType && (
                    <p className="text-red-500 text-xs mt-1">{errors.wasteType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                    placeholder="General construction debris"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handlingInstructions" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Handling Instructions
                  </Label>
                  <Textarea
                    id="handlingInstructions"
                    name="handlingInstructions"
                    value={formData.handlingInstructions}
                    onChange={handleChange}
                    className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                    placeholder="Wear protective gear, avoid mixing with recyclables"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Optional: Provide specific handling guidelines</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="complianceRequirements" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Compliance Requirements
                    </Label>
                    <Textarea
                      id="complianceRequirements"
                      name="complianceRequirements"
                      value={formData.complianceRequirements}
                      onChange={handleChange}
                      className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                      placeholder="Requires hazardous waste permit"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Optional: Relevant regulations or permits</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disposalMethod" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Disposal Method
                    </Label>
                    <Input
                      id="disposalMethod"
                      name="disposalMethod"
                      value={formData.disposalMethod}
                      onChange={handleChange}
                      className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                      placeholder="Landfill or recycling"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Optional: Recommended disposal procedure</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weightLimit" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Weight Limit (kg)
                  </Label>
                  <div className="relative">
                    <Input
                      id="weightLimit"
                      name="weightLimit"
                      type="number"
                      value={formData.weightLimit}
                      onChange={handleChange}
                      className="pl-9 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                      placeholder="1000"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Optional: Maximum weight per container</p>
                  {errors.weightLimit && (
                    <p className="text-red-500 text-xs mt-1">{errors.weightLimit}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.submit}</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:from-blue-400 disabled:to-indigo-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        {formData.wasteType && getWasteTypeIcon()}
                        Register Waste Item
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Waste Management System © 2025 - Compliant with environmental regulations
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default WasteItemRegister;