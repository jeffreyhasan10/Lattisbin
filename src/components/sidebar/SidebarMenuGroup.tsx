
import React from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarMenuItemComponent from "./SidebarMenuItem";

interface MenuItem {
  tab: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface MenuGroup {
  group: string;
  label: string;
  items: MenuItem[];
}

interface SidebarMenuGroupProps {
  menuGroup: MenuGroup;
  collapsed: boolean;
  expanded: boolean;
  activeTab: string;
  onToggleGroup: (group: string) => void;
  onTabChange: (tab: string) => void;
}

const SidebarMenuGroupComponent: React.FC<SidebarMenuGroupProps> = ({
  menuGroup,
  collapsed,
  expanded,
  activeTab,
  onToggleGroup,
  onTabChange,
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className="flex items-center justify-between text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-3 py-2 cursor-pointer"
        onClick={() => onToggleGroup(menuGroup.group)}
      >
        <span>{collapsed ? '•' : menuGroup.label}</span>
        {!collapsed && (
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`} 
          />
        )}
      </SidebarGroupLabel>
      {(collapsed || expanded) && (
        <SidebarGroupContent>
          <SidebarMenu>
            {menuGroup.items.map((item) => (
              <SidebarMenuItemComponent
                key={item.tab}
                tab={item.tab}
                label={item.label}
                icon={item.icon}
                badge={item.badge}
                activeTab={activeTab}
                collapsed={collapsed}
                onTabChange={onTabChange}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
};

export default SidebarMenuGroupComponent;
