import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Truck, User, Calendar, FileText, Package } from "lucide-react";
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

const RentableLorryRegister = () => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    driverId: "",
    availabilityStatus: "available",
    taskDescription: "",
    maxBins: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock data for lorries and drivers (replace with API calls)
  const lorries = [
    { registrationNumber: "ABC123" },
    { registrationNumber: "XYZ789" },
  ];
  const drivers = [
    { driverId: "D001" },
    { driverId: "D002" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.registrationNumber)
      newErrors.registrationNumber = "Lorry registration number is required";
    if (!formData.driverId) newErrors.driverId = "Driver ID is required";
    if (!formData.availabilityStatus)
      newErrors.availabilityStatus = "Availability status is required";
    if (formData.maxBins && (isNaN(formData.maxBins) || formData.maxBins <= 0))
      newErrors.maxBins = "Maximum bins must be a positive number";
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
    // Clear error for the field when user makes a selection
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Submitting rentable lorry data:", {
        ...formData,
        gpsTracking: "Placeholder for GPS integration",
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          registrationNumber: "",
          driverId: "",
          availabilityStatus: "available",
          taskDescription: "",
          maxBins: "",
        });
      }, 2000);
      setErrors({});
    } catch (error) {
      console.error("Error submitting rentable lorry data:", error);
      setErrors({ submit: "Failed to register rentable lorry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 bg-gray-100 dark:bg-gray-950 min-h-screen"
      >
        <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Fleet Rental Management</h2>
            </div>
          </div>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Register Rentable Lorry
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Assign a lorry to rental tasks with driver and availability details
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
                  <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full">
                    <svg className="h-6 w-6 text-emerald-800 dark:text-emerald-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-emerald-800 dark:text-emerald-300">Lorry Registered Successfully</h3>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">The rentable lorry has been added to your fleet</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label htmlFor="registrationNumber" className="text-gray-900 dark:text-gray-100 font-medium">
                        Lorry Registration Number
                      </Label>
                    </div>
                    <Select
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onValueChange={(value) => handleSelectChange("registrationNumber", value)}
                    >
                      <SelectTrigger className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select lorry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {lorries.map((lorry) => (
                          <SelectItem key={lorry.registrationNumber} value={lorry.registrationNumber} className="text-gray-900 dark:text-gray-100">
                            {lorry.registrationNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.registrationNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label htmlFor="driverId" className="text-gray-900 dark:text-gray-100 font-medium">
                        Driver ID
                      </Label>
                    </div>
                    <Select
                      name="driverId"
                      value={formData.driverId}
                      onValueChange={(value) => handleSelectChange("driverId", value)}
                    >
                      <SelectTrigger className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {drivers.map((driver) => (
                          <SelectItem key={driver.driverId} value={driver.driverId} className="text-gray-900 dark:text-gray-100">
                            {driver.driverId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.driverId && (
                      <p className="text-red-500 text-xs mt-1">{errors.driverId}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label htmlFor="availabilityStatus" className="text-gray-900 dark:text-gray-100 font-medium">
                        Availability Status
                      </Label>
                    </div>
                    <Select
                      name="availabilityStatus"
                      value={formData.availabilityStatus}
                      onValueChange={(value) => handleSelectChange("availabilityStatus", value)}
                    >
                      <SelectTrigger className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="available" className="text-gray-900 dark:text-gray-100">
                          <div className="flex items-center">
                            <div className="w-2 h-2 mr-2 rounded-full bg-emerald-500"></div>
                            Available
                          </div>
                        </SelectItem>
                        <SelectItem value="assigned" className="text-gray-900 dark:text-gray-100">
                          <div className="flex items-center">
                            <div className="w-2 h-2 mr-2 rounded-full bg-blue-500"></div>
                            Assigned
                          </div>
                        </SelectItem>
                        <SelectItem value="under_maintenance" className="text-gray-900 dark:text-gray-100">
                          <div className="flex items-center">
                            <div className="w-2 h-2 mr-2 rounded-full bg-amber-500"></div>
                            Under Maintenance
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.availabilityStatus && (
                      <p className="text-red-500 text-xs mt-1">{errors.availabilityStatus}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label htmlFor="taskDescription" className="text-gray-900 dark:text-gray-100 font-medium">
                        Task Description (Optional)
                      </Label>
                    </div>
                    <Textarea
                      id="taskDescription"
                      name="taskDescription"
                      value={formData.taskDescription}
                      onChange={handleChange}
                      className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Delivery of bins to customer site"
                      rows={3}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label htmlFor="maxBins" className="text-gray-900 dark:text-gray-100 font-medium">
                        Max Bins per Trip (Optional)
                      </Label>
                    </div>
                    <Input
                      id="maxBins"
                      name="maxBins"
                      type="number"
                      value={formData.maxBins}
                      onChange={handleChange}
                      className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                    />
                    {errors.maxBins && (
                      <p className="text-red-500 text-xs mt-1">{errors.maxBins}</p>
                    )}
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:from-blue-400 disabled:to-indigo-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Register Rentable Lorry
                    </span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md max-w-2xl mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Lorry Status Guide</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2 p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Available</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-100 dark:bg-blue-900/20">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Assigned</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md bg-amber-100 dark:bg-amber-900/20">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Maintenance</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Fleet Rental Management System © 2025 - All vehicle data is securely stored
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default RentableLorryRegister;