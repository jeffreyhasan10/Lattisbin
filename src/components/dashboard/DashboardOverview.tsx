import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Truck,
  DollarSign,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  BarChart3,
  Activity,
  Target,
  Download,
  Upload,
  Settings,
  MoreVertical,
  Bell,
  Star,
  ArrowUp,
  ArrowDown,
  Zap,
  Timer,
  TrendingDown,
  PhoneCall,
  Building,
  User
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import NotificationCenter from "./NotificationCenter";
import AddDriverModal from "./AddDriverModal";
import AddOrderModal from "./AddOrderModal";

const driverMetrics = [
  {
    id: "DRV001",
    name: "Ahmad Rahman",
    status: "Active",
    totalOrders: 45,
    completedOrders: 43,
    earnings: 2850,
    rating: 4.8,
    location: "Kuala Lumpur",
    lastActive: "2 minutes ago"
  },
  {
    id: "DRV002", 
    name: "Lim Wei Ming",
    status: "Active",
    totalOrders: 52,
    completedOrders: 50,
    earnings: 3200,
    rating: 4.9,
    location: "Selangor",
    lastActive: "5 minutes ago"
  },
  {
    id: "DRV003",
    name: "Raj Kumar",
    status: "Inactive",
    totalOrders: 28,
    completedOrders: 26,
    earnings: 1650,
    rating: 4.6,
    location: "Johor Bahru",
    lastActive: "2 hours ago"
  }
];

const recentOrders = [
  {
    id: "ORD001",
    customer: "ABC Construction Sdn Bhd",
    binType: "Construction Waste",
    driver: "Ahmad Rahman",
    status: "completed",
    amount: 350.00,
    date: "2024-01-15",
    location: "KLCC, KL",
    time: "08:30 AM",
    priority: "high"
  },
  {
    id: "ORD002",
    customer: "Green Valley Resort",
    binType: "Mixed Waste", 
    driver: "Lim Wei Ming",
    status: "in-progress",
    amount: 450.00,
    date: "2024-01-15",
    location: "Genting Highlands",
    time: "10:15 AM",
    priority: "medium"
  },
  {
    id: "ORD003",
    customer: "Sunshine Apartments",
    binType: "Recyclable",
    driver: "Raj Kumar",
    status: "pending",
    amount: 280.00,
    date: "2024-01-15",
    location: "Petaling Jaya",
    time: "02:30 PM",
    priority: "low"
  },
  {
    id: "ORD004",
    customer: "Tech Plaza Mall",
    binType: "Commercial Waste",
    driver: "Ahmad Rahman",
    status: "scheduled",
    amount: 520.00,
    date: "2024-01-15",
    location: "Mid Valley, KL",
    time: "04:00 PM",
    priority: "high"
  }
];

// Enhanced recent activities with more detail
const enhancedActivities = [
  {
    id: "ACT001",
    type: "order_completed",
    title: "Order Completed",
    description: "ABC Construction waste collection finished",
    customer: "ABC Construction Sdn Bhd",
    driver: "Ahmad Rahman",
    amount: 350.00,
    location: "KLCC, KL",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: "ACT002",
    type: "driver_assigned",
    title: "Driver Assigned",
    description: "New driver assigned to Green Valley route",
    customer: "Green Valley Resort",
    driver: "Lim Wei Ming",
    amount: 450.00,
    location: "Genting Highlands",
    time: "15 minutes ago",
    status: "info"
  },
  {
    id: "ACT003",
    type: "payment_received",
    title: "Payment Received",
    description: "Payment confirmed for Sunshine Apartments",
    customer: "Sunshine Apartments",
    driver: "Raj Kumar",
    amount: 280.00,
    location: "Petaling Jaya",
    time: "32 minutes ago",
    status: "success"
  },
  {
    id: "ACT004",
    type: "route_optimized",
    title: "Route Optimized",
    description: "Delivery route updated for efficiency",
    customer: "Tech Plaza Mall",
    driver: "Ahmad Rahman",
    amount: 520.00,
    location: "Mid Valley, KL",
    time: "1 hour ago",
    status: "info"
  },
  {
    id: "ACT005",
    type: "maintenance_alert",
    title: "Maintenance Alert",
    description: "Vehicle DRV003 requires scheduled maintenance",
    customer: null,
    driver: "Raj Kumar",
    amount: null,
    location: "Service Center",
    time: "2 hours ago",
    status: "warning"
  }
];

