
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
  FileText,
  Truck,
  DollarSign,
  Receipt,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Map,
  Target,
} from "lucide-react";

interface DriverSidebarProps {
  collapsed: boolean;
}

const DriverSidebar: React.FC<DriverSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({
    main: true,
    management: true,
  });

  const activeTab = location.pathname.split("/").pop() || "dashboard";

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleTabChange = (tab: string) => {
    navigate(`/driver/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("driverSession");
    navigate("/driver/login");
  };

  const menuItems = [
    {
      group: "main",
      label: "Main Navigation",
      items: [
        { tab: "dashboard", label: "Dashboard", icon: Home },
        { tab: "orders", label: "My Orders", icon: FileText, badge: "3" },
        { tab: "lorries", label: "Lorry Selection", icon: Truck },
      ],
    },
    {
      group: "management", 
      label: "Management",
      items: [
        { tab: "payments", label: "Payments", icon: DollarSign },
        { tab: "expenses", label: "Expenses", icon: Receipt },
        { tab: "profile", label: "Profile", icon: User },
      ],
    },
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800 border-r border-blue-100/50 dark:border-gray-700/50 shadow-xl transition-all duration-300"
    >
      <SidebarHeader className="p-6 border-b border-blue-100/30 dark:border-gray-700/30 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
            <span className="font-bold text-white text-xl">D</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Driver<span className="text-blue-200">Portal</span>
              </h1>
              <p className="text-xs text-blue-100/80 mt-0.5">Professional Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 overflow-y-auto custom-scrollbar">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group} className="mb-6">
            <SidebarGroupLabel
              className="flex items-center justify-between text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 px-3 py-2 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              onClick={() => toggleGroup(group.group)}
            >
              <span className="tracking-wider">{group.label}</span>
              {!collapsed && (
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expandedGroups[group.group] ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </SidebarGroupLabel>
            {expandedGroups[group.group] && (
              <SidebarGroupContent className="mt-2">
                <SidebarMenu className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.tab}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              isActive={activeTab === item.tab}
                              onClick={() => handleTabChange(item.tab)}
                              className={`rounded-xl py-3 px-4 transition-all duration-300 group ${
                                activeTab === item.tab
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
                              }`}
                              aria-label={item.label}
                            >
                              <item.icon className={`h-5 w-5 ${
                                activeTab === item.tab 
                                  ? "text-white" 
                                  : "text-blue-500 group-hover:text-blue-600"
                              }`} />
                              {!collapsed && (
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium text-sm">{item.label}</span>
                                  {item.badge && (
                                    <Badge
                                      className={`text-xs px-2 py-0.5 ${
                                        activeTab === item.tab
                                          ? "bg-white/20 text-white border-white/30"
                                          : item.tab === "orders"
                                          ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300"
                                          : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                                      }`}
                                    >
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
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

      <SidebarFooter className="border-t border-blue-100/30 dark:border-gray-700/30 p-4 mt-auto bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-blue-900/10">
        <div className="flex flex-col gap-4">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100/50 dark:border-gray-700/50">
            <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-700">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                AR
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Ahmad Rahman</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Professional Driver</p>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 hover:text-blue-700"
                    aria-label="Driver settings"
                    onClick={() => handleTabChange("profile")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex-1 flex items-center gap-2 rounded-xl py-3 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ${
                      collapsed ? "justify-center px-0" : "justify-start px-3"
                    }`}
                    aria-label="Help & Support"
                  >
                    <HelpCircle className="h-5 w-5" />
                    {!collapsed && <span className="font-medium text-sm">Help</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent>Help & Support</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-xl transition-all duration-300"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-gradient-to-b from-blue-500/5 to-indigo-500/5 dark:from-blue-900/10 dark:to-indigo-900/10" />
    </Sidebar>
  );
};

export default DriverSidebar;
