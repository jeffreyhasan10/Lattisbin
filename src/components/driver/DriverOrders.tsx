
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Package
} from "lucide-react";
import { toast } from "sonner";

const DriverOrders = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

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
      case "pending": return "bg-orange-500";
      case "en-route-pickup": return "bg-blue-400";
      case "bin-collected": return "bg-purple-500";
      case "in-transit": return "bg-indigo-500";
      case "delivered": return "bg-green-400";
      case "completed": return "bg-green-600";
      default: return "bg-gray-500";
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

  if (selectedOrderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">Order Details</h1>
                <p className="text-sm text-gray-600">{selectedOrderData.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Status Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Badge className={`${getStatusColor(selectedOrderData.status)} text-white`}>
                  {getStatusText(selectedOrderData.status)}
                </Badge>
                <span className="text-sm text-gray-600">{selectedOrderData.assignedTime}</span>
              </div>
              
              {selectedOrderData.status !== "completed" && (
                <Button 
                  className="w-full"
                  onClick={() => updateOrderStatus(selectedOrderData.id, getNextStatus(selectedOrderData.status))}
                >
                  Update to: {getStatusText(getNextStatus(selectedOrderData.status))}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{selectedOrderData.customerName}</p>
                <p className="text-sm text-gray-600">{selectedOrderData.customerCompany}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open(`tel:${selectedOrderData.customerPhone}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                {selectedOrderData.customerPhone}
              </Button>
            </CardContent>
          </Card>

          {/* Bin Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bin Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{selectedOrderData.binType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Serial</p>
                  <p className="font-medium">{selectedOrderData.binSerial}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-medium">{selectedOrderData.binSize}</p>
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pickup Address</p>
                <p className="text-sm mb-2">{selectedOrderData.pickupAddress}</p>
                <Button 
                  variant="outline" 
                  size="sm"
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
                <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                <p className="text-sm mb-2">{selectedOrderData.deliveryAddress}</p>
                <Button 
                  variant="outline" 
                  size="sm"
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-green-600">RM{selectedOrderData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <Badge variant="outline">{selectedOrderData.paymentMethod}</Badge>
              </div>
              <Button 
                className="w-full mt-3"
                onClick={() => navigate("/driver/payments", { state: { orderId: selectedOrderData.id } })}
              >
                Collect Payment
              </Button>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          {selectedOrderData.specialInstructions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Special Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedOrderData.specialInstructions}</p>
              </CardContent>
            </Card>
          )}

          {/* Photo Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-xs">Before</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-xs">During</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-xs">After</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/driver/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">My Orders</h1>
              <p className="text-sm text-gray-600">{orders.length} total orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge variant="default" className="bg-orange-500">Pending ({orders.filter(o => o.status === 'pending').length})</Badge>
          <Badge variant="outline" className="whitespace-nowrap">In Progress ({orders.filter(o => o.status.includes('progress') || o.status.includes('route') || o.status.includes('transit')).length})</Badge>
          <Badge variant="outline" className="whitespace-nowrap">Completed ({orders.filter(o => o.status === 'completed').length})</Badge>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <Card 
              key={order.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOrder(order.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerCompany}</p>
                    <p className="text-xs text-gray-500">{order.id} • {order.assignedTime}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>{order.binType} ({order.binSerial})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">RM{order.amount.toFixed(2)}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverOrders;
