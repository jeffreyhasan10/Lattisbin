import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Truck, User, Phone, MapPin, CheckCircle, AlertCircle, Package } from "lucide-react";
import { toast } from "sonner";

interface Lorry {
  id: string;
  model: string;
  tonnage: number;
  licensePlate: string;
  status: string;
  assignedDriver?: string;
}

interface Driver {
  id: string;
  name: string;
  icNumber: string;
  hpNumber: string;
  areaOfOperation: string;
  status: string;
  currentAssignment: string | null;
  totalCollections: number;
  totalEarnings: number;
}

const AssignDriverToLorry: React.FC = () => {
  const navigate = useNavigate();
  const { lorryId } = useParams<{ lorryId: string }>();
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  // Mock data - in real app, fetch from API
  const lorry: Lorry = {
    id: lorryId || "LRY-001",
    model: "Hino 500 Series",
    tonnage: 10,
    licensePlate: "WMK 1234",
    status: "Active",
    assignedDriver: undefined
  };

  // Available drivers (Active or without assignment)
  const availableDrivers: Driver[] = [
    {
      id: "DRV-001",
      name: "Ahmad bin Hassan",
      icNumber: "850123-10-5678",
      hpNumber: "+60123456789",
      areaOfOperation: "Downtown",
      status: "Active",
      currentAssignment: null,
      totalCollections: 127,
      totalEarnings: 15750.50
    },
    {
      id: "DRV-002",
      name: "Raj Kumar",
      icNumber: "900215-08-3456",
      hpNumber: "+60198765432",
      areaOfOperation: "Industrial Zone",
      status: "Active",
      currentAssignment: null,
      totalCollections: 184,
      totalEarnings: 22340.75
    },
    {
      id: "DRV-003",
      name: "Lee Wei Ming",
      icNumber: "880930-14-7890",
      hpNumber: "+60176543210",
      areaOfOperation: "Residential",
      status: "Active",
      currentAssignment: null,
      totalCollections: 156,
      totalEarnings: 18920.25
    },
    {
      id: "DRV-004",
      name: "Muthu Selvam",
      icNumber: "920418-03-2345",
      hpNumber: "+60134567890",
      areaOfOperation: "Commercial",
      status: "Active",
      currentAssignment: null,
      totalCollections: 98,
      totalEarnings: 12450.00
    },
    {
      id: "DRV-005",
      name: "Siti Nurhaliza",
      icNumber: "870625-12-4567",
      hpNumber: "+60167890123",
      areaOfOperation: "Downtown",
      status: "Active",
      currentAssignment: null,
      totalCollections: 162,
      totalEarnings: 19670.80
    },
    // External/Third-party drivers
    {
      id: "EXT-001",
      name: "External Driver - John Tan",
      icNumber: "910505-06-1234",
      hpNumber: "+60123334444",
      areaOfOperation: "Various",
      status: "Active",
      currentAssignment: null,
      totalCollections: 45,
      totalEarnings: 5500.00
    }
  ];

  const selectedDriver = availableDrivers.find(d => d.id === selectedDriverId);

  const handleConfirmAssignment = () => {
    if (!selectedDriverId) {
      toast.error("Please select a driver to assign");
      return;
    }

    // In real app, make API call to assign driver
    toast.success(`Successfully assigned ${selectedDriver?.name} to lorry ${lorry.licensePlate}`);
    
    // Navigate back to fleet management
    setTimeout(() => {
      navigate("/admin/fleet");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/admin/fleet");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lorry List
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assign Driver to Lorry</h1>
          <p className="text-gray-600 mt-1">Link a driver to this lorry for operational assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lorry Details */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Lorry Details
            </CardTitle>
            <CardDescription>Vehicle to be assigned</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lorry ID</p>
              <p className="text-lg font-bold text-blue-600">{lorry.id}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Model</p>
              <p className="font-semibold text-lg">{lorry.model}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">License Plate</p>
              <p className="font-bold text-xl font-mono">{lorry.licensePlate}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Tonnage</p>
              <p className="font-semibold">{lorry.tonnage} tons</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <Badge className="bg-green-100 text-green-700 border-green-300">
                {lorry.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Form */}
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Select Driver
            </CardTitle>
            <CardDescription>Choose an available driver for assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Drivers</label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a driver..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="divider-inhouse" disabled className="font-semibold bg-gray-100">
                    In-House Drivers
                  </SelectItem>
                  {availableDrivers.filter(d => !d.id.startsWith("EXT-")).map(driver => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} ({driver.id})
                    </SelectItem>
                  ))}
                  <SelectItem value="divider-external" disabled className="font-semibold bg-gray-100 mt-2">
                    Third-Party Drivers
                  </SelectItem>
                  {availableDrivers.filter(d => d.id.startsWith("EXT-")).map(driver => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} ({driver.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDriver && (
              <>
                <Separator />
                <div className="bg-white rounded-lg p-4 space-y-3 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Driver Details</h4>
                  
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Name</p>
                      <p className="font-semibold">{selectedDriver.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">IC Number</p>
                      <p className="font-mono text-sm">{selectedDriver.icNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Contact</p>
                      <p className="font-semibold text-sm">{selectedDriver.hpNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Area of Operation</p>
                      <p className="font-semibold text-sm">{selectedDriver.areaOfOperation}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded p-2">
                      <p className="text-xs text-gray-600">Total Collections</p>
                      <p className="font-bold text-blue-600 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {selectedDriver.totalCollections}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-xs text-gray-600">Total Earnings</p>
                      <p className="font-bold text-green-600 text-sm">
                        RM {selectedDriver.totalEarnings.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {selectedDriver.currentAssignment ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-yellow-800 font-semibold">Current Assignment</p>
                        <p className="text-sm text-yellow-700">{selectedDriver.currentAssignment}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-700 font-semibold">Available for assignment</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Summary */}
      {selectedDriver && (
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              Assignment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <Truck className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="font-bold text-lg">{lorry.licensePlate}</p>
                <p className="text-sm text-gray-600">{lorry.model}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-indigo-300"></div>
                <ArrowLeft className="w-6 h-6 text-indigo-600 rotate-180" />
                <div className="w-12 h-0.5 bg-indigo-300"></div>
              </div>

              <div className="text-center">
                <User className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="font-bold text-lg">{selectedDriver.name}</p>
                <p className="text-sm text-gray-600">{selectedDriver.id}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="bg-white rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 mb-2">Assignment Details</h4>
              <p className="text-sm text-gray-600">
                <strong>Lorry:</strong> {lorry.model} ({lorry.licensePlate}) - {lorry.tonnage} tons
              </p>
              <p className="text-sm text-gray-600">
                <strong>Driver:</strong> {selectedDriver.name} ({selectedDriver.icNumber})
              </p>
              <p className="text-sm text-gray-600">
                <strong>Area:</strong> {selectedDriver.areaOfOperation}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> Once confirmed, the lorry will be marked as "Assigned" and linked to the driver across all system records.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} size="lg">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAssignment} 
              className="bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={!selectedDriverId}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignDriverToLorry;

