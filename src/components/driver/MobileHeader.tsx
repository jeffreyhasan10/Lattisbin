import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, Power, LogOut, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const MobileHeader = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [notifications] = useState(2);

  const handleStatusToggle = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      toast.success("You are now online", {
        description: "Ready to receive trip assignments"
      });
    } else {
      toast.info("You are now offline", {
        description: "You won't receive new trips"
      });
    }
  };

  const handleNotifications = () => {
    toast.info("Notifications", {
      description: "View all your notifications"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("driverSession");
    localStorage.removeItem("userType");
    toast.success("Logged out successfully!");
    navigate("/driver/login");
  };

  const handleViewProfile = () => {
    navigate("/driver/profile");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo - Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-lg">L</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-800">
                  Lattis<span className="text-blue-600">Bin</span>
                </h1>
                <p className="text-[10px] text-gray-600 font-medium">Driver Portal</p>
              </div>
            </div>
            
            {/* Status & Location */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
                <span className={`text-sm sm:text-base font-semibold ${isOnline ? 'text-green-600' : 'text-gray-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <MapPin className="h-4 w-4" />
                <span>Kuala Lumpur</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 sm:py-2 rounded-full border border-gray-200">
              <Power className={`h-4 w-4 sm:h-5 sm:w-5 ${isOnline ? 'text-green-600' : 'text-gray-400'}`} />
              <Switch
                checked={isOnline}
                onCheckedChange={handleStatusToggle}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Notifications */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleNotifications}
              className="relative h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] sm:text-xs border-2 border-white">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="relative h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-200 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-base sm:text-lg">A</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-base">A</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Ahmad Rahman</span>
                      <span className="text-xs text-gray-500 font-normal">Professional Driver</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
                  <UserIcon className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

