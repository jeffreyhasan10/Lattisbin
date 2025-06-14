
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  useSidebar,
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
  const { state, isMobile, setOpenMobile } = useSidebar();
  const [expandedGroups, setExpandedGroups] = useState({
    main: true,
    management: true,
  });

  const activeTab = location.pathname.split("/").pop() || "dashboard";

  const toggleGroup = (group: string) => {
    if (!state || state === "collapsed") return;
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleTabChange = (tab: string) => {
    navigate(`/driver/${tab}`);
    if (isMobile) {
      setOpenMobile(false);
    }
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

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="bg-gradient-to-b from-white via-slate-50/90 to-blue-50/70 dark:from-gray-900 dark:to-gray-800 border-r border-blue-100/70 dark:border-gray-700/60 shadow-xl transition-all duration-300"
    >
      <SidebarHeader className="p-4 border-b border-blue-100/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
            <span className="font-bold text-white text-lg">D</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Driver<span className="text-blue-200">Portal</span>
              </h1>
              <p className="text-xs text-blue-100/80 mt-0.5 font-medium">Professional Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <ScrollArea className="h-full">
          {menuItems.map((group) => (
            <SidebarGroup key={group.group} className="mb-4">
              <SidebarGroupLabel
                className={`flex items-center justify-between text-xs font-bold uppercase text-blue-600 dark:text-blue-400 px-3 py-2 transition-colors duration-200 rounded-lg hover:bg-blue-50/60 dark:hover:bg-blue-900/30 ${
                  isCollapsed ? 'cursor-default' : 'cursor-pointer hover:text-blue-700 dark:hover:text-blue-300'
                }`}
                onClick={() => !isCollapsed && toggleGroup(group.group)}
              >
                <span className="tracking-wider">{isCollapsed ? '•' : group.label}</span>
                {!isCollapsed && (
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      expandedGroups[group.group] ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </SidebarGroupLabel>
              {(isCollapsed || expandedGroups[group.group]) && (
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
                                className={`rounded-xl py-2.5 px-3 transition-all duration-300 group ${
                                  activeTab === item.tab
                                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform scale-[1.02]"
                                    : "text-slate-700 dark:text-gray-300 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm"
                                }`}
                                aria-label={item.label}
                              >
                                <item.icon className={`h-5 w-5 ${
                                  activeTab === item.tab 
                                    ? "text-white" 
                                    : "text-blue-500 group-hover:text-blue-600"
                                }`} />
                                {!isCollapsed && (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-semibold text-sm">{item.label}</span>
                                    {item.badge && (
                                      <Badge
                                        className={`text-xs px-2 py-0.5 font-bold shadow-sm ${
                                          activeTab === item.tab
                                            ? "bg-white/25 text-white border-white/40"
                                            : item.tab === "orders"
                                            ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0"
                                            : "bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0"
                                        }`}
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                          </Tooltip>
                        </TooltipProvider>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-blue-100/50 dark:border-gray-700/50 p-4 mt-auto bg-gradient-to-r from-slate-50 via-blue-50/60 to-indigo-50/40 dark:from-gray-800 dark:to-blue-900/20">
        <div className="flex flex-col gap-3">
          {/* User Profile Card */}
          <div className={`flex items-center gap-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md border border-blue-100/70 dark:border-gray-700/70 backdrop-blur-sm ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Avatar className="h-9 w-9 border-2 border-blue-200 dark:border-blue-700 shadow-sm">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-sm">
                AR
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Ahmad Rahman</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Professional Driver</p>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 text-blue-600 hover:text-blue-700 rounded-lg"
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
          <div className={`flex gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-xl py-2.5 transition-all duration-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 shadow-sm hover:shadow-md ${
                      isCollapsed ? "justify-center px-0 w-full" : "justify-start px-3 flex-1"
                    }`}
                    aria-label="Help & Support"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {!isCollapsed && <span className="font-semibold text-sm">Help</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent>Help & Support</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-red-100/70 dark:hover:bg-red-900/40 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-gradient-to-b from-blue-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20" />
    </Sidebar>
  );
};

export default DriverSidebar;
