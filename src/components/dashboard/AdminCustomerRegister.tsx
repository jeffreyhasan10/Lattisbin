
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Phone, Mail, MapPin, CreditCard, Star, MessageSquare, User, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  rocNumber?: string;
  customerType: "Individual" | "SME" | "Corporate" | "Government";
  contacts: ContactPerson[];
  addresses: Address[];
  contactMethods: ContactMethod[];
  creditScore: number;
  paymentHistory: "Excellent" | "Good" | "Fair" | "Poor";
  registrationDate: string;
  verificationStatus: "pending" | "verified" | "rejected";
  totalOrders: number;
  totalSpent: number;
}

interface ContactPerson {
  id: string;
  name: string;
  role: "Primary" | "Secondary" | "Emergency";
  phone: string;
  email: string;
  icNumber?: string;
  position?: string;
}

interface Address {
  id: string;
  type: "Billing" | "Service" | "Mailing";
  address: string;
  city: string;
  state: string;
  postcode: string;
  gpsCoordinates?: string;
  isPrimary: boolean;
}

interface ContactMethod {
  type: "Email" | "Phone" | "WhatsApp";
  value: string;
  isPreferred: boolean;
}

const AdminCustomerRegister: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "Sunshine Apartments",
      rocNumber: "202345678901",
      customerType: "Corporate",
      contacts: [
        {
          id: "CON001",
          name: "Ahmad Rahman",
          role: "Primary",
          phone: "+60 19-876 5432",
          email: "ahmad@sunshine-apt.com",
          icNumber: "851201-08-5678",
          position: "Building Manager"
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
          gpsCoordinates: "3.1390,101.6869",
          isPrimary: true
        }
      ],
      contactMethods: [
        { type: "Email", value: "contact@sunshine-apt.com", isPreferred: true },
        { type: "Phone", value: "+60 19-876 5432", isPreferred: false },
        { type: "WhatsApp", value: "+60 19-876 5432", isPreferred: false }
      ],
      creditScore: 850,
      paymentHistory: "Excellent",
      registrationDate: "2024-01-15",
      verificationStatus: "verified",
      totalOrders: 24,
      totalSpent: 12500.00
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
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
    postcode: ""
  });

  const customerTypes = ["Individual", "SME", "Corporate", "Government"];
  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan",
    "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

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

    const customer: Customer = {
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
      name: newCustomer.name,
      rocNumber: newCustomer.rocNumber || undefined,
      customerType: newCustomer.customerType,
      contacts: [{
        id: "CON001",
        name: newCustomer.contactName,
        role: "Primary",
        phone: newCustomer.contactPhone,
        email: newCustomer.contactEmail,
        icNumber: newCustomer.icNumber || undefined
      }],
      addresses: [{
        id: "ADD001",
        type: "Service",
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        postcode: newCustomer.postcode,
        isPrimary: true
      }],
      contactMethods: [
        { type: "Phone", value: newCustomer.contactPhone, isPreferred: true },
        ...(newCustomer.contactEmail ? [{ type: "Email" as const, value: newCustomer.contactEmail, isPreferred: false }] : [])
      ],
      creditScore: 750,
      paymentHistory: "Good",
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: "pending",
      totalOrders: 0,
      totalSpent: 0
    };

    setCustomers([...customers, customer]);
    sendOTP(newCustomer.contactPhone);
    toast.success("Customer registered successfully");
    setShowAddModal(false);
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
      postcode: ""
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-green-600" />
            Customer Management
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive customer database with verification, contact hierarchy, and payment tracking</p>
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
                <Label htmlFor="contactName">Contact Person Name *</Label>
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
                <Label htmlFor="address">Service Address</Label>
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
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer} className="bg-green-600 hover:bg-green-700">Register & Send OTP</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  {customer.name}
                </CardTitle>
                {getVerificationBadge(customer.verificationStatus)}
              </div>
              <Badge variant="outline" className="w-fit">{customer.customerType}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.rocNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span>ROC: {customer.rocNumber}</span>
                </div>
              )}
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
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Credit Score:
                  </span>
                  <span className={`font-semibold ${getCreditScoreColor(customer.creditScore)}`}>
                    {customer.creditScore}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Payment History:</span>
                  <Badge variant="outline" className="text-xs">{customer.paymentHistory}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Total Orders:</span>
                  <span className="font-semibold">{customer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Total Spent:</span>
                  <span className="font-semibold">RM {customer.totalSpent.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomerRegister;
