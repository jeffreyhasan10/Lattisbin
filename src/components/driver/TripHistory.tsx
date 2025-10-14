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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Clock,
  Package,
  Search,
  Filter,
  Calendar,
  ArrowLeft,
  History,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Award,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  UserPlus,
  Plus,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface TripHistoryItem {
  id: string;
  doNumber: string;
  customer: string;
  pickupLocation: string;
  dropoffLocation: string;
  completedDate: string;
  completedTime: string;
  binType: string;
  binSize: string;
  wasteType: string;
  paymentStatus: "paid" | "pending" | "partial";
  paymentAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  duration: string;
  distance: string;
}

interface AvailableOrder {
  id: string;
  doNumber: string;
  customer: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  binType: string;
  binSize: string;
  wasteType: string;
  priority: "urgent" | "high" | "normal" | "low";
  estimatedPayment: number;
  distance: string;
  estimatedDuration: string;
  status: "available" | "claimed";
  claimedBy?: string;
  claimedAt?: string;
}

// Mock trip history data
const mockTripHistory: TripHistoryItem[] = [
  {
    id: "TRP-001",
    doNumber: "DO-2024-1234",
    customer: "Tech Plaza Mall",
    pickupLocation: "Warehouse A, Cyberjaya",
    dropoffLocation: "Tech Plaza Mall, Cyberjaya, Selangor",
    completedDate: "2024-10-14",
    completedTime: "11:30 AM",
    binType: "Waste Bin",
    binSize: "Large (240L)",
    wasteType: "Electronic Waste",
    paymentStatus: "paid",
    paymentAmount: 250.00,
    paidAmount: 250.00,
    paymentMethod: "Cash",
    duration: "45 min",
    distance: "12.5 km",
  },
  {
    id: "TRP-002",
    doNumber: "DO-2024-1235",
    customer: "Green Valley Resort",
    pickupLocation: "Warehouse B, Mont Kiara",
    dropoffLocation: "Green Valley Resort, Mont Kiara, KL",
    completedDate: "2024-10-13",
    completedTime: "3:45 PM",
    binType: "Waste Bin",
    binSize: "Medium (120L)",
    wasteType: "General Waste",
    paymentStatus: "paid",
    paymentAmount: 180.00,
    paidAmount: 180.00,
    paymentMethod: "Online Transfer",
    duration: "30 min",
    distance: "8.3 km",
  },
  {
    id: "TRP-003",
    doNumber: "DO-2024-1236",
    customer: "Sunrise Apartments",
    pickupLocation: "Sunrise Apartments, Petaling Jaya",
    dropoffLocation: "Waste Management Center, Shah Alam",
    completedDate: "2024-10-12",
    completedTime: "5:15 PM",
    binType: "Waste Bin",
    binSize: "Large (240L)",
    wasteType: "Household Waste",
    paymentStatus: "pending",
    paymentAmount: 220.00,
    paidAmount: 0,
    duration: "40 min",
    distance: "15.2 km",
  },
  {
    id: "TRP-004",
    doNumber: "DO-2024-1237",
    customer: "Metro Shopping Center",
    pickupLocation: "Warehouse C, Subang Jaya",
    dropoffLocation: "Metro Shopping Center, Subang Jaya",
    completedDate: "2024-10-11",
    completedTime: "7:00 PM",
    binType: "Waste Bin",
    binSize: "XL (360L)",
    wasteType: "Commercial Waste",
    paymentStatus: "partial",
    paymentAmount: 350.00,
    paidAmount: 200.00,
    paymentMethod: "Cash",
    duration: "60 min",
    distance: "18.7 km",
  },
  {
    id: "TRP-005",
    doNumber: "DO-2024-1238",
    customer: "Riverside Condominiums",
    pickupLocation: "Riverside Condominiums, Ampang",
    dropoffLocation: "Waste Processing Facility, Cheras",
    completedDate: "2024-10-10",
    completedTime: "10:00 AM",
    binType: "Waste Bin",
    binSize: "Medium (120L)",
    wasteType: "Recyclable Waste",
    paymentStatus: "paid",
    paymentAmount: 150.00,
    paidAmount: 150.00,
    paymentMethod: "E-Wallet",
    duration: "35 min",
    distance: "11.2 km",
  },
];

