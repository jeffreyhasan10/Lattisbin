
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Target
} from "lucide-react";
import { format } from "date-fns";

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
    location: "KLCC, KL"
  },
  {
    id: "ORD002",
    customer: "Green Valley Resort",
    binType: "Mixed Waste", 
    driver: "Lim Wei Ming",
    status: "in-progress",
    amount: 450.00,
    date: "2024-01-15",
    location: "Genting Highlands"
  },
  {
    id: "ORD003",
    customer: "Sunshine Apartments",
    binType: "Recyclable",
    driver: "Raj Kumar",
    status: "pending",
    amount: 280.00,
    date: "2024-01-15",
    location: "Petaling Jaya"
  }
];

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Inactive": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredDrivers = driverMetrics.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = recentOrders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <BarChart3 className="h-10 w-10 text-blue-600" />
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Monitor your business operations and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "MMM dd, yyyy")}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Calendar Popover */}
      {calendarOpen && (
        <Card className="absolute top-24 right-6 z-50 shadow-xl border-2 border-blue-200">
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
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">RM 45,231</p>
                    <p className="text-xs text-blue-200 font-medium mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5% from last month
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Active Drivers</p>
                    <p className="text-3xl font-bold text-white">{driverMetrics.filter(d => d.status === 'Active').length}</p>
                    <p className="text-xs text-green-200 font-medium mt-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {driverMetrics.length} total drivers
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Total Orders</p>
                    <p className="text-3xl font-bold text-white">125</p>
                    <p className="text-xs text-purple-200 font-medium mt-2 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {recentOrders.filter(o => o.status === 'completed').length} completed
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Package className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">Fleet Status</p>
                    <p className="text-3xl font-bold text-white">18</p>
                    <p className="text-xs text-orange-200 font-medium mt-2 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Active vehicles
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Truck className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.binType}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <Target className="h-6 w-6 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Completion Rate</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Average Rating</span>
                    <span className="font-bold text-blue-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">On-Time Delivery</span>
                    <span className="font-bold text-purple-600">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Customer Satisfaction</span>
                    <span className="font-bold text-orange-600">96%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search drivers by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-blue-300 text-blue-600">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drivers List */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
              <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                <Users className="h-6 w-6 text-blue-600" />
                Driver Management ({filteredDrivers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-blue-900">Driver</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Status</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Orders</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Earnings</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Rating</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Location</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver, index) => (
                      <tr key={driver.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900">{driver.name}</p>
                            <p className="text-sm text-blue-600">{driver.id}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(driver.status)} border`}>
                            {driver.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{driver.completedOrders}/{driver.totalOrders}</p>
                            <p className="text-sm text-gray-600">completed</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-green-600">RM {driver.earnings.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{driver.rating}</span>
                            <span className="text-yellow-500">⭐</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{driver.location}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders by customer or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-blue-300 text-blue-600">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
              <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                <Package className="h-6 w-6 text-blue-600" />
                Order Management ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-blue-900">Order ID</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Customer</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Bin Type</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Driver</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Status</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Amount</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Location</th>
                      <th className="text-left p-4 font-semibold text-blue-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={order.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4">
                          <p className="font-semibold text-blue-600">{order.id}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-900">{order.customer}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-700">{order.binType}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-700">{order.driver}</p>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-green-600">RM {order.amount.toFixed(2)}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{order.location}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
              <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-900">Revenue Growth</h3>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-800">+25.3%</p>
                  <p className="text-sm text-blue-600">vs last month</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-900">Order Volume</h3>
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-800">1,247</p>
                  <p className="text-sm text-green-600">this month</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-purple-900">Driver Efficiency</h3>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-800">94.2%</p>
                  <p className="text-sm text-purple-600">average rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
