
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, MapPin, Settings, QrCode, Calendar, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
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
  };
  qrCode: string;
  utilization: {
    totalDays: number;
    currentMonth: number;
    utilizationRate: number;
  };
  assignedCustomer?: string;
  assignedDriver?: string;
}

interface ServiceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

const AdminInventoryManagement: React.FC = () => {
  const binSizes = [
    { size: "2ft(H) × 12ft(L) × 6ft(W)", volume: "144 cubic feet", dailyRate: 80 },
    { size: "4ft(H) × 12ft(L) × 6ft(W)", volume: "288 cubic feet", dailyRate: 120 },
    { size: "4ft(H) × 14ft(L) × 6ft(W)", volume: "336 cubic feet", dailyRate: 140 },
    { size: "5ft(H) × 12ft(L) × 6ft(W)", volume: "360 cubic feet", dailyRate: 160 },
    { size: "6ft(H) × 24ft(L) × 8ft(W)", volume: "1152 cubic feet", dailyRate: 300 },
    { size: "6.5ft(H) × 14.5ft(L) × 6ft(W)", volume: "565.5 cubic feet", dailyRate: 200 }
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
        serviceHistory: [
          {
            id: "SVC001",
            date: "2024-01-10",
            type: "Routine Maintenance",
            description: "General cleaning and inspection",
            cost: 150,
            technician: "Ahmad bin Ali"
          }
        ]
      },
      qrCode: "QR_ASR100001",
      utilization: {
        totalDays: 180,
        currentMonth: 25,
        utilizationRate: 83
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
        serviceHistory: [
          {
            id: "SVC002",
            date: "2024-06-14",
            type: "Repair",
            description: "Fixed hydraulic system leak",
            cost: 850,
            technician: "Lim Wei Ming"
          }
        ]
      },
      qrCode: "QR_LASR200001",
      utilization: {
        totalDays: 150,
        currentMonth: 0,
        utilizationRate: 67
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
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
      weeklyRate: sizeInfo.dailyRate * 6, // 15% discount for weekly
      monthlyRate: sizeInfo.dailyRate * 22 // 25% discount for monthly
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
        serviceHistory: []
      },
      qrCode: `QR_${serialNumber}`,
      utilization: {
        totalDays: 0,
        currentMonth: 0,
        utilizationRate: 0
      }
    };

    setBins([...bins, bin]);
    toast.success(`Bin ${serialNumber} added successfully`);
    setShowAddModal(false);
    setNewBin({
      series: "ASR",
      size: "",
      location: "",
      condition: "Good"
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
            Advanced Inventory Management
          </h2>
          <p className="text-gray-600 mt-1">Real-time bin tracking with GPS, maintenance scheduling, and utilization analytics</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Bin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Bin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="series">Bin Series *</Label>
                <Select value={newBin.series} onValueChange={(value: any) => setNewBin(prev => ({...prev, series: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASR">ASR Series</SelectItem>
                    <SelectItem value="LASR">LASR Series</SelectItem>
                    <SelectItem value="PWD">PWD Series</SelectItem>
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
                        {sizeInfo.size} - RM {sizeInfo.dailyRate}/day
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
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddBin} className="bg-purple-600 hover:bg-purple-700">Add Bin</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-600">In Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">{bins.filter(b => b.status === 'Maintenance').length}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-600" />
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

      {/* Bins Grid */}
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
              <div className="flex items-center gap-2">
                {getConditionBadge(bin.condition)}
                {isMaintenanceDue(bin.maintenance.nextService) && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Service Due
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
              <div className="text-sm">
                <strong>Utilization:</strong> {bin.utilization.utilizationRate}% this month
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Track
                </Button>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Bin Sizes Reference */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardHeader>
          <CardTitle>Available Bin Sizes & Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {binSizes.map((sizeInfo, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm">{sizeInfo.size}</div>
                <div className="text-xs text-gray-600 mt-1">{sizeInfo.volume}</div>
                <div className="text-sm font-semibold text-purple-600 mt-2">
                  RM {sizeInfo.dailyRate}/day
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventoryManagement;
