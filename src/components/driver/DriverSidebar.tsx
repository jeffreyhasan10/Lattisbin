
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
      label: "Main",
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
      className="bg-white dark:bg-gray-900 border-r border-gray-200/30 dark:border-gray-800/30 shadow-lg transition-all duration-300"
    >
      <SidebarHeader className="p-4 border-b border-gray-200/20 dark:border-gray-800/20 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-lg">D</span>
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Driver<span className="text-green-500">Portal</span>
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel
              className="flex items-center justify-between text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-3 py-2 cursor-pointer"
              onClick={() => toggleGroup(group.group)}
            >
              <span>{group.label}</span>
              {!collapsed && (
                <div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              )}
            </SidebarGroupLabel>
            {expandedGroups[group.group] && (
              <div>
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
                                  className={`rounded-lg py-2 transition-all duration-300 hover:bg-green-500/5 ${
                                    activeTab === item.tab
                                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                  aria-label={item.label}
                                >
                                  <item.icon className="h-5 w-5" />
                                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                                  {!collapsed && item.badge && (
                                    <Badge
                                      className={`ml-auto text-xs px-1.5 py-0.5 ${
                                        item.tab === "orders"
                                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
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
              </div>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/20 dark:border-gray-800/20 p-4 mt-auto bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
              <AvatarFallback className="bg-green-500 text-white">AR</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Ahmad Rahman</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Driver</p>
              </div>
            )}
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Driver settings"
                onClick={() => handleTabChange("profile")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1">
                    <Button
                      variant="ghost"
                      className={`w-full flex items-center gap-2 rounded-lg py-3 transition-all duration-300 hover:bg-blue-500/5 hover:text-blue-500 dark:hover:text-blue-400 ${
                        collapsed ? "justify-center" : "justify-start"
                      }`}
                      aria-label="Help & Support"
                    >
                      <HelpCircle className="h-5 w-5" />
                      {!collapsed && <span className="font-medium text-sm">Help</span>}
                    </Button>
                  </div>
                </TooltipTrigger>
                {collapsed && <TooltipContent>Help & Support</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-red-500/5 hover:text-red-500"
                      onClick={handleLogout}
                      aria-label="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-gradient-to-b from-green-500/10 to-blue-500/10 dark:from-green-900/10 dark:to-blue-900/10" />
    </Sidebar>
  );
};

export default DriverSidebar;
