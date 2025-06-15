import React, { createContext, useContext, useState, useEffect } from "react";
import SmartAssignmentEngine, { Driver, Order as SmartOrder, AssignmentResult } from "@/utils/smartAssignmentEngine";
import RouteOptimizationEngine, { Location, OptimizedRoute } from "@/utils/routeOptimizationEngine";
import DynamicPricingEngine, { PricingFactors } from "@/utils/dynamicPricingEngine";
import MaintenanceScheduler, { Vehicle, MaintenanceAlert } from "@/utils/maintenanceScheduler";
import mobileIntegrationService from "@/services/mobileIntegrationService";

interface Order {
  id: string;
  customer: string;
  customerPhone: string;
  location: string;
  pickupLocation?: string;
  time: string;
  date: string;
  amount: number;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDate?: string;
  wasteType: string;
  lorryType?: string;
  distance?: string;
  estimatedDuration?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  nearestBin?: {
    name: string;
    distance: string;
    location: string;
    capacity: string;
    type: string;
  };
  coordinates?: { lat: number; lng: number };
  estimatedWeight?: number;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle: string;
  status: 'active' | 'offline' | 'maintenance';
  location: string;
  coordinates?: { lat: number; lng: number };
  rating: number;
  completedOrders?: number;
  totalEarnings?: number;
  icNumber?: string;
  capacity?: number;
  currentLoad?: number;
  expertise?: string[];
}

