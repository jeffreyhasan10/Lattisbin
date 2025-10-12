import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  User,
  TrendingUp,
  Download,
  Search,
  BarChart3,
  ArrowLeft,
  Calendar,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface LorryTrip {
  tripId: string;
  lorryNumber: string;
  driverName: string;
  tripDate: string;
  binsTransported: number;
  distanceCovered: number;
  fuelUsed: number;
  tripStatus: "Completed" | "In Progress" | "Cancelled";
  startTime: string;
  endTime?: string;
}

const LorryReports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [driverFilter, setDriverFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample lorry trip data
  const [trips] = useState<LorryTrip[]>([
    {
      tripId: "TRIP001",
      lorryNumber: "LORRY-1001",
      driverName: "Mike Johnson",
      tripDate: "2024-03-20",
      binsTransported: 12,
      distanceCovered: 45.5,
      fuelUsed: 8.2,
      tripStatus: "Completed",
      startTime: "08:00",
      endTime: "14:30",
    },
    {
      tripId: "TRIP002",
      lorryNumber: "LORRY-1002",
      driverName: "Sarah Wilson",
      tripDate: "2024-03-20",
      binsTransported: 8,
      distanceCovered: 32.0,
      fuelUsed: 6.5,
      tripStatus: "Completed",
      startTime: "09:00",
      endTime: "13:00",
    },
    {
      tripId: "TRIP003",
      lorryNumber: "LORRY-1001",
      driverName: "Mike Johnson",
      tripDate: "2024-03-21",
      binsTransported: 10,
      distanceCovered: 38.2,
      fuelUsed: 7.1,
      tripStatus: "Completed",
      startTime: "07:30",
      endTime: "13:15",
    },
    {
      tripId: "TRIP004",
      lorryNumber: "LORRY-2001",
      driverName: "John Tan",
      tripDate: "2024-03-21",
      binsTransported: 15,
      distanceCovered: 52.8,
      fuelUsed: 9.8,
      tripStatus: "Completed",
      startTime: "08:00",
      endTime: "15:30",
    },
    {
      tripId: "TRIP005",
      lorryNumber: "LORRY-1002",
      driverName: "Sarah Wilson",
      tripDate: "2024-03-22",
      binsTransported: 6,
      distanceCovered: 28.5,
      fuelUsed: 5.2,
      tripStatus: "In Progress",
      startTime: "08:30",
    },
    {
      tripId: "TRIP006",
      lorryNumber: "LORRY-2002",
      driverName: "Ahmad Hassan",
      tripDate: "2024-03-22",
      binsTransported: 9,
      distanceCovered: 41.0,
      fuelUsed: 7.5,
      tripStatus: "Completed",
      startTime: "07:00",
      endTime: "12:45",
    },
    {
      tripId: "TRIP007",
      lorryNumber: "LORRY-1001",
      driverName: "Mike Johnson",
      tripDate: "2024-03-22",
      binsTransported: 11,
      distanceCovered: 43.2,
      fuelUsed: 8.0,
      tripStatus: "Completed",
      startTime: "09:00",
      endTime: "14:00",
    },
    {
      tripId: "TRIP008",
      lorryNumber: "LORRY-3001",
      driverName: "David Lee",
      tripDate: "2024-03-23",
      binsTransported: 0,
      distanceCovered: 0,
      fuelUsed: 0,
      tripStatus: "Cancelled",
      startTime: "08:00",
    },
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const completedTrips = trips.filter((t) => t.tripStatus === "Completed");
    const totalTrips = trips.length;
    const inProgressTrips = trips.filter((t) => t.tripStatus === "In Progress").length;
    const totalBinsTransported = completedTrips.reduce(
      (sum, t) => sum + t.binsTransported,
      0
    );
    const totalDistance = completedTrips.reduce((sum, t) => sum + t.distanceCovered, 0);
    const totalFuel = completedTrips.reduce((sum, t) => sum + t.fuelUsed, 0);
    const avgBinsPerTrip = totalBinsTransported / completedTrips.length;
    const fuelEfficiency = totalDistance / totalFuel; // km per liter

    // Driver-wise statistics
    const driverStats = trips.reduce((acc, trip) => {
      if (trip.tripStatus === "Completed") {
        if (!acc[trip.driverName]) {
          acc[trip.driverName] = {
            trips: 0,
            bins: 0,
            distance: 0,
            fuel: 0,
          };
        }
        acc[trip.driverName].trips += 1;
        acc[trip.driverName].bins += trip.binsTransported;
        acc[trip.driverName].distance += trip.distanceCovered;
        acc[trip.driverName].fuel += trip.fuelUsed;
      }
      return acc;
    }, {} as Record<string, { trips: number; bins: number; distance: number; fuel: number }>);

    return {
      totalTrips,
      completedTrips: completedTrips.length,
      inProgressTrips,
      totalBinsTransported,
      totalDistance,
      totalFuel,
      avgBinsPerTrip,
      fuelEfficiency,
      driverStats,
    };
  }, [trips]);

  // Filtering logic
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.lorryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDriver =
        driverFilter === "all" || trip.driverName === driverFilter;

      const matchesStatus =
        statusFilter === "all" || trip.tripStatus === statusFilter;

      return matchesSearch && matchesDriver && matchesStatus;
    });
  }, [trips, searchTerm, driverFilter, statusFilter]);

  const handleExport = () => {
    const csvContent = [
      [
        "Trip ID",
        "Lorry Number",
        "Driver",
        "Date",
        "Bins Transported",
        "Distance (km)",
        "Fuel Used (L)",
        "Status",
        "Start Time",
        "End Time",
      ],
      ...filteredTrips.map((t) => [
        t.tripId,
        t.lorryNumber,
        t.driverName,
        t.tripDate,
        t.binsTransported.toString(),
        t.distanceCovered.toFixed(1),
        t.fuelUsed.toFixed(1),
        t.tripStatus,
        t.startTime,
        t.endTime || "—",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `lorry-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lorry report exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-8 h-8 text-purple-600" />
              Lorry Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Fleet performance, trip history, and driver efficiency analysis
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/reports")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports Summary
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalTrips}</p>
                  <p className="text-xs text-blue-100 mt-1">
                    {stats.completedTrips} completed
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Bins Transported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalBinsTransported}</p>
                  <p className="text-xs text-green-100 mt-1">
                    {stats.avgBinsPerTrip.toFixed(1)} avg per trip
                  </p>
                </div>
                <Package className="w-12 h-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Distance Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalDistance.toFixed(0)}</p>
                  <p className="text-xs text-purple-100 mt-1">Kilometers</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Fuel Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {stats.fuelEfficiency.toFixed(1)}
                  </p>
                  <p className="text-xs text-orange-100 mt-1">km/L</p>
                </div>
                <BarChart3 className="w-12 h-12 text-orange-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Performance */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Driver-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.driverStats).map(([driver, data]) => (
                <div
                  key={driver}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900">{driver}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trips:</span>
                      <span className="font-bold text-gray-900">{data.trips}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bins:</span>
                      <span className="font-bold text-gray-900">{data.bins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-bold text-gray-900">
                        {data.distance.toFixed(1)} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficiency:</span>
                      <span className="font-bold text-gray-900">
                        {(data.distance / data.fuel).toFixed(1)} km/L
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search trip, lorry, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={driverFilter} onValueChange={setDriverFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {Object.keys(stats.driverStats).map((driver) => (
                    <SelectItem key={driver} value={driver}>
                      {driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleExport}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trip History Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Trip History</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredTrips.length} of {trips.length} trips
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Trip ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Lorry
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Driver
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Bins
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Distance
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Fuel
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr
                      key={trip.tripId}
                      className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{trip.tripId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {trip.lorryNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{trip.driverName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{trip.tripDate}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900">
                          {trip.binsTransported}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {trip.distanceCovered.toFixed(1)} km
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {trip.fuelUsed.toFixed(1)} L
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(trip.tripStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LorryReports;

