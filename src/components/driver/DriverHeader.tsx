
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden hover:bg-gray-100 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                {title}
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Welcome back, {driverSession?.name || 'Driver'}
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600 hidden sm:inline">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Time */}
          <div className="hidden md:flex flex-col items-end bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-slate-900">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-xs text-slate-500">
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
                className="relative hover:bg-gray-100 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white border-2 border-white">
                  {notifications.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-white border border-gray-200 shadow-lg rounded-xl"
              align="end"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <p className="text-sm text-slate-600">{notifications.length} new updates</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-900">{notification.title}</p>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
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
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
              >
                <Avatar className="h-8 w-8 border-2 border-gray-200">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Driver" />
                  <AvatarFallback className="bg-slate-900 text-white text-sm font-bold">
                    {driverSession?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {driverSession?.name || 'Driver'}
                  </p>
                  <p className="text-xs text-slate-500">
                    ID: {driverSession?.driverId || 'N/A'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white border border-gray-200 shadow-lg rounded-xl"
              align="end"
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {driverSession?.name || 'Driver'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {driverSession?.phone || 'No phone'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem className="hover:bg-gray-50 rounded-lg mx-2 my-1">
                <User className="mr-3 h-4 w-4 text-slate-600" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 rounded-lg mx-2 my-1">
                <Settings className="mr-3 h-4 w-4 text-slate-600" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 hover:bg-red-50 rounded-lg mx-2 my-1"
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