interface OrderContextType {
  orders: Order[];
  drivers: Driver[];
  vehicles: Vehicle[];
  maintenanceAlerts: MaintenanceAlert[];
  optimizedRoutes: OptimizedRoute[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  assignOrderToDriver: (orderId: string, driverId: string, driverName: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  smartAssignOrder: (orderId: string) => AssignmentResult | null;
  optimizeDriverRoutes: () => void;
  calculateDynamicPrice: (factors: PricingFactors) => number;
  generateMaintenanceAlerts: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customer: "Ahmad Building Supplies",
      customerPhone: "+60123456789",
      location: "Jalan Ampang, Kuala Lumpur",
      time: "09:30 AM",
      date: "2024-03-15",
      amount: 250.00,
      status: "pending",
      priority: "high",
      wasteType: "Construction Debris",
      paymentStatus: "pending",
      coordinates: { lat: 3.1598, lng: 101.7131 },
      estimatedWeight: 500,
      nearestBin: {
        name: "Central Collection Point",
        distance: "2.5 km",
        location: "Industrial Area",
        capacity: "75%",
        type: "General Waste"
      }
    },
    {
      id: "ORD002",
      customer: "Sarah Lim",
      customerPhone: "+60198765432",
      location: "Taman Desa, Kuala Lumpur",
      time: "02:00 PM",
      date: "2024-03-15",
      amount: 180.00,
      status: "assigned",
      priority: "medium",
      assignedDriverId: "DRV001",
      assignedDriverName: "John Doe",
      assignedDate: "2024-03-15",
      wasteType: "Household Waste",
      paymentStatus: "paid",
      coordinates: { lat: 3.0833, lng: 101.6833 },
      estimatedWeight: 150
    }
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "DRV001",
      name: "John Doe",
      phone: "+60123456789",
      email: "john.doe@lattisbin.com",
      vehicle: "Isuzu NPR 3.5T",
      status: "active",
      location: "Kuala Lumpur",
      coordinates: { lat: 3.1390, lng: 101.6869 },
      rating: 4.8,
      completedOrders: 156,
      totalEarnings: 15600.00,
      icNumber: "123456-78-9012",
      capacity: 3500,
      currentLoad: 0,
      expertise: ["Construction Debris", "Household Waste"]
    },
    {
      id: "DRV002",
      name: "Ali Hassan",
      phone: "+60198765432",
      email: "ali.hassan@lattisbin.com",
      vehicle: "Mitsubishi Canter 5T",
      status: "active",
      location: "Petaling Jaya",
      coordinates: { lat: 3.1073, lng: 101.6415 },
      rating: 4.6,
      completedOrders: 89,
      totalEarnings: 8900.00,
      icNumber: "987654-32-1098",
      capacity: 5000,
      currentLoad: 1200,
      expertise: ["Commercial Waste", "Recyclable Materials"]
    }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "VEH001",
      model: "Isuzu NPR 75",
      registration: "WA 1234 A",
      mileage: 45000,
      lastMaintenance: "2024-01-15",
      maintenanceInterval: 5000,
      timeBasedInterval: 6,
      alerts: []
    },
    {
      id: "VEH002",
      model: "Mitsubishi Canter",
      registration: "WA 5678 B",
      mileage: 52000,
      lastMaintenance: "2024-02-01",
      maintenanceInterval: 5000,
      timeBasedInterval: 6,
      alerts: []
    }
  ]);

  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([]);
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([]);

  // Initialize engines
  const smartAssignmentEngine = new SmartAssignmentEngine();
  const routeOptimizationEngine = new RouteOptimizationEngine();
  const dynamicPricingEngine = new DynamicPricingEngine();
  const maintenanceScheduler = new MaintenanceScheduler();

  // Initialize mobile service
  useEffect(() => {
    mobileIntegrationService.initialize();
  }, []);

  // Generate maintenance alerts on component mount and when vehicles change
  useEffect(() => {
    generateMaintenanceAlerts();
  }, [vehicles]);

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD${(orders.length + 1).toString().padStart(3, '0')}`
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `DRV${(drivers.length + 1).toString().padStart(3, '0')}`,
      completedOrders: 0,
      totalEarnings: 0,
      capacity: 3500,
      currentLoad: 0,
      expertise: ["General Waste"]
    };
    setDrivers(prev => [...prev, newDriver]);
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

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const smartAssignOrder = (orderId: string): AssignmentResult | null => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.coordinates) return null;

    const smartOrder: SmartOrder = {
      id: order.id,
      location: order.coordinates,
      wasteType: order.wasteType,
      estimatedWeight: order.estimatedWeight || 100,
      priority: order.priority,
      timeWindow: { start: "08:00", end: "18:00" }
    };

    const smartDrivers: SmartAssignmentEngine.Driver[] = drivers
      .filter(d => d.status === 'active' && d.coordinates)
      .map(d => ({
        id: d.id,
        name: d.name,
        location: d.coordinates!,
        status: d.status,
        rating: d.rating,
        vehicle: d.vehicle,
        capacity: d.capacity || 3500,
        currentLoad: d.currentLoad || 0,
        expertise: d.expertise || ["General Waste"]
      }));

    const assignment = smartAssignmentEngine.findBestDriverForOrder(smartDrivers, smartOrder);
    
    if (assignment) {
      assignOrderToDriver(orderId, assignment.driverId, 
        drivers.find(d => d.id === assignment.driverId)?.name || "Unknown Driver"
      );
    }

    return assignment;
  };

  const optimizeDriverRoutes = () => {
    const activeDriversWithOrders = drivers
      .filter(d => d.status === 'active' && d.coordinates)
      .map(driver => {
        const driverOrders = orders.filter(o => 
          o.assignedDriverId === driver.id && 
          o.status === 'assigned' && 
          o.coordinates
        );

        const locations: Location[] = driverOrders.map(order => ({
          id: order.id,
          lat: order.coordinates!.lat,
          lng: order.coordinates!.lng,
          address: order.location,
          serviceTime: 30, // 30 minutes average service time
          priority: order.priority === 'high' ? 8 : order.priority === 'medium' ? 5 : 3
        }));

        return {
          driverId: driver.id,
          currentLocation: {
            id: `driver-${driver.id}`,
            lat: driver.coordinates!.lat,
            lng: driver.coordinates!.lng,
            address: driver.location,
            serviceTime: 0,
            priority: 10
          },
          locations
        };
      })
      .filter(driver => driver.locations.length > 0);

    const constraints = {
      maxDistance: 100, // 100km max per route
      maxTime: 480, // 8 hours max
      vehicleCapacity: 5000, // 5 tons
      fuelEfficiency: 8, // 8km per liter
      fuelPrice: 2.5 // RM 2.50 per liter
    };

    const routes = activeDriversWithOrders.map(driver => 
      routeOptimizationEngine.optimizeRoute(
        driver.driverId,
        driver.locations,
        constraints,
        driver.currentLocation
      )
    );

    setOptimizedRoutes(routes);
  };

  const calculateDynamicPrice = (factors: PricingFactors): number => {
    const currentDemandData = {
      currentOrders: orders.filter(o => o.status === 'pending').length,
      averageOrders: 5 // Historical average
    };

    const result = dynamicPricingEngine.calculatePrice(factors, undefined, currentDemandData);
    return result.finalPrice;
  };

  const generateMaintenanceAlerts = () => {
    const alerts = maintenanceScheduler.generateMaintenanceAlerts(vehicles);
    setMaintenanceAlerts(alerts);
  };

  const value: OrderContextType = {
    orders,
    drivers,
    vehicles,
    maintenanceAlerts,
    optimizedRoutes,
    addOrder,
    addDriver,
    assignOrderToDriver,
    updateOrderStatus,
    smartAssignOrder,
    optimizeDriverRoutes,
    calculateDynamicPrice,
    generateMaintenanceAlerts
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
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
