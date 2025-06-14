import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
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

const LorryRegister = () => {
  const [formData, setFormData] = useState({
    model: "",
    registrationNumber: "",
    lorryTon: "",
    roadTaxExpiry: null,
    insuranceExpiry: null,
    maintenanceSchedule: "",
    fuelEfficiency: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expiryAlert, setExpiryAlert] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.model) newErrors.model = "Lorry model is required";
    if (!formData.registrationNumber || !/^[A-Z0-9-]+$/.test(formData.registrationNumber))
      newErrors.registrationNumber = "Valid registration number is required (e.g., ABC123)";
    if (!formData.lorryTon || isNaN(formData.lorryTon) || Number(formData.lorryTon) <= 0)
      newErrors.lorryTon = "Lorry ton is required and must be a positive number";
    if (!formData.roadTaxExpiry) newErrors.roadTaxExpiry = "Road tax expiry date is required";
    if (!formData.insuranceExpiry) newErrors.insuranceExpiry = "Insurance expiry date is required";
    if (formData.fuelEfficiency && (isNaN(formData.fuelEfficiency) || formData.fuelEfficiency <= 0))
      newErrors.fuelEfficiency = "Fuel efficiency must be a positive number";
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
    setExpiryAlert("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const today = new Date();
      const roadTaxDays = Math.ceil((formData.roadTaxExpiry - today) / (1000 * 60 * 60 * 24));
      const insuranceDays = Math.ceil((formData.insuranceExpiry - today) / (1000 * 60 * 60 * 24));
      let alertMsg = "";
      if (roadTaxDays <= 30) {
        alertMsg += `Road tax for ${formData.registrationNumber} expires in ${roadTaxDays} days. \\n`;
      }
      if (insuranceDays <= 30) {
        alertMsg += `Insurance for ${formData.registrationNumber} expires in ${insuranceDays} days.`;
      }
      if (alertMsg) {
        setExpiryAlert(alertMsg);
      }
      console.log("Submitting lorry data:", formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          model: "",
          registrationNumber: "",
          lorryTon: "",
          roadTaxExpiry: null,
          insuranceExpiry: null,
          maintenanceSchedule: "",
          fuelEfficiency: "",
        });
        setExpiryAlert("");
      }, 2000);
      setErrors({});
    } catch (error) {
      console.error("Error submitting lorry data:", error);
      setErrors({ submit: "Failed to register lorry. Please try again." });
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
        className="p-4 md:p-8 w-full max-w-6xl mx-auto bg-gray-100 dark:bg-gray-950 min-h-screen"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden w-full">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Fleet Management</h2>
            </div>
          </div>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Register New Lorry
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Add a new lorry to the fleet with compliance details and maintenance information
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
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">The lorry has been added to your fleet</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Lorry Details */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Lorry Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                      <Label htmlFor="model" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        Lorry Model <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Truck className="h-4 w-4" />
                        </span>
                        <Input
                          id="model"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          className="pl-10 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          placeholder="Volvo FH16"
                          aria-invalid={errors.model ? "true" : "false"}
                          aria-describedby={errors.model ? "model-error" : undefined}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the lorry's make and model.</p>
                      {errors.model && (
                        <p id="model-error" className="text-red-500 text-xs mt-1">
                          {errors.model}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="registrationNumber" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        Registration Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg>
                        </span>
                        <Input
                          id="registrationNumber"
                          name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleChange}
                          className="pl-10 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          placeholder="ABC123"
                          aria-invalid={errors.registrationNumber ? "true" : "false"}
                          aria-describedby={errors.registrationNumber ? "registrationNumber-error" : undefined}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format: ABC123, required for compliance.</p>
                      {errors.registrationNumber && (
                        <p id="registrationNumber-error" className="text-red-500 text-xs mt-1">
                          {errors.registrationNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2 relative">
                      <Label htmlFor="lorryTon" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        Lorry Ton <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2M4 8h16M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8" /></svg>
                        </span>
                        <Input
                          id="lorryTon"
                          name="lorryTon"
                          type="number"
                          value={formData.lorryTon}
                          onChange={handleChange}
                          className="pl-10 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          placeholder="e.g. 10"
                          min="1"
                          aria-invalid={errors.lorryTon ? "true" : "false"}
                          aria-describedby={errors.lorryTon ? "lorryTon-error" : undefined}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Specify the lorry's tonnage (e.g., 10).</p>
                      {errors.lorryTon && (
                        <p id="lorryTon-error" className="text-red-500 text-xs mt-1">
                          {errors.lorryTon}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                <hr className="my-6 border-gray-300 dark:border-gray-700" />
                {/* Section: Compliance */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Compliance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="roadTaxExpiry" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        Road Tax Expiry <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${!formData.roadTaxExpiry && "text-gray-500 dark:text-gray-400"}`}
                            aria-invalid={errors.roadTaxExpiry ? "true" : "false"}
                            aria-describedby={errors.roadTaxExpiry ? "roadTaxExpiry-error" : undefined}
                          >
                            <Calendar className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                            {formData.roadTaxExpiry ? (
                              format(formData.roadTaxExpiry, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                          <CalendarComponent
                            mode="single"
                            selected={formData.roadTaxExpiry}
                            onSelect={(date) => handleDateChange("roadTaxExpiry", date)}
                            initialFocus
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select the expiry date for the lorry's road tax.</p>
                      {errors.roadTaxExpiry && (
                        <p id="roadTaxExpiry-error" className="text-red-500 text-xs mt-1">
                          {errors.roadTaxExpiry}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceExpiry" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        Insurance Expiry <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${!formData.insuranceExpiry && "text-gray-500 dark:text-gray-400"}`}
                            aria-invalid={errors.insuranceExpiry ? "true" : "false"}
                            aria-describedby={errors.insuranceExpiry ? "insuranceExpiry-error" : undefined}
                          >
                            <Calendar className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                            {formData.insuranceExpiry ? (
                              format(formData.insuranceExpiry, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                          <CalendarComponent
                            mode="single"
                            selected={formData.insuranceExpiry}
                            onSelect={(date) => handleDateChange("insuranceExpiry", date)}
                            initialFocus
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select the expiry date for the lorry's insurance.</p>
                      {errors.insuranceExpiry && (
                        <p id="insuranceExpiry-error" className="text-red-500 text-xs mt-1">
                          {errors.insuranceExpiry}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                <hr className="my-6 border-gray-300 dark:border-gray-700" />
                {/* Section: Maintenance */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                  <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5 text-amber-500 dark:text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> Maintenance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                      <Label htmlFor="maintenanceSchedule" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Maintenance Schedule
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                        <Input
                          id="maintenanceSchedule"
                          name="maintenanceSchedule"
                          value={formData.maintenanceSchedule}
                          onChange={handleChange}
                          className="pl-10 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          placeholder="Every 6 months"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional: Specify maintenance frequency (e.g., every 6 months).</p>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="fuelEfficiency" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Fuel Efficiency (km/L)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                        <Input
                          id="fuelEfficiency"
                          name="fuelEfficiency"
                          type="number"
                          value={formData.fuelEfficiency}
                          onChange={handleChange}
                          className="pl-10 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          placeholder="10"
                          step="0.1"
                          aria-invalid={errors.fuelEfficiency ? "true" : "false"}
                          aria-describedby={errors.fuelEfficiency ? "fuelEfficiency-error" : undefined}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional: Enter average fuel consumption.</p>
                      {errors.fuelEfficiency && (
                        <p id="fuelEfficiency-error" className="text-red-500 text-xs mt-1">
                          {errors.fuelEfficiency}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                {/* Alerts and Submit */}
                {expiryAlert && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="bg-amber-100 dark:bg-amber-900/20 px-4 py-3 rounded-lg border border-amber-200 dark:border-amber-800 mb-2 flex items-center gap-2 justify-center">
                    <svg className="h-5 w-5 text-amber-500 dark:text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                    <p className="text-amber-700 dark:text-amber-300 text-sm text-center whitespace-pre-line">{expiryAlert}</p>
                  </motion.div>
                )}
                {errors.submit && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 justify-center">
                    <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M5.636 5.636l1.414 1.414M17.657 17.657l1.414-1.414M12 8v4l3 3" /></svg>
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.submit}</p>
                  </motion.div>
                )}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:from-blue-400 disabled:to-indigo-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md flex items-center justify-center gap-2 text-base"
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
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Register Lorry
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Fleet Status Indicators</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2 p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Available</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-100 dark:bg-blue-900/20">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs font-medium text-blue-800 dark:text-blue-300">In-Use</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md bg-amber-100 dark:bg-amber-900/20">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Maintenance</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Fleet Management System © 2025 - All vehicle data is securely stored
          <br />
          <span className="block mt-1 text-blue-600 dark:text-blue-300 font-medium">
            Road Tax & Insurance must be renewed every year. The system will auto-alert you before expiry.
          </span>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default LorryRegister;