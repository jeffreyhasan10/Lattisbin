import React, { useState, useMemo, useEffect } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  X,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  ArrowLeft,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  address: string;
  area: string;
  state: string;
  phoneNumbers: string[];
  email: string;
  postcode: string;
  companyRegisterNumber: string;
  identityDocument: string; // IC or Passport
  gstNumber: string;
  sstNumber: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface Booking {
  id: string;
  date: string;
  status: "completed" | "in-progress" | "cancelled";
  type: string;
  amount: number;
  description: string;
}

const malaysianStates = [
  "Johor", "Kedah", "Kelantan", "Malacca", "Negeri Sembilan", 
  "Pahang", "Penang", "Perak", "Perlis", "Sabah", "Sarawak", 
  "Selangor", "Terengganu", "Kuala Lumpur", "Labuan", "Putrajaya"
];

const CustomerManagement: React.FC = () => {
  // Sample data - in real app this would come from API
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Tech Solutions Sdn Bhd",
      address: "123 Jalan Technology",
      area: "Cyberjaya",
      state: "Selangor",
      phoneNumbers: ["+60123456789", "+60387654321"],
      email: "info@techsolutions.com.my",
      postcode: "63000",
      companyRegisterNumber: "202301234567",
      identityDocument: "IC: 880123-10-5678",
      gstNumber: "GST-2023-001234",
      sstNumber: "SST-2023-005678",
      createdAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Global Logistics Malaysia Sdn Bhd",
      address: "456 Jalan Logistics Park",
      area: "Shah Alam",
      state: "Selangor",
      phoneNumbers: ["+60198765432"],
      email: "contact@globallogistics.my",
      postcode: "40000",
      companyRegisterNumber: "202201987654",
      identityDocument: "Passport: A12345678",
      gstNumber: "GST-2022-009876",
      sstNumber: "SST-2022-004321",
      createdAt: "2024-02-20",
      status: "active"
    }
  ]);

  // Sample bookings data
  const [companyBookings] = useState<Record<string, Booking[]>>({
    "1": [
      { id: "B001", date: "2024-10-05", status: "completed", type: "Waste Collection", amount: 1500, description: "Regular waste disposal - 5 bins" },
      { id: "B002", date: "2024-09-28", status: "completed", type: "Bin Delivery", amount: 800, description: "Delivered 3 new bins" },
      { id: "B003", date: "2024-09-15", status: "completed", type: "Waste Collection", amount: 1200, description: "Special collection service" },
      { id: "B004", date: "2024-10-10", status: "in-progress", type: "Waste Collection", amount: 1500, description: "Scheduled collection" },
    ],
    "2": [
      { id: "B005", date: "2024-10-01", status: "completed", type: "Waste Collection", amount: 2500, description: "Industrial waste disposal" },
      { id: "B006", date: "2024-09-20", status: "completed", type: "Bin Rental", amount: 1800, description: "Monthly bin rental" },
      { id: "B007", date: "2024-10-08", status: "in-progress", type: "Waste Collection", amount: 2200, description: "Scheduled collection" },
    ]
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    address: "",
    area: "",
    state: "",
    phoneNumbers: [""],
    email: "",
    postcode: "",
    companyRegisterNumber: "",
    identityDocument: "",
    gstNumber: "",
    sstNumber: "",
    status: "active"
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtered and searched companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.companyRegisterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = stateFilter === "all" || company.state === stateFilter;
      const matchesStatus = statusFilter === "all" || company.status === statusFilter;

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [companies, searchQuery, stateFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, stateFilter, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      area: "",
      state: "",
      phoneNumbers: [""],
      email: "",
      postcode: "",
      companyRegisterNumber: "",
      identityDocument: "",
      gstNumber: "",
      sstNumber: "",
      status: "active"
    });
    setErrors({});
    setIsEditMode(false);
    setSelectedCompany(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.area?.trim()) newErrors.area = "Area is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.postcode?.trim()) newErrors.postcode = "Postcode is required";
    if (!formData.companyRegisterNumber?.trim()) newErrors.companyRegisterNumber = "Company register number is required";
    if (!formData.identityDocument?.trim()) newErrors.identityDocument = "Identity document is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone number validation
    if (!formData.phoneNumbers || formData.phoneNumbers.length === 0 || !formData.phoneNumbers[0]?.trim()) {
      newErrors.phoneNumbers = "At least one phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompany = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setFormData(company);
    setSelectedCompany(company);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (companyId: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success("Company deleted successfully");
    }
  };

  const handleSaveCompany = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (isEditMode && selectedCompany) {
      // Update existing company
      setCompanies(companies.map(c => 
        c.id === selectedCompany.id ? { ...formData as Company, id: selectedCompany.id } : c
      ));
      toast.success("Company updated successfully");
    } else {
      // Add new company
      const newCompany: Company = {
        ...formData as Company,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCompanies([...companies, newCompany]);
      toast.success("Company added successfully");
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...(formData.phoneNumbers || [""])];
    newPhoneNumbers[index] = value;
    setFormData({ ...formData, phoneNumbers: newPhoneNumbers });
  };

  const addPhoneNumber = () => {
    setFormData({ 
      ...formData, 
      phoneNumbers: [...(formData.phoneNumbers || [""]), ""] 
    });
  };

  const removePhoneNumber = (index: number) => {
    const newPhoneNumbers = (formData.phoneNumbers || []).filter((_, i) => i !== index);
    setFormData({ ...formData, phoneNumbers: newPhoneNumbers });
  };

  // Calculate stats for detail view
  const getCustomerStats = (companyId: string) => {
    const bookings = companyBookings[companyId] || [];
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === "completed").length;
    const totalSpent = bookings.reduce((sum, b) => sum + b.amount, 0);
    const recentBookings = bookings.slice(0, 5);
    return { totalBookings, completedBookings, totalSpent, recentBookings };
  };

  // If in detail view mode, show customer detail page
  if (viewMode === "detail" && selectedCompany) {
    const stats = getCustomerStats(selectedCompany.id);
    
    return (
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={handleBackToList}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customer List
        </Button>

        {/* Customer Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">{selectedCompany.name}</h1>
                  <Badge variant={selectedCompany.status === "active" ? "default" : "secondary"}>
                    {selectedCompany.status}
                  </Badge>
                </div>
                <p className="text-gray-600">Company Reg No: {selectedCompany.companyRegisterNumber}</p>
                <p className="text-sm text-gray-500">Customer since {new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
              </div>
              <Button 
                onClick={() => handleEditCompany(selectedCompany)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">RM {stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Monthly</p>
                  <p className="text-2xl font-bold text-gray-900">RM {Math.round(stats.totalSpent / 3).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal & Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600">Company Name</Label>
                <p className="font-medium text-gray-900">{selectedCompany.name}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-gray-600">Address</Label>
                <p className="font-medium text-gray-900">{selectedCompany.address}</p>
                <p className="text-gray-700">{selectedCompany.area}, {selectedCompany.state} {selectedCompany.postcode}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Area</Label>
                  <p className="font-medium text-gray-900">{selectedCompany.area}</p>
                </div>
                <div>
                  <Label className="text-gray-600">State</Label>
                  <p className="font-medium text-gray-900">{selectedCompany.state}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Numbers
                </Label>
                {selectedCompany.phoneNumbers.map((phone, idx) => (
                  <p key={idx} className="font-medium text-gray-900">{phone}</p>
                ))}
              </div>
              <Separator />
              <div>
                <Label className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <p className="font-medium text-gray-900">{selectedCompany.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Business Identifiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Business Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600">Company Register Number</Label>
                <p className="font-medium text-gray-900">{selectedCompany.companyRegisterNumber}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-gray-600">Identity Document</Label>
                <p className="font-medium text-gray-900">{selectedCompany.identityDocument}</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">GST Number</Label>
                  <p className="font-medium text-gray-900">{selectedCompany.gstNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-600">SST Number</Label>
                  <p className="font-medium text-gray-900">{selectedCompany.sstNumber}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-gray-600">Total Revenue</Label>
                <p className="text-2xl font-bold text-green-600">RM {stats.totalSpent.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Recent Bookings & Activities
              </CardTitle>
              <Button variant="outline" size="sm">
                View All Bookings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{booking.type}</h4>
                          <Badge 
                            variant={
                              booking.status === "completed" ? "default" : 
                              booking.status === "in-progress" ? "secondary" : 
                              "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{booking.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            RM {booking.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view mode
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Customer Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage all registered customers and their details
          </p>
        </div>
        <Button 
          onClick={handleAddCompany}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {malaysianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count and items per page */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredCompanies.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length} customers
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="itemsPerPage" className="text-sm text-gray-600 whitespace-nowrap">Show:</Label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 text-center mb-4">
                {searchQuery || stateFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first company"}
              </p>
              {!searchQuery && stateFilter === "all" && statusFilter === "all" && (
                <Button onClick={handleAddCompany} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          currentCompanies.map(company => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Company Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {company.name}
                          <Badge variant={company.status === "active" ? "default" : "secondary"}>
                            {company.status}
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Reg No: {company.companyRegisterNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{company.area}, {company.state}</p>
                          <p className="text-gray-600">{company.address}</p>
                          <p className="text-gray-600">Postcode: {company.postcode}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          {company.phoneNumbers.map((phone, idx) => (
                            <p key={idx} className="text-gray-900">{phone}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-900">{company.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-600">Identity: {company.identityDocument}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-600">GST: {company.gstNumber}</p>
                          <p className="text-gray-600">SST: {company.sstNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCompany(company)}
                      className="flex-1 lg:flex-none lg:w-24"
                    >
                      <Eye className="w-4 h-4 lg:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCompany(company)}
                      className="flex-1 lg:flex-none lg:w-24"
                    >
                      <Edit className="w-4 h-4 lg:mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                      className="flex-1 lg:flex-none lg:w-24 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 lg:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>

        {/* Pagination */}
        {filteredCompanies.length > 0 && totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="h-9 w-9 p-0 hidden sm:inline-flex"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Company Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {isEditMode ? "Edit Company" : "Add New Company"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update the company information below. All fields marked with * are required."
                : "Fill in the company details below. All fields marked with * are required."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <div className="space-y-6 py-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={3}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              {/* Area, State, Postcode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    value={formData.area || ""}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g., Cyberjaya"
                    className={errors.area ? "border-red-500" : ""}
                  />
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select 
                    value={formData.state || ""} 
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {malaysianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode || ""}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder="e.g., 63000"
                    className={errors.postcode ? "border-red-500" : ""}
                  />
                  {errors.postcode && <p className="text-sm text-red-500">{errors.postcode}</p>}
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                
                {/* Phone Numbers */}
                <div className="space-y-2">
                  <Label>Phone Numbers *</Label>
                  {(formData.phoneNumbers || [""]).map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                        placeholder="+60123456789"
                        className={errors.phoneNumbers ? "border-red-500" : ""}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePhoneNumber(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPhoneNumber}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Phone Number
                  </Button>
                  {errors.phoneNumbers && <p className="text-sm text-red-500">{errors.phoneNumbers}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="company@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <Separator />

              {/* Business Identifiers */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Business Identifiers</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="companyRegisterNumber">Company Register Number *</Label>
                  <Input
                    id="companyRegisterNumber"
                    value={formData.companyRegisterNumber || ""}
                    onChange={(e) => setFormData({ ...formData, companyRegisterNumber: e.target.value })}
                    placeholder="e.g., 202301234567"
                    className={errors.companyRegisterNumber ? "border-red-500" : ""}
                  />
                  {errors.companyRegisterNumber && <p className="text-sm text-red-500">{errors.companyRegisterNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identityDocument">Identity Card / Passport *</Label>
                  <Input
                    id="identityDocument"
                    value={formData.identityDocument || ""}
                    onChange={(e) => setFormData({ ...formData, identityDocument: e.target.value })}
                    placeholder="e.g., IC: 880123-10-5678 or Passport: A12345678"
                    className={errors.identityDocument ? "border-red-500" : ""}
                  />
                  {errors.identityDocument && <p className="text-sm text-red-500">{errors.identityDocument}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber || ""}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      placeholder="e.g., GST-2023-001234"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sstNumber">SST Number</Label>
                    <Input
                      id="sstNumber"
                      value={formData.sstNumber || ""}
                      onChange={(e) => setFormData({ ...formData, sstNumber: e.target.value })}
                      placeholder="e.g., SST-2023-005678"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || "active"} 
                  onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCompany}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isEditMode ? "Update Company" : "Save Company"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CustomerManagement;

