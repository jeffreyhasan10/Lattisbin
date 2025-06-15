
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  DollarSign,
  Package,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle,
  Truck,
  Route,
  Timer,
  CreditCard,
  FileText,
  Calendar,
  User,
  Trash2,
  Play,
  Square,
  Bell,
  X,
} from "lucide-react";
import { toast } from "sonner";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New order assigned for today - ABC Construction",
      type: "order",
      time: "2 minutes ago",
      orderId: "JOB001"
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState(false);

  // Mock data for today's orders
  const todaysOrders = [
    {
      id: "JOB001",
      customer: "ABC Construction Sdn Bhd",
      customerPhone: "+60123456789",
      location: "Jalan Ampang, Kuala Lumpur",
      pickupLocation: "Taman Tun Dr Ismail",
      time: "09:30 AM",
      status: "assigned",
      amount: 350.00,
      priority: "high",
      wasteType: "Construction Debris",
      distance: "12.5 km",
      estimatedDuration: "45 min",
      binLocation: {
        name: "Central Waste Collection Point",
        address: "Jalan Sultan Ismail, KL",
        distance: "2.3 km",
        coordinates: { lat: 3.1478, lng: 101.7037 }
      }
    },
    {
      id: "JOB002",
      customer: "Sunshine Apartments",
      customerPhone: "+60198765432",
      location: "Petaling Jaya, Selangor",
      pickupLocation: "Block A Parking Area",
      time: "02:30 PM",
      status: "in-progress",
      amount: 280.00,
      priority: "medium",
      wasteType: "Household Waste",
      distance: "8.2 km",
      estimatedDuration: "30 min",
      startedAt: "02:15 PM",
      binLocation: {
        name: "PJ Community Center Bin",
        address: "Jalan 14/20, Petaling Jaya",
        distance: "0.9 km",
        coordinates: { lat: 3.1073, lng: 101.6067 }
      }
    }
  ];

  const [orders, setOrders] = useState(todaysOrders);
  const [completedOrders, setCompletedOrders] = useState([
    {
      id: "JOB003",
      customer: "Green Valley Resort",
      amount: 450.00,
      completedAt: "10:15 AM",
      paymentStatus: "collected"
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "in-progress", startedAt: new Date().toLocaleTimeString() }
        : order
    ));
    toast.success("Order started successfully!");
  };

  const handleFinishOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setCompletedOrders(prev => [...prev, {
        id: order.id,
        customer: order.customer,
        amount: order.amount,
        completedAt: new Date().toLocaleTimeString(),
        paymentStatus: "pending"
      }]);
      toast.success("Order completed successfully!");
    }
  };

  const handleCollectPayment = (orderId: string) => {
    setCompletedOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, paymentStatus: "collected" }
        : order
    ));
    toast.success("Payment collected successfully!");
  };

  const handleNavigateToLocation = (location: string, coordinates?: any) => {
    if (coordinates) {
      // In a real app, this would open the device's map app
      window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`, '_blank');
    }
    toast.success(`Navigating to ${location}`);
  };

  const handleFindNearestBin = (binLocation: any) => {
    if (binLocation.coordinates) {
      window.open(`https://www.google.com/maps?q=${binLocation.coordinates.lat},${binLocation.coordinates.lng}`, '_blank');
    }
    toast.success(`Navigating to nearest bin: ${binLocation.name}`);
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "bg-blue-50 text-blue-700 border-blue-200";
      case "in-progress": return "bg-orange-50 text-orange-700 border-orange-200";
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned": return <Clock className="h-4 w-4" />;
      case "in-progress": return <AlertCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
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

  const todayStats = {
    totalOrders: orders.length + completedOrders.length,
    activeOrders: orders.filter(o => o.status === "in-progress").length,
    completedOrders: completedOrders.length,
    totalEarnings: completedOrders.reduce((sum, order) => sum + order.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-6">
      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications ({notifications.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-blue-600 hover:bg-blue-100"
              >
                {showNotifications ? "Hide" : "Show"}
              </Button>
            </div>
            {showNotifications && (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate('/driver/orders')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Orders
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-500 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 border-0 shadow-xl mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-white">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                Driver Dashboard
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                Welcome back! Here's your daily overview and active orders.
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <span className="text-blue-300">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-w-64">
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{todayStats.totalOrders}</p>
                <p className="text-blue-100 font-medium">Total Orders Today</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: "Active Orders", 
            value: todayStats.activeOrders, 
            color: "from-orange-500 to-red-600",
            icon: <AlertCircle className="h-6 w-6 text-white" />
          },
          { 
            label: "Completed", 
            value: todayStats.completedOrders, 
            color: "from-emerald-500 to-green-600",
            icon: <CheckCircle className="h-6 w-6 text-white" />
          },
          { 
            label: "Total Orders", 
            value: todayStats.totalOrders, 
            color: "from-blue-500 to-cyan-600",
            icon: <Package className="h-6 w-6 text-white" />
          },
          { 
            label: "Earnings", 
            value: `RM ${todayStats.totalEarnings.toFixed(2)}`, 
            color: "from-purple-500 to-violet-600",
            icon: <DollarSign className="h-6 w-6 text-white" />
          }
        ].map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-r ${stat.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90 font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Orders */}
      <Card className="shadow-lg border-gray-200 mb-6">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            Today's Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Orders</h3>
              <p className="text-gray-500">You have no orders assigned for today.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700 text-sm">Pickup Location</p>
                              <p className="text-gray-600 text-sm">{order.pickupLocation}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Clock className="h-4 w-4 text-purple-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700 text-sm">Scheduled Time</p>
                              <p className="text-gray-600 text-sm">{order.time}</p>
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

                        {/* Bin Location */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-purple-700 flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                              Nearest Collection Point
                            </h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFindNearestBin(order.binLocation)}
                              className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Navigate
                            </Button>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-700 font-medium">{order.binLocation.name}</p>
                            <p className="text-gray-600">{order.binLocation.address}</p>
                            <p className="text-purple-600 font-medium">{order.binLocation.distance} away</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <span className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{order.distance}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">{order.estimatedDuration}</span>
                          </span>
                          {order.startedAt && (
                            <span className="flex items-center gap-2">
                              <Play className="h-4 w-4 text-green-500" />
                              <span className="font-medium">Started at {order.startedAt}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-48">
                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            setOrderDetails(true);
                          }}
                          variant="outline"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        <Button
                          onClick={() => handleNavigateToLocation(order.location)}
                          variant="outline"
                          className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        
                        <Button
                          onClick={() => window.open(`tel:${order.customerPhone}`)}
                          variant="outline"
                          className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>

                        {order.status === "assigned" ? (
                          <Button
                            onClick={() => handleStartOrder(order.id)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Order
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleFinishOrder(order.id)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Finish Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <Card className="shadow-lg border-gray-200 mb-6">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              Completed Orders ({completedOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <Card key={order.id} className="border border-emerald-200 bg-emerald-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{order.customer}</h4>
                          <p className="text-sm text-gray-600">#{order.id} • Completed at {order.completedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">RM {order.amount.toFixed(2)}</p>
                          <Badge className={`${order.paymentStatus === 'collected' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-orange-100 text-orange-700 border-orange-200'} border`}>
                            {order.paymentStatus === 'collected' ? 'Payment Collected' : 'Payment Pending'}
                          </Badge>
                        </div>
                        {order.paymentStatus === 'pending' && (
                          <Button
                            onClick={() => handleCollectPayment(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Collect Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/driver/orders')}
              className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-2"
            >
              <Package className="h-5 w-5" />
              <span className="text-sm font-medium">My Orders</span>
            </Button>
            <Button 
              onClick={() => navigate('/driver/calendar')}
              variant="outline"
              className="h-16 border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Schedule</span>
            </Button>
            <Button 
              onClick={() => navigate('/driver/payments')}
              variant="outline"
              className="h-16 border-purple-200 text-purple-600 hover:bg-purple-50 flex flex-col items-center justify-center gap-2"
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Payments</span>
            </Button>
            <Button 
              onClick={() => navigate('/driver/profile')}
              variant="outline"
              className="h-16 border-orange-200 text-orange-600 hover:bg-orange-50 flex flex-col items-center justify-center gap-2"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={orderDetails} onOpenChange={setOrderDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              Order Details - #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-medium">{selectedOrder.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Scheduled Time</p>
                  <p className="font-medium">{selectedOrder.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waste Type</p>
                  <p className="font-medium">{selectedOrder.wasteType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-bold text-emerald-600">RM {selectedOrder.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Collection Point Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.binLocation.name}</p>
                  <p><span className="font-medium">Address:</span> {selectedOrder.binLocation.address}</p>
                  <p><span className="font-medium">Distance:</span> {selectedOrder.binLocation.distance}</p>
                </div>
                <Button 
                  onClick={() => handleFindNearestBin(selectedOrder.binLocation)}
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate to Collection Point
                </Button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleNavigateToLocation(selectedOrder.location)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate to Customer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${selectedOrder.customerPhone}`)}
                  className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverDashboard;
