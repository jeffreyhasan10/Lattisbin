import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  companyName: string;
  rocNumber?: string;
  contactPerson: string;
  icPassport?: string;
  address: string;
  postcode: string;
  area: string;
  state: string;
  email?: string;
  phoneNumber: string;
  notes?: string;
  registrationDate: string;
  verificationStatus: "pending" | "verified" | "rejected";
}

const AdminCustomerRegister: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST001",
      companyName: "Sunshine Trading Sdn Bhd",
      rocNumber: "202301234567",
      contactPerson: "Amirah Yusof",
      icPassport: "900101-08-1234",
      address: "12 Jalan Mawar, Taman Indah",
      postcode: "47400",
      area: "Petaling Jaya",
      state: "Selangor",
      email: "amirah@sunshine.com",
      phoneNumber: "+6012-3456789",
      notes: "Regular client, prefers WhatsApp communication",
      registrationDate: "2025-01-10",
      verificationStatus: "verified",
    },
    {
      id: "CUST002",
      companyName: "TechWave Solutions",
      rocNumber: "202401987654",
      contactPerson: "James Lim",
      icPassport: "A12345678",
      address: "88 Jalan Teknologi, Cyberjaya",
      postcode: "63000",
      area: "Cyberjaya",
      state: "Selangor",
      email: "james@techwave.com",
      phoneNumber: "+6019-8765432",
      notes: "New client, interested in bulk orders",
      registrationDate: "2025-03-15",
      verificationStatus: "pending",
    },
    {
      id: "CUST003",
      companyName: "GreenLeaf Enterprises",
      contactPerson: "Siti Nurhaliza",
      icPassport: "880505-14-5678",
      address: "45 Jalan Hijau, Bandar Baru",
      postcode: "81700",
      area: "Pasir Gudang",
      state: "Johor",
      phoneNumber: "+6017-1234567",
      registrationDate: "2025-05-20",
      verificationStatus: "rejected",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    rocNumber: "",
    contactPerson: "",
    icPassport: "",
    address: "",
    postcode: "",
    area: "",
    state: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });

  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan",
    "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

  const validateIC = (icNumber: string): boolean => {
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;
    return icPattern.test(icNumber);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.companyName || !newCustomer.phoneNumber || !newCustomer.contactPerson) {
      toast.error("Please fill in required fields: Company Name, Contact Person, and Phone Number");
      return;
    }

    if (newCustomer.icPassport && !validateIC(newCustomer.icPassport)) {
      toast.error("Invalid IC number format (YYMMDD-PB-XXXX)");
      return;
    }

    const customer: Customer = {
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
      companyName: newCustomer.companyName,
      rocNumber: newCustomer.rocNumber || undefined,
      contactPerson: newCustomer.contactPerson,
      icPassport: newCustomer.icPassport || undefined,
      address: newCustomer.address,
      postcode: newCustomer.postcode,
      area: newCustomer.area,
      state: newCustomer.state,
      email: newCustomer.email || undefined,
      phoneNumber: newCustomer.phoneNumber,
      notes: newCustomer.notes || undefined,
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: "pending",
    };

    setCustomers([...customers, customer]);
    toast.success("Customer registered successfully");
    setShowAddModal(false);
    resetNewCustomerForm();
  };

  const resetNewCustomerForm = () => {
    setNewCustomer({
      companyName: "",
      rocNumber: "",
      contactPerson: "",
      icPassport: "",
      address: "",
      postcode: "",
      area: "",
      state: "",
      email: "",
      phoneNumber: "",
      notes: "",
    });
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.rocNumber && customer.rocNumber.includes(searchTerm))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Customer Registration
          </h2>
          <p className="text-gray-600 mt-1">Manage customer details with ease</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Register New Customer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name *</Label>
                <Input
                  id="companyName"
                  value={newCustomer.companyName}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="rocNumber" className="text-sm font-medium text-gray-700">ROC Number</Label>
                <Input
                  id="rocNumber"
                  value={newCustomer.rocNumber}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, rocNumber: e.target.value }))}
                  placeholder="e.g., 202301234567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={newCustomer.contactPerson}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Enter contact person name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="icPassport" className="text-sm font-medium text-gray-700">IC/Passport Number</Label>
                <Input
                  id="icPassport"
                  value={newCustomer.icPassport}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, icPassport: e.target.value }))}
                  placeholder="e.g., YYMMDD-PB-XXXX"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={newCustomer.phoneNumber}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="e.g., +6012-3456789"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postcode" className="text-sm font-medium text-gray-700">Postcode</Label>
                <Input
                  id="postcode"
                  value={newCustomer.postcode}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, postcode: e.target.value }))}
                  placeholder="e.g., 47400"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area</Label>
                <Input
                  id="area"
                  value={newCustomer.area}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="e.g., Petaling Jaya"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                <Select value={newCustomer.state} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., contact@company.com"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                <Input
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </Button>
              <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700 text-white">
                Register
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search Customers</Label>
          <Input
            id="search"
            placeholder="Search by company name, phone, email, or ROC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  {customer.companyName}
                </CardTitle>
              </div>
              {customer.rocNumber && (
                <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">ROC: {customer.rocNumber}</Badge>
              )}
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{customer.contactPerson} {customer.icPassport && `(${customer.icPassport})`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{customer.phoneNumber}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{customer.address}, {customer.area}, {customer.postcode}, {customer.state}</span>
                </div>
                {customer.notes && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>{customer.notes}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomerRegister;