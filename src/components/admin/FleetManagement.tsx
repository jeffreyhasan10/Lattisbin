
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Plus, Calendar, Wrench, MapPin, Fuel, Shield, AlertTriangle, Navigation, Clock, DollarSign } from "lucide-react";

const FleetManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: "VEH001",
      model: "Isuzu NPR 75",
      registration: "WA 1234 A",
      tonnage: "3.5 Tons",
      year: "2020",
      status: "active",
      location: "Kuala Lumpur",
      driver: "John Doe",
      insurance: { status: "valid", expiry: "2024-12-31", provider: "Allianz" },
      roadTax: { status: "valid", expiry: "2024-06-30" },
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      fuelLevel: 85,
      mileage: 45000,
      gpsTracking: true,
      monthlyFuelCost: 1200,
      maintenanceCost: 2500
    },
    {
      id: "VEH002", 
      model: "Mitsubishi Canter",
      registration: "WA 5678 B",
      tonnage: "5 Tons",
      year: "2019",
      status: "maintenance",
      location: "Workshop",
      driver: "Unassigned",
      insurance: { status: "valid", expiry: "2024-11-15", provider: "Great Eastern" },
      roadTax: { status: "expiring", expiry: "2024-03-31" },
      lastMaintenance: "2024-02-01",
      nextMaintenance: "2024-05-01",
      fuelLevel: 0,
      mileage: 52000,
      gpsTracking: true,
      monthlyFuelCost: 1500,
      maintenanceCost: 3200
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Fleet Management
          </h2>
          <p className="text-gray-600 mt-1">Complete vehicle profiles with insurance tracking and maintenance alerts</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Vehicle Model</Label>
                <Input placeholder="e.g., Isuzu NPR 75" />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input placeholder="e.g., WA 1234 A" />
              </div>
              <div className="space-y-2">
                <Label>Tonnage</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tonnage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5">1.5 Tons</SelectItem>
                    <SelectItem value="3.5">3.5 Tons</SelectItem>
                    <SelectItem value="5">5 Tons</SelectItem>
                    <SelectItem value="10">10 Tons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" placeholder="2024" />
              </div>
              <div className="space-y-2">
                <Label>Insurance Provider</Label>
                <Input placeholder="e.g., Allianz" />
              </div>
              <div className="space-y-2">
                <Label>Insurance Expiry</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={() => setShowAddModal(false)}>Add Vehicle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Monthly Fuel Cost</p>
                <p className="text-2xl font-bold">RM {vehicles.reduce((sum, v) => sum + v.monthlyFuelCost, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Maintenance Due</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {vehicle.model}
                </CardTitle>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Registration</p>
                  <p className="font-medium">{vehicle.registration}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tonnage</p>
                  <p className="font-medium">{vehicle.tonnage}</p>
                </div>
                <div>
                  <p className="text-gray-500">Driver</p>
                  <p className="font-medium">{vehicle.driver}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {vehicle.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Insurance ({vehicle.insurance.provider})</span>
                  </div>
                  <Badge variant={vehicle.insurance.status === 'valid' ? 'default' : 'destructive'}>
                    {vehicle.insurance.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Road Tax</span>
                  </div>
                  <Badge variant={vehicle.roadTax.status === 'valid' ? 'default' : 'destructive'}>
                    {vehicle.roadTax.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-purple-500" />
                    <span>GPS Tracking</span>
                  </div>
                  <Badge variant={vehicle.gpsTracking ? 'default' : 'secondary'}>
                    {vehicle.gpsTracking ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-orange-500" />
                    <span>Fuel Level</span>
                  </div>
                  <span className="font-medium">{vehicle.fuelLevel}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  Track
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Wrench className="h-3 w-3 mr-1" />
                  Maintain
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

export default FleetManagement;
