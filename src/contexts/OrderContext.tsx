import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderType {
  id: string;
  customer: string;
  customerPhone: string;
  location: string;
  pickupLocation: string;
  time: string;
  date: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  amount: number;
  priority: 'high' | 'medium' | 'low';
  wasteType: string;
  lorryType: string;
  distance: string;
  estimatedDuration: string;
  notes: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDate?: string;
  nearestBin: {
    name: string;
    distance: string;
    location: string;
    capacity: string;
    type: string;
  };
  driverNotes?: string;
  startedTime?: string;
  completedTime?: string;
  cancelledTime?: string;
  cancelReason?: string;
  paidAmount?: number;
  paidDate?: string;
}

export interface DriverType {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'active' | 'maintenance' | 'offline';
  location: string;
  orders: number;
  rating: number;
  email?: string;
  icNumber?: string;
  joinDate?: string;
  totalEarnings?: number;
  completedOrders?: number;
  loginCredentials?: {
    username: string;
    password: string;
  };
}

interface OrderContextType {
  orders: OrderType[];
  drivers: DriverType[];
  addOrder: (order: Omit<OrderType, 'id'>) => void;
  updateOrder: (orderId: string, updates: Partial<OrderType>) => void;
  assignOrderToDriver: (orderId: string, driverId: string, driverName: string) => void;
  getOrdersByDriver: (driverId: string) => OrderType[];
  getUnassignedOrders: () => OrderType[];
  startOrder: (orderId: string) => void;
  completeOrder: (orderId: string, driverNotes?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  addDriver: (driver: Omit<DriverType, 'id'>) => void;
  updateDriver: (driverId: string, updates: Partial<DriverType>) => void;
  updatePaymentStatus: (orderId: string, paymentData: { status: 'paid' | 'pending' | 'overdue'; amount?: number; date?: string }) => void;
  getDriverByCredentials: (name: string, icNumber: string, phone: string) => DriverType | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<OrderType[]>([
    {
      id: "ORD001",
      customer: "ABC Construction Sdn Bhd",
      customerPhone: "+60123456789",
      location: "Jalan Ampang, Kuala Lumpur",
      pickupLocation: "Taman Tun Dr Ismail",
      time: "09:30 AM",
      date: "2024-01-15",
      status: "assigned",
      amount: 350.00,
      priority: "high",
      wasteType: "Construction Debris",
      lorryType: "5 Ton Lorry",
      distance: "12.5 km",
      estimatedDuration: "45 min",
      notes: "Large construction waste, requires proper handling",
      paymentStatus: "pending",
      assignedDriverId: "DRV001",
      assignedDriverName: "Ahmad Rahman",
      assignedDate: "2024-01-15",
      nearestBin: {
        name: "Central Waste Collection Point",
        distance: "2.3 km",
        location: "Jalan Sultan Ismail, KL",
        capacity: "80%",
        type: "Construction Waste"
      }
    },
    {
      id: "ORD002",
      customer: "Sunshine Apartments",
      customerPhone: "+60198765432",
      location: "Petaling Jaya, Selangor",
      pickupLocation: "Block A Parking Area",
      time: "02:30 PM",
      date: "2024-01-15",
      status: "pending",
      amount: 280.00,
      priority: "medium",
      wasteType: "Household Waste",
      lorryType: "3 Ton Truck",
      distance: "8.2 km",
      estimatedDuration: "30 min",
      notes: "Regular household waste collection",
      paymentStatus: "pending",
      nearestBin: {
        name: "PJ Community Center Bin",
        distance: "0.9 km",
        location: "Jalan 14/20, Petaling Jaya",
        capacity: "65%",
        type: "General Waste"
      }
    },
    {
      id: "ORD003",
      customer: "Tech Plaza Mall",
      customerPhone: "+60177654321",
      location: "Mid Valley, KL",
      pickupLocation: "Loading Bay B",
      time: "11:00 AM",
      date: "2024-01-15",
      status: "in-progress",
      amount: 520.00,
      priority: "high",
      wasteType: "Commercial Waste",
      lorryType: "7 Ton Lorry",
      distance: "15.3 km",
      estimatedDuration: "60 min",
      notes: "Mall waste collection - mixed materials",
      paymentStatus: "pending",
      assignedDriverId: "DRV002",
      assignedDriverName: "Lim Wei Ming",
      assignedDate: "2024-01-14",
      startedTime: "10:45 AM",
      nearestBin: {
        name: "Mid Valley Waste Center",
        distance: "1.2 km",
        location: "Jalan Syed Putra, KL",
        capacity: "70%",
        type: "Commercial Waste"
      }
    }
  ]);

  const [drivers, setDrivers] = useState<DriverType[]>([
    {
      id: "DRV001",
      name: "Ahmad Rahman",
      phone: "+60 12-345 6789",
      vehicle: "Lorry WMD1234",
      status: "active",
      location: "KLCC, KL",
      orders: 2,
      rating: 4.8,
      email: "ahmad.rahman@lattisbin.com",
      icNumber: "920815-14-5678",
      joinDate: "2023-01-15",
      totalEarnings: 2500.00,
      completedOrders: 45,
      loginCredentials: {
        username: "ahmad.rahman",
        password: "driver123"
      }
    },
    {
      id: "DRV002",
      name: "Lim Wei Ming",
      phone: "+60 16-789 0123",
      vehicle: "Truck ABC5678",
      status: "active",
      location: "Petaling Jaya",
      orders: 1,
      rating: 4.6,
      email: "lim.weiming@lattisbin.com",
      icNumber: "880422-05-1234",
      joinDate: "2023-03-10",
      totalEarnings: 1800.00,
      completedOrders: 32,
      loginCredentials: {
        username: "lim.weiming",
        password: "driver456"
      }
    },
    {
      id: "DRV003",
      name: "Raj Kumar",
      phone: "+60 19-456 7890",
      vehicle: "Van DEF9012",
      status: "maintenance",
      location: "Service Center",
      orders: 0,
      rating: 4.9,
      email: "raj.kumar@lattisbin.com",
      icNumber: "750905-11-2345",
      joinDate: "2022-11-05",
      totalEarnings: 3200.00,
      completedOrders: 67,
      loginCredentials: {
        username: "raj.kumar",
        password: "driver789"
      }
    }
  ]);

  const addOrder = (orderData: Omit<OrderType, 'id'>) => {
    const newOrder: OrderType = {
      id: `ORD${String(Date.now()).slice(-6)}`,
      ...orderData,
      status: 'pending'
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrder = (orderId: string, updates: Partial<OrderType>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, ...updates }
        : order
    ));
  };

