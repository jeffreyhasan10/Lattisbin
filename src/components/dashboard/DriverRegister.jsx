import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, User, Phone, FileBadge, UserCog, FileText, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

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
        <div className="p-6 text-center text-red-600 dark:text-red-400">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2">An error occurred while rendering this section.</p>
          <p className="mt-1 text-sm">{this.state.error?.message}</p>
          <Button
            variant="outline"
            className="mt-4"
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

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    driverName: "",
    driverId: "",
    identityCard: "",
    contactNumber: "",
    licenseExpiry: null,
    emergencyContact: "",
    drivingHistory: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.driverName) newErrors.driverName = "Driver name is required";
    if (!formData.driverId || !/^[A-Z0-9-]+$/.test(formData.driverId))
      newErrors.driverId = "Valid driver ID is required (e.g., DL123456)";
    if (!formData.identityCard || !/^\d{12}$/.test(formData.identityCard))
      newErrors.identityCard = "Valid 12-digit identity card number is required";
    if (!formData.contactNumber || !/^\+?\d{10,15}$/.test(formData.contactNumber.replace(/\s/g, "")))
      newErrors.contactNumber = "Valid phone number is required (e.g., +1234567890)";
    if (!formData.licenseExpiry) newErrors.licenseExpiry = "License expiry date is required";
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

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
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
      const today = new Date();
      const licenseDays = Math.ceil((formData.licenseExpiry - today) / (1000 * 60 * 60 * 24));
      if (licenseDays <= 30) {
        console.log(`Alert: License for ${formData.driverId} expires in ${licenseDays} days`);
      }
      console.log("Submitting driver data:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData({
        driverName: "",
        driverId: "",
        identityCard: "",
        contactNumber: "",
        licenseExpiry: null,
        emergencyContact: "",
        drivingHistory: "",
      });
      setErrors({});
      alert("Driver registered successfully!");
    } catch (error) {
      console.error("Error submitting driver data:", error);
      setErrors({ submit: "Failed to register driver. Please try again." });
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
          <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 w-full"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Register Driver
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                  Add a new driver with license and contact details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="driverName" className="text-gray-900 dark:text-gray-100 font-medium">
                      Driver Name
                    </Label>
                  </div>
                  <Input
                    id="driverName"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    className="w-full border-gray-200 focus:border-blue-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="John Smith"
                    aria-invalid={errors.driverName ? "true" : "false"}
                    aria-describedby={errors.driverName ? "driverName-error" : undefined}
                  />
                  {errors.driverName && (
                    <p id="driverName-error" className="text-red-500 text-xs mt-1">
                      {errors.driverName}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <FileBadge className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="driverId" className="text-gray-900 dark:text-gray-100 font-medium">
                      Driver ID (License Number)
                    </Label>
                  </div>
                  <Input
                    id="driverId"
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full border-gray-200 focus:border-blue-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="DL123456"
                    aria-invalid={errors.driverId ? "true" : "false"}
                    aria-describedby={errors.driverId ? "driverId-error" : undefined}
                  />
                  {errors.driverId && (
                    <p id="driverId-error" className="text-red-500 text-xs mt-1">
                      {errors.driverId}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="identityCard" className="text-gray-900 dark:text-gray-100 font-medium">
                      Identity Card Number
                    </Label>
                  </div>
                  <Input
                    id="identityCard"
                    name="identityCard"
                    value={formData.identityCard}
                    onChange={handleChange}
                    className="w-full border-gray-200 focus:border-blue-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 12-digit IC number"
                    maxLength="12"
                    aria-invalid={errors.identityCard ? "true" : "false"}
                    aria-describedby={errors.identityCard ? "identityCard-error" : undefined}
                  />
                  {errors.identityCard && (
                    <p id="identityCard-error" className="text-red-500 text-xs mt-1">
                      {errors.identityCard}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="contactNumber" className="text-gray-900 dark:text-gray-100 font-medium">
                      Contact Number
                    </Label>
                  </div>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full border-gray-200 focus:border-blue-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 234 567 8900"
                    type="tel"
                    aria-invalid={errors.contactNumber ? "true" : "false"}
                    aria-describedby={errors.contactNumber ? "contactNumber-error" : undefined}
                  />
                  {errors.contactNumber && (
                    <p id="contactNumber-error" className="text-red-500 text-xs mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="licenseExpiry" className="text-gray-900 dark:text-gray-100 font-medium">
                      License Expiry
                    </Label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                          !formData.licenseExpiry && "text-gray-500 dark:text-gray-400"
                        }`}
                        aria-invalid={errors.licenseExpiry ? "true" : "false"}
                        aria-describedby={errors.licenseExpiry ? "licenseExpiry-error" : undefined}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.licenseExpiry ? (
                          format(formData.licenseExpiry, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CalendarComponent
                        mode="single"
                        selected={formData.licenseExpiry}
                        onSelect={(date) => handleDateChange("licenseExpiry", date)}
                        initialFocus
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.licenseExpiry && (
                    <p id="licenseExpiry-error" className="text-red-500 text-xs mt-1">
                      {errors.licenseExpiry}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="emergencyContact" className="text-gray-900 dark:text-gray-100 font-medium">
                      Emergency Contact (Optional)
                    </Label>
                  </div>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full border-gray-200 focus:border-blue-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 987 654 3210"
                    type="tel"
                  />
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <Label htmlFor="drivingHistory" className="text-gray-900 dark:text-gray-100 font-medium">
                      Driving History Notes (Optional)
                    </Label>
                  </div>
                  <Textarea
                    id="drivingHistory"
                    name="drivingHistory"
                    value={formData.drivingHistory}
                    onChange={handleChange}
                    className="w-full border-gray-200 focus:border-blue-500 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Previous experience or incidents"
                    rows={4}
                  />
                </div>
              </div>
              
              {errors.submit && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.submit}</p>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  "Register Driver"
                )}
              </Button>
              
              {/* Status indicators example (for reference) */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-md text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Available
                </div>
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-md text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  In-Use
                </div>
                <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-md text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Maintenance
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </ErrorBoundary>
  );
};

export default DriverRegister;