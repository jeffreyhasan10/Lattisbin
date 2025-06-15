
import React from "react";
import { SidebarHeader } from "@/components/ui/sidebar";

interface SidebarHeaderComponentProps {
  collapsed: boolean;
}

const SidebarHeaderComponent: React.FC<SidebarHeaderComponentProps> = ({ collapsed }) => {
  return (
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
  );
};

export default SidebarHeaderComponent;
