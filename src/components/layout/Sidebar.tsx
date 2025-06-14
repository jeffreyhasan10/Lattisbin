
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Package, 
  Truck, 
  FileText, 
  Settings, 
  Building2,
  Trash2,
  DollarSign,
  BarChart3,
  Bell,
  UserPlus,
  TruckIcon,
  PackagePlus,
  WalletCards,
  RefreshCw
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
    category: "main"
  },
  {
    title: "Customer Management",
    icon: Users,
    url: "/dashboard/customers",
    category: "main"
  },
  {
    title: "Bin Inventory",
    icon: Package,
    url: "/dashboard/inventory",
    category: "main"
  },
  {
    title: "Lorry Management", 
    icon: Truck,
    url: "/dashboard/lorries",
    category: "main"
  },
  {
    title: "Waste Collection",
    icon: Trash2,
    url: "/dashboard/waste-collection",
    category: "main"
  },
  {
    title: "Booking Orders",
    icon: FileText,
    url: "/dashboard/bookings",
    category: "main"
  },
  {
    title: "Invoice Section",
    icon: DollarSign,
    url: "/dashboard/invoices",
    category: "financial"
  },
  {
    title: "Reports",
    icon: BarChart3,
    url: "/dashboard/reports",
    category: "financial"
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "/dashboard/notifications",
    category: "other"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    category: "other"
  },
  {
    title: "Company Details",
    icon: Building2,
    url: "/dashboard/company",
    category: "other"
  }
];

const registerItems = [
  {
    title: "Customer Register",
    icon: UserPlus,
    url: "/dashboard/register/customer",
  },
  {
    title: "Business Register", 
    icon: Building2,
    url: "/dashboard/register/business",
  },
  {
    title: "Driver Register",
    icon: TruckIcon,
    url: "/dashboard/register/driver",
  },
  {
    title: "Lorry Register",
    icon: Truck,
    url: "/dashboard/register/lorry",
  },
  {
    title: "Inventory Register",
    icon: PackagePlus,
    url: "/dashboard/register/inventory",
  },
  {
    title: "Waste Item Register",
    icon: Trash2,
    url: "/dashboard/register/waste-item",
  },
  {
    title: "Rentable Lorry Register",
    icon: TruckIcon,
    url: "/dashboard/register/rentable-lorry",
  }
];

const managementItems = [
  {
    title: "Driver Management",
    icon: TruckIcon,
    url: "/dashboard/management/driver",
  },
  {
    title: "Commission Management",
    icon: WalletCards,
    url: "/dashboard/management/commission",
  },
  {
    title: "Expense Management",
    icon: DollarSign,
    url: "/dashboard/management/expense",
  },
  {
    title: "Refund Management",
    icon: RefreshCw,
    url: "/dashboard/management/refund",
  },
  {
    title: "Rentable Lorries",
    icon: Truck,
    url: "/dashboard/management/rentable-lorries",
  }
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="border-r border-gray-200 dark:border-gray-800">
      <SidebarContent className="bg-white dark:bg-gray-900">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Lattis Bin</h2>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.filter(item => item.category === "main").map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Registration Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Registration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {registerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Financial & Other */}
        <SidebarGroup>
          <SidebarGroupLabel>Financial & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.filter(item => item.category === "financial" || item.category === "other").map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
