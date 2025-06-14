import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Star,
  Settings,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DUMMY_NOTIFICATIONS = [
  {
    id: "1",
    type: "success",
    title: "Collection Job Completed",
    description: "Bin #12345 has been successfully collected from ABC Construction.",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Booking Assigned",
    description: "You have a new booking for Sunshine Apartments on Jan 20, 2024.",
    time: "30 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Lorry Maintenance Required",
    description: "Lorry #WMD1234 is due for maintenance. Schedule a service soon.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "error",
    title: "Payment Overdue",
    description: "Payment for Invoice #INV0003 is overdue. Please collect payment.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Collection Job Completed",
    description: "Bin #54321 has been successfully collected from XYZ Corporation.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "info",
    title: "New Customer Registered",
    description: "A new customer, John Doe, has registered with LattisEWM.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "7",
    type: "warning",
    title: "Low Bin Inventory",
    description: "The inventory for ASR100 bins is running low. Reorder soon.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "8",
    type: "error",
    title: "Driver Expense Report",
    description: "Driver Ahmad has submitted an expense report for review.",
    time: "3 days ago",
    read: true,
  },
];

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    } else {
      return notifications.filter((notification) => notification.type === activeTab);
    }
  }, [notifications, activeTab]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const NotificationList = ({ notifications }: { notifications: typeof DUMMY_NOTIFICATIONS }) => (
    <div className="space-y-1">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
            notification.read
              ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          }`}
          onClick={() => markAsRead(notification.id)}
        >
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.type)}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              <span>Latest</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Date</DropdownMenuItem>
            <DropdownMenuItem>Priority</DropdownMenuItem>
            <DropdownMenuItem>Read Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            <span className="sr-only">Mark all as read</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={clearAllNotifications}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear all</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="border-b border-gray-200 dark:border-gray-800">
        <TabsList className="flex justify-between">
          <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="success" onClick={() => setActiveTab("success")}>
            <Check className="h-4 w-4 mr-1" />
            Success
          </TabsTrigger>
          <TabsTrigger value="info" onClick={() => setActiveTab("info")}>
            <Info className="h-4 w-4 mr-1" />
            Info
          </TabsTrigger>
          <TabsTrigger value="warning" onClick={() => setActiveTab("warning")}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            Warning
          </TabsTrigger>
          <TabsTrigger value="error" onClick={() => setActiveTab("error")}>
            <X className="h-4 w-4 mr-1" />
            Error
          </TabsTrigger>
        </TabsList>
        <Separator />
      </Tabs>

      <ScrollArea className="h-[400px]">
        <div className="p-4">
          <NotificationList notifications={filteredNotifications} />
        </div>
      </ScrollArea>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <Button variant="link" className="w-full">
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
