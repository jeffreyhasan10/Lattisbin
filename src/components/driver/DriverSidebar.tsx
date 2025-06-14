
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
      className="bg-white border-r border-gray-200 shadow-sm transition-all duration-300"
    >
      <SidebarHeader className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
            <span className="font-bold text-white text-lg">D</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Driver<span className="text-slate-600">Portal</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Professional Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <ScrollArea className="h-full">
          {menuItems.map((group) => (
            <SidebarGroup key={group.group} className="mb-4">
              <SidebarGroupLabel
                className={`flex items-center justify-between text-xs font-semibold uppercase text-slate-500 px-3 py-2 transition-colors duration-200 rounded-lg ${
                  isCollapsed ? 'cursor-default' : 'cursor-pointer hover:text-slate-700'
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
                                className={`rounded-lg py-2.5 px-3 transition-all duration-300 group ${
                                  activeTab === item.tab
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-900"
                                }`}
                                aria-label={item.label}
                              >
                                <item.icon className={`h-5 w-5 ${
                                  activeTab === item.tab 
                                    ? "text-white" 
                                    : "text-slate-500 group-hover:text-slate-600"
                                }`} />
                                {!isCollapsed && (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-sm">{item.label}</span>
                                    {item.badge && (
                                      <Badge
                                        className={`text-xs px-2 py-0.5 font-medium ${
                                          activeTab === item.tab
                                            ? "bg-white/20 text-white border-white/30"
                                            : item.tab === "orders"
                                            ? "bg-blue-500 text-white border-0"
                                            : "bg-gray-200 text-slate-700 border-0"
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

      <SidebarFooter className="border-t border-gray-100 p-4 mt-auto bg-white">
        <div className="flex flex-col gap-3">
          {/* User Profile Card */}
          <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Avatar className="h-9 w-9 border-2 border-gray-200 shadow-sm">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
              <AvatarFallback className="bg-slate-900 text-white font-bold text-sm">
                AR
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">Ahmad Rahman</p>
                <p className="text-xs text-slate-500 font-medium">Professional Driver</p>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-gray-200 text-slate-600 hover:text-slate-700 rounded-md"
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
                    className={`flex items-center gap-2 rounded-lg py-2.5 transition-all duration-300 hover:bg-gray-100 text-slate-600 hover:text-slate-700 ${
                      isCollapsed ? "justify-center px-0 w-full" : "justify-start px-3 flex-1"
                    }`}
                    aria-label="Help & Support"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {!isCollapsed && <span className="font-medium text-sm">Help</span>}
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
                    className="h-9 w-9 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg transition-all duration-300"
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
      <SidebarRail className="bg-gray-100" />
    </Sidebar>
  );
};

export default DriverSidebar;
