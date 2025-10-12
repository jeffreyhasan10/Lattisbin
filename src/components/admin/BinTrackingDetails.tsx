import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, MapPin, Calendar, Package, Activity, TrendingUp, Clock, User, Navigation } from "lucide-react";
import { toast } from "sonner";

interface BinHistory {
  id: string;
  date: string;
  time: string;
  action: string;
  status: string;
  location: string;
  performedBy: string;
  notes?: string;
}

interface BinDetails {
  id: string;
  serialNumber: string;
  size: string;
  type: string;
  dimensions: {
    height: string;
    length: string;
    width: string;
  };
  cubicYards?: string;
  weight?: string;
  status: "Available" | "Out for Collection" | "Collected" | "Under Maintenance";
  area?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedTo?: string;
  lastMaintenance?: string;
  totalUsage: number;
  createdDate: string;
}

const BinTrackingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { binId } = useParams<{ binId: string }>();

  // Mock data - in real app, fetch from API based on binId
  const [binDetails] = useState<BinDetails>({
    id: binId || "1",
    serialNumber: "ASR-100",
    size: "10 Yard",
    type: "Dumpster",
    dimensions: { height: "4ft", length: "10ft", width: "7ft" },
    cubicYards: "10",
    weight: "2,220lbs",
    status: "Available",
    area: "Downtown",
    currentLocation: {
      lat: 40.7128,
      lng: -74.0060,
      address: "123 Main Street, Downtown District"
    },
    assignedTo: "Available for assignment",
    lastMaintenance: "2025-09-15",
    totalUsage: 47,
    createdDate: "2024-01-15"
  });

  const [history] = useState<BinHistory[]>([
    {
      id: "1",
      date: "2025-10-11",
      time: "14:30",
      action: "Returned to Depot",
      status: "Available",
      location: "Main Depot - Downtown",
      performedBy: "John Driver",
      notes: "Bin cleaned and inspected"
    },
    {
      id: "2",
      date: "2025-10-10",
      time: "09:15",
      action: "Collected from Customer",
      status: "Collected",
      location: "456 Business Ave",
      performedBy: "John Driver",
      notes: "Full bin collected, customer satisfied"
    },
    {
      id: "3",
      date: "2025-10-08",
      time: "11:00",
      action: "Delivered to Customer",
      status: "Out for Collection",
      location: "456 Business Ave",
      performedBy: "Mike Wilson",
      notes: "Delivered for construction waste"
    },
    {
      id: "4",
      date: "2025-10-07",
      time: "16:45",
      action: "Assigned to Order #12345",
      status: "Out for Collection",
      location: "Main Depot",
      performedBy: "Admin User",
      notes: "Assigned to customer ABC Corp"
    },
    {
      id: "5",
      date: "2025-09-28",
      time: "10:20",
      action: "Returned to Depot",
      status: "Available",
      location: "Main Depot - Downtown",
      performedBy: "Sarah Johnson",
      notes: "Previous order completed"
    },
    {
      id: "6",
      date: "2025-09-20",
      time: "08:30",
      action: "Delivered to Customer",
      status: "Out for Collection",
      location: "789 Industrial Park",
      performedBy: "Sarah Johnson",
      notes: "Commercial waste collection"
    },
    {
      id: "7",
      date: "2025-09-15",
      time: "13:00",
      action: "Maintenance Completed",
      status: "Available",
      location: "Maintenance Facility",
      performedBy: "Maintenance Team",
      notes: "Routine inspection and repairs completed"
    },
    {
      id: "8",
      date: "2025-09-14",
      time: "09:00",
      action: "Sent for Maintenance",
      status: "Under Maintenance",
      location: "Maintenance Facility",
      performedBy: "Admin User",
      notes: "Scheduled maintenance check"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Available": "bg-green-100 text-green-700 border-green-300",
      "Out for Collection": "bg-blue-100 text-blue-700 border-blue-300",
      "Collected": "bg-orange-100 text-orange-700 border-orange-300",
      "Under Maintenance": "bg-red-100 text-red-700 border-red-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const handleBackToList = () => {
    navigate("/admin/inventory");
  };

  const handleViewLocation = () => {
    if (binDetails.currentLocation) {
      // In a real app, this would open a map view
      toast.info(`Location: ${binDetails.currentLocation.address}`);
    }
  };

  const usagePercentage = Math.min((binDetails.totalUsage / 100) * 100, 100);
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - new Date(binDetails.createdDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bin List
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Bin Details - {binDetails.serialNumber}
          </h1>
          <p className="text-gray-600 mt-1">Complete tracking and lifecycle information</p>
        </div>
        <Badge className={`${getStatusBadge(binDetails.status)} text-lg px-4 py-2`}>
          {binDetails.status}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bin Specifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Bin Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Serial Number</p>
                <p className="font-semibold text-lg">{binDetails.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-semibold text-lg">{binDetails.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Size</p>
                <p className="font-semibold text-lg">
                  {binDetails.size}
                  {binDetails.cubicYards && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({binDetails.cubicYards} yd³)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Dimensions (H × L × W)</p>
                <p className="font-semibold text-lg">
                  {binDetails.dimensions.height} × {binDetails.dimensions.length} × {binDetails.dimensions.width}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Approximate Weight</p>
                <p className="font-semibold text-lg">{binDetails.weight || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Area Assignment</p>
                <p className="font-semibold text-lg">{binDetails.area || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Uses</p>
              <p className="text-3xl font-bold text-blue-600">{binDetails.totalUsage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Usage Rate</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{usagePercentage.toFixed(0)}% utilized</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">In Service Since</p>
              <p className="font-semibold">{binDetails.createdDate}</p>
              <p className="text-xs text-gray-500">{daysSinceCreation} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Location & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {binDetails.currentLocation ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{binDetails.currentLocation.address}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Coordinates: {binDetails.currentLocation.lat.toFixed(4)}, {binDetails.currentLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <Button onClick={handleViewLocation} className="w-full mt-3" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">Location not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Currently Assigned To:</span>
              <span className="font-semibold">{binDetails.assignedTo}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Maintenance:</span>
              <span className="font-semibold">{binDetails.lastMaintenance || "N/A"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Asset ID:</span>
              <span className="font-semibold font-mono text-blue-600">{binDetails.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Complete History & Lifecycle
          </CardTitle>
          <CardDescription>
            Track all movements, status changes, and actions performed on this bin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{record.date}</p>
                          <p className="text-xs text-gray-500">{record.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{record.action}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {record.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="w-3 h-3 text-gray-400" />
                        {record.performedBy}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">
                      {record.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {history.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No history available for this bin</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bin List
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/admin/inventory?edit=${binDetails.id}`)}
            >
              Edit Bin Details
            </Button>
            <Button variant="outline" onClick={() => toast.info("Export functionality coming soon")}>
              Export History
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.info("Maintenance schedule functionality coming soon")}
            >
              Schedule Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BinTrackingDetails;

