import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Shield,
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import LiveNotifications from "./LiveNotifications";
import { useOrders } from "@/contexts/OrderContext";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  onSidebarToggle: () => void;
  onMobileMenuToggle?: () => void;
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onSidebarToggle, 
  onMobileMenuToggle,
  title 
}) => {
  const { orders, drivers } = useOrders();
  const navigate = useNavigate();
  
  // Real-time stats for header
  const activeOrders = orders.filter(o => ['assigned', 'in-progress'].includes(o.status)).length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="hidden lg:flex hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 hidden sm:block">Manage your operations efficiently</p>
          </div>
          
          {/* Real-time Status Badges */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span className="font-medium">{activeDrivers}</span>
              <span className="hidden lg:inline">Active</span>
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium">{activeOrders}</span>
              <span className="hidden lg:inline">En Route</span>
            </Badge>
            {pendingOrders > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                <Bell className="h-3 w-3" />
                <span className="font-medium">{pendingOrders}</span>
                <span className="hidden lg:inline">Pending</span>
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders, drivers..."
            className="pl-10 w-64 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>

        {/* Search Button for Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-gray-100"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Live Notifications */}
        <LiveNotifications />

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
              <Avatar className="h-10 w-10 border-2 border-gray-200">
                <AvatarImage src="/api/placeholder/40/40" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@lattisbin.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-50">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 hover:bg-red-50 focus:bg-red-50"
              onClick={() => navigate("/")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
