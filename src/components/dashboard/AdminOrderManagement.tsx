import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Eye, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  XCircle,
  Plus,
  Truck
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { useNavigate } from "react-router-dom";

const AdminOrderManagement: React.FC = () => {
  const { orders, drivers, assignOrderToDriver } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return PlayCircle;
      case "assigned": return Clock;
      case "pending": return AlertCircle;
      case "cancelled": return XCircle;
      default: return Clock;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAssignDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      assignOrderToDriver(orderId, driverId);
    }
  };

  const handleViewOrder = (orderId: string) => {
    console.log("Viewing order details:", orderId);
  };

  // Calculate statistics
  const todayOrders = orders.filter(order => order.date === new Date().toISOString().split('T')[0]);
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const activeOrders = orders.filter(order => ['assigned', 'in-progress'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-yellow-600" />
            Order Management
          </h2>
          <p className="text-gray-600 mt-1">Monitor and manage all delivery orders in real-time</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate("/admin/bookings") }>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{todayOrders.length}</p>
                <p className="text-sm text-gray-600">Today's Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
                <p className="text-sm text-gray-600">Pending Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <PlayCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{activeOrders.length}</p>
                <p className="text-sm text-gray-600">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID, customer, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="flex items-center gap-2">
                    {order.customerName || order.customer}
                    <Badge className="ml-2 capitalize border">
                      {order.status.replace("-", " ")}
                    </Badge>
                  </CardTitle>
                </div>
                {order.assignedDriverName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    <span>Assigned: {order.assignedDriverName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge className={`${getPaymentStatusColor(order.paymentStatus)} capitalize border`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Order ID</span>
                  <span className="font-mono text-sm">{order.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Date & Time</span>
                  <span>{order.date} {order.time}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Location</span>
                  <span>{order.location}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Amount</span>
                  <span className="font-bold text-green-600">RM {order.amount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Owner/Manager/Supervisor</span>
                  <span>{order.ownerManagerSupervisor || '-'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Introducer</span>
                  <span>{order.introducer || '-'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Job Ref</span>
                  <span>{order.jobReference || '-'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Area</span>
                  <span>{order.area || '-'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">State</span>
                  <span>{order.state || '-'}</span>
                </div>
                {order.assignedDriverId ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Assigned Driver</span>
                    <Select
                      value={order.assignedDriverId}
                      onValueChange={(driverId) => handleAssignDriver(order.id, driverId)}
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Assign Driver</span>
                    <Select
                      value=""
                      onValueChange={(driverId) => handleAssignDriver(order.id, driverId)}
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Assign Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {order.manualBookingByDriver && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Manual Book by Driver</span>
                    <span className="text-xs">Name: {order.manualBookingByDriver.name}</span>
                    <span className="text-xs">Phone: {order.manualBookingByDriver.phone}</span>
                    <span className="text-xs">Bin#: {order.manualBookingByDriver.binNumber}</span>
                    <span className="text-xs">Size: {order.manualBookingByDriver.binSize}</span>
                    <span className="text-xs">Amount: RM {order.manualBookingByDriver.amount}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManagement;
