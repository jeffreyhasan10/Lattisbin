
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Plus, Calendar, Wrench, MapPin, Fuel, Shield, AlertTriangle, Navigation, Clock, DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  model: string;
  registration: string;
  tonnage: string;
  year: number;
  engineType: "Diesel" | "Petrol" | "Electric" | "Hybrid";
  status: "Active" | "Maintenance" | "Inactive" | "Repair";
  location: {
    current: string;
    gpsCoordinates: string;
    lastUpdated: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    status: "Valid" | "Expiring" | "Expired";
    expiry: string;
    premium: number;
    autoRenewal: boolean;
  };
  roadTax: {
    status: "Valid" | "Expiring" | "Expired";
    expiry: string;
    amount: number;
    autoRenewal: boolean;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    serviceHistory: MaintenanceRecord[];
    totalCost: number;
    preferredVendor: string;
  };
  fuelTracking: {
    currentLevel: number;
    efficiency: number; // km per liter
    monthlyConsumption: number;  // liters
    monthlyCost: number;
    alerts: boolean;
  };
  driverHistory: DriverAssignment[];
  downtime: {
    totalDays: number;
    currentMonth: number;
    reasons: DowntimeReason[];
    impactCost: number;
  };
  gpsTracking: {
    isEnabled: boolean;
    deviceId: string;
    geofences: Geofence[];
    batteryLevel: number;
    lastSignal: string;
  };
  specifications: {
    loadCapacity: number;
    dimensions: string;
    wheelbase: string;
    gvw: number; // Gross Vehicle Weight
  };
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: "Routine" | "Repair" | "Emergency" | "Inspection";
  description: string;
  cost: number;
  vendor: string;
  mileage: number;
  partsReplaced: string[];
  nextServiceDue: string;
}

interface DriverAssignment {
  driverId: string;
  driverName: string;
  assignedDate: string;
  unassignedDate?: string;
  performanceRating: number;
  incidents: number;
  fuelEfficiency: number;
}

interface DowntimeReason {
  date: string;
  reason: string;
  duration: number;
  cost: number;
}

interface Geofence {
  id: string;
  name: string;
  type: "Depot" | "Customer" | "Service Center" | "Restricted";
  coordinates: string;
  radius: number;
}

const FleetManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "VEH001",
      model: "Isuzu NPR 75",
      registration: "WA 1234 A",
      tonnage: "3.5 Tons",
      year: 2020,
      engineType: "Diesel",
      status: "Active",
      location: {
        current: "Kuala Lumpur Depot",
        gpsCoordinates: "3.1390,101.6869",
        lastUpdated: "2024-06-15 10:30:00"
      },
      insurance: {
        provider: "Allianz Malaysia",
        policyNumber: "POL123456789",
        status: "Valid",
        expiry: "2024-12-31",
        premium: 3500,
        autoRenewal: true
      },
      roadTax: {
        status: "Valid",
        expiry: "2024-06-30",
        amount: 450,
        autoRenewal: true
      },
      maintenance: {
        lastService: "2024-01-15",
        nextService: "2024-07-15",
        totalCost: 8500,
        preferredVendor: "AutoCare Services Sdn Bhd",
        serviceHistory: [
          {
            id: "SVC001",
            date: "2024-01-15",
            type: "Routine",
            description: "Engine oil change, brake inspection, tire rotation",
            cost: 450,
            vendor: "AutoCare Services Sdn Bhd",
            mileage: 45000,
            partsReplaced: ["Engine Oil", "Oil Filter", "Air Filter"],
            nextServiceDue: "2024-07-15"
          }
        ]
      },
      fuelTracking: {
        currentLevel: 85,
        efficiency: 8.5,
        monthlyConsumption: 480,
        monthlyCost: 1200,
        alerts: true
      },
      driverHistory: [
        {
          driverId: "DRV001",
          driverName: "Ahmad bin Abdullah",
          assignedDate: "2024-01-01",
          performanceRating: 4.5,
          incidents: 0,
          fuelEfficiency: 8.5
        }
      ],
      downtime: {
        totalDays: 5,
        currentMonth: 0,
        reasons: [],
        impactCost: 2500
      },
      gpsTracking: {
        isEnabled: true,
        deviceId: "GPS001",
        geofences: [
          {
            id: "GF001",
            name: "KL Depot",
            type: "Depot",
            coordinates: "3.1390,101.6869",
            radius: 100
          }
        ],
        batteryLevel: 87,
        lastSignal: "2024-06-15 10:25:00"
      },
      specifications: {
        loadCapacity: 3500,
        dimensions: "6.2m × 2.1m × 2.3m",
        wheelbase: "3.815m",
        gvw: 7500
      }
    },
    {
      id: "VEH002",
      model: "Mitsubishi Canter",
      registration: "WA 5678 B",
      tonnage: "5 Tons",
      year: 2019,
      engineType: "Diesel",
      status: "Maintenance",
      location: {
        current: "Service Center, Petaling Jaya",
        gpsCoordinates: "3.1073,101.6415",
        lastUpdated: "2024-06-14 15:45:00"
      },
      insurance: {
        provider: "Great Eastern",
        policyNumber: "GE987654321",
        status: "Valid",
        expiry: "2024-11-15",
        premium: 4200,
        autoRenewal: false
      },
      roadTax: {
        status: "Expiring",
        expiry: "2024-03-31",
        amount: 680,
        autoRenewal: false
      },
      maintenance: {
        lastService: "2024-02-01",
        nextService: "2024-08-01",
        totalCost: 12500,
        preferredVendor: "Mitsubishi Service Center",
        serviceHistory: [
          {
            id: "SVC002",
            date: "2024-02-01",
            type: "Repair",
            description: "Transmission repair, brake pad replacement",
            cost: 2800,
            vendor: "Mitsubishi Service Center",
            mileage: 52000,
            partsReplaced: ["Brake Pads", "Transmission Oil", "Clutch Disc"],
            nextServiceDue: "2024-08-01"
          }
        ]
      },
      fuelTracking: {
        currentLevel: 0,
        efficiency: 7.2,
        monthlyConsumption: 0,
        monthlyCost: 0,
        alerts: true
      },
      driverHistory: [
        {
          driverId: "DRV002",
          driverName: "Tan Wei Ming",
          assignedDate: "2023-08-01",
          unassignedDate: "2024-06-14",
          performanceRating: 4.2,
          incidents: 1,
          fuelEfficiency: 7.2
        }
      ],
      downtime: {
        totalDays: 15,
        currentMonth: 12,
        reasons: [
          {
            date: "2024-06-14",
            reason: "Transmission Repair",
            duration: 12,
            cost: 5000
          }
        ],
        impactCost: 8000
      },
      gpsTracking: {
        isEnabled: true,
        deviceId: "GPS002",
        geofences: [],
        batteryLevel: 34,
        lastSignal: "2024-06-14 15:40:00"
      },
      specifications: {
        loadCapacity: 5000,
        dimensions: "7.2m × 2.2m × 2.5m",
        wheelbase: "4.3m",
        gvw: 8500
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    model: "",
    registration: "",
    tonnage: "",
    year: new Date().getFullYear(),
    engineType: "Diesel" as const,
    insuranceProvider: "",
    insuranceExpiry: "",
    roadTaxExpiry: "",
    preferredVendor: ""
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Maintenance":
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "Repair":
        return <Badge className="bg-red-100 text-red-800">Repair</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getInsuranceStatusBadge = (status: string) => {
    switch (status) {
      case "Valid":
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case "Expiring":
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case "Expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const isMaintenanceDue = (nextService: string): boolean => {
    const nextServiceDate = new Date(nextService);
    const today = new Date();
    const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilService <= 14;
  };

  const isDocumentExpiring = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const handleAddVehicle = () => {
    if (!newVehicle.model || !newVehicle.registration) {
      toast.error("Please fill in all required fields");
      return;
    }

    const vehicle: Vehicle = {
      id: `VEH${String(vehicles.length + 1).padStart(3, '0')}`,
      model: newVehicle.model,
      registration: newVehicle.registration,
      tonnage: newVehicle.tonnage,
      year: newVehicle.year,
      engineType: newVehicle.engineType,
      status: "Active",
      location: {
        current: "Depot",
        gpsCoordinates: "3.1390,101.6869",
        lastUpdated: new Date().toISOString()
      },
      insurance: {
        provider: newVehicle.insuranceProvider,
        policyNumber: `POL${Date.now()}`,
        status: "Valid",
        expiry: newVehicle.insuranceExpiry,
        premium: 3000,
        autoRenewal: false
      },
      roadTax: {
        status: "Valid",
        expiry: newVehicle.roadTaxExpiry,
        amount: 500,
        autoRenewal: false
      },
      maintenance: {
        lastService: new Date().toISOString().split('T')[0],
        nextService: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalCost: 0,
        preferredVendor: newVehicle.preferredVendor,
        serviceHistory: []
      },
      fuelTracking: {
        currentLevel: 100,
        efficiency: 8.0,
        monthlyConsumption: 0,
        monthlyCost: 0,
        alerts: true
      },
      driverHistory: [],
      downtime: {
        totalDays: 0,
        currentMonth: 0,
        reasons: [],
        impactCost: 0
      },
      gpsTracking: {
        isEnabled: true,
        deviceId: `GPS${Date.now()}`,
        geofences: [],
        batteryLevel: 100,
        lastSignal: new Date().toISOString()
      },
      specifications: {
        loadCapacity: parseInt(newVehicle.tonnage) * 1000,
        dimensions: "Standard",
        wheelbase: "Standard",
        gvw: parseInt(newVehicle.tonnage) * 2000
      }
    };

    setVehicles([...vehicles, vehicle]);
    toast.success(`Vehicle ${newVehicle.registration} added successfully with GPS tracking enabled`);
    setShowAddModal(false);
    setNewVehicle({
      model: "",
      registration: "",
      tonnage: "",
      year: new Date().getFullYear(),
      engineType: "Diesel",
      insuranceProvider: "",
      insuranceExpiry: "",
      roadTaxExpiry: "",
      preferredVendor: ""
    });
  };

  const scheduleMaintenanceAlert = (vehicle: Vehicle) => {
    const nextServiceDate = new Date(vehicle.maintenance.nextService);
    const today = new Date();
    const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilService <= 14) {
      toast.warning(`Maintenance due in ${daysUntilService} days for ${vehicle.registration}`);
    }
  };

  const trackVehicleLocation = (vehicle: Vehicle) => {
    if (vehicle.gpsTracking.isEnabled && vehicle.location.gpsCoordinates) {
      toast.success(`GPS Location: ${vehicle.location.gpsCoordinates} | Battery: ${vehicle.gpsTracking.batteryLevel}%`);
    } else {
      toast.error("GPS tracking not available for this vehicle");
    }
  };

  const getFleetStatistics = () => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'Maintenance' || v.status === 'Repair').length;
    const totalFuelCost = vehicles.reduce((sum, v) => sum + v.fuelTracking.monthlyCost, 0);
    const totalMaintenanceCost = vehicles.reduce((sum, v) => sum + v.maintenance.totalCost, 0);
    const averageEfficiency = vehicles.reduce((sum, v) => sum + v.fuelTracking.efficiency, 0) / totalVehicles;
    const totalDowntime = vehicles.reduce((sum, v) => sum + v.downtime.currentMonth, 0);
    const expiringInsurance = vehicles.filter(v => isDocumentExpiring(v.insurance.expiry)).length;
    const expiringRoadTax = vehicles.filter(v => isDocumentExpiring(v.roadTax.expiry)).length;

    return {
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      totalFuelCost,
      totalMaintenanceCost,
      averageEfficiency,
      totalDowntime,
      expiringInsurance,
      expiringRoadTax
    };
  };

  const stats = getFleetStatistics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Phase 5: Advanced Fleet Management System
          </h2>
          <p className="text-gray-600 mt-1">Complete vehicle profiling with insurance tracking, GPS monitoring, and predictive analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAnalyticsModal(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vehicle with GPS Tracking</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div>
                  <Label>Vehicle Model *</Label>
                  <Input
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle(prev => ({...prev, model: e.target.value}))}
                    placeholder="e.g., Isuzu NPR 75"
                  />
                </div>
                <div>
                  <Label>Registration Number *</Label>
                  <Input
                    value={newVehicle.registration}
                    onChange={(e) => setNewVehicle(prev => ({...prev, registration: e.target.value}))}
                    placeholder="e.g., WA 1234 A"
                  />
                </div>
                <div>
                  <Label>Tonnage *</Label>
                  <Select value={newVehicle.tonnage} onValueChange={(value) => setNewVehicle(prev => ({...prev, tonnage: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tonnage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Ton</SelectItem>
                      <SelectItem value="1.5">1.5 Tons</SelectItem>
                      <SelectItem value="3">3 Tons</SelectItem>
                      <SelectItem value="3.5">3.5 Tons</SelectItem>
                      <SelectItem value="5">5 Tons</SelectItem>
                      <SelectItem value="10">10 Tons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle(prev => ({...prev, year: parseInt(e.target.value)}))}
                    min="2000"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <Label>Engine Type</Label>
                  <Select value={newVehicle.engineType} onValueChange={(value: any) => setNewVehicle(prev => ({...prev, engineType: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Insurance Provider</Label>
                  <Input
                    value={newVehicle.insuranceProvider}
                    onChange={(e) => setNewVehicle(prev => ({...prev, insuranceProvider: e.target.value}))}
                    placeholder="e.g., Allianz Malaysia"
                  />
                </div>
                <div>
                  <Label>Insurance Expiry</Label>
                  <Input
                    type="date"
                    value={newVehicle.insuranceExpiry}
                    onChange={(e) => setNewVehicle(prev => ({...prev, insuranceExpiry: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>Road Tax Expiry</Label>
                  <Input
                    type="date"
                    value={newVehicle.roadTaxExpiry}
                    onChange={(e) => setNewVehicle(prev => ({...prev, roadTaxExpiry: e.target.value}))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Preferred Service Vendor</Label>
                  <Input
                    value={newVehicle.preferredVendor}
                    onChange={(e) => setNewVehicle(prev => ({...prev, preferredVendor: e.target.value}))}
                    placeholder="e.g., AutoCare Services Sdn Bhd"
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">✓ GPS tracking will be automatically enabled</p>
                <p className="text-sm text-blue-800">✓ Maintenance schedule will be created</p>
                <p className="text-sm text-blue-800">✓ Fuel monitoring will be activated</p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleAddVehicle} className="bg-blue-600 hover:bg-blue-700">Add Vehicle</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fleet</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalVehicles}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeVehicles}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fuel Efficiency</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.averageEfficiency.toFixed(1)} km/L</p>
              </div>
              <Fuel className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Fuel Cost</p>
                <p className="text-2xl font-bold text-orange-600">RM {stats.totalFuelCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.expiringInsurance + stats.expiringRoadTax}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {vehicle.registration}
                </CardTitle>
                {getStatusBadge(vehicle.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{vehicle.model} ({vehicle.year})</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {isMaintenanceDue(vehicle.maintenance.nextService) && (
                  <Badge className="bg-red-100 text-red-800">
                    <Wrench className="h-3 w-3 mr-1" />
                    Service Due
                  </Badge>
                )}
                {isDocumentExpiring(vehicle.insurance.expiry) && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Insurance Expiring
                  </Badge>
                )}
                {isDocumentExpiring(vehicle.roadTax.expiry) && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <Calendar className="h-3 w-3 mr-1" />
                    Road Tax Expiring
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>Tonnage:</strong> {vehicle.tonnage} | <strong>Engine:</strong> {vehicle.engineType}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{vehicle.location.current}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Insurance:</span>
                  <div className="font-semibold">{getInsuranceStatusBadge(vehicle.insurance.status)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Road Tax:</span>
                  <div className="font-semibold">{getInsuranceStatusBadge(vehicle.roadTax.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Fuel Level:</span>
                  <div className="font-semibold">{vehicle.fuelTracking.currentLevel}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Efficiency:</span>
                  <div className="font-semibold">{vehicle.fuelTracking.efficiency} km/L</div>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">GPS Battery:</span>
                <div className="font-semibold text-blue-600">{vehicle.gpsTracking.batteryLevel}%</div>
              </div>
              {vehicle.driverHistory.length > 0 && (
                <div className="text-xs">
                  <span className="text-gray-500">Current Driver:</span>
                  <div className="font-semibold">{vehicle.driverHistory[vehicle.driverHistory.length - 1].driverName}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => trackVehicleLocation(vehicle)}
                  className="text-xs"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  GPS Track
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => scheduleMaintenanceAlert(vehicle)}
                  className="text-xs"
                >
                  <Wrench className="h-3 w-3 mr-1" />
                  Maintenance
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowDetailModal(true);
                  }}
                  className="text-xs"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Fuel className="h-3 w-3 mr-1" />
                  Fuel Log
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Vehicle Details - {selectedVehicle?.registration}
            </DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vehicle Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>Model:</strong> {selectedVehicle.model}</div>
                    <div><strong>Year:</strong> {selectedVehicle.year}</div>
                    <div><strong>Tonnage:</strong> {selectedVehicle.tonnage}</div>
                    <div><strong>Engine Type:</strong> {selectedVehicle.engineType}</div>
                    <div><strong>Load Capacity:</strong> {selectedVehicle.specifications.loadCapacity} kg</div>
                    <div><strong>Dimensions:</strong> {selectedVehicle.specifications.dimensions}</div>
                    <div><strong>GVW:</strong> {selectedVehicle.specifications.gvw} kg</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Insurance & Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>Insurance Provider:</strong> {selectedVehicle.insurance.provider}</div>
                    <div><strong>Policy Number:</strong> {selectedVehicle.insurance.policyNumber}</div>
                    <div><strong>Insurance Expiry:</strong> {selectedVehicle.insurance.expiry}</div>
                    <div><strong>Annual Premium:</strong> RM {selectedVehicle.insurance.premium}</div>
                    <div><strong>Road Tax Expiry:</strong> {selectedVehicle.roadTax.expiry}</div>
                    <div><strong>Road Tax Amount:</strong> RM {selectedVehicle.roadTax.amount}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Driver Assignment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedVehicle.driverHistory.length > 0 ? (
                    <div className="space-y-3">
                      {selectedVehicle.driverHistory.map((assignment, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{assignment.driverName}</div>
                              <div className="text-sm text-gray-600">
                                {assignment.assignedDate} - {assignment.unassignedDate || 'Current'}
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div>Rating: {assignment.performanceRating}/5</div>
                              <div>Incidents: {assignment.incidents}</div>
                              <div>Efficiency: {assignment.fuelEfficiency} km/L</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No driver assignments recorded</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fuel Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>Current Level:</strong> {selectedVehicle.fuelTracking.currentLevel}%</div>
                    <div><strong>Efficiency:</strong> {selectedVehicle.fuelTracking.efficiency} km/L</div>
                    <div><strong>Monthly Consumption:</strong> {selectedVehicle.fuelTracking.monthlyConsumption} L</div>
                    <div><strong>Monthly Cost:</strong> RM {selectedVehicle.fuelTracking.monthlyCost}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Downtime Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>Total Downtime:</strong> {selectedVehicle.downtime.totalDays} days</div>
                    <div><strong>Current Month:</strong> {selectedVehicle.downtime.currentMonth} days</div>
                    <div><strong>Impact Cost:</strong> RM {selectedVehicle.downtime.impactCost}</div>
                    {selectedVehicle.downtime.reasons.length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium mb-2">Recent Downtime:</div>
                        {selectedVehicle.downtime.reasons.map((reason, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-50 rounded mb-1">
                            <div>{reason.reason} ({reason.duration} days)</div>
                            <div className="text-gray-600">Cost: RM {reason.cost}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Fleet Analytics Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Fleet Utilization</h3>
                  <div className="text-2xl font-bold text-blue-600">{((stats.activeVehicles / stats.totalVehicles) * 100).toFixed(1)}%</div>
                  <p className="text-sm text-gray-600">Active vehicles ratio</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Maintenance Cost</h3>
                  <div className="text-2xl font-bold text-orange-600">
                    RM {stats.totalMaintenanceCost.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total maintenance spend</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Downtime Impact</h3>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.totalDowntime} days
                  </div>
                  <p className="text-sm text-gray-600">This month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Vehicle Performance Summary</h3>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{vehicle.registration}</div>
                          <div className="text-sm text-gray-600">{vehicle.model}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Efficiency: {vehicle.fuelTracking.efficiency} km/L</div>
                        <div className="text-xs text-gray-600">
                          Status: {vehicle.status} | Downtime: {vehicle.downtime.currentMonth} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FleetManagement;
