
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Eye
} from "lucide-react";
import DashboardStatsCards from "./DashboardStatsCards";
import DashboardDriverTable from "./DashboardDriverTable";
import DashboardOrderTable from "./DashboardOrderTable";

const DashboardOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const moduleCards = [
    {
      id: "business-register",
      title: "Business Register",
      description: "Company details, ROC number, address, contact info",
      icon: Building2,
      color: "bg-blue-500",
      count: "12 Companies"
    },
    {
      id: "customer-register", 
      title: "Customer Register",
      description: "Client details, contact person, mobile registration",
      icon: Users,
      color: "bg-green-500",
      count: "245 Customers"
    },
    {
      id: "inventory-register",
      title: "Inventory Register", 
      description: "Bin records, sizes, serial numbers (ASR/LASR/PWD)",
      icon: Package,
      color: "bg-purple-500",
      count: "156 Bins"
    },
    {
      id: "lorry-register",
      title: "Lorry Register",
      description: "Own lorries, road tax, insurance alerts",
      icon: Truck,
      color: "bg-orange-500", 
      count: "8 Lorries"
    },
    {
      id: "rentable-lorry-register",
      title: "Rentable Lorry Register",
      description: "External rental lorries by area",
      icon: Truck,
      color: "bg-teal-500",
      count: "15 Available"
    },
    {
      id: "waste-item-register",
      title: "Waste Item Register",
      description: "Waste types: Scrap, Trash, Construction",
      icon: Upload,
      color: "bg-red-500",
      count: "25 Items"
    },
    {
      id: "driver-register",
      title: "Driver Management",
      description: "Driver details, IC, phone, address",
      icon: UserCheck,
      color: "bg-indigo-500",
      count: "12 Drivers"
    },
    {
      id: "booking-bin",
      title: "Booking Management",
      description: "Book bins by area, assign drivers",
      icon: CalendarRange,
      color: "bg-pink-500",
      count: "34 Bookings"
    },
    {
      id: "delivery-order",
      title: "Delivery Orders",
      description: "Issue DO, bin collection, payment",
      icon: FileText,
      color: "bg-yellow-500",
      count: "67 Active"
    },
    {
      id: "invoice",
      title: "Invoice Management",
      description: "Auto invoice from DO, PDF generation",
      icon: Receipt,
      color: "bg-cyan-500",
      count: "89 Invoices"
    },
    {
      id: "commission",
      title: "Commission",
      description: "Introducer commissions after payment",
      icon: DollarSign,
      color: "bg-emerald-500",
      count: "RM 12,450"
    },
    {
      id: "expenses",
      title: "Expenses",
      description: "Salary, lorry repair, petrol, bin repair",
      icon: DollarSign,
      color: "bg-amber-500",
      count: "RM 8,900"
    }
  ];

  const quickStats = [
    { label: "Today's Orders", value: "23", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Drivers", value: "8", color: "text-green-600", bg: "bg-green-50" },
    { label: "Available Bins", value: "156", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Invoices", value: "12", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Monthly Revenue", value: "RM 45,600", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Fleet Status", value: "7/8 Active", color: "text-indigo-600", bg: "bg-indigo-50" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Bin Management System</h1>
                <p className="text-slate-600 mt-1">Comprehensive waste management dashboard</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  System Online
                </Badge>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className={`${stat.bg} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200 bg-slate-50">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-2 bg-transparent gap-1">
                <TabsTrigger 
                  value="overview" 
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="registers"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Registers
                </TabsTrigger>
                <TabsTrigger 
                  value="operations"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Operations
                </TabsTrigger>
                <TabsTrigger 
                  value="financials"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Financials
                </TabsTrigger>
                <TabsTrigger 
                  value="drivers"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Drivers
                </TabsTrigger>
                <TabsTrigger 
                  value="orders"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="reports"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Reports
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-200"
                >
                  Settings
                </TabsTrigger>
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
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                          <Button size="sm" variant="outline" className="text-xs">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="registers" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Registration Modules</h3>
                  <p className="text-slate-600">Manage all registration processes from here</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Registration
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="operations" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Operations Center</h3>
                  <p className="text-slate-600">Monitor daily operations and logistics</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Operations
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Financial Management</h3>
                  <p className="text-slate-600">Handle invoices, payments, and commissions</p>
                  <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                    <Receipt className="h-4 w-4 mr-2" />
                    Manage Finances
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="drivers" className="space-y-6 mt-0">
                <DashboardDriverTable />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6 mt-0">
                <DashboardOrderTable />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Reports & Analytics</h3>
                  <p className="text-slate-600">Generate comprehensive reports and insights</p>
                  <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">System Settings</h3>
                  <p className="text-slate-600">Configure system preferences and settings</p>
                  <Button className="mt-4 bg-slate-600 hover:bg-slate-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Open Settings
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
