// Sidebar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  LogOut,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const SidebarComponent: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState({
    systemSetup: false,
    management: true,
    operations: true,
    financials: false,
    analytics: false,
    system: false,
  });
  const [activeTab, setActiveTab] = useState("overview");

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  const menuGroups = [
    {
      id: "systemSetup",
      label: "System Setup",
      items: [
        { tab: "business-register", label: "Business Registration", icon: Building2 },
        { tab: "customer-register", label: "Customer Registration", icon: Users },
        { tab: "bin-register", label: "Bin Registration", icon: Package2 },
        { tab: "lorry-register", label: "Lorry Registration", icon: Truck },
        { tab: "rentable-lorry-register", label: "Rentable Lorry Registration", icon: Truck },
        { tab: "driver-register", label: "Driver Registration", icon: UserCheck },
        { tab: "waste-item-register", label: "Waste Item Registration", icon: Upload },
      ]
    },
    {
      id: "management",
      label: "Management",
      items: [
        { tab: "company", label: "Company Details", icon: Building2 },
        { tab: "customers", label: "Customers", icon: Users, badge: "New" },
        { tab: "bins", label: "Bins", icon: Package2 },
        { tab: "lorries", label: "Lorries", icon: Truck },
      ]
    },
    {
      id: "operations",
      label: "Operations",
      items: [
        { tab: "waste", label: "Collections", icon: Upload, badge: "5" },
        { tab: "bookings", label: "Bookings", icon: CalendarRange, badge: "12" },
      ]
    },
    {
      id: "financials",
      label: "Financials",
      items: [
        { tab: "invoices", label: "Invoices", icon: FileText },
        { tab: "commissions", label: "Commissions", icon: DollarSign },
        { tab: "refunds", label: "Refunds", icon: Receipt },
        { tab: "expenses", label: "Expenses", icon: DollarSign },
      ]
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        { tab: "reports", label: "Reports", icon: BarChart3 },
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        { tab: "settings", label: "Settings", icon: Settings },
      ]
    },
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      collapsed={collapsed}
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-lg">L</span>
          </div>
          {!collapsed && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Lattis<span className="text-blue-500">EWM</span>
            </h1>
          )}
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent className="py-4 px-2 overflow-y-auto custom-scrollbar">
        <div className="px-2 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 rounded-lg py-2.5 transition-all duration-200 ${
                    activeTab === "overview"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                      : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleTabChange("overview")}
                  aria-label="Dashboard Overview"
                >
                  <Home className="h-5 w-5" />
                  {!collapsed && <span className="text-sm">Dashboard</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-1">
          {menuGroups.map((group) => (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel
                className="flex items-center justify-between text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 px-3 py-2 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.label}</span>
                {!collapsed && (
                  <motion.div
                    animate={{ rotate: expandedGroups[group.id] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                )}
              </SidebarGroupLabel>
              
              <AnimatePresence>
                {expandedGroups[group.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.tab}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    isActive={activeTab === item.tab}
                                    onClick={() => handleTabChange(item.tab)}
                                    className={`rounded-lg py-2 transition-all duration-200 ${
                                      activeTab === item.tab
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                                        : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                    aria-label={item.label}
                                  >
                                    <item.icon className="h-4.5 w-4.5" />
                                    {!collapsed && (
                                      <div className="flex items-center justify-between w-full overflow-hidden">
                                        <span className="text-sm truncate">{item.label}</span>
                                        {item.badge && (
                                          <Badge 
                                            className={`ml-1 text-xs px-1.5 py-0.5 ${
                                              item.tab === "waste"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                                                : item.tab === "bookings"
                                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300"
                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                                            }`}
                                          >
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                {collapsed && (
                                  <TooltipContent side="right">
                                    <div className="flex items-center gap-2">
                                      {item.label}
                                      {item.badge && (
                                        <Badge 
                                          className={`text-xs px-1.5 py-0.5 ${
                                            item.tab === "waste"
                                              ? "bg-green-100 text-green-800"
                                              : item.tab === "bookings"
                                              ? "bg-purple-100 text-purple-800"
                                              : "bg-blue-100 text-blue-800"
                                          }`}
                                        >
                                          {item.badge}
                                        </Badge>
                                      )}
                                    </div>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-700 p-3 mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">John Doe</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Administrator</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Help & Support"
                  >
                    <HelpCircle className="h-5 w-5" />
                    {!collapsed && <span className="text-sm">Help & Support</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Help & Support</TooltipContent>}
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Log out"
                  >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span className="text-sm">Log out</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Log out</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarRail className="bg-gradient-to-b from-blue-500/10 to-indigo-500/10" />
    </Sidebar>
  );
};

export default SidebarComponent;