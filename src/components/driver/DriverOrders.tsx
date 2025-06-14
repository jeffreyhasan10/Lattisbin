
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { toast } from "sonner";

const DriverOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for orders
  const orders = [
    {
      id: "JOB001",
      customer: "ABC Construction Sdn Bhd",
      customerPhone: "+60123456789",
      location: "Jalan Ampang, Kuala Lumpur",
      pickupLocation: "Taman Tun Dr Ismail",
      time: "09:30 AM",
      date: "2024-01-15",
      status: "completed",
      amount: 350.00,
      priority: "high",
      wasteType: "Construction Debris",
      lorryType: "Large Truck",
      distance: "12.5 km",
      estimatedDuration: "45 min",
      notes: "Handle with care - fragile materials included"
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
      notes: "Multiple pickup points within the resort"
    },
    {
      id: "JOB003",
      customer: "Sunshine Apartments",
      customerPhone: "+60198765432",
      location: "Petaling Jaya, Selangor",
      pickupLocation: "Block A Parking Area",
      time: "02:30 PM",
      date: "2024-01-15",
      status: "pending",
      amount: 280.00,
      priority: "low",
      wasteType: "Household Waste",
      lorryType: "Small Truck",
      distance: "8.2 km",
      estimatedDuration: "30 min",
      notes: "Weekly scheduled pickup"
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
      notes: "Cancelled due to weather conditions"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-300";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <AlertCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 text-red-700";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "low": return "bg-green-50 border-green-200 text-green-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
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
    pending: orders.filter(o => o.status === "pending").length,
    "in-progress": orders.filter(o => o.status === "in-progress").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const handleViewOrder = (orderId: string) => {
    toast.success(`Viewing order ${orderId}`);
  };

  const handleNavigate = (location: string) => {
    toast.success(`Opening navigation to ${location}`);
  };

  const handleCallCustomer = (phone: string) => {
    toast.success(`Calling ${phone}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 rounded-lg mb-6 shadow-sm">
        <div className="px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-700 font-semibold">
                  My Orders
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="h-7 w-7 text-blue-200" />
              My Orders
            </h1>
            <p className="text-blue-100 font-medium">Manage and track your delivery orders</p>
          </div>
          <div className="text-right">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{orders.length}</p>
              <p className="text-xs text-blue-200">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border border-blue-200 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder="Search orders by customer, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 border-blue-200 focus:border-blue-400">
                <Filter className="h-4 w-4 mr-2 text-blue-500" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="bg-white border border-blue-200 shadow-lg">
          <CardContent className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-5 bg-blue-50 border border-blue-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All ({orderCounts.all})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                Pending ({orderCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Active ({orderCounts["in-progress"]})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Completed ({orderCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Cancelled ({orderCounts.cancelled})
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value={activeTab} className="mt-6">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="bg-white border border-blue-200 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No orders found</h3>
                    <p className="text-slate-500">
                      {searchTerm ? "Try adjusting your search terms" : "No orders match the current filter"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="bg-white border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Order Header */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                                <Package className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-900">{order.customer}</h3>
                                <p className="text-sm text-blue-600 font-medium">Order ID: {order.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`border ${getPriorityColor(order.priority)} font-medium`}>
                                {order.priority.toUpperCase()}
                              </Badge>
                              <Badge className={`border ${getStatusColor(order.status)} font-medium flex items-center gap-1`}>
                                {getStatusIcon(order.status)}
                                {order.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Order Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <div>
                                <p className="font-medium text-slate-700">Pickup Location</p>
                                <p className="text-slate-600">{order.pickupLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="font-medium text-slate-700">Delivery Location</p>
                                <p className="text-slate-600">{order.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <div>
                                <p className="font-medium text-slate-700">Schedule</p>
                                <p className="text-slate-600">{order.date} at {order.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Truck className="h-4 w-4 text-orange-500" />
                              <div>
                                <p className="font-medium text-slate-700">Vehicle Type</p>
                                <p className="text-slate-600">{order.lorryType}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-indigo-500" />
                              <div>
                                <p className="font-medium text-slate-700">Waste Type</p>
                                <p className="text-slate-600">{order.wasteType}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="font-medium text-slate-700">Payment</p>
                                <p className="text-green-600 font-bold">RM {order.amount.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Distance and Duration */}
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                            <span className="flex items-center gap-1">
                              <Navigation className="h-4 w-4 text-blue-500" />
                              {order.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-orange-500" />
                              {order.estimatedDuration}
                            </span>
                          </div>

                          {/* Notes */}
                          {order.notes && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <p className="text-sm text-slate-700">
                                <span className="font-medium text-blue-700">Notes:</span> {order.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 min-w-48">
                          <Button
                            onClick={() => handleViewOrder(order.id)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          {order.status !== "cancelled" && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => handleNavigate(order.location)}
                                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Navigate
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => handleCallCustomer(order.customerPhone)}
                                className="w-full border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call Customer
                              </Button>
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
    </div>
  );
};

export default DriverOrders;
