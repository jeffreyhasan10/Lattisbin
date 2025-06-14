
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Navigation, 
  Camera, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
  Calendar,
  User,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DriverOrders = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Dummy orders data
  const [orders, setOrders] = useState([
    {
      id: "JOB001",
      customerName: "ABC Construction Sdn Bhd",
      customerCompany: "ABC Construction",
      customerPhone: "03-9876 5432",
      pickupAddress: "Jalan Ampang, 50450 Kuala Lumpur",
      deliveryAddress: "No. 123, Jalan Tun Razak, 50400 KL",
      binType: "ASR100",
      binSerial: "ASR100-001",
      binSize: "4x12x6ft",
      status: "pending",
      amount: 350.00,
      paymentMethod: "Cash",
      assignedTime: "08:00 AM",
      priority: "high",
      specialInstructions: "Please call before delivery. Gate access required.",
      pickupLat: 3.1390,
      pickupLng: 101.6869,
      deliveryLat: 3.1478,
      deliveryLng: 101.6953
    },
    {
      id: "JOB002", 
      customerName: "Lim Wei Chong",
      customerCompany: "Green Valley Resort",
      customerPhone: "012-345 6789",
      pickupAddress: "Warehouse B, Port Klang",
      deliveryAddress: "Green Valley Resort, Genting Highlands",
      binType: "LASR100",
      binSerial: "LASR100-045",
      binSize: "6x12x8ft",
      status: "in-progress",
      amount: 450.00,
      paymentMethod: "Online Transfer",
      assignedTime: "10:30 AM",
      priority: "medium",
      specialInstructions: "Heavy machinery access route only.",
      pickupLat: 3.0319,
      pickupLng: 101.3932,
      deliveryLat: 3.4221,
      deliveryLng: 101.7933
    },
    {
      id: "JOB003",
      customerName: "Sarah Ahmad",
      customerCompany: "Sunshine Apartments",
      customerPhone: "016-789 0123",
      pickupAddress: "Customer Site - Collected",
      deliveryAddress: "Sunshine Apartments, 47800 Petaling Jaya",
      binType: "PWD100",
      binSerial: "PWD100-023",
      binSize: "3x10x5ft",
      status: "completed",
      amount: 280.00,
      paymentMethod: "Cheque",
      assignedTime: "07:00 AM",
      priority: "low",
      specialInstructions: "Payment collected on delivery.",
      pickupLat: 3.1073,
      pickupLng: 101.5951,
      deliveryLat: 3.1073,
      deliveryLng: 101.5951
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "en-route-pickup": return "bg-blue-100 text-blue-800 border-blue-200";
      case "bin-collected": return "bg-purple-100 text-purple-800 border-purple-200";
      case "in-transit": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "en-route-pickup": return "En Route to Pickup";
      case "bin-collected": return "Bin Collected";
      case "in-transit": return "In Transit";
      case "delivered": return "Delivered";  
      case "completed": return "Completed";
      default: return status;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending": return "en-route-pickup";
      case "en-route-pickup": return "bin-collected";
      case "bin-collected": return "in-transit";
      case "in-transit": return "delivered";
      case "delivered": return "completed";
      default: return currentStatus;
    }
  };

  const openNavigation = (lat: number, lng: number, address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
    toast.success(`Opening navigation to ${address}`);
  };

  const selectedOrderData = orders.find(order => order.id === selectedOrder);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <CheckCircle className="h-5 w-5" />;
      case "en-route-pickup": return <Navigation className="h-5 w-5" />;
      case "bin-collected": return <Truck className="h-5 w-5" />;
      case "in-transit": return <Clock className="h-5 w-5" />;
      case "delivered": return <CheckCircle className="h-5 w-5" />;
      case "completed": return <CheckCircle className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(order => {
    if (filterStatus === "pending") return order.status === "pending";
    if (filterStatus === "active") return ["in-progress", "en-route-pickup", "bin-collected", "in-transit"].includes(order.status);
    if (filterStatus === "completed") return order.status === "completed";
    return true;
  });

  if (selectedOrderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl text-slate-900">Order Details</h1>
                <p className="text-sm text-slate-600 font-medium">{selectedOrderData.id}</p>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {/* Status Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`px-4 py-2 rounded-lg font-semibold border ${getStatusColor(selectedOrderData.status)}`}>
                    {getStatusText(selectedOrderData.status)}
                  </Badge>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{selectedOrderData.assignedTime}</span>
                  </div>
                </div>
                
                {selectedOrderData.status !== "completed" && (
                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm h-12 font-semibold"
                    onClick={() => updateOrderStatus(selectedOrderData.id, getNextStatus(selectedOrderData.status))}
                  >
                    Update to: {getStatusText(getNextStatus(selectedOrderData.status))}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center gap-3 font-bold text-slate-900">
                  <User className="h-5 w-5 text-slate-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="font-bold text-lg text-slate-900">{selectedOrderData.customerName}</p>
                  <p className="text-sm text-slate-600 font-medium">{selectedOrderData.customerCompany}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12 border-gray-300 hover:bg-gray-50 rounded-lg"
                  onClick={() => window.open(`tel:${selectedOrderData.customerPhone}`)}
                >
                  <Phone className="h-5 w-5 mr-3 text-green-600" />
                  <span className="font-semibold">{selectedOrderData.customerPhone}</span>
                </Button>
              </CardContent>
            </Card>

            {/* Bin Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900">
                  <Package className="h-5 w-5 text-slate-600" />
                  Bin Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Type</p>
                    <p className="font-medium text-slate-900">{selectedOrderData.binType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Serial</p>
                    <p className="font-medium text-slate-900">{selectedOrderData.binSerial}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Size</p>
                  <p className="font-medium text-slate-900">{selectedOrderData.binSize}</p>
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900">
                  <MapPin className="h-5 w-5 text-slate-600" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pickup Address</p>
                  <p className="text-sm mb-2 text-slate-900">{selectedOrderData.pickupAddress}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50"
                    onClick={() => openNavigation(
                      selectedOrderData.pickupLat, 
                      selectedOrderData.pickupLng, 
                      "pickup location"
                    )}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate to Pickup
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Delivery Address</p>
                  <p className="text-sm mb-2 text-slate-900">{selectedOrderData.deliveryAddress}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50"
                    onClick={() => openNavigation(
                      selectedOrderData.deliveryLat, 
                      selectedOrderData.deliveryLng, 
                      "delivery location"
                    )}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate to Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-bold text-green-600">RM{selectedOrderData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Method:</span>
                  <Badge variant="outline" className="border-gray-300">{selectedOrderData.paymentMethod}</Badge>
                </div>
                <Button 
                  className="w-full mt-3 bg-slate-900 hover:bg-slate-800"
                  onClick={() => navigate("/driver/payments", { state: { orderId: selectedOrderData.id } })}
                >
                  Collect Payment
                </Button>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            {selectedOrderData.specialInstructions && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Special Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-slate-700">{selectedOrderData.specialInstructions}</p>
                </CardContent>
              </Card>
            )}

            {/* Photo Documentation */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900">
                  <Camera className="h-5 w-5 text-slate-600" />
                  Photo Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-20 flex-col border-gray-300 hover:bg-gray-50">
                    <Camera className="h-6 w-6 mb-1 text-slate-600" />
                    <span className="text-xs text-slate-700">Before</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-gray-300 hover:bg-gray-50">
                    <Camera className="h-6 w-6 mb-1 text-slate-600" />
                    <span className="text-xs text-slate-700">During</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-gray-300 hover:bg-gray-50">
                    <Camera className="h-6 w-6 mb-1 text-slate-600" />
                    <span className="text-xs text-slate-700">After</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/driver/dashboard" 
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-700 font-semibold">
                  My Orders
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <FileText className="h-7 w-7 text-slate-600" />
              My Orders
            </h1>
            <p className="text-slate-600 font-medium">{orders.length} total orders • {filteredOrders.length} showing</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
            <p className="text-lg font-bold text-slate-900 mb-1">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              Today
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 space-y-6">
          {/* Filter Tabs */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { key: "all", label: "All Orders", count: orders.length },
                  { key: "pending", label: "Pending", count: orders.filter(o => o.status === 'pending').length },
                  { key: "active", label: "Active", count: orders.filter(o => ['in-progress', 'en-route-pickup', 'bin-collected', 'in-transit'].includes(o.status)).length },
                  { key: "completed", label: "Completed", count: orders.filter(o => o.status === 'completed').length }
                ].map(({ key, label, count }) => (
                  <Button
                    key={key}
                    variant={filterStatus === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(key)}
                    className={`whitespace-nowrap rounded-lg transition-all duration-300 ${
                      filterStatus === key
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border-gray-300 text-slate-700 hover:bg-gray-50"
                    }`}
                  >
                    {label} ({count})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card 
                key={order.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200 shadow-sm"
                onClick={() => setSelectedOrder(order.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-lg truncate">{order.customerName}</p>
                        <p className="text-sm text-slate-600 mb-2 font-medium">{order.customerCompany}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {order.id} • {order.assignedTime}
                        </p>
                      </div>
                    </div>
                    <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Package className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-semibold text-slate-900">{order.binType}</p>
                        <p className="text-xs text-slate-500">Serial: {order.binSerial}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <span className="truncate font-medium text-slate-700">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-bold text-green-600 text-lg">RM{order.amount.toFixed(2)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                        {order.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredOrders.length === 0 && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-600 mb-2">No orders found</p>
                  <p className="text-sm text-slate-500">No orders match the selected filter.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DriverOrders;
