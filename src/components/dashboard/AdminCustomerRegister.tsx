import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Phone, Mail, MapPin, CreditCard, Star, MessageSquare, User, CheckCircle, AlertCircle, Shield, Eye, Settings, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import CustomerVerificationSystem from "./CustomerVerificationSystem";
import CustomerCreditScoring from "./CustomerCreditScoring";
import CustomerSegmentManager from "./CustomerSegmentManager";
import ContactPersonManager from "./ContactPersonManager";
import CustomerAddressManager from "./CustomerAddressManager";

interface ContactPerson {
  id: string;
  name: string;
  role: "Primary" | "Secondary" | "Emergency";
  phone: string;
  email: string;
  icNumber?: string;
  position?: string;
  department?: string;
  isActive: boolean;
  accessLevel: "Full" | "Limited" | "View Only";
  canPlaceOrders: boolean;
  canViewBilling: boolean;
  canModifyProfile: boolean;
}

interface CustomerAddress {
  id: string;
  type: "Billing" | "Service" | "Mailing";
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  gpsCoordinates?: string;
  isPrimary: boolean;
  isActive: boolean;
  deliveryInstructions?: string;
  accessNotes?: string;
}

interface ContactMethod {
  type: "Email" | "Phone" | "WhatsApp";
  value: string;
  isPreferred: boolean;
  isVerified: boolean;
}

interface Customer {
  id: string;
  name: string;
  rocNumber?: string;
  customerType: "Individual" | "SME" | "Corporate" | "Government";
  segment: {
    pricingTier: "Basic" | "Premium" | "Enterprise" | "Government";
    discountPercentage: number;
    creditLimit: number;
    paymentTerms: string;
  };
  contacts: ContactPerson[];
  addresses: CustomerAddress[];
  contactMethods: ContactMethod[];
  documents: {
    icPassport: boolean;
    proofOfAddress: boolean;
    businessRegistration: boolean;
    bankStatement: boolean;
  };
  creditScore: number;
  paymentHistory: "Excellent" | "Good" | "Fair" | "Poor";
  registrationDate: string;
  verificationStatus: "pending" | "verified" | "rejected";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  notes?: string;
}

