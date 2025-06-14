import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BellRing, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Truck, 
  FileText, 
  Package2,
  User,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

// Notification types
type NotificationType = "info" | "warning" | "success" | "alert";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: string;
  category: "system" | "order" | "customer";
}

// Sample notification data
const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "alert",
    title: "Lorry JHE 8823 Maintenance Due",
    message: "The road tax for lorry JHE 8823 will expire in 7 days. Please renew it before 22 April 2024.",
    time: "10 minutes ago",
    read: false,
    category: "system"
  },
  {
    id: 2,
    type: "info",
    title: "New Customer Registration",
    message: "A new customer 'MegaTech Solutions' has been registered in the system.",
    time: "1 hour ago",
    read: false,
    category: "customer"
  },
  {
    id: 3,
    type: "success",
    title: "Invoice Payment Received",
    message: "Payment for invoice INV-2024-0003 has been received from Johor Construction Co.",
    time: "3 hours ago",
    read: true,
    category: "order"
  },
  {
    id: 4,
    type: "warning",
    title: "Bin Rental Expiring Soon",
    message: "The bin rental for customer 'Eastern Metal Works' will expire in 2 days.",
    time: "5 hours ago",
    read: true,
    category: "order"
  },
  {
    id: 5,
    type: "info",
    title: "System Update Available",
    message: "A new system update is available. Click here to view the changelog.",
    time: "1 day ago",
    read: true,
    action: "View Details",
    category: "system"
  },
  {
    id: 6,
    type: "success",
    title: "Collection Completed",
    message: "Waste collection at 'Greentech Recyclers' has been successfully completed.",
    time: "1 day ago",
    read: true,
    category: "order"
  },
  {
    id: 7,
    type: "info",
    title: "Driver Assigned",
    message: "Ahmad Zulkifli has been assigned to delivery order DO-2024-0005.",
    time: "2 days ago",
    read: true,
    category: "system"
  },
  {
    id: 8,
    type: "warning",
    title: "Low Inventory Alert",
    message: "Only 2 bins of size '10 Yard' are available in inventory.",
    time: "2 days ago",
    read: true,
    category: "system"
  }
];

const NotificationsPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    return notification.category === activeTab;
  });
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Mark a single notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Delete a single notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const notificationVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  const badgeVariants = {
    initial: { scale: 1 },
    pulse: { scale: [1, 1.1, 1], transition: { duration: 0.6, repeat: 1 } }
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-4 bg-gradient-to-r from-primary/95 to-primary/70 text-primary-foreground">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight font-display">Notifications</h3>
          <motion.div
            variants={badgeVariants}
            initial="initial"
            animate={unreadCount > 0 ? "pulse" : "initial"}
            key={unreadCount} // Trigger animation on count change
          >
            <Badge variant="secondary" className="bg-white/30 text-white hover:bg-white/40 text-xs font-medium">
              {unreadCount} New
            </Badge>
          </motion.div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-3 pb-2">
          <TabsList className="grid grid-cols-3 w-full bg-gray-100 rounded-lg p-1">
            {["all", "system", "order"].map((tab) => (
              <motion.div
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TabsTrigger 
                  value={tab} 
                  className="text-sm font-medium capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                >
                  {tab === "all" ? "All" : tab === "system" ? "System" : "Orders"}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value="all" className="m-0">
          <NotificationList 
            notifications={filteredNotifications} 
            markAsRead={markAsRead} 
            deleteNotification={deleteNotification}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>
        
        <TabsContent value="system" className="m-0">
          <NotificationList 
            notifications={filteredNotifications} 
            markAsRead={markAsRead} 
            deleteNotification={deleteNotification}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>
        
        <TabsContent value="order" className="m-0">
          <NotificationList 
            notifications={filteredNotifications} 
            markAsRead={markAsRead} 
            deleteNotification={deleteNotification}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>
      </Tabs>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs font-medium text-primary hover:bg-primary/10"
            onClick={markAllAsRead}
          >
            Mark All Read
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            onClick={clearAllNotifications}
          >
            Clear All
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  getNotificationIcon: (type: NotificationType) => React.ReactNode;
}

const NotificationList = ({ notifications, markAsRead, deleteNotification, getNotificationIcon }: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-8 text-center text-gray-500"
      >
        <BellRing className="h-10 w-10 mx-auto mb-2 opacity-20" />
        <p className="text-sm font-medium">No notifications to display</p>
      </motion.div>
    );
  }
  
  return (
    <ScrollArea className="h-[350px]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex items-start p-4 hover:bg-gray-50 transition-colors rounded-lg mx-2 my-1 ${
              !notification.read ? 'bg-gradient-to-r from-blue-50 to-white' : ''
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="flex-shrink-0 p-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {getNotificationIcon(notification.type)}
            </motion.div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <p className={`text-sm font-medium ${!notification.read ? 'text-navy' : 'text-gray-700'} tracking-tight`}>
                  {notification.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{notification.time}</span>
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
              <div className="mt-2 flex items-center justify-between">
                {!notification.read && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto text-xs text-primary font-medium hover:text-primary/80"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  </motion.div>
                )}
                {notification.action && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto text-xs text-primary font-medium hover:text-primary/80"
                    >
                      {notification.action}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
};

export default NotificationsPanel;