// Enhanced performance metrics with real-time data
const performanceMetrics = [
  {
    id: "completion_rate",
    title: "Order Completion Rate",
    value: 96.8,
    target: 95,
    trend: 2.3,
    isPositive: true,
    icon: CheckCircle,
    color: "green",
    description: "Orders completed successfully"
  },
  {
    id: "on_time_delivery",
    title: "On-Time Delivery Rate",
    value: 94.2,
    target: 90,
    trend: 1.8,
    isPositive: true,
    icon: Timer,
    color: "blue",
    description: "Deliveries completed on schedule"
  },
  {
    id: "customer_satisfaction",
    title: "Customer Satisfaction",
    value: 98.5,
    target: 95,
    trend: 0.8,
    isPositive: true,
    icon: Star,
    color: "purple",
    description: "Average customer rating"
  },
  {
    id: "revenue_growth",
    title: "Monthly Revenue Growth",
    value: 15.2,
    target: 12,
    trend: 3.1,
    isPositive: true,
    icon: TrendingUp,
    color: "orange",
    description: "Revenue increase vs last month"
  },
  {
    id: "efficiency_score",
    title: "Operational Efficiency",
    value: 87.4,
    target: 85,
    trend: -1.2,
    isPositive: false,
    icon: Zap,
    color: "indigo",
    description: "Overall operational efficiency"
  },
  {
    id: "fuel_savings",
    title: "Fuel Efficiency",
    value: 92.1,
    target: 88,
    trend: 4.2,
    isPositive: true,
    icon: Truck,
    color: "emerald",
    description: "Route optimization savings"
  }
];

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "scheduled": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Inactive": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order_completed": return CheckCircle;
      case "driver_assigned": return Users;
      case "payment_received": return DollarSign;
      case "route_optimized": return MapPin;
      case "maintenance_alert": return AlertCircle;
      default: return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50 border-green-200";
      case "info": return "text-blue-600 bg-blue-50 border-blue-200";
      case "warning": return "text-orange-600 bg-orange-50 border-orange-200";
      case "error": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getMetricColor = (color: string) => {
    const colors = {
      green: "from-emerald-500 to-emerald-600",
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      indigo: "from-indigo-500 to-indigo-600",
      emerald: "from-teal-500 to-teal-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const filteredDrivers = driverMetrics.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || driver.status.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || order.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} data...`);
    // Simulate export
    setTimeout(() => {
      toast.success(`${type} data exported successfully!`);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-driver":
        toast.info("Opening Add Driver form...");
        break;
      case "add-order":
        toast.info("Opening New Order form...");
        break;
      case "route-optimize":
        toast.success("Route optimization started...");
        break;
      case "send-notifications":
        toast.success("Notifications sent to all drivers!");
        break;
      default:
        toast.info("Action executed successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 lg:p-6">
      {/* Enhanced Mobile-Responsive Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-4 lg:p-6 mb-6 shadow-xl border border-blue-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-blue-200" />
              Dashboard Overview
            </h1>
            <p className="text-blue-100 text-sm lg:text-lg font-medium">
              Real-time business analytics and performance insights
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="bg-white/15 border-white/25 text-white hover:bg-white/25 backdrop-blur-sm text-xs lg:text-sm"
            >
              <CalendarIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">{format(selectedDate, "MMM dd, yyyy")}</span>
              <span className="sm:hidden">{format(selectedDate, "MMM dd")}</span>
            </Button>
            <NotificationCenter />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg text-xs lg:text-sm">
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Quick Actions</span>
                  <span className="sm:hidden">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleQuickAction("add-driver")}>
                  <User className="h-4 w-4 mr-2" />
                  Add Driver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction("add-order")}>
                  <Package className="h-4 w-4 mr-2" />
                  New Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction("route-optimize")}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Optimize Routes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction("send-notifications")}>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Calendar Popover */}
      {calendarOpen && (
        <Card className="absolute top-20 lg:top-24 right-4 lg:right-6 z-50 shadow-2xl border-2 border-blue-200 bg-white">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }
              }}
              className="pointer-events-auto"
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-transparent gap-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-xs lg:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="drivers"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-xs lg:text-sm"
            >
              Drivers
            </TabsTrigger>
            <TabsTrigger 
              value="orders"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-xs lg:text-sm"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-xs lg:text-sm"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Mobile-Responsive Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-emerald-100">Total Revenue</p>
                    <p className="text-xl lg:text-3xl font-bold text-white">RM 125,231</p>
                    <p className="text-xs text-emerald-200 font-medium mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +15.2% from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 lg:h-16 lg:w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-blue-100">Active Drivers</p>
                    <p className="text-xl lg:text-3xl font-bold text-white">{driverMetrics.filter(d => d.status === 'Active').length}</p>
                    <p className="text-xs text-blue-200 font-medium mt-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {driverMetrics.length} total drivers
                    </p>
                  </div>
                  <div className="h-12 w-12 lg:h-16 lg:w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-purple-100">Total Orders</p>
                    <p className="text-xl lg:text-3xl font-bold text-white">1,485</p>
                    <p className="text-xs text-purple-200 font-medium mt-2 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {recentOrders.filter(o => o.status === 'completed').length} completed today
                    </p>
                  </div>
                  <div className="h-12 w-12 lg:h-16 lg:w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-orange-100">Fleet Status</p>
                    <p className="text-xl lg:text-3xl font-bold text-white">24</p>
                    <p className="text-xs text-orange-200 font-medium mt-2 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Active vehicles
                    </p>
                  </div>
                  <div className="h-12 w-12 lg:h-16 lg:w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Truck className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Overview Cards with Mobile Responsiveness */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Enhanced Recent Activity */}
            <Card className="bg-white border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200 pb-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <CardTitle className="text-lg lg:text-xl flex items-center gap-3 font-bold text-gray-900">
                    <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <NotificationCenter />
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs">
                      <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                <div className="space-y-0">
                  {enhancedActivities.map((activity, index) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div 
                        key={activity.id} 
                        className={`p-3 lg:p-4 border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                          selectedActivity === activity.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        } ${index === enhancedActivities.length - 1 ? 'border-b-0' : ''}`}
                        onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          <div className={`p-2 lg:p-3 rounded-xl border-2 ${getActivityColor(activity.status)}`}>
                            <IconComponent className="h-4 w-4 lg:h-5 lg:w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 gap-1">
                              <p className="font-bold text-gray-900 text-sm">{activity.title}</p>
                              <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-xs text-gray-500">
                                {activity.customer && (
                                  <span className="font-medium truncate">{activity.customer}</span>
                                )}
                                {activity.driver && (
                                  <span className="text-blue-600">• {activity.driver}</span>
                                )}
                                <span className="text-gray-400">• {activity.location}</span>
                              </div>
                              {activity.amount && (
                                <span className="text-sm font-bold text-green-600">
                                  RM {activity.amount.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {selectedActivity === activity.id && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="font-semibold text-gray-700">Activity ID:</span>
                                    <span className="ml-2 text-blue-600">{activity.id}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-gray-700">Status:</span>
                                    <Badge className={`ml-2 text-xs ${getStatusColor(activity.status)}`}>
                                      {activity.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Performance Metrics */}
            <Card className="bg-white border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200 pb-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <CardTitle className="text-lg lg:text-xl flex items-center gap-3 font-bold text-gray-900">
                    <Target className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs">
                    <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Detailed View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-96 overflow-y-auto">
                {performanceMetrics.map((metric) => {
                  const IconComponent = metric.icon;
                  return (
                    <div key={metric.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${getMetricColor(metric.color)} text-white`}>
                            <IconComponent className="h-3 w-3 lg:h-4 lg:w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs lg:text-sm font-semibold text-gray-700 block truncate">{metric.title}</span>
                            <p className="text-xs text-gray-500 truncate">{metric.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-base lg:text-lg font-bold text-gray-900">{metric.value}%</span>
                            <div className={`flex items-center text-xs font-medium ${
                              metric.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {metric.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              {Math.abs(metric.trend)}%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Target: {metric.target}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress 
                          value={metric.value} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span className="font-medium">Target: {metric.target}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          {/* Enhanced Mobile-Responsive Search and Controls */}
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="flex-1 w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 lg:h-5 lg:w-5" />
                    <Input
                      placeholder="Search drivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 lg:h-12 border-gray-200 focus:border-blue-500 text-sm lg:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 h-10 lg:h-12 px-3 lg:px-6 text-xs lg:text-sm">
                        <Filter className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterType("all")}>All Drivers</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("active")}>Active Only</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("inactive")}>Inactive Only</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    className="border-green-300 text-green-600 hover:bg-green-50 h-10 lg:h-12 px-3 lg:px-6 text-xs lg:text-sm"
                    onClick={() => handleExport("drivers")}
                  >
                    <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Export
                  </Button>
                  <AddDriverModal />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Responsive Drivers Table */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200 pb-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <CardTitle className="text-lg lg:text-xl flex items-center gap-3 font-bold text-gray-900">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                  Driver Management ({filteredDrivers.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 text-xs">
                    <Settings className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="space-y-4 p-4">
                  {filteredDrivers.map((driver) => (
                    <Card key={driver.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-base">{driver.name}</p>
                              <p className="text-sm text-blue-600 font-medium">{driver.id}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(driver.status)} border font-medium`}>
                            {driver.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Orders:</span>
                            <p className="font-semibold">{driver.completedOrders}/{driver.totalOrders}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Earnings:</span>
                            <p className="font-bold text-green-600">RM {driver.earnings.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rating:</span>
                            <p className="font-semibold">{driver.rating} ⭐</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p className="font-semibold truncate">{driver.location}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-blue-300 text-blue-600"
                            onClick={() => setSelectedDriver(driver)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="border-green-300 text-green-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                      <TableHead className="font-bold text-gray-900 text-left p-4">Driver Details</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Status</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Performance</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Earnings</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Rating</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Location</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver, index) => (
                      <TableRow key={driver.id} className={`hover:bg-blue-50 transition-colors border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-base">{driver.name}</p>
                              <p className="text-sm text-blue-600 font-medium">{driver.id}</p>
                              <p className="text-xs text-gray-500">{driver.lastActive}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge className={`${getStatusColor(driver.status)} border font-medium px-3 py-1`}>
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-700">{driver.completedOrders}/{driver.totalOrders}</span>
                              <span className="text-xs text-gray-500">orders</span>
                            </div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${(driver.completedOrders / driver.totalOrders) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-lg font-bold text-green-600">RM {driver.earnings.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">this month</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">{driver.rating}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < Math.floor(driver.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">{driver.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => setSelectedDriver(driver)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-600 hover:bg-green-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {/* Enhanced Mobile-Responsive Search and Controls */}
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="flex-1 w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 lg:h-5 lg:w-5" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 lg:h-12 border-gray-200 focus:border-blue-500 text-sm lg:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 h-10 lg:h-12 px-3 lg:px-6 text-xs lg:text-sm">
                        <Filter className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterType("all")}>All Orders</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("completed")}>Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("in-progress")}>In Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("pending")}>Pending</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    className="border-green-300 text-green-600 hover:bg-green-50 h-10 lg:h-12 px-3 lg:px-6 text-xs lg:text-sm"
                    onClick={() => handleExport("orders")}
                  >
                    <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Export
                  </Button>
                  <AddOrderModal />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Responsive Orders Table */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200 pb-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <CardTitle className="text-lg lg:text-xl flex items-center gap-3 font-bold text-gray-900">
                  <Package className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                  Order Management ({filteredOrders.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 text-xs">
                    <Settings className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="space-y-4 p-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                              <Package className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-blue-600 text-base">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <p className="font-bold text-gray-900 text-base mb-1">{order.customer}</p>
                          <p className="text-sm text-gray-600 mb-2">{order.binType}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <User className="h-4 w-4" />
                            <span>{order.driver}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{order.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-green-600">RM {order.amount.toFixed(2)}</p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-300 text-blue-600"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                      <TableHead className="font-bold text-gray-900 text-left p-4">Order Details</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Customer</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Service</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Driver</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Status</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Amount</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Location</TableHead>
                      <TableHead className="font-bold text-gray-900 text-left p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => (
                      <TableRow key={order.id} className={`hover:bg-blue-50 transition-colors border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                              <Package className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-blue-600 text-base">{order.id}</p>
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="font-bold text-gray-900 text-base">{order.customer}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">{order.binType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-sm font-medium text-gray-700">{order.driver}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-lg font-bold text-green-600">RM {order.amount.toFixed(2)}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-700">{order.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-600 hover:bg-green-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-lg lg:text-xl flex items-center gap-3 font-bold text-gray-900">
                  <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 lg:p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-emerald-900 text-sm lg:text-base">Monthly Growth</h3>
                      <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-600" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-800">+28.5%</p>
                    <p className="text-xs lg:text-sm text-emerald-600 font-medium">vs last month</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 lg:p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-blue-900 text-sm lg:text-base">Total Revenue</h3>
                      <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-blue-800">RM 125,231</p>
                    <p className="text-xs lg:text-sm text-blue-600 font-medium">this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-lg lg:text-xl flex items-center gap-3 font-bold text-gray-900">
                  <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                  Operational Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 lg:p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-purple-900 text-sm lg:text-base">Order Volume</h3>
                      <Package className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-purple-800">1,485</p>
                    <p className="text-xs lg:text-sm text-purple-600 font-medium">this month</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 lg:p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-orange-900 text-sm lg:text-base">Efficiency Rate</h3>
                      <Target className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-orange-800">96.8%</p>
                    <p className="text-xs lg:text-sm text-orange-600 font-medium">average performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Driver Details - {selectedDriver.name}
              </DialogTitle>
              <DialogDescription>
                Complete information about the selected driver
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{selectedDriver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium">{selectedDriver.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <Badge className={`${getStatusColor(selectedDriver.status)}`}>
                        {selectedDriver.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{selectedDriver.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Active:</span>
                      <span className="font-medium">{selectedDriver.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Orders:</span>
                      <span className="font-medium">{selectedDriver.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed:</span>
                      <span className="font-medium">{selectedDriver.completedOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Success Rate:</span>
                      <span className="font-medium">
                        {Math.round((selectedDriver.completedOrders / selectedDriver.totalOrders) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="font-medium">{selectedDriver.rating} ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Earnings:</span>
                      <span className="font-bold text-green-600">RM {selectedDriver.earnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Order Details - {selectedOrder.id}
              </DialogTitle>
              <DialogDescription>
                Complete information about the selected order
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <Badge className={`${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Priority:</span>
                      <span className="font-medium capitalize">{selectedOrder.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-bold text-green-600">RM {selectedOrder.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer:</span>
                      <span className="font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bin Type:</span>
                      <span className="font-medium">{selectedOrder.binType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Driver:</span>
                      <span className="font-medium">{selectedOrder.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{selectedOrder.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time:</span>
                      <span className="font-medium">{selectedOrder.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardOverview;
