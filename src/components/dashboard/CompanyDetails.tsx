import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Building,
  Menu,
  ArrowLeft
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompanyDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [businessData, setBusinessData] = useState([
    {
      id: 1,
      name: "Lattis Bin Management Sdn Bhd",
      registrationNumber: "202301234567",
      address: "No. 123, Jalan Teknologi 3/1, Taman Sains Selangor 1, 81300 Skudai, Johor",
      phone: "+60 7-1234 5678",
      email: "info@lattisbin.com",
      website: "www.lattisbin.com",
      established: "2023",
      description: "Leading waste management and bin rental services provider in Malaysia, specializing in construction site waste solutions and sustainable disposal practices.",
      businessType: "main",
      status: "active",
      logo: null,
      employees: 150,
      revenue: "RM 2.5M",
      branches: 5
    },
    {
      id: 2,
      name: "Lattis Waste Solutions Sdn Bhd",
      registrationNumber: "202301234568",
      address: "No. 456, Jalan Industri 2/3, Kawasan Perindustrian Tebrau, 81100 Johor Bahru, Johor",
      phone: "+60 7-2345 6789",
      email: "solutions@lattiswaste.com",
      website: "www.lattiswaste.com",
      established: "2023",
      description: "Specialized waste processing and recycling solutions for industrial and commercial clients across Malaysia.",
      businessType: "subsidiary",
      status: "active",
      logo: null,
      employees: 85,
      revenue: "RM 1.8M",
      branches: 3
    },
    {
      id: 3,
      name: "Green Waste Management Sdn Bhd",
      registrationNumber: "202301234569",
      address: "No. 789, Jalan Eko Botani 3/7, Taman Eko Botani, 79100 Nusajaya, Johor",
      phone: "+60 7-3456 7890",
      email: "green@greenwaste.com",
      website: "www.greenwaste.com",
      established: "2024",
      description: "Eco-friendly waste management solutions focusing on sustainable disposal and recycling technologies.",
      businessType: "branch",
      status: "pending",
      logo: null,
      employees: 45,
      revenue: "RM 850K",
      branches: 2
    },
    {
      id: 4,
      name: "EcoClean Services Sdn Bhd",
      registrationNumber: "202301234570",
      address: "No. 321, Jalan Bestari 1/2, Taman Nusa Bestari, 81200 Johor Bahru, Johor",
      phone: "+60 7-4567 8901",
      email: "contact@ecoclean.com",
      website: "www.ecoclean.com",
      established: "2024",
      description: "Comprehensive cleaning and waste management services for residential and commercial properties.",
      businessType: "partnership",
      status: "active",
      logo: null,
      employees: 65,
      revenue: "RM 1.2M",
      branches: 4
    }
  ]);

  const currentBusiness = businessData[selectedBusiness];

  const handleSave = () => {
    setIsEditing(false);
    // In real app, this would save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const handleInputChange = (field, value) => {
    setBusinessData(prev => prev.map((business, index) => 
      index === selectedBusiness 
        ? { ...business, [field]: value }
        : business
    ));
  };

  const filteredBusinesses = businessData.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Company Portfolio</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentBusiness.name}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4 mr-2" />
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {businessData.length}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="relative flex w-full max-w-sm flex-col bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business List</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile Search and Filter */}
            <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10">
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredBusinesses.map((business, index) => (
                <div
                  key={business.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedBusiness === businessData.findIndex(b => b.id === business.id)
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => {
                    setSelectedBusiness(businessData.findIndex(b => b.id === business.id));
                    setShowSidebar(false);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                      {business.name}
                    </h4>
                    <Badge className={`text-xs ml-2 ${getStatusColor(business.status)}`}>
                      {business.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {business.registrationNumber}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className={`text-xs ${getBusinessTypeColor(business.businessType)}`}>
                      {business.businessType}
                    </Badge>
                    <span className="text-xs text-gray-400">{business.employees} emp.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 p-6 pr-0">
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Business List</CardTitle>
              {/* Search and Filter */}
              <div className="space-y-3 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10">
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
            </CardHeader>
            <CardContent className="space-y-3 overflow-y-auto max-h-96">
              {filteredBusinesses.map((business, index) => (
                <div
                  key={business.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                    selectedBusiness === businessData.findIndex(b => b.id === business.id)
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedBusiness(businessData.findIndex(b => b.id === business.id))}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-5">
                      {business.name}
                    </h4>
                    <Badge className={`text-xs ${getStatusColor(business.status)}`}>
                      {business.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {business.registrationNumber}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className={`text-xs ${getBusinessTypeColor(business.businessType)}`}>
                      {business.businessType}
                    </Badge>
                    <span className="text-xs text-gray-400">{business.employees} emp.</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Desktop Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Company Portfolio</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your business entities and their details</p>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-4 py-2 text-sm">
                {businessData.length} Companies
              </Badge>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Business Header Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {currentBusiness.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                        {currentBusiness.registrationNumber}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getStatusColor(currentBusiness.status)}>
                          {currentBusiness.status}
                        </Badge>
                        <Badge className={getBusinessTypeColor(currentBusiness.businessType)}>
                          {currentBusiness.businessType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {!isEditing ? (
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Details
                      </Button>
                      <Button variant="outline" size="icon" className="sm:w-auto">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                      <Button 
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Information Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Building className="h-5 w-5 text-blue-600" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
                    {isEditing ? (
                      <Input
                        id="companyName"
                        value={currentBusiness.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="h-11"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium py-2">{currentBusiness.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regNumber" className="text-sm font-medium">Registration Number</Label>
                    {isEditing ? (
                      <Input
                        id="regNumber"
                        value={currentBusiness.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        className="h-11"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium py-2">{currentBusiness.registrationNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={currentBusiness.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="min-h-[80px]"
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-start gap-2 py-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-900 dark:text-gray-100">{currentBusiness.address}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={currentBusiness.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-11"
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900 dark:text-gray-100">{currentBusiness.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={currentBusiness.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-11"
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900 dark:text-gray-100">{currentBusiness.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={currentBusiness.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="h-11"
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900 dark:text-gray-100">{currentBusiness.website}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="established" className="text-sm font-medium">Established</Label>
                    {isEditing ? (
                      <Input
                        id="established"
                        value={currentBusiness.established}
                        onChange={(e) => handleInputChange('established', e.target.value)}
                        className="h-11"
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900 dark:text-gray-100">{currentBusiness.established}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium">Business Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={currentBusiness.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="min-h-[100px]"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 py-2 leading-relaxed">{currentBusiness.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentBusiness.employees}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Employees</p>
                  <Badge className="mt-3 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5 this month
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600" />
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentBusiness.revenue}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Annual Revenue</p>
                  <Badge className="mt-3 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    Projected
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentBusiness.branches}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Branches</p>
                  <Badge className="mt-3 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
