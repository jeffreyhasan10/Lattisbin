
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, Driver as DriverType, MaintenanceSchedule } from "@/data/dummyData";
import mobileIntegrationService from "@/services/mobileIntegrationService";

export interface CollectionReminder {
  id: string;
  doNumber: string;
  doId: string;
  customerName: string;
  location: string;
  binSerialNumber: string;
  binSize: string;
  deliveryDate: string;
  reminderType: "same_day" | "term_based";
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "sent" | "overdue" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedDriver?: string;
  notes?: string;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  drivers: DriverType[];
  maintenanceSchedules: MaintenanceSchedule[];
  collectionReminders: CollectionReminder[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addDriver: (driver: Omit<DriverType, "id">) => void;
  updateDriver: (id: string, updates: Partial<DriverType>) => void;
  deleteDriver: (id: string) => void;
  assignOrderToDriver: (orderId: string, driverId: string) => void;
  scanQRCode: (qrData: string) => Promise<unknown>;
  capturePhoto: (file: File) => Promise<string>;
  syncOfflineData: () => Promise<void>;
  getDriverByCredentials: (driverId: string, lorryNumber: string) => DriverType | null;
  startOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  updatePaymentStatus: (orderId: string, status: string) => void;
  addCollectionReminder: (reminder: Omit<CollectionReminder, "id" | "createdAt">) => void;
  updateCollectionReminder: (id: string, updates: Partial<CollectionReminder>) => void;
  deleteCollectionReminder: (id: string) => void;
  getCollectionReminderByDO: (doNumber: string) => CollectionReminder | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [collectionReminders, setCollectionReminders] = useState<CollectionReminder[]>([]);

  // Initialize with dummy data
  useEffect(() => {
    const dummyOrders: Order[] = [
      {
        id: "1",
        customerName: "John Doe",
        pickupAddress: "123 Main St",
        deliveryAddress: "456 Oak Ave",
        status: "pending",
        binType: "Recycling",
        scheduledDate: "2024-06-15",
        price: 50,
        driverName: "",
        estimatedDuration: 60,
        priority: "medium",
        customer: "John Doe",
        customerPhone: "+60123456789",
        location: "Kuala Lumpur",
        date: "2024-06-15",
        time: "09:00",
        wasteType: "Recycling",
        lorryType: "Small",
        assignedDriverName: "",
        assignedDriverId: "",
        assignedDate: "",
        paymentStatus: "pending",
        amount: 50
      },
      {
        id: "2", 
        customerName: "Jane Smith",
        pickupAddress: "789 Pine Rd",
        deliveryAddress: "321 Elm St",
        status: "assigned",
        binType: "Waste",
        scheduledDate: "2024-06-16",
        price: 75,
        driverName: "Mike Johnson",
        estimatedDuration: 90,
        priority: "high",
        customer: "Jane Smith",
        customerPhone: "+60123456790",
        location: "Petaling Jaya",
        date: "2024-06-16",
        time: "10:00",
        wasteType: "Waste",
        lorryType: "Medium",
        assignedDriverName: "Mike Johnson",
        assignedDriverId: "1",
        assignedDate: "2024-06-15",
        paymentStatus: "pending",
        amount: 75
      }
    ];

    const dummyDrivers: DriverType[] = [
      {
        id: "1",
        name: "Mike Johnson",
        status: "active",
        currentLocation: "Downtown",
        totalDeliveries: 245,
        rating: 4.8,
        phone: "+1234567890",
        email: "mike@example.com",
        vehicle: "Truck-001",
        location: "Downtown",
        icNumber: "920815-14-5678",
        driverIdPermanent: "DRV001",
        assignedLorryNumbers: ["LORRY-1001", "LORRY-1002"],
        completedOrders: 245,
        totalEarnings: 5000
      },
      {
        id: "2",
        name: "Sarah Wilson", 
        status: "active",
        currentLocation: "Uptown",
        totalDeliveries: 180,
        rating: 4.9,
        phone: "+1234567891",
        email: "sarah@example.com",
        vehicle: "Truck-002",
        location: "Uptown",
        icNumber: "880422-05-1234",
        driverIdPermanent: "DRV002",
        assignedLorryNumbers: ["LORRY-2001"],
        completedOrders: 180,
        totalEarnings: 4200
      }
    ];

    setOrders(dummyOrders);
    setDrivers(dummyDrivers);
  }, []);

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const addDriver = (driver: Omit<DriverType, "id">) => {
    const newDriver: DriverType = {
      ...driver,
      id: Date.now().toString(),
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const updateDriver = (id: string, updates: Partial<DriverType>) => {
    setDrivers(prev => 
      prev.map(driver => 
        driver.id === id ? { ...driver, ...updates } : driver
      )
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
  };

  const assignOrderToDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      updateOrder(orderId, { 
        status: "assigned", 
        driverName: driver.name,
        assignedDriverId: driverId,
        assignedDriverName: driver.name,
        assignedDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const scanQRCode = async (qrData: string): Promise<unknown> => {
    return await mobileIntegrationService.processQRScan(qrData);
  };

  const capturePhoto = async (file: File): Promise<string> => {
    return await mobileIntegrationService.capturePhoto(file);
  };

  const syncOfflineData = async () => {
    await mobileIntegrationService.syncOfflineData();
  };

  const getDriverByCredentials = (driverId: string, lorryNumber: string): DriverType | null => {
    const normalizedId = driverId.trim().toUpperCase();
    const normalizedLorry = lorryNumber.trim().toUpperCase();
    const found = drivers.find(d => 
      (d.driverIdPermanent?.toUpperCase() === normalizedId) &&
      (d.assignedLorryNumbers || []).map(x => x.toUpperCase()).includes(normalizedLorry)
    );
    return found || null;
  };

  const startOrder = (orderId: string) => {
    updateOrder(orderId, { status: "in-progress" });
  };

  const completeOrder = (orderId: string) => {
    updateOrder(orderId, { status: "completed" });
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrder(orderId, { status: "cancelled" });
  };

  const updatePaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    updateOrder(orderId, { paymentStatus: status });
  };

  // Collection Reminder functions
  const addCollectionReminder = (reminder: Omit<CollectionReminder, "id" | "createdAt">) => {
    const newReminder: CollectionReminder = {
      ...reminder,
      id: `REM-${String(collectionReminders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
    };
    setCollectionReminders(prev => [...prev, newReminder]);
  };

  const updateCollectionReminder = (id: string, updates: Partial<CollectionReminder>) => {
    setCollectionReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteCollectionReminder = (id: string) => {
    setCollectionReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const getCollectionReminderByDO = (doNumber: string) => {
    return collectionReminders.find(r => r.doNumber === doNumber);
  };

  const value: OrderContextType = {
    orders,
    drivers,
    maintenanceSchedules,
    collectionReminders,
    addOrder,
    updateOrder,
    deleteOrder,
    addDriver,
    updateDriver,
    deleteDriver,
    assignOrderToDriver,
    scanQRCode,
    capturePhoto,
    syncOfflineData,
    getDriverByCredentials,
    startOrder,
    completeOrder,
    cancelOrder,
    updatePaymentStatus,
    addCollectionReminder,
    updateCollectionReminder,
    deleteCollectionReminder,
    getCollectionReminderByDO,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
