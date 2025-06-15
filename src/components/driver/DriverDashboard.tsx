
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Navigation,
  Fuel,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Trophy,
  Timer,
  Route,
  Truck,
  Activity,
  BarChart3,
  Users,
  Award,
  Phone,
  MessageSquare,
  Bell,
  Settings,
  Battery,
  Signal,
  Wifi
} from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/contexts/NavigationProvider";
import RouteOptimizer from "./RouteOptimizer";

// Mock data for enhanced dashboard
const mockStats = {
  todayOrders: 8,
  completedOrders: 6,
  pendingOrders: 2,
  totalEarnings: 425.50,
  todayDistance: 142.8,
  fuelEfficiency: 8.2,
  averageRating: 4.8,
  onTimeDeliveries: 94
};

const mockRecentOrders = [
  {
    id: "ORD-2024-001",
    customer: "Tech Plaza Mall",
    location: "Cyberjaya, Selangor",
    time: "2:30 PM",
    status: "completed",
    amount: 85.00,
    rating: 5,
    wasteType: "Electronic Waste"
  },
  {
    id: "ORD-2024-002", 
    customer: "Green Valley Resort",
    location: "Mont Kiara, KL",
    time: "4:15 PM",
    status: "in-progress",
    amount: 120.00,
    wasteType: "General Waste"
  },
  {
    id: "ORD-2024-003",
    customer: "Sunrise Apartments",
    location: "Petaling Jaya",
    time: "6:00 PM",  
    status: "pending",
    amount: 65.50,
    wasteType: "Household Waste"
  }
];

const mockRouteStops = [
  {
    id: "stop1",
    address: "KLCC Twin Towers, Kuala Lumpur",
    coordinates: { lat: 3.1578, lng: 101.7123 },
    estimatedDuration: 25,
    priority: "high",
    timeWindow: { start: "2:00 PM", end: "3:00 PM" },
    notes: "Large office complex - use service elevator"
  },
  {
    id: "stop2", 
    address: "Pavilion Shopping Centre, Bukit Bintang",
    coordinates: { lat: 3.1492, lng: 101.7133 },
    estimatedDuration: 35,
    priority: "medium",
    timeWindow: { start: "3:30 PM", end: "4:30 PM" },
    notes: "Peak hour traffic expected"
  },
  {
    id: "stop3",
    address: "Mid Valley Megamall, KL",
    coordinates: { lat: 3.1177, lng: 101.6774 },
    estimatedDuration: 40,
    priority: "high",
    timeWindow: { start: "5:00 PM", end: "6:00 PM" },
    notes: "Multiple collection points"
  }
];

const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Assigned",
    message: "ORD-2024-004 at Bangsar Shopping Centre",
    time: "5 mins ago",
    isRead: false
  },
  {
    id: 2,
    type: "system",
    title: "Route Optimized",
    message: "Your route has been updated to save 15 minutes",
    time: "12 mins ago", 
    isRead: false
  },
  {
    id: 3,
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "Completed 50 orders this month",
    time: "1 hour ago",
    isRead: true
  }
];

const DriverDashboard = () => {
  const { navigationState, startTracking, stopTracking } = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [optimizedRoute, setOptimizedRoute] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRouteOptimized = (route) => {
    setOptimizedRoute(route);
  };

  const handleNavigationStart = (route) => {
    toast.success("Navigation started for optimized route");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in-progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order": return <Package className="h-4 w-4 text-blue-600" />;
      case "system": return <Settings className="h-4 w-4 text-green-600" />;
      case "achievement": return <Trophy className="h-4 w-4 text-yellow-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 lg:p-6">
      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl mb-4 shadow-sm">
        <div className="px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  Driver Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Enhanced Header Card */}
      <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 border-0 shadow-xl mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-white/10 text-white text-lg font-bold">
                  AR
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold mb-1">Welcome back, Ahmad!</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Currently in Kuala Lumpur
                </p>
                <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg px-2 py-1">
                  <Signal className="h-4 w-4 text-green-400" />
                  <span className="text-xs">GPS</span>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg px-2 py-1">
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-xs">Online</span>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg px-2 py-1">
                  <Battery className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs">85%</span>
                </div>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.todayOrders}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs yesterday
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Earnings</p>
                <p className="text-2xl font-bold text-emerald-600">RM {mockStats.totalEarnings}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% this week
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Distance</p>
                <p className="text-2xl font-bold text-indigo-600">{mockStats.todayDistance}km</p>
                <p className="text-xs text-gray-500 mt-1">Fuel: {mockStats.fuelEfficiency}L/100km</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Navigation className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <p className="text-2xl font-bold text-yellow-600 flex items-center gap-1">
                  {mockStats.averageRating}
                  <Star className="h-5 w-5 fill-current" />
                </p>
                <p className="text-xs text-yellow-600 mt-1">{mockStats.onTimeDeliveries}% on time</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                Recent Orders
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {mockRecentOrders.length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{order.customer}</h4>
                      <Badge className={`${getStatusColor(order.status)} border font-medium text-xs`}>
                        {order.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {order.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {order.wasteType}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">RM {order.amount.toFixed(2)}</p>
                    {order.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(order.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                Notifications
                <Badge className="bg-red-500 text-white">
                  {mockNotifications.filter(n => !n.isRead).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg border transition-colors ${
                  !notification.isRead ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-900">{notification.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Dispatch
              </Button>
              <Button variant="outline" className="w-full justify-start border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Route Optimizer Section */}
      <RouteOptimizer 
        stops={mockRouteStops}
        onRouteOptimized={handleRouteOptimized}
        onNavigationStart={handleNavigationStart}
      />

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Orders Completed</span>
                  <span className="font-medium">32/35</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-Time Delivery</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Rating</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <h4 className="font-medium text-gray-900">Top Performer</h4>
                <p className="text-sm text-gray-600">50+ orders this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <h4 className="font-medium text-gray-900">Perfect Week</h4>
                <p className="text-sm text-gray-600">100% on-time deliveries</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Customer Favorite</h4>
                <p className="text-sm text-gray-600">4.9/5 average rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
