
import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Truck,
  UserCheck,
  FileText,
  DollarSign,
  Receipt,
  BarChart3,
  CalendarRange,
  MapPin,
  RefreshCw,
  CreditCard,
  Printer,
  Settings,
  Upload,
  Activity,
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard"
    },
    {
      id: "business",
      label: "Business Registration",
      icon: Building2,
      href: "/admin/business"
    },
    {
      id: "customers",
      label: "Customer Management",
      icon: Users,
      href: "/admin/customers"
    },
    {
      id: "inventory",
      label: "Inventory Management",
      icon: Package,
      href: "/admin/inventory"
    },
    {
      id: "drivers",
      label: "Driver Management",
      icon: UserCheck,
      href: "/admin/drivers"
    },
    {
      id: "driver-monitoring",
      label: "Live Driver Monitoring",
      icon: Activity,
      href: "/admin/driver-monitoring"
    },
    {
      id: "orders",
      label: "Order Management",
      icon: FileText,
      href: "/admin/orders"
    },
    {
      id: "fleet",
      label: "Fleet Management",
      icon: Truck,
      href: "/admin/fleet"
    },
    {
      id: "external-lorries",
      label: "External Lorries",
      icon: MapPin,
      href: "/admin/external-lorries"
    },
    {
      id: "waste",
      label: "Waste Management",
      icon: Upload,
      href: "/admin/waste"
    },
    {
      id: "bookings",
      label: "Booking System",
      icon: CalendarRange,
      href: "/admin/bookings"
    },
    {
      id: "delivery-orders",
      label: "Delivery Orders",
      icon: ArrowRight,
      href: "/admin/delivery-orders"
    },
    {
      id: "invoicing",
      label: "Invoicing System",
      icon: Receipt,
      href: "/admin/invoicing"
    },
    {
      id: "commission",
      label: "Commission Management",
      icon: DollarSign,
      href: "/admin/commission"
    },
    {
      id: "refunds",
      label: "Refunds & Cancellations",
      icon: RefreshCw,
      href: "/admin/refunds"
    },
    {
      id: "expenses",
      label: "Expense Management",
      icon: CreditCard,
      href: "/admin/expenses"
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: BarChart3,
      href: "/admin/reports"
    },
    {
      id: "performance-analytics",
      label: "Performance Analytics",
      icon: TrendingUp,
      href: "/admin/performance-analytics"
    },
    {
      id: "printing",
      label: "Printing System",
      icon: Printer,
      href: "/admin/printing"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings"
    }
  ];

  const isActive = (href: string) => {
    return currentPath.startsWith(href);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-40 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        {!collapsed && (
          <div className="text-center">
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-blue-100">Bin Management</p>
          </div>
        )}
        {collapsed && <span className="text-lg font-bold">AP</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  collapsed ? "" : "mr-3"
                )} />
                {!collapsed && (
                  <span className="truncate group-hover:text-current">
                    {item.label}
                  </span>
                )}
                {/* Active indicator */}
                {isActive(item.href) && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200/50 p-4">
        <Button 
          variant="outline" 
          className={cn(
            "w-full bg-gradient-to-r from-red-500 to-pink-500 text-white border-none hover:from-red-600 hover:to-pink-600 shadow-lg",
            collapsed ? "px-2" : "px-4"
          )}
          size={collapsed ? "sm" : "default"}
        >
          {collapsed ? "Out" : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
