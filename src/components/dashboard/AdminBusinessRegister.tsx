
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, FileText, MapPin, Phone, Mail, Upload, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Business {
  id: string;
  companyName: string;
  rocNumber: string;
  businessType: string;
  registrationDate: string;
  locations: Location[];
  documents: Document[];
  verificationStatus: "pending" | "verified" | "rejected";
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
}

interface Location {
  id: string;
  address: string;
  state: string;
  city: string;
  postcode: string;
  gpsCoordinates: string;
  isPrimary: boolean;
}

interface Document {
  id: string;
  type: string;
  name: string;
  uploadDate: string;
  status: "uploaded" | "verified" | "expired";
}

const AdminBusinessRegister: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: "BUS001",
      companyName: "ABC Construction Sdn Bhd",
      rocNumber: "201234567890",
      businessType: "Construction",
      registrationDate: "2024-01-15",
      locations: [
        {
          id: "LOC001",
          address: "123 Jalan Klang Lama",
          state: "Kuala Lumpur",
          city: "Kuala Lumpur",
          postcode: "58000",
          gpsCoordinates: "3.1390,101.6869",
          isPrimary: true
        }
      ],
      documents: [
        { id: "DOC001", type: "SSM Certificate", name: "ssm_cert.pdf", uploadDate: "2024-01-15", status: "verified" },
        { id: "DOC002", type: "Business License", name: "business_license.pdf", uploadDate: "2024-01-15", status: "verified" }
      ],
      verificationStatus: "verified",
      contactInfo: {
        email: "info@abc-construction.com",
        phone: "+60 3-1234 5678",
        website: "www.abc-construction.com"
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    companyName: "",
    rocNumber: "",
    businessType: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    state: "",
    city: "",
    postcode: ""
  });

  const businessTypes = [
    "Construction", "Manufacturing", "Trading", "Services", "Technology", 
    "Healthcare", "Education", "Hospitality", "Transportation", "Agriculture"
  ];

  const validateROC = (rocNumber: string): boolean => {
    // Basic ROC validation (12 digits)
    const rocPattern = /^\d{12}$/;
    return rocPattern.test(rocNumber);
  };

  const handleAddBusiness = () => {
    if (!newBusiness.companyName || !newBusiness.rocNumber || !newBusiness.businessType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!validateROC(newBusiness.rocNumber)) {
      toast.error("Invalid ROC number format. Must be 12 digits.");
      return;
    }

    const business: Business = {
      id: `BUS${String(businesses.length + 1).padStart(3, '0')}`,
      companyName: newBusiness.companyName,
      rocNumber: newBusiness.rocNumber,
      businessType: newBusiness.businessType,
      registrationDate: new Date().toISOString().split('T')[0],
      locations: [{
        id: "LOC001",
        address: newBusiness.address,
        state: newBusiness.state,
        city: newBusiness.city,
        postcode: newBusiness.postcode,
        gpsCoordinates: "",
        isPrimary: true
      }],
      documents: [],
      verificationStatus: "pending",
      contactInfo: {
        email: newBusiness.email,
        phone: newBusiness.phone,
        website: newBusiness.website
      }
    };

    setBusinesses([...businesses, business]);
    toast.success("Business registered successfully");
    setShowAddModal(false);
    setNewBusiness({
      companyName: "",
      rocNumber: "",
      businessType: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      state: "",
      city: "",
      postcode: ""
    });
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
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
            <Building2 className="h-6 w-6 text-blue-600" />
            Business Registration
          </h2>
          <p className="text-gray-600 mt-1">Complete business profile management with ROC validation and multi-location support</p>
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
                  placeholder="ABC Company Sdn Bhd"
                />
              </div>
              <div>
                <Label htmlFor="rocNumber">ROC Number *</Label>
                <Input
                  id="rocNumber"
                  value={newBusiness.rocNumber}
                  onChange={(e) => setNewBusiness(prev => ({...prev, rocNumber: e.target.value}))}
                  placeholder="201234567890"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={newBusiness.businessType} onValueChange={(value) => setNewBusiness(prev => ({...prev, businessType: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newBusiness.phone}
                  onChange={(e) => setNewBusiness(prev => ({...prev, phone: e.target.value}))}
                  placeholder="+60 3-1234 5678"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newBusiness.website}
                  onChange={(e) => setNewBusiness(prev => ({...prev, website: e.target.value}))}
                  placeholder="www.company.com"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newBusiness.address}
                  onChange={(e) => setNewBusiness(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Jalan ABC"
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
                <Input
                  id="state"
                  value={newBusiness.state}
                  onChange={(e) => setNewBusiness(prev => ({...prev, state: e.target.value}))}
                  placeholder="Selangor"
                />
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
              <Button onClick={handleAddBusiness} className="bg-blue-600 hover:bg-blue-700">Register</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {business.companyName}
                </CardTitle>
                {getVerificationBadge(business.verificationStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>ROC: {business.rocNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{business.businessType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{business.locations[0]?.city}, {business.locations[0]?.state}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{business.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{business.contactInfo.email}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 mb-2">Documents ({business.documents.length})</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
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
