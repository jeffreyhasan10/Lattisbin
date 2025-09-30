import React, { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Building2, Users, Package, Truck, UserCheck, FileText, DollarSign, Receipt, BarChart3, CalendarRange, MapPin, RefreshCw, CreditCard, Printer, Settings, Upload, Activity, ArrowRight, TrendingUp, LogOut, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
interface AdminSidebarProps {
  collapsed: boolean;
  mobileMenuOpen?: boolean;
  onToggleMobile?: () => void;
}
const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  mobileMenuOpen = false,
  onToggleMobile
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const {
    orders,
    drivers
  } = useOrders();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Real-time stats
  const activeOrders = orders.filter(o => ['assigned', 'in-progress'].includes(o.status)).length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const menuGroups = [{
    label: "Overview",
    items: [{
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      badge: null
    }]
  }, {
    label: "Core Management",
    items: [{
      id: "business",
      label: "Business Registration",
      icon: Building2,
      href: "/admin/business"
    }, {
      id: "customers",
      label: "Customer Management",
      icon: Users,
      href: "/admin/customers"
    }, {
      id: "inventory",
      label: "Inventory Management",
      icon: Package,
      href: "/admin/inventory"
    }]
  }, {
    label: "Operations",
    items: [{
      id: "drivers",
      label: "Driver Management",
      icon: UserCheck,
      href: "/admin/drivers",
      badge: activeDrivers > 0 ? {
        text: activeDrivers.toString(),
        variant: "success"
      } : null
    },
    // {
    //   id: "driver-monitoring",
    //   label: "Live Monitoring",
    //   icon: Activity,
    //   href: "/admin/driver-monitoring",
    //   badge: activeDrivers > 0 ? {
    //     text: "Live",
    //     variant: "success",
    //     pulse: true
    //   } : null
    // }, 
    // {
    //   id: "orders",
    //   label: "Order Management",
    //   icon: FileText,
    //   href: "/admin/orders",
    //   badge: pendingOrders > 0 ? {
    //     text: pendingOrders.toString(),
    //     variant: "warning"
    //   } : null
    // }, 
    {
      id: "fleet",
      label: "Fleet Management",
      icon: Truck,
      href: "/admin/fleet"
    }, {
      id: "external-lorries",
      label: "External Lorries",
      icon: MapPin,
      href: "/admin/external-lorries"
    }]
  }, {
    label: "Services",
    items: [{
      id: "waste",
      label: "Waste Management",
      icon: Upload,
      href: "/admin/waste"
    }, {
      id: "bookings",
      label: "Booking System",
      icon: CalendarRange,
      href: "/admin/bookings"
    }, {
      id: "delivery-orders",
      label: "Delivery Orders",
      icon: ArrowRight,
      href: "/admin/delivery-orders",
      badge: activeOrders > 0 ? {
        text: activeOrders.toString(),
        variant: "info"
      } : null
    }]
  }, {
    label: "Financial",
    items: [{
      id: "invoicing",
      label: "Invoicing System",
      icon: Receipt,
      href: "/admin/invoicing"
    }, {
      id: "commission",
      label: "Commission Management",
      icon: DollarSign,
      href: "/admin/commission"
    }, {
      id: "refunds",
      label: "Refunds & Cancellations",
      icon: RefreshCw,
      href: "/admin/refunds"
    }, {
      id: "expenses",
      label: "Expense Management",
      icon: CreditCard,
      href: "/admin/expenses"
    }]
  }, {
    label: "Analytics",
    items: [{
      id: "reports",
      label: "Reports & Analytics",
      icon: BarChart3,
      href: "/admin/reports"
    }, {
      id: "performance-analytics",
      label: "Performance Analytics",
      icon: TrendingUp,
      href: "/admin/performance-analytics"
    }]
  }, {
    label: "System",
    items: [{
      id: "printing",
      label: "Printing System",
      icon: Printer,
      href: "/admin/printing"
    }, {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings"
    }]
  }];
  const isActive = (href: string) => {
    return currentPath.startsWith(href);
  };
  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "warning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  // Add logout handler
  const handleLogout = () => {
    // Clear any admin session if needed here
    navigate("/");
  };
  return <>
      {/* Desktop Sidebar */}
      <div className={cn("fixed top-0 left-0 z-40 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/60 shadow-2xl transition-all duration-300 ease-in-out", "hidden lg:flex flex-col", collapsed ? "w-20" : "w-72")}>
        {/* Header */}
        <div className="relative h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between px-4">
          {!collapsed && <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">LattisBin</h1>
                <p className="text-xs text-blue-100">Admin Panel</p>
              </div>
            </div>}
          {collapsed && <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-5 h-5" />
            </div>}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {menuGroups.map(group => <div key={group.label}>
                {!collapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                    {group.label}
                  </h3>}
                <div className="space-y-1">
                  {group.items.map(item => <NavLink key={item.id} to={item.href} className={({
                isActive
              }) => cn("flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative", isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25" : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600", collapsed ? "justify-center" : "justify-start")} onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)}>
                      <item.icon className={cn("w-5 h-5 flex-shrink-0", collapsed ? "" : "mr-3")} />
                      
                      {!collapsed && <>
                          <span className="truncate flex-1">{item.label}</span>
                          {item.badge && <Badge className={cn("ml-2 text-xs px-2 py-0.5 border", getBadgeVariant(item.badge.variant || "default")  && "animate-pulse")}>
                              {item.badge.text}
                            </Badge>}
                        </>}

                      {/* Tooltip for collapsed state */}
                      {collapsed && hoveredItem === item.id && <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                          {item.label}
                          {item.badge && <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                              {item.badge.text}
                            </span>}
                        </div>}

                      {/* Active indicator */}
                      {isActive(item.href) && !collapsed && <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full" />}
                    </NavLink>)}
                </div>
                {!collapsed && <Separator className="my-4 bg-gray-200/50" />}
              </div>)}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-gray-200/50 p-4">
          <Button variant="outline" className={cn("w-full bg-gradient-to-r from-red-500 to-rose-500 text-white border-none hover:from-red-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-200", collapsed ? "px-2" : "px-4")} size={collapsed ? "sm" : "default"} onClick={handleLogout}>
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        {/* Mobile Header */}
        <div className="h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">LottisBin</h1>
              <p className="text-xs text-blue-100">Admin Panel</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleMobile} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {menuGroups.map(group => <div key={group.label}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map(item => <NavLink key={item.id} to={item.href} onClick={onToggleMobile} className={({
                isActive
              }) => cn("flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200", isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600")}>
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && <Badge className={cn("text-xs px-2 py-0.5 border", getBadgeVariant(item.badge.variant || "default") && "animate-pulse")}>
                          {item.badge.text}
                        </Badge>}
                    </NavLink>)}
                </div>
                <Separator className="my-4 bg-gray-200/50" />
              </div>)}
          </div>
        </ScrollArea>

        {/* Mobile Footer */}
        <div className="border-t border-gray-200/50 p-4">
          <Button variant="outline" className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white border-none hover:from-red-600 hover:to-rose-600 shadow-lg" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>;
};
export default AdminSidebar;