
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Building2, CheckCircle, AlertCircle, Plus, Search, Filter, Edit3, Trash2, Eye, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    description: "",
    employees: "",
    revenue: "",
    branches: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [registeredBusinesses, setRegisteredBusinesses] = useState([
    {
      id: 1,
      companyName: "Lattis Bin Management Sdn Bhd",
      rocNumber: "202301234567",
      address: "No. 123, Jalan Teknologi 3/1, Taman Sains Selangor 1, 81300 Skudai, Johor",
      phone: "+60 7-1234 5678",
      email: "info@lattisbin.com",
      businessType: "main",
      status: "active",
      registeredDate: "2023-01-15",
      description: "Leading waste management and bin rental services provider in Malaysia.",
      employees: "150",
      revenue: "RM 2.5M",
      branches: "5"
    },
    {
      id: 2,
      companyName: "Lattis Waste Solutions Sdn Bhd",
      rocNumber: "202301234568", 
      address: "No. 456, Jalan Industri 2/3, Kawasan Perindustrian Tebrau, 81100 Johor Bahru, Johor",
      phone: "+60 7-2345 6789",
      email: "solutions@lattiswaste.com",
      businessType: "subsidiary",
      status: "active",
      registeredDate: "2023-06-20",
      description: "Specialized waste processing and recycling solutions for industrial clients.",
      employees: "85",
      revenue: "RM 1.8M",
      branches: "3"
    },
    {
      id: 3,
      companyName: "Green Waste Management Sdn Bhd",
      rocNumber: "202301234569",
      address: "No. 789, Jalan Eko Botani 3/7, Taman Eko Botani, 79100 Nusajaya, Johor",
      phone: "+60 7-3456 7890",
      email: "green@greenwaste.com",
      businessType: "branch",
      status: "pending",
      registeredDate: "2024-01-10",
      description: "Eco-friendly waste management solutions focusing on sustainable disposal.",
      employees: "45",
      revenue: "RM 850K",
      branches: "2"
    },
    {
      id: 4,
      companyName: "EcoClean Services Sdn Bhd",
      rocNumber: "202301234570",
      address: "No. 321, Jalan Bestari 1/2, Taman Nusa Bestari, 81200 Johor Bahru, Johor",
      phone: "+60 7-4567 8901",
      email: "contact@ecoclean.com",
      businessType: "partnership",
      status: "active",
      registeredDate: "2024-02-15",
      description: "Comprehensive cleaning and waste management services.",
      employees: "65",
      revenue: "RM 1.2M",
      branches: "4"
    }
  ]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.rocNumber || !/^[0-9A-Za-z-]+$/.test(formData.rocNumber))
      newErrors.rocNumber = "Valid ROC number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.postcode || !/^\d{5}$/.test(formData.postcode))
      newErrors.postcode = "Valid 5-digit postcode is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phoneNumber || !/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      newErrors.phoneNumber = "Valid phone number is required";
    if (!formData.contactPerson) newErrors.contactPerson = "Contact person name is required";
    
    if (formData.contactPersonIdType === "IC") {
      if (!formData.contactPersonId || !/^\d{6}-\d{2}-\d{4}$/.test(formData.contactPersonId))
        newErrors.contactPersonId = "Valid IC number is required";
    } else {
      if (!formData.contactPersonPassport)
        newErrors.contactPersonPassport = "Passport number is required";
    }
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

  const resetForm = () => {
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
      description: "",
      employees: "",
      revenue: "",
      branches: ""
    });
    setErrors({});
    setEditingBusiness(null);
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
      
      if (editingBusiness) {
        setRegisteredBusinesses(prev => prev.map(business => 
          business.id === editingBusiness.id 
            ? {
                ...business,
                ...formData,
                phone: formData.phoneNumber,
                registeredDate: business.registeredDate
              }
            : business
        ));
      } else {
        const newBusiness = {
          id: registeredBusinesses.length + 1,
          ...formData,
          phone: formData.phoneNumber,
          status: "pending",
          registeredDate: new Date().toISOString().split('T')[0]
        };
        setRegisteredBusinesses(prev => [...prev, newBusiness]);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting business data:", error);
      setErrors({ submit: "Failed to save business. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (business) => {
    setEditingBusiness(business);
    setFormData({
      companyName: business.companyName,
      rocNumber: business.rocNumber,
      address: business.address,
      postcode: business.postcode || "",
      area: business.area || "",
      state: business.state || "",
      email: business.email,
      phoneNumber: business.phone,
      contactPerson: business.contactPerson || "",
      contactPersonId: business.contactPersonId || "",
      contactPersonIdType: business.contactPersonIdType || "IC",
      contactPersonPassport: business.contactPersonPassport || "",
      logo: null,
      branchName: business.branchName || "",
      businessType: business.businessType,
      parentCompany: business.parentCompany || "",
      description: business.description || "",
      employees: business.employees || "",
      revenue: business.revenue || "",
      branches: business.branches || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setRegisteredBusinesses(prev => prev.filter(business => business.id !== id));
  };

  const filteredBusinesses = registeredBusinesses.filter(business => {
    const matchesSearch = business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.rocNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || business.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getBusinessTypeColor = (type) => {
    switch (type) {
      case 'main':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'subsidiary':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'branch':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'partnership':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Business Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Register and manage your business entities
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {editingBusiness ? 'Edit Business' : 'Register New Business'}
                </DialogTitle>
                <DialogDescription>
                  {editingBusiness ? 'Update business information below' : 'Complete the form below to register a new business entity'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Type Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                      <SelectTrigger>
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
                      <Label htmlFor="parentCompany">Parent Company</Label>
                      <Select value={formData.parentCompany} onValueChange={(value) => setFormData(prev => ({ ...prev, parentCompany: value }))}>
                        <SelectTrigger>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rocNumber">ROC Number</Label>
                    <Input
                      id="rocNumber"
                      name="rocNumber"
                      value={formData.rocNumber}
                      onChange={handleChange}
                      placeholder="12345678-A"
                    />
                    {errors.rocNumber && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.rocNumber}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Address Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                        placeholder="12345"
                      />
                      {errors.postcode && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.postcode}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Downtown"
                      />
                      {errors.area && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.area}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Johor"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+60 7-1234 5678"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Business Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employees">Employees</Label>
                    <Input
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Input
                      id="revenue"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleChange}
                      placeholder="RM 2.5M"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branches">Branches</Label>
                    <Input
                      id="branches"
                      name="branches"
                      value={formData.branches}
                      onChange={handleChange}
                      placeholder="5"
                    />
                  </div>
                </div>
                
                {/* Contact Person Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.contactPerson}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPersonIdType">ID Type</Label>
                    <Select value={formData.contactPersonIdType} onValueChange={(value) => setFormData(prev => ({ ...prev, contactPersonIdType: value }))}>
                      <SelectTrigger>
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
                      <Label htmlFor="contactPersonId">Identity Card Number</Label>
                      <Input
                        id="contactPersonId"
                        name="contactPersonId"
                        value={formData.contactPersonId}
                        onChange={handleChange}
                        placeholder="123456-12-1234"
                      />
                      {errors.contactPersonId && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.contactPersonId}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <Label htmlFor="contactPersonPassport">Passport Number</Label>
                      <Input
                        id="contactPersonPassport"
                        name="contactPersonPassport"
                        value={formData.contactPersonPassport}
                        onChange={handleChange}
                        placeholder="A12345678"
                      />
                      {errors.contactPersonPassport && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.contactPersonPassport}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your business activities..."
                    rows={3}
                  />
                </div>
                
                {/* Optional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name (Optional)</Label>
                    <Input
                      id="branchName"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleChange}
                      placeholder="Main Branch"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo (Optional)</Label>
                    <div className="flex gap-3">
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
                        className="flex-1"
                        onClick={() => document.getElementById("logo").click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      {formData.logo && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="truncate max-w-32">{formData.logo.name}</span>
                        </div>
                      )}
                    </div>
                    {errors.logo && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.logo}
                      </p>
                    )}
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> {errors.submit}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingBusiness ? 'Updating...' : 'Registering...'}
                      </span>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4 mr-2" />
                        {editingBusiness ? 'Update Business' : 'Register Business'}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-900">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business List */}
        <div className="grid gap-6">
          {filteredBusinesses.map((business) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {business.companyName}
                          </h3>
                          <Badge className={getStatusColor(business.status)}>
                            {business.status}
                          </Badge>
                          <Badge className={getBusinessTypeColor(business.businessType)}>
                            {business.businessType}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{business.rocNumber}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{business.address}</p>
                        {business.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">{business.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>📧 {business.email}</span>
                          <span>📞 {business.phone}</span>
                          <span>📅 {business.registeredDate}</span>
                        </div>
                        {business.employees && (
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-blue-600">👥 {business.employees} employees</span>
                            {business.revenue && <span className="text-green-600">💰 {business.revenue}</span>}
                            {business.branches && <span className="text-purple-600">🏢 {business.branches} branches</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(business)} className="flex-1 sm:flex-none">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(business)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(business.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-xl">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No businesses found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by registering your first business"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessRegister;
