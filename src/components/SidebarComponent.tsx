
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home } from "lucide-react";
import SidebarHeaderComponent from "./sidebar/SidebarHeader";
import SidebarMenuGroupComponent from "./sidebar/SidebarMenuGroup";
import SidebarFooterComponent from "./sidebar/SidebarFooter";
import { menuItems } from "./sidebar/menuData";

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
      setMobileMenuOpen(false);
    }
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="bg-white dark:bg-gray-900 border-r border-gray-200/30 dark:border-gray-800/30 shadow-lg transition-all duration-300"
    >
      <SidebarHeaderComponent collapsed={collapsed} />

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
          <SidebarMenuGroupComponent
            key={group.group}
            menuGroup={group}
            collapsed={collapsed}
            expanded={expandedGroups[group.group as keyof typeof expandedGroups]}
            activeTab={activeTab}
            onToggleGroup={toggleGroup}
            onTabChange={handleTabChange}
          />
        ))}
      </SidebarContent>

      <SidebarFooterComponent collapsed={collapsed} onTabChange={handleTabChange} />
      <SidebarRail className="bg-gradient-to-b from-blue-500/10 to-indigo-500/10 dark:from-blue-900/10 dark:to-indigo-900/10" />
    </Sidebar>
  );
};

export default SidebarComponent;
