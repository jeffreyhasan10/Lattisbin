
import React from "react";
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
  CalendarRange,
  MapPin,
  Printer,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, drivers } = useOrders();

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
      id: "companies",
      title: "Manage Companies",
      description: "Complete company profile management with ROC validation and multi-location support",
      icon: Building2,
      color: "bg-blue-500",
      count: "12 Companies",
      path: "/admin/companies"
    },
    {
      id: "customers",
      title: "Manage Customers", 
      description: "Comprehensive customer database with verification, contact hierarchy, and payment tracking",
      icon: Users,
      color: "bg-green-500",
      count: "245 Customers",
      path: "/admin/customers"
    },
    {
      id: "inventory",
      title: "Manage Bin Inventory",
      description: "Real-time bin tracking with GPS, maintenance scheduling, and utilization analytics",
      icon: Package,
      color: "bg-purple-500",
      count: "156 Bins",
      path: "/admin/inventory"
    },
    {
      id: "drivers",
      title: "Manage Drivers",
      description: "Complete driver profiles with performance metrics and license tracking",
      icon: UserCheck,
      color: "bg-indigo-500",
      count: `${drivers.length} Drivers`,
      path: "/admin/drivers"
    },
    {
      id: "fleet",
      title: "Manage Lorries",
      description: "Complete vehicle profiles, insurance tracking, and maintenance alerts",
      icon: Truck,
      color: "bg-orange-500",
      count: "8 Lorries",
      path: "/admin/fleet"
    },
    {
      id: "rental-lorries",
      title: "Rental Lorries",
      description: "Third-party rental management with vendor ratings and availability scheduling",
      icon: MapPin,
      color: "bg-cyan-500",
      count: "15 Partners",
      path: "/admin/rental-lorries"
    },
    {
      id: "waste",
      title: "Waste Management",
      description: "Comprehensive classification with photo documentation and compliance tracking",
      icon: Upload,
      color: "bg-red-500",
      count: "25 Categories",
      path: "/admin/waste"
    },
    {
      id: "bookings-dos",
      title: "View Bookings & DOs",
      description: "Multi-channel bookings with geographic scheduling and delivery order management",
      icon: CalendarRange,
      color: "bg-pink-500",
      count: `${orders.length} Orders`,
      path: "/admin/bookings-dos"
    },
    {
      id: "invoicing",
      title: "Manage Invoice",
      description: "Auto-generation, PDF creation, and multi-currency support",
      icon: Receipt,
      color: "bg-teal-500",
      count: "89 Invoices",
      path: "/admin/invoicing"
    },
    {
      id: "payment-overview",
      title: "View Payment Overview",
      description: "Payment tracking, transaction history, and financial summaries",
      icon: DollarSign,
      color: "bg-emerald-500",
      count: `RM ${totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      path: "/admin/payment-overview"
    },
    {
      id: "collection-reminders",
      title: "Collection Reminders",
      description: "Schedule and track bin collection reminders with automated notifications",
      icon: Bell,
      color: "bg-amber-500",
      count: "Active Alerts",
      path: "/admin/collection-reminders"
    },
    {
      id: "reports",
      title: "Access Reports",
      description: "Real-time metrics with predictive analytics and custom report builder",
      icon: BarChart3,
      color: "bg-violet-500",
      count: "15 Reports",
      path: "/admin/reports"
    },
    {
      id: "printing",
      title: "Printing System",
      description: "A4 and thermal printing with barcode generation and custom templates",
      icon: Printer,
      color: "bg-slate-500",
      count: "3 Formats",
      path: "/admin/printing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Complete system overview and management</p>
      </div>

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

      {/* Module Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Modules</h2>
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
                    onClick={() => navigate(module.path)}
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
                    onClick={() => navigate(module.path)}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
