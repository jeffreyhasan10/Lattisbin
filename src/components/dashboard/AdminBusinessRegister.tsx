import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, MapPin, Phone, Mail, Plus, Search } from "lucide-react";
import { toast } from "sonner";

interface Business {
  id: string;
  companyName: string;
  rocNumber: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
}

const AdminBusinessRegister: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: "BIZ001",
      companyName: "ABC Construction Sdn Bhd",
      rocNumber: "202301234567",
      address: "123 Jalan Industri, Taman Perindustrian",
      city: "Shah Alam",
      state: "Selangor",
      postcode: "40000",
      phone: "+60 12-345 6789",
      email: "ahmad@abc-construction.com"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newBusiness, setNewBusiness] = useState({
    companyName: "",
    rocNumber: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: ""
  });

  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan",
    "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

  const handleAddBusiness = () => {
    if (!newBusiness.companyName || !newBusiness.rocNumber || !newBusiness.phone) {
      toast.error("Please fill in required fields");
      return;
    }

    const business: Business = {
      id: `BIZ${String(businesses.length + 1).padStart(3, '0')}`,
      companyName: newBusiness.companyName,
      rocNumber: newBusiness.rocNumber,
      address: newBusiness.address,
      city: newBusiness.city,
      state: newBusiness.state,
      postcode: newBusiness.postcode,
      phone: newBusiness.phone,
      email: newBusiness.email
    };

    setBusinesses([...businesses, business]);
    toast.success("Business registered successfully");
    setShowAddModal(false);
    setNewBusiness({
      companyName: "",
      rocNumber: "",
      address: "",
      city: "",
      state: "",
      postcode: "",
      phone: "",
      email: ""
    });
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.rocNumber.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            Business Registration
          </h2>
          <p className="text-gray-600 mt-1">Register a business with essential details</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Register Business
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
              <div className="col-span-2">
                <Label htmlFor="rocNumber">ROC Number *</Label>
                <Input
                  id="rocNumber"
                  value={newBusiness.rocNumber}
                  onChange={(e) => setNewBusiness(prev => ({...prev, rocNumber: e.target.value}))}
                  placeholder="202301234567"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newBusiness.address}
                  onChange={(e) => setNewBusiness(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Jalan ABC, Taman DEF"
                />
              </div>
              <div>
                <Label htmlFor="city">Area/City</Label>
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
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newBusiness.phone}
                  onChange={(e) => setNewBusiness(prev => ({...prev, phone: e.target.value}))}
                  placeholder="+60 12-345 6789"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newBusiness.email}
                  onChange={(e) => setNewBusiness(prev => ({...prev, email: e.target.value}))}
                  placeholder="contact@company.com"
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

      {/* Search */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by company name or ROC number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                {business.companyName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-gray-600">ROC: {business.rocNumber}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{business.address}, {business.postcode}, {business.city}, {business.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{business.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminBusinessRegister;
