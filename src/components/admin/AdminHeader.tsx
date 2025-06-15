
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
  Activity
} from "lucide-react";
import LiveNotifications from "./LiveNotifications";
import { useOrders } from "@/contexts/OrderContext";

interface AdminHeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onSidebarToggle, title }) => {
  const { orders, drivers } = useOrders();
  
  // Real-time stats for header
  const activeOrders = orders.filter(o => ['assigned', 'in-progress'].includes(o.status)).length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {activeDrivers} Active
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {activeOrders} En Route
            </Badge>
            {pendingOrders > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {pendingOrders} Pending
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders, drivers..."
            className="pl-10 w-64"
          />
        </div>

        {/* Live Notifications */}
        <LiveNotifications />

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/api/placeholder/40/40" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
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
