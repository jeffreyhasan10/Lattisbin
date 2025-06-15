import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
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
  DollarSign,
  Package,
  Search,
  Filter,
  Eye,
  Navigation,
  Phone,
  Calendar,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Trash2,
  Map,
  Route,
  Timer,
  Info,
  Play,
  Square,
} from "lucide-react";
import { toast } from "sonner";

// Define the order interface to ensure consistent typing
interface OrderType {
  id: string;
  customer: string;
  customerPhone: string;
  location: string;
  pickupLocation: string;
  time: string;
  date: string;
  status: string;
  amount: number;
  priority: string;
  wasteType: string;
  lorryType: string;
  distance: string;
  estimatedDuration: string;
  notes: string;
  paymentStatus: string;
  nearestBin: {
    name: string;
    distance: string;
    location: string;
    capacity: string;
    type: string;
  };
  driverNotes?: string;
  startedTime?: string;
  completedTime?: string;
  cancelledTime?: string;
  cancelReason?: string;
}

const DriverOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // State for orders with proper typing
  const [orders, setOrders] = useState<OrderType[]>([
    {
      id: "JOB001",
      customer: "ABC Construction Sdn Bhd",
      customerPhone: "+60123456789",
      location: "Jalan Ampang, Kuala Lumpur",
      pickupLocation: "Taman Tun Dr Ismail",
      time: "09:30 AM",
      date: "2024-01-15",
      status: "assigned",
      amount: 350.00,
      priority: "high",
      wasteType: "Construction Debris",
      lorryType: "Large Truck",
      distance: "12.5 km",
      estimatedDuration: "45 min",
      notes: "Handle with care - fragile materials included",
      paymentStatus: "confirmed",
      nearestBin: {
        name: "Central Waste Collection Point",
        distance: "2.3 km",
        location: "Jalan Sultan Ismail, KL",
        capacity: "Large",
        type: "Mixed Waste"
      }
    },
    {
      id: "JOB002",
      customer: "Green Valley Resort",
      customerPhone: "+60187654321",
      location: "Genting Highlands, Pahang",
      pickupLocation: "Resort Main Building",
      time: "11:00 AM",
      date: "2024-01-15",
      status: "in-progress",
      amount: 450.00,
      priority: "medium",
      wasteType: "General Waste",
      lorryType: "Medium Truck",
      distance: "25.0 km",
      estimatedDuration: "1h 20min",
      notes: "Multiple pickup points within the resort",
      driverNotes: "Currently en route to pickup location",
      startedTime: "10:45 AM",
      paymentStatus: "pending",
      nearestBin: {
        name: "Genting Waste Management Center",
        distance: "1.8 km",
        location: "Genting Resort Road",
        capacity: "Extra Large",
        type: "General Waste"
      }
    },
    {
      id: "JOB003",
      customer: "Sunshine Apartments",
      customerPhone: "+60198765432",
      location: "Petaling Jaya, Selangor",
      pickupLocation: "Block A Parking Area",
      time: "02:30 PM",
      date: "2024-01-15",
      status: "completed",
      amount: 280.00,
      priority: "low",
      wasteType: "Household Waste",
      lorryType: "Small Truck",
      distance: "8.2 km",
      estimatedDuration: "30 min",
      notes: "Weekly scheduled pickup",
      driverNotes: "Completed successfully. Customer was satisfied.",
      completedTime: "03:15 PM",
      paymentStatus: "paid",
      nearestBin: {
        name: "PJ Community Center Bin",
        distance: "0.9 km",
        location: "Jalan 14/20, Petaling Jaya",
        capacity: "Medium",
        type: "Household Waste"
      }
    },
    {
      id: "JOB004",
      customer: "Tech Park Industries",
      customerPhone: "+60134567890",
      location: "Cyberjaya, Selangor",
      pickupLocation: "Loading Bay 3",
      time: "04:00 PM",
      date: "2024-01-15",
      status: "cancelled",
      amount: 520.00,
      priority: "high",
      wasteType: "Electronic Waste",
      lorryType: "Specialized Truck",
      distance: "18.7 km",
      estimatedDuration: "55 min",
      notes: "Cancelled due to weather conditions",
      cancelledTime: "03:45 PM",
      cancelReason: "Heavy rain and flooding in the area",
      paymentStatus: "refunded",
      nearestBin: {
        name: "Cyberjaya E-Waste Center",
        distance: "3.2 km",
        location: "Persiaran Cyberport, Cyberjaya",
        capacity: "Specialized",
        type: "Electronic Waste"
      }
    }
  ]);

  // Order management functions with proper typing
  const handleStartOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: "in-progress", 
            startedTime: new Date().toLocaleTimeString(),
            driverNotes: order.driverNotes || "Order started"
          }
        : order
    ));
    toast.success("Order started successfully!");
  };

  const handleFinishOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: "completed", 
            completedTime: new Date().toLocaleTimeString(),
            driverNotes: order.driverNotes || "Order completed successfully"
          }
        : order
    ));
    toast.success("Order completed successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in-progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "assigned": return "bg-orange-50 text-orange-700 border-orange-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <AlertCircle className="h-4 w-4" />;
      case "assigned": return <Clock className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 text-red-700";
      case "medium": return "bg-amber-50 border-amber-200 text-amber-700";
      case "low": return "bg-green-50 border-green-200 text-green-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending": return "bg-orange-50 text-orange-700 border-orange-200";
      case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "refunded": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeTab === "all" || order.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  const orderCounts = {
    all: orders.length,
    assigned: orders.filter(o => o.status === "assigned").length,
    "in-progress": orders.filter(o => o.status === "in-progress").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const handleViewOrder = (order: OrderType) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleNavigate = (location: string) => {
    toast.success(`Opening navigation to ${location}`);
  };

  const handleCallCustomer = (phone: string) => {
    toast.success(`Calling ${phone}`);
  };

  const handleNavigateToNearestBin = (binLocation: string) => {
    toast.success(`Opening navigation to nearest bin at ${binLocation}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Breadcrumbs */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm">
        <div className="px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  My Orders
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-6 w-6" />
                </div>
                My Orders
              </h1>
              <p className="text-blue-100">Manage and track your delivery orders</p>
            </div>
            <div className="text-center">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-blue-100">Total Orders</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="shadow-sm mb-6 border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by customer, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44 border-gray-200 focus:border-blue-400">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4 pb-0">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 h-10">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm">
                All ({orderCounts.all})
              </TabsTrigger>
              <TabsTrigger value="assigned" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm">
                Assigned ({orderCounts.assigned})
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm">
                Active ({orderCounts["in-progress"]})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                Done ({orderCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-sm">
                Cancelled ({orderCounts.cancelled})
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value={activeTab}>
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? "Try adjusting your search terms" : "No orders match the current filter"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="shadow-sm border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Order Header */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <Package className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{order.customer}</h3>
                                <p className="text-sm text-blue-600 font-medium">#{order.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`border ${getPriorityColor(order.priority)} font-medium px-2 py-1`}>
                                {order.priority.toUpperCase()}
                              </Badge>
                              <Badge className={`border ${getStatusColor(order.status)} font-medium flex items-center gap-1 px-2 py-1`}>
                                {getStatusIcon(order.status)}
                                {order.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Order Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-700 text-sm">Pickup</p>
                                <p className="text-gray-600 text-sm">{order.pickupLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-700 text-sm">Schedule</p>
                                <p className="text-gray-600 text-sm">{order.date} at {order.time}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                              <DollarSign className="h-4 w-4 text-emerald-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-700 text-sm">Amount</p>
                                <p className="text-emerald-600 font-bold text-sm">RM {order.amount.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Distance and Duration */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg">
                            <span className="flex items-center gap-2">
                              <Navigation className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{order.distance}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="font-medium">{order.estimatedDuration}</span>
                            </span>
                            {order.startedTime && (
                              <span className="flex items-center gap-2">
                                <Play className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Started at {order.startedTime}</span>
                              </span>
                            )}
                            {order.completedTime && (
                              <span className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="font-medium">Completed at {order.completedTime}</span>
                              </span>
                            )}
                          </div>

                          {/* Nearest Bin Information */}
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-purple-700 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Nearest Waste Bin
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleNavigateToNearestBin(order.nearestBin.location)}
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                              >
                                <Map className="h-3 w-3 mr-1" />
                                Navigate
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-600">{order.nearestBin.name}</p>
                                <p className="text-purple-600 font-medium">{order.nearestBin.distance} away</p>
                              </div>
                              <div>
                                <p className="text-gray-600">{order.nearestBin.type}</p>
                                <p className="text-purple-600 font-medium">{order.nearestBin.capacity}</p>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {order.notes && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium text-amber-700">Notes:</span> {order.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 min-w-40">
                          <Button
                            onClick={() => handleViewOrder(order)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          {order.status !== "cancelled" && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => handleNavigate(order.location)}
                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Navigate
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => handleCallCustomer(order.customerPhone)}
                                className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call Customer
                              </Button>

                              {/* Order Action Buttons */}
                              {order.status === "assigned" && (
                                <Button
                                  onClick={() => handleStartOrder(order.id)}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Order
                                </Button>
                              )}
                              
                              {order.status === "in-progress" && (
                                <Button
                                  onClick={() => handleFinishOrder(order.id)}
                                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                                >
                                  <Square className="h-4 w-4 mr-2" />
                                  Finish Order
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              Order Details - #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <Badge className={`border ${getStatusColor(selectedOrder.status)} font-medium flex items-center gap-1 px-3 py-1`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge className={`border ${getPriorityColor(selectedOrder.priority)} font-medium px-3 py-1`}>
                  {selectedOrder.priority.toUpperCase()} PRIORITY
                </Badge>
                <Badge className={`border ${getPaymentStatusColor(selectedOrder.paymentStatus)} font-medium px-3 py-1`}>
                  {selectedOrder.paymentStatus.toUpperCase()}
                </Badge>
              </div>

              {/* Customer Information */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-medium">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium mb-1">Pickup Location</p>
                      <p className="text-gray-700">{selectedOrder.pickupLocation}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-600 font-medium mb-1">Delivery Location</p>
                      <p className="text-gray-700">{selectedOrder.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm bg-gray-50 p-3 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Distance: {selectedOrder.distance}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Duration: {selectedOrder.estimatedDuration}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-indigo-600" />
                    Job Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Date & Time</p>
                      <p className="font-medium">{selectedOrder.date} at {selectedOrder.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Waste Type</p>
                      <p className="font-medium">{selectedOrder.wasteType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Required</p>
                      <p className="font-medium">{selectedOrder.lorryType}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-emerald-600">RM {selectedOrder.amount.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <Badge className={`border ${getPaymentStatusColor(selectedOrder.paymentStatus)} font-medium`}>
                          {selectedOrder.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nearest Bin Details */}
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                    <Trash2 className="h-5 w-5" />
                    Nearest Waste Collection Point
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Collection Point</p>
                      <p className="text-gray-700">{selectedOrder.nearestBin.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedOrder.nearestBin.location}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Distance:</span>
                        <span className="font-medium text-purple-600">{selectedOrder.nearestBin.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Capacity:</span>
                        <span className="font-medium">{selectedOrder.nearestBin.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="font-medium">{selectedOrder.nearestBin.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleNavigateToNearestBin(selectedOrder.nearestBin.location)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate to Collection Point
                  </Button>
                </CardContent>
              </Card>

              {/* Status Timeline and Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Status Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      {selectedOrder.status === "completed" && (
                        <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-emerald-700">Completed</p>
                            <p className="text-xs text-gray-600">{selectedOrder.completedTime}</p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.status === "in-progress" && (
                        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-blue-700">In Progress</p>
                            <p className="text-xs text-gray-600">{selectedOrder.startedTime}</p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.status === "cancelled" && (
                        <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-red-700">Cancelled</p>
                            <p className="text-xs text-gray-600">{selectedOrder.cancelledTime}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Scheduled</p>
                          <p className="text-xs text-gray-600">{selectedOrder.date} at {selectedOrder.time}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-gray-600" />
                      Notes & Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedOrder.notes && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm font-medium text-amber-700 mb-1">Customer Notes:</p>
                        <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                      </div>
                    )}
                    {selectedOrder.driverNotes && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-700 mb-1">Driver Notes:</p>
                        <p className="text-sm text-gray-700">{selectedOrder.driverNotes}</p>
                      </div>
                    )}
                    {selectedOrder.cancelReason && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-700 mb-1">Cancellation Reason:</p>
                        <p className="text-sm text-gray-700">{selectedOrder.cancelReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleNavigate(selectedOrder.location)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate to Location
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCallCustomer(selectedOrder.customerPhone)}
                  className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverOrders;