const AdminCustomerRegister: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "Sunshine Apartments Management",
      rocNumber: "202345678901",
      customerType: "Corporate",
      segment: {
        pricingTier: "Enterprise",
        discountPercentage: 20,
        creditLimit: 100000,
        paymentTerms: "Net 30"
      },
      contacts: [
        {
          id: "CON001",
          name: "Ahmad Rahman",
          role: "Primary",
          phone: "+60 19-876 5432",
          email: "ahmad@sunshine-apt.com",
          icNumber: "851201-08-5678",
          position: "Building Manager",
          department: "Operations",
          isActive: true,
          accessLevel: "Full",
          canPlaceOrders: true,
          canViewBilling: true,
          canModifyProfile: true
        }
      ],
      addresses: [
        {
          id: "ADD001",
          type: "Service",
          address: "123 Jalan Sunshine, Taman Bahagia",
          city: "Petaling Jaya",
          state: "Selangor",
          postcode: "47400",
          country: "Malaysia",
          gpsCoordinates: "3.1390,101.6869",
          isPrimary: true,
          isActive: true,
          deliveryInstructions: "Use main entrance, contact security",
          accessNotes: "Building management office on ground floor"
        }
      ],
      contactMethods: [
        { type: "Email", value: "contact@sunshine-apt.com", isPreferred: true, isVerified: true },
        { type: "Phone", value: "+60 19-876 5432", isPreferred: false, isVerified: true },
        { type: "WhatsApp", value: "+60 19-876 5432", isPreferred: false, isVerified: true }
      ],
      documents: {
        icPassport: true,
        proofOfAddress: true,
        businessRegistration: true,
        bankStatement: true
      },
      creditScore: 850,
      paymentHistory: "Excellent",
      registrationDate: "2024-01-15",
      verificationStatus: "verified",
      totalOrders: 24,
      totalSpent: 12500.00,
      lastOrderDate: "2024-06-10",
      notes: "VIP customer - high volume regular orders"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    rocNumber: "",
    customerType: "Individual" as const,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    icNumber: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    notes: ""
  });

  const customerTypes = ["Individual", "SME", "Corporate", "Government"];
  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan",
    "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

  const getCustomerSegment = (customerType: string) => {
    const segments = {
      "Individual": { pricingTier: "Basic" as const, discountPercentage: 0, creditLimit: 5000, paymentTerms: "Net 7" },
      "SME": { pricingTier: "Premium" as const, discountPercentage: 10, creditLimit: 25000, paymentTerms: "Net 14" },
      "Corporate": { pricingTier: "Enterprise" as const, discountPercentage: 20, creditLimit: 100000, paymentTerms: "Net 30" },
      "Government": { pricingTier: "Government" as const, discountPercentage: 15, creditLimit: 200000, paymentTerms: "Net 45" }
    };
    return segments[customerType as keyof typeof segments] || segments.Individual;
  };

  const validateIC = (icNumber: string): boolean => {
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;
    return icPattern.test(icNumber);
  };

  const sendOTP = (phoneNumber: string) => {
    // Simulate OTP sending
    toast.success(`OTP sent to ${phoneNumber}`);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.contactPhone) {
      toast.error("Please fill in required fields");
      return;
    }

    if (newCustomer.icNumber && !validateIC(newCustomer.icNumber)) {
      toast.error("Invalid IC number format (YYMMDD-PB-XXXX)");
      return;
    }

    const segment = getCustomerSegment(newCustomer.customerType);

    const customer: Customer = {
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
      name: newCustomer.name,
      rocNumber: newCustomer.rocNumber || undefined,
      customerType: newCustomer.customerType,
      segment: segment,
      contacts: [{
        id: "CON001",
        name: newCustomer.contactName,
        role: "Primary",
        phone: newCustomer.contactPhone,
        email: newCustomer.contactEmail,
        icNumber: newCustomer.icNumber || undefined,
        isActive: true,
        accessLevel: "Full",
        canPlaceOrders: true,
        canViewBilling: true,
        canModifyProfile: true
      }],
      addresses: [{
        id: "ADD001",
        type: "Service",
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        postcode: newCustomer.postcode,
        country: "Malaysia",
        isPrimary: true,
        isActive: true
      }],
      contactMethods: [
        { type: "Phone", value: newCustomer.contactPhone, isPreferred: true, isVerified: false },
        ...(newCustomer.contactEmail ? [{ type: "Email" as const, value: newCustomer.contactEmail, isPreferred: false, isVerified: false }] : [])
      ],
      documents: {
        icPassport: false,
        proofOfAddress: false,
        businessRegistration: newCustomer.customerType !== "Individual",
        bankStatement: false
      },
      creditScore: 750,
      paymentHistory: "Good",
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: "pending",
      totalOrders: 0,
      totalSpent: 0,
      notes: newCustomer.notes
    };

    setCustomers([...customers, customer]);
    sendOTP(newCustomer.contactPhone);
    toast.success("Customer registered successfully");
    setShowAddModal(false);
    resetNewCustomerForm();
  };

  const resetNewCustomerForm = () => {
    setNewCustomer({
      name: "",
      rocNumber: "",
      customerType: "Individual",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      icNumber: "",
      address: "",
      city: "",
      state: "",
      postcode: "",
      notes: ""
    });
  };

  const handleVerifyCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowVerificationModal(true);
  };

  const handleCreditScoring = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowCreditModal(true);
  };

  const handleSegmentManagement = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowSegmentModal(true);
  };

  const handleContactManagement = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowContactModal(true);
  };

  const handleAddressManagement = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowAddressModal(true);
  };

  const handleDocumentUpload = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowDocumentModal(true);
  };

  const handleVerificationComplete = (verificationData: any) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === selectedCustomerId 
        ? { ...customer, verificationStatus: "verified" }
        : customer
    ));
    toast.success("Customer verification completed");
  };

  const handleCreditScoreUpdate = (score: number, rating: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === selectedCustomerId 
        ? { ...customer, creditScore: score, paymentHistory: rating as any }
        : customer
    ));
  };

  const handleSegmentUpdate = (segment: any) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === selectedCustomerId 
        ? { 
            ...customer, 
            segment: {
              pricingTier: segment.pricingTier,
              discountPercentage: segment.discountPercentage,
              creditLimit: segment.creditLimit,
              paymentTerms: segment.paymentTerms
            }
          }
        : customer
    ));
    toast.success("Customer segment updated");
  };

  const handleContactsUpdate = (contacts: ContactPerson[]) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === selectedCustomerId 
        ? { ...customer, contacts }
        : customer
    ));
  };

  const handleAddressesUpdate = (addresses: CustomerAddress[]) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === selectedCustomerId 
        ? { ...customer, addresses }
        : customer
    ));
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 600) return "text-yellow-600";
    return "text-red-600";
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

  const getPricingTierBadge = (tier: string) => {
    switch (tier) {
      case "Basic":
        return <Badge className="bg-gray-100 text-gray-800">Basic</Badge>;
      case "Premium":
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>;
      case "Enterprise":
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      case "Government":
        return <Badge className="bg-orange-100 text-orange-800">Government</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contacts[0]?.phone.includes(searchTerm) ||
                         customer.contacts[0]?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.rocNumber && customer.rocNumber.includes(searchTerm));
    
    const matchesType = filterType === "all" || customer.customerType === filterType;
    const matchesStatus = filterStatus === "all" || customer.verificationStatus === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-green-600" />
            Advanced Customer Management System
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive customer database with verification, segmentation, and multi-contact support</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register New Customer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 space-y-2">
              <div className="col-span-2">
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({...prev, name: e.target.value}))}
                  placeholder="Customer/Company Name"
                />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type *</Label>
                <Select value={newCustomer.customerType} onValueChange={(value: any) => setNewCustomer(prev => ({...prev, customerType: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rocNumber">ROC Number (if applicable)</Label>
                <Input
                  id="rocNumber"
                  value={newCustomer.rocNumber}
                  onChange={(e) => setNewCustomer(prev => ({...prev, rocNumber: e.target.value}))}
                  placeholder="201234567890"
                />
              </div>
              <div>
                <Label htmlFor="contactName">Primary Contact Name *</Label>
                <Input
                  id="contactName"
                  value={newCustomer.contactName}
                  onChange={(e) => setNewCustomer(prev => ({...prev, contactName: e.target.value}))}
                  placeholder="Primary contact person"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone Number * (for OTP)</Label>
                <Input
                  id="contactPhone"
                  value={newCustomer.contactPhone}
                  onChange={(e) => setNewCustomer(prev => ({...prev, contactPhone: e.target.value}))}
                  placeholder="+60 12-345 6789"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newCustomer.contactEmail}
                  onChange={(e) => setNewCustomer(prev => ({...prev, contactEmail: e.target.value}))}
                  placeholder="contact@customer.com"
                />
              </div>
              <div>
                <Label htmlFor="icNumber">IC Number</Label>
                <Input
                  id="icNumber"
                  value={newCustomer.icNumber}
                  onChange={(e) => setNewCustomer(prev => ({...prev, icNumber: e.target.value}))}
                  placeholder="YYMMDD-PB-XXXX"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Primary Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Jalan ABC, Taman DEF"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer(prev => ({...prev, city: e.target.value}))}
                  placeholder="Kuala Lumpur"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={newCustomer.state} onValueChange={(value) => setNewCustomer(prev => ({...prev, state: value}))}>
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
                  value={newCustomer.postcode}
                  onChange={(e) => setNewCustomer(prev => ({...prev, postcode: e.target.value}))}
                  placeholder="50000"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Additional customer information"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer} className="bg-green-600 hover:bg-green-700">Register & Send OTP</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search Customers</Label>
              <Input
                placeholder="Search by name, phone, email, or ROC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Customer Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {customerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Verification Status</Label>
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
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {customers.filter(c => c.verificationStatus === 'verified').length}
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
                  {customers.filter(c => c.verificationStatus === 'pending').length}
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
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(customers.reduce((sum, c) => sum + c.creditScore, 0) / customers.length)}
                </p>
                <p className="text-sm text-gray-600">Avg Credit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  RM{(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  {customer.name}
                </CardTitle>
                {getVerificationBadge(customer.verificationStatus)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{customer.customerType}</Badge>
                {getPricingTierBadge(customer.segment.pricingTier)}
                {customer.rocNumber && (
                  <Badge variant="outline" className="text-xs">ROC: {customer.rocNumber}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Primary Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{customer.contacts[0]?.name} ({customer.contacts[0]?.role})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{customer.contacts[0]?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{customer.contacts[0]?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{customer.addresses[0]?.city}, {customer.addresses[0]?.state}</span>
                </div>
              </div>

              {/* Customer Metrics */}
              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Credit Score:
                  </span>
                  <span className={`font-semibold ${getCreditScoreColor(customer.creditScore)}`}>
                    {customer.creditScore}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Segment:</span>
                  <div className="flex gap-1">
                    {getPricingTierBadge(customer.segment.pricingTier)}
                    <Badge variant="outline" className="text-xs">{customer.segment.discountPercentage}% off</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Contacts:</span>
                    <div className="font-semibold">{customer.contacts.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Orders:</span>
                    <div className="font-semibold">{customer.totalOrders}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Spent:</span>
                    <div className="font-semibold">RM{customer.totalSpent.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleVerifyCustomer(customer.id)}
                  className="text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Verify
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleCreditScoring(customer.id)}
                  className="text-xs"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Credit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSegmentManagement(customer.id)}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Segment
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleContactManagement(customer.id)}
                  className="text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  Contacts
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddressManagement(customer.id)}
                  className="text-xs"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Address
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDocumentUpload(customer.id)}
                  className="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {selectedCustomer && (
        <>
          {/* Verification Modal */}
          <CustomerVerificationSystem
            isOpen={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            customerId={selectedCustomer.id}
            customerPhone={selectedCustomer.contacts[0]?.phone || ""}
            customerEmail={selectedCustomer.contacts[0]?.email || ""}
            onVerificationComplete={handleVerificationComplete}
          />

          {/* Credit Scoring Modal */}
          <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Credit Score Assessment</DialogTitle>
              </DialogHeader>
              <CustomerCreditScoring
                customerId={selectedCustomer.id}
                customerType={selectedCustomer.customerType}
                registrationDate={selectedCustomer.registrationDate}
                onScoreCalculated={handleCreditScoreUpdate}
              />
            </DialogContent>
          </Dialog>

          {/* Segment Management Modal */}
          <Dialog open={showSegmentModal} onOpenChange={setShowSegmentModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Customer Segmentation</DialogTitle>
              </DialogHeader>
              <CustomerSegmentManager
                onSegmentChange={handleSegmentUpdate}
                currentSegment={selectedCustomer.customerType}
              />
            </DialogContent>
          </Dialog>

          {/* Contact Management Modal */}
          <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Contact Management</DialogTitle>
              </DialogHeader>
              <ContactPersonManager
                customerId={selectedCustomer.id}
                contacts={selectedCustomer.contacts}
                onContactsUpdate={handleContactsUpdate}
              />
            </DialogContent>
          </Dialog>

          {/* Address Management Modal */}
          <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Address Management</DialogTitle>
              </DialogHeader>
              <CustomerAddressManager
                customerId={selectedCustomer.id}
                addresses={selectedCustomer.addresses}
                onAddressesUpdate={handleAddressesUpdate}
              />
            </DialogContent>
          </Dialog>

          {/* Document Upload Modal */}
          <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Document Upload</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">Upload customer verification documents</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">IC/Passport</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Proof of Address</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Business Registration</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Bank Statement</span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AdminCustomerRegister;
