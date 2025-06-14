
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Smartphone,
  Users,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

interface DashboardHeaderProps {
  title: string;
  onSidebarToggle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, onSidebarToggle }) => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  // Mock data for quick stats
  const quickStats = {
    activeDrivers: 3,
    totalDrivers: 5,
    onlineDrivers: 2
  };

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back, Admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Driver Stats */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{quickStats.activeDrivers}/{quickStats.totalDrivers}</span>
              <span className="text-xs text-gray-500">Drivers</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{quickStats.onlineDrivers}</span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
              align="end"
            >
              <NotificationsPanel />
            </PopoverContent>
          </Popover>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Truck className="h-4 w-4 mr-2" />
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/dashboard/driver-register")}>
                <User className="mr-2 h-4 w-4" />
                Add New Driver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/drivers")}>
                <Users className="mr-2 h-4 w-4" />
                Manage Drivers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/bookings")}>
                <Truck className="mr-2 h-4 w-4" />
                Assign Orders
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    System Administrator
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
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@lattis.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile App
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
    </div>
  );
};

export default DashboardHeader;
