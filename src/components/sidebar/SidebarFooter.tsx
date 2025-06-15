
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Settings, HelpCircle } from "lucide-react";

interface SidebarFooterComponentProps {
  collapsed: boolean;
  onTabChange: (tab: string) => void;
}

const SidebarFooterComponent: React.FC<SidebarFooterComponentProps> = ({
  collapsed,
  onTabChange,
}) => {
  return (
    <SidebarFooter className="border-t border-gray-200/20 dark:border-gray-800/20 p-4 mt-auto bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          )}
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="User settings"
              onClick={() => onTabChange("settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  className={`w-full flex items-center gap-2 rounded-lg py-3 transition-all duration-300 hover:bg-blue-500/5 hover:text-blue-500 dark:hover:text-blue-400 ${
                    collapsed ? "justify-center" : "justify-start"
                  }`}
                  aria-label="Help & Support"
                  onClick={() => onTabChange("help")}
                >
                  <HelpCircle className="h-5 w-5" />
                  {!collapsed && <span className="font-medium text-sm">Help & Support</span>}
                </Button>
              </div>
            </TooltipTrigger>
            {collapsed && <TooltipContent>Help & Support</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </SidebarFooter>
  );
};

export default SidebarFooterComponent;
