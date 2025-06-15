
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
        "flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full fixed top-0 left-0 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>
      <nav className="flex-1 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200",
                    isActive && "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-500 font-bold"
                  )
                }
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
