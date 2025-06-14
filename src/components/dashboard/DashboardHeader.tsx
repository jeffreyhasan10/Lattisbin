import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
  BookOpen,
  UserCog,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import NotificationsPanel from "./NotificationsPanel";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // In a real app, this would log the user out
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6 shadow-sm"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-gray-100 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </motion.div>

      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:pl-4 lg:pl-6">
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] lg:w-[300px] pl-8 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </motion.div>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="relative hover:bg-gray-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </motion.div>
          </PopoverTrigger>
          <AnimatePresence>
            {showNotifications && (
              <PopoverContent
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-[380px] p-0 shadow-lg"
                align="end"
              >
                <NotificationsPanel />
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="pl-2 pr-0 py-0 h-10 hover:bg-gray-100 transition-colors"
              >
                <Avatar className="w-7 h-7 mr-2">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>AZ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs mr-2">
                  <span className="text-sm font-medium">Ahmad Zulkifli</span>
                  <span className="text-[10px] text-gray-500">Administrator</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            align="end"
            className="w-56 shadow-lg"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Ahmad Zulkifli</p>
                <p className="text-xs leading-none text-gray-500">
                  ahmad@simatex.my
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {[
                { icon: User, text: "Profile", to: "/dashboard/profile" },
                { icon: Settings, text: "Settings", to: "/dashboard/settings" },
                { icon: UserCog, text: "Account", to: "#" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  transition={{ duration: 0.1 }}
                >
                  <DropdownMenuItem>
                    <item.icon className="h-4 w-4 mr-2" />
                    <Link to={item.to} className="w-full">
                      {item.text}
                    </Link>
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {[
                { icon: HelpCircle, text: "Help & Support", to: "#" },
                { icon: BookOpen, text: "Documentation", to: "#" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  transition={{ duration: 0.1 }}
                >
                  <DropdownMenuItem>
                    <item.icon className="h-4 w-4 mr-2" />
                    <Link to={item.to} className="w-full">
                      {item.text}
                    </Link>
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <motion.div
              whileHover={{ backgroundColor: "#f3f4f6" }}
              transition={{ duration: 0.1 }}
            >
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;