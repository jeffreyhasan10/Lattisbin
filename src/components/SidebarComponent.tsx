
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  Users,
  Package2,
  Truck,
  UserCheck,
  Upload,
  CalendarRange,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  DollarSign,
  Receipt,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  collapsed,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({
    systemSetup: true,
    management: true,
    operations: true,
    financials: true,
    analytics: true,
    system: true,
  });

  // Determine active tab based on current path
  const activeTab = location.pathname.split("/").pop() || "overview";

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group as keyof typeof prev],
    }));
  };

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/${tab}`);
    if (mobileMenuOpen && setMobileMenuOpen) {
      setMobileMenuOpen(false); // Close mobile menu on navigation
    }
  };

  const menuItems = [
    {
      group: "systemSetup",
      label: "System Setup",
      items: [
        { tab: "business-register", label: "Business Registration", icon: Building2 },
        { tab: "customer-register", label: "Customer Registration", icon: Users },
        { tab: "bin-register", label: "Bin Registration", icon: Package2 },
        { tab: "lorry-register", label: "Lorry Registration", icon: Truck },
        { tab: "rentable-lorry-register", label: "Rentable Lorry Registration", icon: Truck },
        { tab: "driver-register", label: "Driver Registration", icon: UserCheck },
        { tab: "waste-item-register", label: "Waste Item Registration", icon: Upload },
      ],
    },
    {
      group: "management",
      label: "Management",
      items: [
        { tab: "company", label: "Company Details", icon: Building2 },
        { tab: "drivers", label: "Driver Management", icon: UserCheck, badge: "New" },
        { tab: "customers", label: "Customers", icon: Users, badge: "New" },
        { tab: "bins", label: "Bins", icon: Package2 },
        { tab: "lorries", label: "Lorries", icon: Truck },
      ],
    },
    {
      group: "operations",
      label: "Operations",
      items: [
        { tab: "waste", label: "Collections", icon: Upload, badge: "5" },
        { tab: "bookings", label: "Bookings", icon: CalendarRange, badge: "12" },
      ],
    },
    {
      group: "financials",
      label: "Financials",
      items: [
        { tab: "invoices", label: "Invoices", icon: FileText },
        { tab: "commissions", label: "Commissions", icon: DollarSign },
        { tab: "refunds", label: "Refunds", icon: Receipt },
        { tab: "expenses", label: "Expenses", icon: DollarSign },
      ],
    },
    {
      group: "analytics",
      label: "Analytics",
      items: [{ tab: "reports", label: "Reports", icon: BarChart3 }],
    },
    {
      group: "system",
      label: "System",
      items: [{ tab: "settings", label: "Settings", icon: Settings }],
    },
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="bg-white dark:bg-gray-900 border-r border-gray-200/30 dark:border-gray-800/30 shadow-lg transition-all duration-300"
    >
      <SidebarHeader className="p-4 border-b border-gray-200/20 dark:border-gray-800/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-lg">L</span>
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Lattis<span className="text-blue-500">EWM</span>
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-y-auto custom-scrollbar">
        {/* Dashboard Overview */}
        <div className="py-2 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-lg py-3 transition-all duration-300 ${
                      activeTab === "overview"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "hover:bg-blue-500/5 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                    onClick={() => handleTabChange("overview")}
                    aria-label="Dashboard Overview"
                  >
                    <Home className="h-5 w-5" />
                    {!collapsed && <span className="font-medium text-sm">Dashboard</span>}
                  </Button>
                </div>
              </TooltipTrigger>
              {collapsed && <TooltipContent>Dashboard</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Menu Groups */}
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel
              className="flex items-center justify-between text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-3 py-2 cursor-pointer"
              onClick={() => toggleGroup(group.group)}
            >
              <span>{collapsed ? '•' : group.label}</span>
              {!collapsed && (
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expandedGroups[group.group as keyof typeof expandedGroups] ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </SidebarGroupLabel>
            {(collapsed || expandedGroups[group.group as keyof typeof expandedGroups]) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.tab}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <SidebarMenuButton
                                isActive={activeTab === item.tab}
                                onClick={() => handleTabChange(item.tab)}
                                className={`rounded-lg py-2 transition-all duration-300 hover:bg-blue-500/5 ${
                                  activeTab === item.tab
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                                aria-label={item.label}
                              >
                                <item.icon className="h-5 w-5" />
                                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                                {!collapsed && item.badge && (
                                  <Badge
                                    className={`ml-auto text-xs px-1.5 py-0.5 ${
                                      item.tab === "waste"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : item.tab === "bookings"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                        : item.tab === "drivers"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                        : item.tab === "customers"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    }`}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </SidebarMenuButton>
                            </div>
                          </TooltipTrigger>
                          {collapsed && <TooltipContent>{item.label}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/20 dark:border-gray-800/20 p-4 mt-auto bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            )}
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="User settings"
                onClick={() => handleTabChange("settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center gap-2 rounded-lg py-3 transition-all duration-300 hover:bg-blue-500/5 hover:text-blue-500 dark:hover:text-blue-400 ${
                      collapsed ? "justify-center" : "justify-start"
                    }`}
                    aria-label="Help & Support"
                    onClick={() => handleTabChange("help")}
                  >
                    <HelpCircle className="h-5 w-5" />
                    {!collapsed && <span className="font-medium text-sm">Help & Support</span>}
                  </Button>
                </div>
              </TooltipTrigger>
              {collapsed && <TooltipContent>Help & Support</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-gradient-to-b from-blue-500/10 to-indigo-500/10 dark:from-blue-900/10 dark:to-indigo-900/10" />
    </Sidebar>
  );
};

export default SidebarComponent;
