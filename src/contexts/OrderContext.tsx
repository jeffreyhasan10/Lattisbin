
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, Driver as DriverType, MaintenanceSchedule } from "@/data/dummyData";
import SmartAssignmentEngine from "@/utils/smartAssignmentEngine";
import RouteOptimizationEngine from "@/utils/routeOptimizationEngine";
import DynamicPricingEngine from "@/utils/dynamicPricingEngine";
import { MaintenanceScheduler } from "@/utils/maintenanceScheduler";
import mobileIntegrationService from "@/services/mobileIntegrationService";

interface OrderContextType {
  orders: Order[];
  drivers: DriverType[];
  maintenanceSchedules: MaintenanceSchedule[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addDriver: (driver: Omit<DriverType, "id">) => void;
  updateDriver: (id: string, updates: Partial<DriverType>) => void;
  deleteDriver: (id: string) => void;
  assignOrderToDriver: (orderId: string, driverId: string) => void;
  optimizeRoutes: (driverId: string) => any;
  calculateDynamicPrice: (order: Order) => number;
  scheduleMaintenanceAlert: (vehicleId: string) => void;
  scanQRCode: (qrData: string) => Promise<any>;
  capturePhoto: (file: File) => Promise<string>;
  syncOfflineData: () => Promise<void>;
  getDriverByCredentials: (username: string, password: string) => DriverType | null;
  startOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  updatePaymentStatus: (orderId: string, status: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);

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

  const optimizeRoutes = (driverId: string) => {
    const driverOrders = orders.filter(o => 
      o.status === "assigned" && 
      drivers.find(d => d.id === driverId)?.name === o.driverName
    );
    return RouteOptimizationEngine.calculateRouteMetrics(driverOrders);
  };

  const calculateDynamicPrice = (order: Order): number => {
    return DynamicPricingEngine.calculatePrice({
      basePrice: order.price,
      distance: 10, // Mock distance
      demandMultiplier: 1.2,
      timeOfDay: new Date().getHours(),
      binType: order.binType,
      urgency: order.priority === 'high' ? 'urgent' : 'normal'
    });
  };

  const scheduleMaintenanceAlert = (vehicleId: string) => {
    const schedule = MaintenanceScheduler.scheduleNextMaintenance(vehicleId, new Date());
    setMaintenanceSchedules(prev => [...prev, schedule]);
  };

  const scanQRCode = async (qrData: string) => {
    return await mobileIntegrationService.processQRScan(qrData);
  };

  const capturePhoto = async (file: File): Promise<string> => {
    return await mobileIntegrationService.capturePhoto(file);
  };

  const syncOfflineData = async () => {
    await mobileIntegrationService.syncOfflineData();
  };

  const getDriverByCredentials = (username: string, password: string): DriverType | null => {
    return drivers.find(d => d.email === username || d.name === username) || null;
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

  const updatePaymentStatus = (orderId: string, status: string) => {
    updateOrder(orderId, { paymentStatus: status as any });
  };

  const value: OrderContextType = {
    orders,
    drivers,
    maintenanceSchedules,
    addOrder,
    updateOrder,
    deleteOrder,
    addDriver,
    updateDriver,
    deleteDriver,
    assignOrderToDriver,
    optimizeRoutes,
    calculateDynamicPrice,
    scheduleMaintenanceAlert,
    scanQRCode,
    capturePhoto,
    syncOfflineData,
    getDriverByCredentials,
    startOrder,
    completeOrder,
    cancelOrder,
    updatePaymentStatus,
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
