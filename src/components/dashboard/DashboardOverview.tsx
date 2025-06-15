
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MoreVertical
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 mb-6 shadow-xl border border-blue-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-200" />
              Dashboard Overview
            </h1>
            <p className="text-blue-100 text-lg font-medium">
              Comprehensive business analytics and management center
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="bg-white/15 border-white/25 text-white hover:bg-white/25 backdrop-blur-sm"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {format(selectedDate, "MMM dd, yyyy")}
            </Button>
            <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Quick Actions
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Popover */}
      {calendarOpen && (
        <Card className="absolute top-24 right-6 z-50 shadow-2xl border-2 border-blue-200 bg-white">
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
        <div className="bg-white rounded-xl p-2 shadow-lg border border-blue-200">
          <TabsList className="grid w-full grid-cols-4 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="drivers"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold"
            >
              Drivers
            </TabsTrigger>
            <TabsTrigger 
              value="orders"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Professional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-100">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">RM 125,231</p>
                    <p className="text-xs text-emerald-200 font-medium mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +15.2% from last month
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Active Drivers</p>
                    <p className="text-3xl font-bold text-white">{driverMetrics.filter(d => d.status === 'Active').length}</p>
                    <p className="text-xs text-blue-200 font-medium mt-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {driverMetrics.length} total drivers
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Total Orders</p>
                    <p className="text-3xl font-bold text-white">1,485</p>
                    <p className="text-xs text-purple-200 font-medium mt-2 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {recentOrders.filter(o => o.status === 'completed').length} completed today
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">Fleet Status</p>
                    <p className="text-3xl font-bold text-white">24</p>
                    <p className="text-xs text-orange-200 font-medium mt-2 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Active vehicles
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                    <Activity className="h-6 w-6 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.binType}</p>
                          <p className="text-xs text-blue-600 font-medium">{order.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                          {order.status}
                        </Badge>
                        <p className="text-sm font-bold text-green-600 mt-1">RM {order.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                    <Target className="h-6 w-6 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-700">Completion Rate</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">On-Time Delivery</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-gray-700">Customer Satisfaction</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-gray-700">Revenue Growth</span>
                    </div>
                    <span className="text-xl font-bold text-orange-600">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          {/* Professional Search and Controls */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search drivers by name, ID, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-blue-200 focus:border-blue-500 text-base"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 h-12 px-6">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 h-12 px-6">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Driver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Drivers Table */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <Users className="h-6 w-6 text-blue-600" />
                  Driver Management ({filteredDrivers.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 border-b-2 border-blue-200">
                    <TableHead className="font-bold text-blue-900 text-left p-4">Driver Details</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Status</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Performance</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Earnings</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Rating</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Location</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Actions</TableHead>
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
                          <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {/* Professional Search and Controls */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search orders by customer, ID, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-blue-200 focus:border-blue-500 text-base"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 h-12 px-6">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 h-12 px-6">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Orders Table */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <Package className="h-6 w-6 text-blue-600" />
                  Order Management ({filteredOrders.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 border-b-2 border-blue-200">
                    <TableHead className="font-bold text-blue-900 text-left p-4">Order Details</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Customer</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Service</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Driver</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Status</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Amount</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Location</TableHead>
                    <TableHead className="font-bold text-blue-900 text-left p-4">Actions</TableHead>
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
                          <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200 pb-4">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-emerald-900">Monthly Growth</h3>
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-800">+28.5%</p>
                    <p className="text-sm text-emerald-600 font-medium">vs last month</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-blue-900">Total Revenue</h3>
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-800">RM 125,231</p>
                    <p className="text-sm text-blue-600 font-medium">this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200 pb-4">
                <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Operational Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-purple-900">Order Volume</h3>
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-800">1,485</p>
                    <p className="text-sm text-purple-600 font-medium">this month</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-orange-900">Efficiency Rate</h3>
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-800">96.8%</p>
                    <p className="text-sm text-orange-600 font-medium">average performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
