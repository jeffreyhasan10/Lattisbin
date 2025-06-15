
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Fuel,
  Settings,
  Filter,
  Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/dashboard/DataTable";

interface Lorry {
  id: number;
  plateNumber: string;
  model: string;
  capacity: string;
  status: string;
  location: string;
  nextMaintenance: string;
  driverAssigned: string;
  fuelLevel: number;
  dailyRate: number;
}

const LORRY_DATA: Lorry[] = [
  {
    id: 1,
    plateNumber: "WAA 1234",
    model: "Isuzu NPR",
    capacity: "3 Ton",
    status: "available",
    location: "Depot A - Kuala Lumpur",
    nextMaintenance: "2024-02-15",
    driverAssigned: "Ahmad Rahman",
    fuelLevel: 85,
    dailyRate: 250.00
  },
  {
    id: 2,
    plateNumber: "WBB 5678",
    model: "Mercedes Actros",
    capacity: "5 Ton",
    status: "rented",
    location: "Petaling Jaya",
    nextMaintenance: "2024-01-20",
    driverAssigned: "Lim Wei Ming",
    fuelLevel: 60,
    dailyRate: 400.00
  },
  {
    id: 3,
    plateNumber: "WCC 9012",
    model: "Hino 300",
    capacity: "2 Ton", 
    status: "maintenance",
    location: "Workshop - Subang",
    nextMaintenance: "2024-01-25",
    driverAssigned: "Ali Hassan",
    fuelLevel: 30,
    dailyRate: 200.00
  }
];

const RentableLorries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lorries, setLorries] = useState(LORRY_DATA);
  const { toast } = useToast();

  const filteredLorries = useMemo(() =>  {
    return lorries.filter(lorry => {
      const matchesSearch = lorry.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lorry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lorry.driverAssigned.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lorry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lorries, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: "Available", variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" },
      rented: { label: "Rented", variant: "secondary" as const, className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" },
      maintenance: { label: "Maintenance", variant: "destructive" as const, className: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getFuelBadge = (level: number) => {
    if (level >= 70) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">Full</Badge>;
    } else if (level >= 30) {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">Medium</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Low</Badge>;
    }
  };

  const handleView = (lorry: Lorry) => {
    console.log("Viewing lorry:", lorry);
    toast({
      title: "Lorry Details",
      description: `Viewing details for ${lorry.plateNumber}`,
    });
  };

  const handleEdit = (lorry: Lorry) => {
    console.log("Editing lorry:", lorry);
    toast({
      title: "Edit Lorry",
      description: `Opening edit form for ${lorry.plateNumber}`,
    });
  };

  const handleSettings = (lorry: Lorry) => {
    console.log("Opening settings for lorry:", lorry);
    toast({
      title: "Lorry Settings",
      description: `Opening settings for ${lorry.plateNumber}`,
    });
  };

  const handleAddLorry = () => {
    console.log("Adding new lorry");
    toast({
      title: "Add Lorry",
      description: "Opening form to add a new lorry",
    });
  };

  const handleExport = () => {
    console.log("Exporting lorry data");
    toast({
      title: "Export Started",
      description: "Lorry data is being exported...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Lorry data has been exported successfully.",
      });
    }, 2000);
  };

  const columns = [
    {
      key: "lorry",
      header: "Lorry Details",
      render: (lorry: Lorry) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{lorry.plateNumber}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lorry.model}</p>
          </div>
        </div>
      )
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (lorry: Lorry) => (
        <div className="text-center">
          <p className="font-medium text-gray-900 dark:text-gray-100">{lorry.capacity}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Load Capacity</p>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (lorry: Lorry) => getStatusBadge(lorry.status)
    },
    {
      key: "location",
      header: "Location",
      render: (lorry: Lorry) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{lorry.location}</span>
        </div>
      )
    },
    {
      key: "driver",
      header: "Driver",
      render: (lorry: Lorry) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{lorry.driverAssigned}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Driver</p>
        </div>
      )
    },
    {
      key: "fuel",
      header: "Fuel Level",
      render: (lorry: Lorry) => (
        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{lorry.fuelLevel}%</span>
          {getFuelBadge(lorry.fuelLevel)}
        </div>
      )
    },
    {
      key: "maintenance",
      header: "Next Maintenance",
      render: (lorry: Lorry) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(lorry.nextMaintenance).toLocaleDateString()}
          </span>
        </div>
      )
    },
    {
      key: "rate",
      header: "Daily Rate",
      render: (lorry: Lorry) => (
        <div className="text-right">
          <p className="font-medium text-gray-900 dark:text-gray-100">RM{lorry.dailyRate.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">per day</p>
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (lorry: Lorry) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleView(lorry)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEdit(lorry)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSettings(lorry)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rentable Lorries</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your lorry fleet and rentals</p>
        </div>
        <Button 
          onClick={handleAddLorry}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lorry
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search lorries by plate number, model, or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExport} className="border-gray-200 dark:border-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lorries Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Lorry Fleet ({filteredLorries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={filteredLorries} 
            columns={columns}
            emptyMessage="No lorries found"
          />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lorries.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Total Lorries</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 dark:text-green-400 text-sm font-bold">A</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {lorries.filter(l => l.status === 'available').length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Available</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">R</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {lorries.filter(l => l.status === 'rented').length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Rented</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">RM</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              RM{lorries.reduce((sum, l) => sum + l.dailyRate, 0).toFixed(0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Daily Revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentableLorries;
