
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Calendar, Wrench, MapPin, Fuel, Shield, AlertTriangle } from "lucide-react";

const FleetManagement: React.FC = () => {
  const [vehicles] = useState([
    {
      id: "VEH001",
      model: "Isuzu NPR 75",
      registration: "WA 1234 A",
      tonnage: "3.5 Tons",
      year: "2020",
      status: "active",
      location: "Kuala Lumpur",
      driver: "John Doe",
      insurance: { status: "valid", expiry: "2024-12-31" },
      roadTax: { status: "valid", expiry: "2024-06-30" },
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      fuelLevel: 85,
      mileage: 45000
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
      insurance: { status: "valid", expiry: "2024-11-15" },
      roadTax: { status: "expiring", expiry: "2024-03-31" },
      lastMaintenance: "2024-02-01",
      nextMaintenance: "2024-05-01",
      fuelLevel: 0,
      mileage: 52000
    }
  ]);

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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
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
              <Wrench className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'maintenance').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
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
                  <p className="text-gray-500">Year</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-gray-500">Driver</p>
                  <p className="font-medium">{vehicle.driver}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Insurance</span>
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
                    <Fuel className="h-4 w-4 text-orange-500" />
                    <span>Fuel Level</span>
                  </div>
                  <span className="font-medium">{vehicle.fuelLevel}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Schedule Maintenance
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
