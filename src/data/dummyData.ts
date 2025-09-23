
export interface Order {
  id: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  binType: "Recycling" | "Waste" | "Compost";
  scheduledDate: string;
  price: number;
  driverName: string;
  estimatedDuration: number;
  priority: "low" | "medium" | "high";
  customer: string;
  customerPhone: string;
  location: string;
  date: string;
  time: string;
  wasteType: string;
  lorryType: string;
  assignedDriverName: string;
  assignedDriverId: string;
  assignedDate: string;
  paymentStatus: "pending" | "paid" | "overdue";
  amount: number;
  paidAmount?: number;
}

export interface Driver {
  id: string;
  name: string;
  status: "active" | "inactive" | "on-break" | "maintenance" | "offline";
  currentLocation: string;
  totalDeliveries: number;
  rating: number;
  phone: string;
  email: string;
  vehicle: string;
  location: string;
  icNumber?: string;
  completedOrders?: number;
  totalEarnings?: number;
  
  // Authentication fields
  driverIdPermanent?: string; // Permanent Driver ID used for login
  assignedLorryNumbers?: string[]; // List of lorry numbers the driver may operate
  
  // Enhanced driver profile fields
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  employeeId?: string;
  dateJoined?: string;
  position?: string;
  department?: string;
  vehicleRegistration?: string;
  licenseNumber?: string;
  licenseClass?: string;
  licenseExpiry?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  baseSalary?: number;
  commissionRate?: number;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  type: string;
  scheduledDate: string;
  estimatedCost: number;
  priority: "low" | "medium" | "high" | "critical";
  status: "scheduled" | "in-progress" | "completed" | "overdue";
  description: string;
  technician: string;
  estimatedDuration: number;
}
