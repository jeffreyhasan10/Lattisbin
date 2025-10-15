import React, { useState, useMemo, useEffect } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Upload,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Landmark,
  Calendar,
  User,
  BadgeCheck,
  Receipt,
  Image as ImageIcon,
  BarChart3,
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
  contactPerson: string;
  contactPersonIdType: "IC" | "Passport";
  contactPersonId: string;
  contactPersonPassport: string;
  gstNumber: string;
  sstNumber: string;
  businessType: "main" | "subsidiary" | "branch" | "partnership";
  parentCompany?: string;
  description: string;
  employees: string;
  revenue: string;
  branches: string;
  logo: File | null;
  branchName?: string;
  createdAt: string;
  status: "active" | "inactive" | "pending";
}

const malaysianStates = [
  "Johor", "Kedah", "Kelantan", "Malacca", "Negeri Sembilan", 
  "Pahang", "Penang", "Perak", "Perlis", "Sabah", "Sarawak", 
  "Selangor", "Terengganu", "Kuala Lumpur", "Labuan", "Putrajaya"
];

const CompanyManagement: React.FC = () => {
  // Sample data - in real app this would come from API
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Lattis Bin Management Sdn Bhd",
      address: "No. 123, Jalan Teknologi 3/1, Taman Sains Selangor 1",
      area: "Skudai",
      state: "Johor",
      phoneNumbers: ["+60 7-1234 5678"],
      email: "info@lattisbin.com",
      postcode: "81300",
      companyRegisterNumber: "202301234567",
      contactPerson: "Ahmad bin Abdullah",
      contactPersonIdType: "IC",
      contactPersonId: "880123-10-5678",
      contactPersonPassport: "",
      gstNumber: "GST-2023-001234",
      sstNumber: "SST-2023-005678",
      businessType: "main",
      description: "Leading waste management and bin rental services provider in Malaysia.",
      employees: "150",
      revenue: "RM 2.5M",
      branches: "5",
      logo: null,
      createdAt: "2023-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Lattis Waste Solutions Sdn Bhd",
      address: "No. 456, Jalan Industri 2/3, Kawasan Perindustrian Tebrau",
      area: "Johor Bahru",
      state: "Johor",
      phoneNumbers: ["+60 7-2345 6789"],
      email: "solutions@lattiswaste.com",
      postcode: "81100",
      companyRegisterNumber: "202301234568",
      contactPerson: "Siti Nurhaliza",
      contactPersonIdType: "IC",
      contactPersonId: "920515-01-2345",
      contactPersonPassport: "",
      gstNumber: "GST-2022-009876",
      sstNumber: "SST-2022-004321",
      businessType: "subsidiary",
      parentCompany: "Lattis Bin Management Sdn Bhd",
      description: "Specialized waste processing and recycling solutions for industrial clients.",
      employees: "85",
      revenue: "RM 1.8M",
      branches: "3",
      logo: null,
      createdAt: "2023-06-20",
      status: "active"
    },
    {
      id: "3",
      name: "Green Waste Management Sdn Bhd",
      address: "No. 789, Jalan Eko Botani 3/7, Taman Eko Botani",
      area: "Nusajaya",
      state: "Johor",
      phoneNumbers: ["+60 7-3456 7890"],
      email: "green@greenwaste.com",
      postcode: "79100",
      companyRegisterNumber: "202301234569",
      contactPerson: "Lee Chong Wei",
      contactPersonIdType: "Passport",
      contactPersonId: "",
      contactPersonPassport: "A12345678",
      gstNumber: "GST-2024-001122",
      sstNumber: "SST-2024-003344",
      businessType: "partnership",
      description: "Eco-friendly waste management solutions focusing on sustainable disposal.",
      employees: "45",
      revenue: "RM 850K",
      branches: "2",
      logo: null,
      createdAt: "2024-01-10",
      status: "pending"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
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
    contactPerson: "",
    contactPersonIdType: "IC",
    contactPersonId: "",
    contactPersonPassport: "",
    gstNumber: "",
    sstNumber: "",
    businessType: "main",
    parentCompany: "",
    description: "",
    employees: "",
    revenue: "",
    branches: "",
    logo: null,
    branchName: "",
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
      contactPerson: "",
      contactPersonIdType: "IC",
      contactPersonId: "",
      contactPersonPassport: "",
      gstNumber: "",
      sstNumber: "",
      businessType: "main",
      parentCompany: "",
      description: "",
      employees: "",
      revenue: "",
      branches: "",
      logo: null,
      branchName: "",
      status: "active"
    });
    setErrors({});
    setIsEditMode(false);
    setSelectedCompany(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.companyRegisterNumber?.trim() || !/^[0-9A-Za-z-]+$/.test(formData.companyRegisterNumber)) {
      newErrors.companyRegisterNumber = "Valid ROC number is required";
    }
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.postcode?.trim() || !/^\d{5}$/.test(formData.postcode)) {
      newErrors.postcode = "Valid 5-digit postcode is required";
    }
    if (!formData.area?.trim()) newErrors.area = "Area is required";
    if (!formData.state) newErrors.state = "State is required";
    
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
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumbers[0].replace(/\s/g, ""))) {
      newErrors.phoneNumbers = "Valid phone number is required";
    }

    // Contact person validation
    if (!formData.contactPerson?.trim()) newErrors.contactPerson = "Contact person name is required";
    
    if (formData.contactPersonIdType === "IC") {
      if (!formData.contactPersonId?.trim() || !/^\d{6}-\d{2}-\d{4}$/.test(formData.contactPersonId)) {
        newErrors.contactPersonId = "Valid IC number is required (format: 123456-12-1234)";
      }
    } else {
      if (!formData.contactPersonPassport?.trim()) {
        newErrors.contactPersonPassport = "Passport number is required";
      }
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
    setIsViewOpen(true);
  };

  const handleDeleteCompany = (companyId: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success("Company deleted successfully");
    }
  };

  const handleSaveCompany = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (isEditMode && selectedCompany) {
      // Update existing company
      setCompanies(companies.map(c => 
        c.id === selectedCompany.id ? { 
          ...formData as Company, 
          id: selectedCompany.id,
          createdAt: selectedCompany.createdAt 
        } : c
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setFormData({ ...formData, logo: file });
      setErrors((prev) => ({ ...prev, logo: "" }));
    } else {
      setErrors((prev) => ({ ...prev, logo: "Please upload a valid PNG or JPEG image" }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case 'main':
        return 'bg-blue-100 text-blue-800';
      case 'subsidiary':
        return 'bg-purple-100 text-purple-800';
      case 'branch':
        return 'bg-orange-100 text-orange-800';
      case 'partnership':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Manage Companies
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all registered companies and their details
          </p>
        </div>
        <Button 
          onClick={handleAddCompany}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Company
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or registration number..."
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
                Showing {filteredCompanies.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length} companies
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
                  : "Get started by registering your first company"}
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
                          <Badge className={getBusinessTypeColor(company.businessType)}>
                            {company.businessType}
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
                        <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-600">Contact: {company.contactPerson}</p>
                          <p className="text-gray-600">
                            {company.contactPersonIdType === "IC" 
                              ? `IC: ${company.contactPersonId}` 
                              : `Passport: ${company.contactPersonPassport}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-600">GST: {company.gstNumber}</p>
                          <p className="text-gray-600">SST: {company.sstNumber}</p>
                        </div>
                      </div>

                      {(company.employees || company.revenue || company.branches) && (
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            {company.employees && <p className="text-gray-600">Employees: {company.employees}</p>}
                            {company.revenue && <p className="text-gray-600">Revenue: {company.revenue}</p>}
                            {company.branches && <p className="text-gray-600">Branches: {company.branches}</p>}
                          </div>
                        </div>
                      )}
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
            <form onSubmit={handleSaveCompany} className="space-y-6 py-4">
              {/* Business Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select 
                    value={formData.businessType || "main"} 
                    onValueChange={(value: "main" | "subsidiary" | "branch" | "partnership") => 
                      setFormData({ ...formData, businessType: value })
                    }
                  >
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
                    <Input
                      id="parentCompany"
                      value={formData.parentCompany || ""}
                      onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
                      placeholder="Enter parent company name"
                    />
                  </div>
                )}
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter company name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyRegisterNumber">ROC Number *</Label>
                  <Input
                    id="companyRegisterNumber"
                    value={formData.companyRegisterNumber || ""}
                    onChange={(e) => setFormData({ ...formData, companyRegisterNumber: e.target.value })}
                    placeholder="12345678-A"
                    className={errors.companyRegisterNumber ? "border-red-500" : ""}
                  />
                  {errors.companyRegisterNumber && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.companyRegisterNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    rows={3}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={formData.postcode || ""}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      placeholder="12345"
                      className={errors.postcode ? "border-red-500" : ""}
                    />
                    {errors.postcode && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.postcode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area *</Label>
                    <Input
                      id="area"
                      value={formData.area || ""}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Downtown"
                      className={errors.area ? "border-red-500" : ""}
                    />
                    {errors.area && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.area}
                      </p>
                    )}
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
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumbers?.[0] || ""}
                    onChange={(e) => handlePhoneNumberChange(0, e.target.value)}
                    placeholder="+60 7-1234 5678"
                    className={errors.phoneNumbers ? "border-red-500" : ""}
                  />
                  {errors.phoneNumbers && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phoneNumbers}
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
                    value={formData.employees || ""}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Annual Revenue</Label>
                  <Input
                    id="revenue"
                    value={formData.revenue || ""}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    placeholder="RM 2.5M"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branches">Branches</Label>
                  <Input
                    id="branches"
                    value={formData.branches || ""}
                    onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Contact Person Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson || ""}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="John Doe"
                    className={errors.contactPerson ? "border-red-500" : ""}
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.contactPerson}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPersonIdType">ID Type *</Label>
                  <Select 
                    value={formData.contactPersonIdType || "IC"} 
                    onValueChange={(value: "IC" | "Passport") => 
                      setFormData({ ...formData, contactPersonIdType: value })
                    }
                  >
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
                    <Label htmlFor="contactPersonId">Identity Card Number *</Label>
                    <Input
                      id="contactPersonId"
                      value={formData.contactPersonId || ""}
                      onChange={(e) => setFormData({ ...formData, contactPersonId: e.target.value })}
                      placeholder="123456-12-1234"
                      className={errors.contactPersonId ? "border-red-500" : ""}
                    />
                    {errors.contactPersonId && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.contactPersonId}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Label htmlFor="contactPersonPassport">Passport Number *</Label>
                    <Input
                      id="contactPersonPassport"
                      value={formData.contactPersonPassport || ""}
                      onChange={(e) => setFormData({ ...formData, contactPersonPassport: e.target.value })}
                      placeholder="A12345678"
                      className={errors.contactPersonPassport ? "border-red-500" : ""}
                    />
                    {errors.contactPersonPassport && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.contactPersonPassport}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Tax Information */}
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    value={formData.branchName || ""}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="Main Branch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Company Logo (Optional)
                  </Label>
                  <div className="flex flex-col gap-3">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => document.getElementById("logo")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {formData.logo ? "Change Logo" : "Upload Logo"}
                    </Button>
                    {formData.logo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 px-3 py-2 rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="truncate flex-1">{formData.logo.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, logo: null })}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.logo}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Accepted formats: PNG, JPEG (Max 5MB)</p>
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || "active"} 
                  onValueChange={(value: "active" | "inactive" | "pending") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {errors.submit}
                  </p>
                </div>
              )}
            </form>
          </ScrollArea>

          {/* Dialog Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleSaveCompany()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Building2 className="h-4 w-4 mr-2" />
              {isEditMode ? "Update Company" : "Register Company"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Company Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <ScrollArea className="max-h-[calc(90vh-200px)]">
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h3>
                  <Badge variant={selectedCompany.status === "active" ? "default" : "secondary"}>
                    {selectedCompany.status}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Register Number</p>
                    <p className="font-medium text-gray-900">{selectedCompany.companyRegisterNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Type</p>
                    <Badge className={getBusinessTypeColor(selectedCompany.businessType)}>
                      {selectedCompany.businessType}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Address Information
                  </h4>
                  <p className="font-medium text-gray-900">{selectedCompany.address}</p>
                  <p className="text-gray-700 mt-1">{selectedCompany.area}, {selectedCompany.state} {selectedCompany.postcode}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Numbers</p>
                      {selectedCompany.phoneNumbers.map((phone, idx) => (
                        <p key={idx} className="font-medium text-gray-900 flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {phone}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {selectedCompany.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Contact Person
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-medium text-gray-900">{selectedCompany.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                        <BadgeCheck className="h-3 w-3 text-gray-400" />
                        {selectedCompany.contactPersonIdType === "IC" ? "IC Number" : "Passport Number"}
                      </p>
                      <p className="font-medium text-gray-900">
                        {selectedCompany.contactPersonIdType === "IC" 
                          ? selectedCompany.contactPersonId 
                          : selectedCompany.contactPersonPassport}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-blue-600" />
                    Tax Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">GST Number</p>
                      <p className="font-medium text-gray-900">{selectedCompany.gstNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">SST Number</p>
                      <p className="font-medium text-gray-900">{selectedCompany.sstNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {(selectedCompany.employees || selectedCompany.revenue || selectedCompany.branches) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        Business Statistics
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedCompany.employees && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-blue-600" />
                              <p className="text-sm text-gray-600">Employees</p>
                            </div>
                            <p className="font-semibold text-blue-600 text-lg">{selectedCompany.employees}</p>
                          </div>
                        )}
                        {selectedCompany.revenue && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <p className="text-sm text-gray-600">Annual Revenue</p>
                            </div>
                            <p className="font-semibold text-green-600 text-lg">{selectedCompany.revenue}</p>
                          </div>
                        )}
                        {selectedCompany.branches && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Landmark className="h-4 w-4 text-purple-600" />
                              <p className="text-sm text-gray-600">Branches</p>
                            </div>
                            <p className="font-semibold text-purple-600 text-lg">{selectedCompany.branches}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {selectedCompany.description && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Business Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {selectedCompany.description}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Registration Information
                  </h4>
                  <p className="text-sm text-gray-600">Registered Date</p>
                  <p className="font-medium text-gray-900">{new Date(selectedCompany.createdAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewOpen(false);
                if (selectedCompany) handleEditCompany(selectedCompany);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;

