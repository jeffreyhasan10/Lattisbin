
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DriverHeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({ onSidebarToggle, title }) => {
  const [driverSession, setDriverSession] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (session) {
      setDriverSession(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("driverSession");
    window.location.href = "/";
  };

  const notifications = [
    { id: 1, title: "New job assigned", message: "ABC Construction delivery", time: "5 min ago", type: "info" },
    { id: 2, title: "Payment received", message: "RM 350 from Green Valley", time: "1 hour ago", type: "success" },
    { id: 3, title: "Route update", message: "Traffic alert on Jalan Ampang", time: "2 hours ago", type: "warning" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back, {driverSession?.name || 'Driver'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                  {notifications.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
              align="end"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {driverSession?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {driverSession?.name || 'Driver'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {driverSession?.driverId || 'N/A'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {driverSession?.name || 'Driver'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {driverSession?.phone || 'No phone'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DriverHeader;