  const assignOrderToDriver = (orderId: string, driverId: string, driverName: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'assigned' as const,
            assignedDriverId: driverId,
            assignedDriverName: driverName,
            assignedDate: new Date().toISOString().split('T')[0]
          }
        : order
    ));
  };

  const getOrdersByDriver = (driverId: string) => {
    return orders.filter(order => order.assignedDriverId === driverId);
  };

  const getUnassignedOrders = () => {
    return orders.filter(order => order.status === 'pending' && !order.assignedDriverId);
  };

  const startOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'in-progress' as const,
            startedTime: new Date().toLocaleTimeString()
          }
        : order
    ));
  };

  const completeOrder = (orderId: string, driverNotes?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'completed' as const,
            completedTime: new Date().toLocaleTimeString(),
            driverNotes: driverNotes || order.driverNotes
          }
        : order
    ));
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'cancelled' as const,
            cancelledTime: new Date().toLocaleTimeString(),
            cancelReason: reason
          }
        : order
    ));
  };

  // New driver management functions
  const addDriver = (driverData: Omit<DriverType, 'id'>) => {
    const newDriver: DriverType = {
      id: `DRV${String(Date.now()).slice(-6)}`,
      ...driverData,
      orders: 0,
      rating: 5.0,
      totalEarnings: 0,
      completedOrders: 0
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const updateDriver = (driverId: string, updates: Partial<DriverType>) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, ...updates }
        : driver
    ));
  };

  const updatePaymentStatus = (orderId: string, paymentData: { status: 'paid' | 'pending' | 'overdue'; amount?: number; date?: string }) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            paymentStatus: paymentData.status,
            paidAmount: paymentData.amount || order.paidAmount,
            paidDate: paymentData.date || order.paidDate
          }
        : order
    ));

    // Update driver earnings if payment is completed
    if (paymentData.status === 'paid') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.assignedDriverId) {
        setDrivers(prev => prev.map(driver => 
          driver.id === order.assignedDriverId 
            ? { 
                ...driver, 
                totalEarnings: (driver.totalEarnings || 0) + (paymentData.amount || order.amount),
                completedOrders: (driver.completedOrders || 0) + 1
              }
            : driver
        ));
      }
    }
  };

  const getDriverByCredentials = (name: string, icNumber: string, phone: string) => {
    return drivers.find(driver => 
      driver.name === name && 
      driver.icNumber === icNumber && 
      driver.phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, '')
    ) || null;
  };

  const value: OrderContextType = {
    orders,
    drivers,
    addOrder,
    updateOrder,
    assignOrderToDriver,
    getOrdersByDriver,
    getUnassignedOrders,
    startOrder,
    completeOrder,
    cancelOrder,
    addDriver,
    updateDriver,
    updatePaymentStatus,
    getDriverByCredentials
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
