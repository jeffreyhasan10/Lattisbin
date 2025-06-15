import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Building2, CheckCircle, AlertCircle, Plus, List } from "lucide-react";
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
        className="p-4 md:p-6 max-w-6xl mx-auto"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-800 dark:text-emerald-300" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Business Registered Successfully!</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md text-lg">
                Your business has been registered and is now pending approval. You'll receive a confirmation email shortly.
              </p>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register Another Business
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 px-8 py-3"
                >
                  <List className="h-4 w-4 mr-2" />
                  View All Businesses
                </Button>
              </div>
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
      className="p-4 md:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Registration</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Register and manage multiple business entities</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-4 py-2">
            {registeredBusinesses.length} Registered
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                    <Building2 className="h-6 w-6 text-blue-800 dark:text-blue-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      New Business Registration
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      Complete the form below to register a new business entity
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Type Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-gray-700 dark:text-gray-300 font-medium">Business Type</Label>
                      <Select 
                        value={formData.businessType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
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
                        <Label htmlFor="parentCompany" className="text-gray-700 dark:text-gray-300 font-medium">Parent Company</Label>
                        <Select 
                          value={formData.parentCompany} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, parentCompany: value }))}
                        >
                          <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300 font-medium">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter company name"
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.companyName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rocNumber" className="text-gray-700 dark:text-gray-300 font-medium">ROC Number</Label>
                      <Input
                        id="rocNumber"
                        name="rocNumber"
                        value={formData.rocNumber}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12345678-A"
                      />
                      {errors.rocNumber && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.rocNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* ... keep existing code (address, contact details, etc.) */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 Main St"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.address}
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
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12345"
                      />
                      {errors.postcode && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.postcode}
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
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Downtown"
                      />
                      {errors.area && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.area}
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
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Johor"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contact@company.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300 font-medium">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+60 7-1234 5678"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-gray-700 dark:text-gray-300 font-medium">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                      {errors.contactPerson && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.contactPerson}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonIdType" className="text-gray-700 dark:text-gray-300 font-medium">ID Type</Label>
                      <Select 
                        value={formData.contactPersonIdType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, contactPersonIdType: value }))}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
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
                        <Label htmlFor="contactPersonId" className="text-gray-700 dark:text-gray-300 font-medium">Identity Card Number</Label>
                        <Input
                          id="contactPersonId"
                          name="contactPersonId"
                          value={formData.contactPersonId}
                          onChange={handleChange}
                          className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
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
                        <Label htmlFor="contactPersonPassport" className="text-gray-700 dark:text-gray-300 font-medium">Passport Number</Label>
                        <Input
                          id="contactPersonPassport"
                          name="contactPersonPassport"
                          value={formData.contactPersonPassport}
                          onChange={handleChange}
                          className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="branchName" className="text-gray-700 dark:text-gray-300 font-medium">Branch Name (Optional)</Label>
                    <Input
                      id="branchName"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Main Branch"
                    />
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      Specify branch name for multiple locations
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-gray-700 dark:text-gray-300 font-medium">Company Logo (Optional)</Label>
                    <div className="mt-1 flex items-center gap-2">
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
                        className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                        onClick={() => document.getElementById("logo").click()}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Logo</span>
                      </Button>
                      {formData.logo && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {formData.logo.name}
                        </span>
                      )}
                    </div>
                    {errors.logo && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.logo}
                      </p>
                    )}
                  </div>
                  
                  {errors.submit && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {errors.submit}
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 h-12 transition-all duration-200 font-medium"
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
                          <Building2 className="h-4 w-4 mr-2" />
                          Register Business
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Registered Businesses Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Registered Businesses
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your business portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {registeredBusinesses.map((business) => (
                  <div key={business.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{business.companyName}</h4>
                      <Badge className={`text-xs ${
                        business.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {business.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ROC: {business.rocNumber}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{business.businessType}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Registered: {business.registeredDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessRegister;
