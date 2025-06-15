
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, Star, Truck, Calendar, DollarSign, Phone, User, Clock } from "lucide-react";

const ExternalLorryNetwork: React.FC = () => {
  const [vendors, setVendors] = useState([
    {
      id: "VENDOR001",
      name: "KL Transport Services",
      contact: "Ahmad Rahman",
      phone: "+60123456789",
      email: "ahmad@kltransport.com",
      address: "Jalan Sultan, Kuala Lumpur",
      rating: 4.8,
      totalJobs: 156,
      completionRate: 98.5,
      averagePrice: 350,
      availability: "available",
      lorries: [
        { id: "EXT001", model: "Isuzu NPR", tonnage: "3.5T", status: "available", rate: 300 },
        { id: "EXT002", model: "Mitsubishi Canter", tonnage: "5T", status: "booked", rate: 400 }
      ],
      specializations: ["Construction Waste", "Household Items"],
      insuranceValid: true,
      lastUpdated: "2024-01-15"
    },
    {
      id: "VENDOR002",
      name: "Selangor Heavy Haulage",
      contact: "Lim Wei Ming",
      phone: "+60198765432",
      email: "lim@selangortruck.com",
      address: "Shah Alam, Selangor",
      rating: 4.5,
      totalJobs: 89,
      completionRate: 95.2,
      averagePrice: 450,
      availability: "busy",
      lorries: [
        { id: "EXT003", model: "Hino 500", tonnage: "10T", status: "available", rate: 600 },
        { id: "EXT004", model: "UD Trucks", tonnage: "15T", status: "maintenance", rate: 800 }
      ],
      specializations: ["Industrial Waste", "Heavy Machinery"],
      insuranceValid: true,
      lastUpdated: "2024-01-10"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "busy":
        return <Badge className="bg-orange-100 text-orange-800">Busy</Badge>;
      case "unavailable":
        return <Badge className="bg-red-100 text-red-800">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            External Lorry Network
          </h2>
          <p className="text-gray-600 mt-1">Third-party rental management with vendor ratings and availability scheduling</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="e.g., KL Transport Services" />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input placeholder="e.g., Ahmad Rahman" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+60123456789" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="contact@company.com" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Textarea placeholder="Complete business address" />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction Waste</SelectItem>
                    <SelectItem value="household">Household Items</SelectItem>
                    <SelectItem value="industrial">Industrial Waste</SelectItem>
                    <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base Rate (RM)</Label>
                <Input type="number" placeholder="300" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={() => setShowAddModal(false)}>Add Vendor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Network Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available Lorries</p>
                <p className="text-2xl font-bold">{vendors.reduce((sum, v) => sum + v.lorries.filter(l => l.status === 'available').length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Rate (RM)</p>
                <p className="text-2xl font-bold">{Math.round(vendors.reduce((sum, v) => sum + v.averagePrice, 0) / vendors.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {vendor.name}
                </CardTitle>
                {getAvailabilityBadge(vendor.availability)}
              </div>
              <div className="flex items-center gap-2">
                {getRatingStars(vendor.rating)}
                <span className="text-sm text-gray-600">({vendor.rating}) • {vendor.totalJobs} jobs</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Contact Person</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {vendor.contact}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {vendor.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Completion Rate</p>
                  <p className="font-medium text-green-600">{vendor.completionRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Average Rate</p>
                  <p className="font-medium">RM {vendor.averagePrice}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Available Lorries</p>
                <div className="space-y-2">
                  {vendor.lorries.map((lorry) => (
                    <div key={lorry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{lorry.model} ({lorry.tonnage})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">RM {lorry.rate}</span>
                        <Badge 
                          variant={lorry.status === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {lorry.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {vendor.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExternalLorryNetwork;
