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
  MapPin, 
  User, 
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lorry {
  id: number;
  registrationNumber: string;
  driverId: string;
  availabilityStatus: string;
  taskDescription?: string;
  currentLocation?: string;
  lastUpdated: string;
  maxBins?: number;
}

const DUMMY_LORRIES: Lorry[] = [
  {
    id: 1,
    registrationNumber: "WKL1234A",
    driverId: "DRV001",
    availabilityStatus: "available",
    taskDescription: "Ready for bin delivery",
    currentLocation: "Depot A",
    lastUpdated: "2025-01-14",
    maxBins: 5
  },
  {
    id: 2,
    registrationNumber: "WKL5678B",
    driverId: "DRV002", 
    availabilityStatus: "assigned",
    taskDescription: "Delivering bins to Kuala Lumpur",
    currentLocation: "En route",
    lastUpdated: "2025-01-14",
    maxBins: 8
  },
  {
    id: 3,
    registrationNumber: "WKL9012C",
    driverId: "DRV003",
    availabilityStatus: "under_maintenance",
    taskDescription: "Scheduled maintenance",
    currentLocation: "Service Center",
    lastUpdated: "2025-01-13",
    maxBins: 6
  }
];

const RentableLorries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lorries] = useState(DUMMY_LORRIES);

  const filteredLorries = useMemo(() => {
    return lorries.filter(lorry => {
      const matchesSearch = lorry.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lorry.driverId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lorry.availabilityStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lorries, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: "Available", variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" },
      assigned: { label: "Assigned", variant: "secondary" as const, className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" },
      under_maintenance: { label: "Maintenance", variant: "destructive" as const, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Rentable Lorries</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your fleet rental operations</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Rentable Lorry
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by registration number or driver ID..."
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
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="under_maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lorries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLorries.map((lorry) => (
          <Card key={lorry.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {lorry.registrationNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {lorry.id}</p>
                  </div>
                </div>
                {getStatusBadge(lorry.availabilityStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">Driver: {lorry.driverId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">Last Updated: {lorry.lastUpdated}</span>
                </div>
                {lorry.currentLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{lorry.currentLocation}</span>
                  </div>
                )}
                {lorry.taskDescription && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Task: </span> 
                    <span className="text-gray-600 dark:text-gray-400">{lorry.taskDescription}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 dark:border-gray-700">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 dark:border-gray-700">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-gray-200 dark:border-gray-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLorries.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Truck className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No lorries found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by adding your first rentable lorry"}
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Rentable Lorry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const DUMMY_LORRIES = [
  {
    id: 1,
    registrationNumber: "WKL1234A",
    driverId: "DRV001",
    availabilityStatus: "available",
    taskDescription: "Ready for bin delivery",
    currentLocation: "Depot A",
    lastUpdated: "2025-01-14",
    maxBins: 5
  },
  {
    id: 2,
    registrationNumber: "WKL5678B",
    driverId: "DRV002", 
    availabilityStatus: "assigned",
    taskDescription: "Delivering bins to Kuala Lumpur",
    currentLocation: "En route",
    lastUpdated: "2025-01-14",
    maxBins: 8
  },
  {
    id: 3,
    registrationNumber: "WKL9012C",
    driverId: "DRV003",
    availabilityStatus: "under_maintenance",
    taskDescription: "Scheduled maintenance",
    currentLocation: "Service Center",
    lastUpdated: "2025-01-13",
    maxBins: 6
  }
];

export default RentableLorries;
