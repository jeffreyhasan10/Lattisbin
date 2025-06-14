import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, CheckCircle, AlertCircle, User, Building, MapPin, Mail, Phone, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    postcode: "",
    area: "",
    state: "",
    email: "",
    phoneNumber: "",
    notes: "",
    customerType: "individual",
    creditLimit: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Customer name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.postcode || !/^\d{5}$/.test(formData.postcode))
      newErrors.postcode = "Valid 5-digit postcode is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phoneNumber || !/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      newErrors.phoneNumber = "Valid phone number is required (e.g., +1234567890)";
    if (formData.creditLimit && (isNaN(formData.creditLimit) || formData.creditLimit < 0))
      newErrors.creditLimit = "Credit limit must be a positive number";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      // Simulate API call to save customer data
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Submitting customer data:", formData);
      // Show success state
      setIsSuccess(true);
      setTimeout(() => {
        // Reset form after successful submission
        setFormData({
          customerName: "",
          address: "",
          postcode: "",
          area: "",
          state: "",
          email: "",
          phoneNumber: "",
          notes: "",
          customerType: "individual",
          creditLimit: "",
        });
        setErrors({});
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting customer data:", error);
      setErrors({ submit: "Failed to register customer. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-2xl mx-auto"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden rounded-lg">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-4 shadow-md">
                <CheckCircle className="h-12 w-12 text-emerald-800 dark:text-emerald-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Successful!</h2>
              <p className="text-gray-700 dark:text-gray-300 text-center max-w-md">
                The customer has been registered successfully. You can now add them to bookings and invoices.
              </p>
              <Button 
                onClick={() => setIsSuccess(false)} 
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Register Another Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-100 dark:bg-gray-950 min-h-screen"
    >
      <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden rounded-lg">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardHeader className="pb-2 pt-8">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 shadow-sm">
              <Users className="h-6 w-6 text-blue-800 dark:text-blue-300" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Register Customer
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 mt-1.5">
                Enter customer details to create a profile for bookings and invoicing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Customer Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                placeholder="John Doe"
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.customerName}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                placeholder="123 Main St"
              />
              {errors.address && (
                <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.address}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-gray-700 dark:text-gray-300 font-medium">Postcode</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                  placeholder="12345"
                />
                {errors.postcode && (
                  <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.postcode}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="area" className="text-gray-700 dark:text-gray-300 font-medium">Area</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                  placeholder="Downtown"
                />
                {errors.area && (
                  <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.area}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-700 dark:text-gray-300 font-medium">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                  placeholder="California"
                />
                {errors.state && (
                  <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.state}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                  placeholder="+1 234 567 8900"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerType" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Customer Type
              </Label>
              <Select
                name="customerType"
                value={formData.customerType}
                onValueChange={(value) => handleSelectChange("customerType", value)}
              >
                <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm">
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="individual" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Individual</SelectItem>
                  <SelectItem value="corporate" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creditLimit" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Credit Limit (Optional)
              </Label>
              <Input
                id="creditLimit"
                name="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={handleChange}
                className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                placeholder="1000"
              />
              {errors.creditLimit && (
                <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.creditLimit}
                </p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Set a maximum credit amount for this customer
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 min-h-28 rounded-md shadow-sm"
                placeholder="Special instructions or comments"
              />
            </div>
            
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3.5 shadow-sm">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {errors.submit}
                </p>
              </div>
            )}
            
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 h-12 rounded-md font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register Customer"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerRegister;