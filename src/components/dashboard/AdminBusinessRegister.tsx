
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Mail, Upload, CheckCircle, AlertCircle, Plus, Search, Eye, Settings } from "lucide-react";
import { toast } from "sonner";
import BusinessDocumentUpload from "./BusinessDocumentUpload";
import BusinessLocationManager from "./BusinessLocationManager";
import ROCValidationService from "./ROCValidationService";

interface Business {
  id: string;
  companyName: string;
  rocNumber: string;
  businessType: string;
  registrationDate: string;
  verificationStatus: "pending" | "verified" | "rejected";
  totalLocations: number;
  totalEmployees: number;
  annualRevenue: string;
  contactPerson: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  headquarters: {
    address: string;
    city: string;
    state: string;
    postcode: string;
    coordinates?: string;
  };
  documents: {
    ssmCertificate: boolean;
    businessLicense: boolean;
    taxRegistration: boolean;
    bankStatement: boolean;
  };
}

interface BusinessLocation {
  id: string;
  locationType: "Headquarters" | "Branch" | "Warehouse" | "Service Point";
  address: string;
  city: string;
  state: string;
  postcode: string;
  coordinates?: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
}

const AdminBusinessRegister: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: "BIZ001",
      companyName: "ABC Construction Sdn Bhd",
      rocNumber: "202301234567",
      businessType: "Construction & Engineering",
      registrationDate: "2023-01-15",
      verificationStatus: "verified",
      totalLocations: 3,
      totalEmployees: 45,
      annualRevenue: "RM 2.5M",
      contactPerson: {
        name: "Ahmad Rahman",
        position: "Managing Director",
        phone: "+60 12-345 6789",
        email: "ahmad@abc-construction.com"
      },
      headquarters: {
        address: "123 Jalan Industri, Taman Perindustrian",
        city: "Shah Alam",
        state: "Selangor",
        postcode: "40000",
        coordinates: "3.0738,101.5183"
      },
      documents: {
        ssmCertificate: true,
        businessLicense: true,
        taxRegistration: true,
        bankStatement: true
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showROCModal, setShowROCModal] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newBusiness, setNewBusiness] = useState({
    companyName: "",
    rocNumber: "",
    businessType: "",
    contactName: "",
    contactPosition: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    city: "",
    state: "",
    postcode: ""
  });

  const businessTypes = [
    "Construction & Engineering",
    "Manufacturing",
    "Trading & Import/Export",
    "Services",
    "Technology",
    "Healthcare",
    "Education",
    "Hospitality",
    "Transportation",
    "Agriculture"
  ];

  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan",
    "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

  const handleAddBusiness = () => {
    if (!newBusiness.companyName || !newBusiness.rocNumber || !newBusiness.contactPhone) {
      toast.error("Please fill in required fields");
      return;
    }

    const business: Business = {
      id: `BIZ${String(businesses.length + 1).padStart(3, '0')}`,
      companyName: newBusiness.companyName,
      rocNumber: newBusiness.rocNumber,
      businessType: newBusiness.businessType || "Services",
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: "pending",
      totalLocations: 1,
      totalEmployees: 0,
      annualRevenue: "Undisclosed",
      contactPerson: {
        name: newBusiness.contactName,
        position: newBusiness.contactPosition,
        phone: newBusiness.contactPhone,
        email: newBusiness.contactEmail
      },
      headquarters: {
        address: newBusiness.address,
        city: newBusiness.city,
        state: newBusiness.state,
        postcode: newBusiness.postcode
      },
      documents: {
        ssmCertificate: false,
        businessLicense: false,
        taxRegistration: false,
        bankStatement: false
      }
    };

    setBusinesses([...businesses, business]);
    toast.success("Business registered successfully");
    setShowAddModal(false);
    setNewBusiness({
      companyName: "",
      rocNumber: "",
      businessType: "",
      contactName: "",
      contactPosition: "",
      contactPhone: "",
      contactEmail: "",
      address: "",
      city: "",
      state: "",
      postcode: ""
    });
  };

  const handleDocumentUpload = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowDocumentModal(true);
  };

  const handleLocationManagement = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowLocationModal(true);
  };

  const handleROCValidationClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowROCModal(true);
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.rocNumber.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || business.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDocumentUpdate = (documents: any[]) => {
    // Update business documents
    setBusinesses(prev => prev.map(business => 
      business.id === selectedBusinessId 
        ? { ...business, documents: { ...business.documents, ssmCertificate: true } }
        : business
    ));
  };

  const handleLocationUpdate = (locations: BusinessLocation[]) => {
    // Update business locations
    setBusinesses(prev => prev.map(business => 
      business.id === selectedBusinessId 
        ? { ...business, totalLocations: locations.length }
        : business
    ));
  };

  const handleROCValidationResult = (result: any) => {
    if (result?.isValid) {
      setBusinesses(prev => prev.map(business => 
        business.id === selectedBusinessId 
          ? { ...business, verificationStatus: "verified" as const }
          : business
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            Business Registration & Management
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive business registration with ROC validation and document management</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Register Business
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register New Business</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 space-y-2">
              <div className="col-span-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={newBusiness.companyName}
                  onChange={(e) => setNewBusiness(prev => ({...prev, companyName: e.target.value}))}
                  placeholder="ABC Construction Sdn Bhd"
                />
              </div>
              <div>
                <Label htmlFor="rocNumber">ROC Number *</Label>
                <Input
                  id="rocNumber"
                  value={newBusiness.rocNumber}
                  onChange={(e) => setNewBusiness(prev => ({...prev, rocNumber: e.target.value}))}
                  placeholder="202301234567"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={newBusiness.businessType} onValueChange={(value) => setNewBusiness(prev => ({...prev, businessType: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactName">Contact Person *</Label>
                <Input
                  id="contactName"
                  value={newBusiness.contactName}
                  onChange={(e) => setNewBusiness(prev => ({...prev, contactName: e.target.value}))}
                  placeholder="Ahmad Rahman"
                />
              </div>
              <div>
                <Label htmlFor="contactPosition">Position</Label>
                <Input
                  id="contactPosition"
                  value={newBusiness.contactPosition}
                  onChange={(e) => setNewBusiness(prev => ({...prev, contactPosition: e.target.value}))}
                  placeholder="Managing Director"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  value={newBusiness.contactPhone}
                  onChange={(e) => setNewBusiness(prev => ({...prev, contactPhone: e.target.value}))}
                  placeholder="+60 12-345 6789"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newBusiness.contactEmail}
                  onChange={(e) => setNewBusiness(prev => ({...prev, contactEmail: e.target.value}))}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Headquarters Address</Label>
                <Input
                  id="address"
                  value={newBusiness.address}
                  onChange={(e) => setNewBusiness(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Jalan ABC, Taman DEF"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newBusiness.city}
                  onChange={(e) => setNewBusiness(prev => ({...prev, city: e.target.value}))}
                  placeholder="Kuala Lumpur"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={newBusiness.state} onValueChange={(value) => setNewBusiness(prev => ({...prev, state: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {malaysianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={newBusiness.postcode}
                  onChange={(e) => setNewBusiness(prev => ({...prev, postcode: e.target.value}))}
                  placeholder="50000"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddBusiness} className="bg-blue-600 hover:bg-blue-700">Register Business</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by company name or ROC number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{businesses.length}</p>
                <p className="text-sm text-gray-600">Total Businesses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {businesses.filter(b => b.verificationStatus === 'verified').length}
                </p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {businesses.filter(b => b.verificationStatus === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {businesses.reduce((sum, b) => sum + b.totalLocations, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  {business.companyName}
                </CardTitle>
                {getVerificationBadge(business.verificationStatus)}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">ROC: {business.rocNumber}</Badge>
                <Badge variant="outline" className="text-xs">{business.businessType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{business.contactPerson.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{business.contactPerson.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{business.headquarters.city}, {business.headquarters.state}</span>
                </div>
              </div>

              {/* Business Metrics */}
              <div className="pt-2 border-t space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Locations:</span>
                    <div className="font-semibold">{business.totalLocations}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Employees:</span>
                    <div className="font-semibold">{business.totalEmployees}</div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Revenue:</span>
                  <div className="font-semibold">{business.annualRevenue}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDocumentUpload(business.id)}
                  className="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Documents
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleLocationManagement(business.id)}
                  className="text-xs"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Locations
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleROCValidationClick(business.id)}
                  className="text-xs"
                >
                  <Search className="h-3 w-3 mr-1" />
                  ROC Check
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Upload Modal */}
      {selectedBusinessId && (
        <BusinessDocumentUpload
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          businessId={selectedBusinessId}
          onDocumentsUpdate={handleDocumentUpdate}
        />
      )}

      {/* Location Management Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Location Management</DialogTitle>
          </DialogHeader>
          {selectedBusinessId && (
            <BusinessLocationManager
              businessId={selectedBusinessId}
              onLocationsUpdate={handleLocationUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ROC Validation Modal */}
      <Dialog open={showROCModal} onOpenChange={setShowROCModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ROC Validation Service</DialogTitle>
          </DialogHeader>
          {selectedBusinessId && (
            <ROCValidationService
              onValidationResult={handleROCValidationResult}
              initialROC={businesses.find(b => b.id === selectedBusinessId)?.rocNumber || ""}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBusinessRegister;
