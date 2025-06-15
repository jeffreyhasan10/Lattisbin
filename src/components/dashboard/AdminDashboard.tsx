import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  Package, 
  Truck, 
  UserCheck, 
  Upload,
  FileText,
  DollarSign,
  Receipt,
  BarChart3,
  Settings,
  CalendarRange,
  Plus,
  Eye,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import AdminDriverManagement from "./AdminDriverManagement";
import AdminOrderManagement from "./AdminOrderManagement";
import AdminBusinessRegister from "./AdminBusinessRegister";
import AdminCustomerRegister from "./AdminCustomerRegister";
import AdminInventoryManagement from "./AdminInventoryManagement";

const AdminDashboard: React.FC = () => {
  const { orders, drivers } = useOrders();
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate real-time statistics
  const todayOrders = orders.filter(order => order.date === new Date().toISOString().split('T')[0]);
  const activeDrivers = drivers.filter(driver => driver.status === 'active');
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedToday = todayOrders.filter(order => order.status === 'completed');
  const totalRevenue = orders.filter(order => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.amount, 0);
  const pendingPayments = orders.filter(order => order.paymentStatus === 'pending').reduce((sum, order) => sum + order.amount, 0);

  const quickStats = [
    { 
      label: "Today's Orders", 
      value: todayOrders.length.toString(), 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      icon: FileText,
      trend: "+12%"
    },
    { 
      label: "Active Drivers", 
      value: activeDrivers.length.toString(), 
      color: "text-green-600", 
      bg: "bg-green-50",
      icon: UserCheck,
      trend: "100%"
    },
    { 
      label: "Pending Orders", 
      value: pendingOrders.length.toString(), 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      icon: Clock,
      trend: "-5%"
    },
    { 
      label: "Completed Today", 
      value: completedToday.length.toString(), 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      icon: CheckCircle,
      trend: "+8%"
    },
    { 
      label: "Monthly Revenue", 
      value: `RM ${totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      icon: DollarSign,
      trend: "+15%"
    },
    { 
      label: "Pending Payments", 
      value: `RM ${pendingPayments.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, 
      color: "text-red-600", 
      bg: "bg-red-50",
      icon: AlertCircle,
      trend: "-3%"
    }
  ];

  const moduleCards = [
    {
      id: "business-register",
      title: "Business Registration",
      description: "Complete company profile management with ROC validation and multi-location support",
      icon: Building2,
      color: "bg-blue-500",
      count: "12 Companies",
      tab: "business"
    },
    {
      id: "customer-register",
      title: "Customer Management", 
      description: "Comprehensive customer database with verification, contact hierarchy, and payment tracking",
      icon: Users,
      color: "bg-green-500",
      count: "245 Customers",
      tab: "customers"
    },
    {
      id: "inventory-register",
      title: "Advanced Inventory",
      description: "Real-time bin tracking with GPS, maintenance scheduling, and utilization analytics",
      icon: Package,
      color: "bg-purple-500",
      count: "156 Bins",
      tab: "inventory"
    },
    {
      id: "fleet-management",
      title: "Fleet Management",
      description: "Complete vehicle profiles, insurance tracking, and maintenance alerts",
      icon: Truck,
      color: "bg-orange-500",
      count: "8 Lorries",
      tab: "fleet"
    },
    {
      id: "driver-management",
      title: "Driver Management",
      description: "Complete driver profiles with performance metrics and real-time tracking",
      icon: UserCheck,
      color: "bg-indigo-500",
      count: `${drivers.length} Drivers`,
      tab: "drivers"
    },
    {
      id: "booking-management",
      title: "Advanced Booking",
      description: "Multi-channel bookings with geographic scheduling and dynamic pricing",
      icon: CalendarRange,
      color: "bg-pink-500",
      count: "34 Bookings",
      tab: "bookings"
    },
    {
      id: "delivery-orders",
      title: "Smart Delivery Orders",
      description: "Auto-assignment, route optimization, and real-time tracking",
      icon: FileText,
      color: "bg-yellow-500",
      count: `${orders.length} Orders`,
      tab: "orders"
    },
    {
      id: "invoicing",
      title: "Comprehensive Invoicing",
      description: "Auto-generation, PDF creation, and multi-currency support",
      icon: Receipt,
      color: "bg-cyan-500",
      count: "89 Invoices",
      tab: "invoices"
    },
    {
      id: "commission",
      title: "Commission Management",
      description: "Multi-tier structures with performance tracking and automated payments",
      icon: DollarSign,
      color: "bg-emerald-500",
      count: "RM 12,450",
      tab: "commission"
    },
    {
      id: "waste-management",
      title: "Waste Category Management",
      description: "Comprehensive classification with photo documentation and compliance tracking",
      icon: Upload,
      color: "bg-red-500",
      count: "25 Categories",
      tab: "waste"
    },
    {
      id: "expenses",
      title: "Advanced Expense Management",
      description: "Multi-category tracking with receipt upload and approval workflows",
      icon: DollarSign,
      color: "bg-amber-500",
      count: "RM 8,900",
      tab: "expenses"
    },
    {
      id: "reports",
      title: "Comprehensive Reports",
      description: "Real-time metrics with predictive analytics and custom report builder",
      icon: BarChart3,
      color: "bg-teal-500",
      count: "15 Reports",
      tab: "reports"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        {/* Admin Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Admin Dashboard - Bin Management System
            </CardTitle>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                System Online
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 h-auto p-2 bg-transparent gap-1">
                <TabsTrigger 
                  value="overview" 
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger value="business" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Business</TabsTrigger>
                <TabsTrigger value="customers" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Customers</TabsTrigger>
                <TabsTrigger value="inventory" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Inventory</TabsTrigger>
                <TabsTrigger value="drivers" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Drivers</TabsTrigger>
                <TabsTrigger value="orders" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Orders</TabsTrigger>
                <TabsTrigger value="fleet" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Fleet</TabsTrigger>
                <TabsTrigger value="bookings" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Bookings</TabsTrigger>
                <TabsTrigger value="reports" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Reports</TabsTrigger>
                <TabsTrigger value="settings" className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200">Settings</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 lg:p-8">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {moduleCards.map((module) => (
                    <Card key={module.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`${module.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                            <module.icon className="h-6 w-6" />
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setActiveTab(module.tab)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardTitle className="text-lg font-semibold text-slate-900 mb-2">
                          {module.title}
                        </CardTitle>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {module.count}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => setActiveTab(module.tab)}
                          >
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Tab Contents */}
              <TabsContent value="business" className="space-y-6 mt-0">
                <AdminBusinessRegister />
              </TabsContent>

              <TabsContent value="customers" className="space-y-6 mt-0">
                <AdminCustomerRegister />
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6 mt-0">
                <AdminInventoryManagement />
              </TabsContent>

              <TabsContent value="drivers" className="space-y-6 mt-0">
                <AdminDriverManagement />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6 mt-0">
                <AdminOrderManagement />
              </TabsContent>

              {/* Placeholder tabs for future implementation */}
              <TabsContent value="fleet" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Fleet Management</h3>
                  <p className="text-slate-600">Complete vehicle profiles with insurance tracking and maintenance alerts</p>
                  <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                    <Truck className="h-4 w-4 mr-2" />
                    Manage Fleet
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <CalendarRange className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Advanced Booking System</h3>
                  <p className="text-slate-600">Multi-channel bookings with geographic scheduling and dynamic pricing</p>
                  <Button className="mt-4 bg-pink-600 hover:bg-pink-700">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Manage Bookings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Comprehensive Reports & Analytics</h3>
                  <p className="text-slate-600">Real-time metrics with predictive analytics and custom report builder</p>
                  <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">System Settings</h3>
                  <p className="text-slate-600">Configure system preferences and business rules</p>
                  <Button className="mt-4 bg-slate-600 hover:bg-slate-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Open Settings
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
