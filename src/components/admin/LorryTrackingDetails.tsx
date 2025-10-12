import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Truck, MapPin, Calendar, Package, User, TrendingUp, Clock, Navigation, AlertCircle, CheckCircle, Activity } from "lucide-react";
import { toast } from "sonner";

interface LorryDetails {
  id: string;
  model: string;
  tonnage: number;
  licensePlate: string;
  roadTaxExpiry: string;
  insuranceExpiry: string;
  status: string;
  assignedDriver?: string;
  driverId?: string;
  lastService?: string;
  totalTrips: number;
  totalDistance: number;
}

interface TripHistory {
  id: string;
  date: string;
  time: string;
  route: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: string;
  status: "Completed" | "In Progress" | "Cancelled";
}

interface BinTransport {
  id: string;
  date: string;
  time: string;
  binSerialNumber: string;
  binType: string;
  customer: string;
  pickupLocation: string;
  dropoffLocation: string;
  driver: string;
  status: "Delivered" | "Collected" | "In Transit";
}

interface DriverAnalysis {
  driverId: string;
  driverName: string;
  totalTrips: number;
  totalDistance: number;
  avgDistancePerTrip: number;
  performanceScore: number;
  lastTrip: string;
}

const LorryTrackingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { lorryId } = useParams<{ lorryId: string }>();

  // Mock data - in real app, fetch from API
  const [lorryDetails] = useState<LorryDetails>({
    id: lorryId || "LRY-001",
    model: "Hino 500 Series",
    tonnage: 10,
    licensePlate: "WMK 1234",
    roadTaxExpiry: "2025-11-15",
    insuranceExpiry: "2025-12-20",
    status: "Assigned",
    assignedDriver: "Ahmad bin Hassan",
    driverId: "DRV-001",
    lastService: "2025-09-10",
    totalTrips: 245,
    totalDistance: 12450
  });

  const [tripHistory] = useState<TripHistory[]>([
    {
      id: "TRIP-001",
      date: "2025-10-11",
      time: "08:00",
      route: "Downtown to Industrial Zone",
      origin: "Main Depot, KL",
      destination: "ABC Factory, Selangor",
      distance: 45.5,
      duration: "1h 20m",
      driver: "Ahmad bin Hassan",
      status: "Completed"
    },
    {
      id: "TRIP-002",
      date: "2025-10-11",
      time: "11:30",
      route: "Industrial Zone to Residential",
      origin: "ABC Factory, Selangor",
      destination: "Taman Desa Complex",
      distance: 38.2,
      duration: "1h 5m",
      driver: "Ahmad bin Hassan",
      status: "Completed"
    },
    {
      id: "TRIP-003",
      date: "2025-10-10",
      time: "09:15",
      route: "Depot to Commercial District",
      origin: "Main Depot, KL",
      destination: "Mid Valley Shopping Center",
      distance: 22.8,
      duration: "45m",
      driver: "Ahmad bin Hassan",
      status: "Completed"
    },
    {
      id: "TRIP-004",
      date: "2025-10-10",
      time: "14:00",
      route: "Commercial to Residential",
      origin: "Mid Valley Shopping Center",
      destination: "KLCC Residential Area",
      distance: 15.3,
      duration: "30m",
      driver: "Ahmad bin Hassan",
      status: "Completed"
    },
    {
      id: "TRIP-005",
      date: "2025-10-09",
      time: "07:45",
      route: "Depot to Industrial Park",
      origin: "Main Depot, KL",
      destination: "Shah Alam Industrial Park",
      distance: 52.0,
      duration: "1h 35m",
      driver: "Ahmad bin Hassan",
      status: "Completed"
    }
  ]);

  const [binTransports] = useState<BinTransport[]>([
    {
      id: "BT-001",
      date: "2025-10-11",
      time: "08:15",
      binSerialNumber: "ASR-100",
      binType: "10 Yard Dumpster",
      customer: "ABC Construction Sdn Bhd",
      pickupLocation: "Main Depot, KL",
      dropoffLocation: "Construction Site, Bukit Bintang",
      driver: "Ahmad bin Hassan",
      status: "Delivered"
    },
    {
      id: "BT-002",
      date: "2025-10-11",
      time: "11:45",
      binSerialNumber: "LASR-150",
      binType: "20 Yard RORO",
      customer: "XYZ Manufacturing",
      pickupLocation: "XYZ Factory",
      dropoffLocation: "Waste Disposal Site",
      driver: "Ahmad bin Hassan",
      status: "Collected"
    },
    {
      id: "BT-003",
      date: "2025-10-10",
      time: "09:30",
      binSerialNumber: "PWD-200",
      binType: "6 Yard Regular",
      customer: "Residential Complex A",
      pickupLocation: "Main Depot",
      dropoffLocation: "Taman Desa Complex",
      driver: "Ahmad bin Hassan",
      status: "Delivered"
    },
    {
      id: "BT-004",
      date: "2025-10-10",
      time: "14:15",
      binSerialNumber: "ASR-101",
      binType: "10 Yard Dumpster",
      customer: "DEF Retail Store",
      pickupLocation: "DEF Store, Mid Valley",
      dropoffLocation: "Disposal Center",
      driver: "Ahmad bin Hassan",
      status: "Collected"
    },
    {
      id: "BT-005",
      date: "2025-10-09",
      time: "08:00",
      binSerialNumber: "ASR-100",
      binType: "10 Yard Dumpster",
      customer: "GHI Hotel",
      pickupLocation: "Main Depot",
      dropoffLocation: "GHI Hotel, KLCC",
      driver: "Ahmad bin Hassan",
      status: "Delivered"
    }
  ]);

  const [driverAnalysis] = useState<DriverAnalysis[]>([
    {
      driverId: "DRV-001",
      driverName: "Ahmad bin Hassan",
      totalTrips: 245,
      totalDistance: 12450,
      avgDistancePerTrip: 50.8,
      performanceScore: 94.5,
      lastTrip: "2025-10-11"
    },
    {
      driverId: "DRV-005",
      driverName: "Siti Nurhaliza (Previous)",
      totalTrips: 87,
      totalDistance: 4120,
      avgDistancePerTrip: 47.4,
      performanceScore: 91.2,
      lastTrip: "2025-08-15"
    }
  ]);

  const handleBackToList = () => {
    navigate("/admin/fleet");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Completed": "bg-green-100 text-green-700 border-green-300",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
      "Cancelled": "bg-red-100 text-red-700 border-red-300",
      "Delivered": "bg-blue-100 text-blue-700 border-blue-300",
      "Collected": "bg-green-100 text-green-700 border-green-300",
      "In Transit": "bg-yellow-100 text-yellow-700 border-yellow-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const completedTrips = tripHistory.filter(t => t.status === "Completed").length;
  const avgTripDistance = tripHistory.length > 0 
    ? tripHistory.reduce((sum, t) => sum + t.distance, 0) / tripHistory.length 
    : 0;

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
            Back to Lorry List
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Lorry Tracking - {lorryDetails.licensePlate}
          </h1>
          <p className="text-gray-600 mt-1">{lorryDetails.model} ({lorryDetails.id})</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-lg px-4 py-2">
          {lorryDetails.status}
        </Badge>
      </div>

      {/* Lorry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicle Specifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Vehicle Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Model</p>
                <p className="font-semibold text-lg">{lorryDetails.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">License Plate</p>
                <p className="font-bold text-xl font-mono">{lorryDetails.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tonnage</p>
                <p className="font-semibold text-lg">{lorryDetails.tonnage} tons</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Lorry ID</p>
                <p className="font-semibold text-lg">{lorryDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Road Tax Expiry</p>
                <p className="font-semibold">{lorryDetails.roadTaxExpiry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Insurance Expiry</p>
                <p className="font-semibold">{lorryDetails.insuranceExpiry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Service</p>
                <p className="font-semibold">{lorryDetails.lastService || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <Badge className={getStatusBadge(lorryDetails.status)}>
                  {lorryDetails.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Current Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lorryDetails.assignedDriver ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned Driver</p>
                  <p className="font-semibold text-lg">{lorryDetails.assignedDriver}</p>
                  <p className="text-sm text-gray-500">{lorryDetails.driverId}</p>
                </div>
                <Separator />
                <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-700 font-semibold">Active Assignment</p>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-600">No driver assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">{lorryDetails.totalTrips}</span>
              <Navigation className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">{lorryDetails.totalDistance} km</span>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Trip Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-indigo-600">{avgTripDistance.toFixed(1)} km</span>
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-purple-600">{completedTrips}</span>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="trips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trips">
                <Navigation className="w-4 h-4 mr-2" />
                Trip History
              </TabsTrigger>
              <TabsTrigger value="bins">
                <Package className="w-4 h-4 mr-2" />
                Bin Transport Records
              </TabsTrigger>
              <TabsTrigger value="drivers">
                <User className="w-4 h-4 mr-2" />
                Driver Analysis
              </TabsTrigger>
            </TabsList>

            {/* Trip History Tab */}
            <TabsContent value="trips" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Trip History</h3>
                <p className="text-sm text-gray-600">Complete record of all trips with dates, routes, and destinations</p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tripHistory.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{trip.date}</p>
                              <p className="text-xs text-gray-500">{trip.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{trip.route}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            {trip.origin}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-green-500" />
                            {trip.destination}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{trip.distance} km</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {trip.duration}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{trip.driver}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(trip.status)}>
                            {trip.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Bin Transport Records Tab */}
            <TabsContent value="bins" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Bin Transport Records</h3>
                <p className="text-sm text-gray-600">Linked bin serial numbers and collection details</p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Bin SN</TableHead>
                      <TableHead>Bin Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Pickup Location</TableHead>
                      <TableHead>Dropoff Location</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {binTransports.map((transport) => (
                      <TableRow key={transport.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{transport.date}</p>
                              <p className="text-xs text-gray-500">{transport.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {transport.binSerialNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{transport.binType}</TableCell>
                        <TableCell className="text-sm font-medium">{transport.customer}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            {transport.pickupLocation}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-green-500" />
                            {transport.dropoffLocation}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{transport.driver}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(transport.status)}>
                            {transport.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Driver Analysis Tab */}
            <TabsContent value="drivers" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Driver-wise Trip Analysis</h3>
                <p className="text-sm text-gray-600">Total trips, performance insights, and distance covered by each driver</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {driverAnalysis.map((driver) => (
                  <Card key={driver.driverId} className="border-2 border-indigo-100">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-600" />
                          <span>{driver.driverName}</span>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {driver.driverId}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Total Trips</p>
                          <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            {driver.totalTrips}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Total Distance</p>
                          <p className="text-2xl font-bold text-green-600">
                            {driver.totalDistance} km
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Avg Distance/Trip</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {driver.avgDistancePerTrip} km
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Performance Score</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {driver.performanceScore}%
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Last Trip</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {driver.lastTrip}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Summary */}
              <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Fleet Utilization Insights</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Drivers Used</p>
                      <p className="text-2xl font-bold text-indigo-600">{driverAnalysis.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Combined Distance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {driverAnalysis.reduce((sum, d) => sum + d.totalDistance, 0)} km
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {(driverAnalysis.reduce((sum, d) => sum + d.performanceScore, 0) / driverAnalysis.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lorry List
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/admin/fleet`)}
            >
              Edit Lorry Details
            </Button>
            <Button variant="outline" onClick={() => toast.info("Export functionality coming soon")}>
              Export Trip Report
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.info("Maintenance scheduling coming soon")}
            >
              Schedule Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LorryTrackingDetails;

