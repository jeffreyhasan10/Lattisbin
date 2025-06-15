import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Building2, CheckCircle, AlertCircle, Plus, List, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const BusinessRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    rocNumber: "",
    address: "",
    postcode: "",
    area: "",
    state: "",
    email: "",
    phoneNumber: "",
    contactPerson: "",
    contactPersonId: "",
    contactPersonIdType: "IC",
    contactPersonPassport: "",
    logo: null,
    branchName: "",
    businessType: "main",
    parentCompany: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [registeredBusinesses, setRegisteredBusinesses] = useState([
    {
      id: 1,
      companyName: "Lattis Bin Management Sdn Bhd",
      rocNumber: "202301234567",
      businessType: "main",
      status: "active",
      registeredDate: "2023-01-15"
    },
    {
      id: 2,
      companyName: "Lattis Waste Solutions Sdn Bhd",
      rocNumber: "202301234568", 
      businessType: "subsidiary",
      status: "active",
      registeredDate: "2023-06-20"
    },
    {
      id: 3,
      companyName: "Green Waste Management Sdn Bhd",
      rocNumber: "202301234569",
      businessType: "branch",
      status: "pending",
      registeredDate: "2024-01-10"
    }
  ]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.rocNumber || !/^[0-9A-Za-z-]+$/.test(formData.rocNumber))
      newErrors.rocNumber = "Valid ROC number is required (e.g., 12345678-A)";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.postcode || !/^\d{5}$/.test(formData.postcode))
      newErrors.postcode = "Valid 5-digit postcode is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phoneNumber || !/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      newErrors.phoneNumber = "Valid phone number is required (e.g., +1234567890)";
    if (!formData.contactPerson) newErrors.contactPerson = "Contact person name is required";
    
    if (formData.contactPersonIdType === "IC") {
      if (!formData.contactPersonId || !/^\d{6}-\d{2}-\d{4}$/.test(formData.contactPersonId))
        newErrors.contactPersonId = "Valid IC number is required (e.g., 123456-12-1234)";
    } else {
      if (!formData.contactPersonPassport)
        newErrors.contactPersonPassport = "Passport number is required";
    }

    if (formData.logo && !["image/png", "image/jpeg"].includes(formData.logo.type))
      newErrors.logo = "Logo must be a PNG or JPEG image";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setErrors((prev) => ({ ...prev, logo: null }));
    } else {
      setErrors((prev) => ({ ...prev, logo: "Please upload a valid PNG or JPEG image" }));
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBusiness = {
        id: registeredBusinesses.length + 1,
        companyName: formData.companyName,
        rocNumber: formData.rocNumber,
        businessType: formData.businessType,
        status: "pending",
        registeredDate: new Date().toISOString().split('T')[0]
      };
      
      setRegisteredBusinesses(prev => [...prev, newBusiness]);
      
      console.log("Submitting business data:", {
        ...formData,
        logo: formData.logo ? formData.logo.name : null,
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setFormData({
          companyName: "",
          rocNumber: "",
          address: "",
          postcode: "",
          area: "",
          state: "",
          email: "",
          phoneNumber: "",
          contactPerson: "",
          contactPersonId: "",
          contactPersonIdType: "IC",
          contactPersonPassport: "",
          logo: null,
          branchName: "",
          businessType: "main",
          parentCompany: "",
        });
        setErrors({});
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting business data:", error);
      setErrors({ submit: "Failed to register business. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6"
      >
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 shadow-2xl border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600" />
            <CardContent className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6"
              >
                <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Business Registered Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
                Your business has been registered and is now pending approval. You'll receive a confirmation email shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register Another Business
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 px-6 py-3"
                >
                  <List className="h-4 w-4 mr-2" />
                  View All Businesses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Business Registration</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Register new business entity</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="lg:hidden"
          >
            <List className="h-4 w-4 mr-2" />
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {registeredBusinesses.length}
            </Badge>
          </Button>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
            <div className="relative flex w-full max-w-sm flex-col bg-white dark:bg-gray-800 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registered Businesses</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {registeredBusinesses.map((business) => (
                  <div key={business.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                        {business.companyName}
                      </h4>
                      <Badge className={`text-xs ${
                        business.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {business.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ROC: {business.rocNumber}</p>
                    <div className="flex justify-between items-center">
                      <Badge className={`text-xs ${
                        business.businessType === 'main' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : business.businessType === 'subsidiary'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : business.businessType === 'branch'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
                      }`}>
                        {business.businessType}
                      </Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{business.registeredDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Registration</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Register and manage multiple business entities</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-4 py-2 text-base">
                {registeredBusinesses.length} Registered
              </Badge>
            </div>

            {/* Registration Form */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <CardHeader className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        New Business Registration
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                        Complete the form below to register a new business entity
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Type Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessType" className="text-gray-700 dark:text-gray-300 font-medium">
                          Business Type
                        </Label>
                        <Select 
                          value={formData.businessType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">Main Company</SelectItem>
                            <SelectItem value="subsidiary">Subsidiary</SelectItem>
                            <SelectItem value="branch">Branch Office</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(formData.businessType === "subsidiary" || formData.businessType === "branch") && (
                        <div className="space-y-2">
                          <Label htmlFor="parentCompany" className="text-gray-700 dark:text-gray-300 font-medium">
                            Parent Company
                          </Label>
                          <Select 
                            value={formData.parentCompany} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, parentCompany: value }))}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select parent company" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lattis-main">Lattis Bin Management Sdn Bhd</SelectItem>
                              <SelectItem value="lattis-waste">Lattis Waste Solutions Sdn Bhd</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Company Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300 font-medium">
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="Enter company name"
                        />
                        {errors.companyName && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.companyName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rocNumber" className="text-gray-700 dark:text-gray-300 font-medium">
                          ROC Number
                        </Label>
                        <Input
                          id="rocNumber"
                          name="rocNumber"
                          value={formData.rocNumber}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="12345678-A"
                        />
                        {errors.rocNumber && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.rocNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Address Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="123 Main St"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.address}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="postcode" className="text-gray-700 dark:text-gray-300 font-medium">
                            Postcode
                          </Label>
                          <Input
                            id="postcode"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleChange}
                            className="h-11"
                            placeholder="12345"
                          />
                          {errors.postcode && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" /> {errors.postcode}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="area" className="text-gray-700 dark:text-gray-300 font-medium">
                            Area
                          </Label>
                          <Input
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="h-11"
                            placeholder="Downtown"
                          />
                          {errors.area && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" /> {errors.area}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-gray-700 dark:text-gray-300 font-medium">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="h-11"
                            placeholder="Johor"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" /> {errors.state}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="contact@company.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300 font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="+60 7-1234 5678"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Contact Person Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson" className="text-gray-700 dark:text-gray-300 font-medium">
                          Contact Person
                        </Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="John Doe"
                        />
                        {errors.contactPerson && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.contactPerson}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPersonIdType" className="text-gray-700 dark:text-gray-300 font-medium">
                          ID Type
                        </Label>
                        <Select 
                          value={formData.contactPersonIdType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, contactPersonIdType: value }))}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IC">Identity Card (IC)</SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.contactPersonIdType === "IC" ? (
                        <>
                          <Label htmlFor="contactPersonId" className="text-gray-700 dark:text-gray-300 font-medium">
                            Identity Card Number
                          </Label>
                          <Input
                            id="contactPersonId"
                            name="contactPersonId"
                            value={formData.contactPersonId}
                            onChange={handleChange}
                            className="h-11"
                            placeholder="123456-12-1234"
                          />
                          {errors.contactPersonId && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" /> {errors.contactPersonId}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <Label htmlFor="contactPersonPassport" className="text-gray-700 dark:text-gray-300 font-medium">
                            Passport Number
                          </Label>
                          <Input
                            id="contactPersonPassport"
                            name="contactPersonPassport"
                            value={formData.contactPersonPassport}
                            onChange={handleChange}
                            className="h-11"
                            placeholder="A12345678"
                          />
                          {errors.contactPersonPassport && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" /> {errors.contactPersonPassport}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Optional Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="branchName" className="text-gray-700 dark:text-gray-300 font-medium">
                          Branch Name (Optional)
                        </Label>
                        <Input
                          id="branchName"
                          name="branchName"
                          value={formData.branchName}
                          onChange={handleChange}
                          className="h-11"
                          placeholder="Main Branch"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Specify branch name for multiple locations
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="logo" className="text-gray-700 dark:text-gray-300 font-medium">
                          Company Logo (Optional)
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            id="logo"
                            name="logo"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="h-11 flex-1 sm:flex-none"
                            onClick={() => document.getElementById("logo").click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                          {formData.logo && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="truncate max-w-32 sm:max-w-48">{formData.logo.name}</span>
                            </div>
                          )}
                        </div>
                        {errors.logo && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.logo}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {errors.submit && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                        <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" /> {errors.submit}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-medium"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering Business...
                          </span>
                        ) : (
                          <>
                            <Building2 className="h-5 w-5 mr-2" />
                            Register Business
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 xl:w-96 p-8 pl-0">
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 sticky top-8 max-h-[calc(100vh-4rem)] overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Registered Businesses
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your business portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto max-h-96">
                {registeredBusinesses.map((business) => (
                  <div key={business.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-5">
                        {business.companyName}
                      </h4>
                      <Badge className={`text-xs ${
                        business.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {business.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      ROC: {business.rocNumber}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className={`text-xs ${
                        business.businessType === 'main' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : business.businessType === 'subsidiary'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : business.businessType === 'branch'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
                      }`}>
                        {business.businessType}
                      </Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {business.registeredDate}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister;
