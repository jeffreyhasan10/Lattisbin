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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Status */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="font-bold text-white text-sm">L</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  Lattis<span className="text-blue-600">Bin</span>
                </h1>
              </div>
            </div>
            
            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Location */}
            <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>Kuala Lumpur</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Status Toggle */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50">
              <Power className={`h-3.5 w-3.5 ${isOnline ? 'text-green-600' : 'text-gray-400'}`} />
              <Switch
                checked={isOnline}
                onCheckedChange={handleStatusToggle}
                className="data-[state=checked]:bg-green-500 scale-75"
              />
            </div>

            {/* Notifications */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleNotifications}
              className="relative h-8 w-8 p-0 rounded-lg hover:bg-gray-50"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              {notifications > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[9px] border border-white">
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
                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">A</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">A</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Ahmad Rahman</span>
                      <span className="text-[10px] text-gray-500 font-normal">Professional Driver</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer text-sm">
                  <UserIcon className="h-3.5 w-3.5 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-sm text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="h-3.5 w-3.5 mr-2" />
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

