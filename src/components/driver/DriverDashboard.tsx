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
    totalOrders: 6
  };

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
      count: 3,
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
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200";
      case "medium": return "bg-yellow-50 border-yellow-200";
      case "low": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
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

  const completionRate = Math.round((todayStats.completedDeliveries / todayStats.totalDeliveries) * 100);
  const onTimeRate = Math.round((todayStats.onTimeDeliveries / todayStats.completedDeliveries) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-blue-200" />
              Dashboard Overview
            </h1>
            <p className="text-blue-100 font-medium">Good morning, {driverSession?.name || 'Driver'}! Here's your daily summary.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20 backdrop-blur-sm">
            <p className="text-lg font-bold text-white mb-1">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-blue-200 flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              Today
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">RM{todayStats.earnings.toFixed(2)}</p>
                    <p className="text-xs text-green-200 font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5% from yesterday
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Completed Orders</p>
                    <p className="text-2xl font-bold text-white">{todayStats.completedDeliveries}/{todayStats.totalOrders}</p>
                    <p className="text-xs text-blue-200 font-medium mt-1 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {completionRate}% completion rate
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Distance Covered</p>
                    <p className="text-2xl font-bold text-white">{todayStats.distance} km</p>
                    <p className="text-xs text-purple-200 font-medium mt-1 flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Efficient routing
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">On-Time Rate</p>
                    <p className="text-2xl font-bold text-white">{onTimeRate}%</p>
                    <p className="text-xs text-orange-200 font-medium mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Excellent performance
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white border border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="text-lg flex items-center gap-3 font-bold text-blue-900">
                <Target className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center gap-3 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${getActionColor(action.color)}`}
                    onClick={action.action}
                  >
                    <div className="flex items-center justify-between w-full">
                      <action.icon className={`h-6 w-6 ${getIconColor(action.color)}`} />
                      {action.count && (
                        <Badge className="bg-blue-500 border-0 text-white text-xs shadow-sm">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-900 text-sm">{action.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <CardTitle className="text-lg flex items-center gap-3 font-bold text-blue-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Delivery Completion</span>
                    <span className="text-sm font-bold text-blue-600">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3 bg-blue-100" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">On-Time Performance</span>
                    <span className="text-sm font-bold text-blue-600">{onTimeRate}%</span>
                  </div>
                  <Progress value={onTimeRate} className="h-3 bg-blue-100" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Customer Satisfaction</span>
                    <span className="text-sm font-bold text-blue-600">95%</span>
                  </div>
                  <Progress value={95} className="h-3 bg-blue-100" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-white border border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <CardTitle className="text-lg flex items-center gap-3 font-bold text-blue-900">
                  <FileText className="h-5 w-5 text-blue-600" />
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
                <div className="p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
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
          <Card className="bg-white border border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="text-lg flex items-center gap-3 font-bold text-blue-900">
                <User className="h-5 w-5 text-blue-600" />
                Driver Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-blue-200">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                    {driverSession?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{driverSession?.name || 'Driver Name'}</h3>
                  <p className="text-sm text-blue-600 mb-2">Professional Driver • ID: {driverSession?.driverId || 'N/A'}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-slate-700">4.8 Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-slate-700">156 Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-slate-700">98% On-Time</span>
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
