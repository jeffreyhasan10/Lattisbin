import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, AlertTriangle, Truck, MapPin, DollarSign, X } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import ReactDOM from "react-dom";

interface Notification {
  id: string;
  type: 'order' | 'driver' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionable?: boolean;
  orderId?: string;
  driverId?: string;
}

const LiveNotifications: React.FC = () => {
  const { orders, drivers } = useOrders();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Generate real-time notifications
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Order status notifications
      orders.forEach(order => {
        if (order.status === 'assigned' && !notifications.find(n => n.orderId === order.id && n.type === 'order')) {
          newNotifications.push({
            id: `order-${order.id}-${Date.now()}`,
            type: 'order',
            title: 'Order Assigned',
            message: `Order ${order.id} assigned to ${order.assignedDriverName}`,
            timestamp: new Date(),
            read: false,
            priority: 'medium',
            actionable: true,
            orderId: order.id,
            driverId: order.assignedDriverId
          });
        }

        if (order.status === 'completed' && !notifications.find(n => n.orderId === order.id && n.message.includes('completed'))) {
          newNotifications.push({
            id: `completed-${order.id}-${Date.now()}`,
            type: 'order',
            title: 'Order Completed',
            message: `Order ${order.id} completed by ${order.assignedDriverName}`,
            timestamp: new Date(),
            read: false,
            priority: 'low',
            actionable: false,
            orderId: order.id
          });
        }
      });

      // Driver status notifications
      drivers.forEach(driver => {
        if (driver.status === 'offline' && !notifications.find(n => n.driverId === driver.id && n.message.includes('offline'))) {
          newNotifications.push({
            id: `driver-offline-${driver.id}-${Date.now()}`,
            type: 'driver',
            title: 'Driver Offline',
            message: `${driver.name} went offline`,
            timestamp: new Date(),
            read: false,
            priority: 'medium',
            actionable: true,
            driverId: driver.id
          });
        }
      });

      // Payment notifications
      const pendingPayments = orders.filter(o => o.paymentStatus === 'pending');
      if (pendingPayments.length > 0 && !notifications.find(n => n.type === 'payment' && n.message.includes('pending'))) {
        newNotifications.push({
          id: `payment-${Date.now()}`,
          type: 'payment',
          title: 'Pending Payments',
          message: `${pendingPayments.length} payments pending collection`,
          timestamp: new Date(),
          read: false,
          priority: 'high',
          actionable: true
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 50)); // Keep last 50 notifications
        setUnreadCount(prev => prev + newNotifications.length);
      }
    };

    const interval = setInterval(generateNotifications, 10000); // Check every 10 seconds
    generateNotifications(); // Initial check

    return () => clearInterval(interval);
  }, [orders, drivers, notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'driver': return <Truck className="h-4 w-4 text-green-500" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'system': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Open dropdown and set position
  const handleOpen = () => {
    setIsOpen((prev) => {
      if (!prev && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right - 384 + window.scrollX, // 384px = w-96
        });
      }
      return !prev;
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && dropdownPosition && ReactDOM.createPortal(
        <Card
          className="fixed w-96 max-h-96 overflow-hidden shadow-lg z-[9999]"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 border-l-4 ${getPriorityColor(notification.priority)} ${
                      notification.read ? 'opacity-60' : ''
                    } hover:bg-gray-50 cursor-pointer`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                        {notification.actionable && (
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>,
        document.body
      )}
    </div>
  );
};

export default LiveNotifications;
