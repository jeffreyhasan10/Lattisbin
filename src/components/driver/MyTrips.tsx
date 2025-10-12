import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Clock,
  Package,
  Search,
  Filter,
  Eye,
  Navigation,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Map,
} from "lucide-react";

interface Trip {
  id: string;
  doNumber: string;
  customer: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "urgent" | "high" | "normal" | "low";
  binType: string;
  binSize: string;
  wasteType: string;
  lorryAssigned: string;
  estimatedDuration: string;
  distance: string;
  collectionType: "pickup" | "delivery" | "both";
}

// Mock trips data
const mockTrips: Trip[] = [
  {
    id: "TRP-001",
    doNumber: "DO-2024-1234",
    customer: "Tech Plaza Mall",
    customerPhone: "+60 12-345-6789",
    pickupLocation: "Warehouse A, Cyberjaya",
    dropoffLocation: "Tech Plaza Mall, Cyberjaya, Selangor",
    scheduledDate: "2024-10-15",
    scheduledTime: "10:00 AM",
    status: "pending",
    priority: "urgent",
    binType: "Waste Bin",
    binSize: "Large (240L)",
    wasteType: "Electronic Waste",
    lorryAssigned: "Lorry-001 (ABC 1234)",
    estimatedDuration: "45 min",
    distance: "12.5 km",
    collectionType: "both",
  },
  {
    id: "TRP-002",
    doNumber: "DO-2024-1235",
    customer: "Green Valley Resort",
    customerPhone: "+60 12-456-7890",
    pickupLocation: "Warehouse B, Mont Kiara",
    dropoffLocation: "Green Valley Resort, Mont Kiara, KL",
    scheduledDate: "2024-10-15",
    scheduledTime: "2:15 PM",
    status: "in-progress",
    priority: "high",
    binType: "Waste Bin",
    binSize: "Medium (120L)",
    wasteType: "General Waste",
    lorryAssigned: "Lorry-001 (ABC 1234)",
    estimatedDuration: "30 min",
    distance: "8.3 km",
    collectionType: "delivery",
  },
  {
    id: "TRP-003",
    doNumber: "DO-2024-1236",
    customer: "Sunrise Apartments",
    customerPhone: "+60 12-567-8901",
    pickupLocation: "Sunrise Apartments, Petaling Jaya",
    dropoffLocation: "Waste Management Center, Shah Alam",
    scheduledDate: "2024-10-15",
    scheduledTime: "4:30 PM",
    status: "pending",
    priority: "normal",
    binType: "Waste Bin",
    binSize: "Large (240L)",
    wasteType: "Household Waste",
    lorryAssigned: "Lorry-001 (ABC 1234)",
    estimatedDuration: "40 min",
    distance: "15.2 km",
    collectionType: "pickup",
  },
];

const MyTrips = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  // Load trips from localStorage or use mock data
  const [trips, setTrips] = useState<Trip[]>(() => {
    const savedTrips = localStorage.getItem("driverTrips");
    if (savedTrips) {
      return JSON.parse(savedTrips);
    }
    // Initialize with mock data
    localStorage.setItem("driverTrips", JSON.stringify(mockTrips));
    return mockTrips;
  });

  // Save trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("driverTrips", JSON.stringify(trips));
  }, [trips]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Truck className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || trip.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || trip.priority === filterPriority;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "today" && trip.status !== "completed") ||
      (activeTab === "completed" && trip.status === "completed");

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const handleViewDetails = (tripId: string) => {
    navigate(`/driver/trips/${tripId}`);
  };

  const handleBackToDashboard = () => {
    navigate("/driver/dashboard");
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Map className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              My Trips
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all your assigned trips
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards - Colorful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{trips.length}</p>
                <p className="text-xs font-medium text-indigo-100">Total Trips</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">
                  {trips.filter((t) => t.status === "in-progress").length}
                </p>
                <p className="text-xs font-medium text-blue-100">In Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">
                  {trips.filter((t) => t.status === "pending").length}
                </p>
                <p className="text-xs font-medium text-orange-100">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">
                  {trips.filter((t) => t.status === "completed").length}
                </p>
                <p className="text-xs font-medium text-emerald-100">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterPriority("all");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trips List */}
      <Card className="bg-white shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">Assigned Trips</span>
          </CardTitle>
        </div>
        <CardContent className="pt-4 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Trips</TabsTrigger>
              <TabsTrigger value="today">Today's Trips</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No trips found</p>
                </div>
              ) : (
                filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-2xl border border-blue-100 hover:shadow-xl active:scale-[0.98] transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-2 flex-wrap">
                          <h3 className="font-bold text-lg text-gray-900">
                            {trip.customer}
                          </h3>
                          <Badge className={`${getStatusColor(trip.status)} border-0 flex items-center gap-1`}>
                            {getStatusIcon(trip.status)}
                            {trip.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(trip.priority)} border-0`}>
                            {trip.priority}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">DO:</span>
                            {trip.doNumber}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {trip.scheduledDate} at {trip.scheduledTime}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">Pickup:</p>
                              <p className="text-gray-600">{trip.pickupLocation}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">Drop-off:</p>
                              <p className="text-gray-600">{trip.dropoffLocation}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {trip.binSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {trip.lorryAssigned}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {trip.estimatedDuration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {trip.distance}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleViewDetails(trip.id)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full lg:w-auto h-11 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Trip Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTrips;

