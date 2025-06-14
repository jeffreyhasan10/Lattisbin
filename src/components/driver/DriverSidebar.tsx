
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
      className="bg-white border-r border-slate-200 shadow-sm transition-all duration-300"
    >
      <SidebarHeader className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-sm">D</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight">
                Driver<span className="text-blue-600">Portal</span>
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">Professional Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <ScrollArea className="h-full">
          {menuItems.map((group) => (
            <SidebarGroup key={group.group} className="mb-4">
              <SidebarGroupLabel
                className={`flex items-center justify-between text-xs font-semibold uppercase text-slate-500 px-2 py-1.5 transition-colors duration-200 rounded-md ${
                  isCollapsed ? 'cursor-default' : 'cursor-pointer hover:text-slate-700'
                }`}
                onClick={() => !isCollapsed && toggleGroup(group.group)}
              >
                <span className="tracking-wider">{isCollapsed ? '•' : group.label}</span>
                {!isCollapsed && (
                  <ChevronDown 
                    className={`h-3 w-3 transition-transform duration-200 ${
                      expandedGroups[group.group] ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </SidebarGroupLabel>
              {(isCollapsed || expandedGroups[group.group]) && (
                <SidebarGroupContent className="mt-1">
                  <SidebarMenu className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.tab}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                isActive={activeTab === item.tab}
                                onClick={() => handleTabChange(item.tab)}
                                className={`rounded-lg py-2.5 px-3 transition-all duration-300 group ${
                                  activeTab === item.tab
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:transform hover:scale-105"
                                }`}
                                aria-label={item.label}
                              >
                                <item.icon className={`h-4 w-4 ${
                                  activeTab === item.tab 
                                    ? "text-white" 
                                    : "text-slate-500 group-hover:text-blue-600"
                                }`} />
                                {!isCollapsed && (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-sm">{item.label}</span>
                                    {item.badge && (
                                      <Badge
                                        className={`text-xs px-1.5 py-0.5 font-medium ${
                                          activeTab === item.tab
                                            ? "bg-white/20 text-white border-white/30"
                                            : "bg-blue-500 text-white border-0 shadow-sm"
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

      <SidebarFooter className="border-t border-slate-200 p-3 mt-auto bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex flex-col gap-2">
          {/* User Profile Card */}
          <div className={`flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Avatar className="h-7 w-7 border-2 border-blue-200 shadow-sm">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs">
                AR
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">Ahmad Rahman</p>
                <p className="text-xs text-slate-600 font-medium">Professional Driver</p>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-md"
                    aria-label="Driver settings"
                    onClick={() => handleTabChange("profile")}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Action Buttons */}
          <div className={`flex gap-1 ${isCollapsed ? 'flex-col' : ''}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-lg py-2 transition-all duration-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 ${
                      isCollapsed ? "justify-center px-0 w-full" : "justify-start px-2 flex-1"
                    }`}
                    aria-label="Help & Support"
                  >
                    <HelpCircle className="h-3 w-3" />
                    {!isCollapsed && <span className="font-medium text-xs">Help</span>}
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
                    className="h-7 w-7 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all duration-300"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-slate-200/50" />
    </Sidebar>
  );
};

export default DriverSidebar;
