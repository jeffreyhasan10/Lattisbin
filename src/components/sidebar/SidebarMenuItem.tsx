
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  tab: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  activeTab: string;
  collapsed: boolean;
  onTabChange: (tab: string) => void;
}

const SidebarMenuItemComponent: React.FC<MenuItemProps> = ({
  tab,
  label,
  icon: Icon,
  badge,
  activeTab,
  collapsed,
  onTabChange,
}) => {
  return (
    <SidebarMenuItem>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <SidebarMenuButton
                isActive={activeTab === tab}
                onClick={() => onTabChange(tab)}
                className={`rounded-lg py-2 transition-all duration-300 hover:bg-blue-500/5 ${
                  activeTab === tab
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="font-medium text-sm">{label}</span>}
                {!collapsed && badge && (
                  <Badge
                    className={`ml-auto text-xs px-1.5 py-0.5 ${
                      tab === "waste"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : tab === "bookings"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        : tab === "drivers"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                        : tab === "customers"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </div>
          </TooltipTrigger>
          {collapsed && <TooltipContent>{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  );
};

export default SidebarMenuItemComponent;
