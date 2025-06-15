
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
  Route,
  Fuel,
  Timer,
  Award,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import DriverCalendar from "./DriverCalendar";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverSession, setDriverSession] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (session) {
      setDriverSession(JSON.parse(session));
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Animation trigger on mount
    setTimeout(() => setIsAnimating(true), 100);

    return () => clearInterval(timer);
  }, []);

  // Enhanced mock data with more realistic values
  const todayStats = {
    totalDeliveries: 12,
    completedDeliveries: 8,
    earnings: 1850.00,
    distance: 156.7,
    onTimeDeliveries: 7,
    totalOrders: 9,
    pendingOrders: 4,
    fuelEfficiency: 12.5,
    customerRating: 4.9
  };

  // Enhanced today's orders with more details
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
      amount: 450.00,
      estimatedDuration: "1.5 hrs",
      distance: "12.5 km",
      weight: "2.5 tons"
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
      amount: 675.00,
      estimatedDuration: "2.5 hrs",
      distance: "28.3 km",
      weight: "3.2 tons"
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
      amount: 320.00,
      estimatedDuration: "1.5 hrs",
      distance: "8.7 km",
      weight: "1.8 tons"
    }
  ];

  const recentOrders = [
    {
      id: "JOB001",
      customer: "ABC Construction",
      location: "Jalan Ampang, KL",
      time: "09:30 AM",
      status: "completed",
      amount: 450.00,
      priority: "high",
      rating: 5
    },
    {
      id: "JOB002",
      customer: "Green Valley Resort",
      location: "Genting Highlands",
      time: "11:00 AM",
      status: "in-progress",
      amount: 675.00,
      priority: "medium",
      rating: null
    },
    {
      id: "JOB003",
      customer: "Sunshine Apartments",
      location: "Petaling Jaya",
      time: "02:30 PM",
      status: "pending",
      amount: 320.00,
      priority: "low",
      rating: null
    }
  ];

  const quickActions = [
    {
      title: "View Orders",
      description: "Check pending deliveries",
      icon: FileText,
      action: () => {
        toast.success("Navigating to orders...");
        navigate("/driver/orders");
      },
      count: todayStats.pendingOrders,
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Select Lorry",
      description: "Choose your vehicle",
      icon: Truck,
      action: () => {
        toast.success("Opening lorry selection...");
        navigate("/driver/lorries");
      },
      count: null,
      color: "green",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Track Payments",
      description: "View earnings",
      icon: DollarSign,
      action: () => {
        toast.success("Opening payment tracking...");
        navigate("/driver/payments");
      },
      count: null,
      color: "purple",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: "Navigation",
      description: "Get directions",
      icon: Navigation,
      action: () => {
        toast.success("Opening GPS navigation...");
        // Simulate opening navigation
        setTimeout(() => {
          toast.success("Navigation system activated!");
        }, 1500);
      },
      count: null,
      color: "orange",
      gradient: "from-orange-500 to-red-500"
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

  const handleOrderClick = (orderId: string) => {
    toast.success(`Opening order ${orderId}...`);
    navigate("/driver/orders", { state: { highlightOrder: orderId } });
  };

  const handleQuickNavigation = (orderId: string) => {
    toast.success(`Starting navigation for order ${orderId}...`);
    // Simulate GPS activation
    setTimeout(() => {
      toast.success("GPS route calculated! Following optimal path.");
    }, 2000);
  };

  const completionRate = Math.round((todayStats.completedDeliveries / todayStats.totalDeliveries) * 100);
  const onTimeRate = Math.round((todayStats.onTimeDeliveries / todayStats.completedDeliveries) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 rounded-xl mb-6 shadow-lg">
        <div className="px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-700 font-bold text-lg">
                  🏠 Dashboard Overview
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Enhanced Header with glassmorphism */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 shadow-2xl rounded-2xl mb-8 border border-blue-300 overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className={`transform transition-all duration-1000 ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                <BarChart3 className="h-10 w-10 text-blue-200" />
              </div>
              Dashboard Control Center
            </h1>
            <p className="text-blue-100 font-medium text-xl mb-2">
              Welcome back, <span className="font-bold text-white">{driverSession?.name || 'Professional Driver'}</span>! 
            </p>
            <p className="text-blue-200 text-lg">Ready to conquer today's deliveries? 🚛💨</p>
          </div>
          <div className={`bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transform transition-all duration-1000 delay-300 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <p className="text-2xl font-bold text-white mb-2">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-blue-200 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-blue-300">
              <Clock className="h-3 w-3" />
              <span>{currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-8">
          {/* Enhanced Stats Cards with animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 text-white transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-200 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>+15.2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-emerald-100 font-medium text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-white mb-2">RM{todayStats.earnings.toFixed(2)}</p>
                  <div className="flex items-center gap-2 text-emerald-200 text-xs">
                    <Zap className="h-3 w-3" />
                    <span>Excellent performance today!</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 text-white transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 font-bold">
                    {todayStats.pendingOrders} pending
                  </Badge>
                </div>
                <div>
                  <p className="text-blue-100 font-medium text-sm mb-1">Today's Orders</p>
                  <p className="text-3xl font-bold text-white mb-2">{todayOrders.length}</p>
                  <div className="flex items-center gap-2 text-blue-200 text-xs">
                    <Target className="h-3 w-3" />
                    <span>Active deliveries in progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 text-white transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Route className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-purple-200 text-sm">
                      <Fuel className="h-4 w-4" />
                      <span>{todayStats.fuelEfficiency}L/100km</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-purple-100 font-medium text-sm mb-1">Distance Covered</p>
                  <p className="text-3xl font-bold text-white mb-2">{todayStats.distance} km</p>
                  <div className="flex items-center gap-2 text-purple-200 text-xs">
                    <Activity className="h-3 w-3" />
                    <span>Efficient routing today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 text-white transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-orange-200">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{todayStats.customerRating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-orange-100 font-medium text-sm mb-1">On-Time Rate</p>
                  <p className="text-3xl font-bold text-white mb-2">{onTimeRate}%</p>
                  <div className="flex items-center gap-2 text-orange-200 text-xs">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Outstanding reliability!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Component */}
          <DriverCalendar />

          {/* Enhanced Today's Orders Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-3 font-bold text-blue-900">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Today's Priority Orders ({todayOrders.length})
                </CardTitle>
                <Button 
                  onClick={() => navigate("/driver/orders")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
                    className={`p-6 cursor-pointer transition-all duration-300 border-l-4 hover:shadow-lg transform hover:-translate-y-1 ${
                      order.priority === 'high' ? 'border-l-red-500 hover:bg-red-50' :
                      order.priority === 'medium' ? 'border-l-yellow-500 hover:bg-yellow-50' :
                      'border-l-green-500 hover:bg-green-50'
                    } ${index !== todayOrders.length - 1 ? 'border-b border-blue-100' : ''}`}
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl border-2 ${getPriorityColor(order.priority)} shadow-sm`}>
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-bold text-slate-900 text-xl">{order.customer}</h3>
                            <Badge className={`text-xs border-2 font-bold ${getStatusColor(order.status)}`}>
                              {order.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-bold ${
                                order.priority === 'high' ? 'border-red-400 text-red-700 bg-red-50' :
                                order.priority === 'medium' ? 'border-yellow-400 text-yellow-700 bg-yellow-50' :
                                'border-green-400 text-green-700 bg-green-50'
                              }`}
                            >
                              {order.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-600 font-bold mb-2">Order #{order.id}</p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-2">
                              <PhoneCall className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{order.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{order.binType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Route className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{order.distance}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{order.weight}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600 mb-1">RM{order.amount.toFixed(2)}</p>
                        <p className="text-sm text-slate-500 font-medium">{order.estimatedDuration}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-bold text-blue-900">PICKUP LOCATION</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2 font-medium">{order.pickupAddress}</p>
                        <p className="text-sm text-blue-600 font-bold flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {order.pickupTime}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-xl border-2 border-green-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-bold text-green-900">DELIVERY LOCATION</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2 font-medium">{order.deliveryAddress}</p>
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {order.deliveryTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-2 border-blue-300 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-2 border-green-300 hover:bg-green-50 text-green-600 hover:text-green-700 font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickNavigation(order.id);
                          }}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
              <CardTitle className="text-2xl flex items-center gap-3 font-bold text-blue-900">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                Quick Actions & Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-8 flex flex-col items-center gap-6 border-3 transition-all duration-500 hover:shadow-2xl hover:scale-110 transform bg-gradient-to-br ${action.gradient} text-white border-0 shadow-lg relative overflow-hidden group`}
                    onClick={action.action}
                  >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between w-full mb-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                          <action.icon className="h-8 w-8 text-white" />
                        </div>
                        {action.count && (
                          <Badge className="bg-white/20 border-white/30 text-white font-bold text-lg px-3 py-1 shadow-lg">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-white text-xl mb-2">{action.title}</p>
                        <p className="text-sm text-white/80 font-medium">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Performance Overview and Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-100 border-b-2 border-purple-200">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-purple-900">
                  <div className="p-2 bg-purple-500 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Delivery Completion
                    </span>
                    <span className="text-lg font-bol text-blue-600">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-4 bg-blue-100" />
                  <p className="text-xs text-slate-500 mt-2">8 out of 12 deliveries completed today</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      On-Time Performance
                    </span>
                    <span className="text-lg font-bold text-blue-600">{onTimeRate}%</span>
                  </div>
                  <Progress value={onTimeRate} className="h-4 bg-blue-100" />
                  <p className="text-xs text-slate-500 mt-2">7 out of 8 deliveries on time</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Customer Satisfaction
                    </span>
                    <span className="text-lg font-bold text-blue-600">98%</span>
                  </div>
                  <Progress value={98} className="h-4 bg-blue-100" />
                  <p className="text-xs text-slate-500 mt-2">Excellent customer feedback</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 border-b-2 border-green-200">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-green-900">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentOrders.map((order, index) => (
                    <div 
                      key={order.id} 
                      className={`p-6 cursor-pointer hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        index !== recentOrders.length - 1 ? 'border-b border-blue-100' : ''
                      }`}
                      onClick={() => navigate("/driver/orders")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl border-2 ${getPriorityColor(order.priority)} shadow-sm`}>
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{order.customer}</p>
                            <p className="text-sm text-blue-600 font-medium">{order.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`text-xs border-2 font-bold ${getStatusColor(order.status)}`}>
                            {order.status.replace('-', ' ')}
                          </Badge>
                          {order.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-bold text-yellow-600">{order.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="truncate max-w-48 font-medium">{order.location}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{order.time}</span>
                          </div>
                          <span className="font-bold text-emerald-600 text-base">RM{order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t-2 border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-100 font-bold text-base"
                    onClick={() => navigate("/driver/orders")}
                  >
                    View Complete Order History
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Driver Profile Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-100 border-b-2 border-blue-200">
              <CardTitle className="text-2xl flex items-center gap-3 font-bold text-blue-900">
                <div className="p-2 bg-indigo-500 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                Driver Profile & Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center gap-8">
                <Avatar className="h-24 w-24 border-4 border-blue-300 shadow-xl">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-2xl">
                    {driverSession?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{driverSession?.name || 'Professional Driver'}</h3>
                  <p className="text-lg text-blue-600 mb-4 font-medium">Elite Driver • ID: {driverSession?.driverId || 'DRV001'}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <div>
                        <span className="font-bold text-slate-700 block">{todayStats.customerRating} Rating</span>
                        <span className="text-xs text-slate-500">Customer Score</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
                      <Truck className="h-5 w-5 text-green-500" />
                      <div>
                        <span className="font-bold text-slate-700 block">187 Completed</span>
                        <span className="text-xs text-slate-500">Total Deliveries</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <span className="font-bold text-slate-700 block">{onTimeRate}% On-Time</span>
                        <span className="text-xs text-slate-500">Reliability Rate</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <Award className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="font-bold text-slate-700 block">Elite Status</span>
                        <span className="text-xs text-slate-500">Driver Tier</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    toast.success("Opening driver profile...");
                    navigate("/driver/profile");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Full Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
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
