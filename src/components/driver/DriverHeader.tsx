
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, User, LogOut, Settings, Wifi, WifiOff } from "lucide-react";
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (session) {
      setDriverSession(JSON.parse(session));
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100/60 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden hover:bg-blue-100/60 dark:hover:bg-blue-900/30 text-slate-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300 rounded-xl transition-all duration-200 shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">
                Welcome back, {driverSession?.name || 'Driver'}
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 dark:bg-gray-800/70 rounded-full shadow-sm border border-blue-100/50 dark:border-gray-700/50">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400 hidden sm:inline">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Time */}
          <div className="hidden md:flex flex-col items-end bg-white/60 dark:bg-gray-800/60 px-4 py-2 rounded-xl shadow-sm border border-blue-100/50 dark:border-gray-700/50">
            <div className="text-lg font-bold text-slate-800 dark:text-white">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-xs text-slate-500 dark:text-gray-400">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-100/60 dark:hover:bg-blue-900/30 text-slate-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300 rounded-xl transition-all duration-200 shadow-sm"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white dark:border-gray-900 shadow-lg">
                  {notifications.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 border border-blue-100/50 dark:border-gray-700/50 shadow-xl rounded-2xl backdrop-blur-sm"
              align="end"
            >
              <div className="p-4 border-b border-blue-100/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-2xl">
                <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">{notifications.length} new updates</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-blue-50/50 dark:border-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 shadow-sm ${
                        notification.type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                        notification.type === 'warning' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{notification.title}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">{notification.time}</p>
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
                className="flex items-center gap-3 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 p-2 rounded-xl transition-all duration-200 shadow-sm"
              >
                <Avatar className="h-8 w-8 ring-2 ring-blue-200/50 dark:ring-blue-700/50 shadow-md">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
                    {driverSession?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {driverSession?.name || 'Driver'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    ID: {driverSession?.driverId || 'N/A'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white/95 dark:bg-gray-900/95 border border-blue-100/50 dark:border-gray-700/50 shadow-xl rounded-2xl backdrop-blur-sm"
              align="end"
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {driverSession?.name || 'Driver'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    {driverSession?.phone || 'No phone'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-blue-100/50 dark:bg-gray-700/50" />
              <DropdownMenuItem className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg mx-2 my-1">
                <User className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg mx-2 my-1">
                <Settings className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-blue-100/50 dark:bg-gray-700/50" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg mx-2 my-1"
              >
                <LogOut className="mr-3 h-4 w-4" />
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
