import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  ArrowRight,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Truck,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Navigation,
  Package,
  BarChart3,
  Calendar,
  Target,
  Activity,
  Star,
  User,
  Eye,
  PhoneCall,
  Building,
} from "lucide-react";
import { toast } from "sonner";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverSession, setDriverSession] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (session) {
      setDriverSession(JSON.parse(session));
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock data
  const todayStats = {
    totalDeliveries: 8,
    completedDeliveries: 5,
    earnings: 1250.00,
    distance: 127.5,
    onTimeDeliveries: 4,
    totalOrders: 6,
    pendingOrders: 3
  };

  // Today's orders data
  const todayOrders = [
    {
      id: "ORD001",
      customer: "ABC Construction Sdn Bhd",
      phone: "03-1234567",
      pickupTime: "09:00 AM",
      deliveryTime: "10:30 AM",
      pickupAddress: "Jalan Ampang, 50450 KL",
      deliveryAddress: "KLCC Twin Towers, KL",
      binType: "Construction Waste",
      status: "pending",
      priority: "high",
      amount: 350.00,
      estimatedDuration: "1.5 hrs"
    },
    {
      id: "ORD002",
      customer: "Green Valley Resort",
      phone: "03-9876543",
      pickupTime: "11:00 AM",
      deliveryTime: "01:00 PM", 
      pickupAddress: "Genting Highlands Resort",
      deliveryAddress: "Disposal Site, Selangor",
      binType: "Mixed Waste",
      status: "in-progress",
      priority: "medium",
      amount: 450.00,
      estimatedDuration: "2 hrs"
    },
    {
      id: "ORD003",
      customer: "Sunshine Apartments",
      phone: "03-5555555",
      pickupTime: "02:30 PM",
      deliveryTime: "04:00 PM",
      pickupAddress: "Petaling Jaya, Selangor",
      deliveryAddress: "Recycling Center, PJ",
      binType: "Recyclable",
      status: "scheduled",
      priority: "low",
      amount: 280.00,
      estimatedDuration: "1 hr"
    }
  ];

  const recentOrders = [
    {
      id: "JOB001",
      customer: "ABC Construction",
      location: "Jalan Ampang, KL",
      time: "09:30 AM",
      status: "completed",
      amount: 350.00,
      priority: "high"
    },
    {
      id: "JOB002",
      customer: "Green Valley Resort",
      location: "Genting Highlands",
      time: "11:00 AM",
      status: "in-progress",
      amount: 450.00,
      priority: "medium"
    },
    {
      id: "JOB003",
      customer: "Sunshine Apartments",
      location: "Petaling Jaya",
      time: "02:30 PM",
      status: "pending",
      amount: 280.00,
      priority: "low"
    }
  ];

  const quickActions = [
    {
      title: "View Orders",
      description: "Check pending deliveries",
      icon: FileText,
      action: () => navigate("/driver/orders"),
      count: todayStats.pendingOrders,
      color: "blue"
    },
    {
      title: "Select Lorry",
      description: "Choose your vehicle",
      icon: Truck,
      action: () => navigate("/driver/lorries"),
      count: null,
      color: "green"
    },
    {
      title: "Track Payments",
      description: "View earnings",
      icon: DollarSign,
      action: () => navigate("/driver/payments"),
      count: null,
      color: "purple"
    },
    {
      title: "Navigation",
      description: "Get directions",
      icon: Navigation,
      action: () => toast.success("Opening navigation..."),
      count: null,
      color: "orange"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "scheduled": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 hover:bg-red-100";
      case "medium": return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
      case "low": return "bg-green-50 border-green-200 hover:bg-green-100";
      default: return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getActionColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-50 hover:bg-blue-100 border-blue-200";
      case "green": return "bg-green-50 hover:bg-green-100 border-green-200";
      case "purple": return "bg-purple-50 hover:bg-purple-100 border-purple-200";
      case "orange": return "bg-orange-50 hover:bg-orange-100 border-orange-200";
      default: return "bg-gray-50 hover:bg-gray-100 border-gray-200";
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600";
      case "green": return "text-green-600";
      case "purple": return "text-purple-600";
      case "orange": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate("/driver/orders", { state: { highlightOrder: orderId } });
  };

  const completionRate = Math.round((todayStats.completedDeliveries / todayStats.totalDeliveries) * 100);
  const onTimeRate = Math.round((todayStats.onTimeDeliveries / todayStats.completedDeliveries) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 rounded-lg mb-6 shadow-sm">
        <div className="px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-700 font-semibold">
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 shadow-xl rounded-xl mb-6 border border-blue-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-200" />
              Dashboard Overview
            </h1>
            <p className="text-blue-100 font-medium text-lg">Good morning, {driverSession?.name || 'Driver'}! Ready for today's deliveries?</p>
          </div>
          <div className="bg-white/15 rounded-xl p-5 text-center border border-white/25 backdrop-blur-sm">
            <p className="text-xl font-bold text-white mb-1">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-blue-200 flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4" />
              Today
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-8">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-100">Total Earnings</p>
                    <p className="text-3xl font-bold text-white">RM{todayStats.earnings.toFixed(2)}</p>
                    <p className="text-xs text-emerald-200 font-medium mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5% from yesterday
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Today's Orders</p>
                    <p className="text-3xl font-bold text-white">{todayOrders.length}</p>
                    <p className="text-xs text-blue-200 font-medium mt-2 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {todayStats.pendingOrders} pending
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Distance Covered</p>
                    <p className="text-3xl font-bold text-white">{todayStats.distance} km</p>
                    <p className="text-xs text-purple-200 font-medium mt-2 flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Efficient routing
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">On-Time Rate</p>
                    <p className="text-3xl font-bold text-white">{onTimeRate}%</p>
                    <p className="text-xs text-orange-200 font-medium mt-2 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Excellent performance
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Orders Section */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Today's Orders ({todayOrders.length})
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/driver/orders")}
                  className="border-blue-300 hover:bg-blue-50 text-blue-600"
                >
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {todayOrders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className={`p-6 cursor-pointer transition-all duration-200 border-l-4 ${
                      order.priority === 'high' ? 'border-l-red-500 hover:bg-red-50' :
                      order.priority === 'medium' ? 'border-l-yellow-500 hover:bg-yellow-50' :
                      'border-l-green-500 hover:bg-green-50'
                    } ${index !== todayOrders.length - 1 ? 'border-b border-blue-100' : ''}`}
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border-2 ${getPriorityColor(order.priority)}`}>
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 text-lg">{order.customer}</h3>
                            <Badge className={`text-xs border-2 ${getStatusColor(order.status)}`}>
                              {order.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-600 font-medium mb-1">Order #{order.id}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                            <div className="flex items-center gap-1">
                              <PhoneCall className="h-4 w-4 text-blue-500" />
                              <span>{order.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4 text-blue-500" />
                              <span>{order.binType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">RM{order.amount.toFixed(2)}</p>
                        <p className="text-xs text-slate-500">{order.estimatedDuration}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-900">Pickup</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-1">{order.pickupAddress}</p>
                        <p className="text-xs text-blue-600 font-medium">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {order.pickupTime}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-900">Delivery</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-1">{order.deliveryAddress}</p>
                        <p className="text-xs text-green-600 font-medium">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {order.deliveryTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            order.priority === 'high' ? 'border-red-400 text-red-700 bg-red-50' :
                            order.priority === 'medium' ? 'border-yellow-400 text-yellow-700 bg-yellow-50' :
                            'border-green-400 text-green-700 bg-green-50'
                          }`}
                        >
                          {order.priority.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
              <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                <Target className="h-6 w-6 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-6 flex flex-col items-center gap-4 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' :
                      action.color === 'green' ? 'bg-green-50 hover:bg-green-100 border-green-200' :
                      action.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100 border-purple-200' :
                      'bg-orange-50 hover:bg-orange-100 border-orange-200'
                    }`}
                    onClick={action.action}
                  >
                    <div className="flex items-center justify-between w-full">
                      <action.icon className={`h-7 w-7 ${
                        action.color === 'blue' ? 'text-blue-600' :
                        action.color === 'green' ? 'text-green-600' :
                        action.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                      {action.count && (
                        <Badge className="bg-blue-500 border-0 text-white text-sm shadow-sm px-2 py-1">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-base">{action.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview and Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-700">Delivery Completion</span>
                    <span className="text-sm font-bold text-blue-600">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3 bg-blue-100" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-700">On-Time Performance</span>
                    <span className="text-sm font-bold text-blue-600">{onTimeRate}%</span>
                  </div>
                  <Progress value={onTimeRate} className="h-3 bg-blue-100" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-700">Customer Satisfaction</span>
                    <span className="text-sm font-bold text-blue-600">95%</span>
                  </div>
                  <Progress value={95} className="h-3 bg-blue-100" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentOrders.map((order, index) => (
                    <div 
                      key={order.id} 
                      className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                        index !== recentOrders.length - 1 ? 'border-b border-blue-100' : ''
                      }`}
                      onClick={() => navigate("/driver/orders")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getPriorityColor(order.priority)}`}>
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{order.customer}</p>
                            <p className="text-xs text-blue-600">{order.id}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs border ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span className="truncate max-w-40">{order.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-blue-500" />
                            <span>{order.time}</span>
                          </div>
                          <span className="font-semibold text-green-600">RM{order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t-2 border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                    onClick={() => navigate("/driver/orders")}
                  >
                    View All Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Driver Profile Summary */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
              <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                <User className="h-6 w-6 text-blue-600" />
                Driver Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-blue-200">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl">
                    {driverSession?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{driverSession?.name || 'Driver Name'}</h3>
                  <p className="text-base text-blue-600 mb-3">Professional Driver • ID: {driverSession?.driverId || 'N/A'}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-slate-700">4.8 Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-slate-700">156 Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-slate-700">98% On-Time</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/driver/profile")}
                  className="border-blue-300 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DriverDashboard;
