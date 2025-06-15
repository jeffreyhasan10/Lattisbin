
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Building2, Users, Package, Truck, UserCheck, Upload, 
  FileText, DollarSign, Receipt, BarChart3, Settings, 
  CalendarRange, MapPin, Shield, CreditCard, RefreshCw,
  PieChart, Printer, TrendingUp, Activity, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [notifications] = useState(3);

  const menuItems = [
    { 
      path: "/admin/dashboard", 
      label: "Overview", 
      icon: Activity,
      badge: null
    },
    { 
      path: "/admin/business", 
      label: "Business Registration", 
      icon: Building2,
      badge: "12"
    },
    { 
      path: "/admin/customers", 
      label: "Customer Management", 
      icon: Users,
      badge: "245"
    },
    { 
      path: "/admin/inventory", 
      label: "Inventory Management", 
      icon: Package,
      badge: "156"
    },
    { 
      path: "/admin/fleet", 
      label: "Fleet Management", 
      icon: Truck,
      badge: "8"
    },
    { 
      path: "/admin/external-lorries", 
      label: "External Lorries", 
      icon: MapPin,
      badge: "15"
    },
    { 
      path: "/admin/waste", 
      label: "Waste Management", 
      icon: Upload,
      badge: "25"
    },
    { 
      path: "/admin/drivers", 
      label: "Driver Management", 
      icon: UserCheck,
      badge: "12"
    },
    { 
      path: "/admin/bookings", 
      label: "Booking System", 
      icon: CalendarRange,
      badge: "34"
    },
    { 
      path: "/admin/orders", 
      label: "Order Management", 
      icon: FileText,
      badge: "89"
    },
    { 
      path: "/admin/invoicing", 
      label: "Invoicing System", 
      icon: Receipt,
      badge: "67"
    },
    { 
      path: "/admin/commission", 
      label: "Commission Management", 
      icon: DollarSign,
      badge: null
    },
    { 
      path: "/admin/refunds", 
      label: "Refunds & Cancellations", 
      icon: RefreshCw,
      badge: "5"
    },
    { 
      path: "/admin/expenses", 
      label: "Expense Management", 
      icon: CreditCard,
      badge: null
    },
    { 
      path: "/admin/reports", 
      label: "Reports & Analytics", 
      icon: BarChart3,
      badge: null
    },
    { 
      path: "/admin/printing", 
      label: "Printing System", 
      icon: Printer,
      badge: null
    },
    { 
      path: "/admin/settings", 
      label: "Settings", 
      icon: Settings,
      badge: null
    }
  ];

  return (
    <Sidebar className={cn("border-r bg-white shadow-sm", collapsed ? "w-16" : "w-64")}>
      <SidebarHeader className="p-4 border-b border-gray-200/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Admin<span className="text-blue-600">Panel</span>
              </h1>
              <p className="text-xs text-gray-500">Waste Management System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-blue-50",
                      isActive
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:text-blue-600"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