// Mock available orders data
const mockAvailableOrders: AvailableOrder[] = [
  {
    id: "AO-001",
    doNumber: "DO-2024-5001",
    customer: "Central Business Plaza",
    customerPhone: "+60 12-888-9999",
    pickupLocation: "Warehouse D, Puchong",
    dropoffLocation: "Central Business Plaza, KLCC",
    scheduledDate: "2024-10-16",
    scheduledTime: "09:00 AM",
    binType: "Waste Bin",
    binSize: "XL (360L)",
    wasteType: "Commercial Waste",
    priority: "urgent",
    estimatedPayment: 380.00,
    distance: "22.5 km",
    estimatedDuration: "55 min",
    status: "available"
  },
  {
    id: "AO-002",
    doNumber: "DO-2024-5002",
    customer: "Orchid Gardens Residence",
    customerPhone: "+60 12-777-8888",
    pickupLocation: "Orchid Gardens, Cheras",
    dropoffLocation: "Waste Processing Center, Semenyih",
    scheduledDate: "2024-10-16",
    scheduledTime: "11:00 AM",
    binType: "Waste Bin",
    binSize: "Large (240L)",
    wasteType: "Household Waste",
    priority: "normal",
    estimatedPayment: 210.00,
    distance: "18.3 km",
    estimatedDuration: "40 min",
    status: "available"
  },
  {
    id: "AO-003",
    doNumber: "DO-2024-5003",
    customer: "TechStart Incubator",
    customerPhone: "+60 12-666-7777",
    pickupLocation: "Warehouse E, Cyberjaya",
    dropoffLocation: "TechStart Incubator, Putrajaya",
    scheduledDate: "2024-10-16",
    scheduledTime: "02:30 PM",
    binType: "Waste Bin",
    binSize: "Medium (120L)",
    wasteType: "Electronic Waste",
    priority: "high",
    estimatedPayment: 195.00,
    distance: "14.2 km",
    estimatedDuration: "35 min",
    status: "available"
  },
];

const TripHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // Form state for creating new order
  const [newOrder, setNewOrder] = useState({
    customer: "",
    customerPhone: "",
    pickupLocation: "",
    dropoffLocation: "",
    scheduledDate: "",
    scheduledTime: "",
    binSize: "Large (240L)",
    wasteType: "General Waste",
    priority: "normal",
    estimatedPayment: "",
    distance: "",
    estimatedDuration: "",
  });

  // Load available orders from localStorage or use mock data
  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>(() => {
    const saved = localStorage.getItem("availableOrders");
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem("availableOrders", JSON.stringify(mockAvailableOrders));
    return mockAvailableOrders;
  });

  // Save to localStorage whenever availableOrders changes
  useEffect(() => {
    localStorage.setItem("availableOrders", JSON.stringify(availableOrders));
  }, [availableOrders]);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "partial":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
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

  const handleClaimOrder = (order: AvailableOrder) => {
    const driverName = localStorage.getItem("driverName") || "Ahmad (Driver)";
    const driverId = localStorage.getItem("driverId") || "DRV-001";
    
    // Update the order status
    const updatedOrders = availableOrders.map(o => 
      o.id === order.id 
        ? { 
            ...o, 
            status: "claimed" as const, 
            claimedBy: driverName,
            claimedAt: new Date().toISOString()
          } 
        : o
    );
    
    setAvailableOrders(updatedOrders);

    // Add to driver's trips
    const driverTrips = JSON.parse(localStorage.getItem("driverTrips") || "[]");
    const newTrip = {
      id: order.id,
      doNumber: order.doNumber,
      customer: order.customer,
      customerPhone: order.customerPhone,
      pickupLocation: order.pickupLocation,
      dropoffLocation: order.dropoffLocation,
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      status: "pending",
      priority: order.priority,
      binType: order.binType,
      binSize: order.binSize,
      wasteType: order.wasteType,
      lorryAssigned: "To be assigned",
      estimatedDuration: order.estimatedDuration,
      distance: order.distance,
      collectionType: "both"
    };
    driverTrips.push(newTrip);
    localStorage.setItem("driverTrips", JSON.stringify(driverTrips));

    // Store claim notification for admin
    const claimedOrders = JSON.parse(localStorage.getItem("claimedOrders") || "[]");
    claimedOrders.push({
      orderId: order.id,
      orderNumber: order.doNumber,
      driverId: driverId,
      driverName: driverName,
      customer: order.customer,
      claimedAt: new Date().toISOString(),
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime
    });
    localStorage.setItem("claimedOrders", JSON.stringify(claimedOrders));

    toast.success(`Order ${order.doNumber} claimed successfully!`, {
      description: `You have been assigned to ${order.customer}. Check "My Trips" for details.`
    });
  };

  const handleCreateOrder = () => {
    if (!newOrder.customer || !newOrder.pickupLocation || !newOrder.dropoffLocation || 
        !newOrder.scheduledDate || !newOrder.scheduledTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const driverName = localStorage.getItem("driverName") || "Ahmad (Driver)";
    const orderId = `AO-${Date.now()}`;
    const doNumber = `DO-2024-${Math.floor(Math.random() * 9000) + 1000}`;

    const order: AvailableOrder = {
      id: orderId,
      doNumber: doNumber,
      customer: newOrder.customer,
      customerPhone: newOrder.customerPhone,
      pickupLocation: newOrder.pickupLocation,
      dropoffLocation: newOrder.dropoffLocation,
      scheduledDate: newOrder.scheduledDate,
      scheduledTime: newOrder.scheduledTime,
      binType: "Waste Bin",
      binSize: newOrder.binSize,
      wasteType: newOrder.wasteType,
      priority: newOrder.priority as "urgent" | "high" | "normal" | "low",
      estimatedPayment: parseFloat(newOrder.estimatedPayment) || 0,
      distance: newOrder.distance,
      estimatedDuration: newOrder.estimatedDuration,
      status: "claimed",
      claimedBy: driverName,
      claimedAt: new Date().toISOString()
    };

    // Add to available orders
    setAvailableOrders([...availableOrders, order]);

    // Immediately claim it for the driver
    handleClaimOrder(order);

    // Reset form and close dialog
    setNewOrder({
      customer: "",
      customerPhone: "",
      pickupLocation: "",
      dropoffLocation: "",
      scheduledDate: "",
      scheduledTime: "",
      binSize: "Large (240L)",
      wasteType: "General Waste",
      priority: "normal",
      estimatedPayment: "",
      distance: "",
      estimatedDuration: "",
    });
    setIsCreateOrderOpen(false);

    toast.success("Order created and claimed successfully!", {
      description: `${doNumber} has been added to your trips`
    });
  };

  const filteredTrips = mockTripHistory.filter((trip) => {
    const matchesSearch =
      trip.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment =
      filterPayment === "all" || trip.paymentStatus === filterPayment;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "paid" && trip.paymentStatus === "paid") ||
      (activeTab === "pending" &&
        (trip.paymentStatus === "pending" || trip.paymentStatus === "partial"));
    const matchesDate = !selectedDate || trip.completedDate === format(selectedDate, "yyyy-MM-dd");

    return matchesSearch && matchesPayment && matchesTab && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPayment, activeTab, selectedDate]);

  // Calculate statistics
  const totalTrips = mockTripHistory.length;
  const totalEarnings = mockTripHistory.reduce(
    (sum, trip) => sum + trip.paidAmount,
    0
  );
  const pendingAmount = mockTripHistory.reduce(
    (sum, trip) => sum + (trip.paymentAmount - trip.paidAmount),
    0
  );

  const handleBackToDashboard = () => {
    navigate("/driver/dashboard");
  };

  const handleExportReport = () => {
    // Here you would implement CSV/PDF export
    alert("Exporting trip history report...");
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <History className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              Trip History
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View your completed trips and payment records
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="flex-1 sm:flex-initial"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="flex-1 sm:flex-initial"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Performance Stats Cards - Colorful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{totalTrips}</p>
                <p className="text-xs font-medium text-indigo-100">Total Trips</p>
                <p className="text-xs text-indigo-100 mt-1">All completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">
                  {totalEarnings.toFixed(0)}
                </p>
                <p className="text-xs font-medium text-emerald-100">Total Collected</p>
                <p className="text-xs text-emerald-100 mt-1">Payments received</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">
                  {pendingAmount.toFixed(0)}
                </p>
                <p className="text-xs font-medium text-orange-100">Pending Balance</p>
                <p className="text-xs text-orange-100 mt-1">To be collected</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
            <CardContent className="p-4">
              <div className="text-center text-white">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">
                  {availableOrders.filter(o => o.status === "available").length}
                </p>
                <p className="text-xs font-medium text-blue-100">Available Orders</p>
                <p className="text-xs text-blue-100 mt-1">Ready to claim</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="current">This Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="last3">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setFilterPayment("all");
                  setFilterMonth("all");
                  setSelectedDate(undefined);
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip History List */}
      <Card className="bg-white shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">Completed Trips</span>
          </CardTitle>
        </div>
        <CardContent className="pt-4 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="available">
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Available Orders
              </TabsTrigger>
              <TabsTrigger value="all">All Trips</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            {/* Available Orders Tab */}
            <TabsContent value="available" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Available Orders</h3>
                <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Order</DialogTitle>
                      <DialogDescription>
                        Create a new order and assign it to yourself
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer">Customer Name *</Label>
                          <Input
                            id="customer"
                            value={newOrder.customer}
                            onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Customer Phone</Label>
                          <Input
                            id="phone"
                            value={newOrder.customerPhone}
                            onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                            placeholder="+60 12-345-6789"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="pickup">Pickup Location *</Label>
                        <Input
                          id="pickup"
                          value={newOrder.pickupLocation}
                          onChange={(e) => setNewOrder({...newOrder, pickupLocation: e.target.value})}
                          placeholder="Enter pickup address"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dropoff">Drop-off Location *</Label>
                        <Input
                          id="dropoff"
                          value={newOrder.dropoffLocation}
                          onChange={(e) => setNewOrder({...newOrder, dropoffLocation: e.target.value})}
                          placeholder="Enter drop-off address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Scheduled Date *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newOrder.scheduledDate}
                            onChange={(e) => setNewOrder({...newOrder, scheduledDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Scheduled Time *</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newOrder.scheduledTime}
                            onChange={(e) => setNewOrder({...newOrder, scheduledTime: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="binSize">Bin Size</Label>
                          <Select value={newOrder.binSize} onValueChange={(value) => setNewOrder({...newOrder, binSize: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Small (60L)">Small (60L)</SelectItem>
                              <SelectItem value="Medium (120L)">Medium (120L)</SelectItem>
                              <SelectItem value="Large (240L)">Large (240L)</SelectItem>
                              <SelectItem value="XL (360L)">XL (360L)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="wasteType">Waste Type</Label>
                          <Select value={newOrder.wasteType} onValueChange={(value) => setNewOrder({...newOrder, wasteType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General Waste">General Waste</SelectItem>
                              <SelectItem value="Recyclable Waste">Recyclable Waste</SelectItem>
                              <SelectItem value="Electronic Waste">Electronic Waste</SelectItem>
                              <SelectItem value="Commercial Waste">Commercial Waste</SelectItem>
                              <SelectItem value="Household Waste">Household Waste</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="urgent">Urgent</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="payment">Est. Payment (RM)</Label>
                          <Input
                            id="payment"
                            type="number"
                            value={newOrder.estimatedPayment}
                            onChange={(e) => setNewOrder({...newOrder, estimatedPayment: e.target.value})}
                            placeholder="250.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="distance">Distance</Label>
                          <Input
                            id="distance"
                            value={newOrder.distance}
                            onChange={(e) => setNewOrder({...newOrder, distance: e.target.value})}
                            placeholder="12.5 km"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="duration">Estimated Duration</Label>
                        <Input
                          id="duration"
                          value={newOrder.estimatedDuration}
                          onChange={(e) => setNewOrder({...newOrder, estimatedDuration: e.target.value})}
                          placeholder="45 min"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateOrder} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600">
                        Create & Claim Order
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {availableOrders.filter(o => o.status === "available").length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No available orders at the moment</p>
                  <p className="text-sm text-gray-400 mt-2">Check back later for new orders</p>
                </div>
              ) : (
                availableOrders
                  .filter(order => order.status === "available")
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-5 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white rounded-2xl border-2 border-indigo-200 hover:shadow-xl active:scale-[0.98] transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3 flex-wrap">
                            <h3 className="font-bold text-lg text-gray-900">
                              {order.customer}
                            </h3>
                            <Badge className={`${getPriorityColor(order.priority)} border font-semibold`}>
                              {order.priority === "urgent" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {order.priority.toUpperCase()}
                            </Badge>
                            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 border font-semibold">
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">DO:</span>
                              {order.doNumber}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {order.scheduledDate} at {order.scheduledTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-emerald-600" />
                              <span className="font-semibold text-emerald-700">
                                RM {order.estimatedPayment.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {order.estimatedDuration} • {order.distance}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900">Pickup:</p>
                                <p className="text-gray-600">{order.pickupLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900">Drop-off:</p>
                                <p className="text-gray-600">{order.dropoffLocation}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {order.binSize} - {order.wasteType}
                            </span>
                          </div>
                        </div>

                        <div className="lg:w-56">
                          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 space-y-3">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Estimated Payment</p>
                              <p className="text-2xl font-bold text-indigo-700">
                                RM {order.estimatedPayment.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleClaimOrder(order)}
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                            >
                              <UserPlus className="h-5 w-5 mr-2" />
                              Claim This Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>

            {/* All Trips Tab */}
            <TabsContent value="all" className="space-y-4">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No trips found</p>
                </div>
              ) : (
                <>
                {paginatedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/30 rounded-2xl border border-cyan-100 hover:shadow-xl active:scale-[0.98] transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {trip.customer}
                          </h3>
                          <Badge
                            className={`${getPaymentStatusColor(
                              trip.paymentStatus
                            )} border`}
                          >
                            {trip.paymentStatus === "paid"
                              ? "Paid"
                              : trip.paymentStatus === "pending"
                              ? "Payment Pending"
                              : "Partial Payment"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">DO:</span>
                            {trip.doNumber}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {trip.completedDate} at {trip.completedTime}
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
                            <Clock className="h-3 w-3" />
                            {trip.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            {trip.distance}
                          </span>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="lg:w-64 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <span className="font-semibold text-gray-900">
                              RM {trip.paymentAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Paid:</span>
                            <span className="font-semibold text-emerald-600">
                              RM {trip.paidAmount.toFixed(2)}
                            </span>
                          </div>
                          {trip.paymentAmount > trip.paidAmount && (
                            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                              <span className="text-sm font-medium text-orange-700">
                                Balance:
                              </span>
                              <span className="font-bold text-orange-600">
                                RM {(trip.paymentAmount - trip.paidAmount).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {trip.paymentMethod && (
                            <div className="pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600">
                                Method: <span className="font-medium">{trip.paymentMethod}</span>
                              </p>
                            </div>
                          )}
                          {trip.paymentStatus === "paid" && (
                            <div className="flex items-center justify-center gap-2 pt-2 text-emerald-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs font-semibold">Fully Paid</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                }
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredTrips.length)} of {filteredTrips.length} trips
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-9 w-9"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                </>
              )}
            </TabsContent>

            {/* Paid Trips Tab */}
            <TabsContent value="paid" className="space-y-4">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No paid trips found</p>
                </div>
              ) : (
                <>
                {paginatedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/30 rounded-2xl border border-cyan-100 hover:shadow-xl active:scale-[0.98] transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {trip.customer}
                          </h3>
                          <Badge
                            className={`${getPaymentStatusColor(
                              trip.paymentStatus
                            )} border`}
                          >
                            {trip.paymentStatus === "paid"
                              ? "Paid"
                              : trip.paymentStatus === "pending"
                              ? "Payment Pending"
                              : "Partial Payment"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">DO:</span>
                            {trip.doNumber}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {trip.completedDate} at {trip.completedTime}
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
                            <Clock className="h-3 w-3" />
                            {trip.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            {trip.distance}
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-64 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <span className="font-semibold text-gray-900">
                              RM {trip.paymentAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Paid:</span>
                            <span className="font-semibold text-emerald-600">
                              RM {trip.paidAmount.toFixed(2)}
                            </span>
                          </div>
                          {trip.paymentAmount > trip.paidAmount && (
                            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                              <span className="text-sm font-medium text-orange-700">
                                Balance:
                              </span>
                              <span className="font-bold text-orange-600">
                                RM {(trip.paymentAmount - trip.paidAmount).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {trip.paymentMethod && (
                            <div className="pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600">
                                Method: <span className="font-medium">{trip.paymentMethod}</span>
                              </p>
                            </div>
                          )}
                          {trip.paymentStatus === "paid" && (
                            <div className="flex items-center justify-center gap-2 pt-2 text-emerald-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs font-semibold">Fully Paid</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                }
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredTrips.length)} of {filteredTrips.length} trips
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-9 w-9"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                </>
              )}
            </TabsContent>

            {/* Pending Trips Tab */}
            <TabsContent value="pending" className="space-y-4">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No pending trips found</p>
                </div>
              ) : (
                <>
                {paginatedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/30 rounded-2xl border border-cyan-100 hover:shadow-xl active:scale-[0.98] transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {trip.customer}
                          </h3>
                          <Badge
                            className={`${getPaymentStatusColor(
                              trip.paymentStatus
                            )} border`}
                          >
                            {trip.paymentStatus === "paid"
                              ? "Paid"
                              : trip.paymentStatus === "pending"
                              ? "Payment Pending"
                              : "Partial Payment"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">DO:</span>
                            {trip.doNumber}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {trip.completedDate} at {trip.completedTime}
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
                            <Clock className="h-3 w-3" />
                            {trip.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            {trip.distance}
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-64 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <span className="font-semibold text-gray-900">
                              RM {trip.paymentAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Paid:</span>
                            <span className="font-semibold text-emerald-600">
                              RM {trip.paidAmount.toFixed(2)}
                            </span>
                          </div>
                          {trip.paymentAmount > trip.paidAmount && (
                            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                              <span className="text-sm font-medium text-orange-700">
                                Balance:
                              </span>
                              <span className="font-bold text-orange-600">
                                RM {(trip.paymentAmount - trip.paidAmount).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {trip.paymentMethod && (
                            <div className="pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600">
                                Method: <span className="font-medium">{trip.paymentMethod}</span>
                              </p>
                            </div>
                          )}
                          {trip.paymentStatus === "paid" && (
                            <div className="flex items-center justify-center gap-2 pt-2 text-emerald-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs font-semibold">Fully Paid</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                }
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredTrips.length)} of {filteredTrips.length} trips
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-9 w-9"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripHistory;

