
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, MapPin, Settings, QrCode, Calendar, AlertTriangle, CheckCircle, Clock, Wrench, Navigation, TrendingUp, DollarSign, Activity } from "lucide-react";
import { toast } from "sonner";

interface Bin {
  id: string;
  serialNumber: string;
  series: "ASR" | "LASR" | "PWD";
  size: string;
  condition: "Good" | "Needs Repair" | "Out of Service";
  status: "Available" | "In Use" | "Maintenance" | "Reserved";
  location: {
    current: string;
    gpsCoordinates?: string;
    lastUpdated: string;
  };
  pricing: {
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    serviceHistory: ServiceRecord[];
    estimatedCost: number;
  };
  qrCode: string;
  utilization: {
    totalDays: number;
    currentMonth: number;
    utilizationRate: number;
    predictedDemand: number;
  };
  assignedCustomer?: string;
  assignedDriver?: string;
  gpsTracking: {
    isEnabled: boolean;
    batteryLevel?: number;
    lastSignal?: string;
  };
}

interface ServiceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  technician: string;
  duration: number;
}

const AdminInventoryManagement: React.FC = () => {
  const binSizes = [
    { size: "2ft(H) × 12ft(L) × 6ft(W)", volume: "144 cubic feet", dailyRate: 80, category: "Small" },
    { size: "4ft(H) × 12ft(L) × 6ft(W)", volume: "288 cubic feet", dailyRate: 120, category: "Medium" },
    { size: "4ft(H) × 14ft(L) × 6ft(W)", volume: "336 cubic feet", dailyRate: 140, category: "Medium" },
    { size: "5ft(H) × 12ft(L) × 6ft(W)", volume: "360 cubic feet", dailyRate: 160, category: "Large" },
    { size: "6ft(H) × 24ft(L) × 8ft(W)", volume: "1152 cubic feet", dailyRate: 300, category: "Extra Large" },
    { size: "6.5ft(H) × 14.5ft(L) × 6ft(W)", volume: "565.5 cubic feet", dailyRate: 200, category: "Large" }
  ];

  const [bins, setBins] = useState<Bin[]>([
    {
      id: "BIN001",
      serialNumber: "ASR100001",
      series: "ASR",
      size: "4ft(H) × 12ft(L) × 6ft(W)",
      condition: "Good",
      status: "Available",
      location: {
        current: "Warehouse A, Kuala Lumpur",
        gpsCoordinates: "3.1390,101.6869",
        lastUpdated: "2024-06-15 10:30:00"
      },
      pricing: {
        dailyRate: 120,
        weeklyRate: 700,
        monthlyRate: 2500
      },
      maintenance: {
        lastService: "2024-01-10",
        nextService: "2024-07-10",
        estimatedCost: 250,
        serviceHistory: [
          {
            id: "SVC001",
            date: "2024-01-10",
            type: "Routine Maintenance",
            description: "General cleaning and inspection",
            cost: 150,
            technician: "Ahmad bin Ali",
            duration: 2
          }
        ]
      },
      qrCode: "QR_ASR100001",
      utilization: {
        totalDays: 180,
        currentMonth: 25,
        utilizationRate: 83,
        predictedDemand: 92
      },
      gpsTracking: {
        isEnabled: true,
        batteryLevel: 87,
        lastSignal: "2024-06-15 10:25:00"
      }
    },
    {
      id: "BIN002",
      serialNumber: "LASR200001",
      series: "LASR",
      size: "6ft(H) × 24ft(L) × 8ft(W)",
      condition: "Needs Repair",
      status: "Maintenance",
      location: {
        current: "Service Center, Petaling Jaya",
        gpsCoordinates: "3.1073,101.6415",
        lastUpdated: "2024-06-14 15:45:00"
      },
      pricing: {
        dailyRate: 300,
        weeklyRate: 1800,
        monthlyRate: 6500
      },
      maintenance: {
        lastService: "2024-06-14",
        nextService: "2024-12-14",
        estimatedCost: 1200,
        serviceHistory: [
          {
            id: "SVC002",
            date: "2024-06-14",
            type: "Repair",
            description: "Fixed hydraulic system leak",
            cost: 850,
            technician: "Lim Wei Ming",
            duration: 6
          }
        ]
      },
      qrCode: "QR_LASR200001",
      utilization: {
        totalDays: 150,
        currentMonth: 0,
        utilizationRate: 67,
        predictedDemand: 45
      },
      gpsTracking: {
        isEnabled: true,
        batteryLevel: 34,
        lastSignal: "2024-06-14 15:40:00"
      }
    },
    {
      id: "BIN003",
      serialNumber: "PWD300001",
      series: "PWD",
      size: "2ft(H) × 12ft(L) × 6ft(W)",
      condition: "Good",
      status: "In Use",
      location: {
        current: "ABC Construction Site, Shah Alam",
        gpsCoordinates: "3.0738,101.5183",
        lastUpdated: "2024-06-15 09:15:00"
      },
      pricing: {
        dailyRate: 80,
        weeklyRate: 450,
        monthlyRate: 1600
      },
      maintenance: {
        lastService: "2024-03-10",
        nextService: "2024-09-10",
        estimatedCost: 180,
        serviceHistory: []
      },
      qrCode: "QR_PWD300001",
      utilization: {
        totalDays: 90,
        currentMonth: 30,
        utilizationRate: 100,
        predictedDemand: 98
      },
      assignedCustomer: "ABC Construction Sdn Bhd",
      assignedDriver: "Driver 001",
      gpsTracking: {
        isEnabled: true,
        batteryLevel: 92,
        lastSignal: "2024-06-15 09:10:00"
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedBinId, setSelectedBinId] = useState("");
  const [newBin, setNewBin] = useState({
    series: "ASR" as const,
    size: "",
    location: "",
    condition: "Good" as const
  });

  const generateSerialNumber = (series: string): string => {
    const seriesCount = bins.filter(bin => bin.series === series).length + 1;
    const seriesCode = series === "ASR" ? "ASR1" : series === "LASR" ? "LASR2" : "PWD3";
    return `${seriesCode}${String(seriesCount).padStart(5, '0')}`;
  };

  const calculatePricing = (size: string) => {
    const sizeInfo = binSizes.find(s => s.size === size);
    if (!sizeInfo) return { dailyRate: 100, weeklyRate: 600, monthlyRate: 2000 };
    
    return {
      dailyRate: sizeInfo.dailyRate,
      weeklyRate: Math.round(sizeInfo.dailyRate * 6), // 15% discount for weekly
      monthlyRate: Math.round(sizeInfo.dailyRate * 22) // 25% discount for monthly
    };
  };

  const handleAddBin = () => {
    if (!newBin.size || !newBin.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const serialNumber = generateSerialNumber(newBin.series);
    const pricing = calculatePricing(newBin.size);

    const bin: Bin = {
      id: `BIN${String(bins.length + 1).padStart(3, '0')}`,
      serialNumber,
      series: newBin.series,
      size: newBin.size,
      condition: newBin.condition,
      status: "Available",
      location: {
        current: newBin.location,
        lastUpdated: new Date().toISOString()
      },
      pricing,
      maintenance: {
        lastService: new Date().toISOString().split('T')[0],
        nextService: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedCost: Math.round(pricing.dailyRate * 2.5),
        serviceHistory: []
      },
      qrCode: `QR_${serialNumber}`,
      utilization: {
        totalDays: 0,
        currentMonth: 0,
        utilizationRate: 0,
        predictedDemand: Math.floor(Math.random() * 100)
      },
      gpsTracking: {
        isEnabled: true,
        batteryLevel: 100,
        lastSignal: new Date().toISOString()
      }
    };

    setBins([...bins, bin]);
    toast.success(`Bin ${serialNumber} added successfully with GPS tracking enabled`);
    setShowAddModal(false);
    setNewBin({
      series: "ASR",
      size: "",
      location: "",
      condition: "Good"
    });
  };

  const scheduleMaintenanceAlert = (bin: Bin) => {
    const nextServiceDate = new Date(bin.maintenance.nextService);
    const today = new Date();
    const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilService <= 7) {
      toast.warning(`Maintenance due in ${daysUntilService} days for ${bin.serialNumber}`);
    }
  };

  const generateQRCode = (binId: string) => {
    const bin = bins.find(b => b.id === binId);
    if (bin) {
      toast.success(`QR Code generated for ${bin.serialNumber}. Code: ${bin.qrCode}`);
      // In real implementation, this would generate and display an actual QR code
    }
  };

  const trackBinLocation = (binId: string) => {
    const bin = bins.find(b => b.id === binId);
    if (bin && bin.location.gpsCoordinates) {
      toast.success(`GPS Location: ${bin.location.gpsCoordinates} | Battery: ${bin.gpsTracking.batteryLevel}%`);
      // In real implementation, this would open a map view
    } else {
      toast.error("GPS tracking not available for this bin");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Available</Badge>;
      case "In Use":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />In Use</Badge>;
      case "Maintenance":
        return <Badge className="bg-orange-100 text-orange-800"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case "Reserved":
        return <Badge className="bg-purple-100 text-purple-800"><Clock className="h-3 w-3 mr-1" />Reserved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "Good":
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case "Needs Repair":
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Repair</Badge>;
      case "Out of Service":
        return <Badge className="bg-red-100 text-red-800">Out of Service</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const isMaintenanceDue = (nextService: string): boolean => {
    const nextServiceDate = new Date(nextService);
    const today = new Date();
    const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilService <= 30;
  };

  const isGPSLowBattery = (batteryLevel?: number): boolean => {
    return batteryLevel !== undefined && batteryLevel < 20;
  };

  const getTotalRevenue = () => {
    return bins
      .filter(bin => bin.status === "In Use")
      .reduce((total, bin) => total + bin.pricing.dailyRate * bin.utilization.currentMonth, 0);
  };

  const getAverageUtilization = () => {
    const totalUtilization = bins.reduce((sum, bin) => sum + bin.utilization.utilizationRate, 0);
    return Math.round(totalUtilization / bins.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
             Advanced Inventory Management
          </h2>
          <p className="text-gray-600 mt-1">Real-time GPS tracking, predictive analytics, and automated maintenance scheduling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAnalyticsModal(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Bin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Bin with GPS Tracking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="series">Bin Series *</Label>
                  <Select value={newBin.series} onValueChange={(value: any) => setNewBin(prev => ({...prev, series: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASR">ASR Series - Standard</SelectItem>
                      <SelectItem value="LASR">LASR Series - Large</SelectItem>
                      <SelectItem value="PWD">PWD Series - Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size">Bin Size *</Label>
                  <Select value={newBin.size} onValueChange={(value) => setNewBin(prev => ({...prev, size: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bin size" />
                    </SelectTrigger>
                    <SelectContent>
                      {binSizes.map((sizeInfo) => (
                        <SelectItem key={sizeInfo.size} value={sizeInfo.size}>
                          {sizeInfo.size} - {sizeInfo.category} - RM {sizeInfo.dailyRate}/day
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Initial Location *</Label>
                  <Input
                    id="location"
                    value={newBin.location}
                    onChange={(e) => setNewBin(prev => ({...prev, location: e.target.value}))}
                    placeholder="Warehouse A, Kuala Lumpur"
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Initial Condition</Label>
                  <Select value={newBin.condition} onValueChange={(value: any) => setNewBin(prev => ({...prev, condition: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">✓ GPS tracking will be automatically enabled</p>
                  <p className="text-sm text-blue-800">✓ QR code will be auto-generated</p>
                  <p className="text-sm text-blue-800">✓ Maintenance schedule will be created</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleAddBin} className="bg-purple-600 hover:bg-purple-700">Add Bin</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bins</p>
                <p className="text-2xl font-bold text-purple-600">{bins.length}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{bins.filter(b => b.status === 'Available').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Utilization</p>
                <p className="text-2xl font-bold text-blue-600">{getAverageUtilization()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">RM {getTotalRevenue().toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance Due</p>
                <p className="text-2xl font-bold text-red-600">{bins.filter(b => isMaintenanceDue(b.maintenance.nextService)).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Bins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bins.map((bin) => (
          <Card key={bin.id} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  {bin.serialNumber}
                </CardTitle>
                {getStatusBadge(bin.status)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {getConditionBadge(bin.condition)}
                {isMaintenanceDue(bin.maintenance.nextService) && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Service Due
                  </Badge>
                )}
                {isGPSLowBattery(bin.gpsTracking.batteryLevel) && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <Activity className="h-3 w-3 mr-1" />
                    Low Battery
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>Size:</strong> {bin.size}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{bin.location.current}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Next Service: {bin.maintenance.nextService}</span>
              </div>
              <div className="text-sm">
                <strong>Pricing:</strong> RM {bin.pricing.dailyRate}/day
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Utilization:</span>
                  <div className="font-semibold">{bin.utilization.utilizationRate}%</div>
                </div>
                <div>
                  <span className="text-gray-500">GPS Battery:</span>
                  <div className="font-semibold">{bin.gpsTracking.batteryLevel}%</div>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">Predicted Demand:</span>
                <div className="font-semibold text-blue-600">{bin.utilization.predictedDemand}%</div>
              </div>
              {bin.assignedCustomer && (
                <div className="text-xs">
                  <span className="text-gray-500">Assigned to:</span>
                  <div className="font-semibold">{bin.assignedCustomer}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => generateQRCode(bin.id)}
                  className="text-xs"
                >
                  <QrCode className="h-3 w-3 mr-1" />
                  QR Code
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => trackBinLocation(bin.id)}
                  className="text-xs"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  GPS Track
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => scheduleMaintenanceAlert(bin)}
                  className="text-xs"
                >
                  <Wrench className="h-3 w-3 mr-1" />
                  Maintenance
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Bin Sizes Reference with Dynamic Pricing */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardHeader>
          <CardTitle>Dynamic Pricing Matrix - All Bin Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {binSizes.map((sizeInfo, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border">
                <div className="font-medium text-sm">{sizeInfo.size}</div>
                <div className="text-xs text-gray-600 mt-1">{sizeInfo.volume} - {sizeInfo.category}</div>
                <div className="mt-2 space-y-1">
                  <div className="text-sm font-semibold text-purple-600">
                    Daily: RM {sizeInfo.dailyRate}
                  </div>
                  <div className="text-xs text-gray-600">
                    Weekly: RM {Math.round(sizeInfo.dailyRate * 6)} (15% off)
                  </div>
                  <div className="text-xs text-gray-600">
                    Monthly: RM {Math.round(sizeInfo.dailyRate * 22)} (25% off)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictive Analytics Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Fleet Utilization</h3>
                  <div className="text-2xl font-bold text-blue-600">{getAverageUtilization()}%</div>
                  <p className="text-sm text-gray-600">Average across all bins</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Predictive Maintenance</h3>
                  <div className="text-2xl font-bold text-orange-600">
                    {bins.filter(b => isMaintenanceDue(b.maintenance.nextService)).length}
                  </div>
                  <p className="text-sm text-gray-600">Bins requiring service</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Revenue Forecast</h3>
                  <div className="text-2xl font-bold text-green-600">
                    RM {Math.round(getTotalRevenue() * 1.15).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Next month projection</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Bin Performance Analytics</h3>
                <div className="space-y-4">
                  {bins.map((bin) => (
                    <div key={bin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium">{bin.serialNumber}</div>
                          <div className="text-sm text-gray-600">{bin.size}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Utilization: {bin.utilization.utilizationRate}%</div>
                        <div className="text-xs text-blue-600">Predicted: {bin.utilization.predictedDemand}%</div>
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

export default AdminInventoryManagement;
