import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  Filter,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "success",
    title: "Collection Completed",
    description: "Bin #12345 collected from ABC Construction successfully",
    customer: "ABC Construction Sdn Bhd",
    driver: "Ahmad Rahman",
    amount: 350.00,
    location: "KLCC, KL",
    time: "2 minutes ago",
    read: false,
    priority: "high"
  },
  {
    id: "2",
    type: "info",
    title: "New Booking Assigned",
    description: "Driver assigned to Sunshine Apartments delivery",
    customer: "Sunshine Apartments",
    driver: "Lim Wei Ming",
    amount: 280.00,
    location: "Petaling Jaya",
    time: "15 minutes ago",
    read: false,
    priority: "medium"
  },
  {
    id: "3",
    type: "warning",
    title: "Maintenance Required",
    description: "Lorry #WMD1234 due for scheduled maintenance",
    customer: null,
    driver: "Raj Kumar",
    amount: null,
    location: "Service Center",
    time: "1 hour ago",
    read: true,
    priority: "medium"
  },
  {
    id: "4",
    type: "error",
    title: "Payment Overdue",
    description: "Invoice #INV0003 payment is overdue",
    customer: "Tech Plaza Mall",
    driver: null,
    amount: 520.00,
    location: "Mid Valley, KL",
    time: "2 hours ago",
    read: true,
    priority: "high"
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50";
      case "info": return "border-blue-200 bg-blue-50";
      case "warning": return "border-yellow-200 bg-yellow-50"; 
      case "error": return "border-red-200 bg-red-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
  <Button
    variant="outline"
    size="sm"
    className="relative inline-flex items-center text-black hover:bg-transparent hover:text-black"
  >
    <Bell className="h-4 w-4 mr-2" />
    Notifications
    {unreadCount > 0 && (
      <Badge 
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 inline-flex items-center justify-center bg-red-500 text-white text-xs pointer-events-none"
      >
        {unreadCount}
      </Badge>
    )}
  </Button>
</DialogTrigger>

      <DialogContent className="max-w-2xl h-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Notifications ({notifications.length})
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
          <DialogDescription>
            Stay updated with your latest activities and alerts
          </DialogDescription>
        </DialogHeader>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b pb-4">
          {["all", "unread", "success", "info", "warning", "error"].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="capitalize"
            >
              {filterType === "all" ? "All" : filterType === "unread" ? "Unread" : filterType}
            </Button>
          ))}
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                  notification.read 
                    ? "bg-white border-l-gray-300" 
                    : `${getTypeColor(notification.type)} border-l-blue-500`
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {notification.customer && (
                            <span className="font-medium">{notification.customer}</span>
                          )}
                          {notification.driver && (
                            <span>Driver: {notification.driver}</span>
                          )}
                          <span>{notification.location}</span>
                        </div>
                        {notification.amount && (
                          <span className="font-bold text-green-600">
                            RM {notification.amount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCenter;
