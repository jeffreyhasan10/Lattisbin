import React, { useState, useEffect } from "react";
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
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Bell,
  Activity,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, drivers } = useOrders();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate real-time statistics
  const todayOrders = orders.filter(order => order.date === new Date().toISOString().split('T')[0]);
  const activeDrivers = drivers.filter(driver => driver.status === 'active');
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedToday = todayOrders.filter(order => order.status === 'completed');
  const totalRevenue = orders.filter(order => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.amount, 0);
  const pendingPayments = orders.filter(order => order.paymentStatus === 'pending').reduce((sum, order) => sum + order.amount, 0);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const quickStats = [
    { 
      label: "Today's Orders", 
      value: todayOrders.length.toString(), 
      color: "from-blue-600 to-blue-700", 
      textColor: "text-blue-600",
      icon: FileText,
      trend: "+12%",
      isPositive: true,
      bgGradient: "from-blue-50 to-blue-100/50"
    },
    { 
      label: "Active Drivers", 
      value: activeDrivers.length.toString(), 
      color: "from-emerald-600 to-emerald-700", 
      textColor: "text-emerald-600",
      icon: UserCheck,
      trend: "100%",
      isPositive: true,
      bgGradient: "from-emerald-50 to-emerald-100/50"
    },
    { 
      label: "Pending Orders", 
      value: pendingOrders.length.toString(), 
      color: "from-amber-600 to-amber-700", 
      textColor: "text-amber-600",
      icon: Clock,
      trend: "5%",
      isPositive: false,
      bgGradient: "from-amber-50 to-amber-100/50"
    },
    { 
      label: "Completed Today", 
      value: completedToday.length.toString(), 
      color: "from-teal-600 to-teal-700", 
      textColor: "text-teal-600",
      icon: CheckCircle,
      trend: "+8%",
      isPositive: true,
      bgGradient: "from-teal-50 to-teal-100/50"
    },
    { 
      label: "Monthly Revenue", 
      value: `RM ${totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, 
      color: "from-purple-600 to-purple-700", 
      textColor: "text-purple-600",
      icon: DollarSign,
      trend: "+15%",
      isPositive: true,
      bgGradient: "from-purple-50 to-purple-100/50"
    },
    { 
      label: "Pending Payments", 
      value: `RM ${pendingPayments.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, 
      color: "from-rose-600 to-rose-700", 
      textColor: "text-rose-600",
      icon: AlertCircle,
      trend: "3%",
      isPositive: false,
      bgGradient: "from-rose-50 to-rose-100/50"
    }
  ];

  const moduleCards = [
    {
      id: "companies",
      title: "Company Management",
      description: "Manage company profiles with ROC validation and multi-location support",
      icon: Building2,
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      count: "12 Active",
      path: "/admin/companies",
      badge: "Core"
    },
    {
      id: "customers",
      title: "Customer Database", 
      description: "Comprehensive customer management with verification and payment tracking",
      icon: Users,
      gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
      count: "245 Customers",
      path: "/admin/customers",
      badge: "Core"
    },
    {
      id: "inventory",
      title: "Bin Inventory",
      description: "Real-time bin tracking with GPS and maintenance scheduling",
      icon: Package,
      gradient: "from-purple-500 via-purple-600 to-purple-700",
      count: "156 Units",
      path: "/admin/inventory",
      badge: "Core"
    },
    {
      id: "drivers",
      title: "Driver Management",
      description: "Driver profiles with performance metrics and license tracking",
      icon: UserCheck,
      gradient: "from-indigo-500 via-indigo-600 to-indigo-700",
      count: `${drivers.length} Active`,
      path: "/admin/drivers",
      badge: "Core"
    },
    {
      id: "fleet",
      title: "Fleet Management",
      description: "Vehicle profiles, insurance tracking, and maintenance alerts",
      icon: Truck,
      gradient: "from-orange-500 via-orange-600 to-orange-700",
      count: "8 Vehicles",
      path: "/admin/fleet",
      badge: "Operations"
    },
    {
      id: "rental-lorries",
      title: "Rental Network",
      description: "Third-party rental management with vendor ratings",
      icon: MapPin,
      gradient: "from-cyan-500 via-cyan-600 to-cyan-700",
      count: "15 Partners",
      path: "/admin/rental-lorries",
      badge: "Operations"
    },
    {
      id: "waste",
      title: "Waste Management",
      description: "Classification with photo documentation and compliance",
      icon: Upload,
      gradient: "from-red-500 via-red-600 to-red-700",
      count: "25 Categories",
      path: "/admin/waste",
      badge: "Operations"
    },
    {
      id: "bookings-dos",
      title: "Bookings & Orders",
      description: "Multi-channel bookings with delivery order management",
      icon: CalendarRange,
      gradient: "from-pink-500 via-pink-600 to-pink-700",
      count: `${orders.length} Active`,
      path: "/admin/bookings-dos",
      badge: "Core"
    },
    {
      id: "invoicing",
      title: "Invoice Management",
      description: "Auto-generation, PDF creation, and multi-currency support",
      icon: Receipt,
      gradient: "from-teal-500 via-teal-600 to-teal-700",
      count: "89 Invoices",
      path: "/admin/invoicing",
      badge: "Finance"
    },
    {
      id: "payment-overview",
      title: "Payment Overview",
      description: "Transaction history and financial summaries",
      icon: DollarSign,
      gradient: "from-green-500 via-green-600 to-green-700",
      count: `RM ${totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      path: "/admin/payment-overview",
      badge: "Finance"
    },
    {
      id: "collection-reminders",
      title: "Collection Alerts",
      description: "Schedule and track collection reminders with notifications",
      icon: Bell,
      gradient: "from-amber-500 via-amber-600 to-amber-700",
      count: "Active",
      path: "/admin/collection-reminders",
      badge: "Automation"
    },
    {
      id: "reports",
      title: "Analytics & Reports",
      description: "Real-time metrics with predictive analytics",
      icon: BarChart3,
      gradient: "from-violet-500 via-violet-600 to-violet-700",
      count: "15 Reports",
      path: "/admin/reports",
      badge: "Insights"
    },
    {
      id: "printing",
      title: "Print Services",
      description: "A4 and thermal printing with barcode generation",
      icon: Printer,
      gradient: "from-slate-500 via-slate-600 to-slate-700",
      count: "3 Formats",
      path: "/admin/printing",
      badge: "Utility"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -m-6 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
        
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-700/50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                      {getGreeting()}
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base mt-1 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      System Control Center
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentTime.toLocaleDateString('en-MY', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-xs font-medium">All Systems Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5">
          {quickStats.map((stat, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-60`}></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardContent className="relative p-5 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.isPositive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{stat.trend}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Module Cards */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-slate-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Management Modules
              </h2>
            </div>
            <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-slate-600 border-slate-300">
              {moduleCards.length} Modules
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {moduleCards.map((module, index) => (
              <Card 
                key={module.id}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white hover:-translate-y-2"
                onClick={() => navigate(module.path)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${module.gradient} rounded-full -ml-12 -mb-12 opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>

                <CardContent className="relative p-6">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${module.gradient} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                      <module.icon className="h-6 w-6 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border-0"
                    >
                      {module.badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {module.description}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">
                        {module.count}
                      </span>
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 -mr-2 group/btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(module.path);
                        }}
                      >
                        Open
                        <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 rounded-lg border-2 border-transparent group-hover:bg-gradient-to-br group-hover:${module.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}></div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;