
import {
  Building2,
  Users,
  Package2,
  Truck,
  UserCheck,
  Upload,
  CalendarRange,
  FileText,
  BarChart3,
  Settings,
  DollarSign,
  Receipt,
} from "lucide-react";

export const menuItems = [
  {
    group: "systemSetup",
    label: "System Setup",
    items: [
      { tab: "business-register", label: "Business Registration", icon: Building2 },
      { tab: "customer-register", label: "Customer Registration", icon: Users },
      { tab: "bin-register", label: "Bin Registration", icon: Package2 },
      { tab: "lorry-register", label: "Lorry Registration", icon: Truck },
      { tab: "rentable-lorry-register", label: "Rentable Lorry Registration", icon: Truck },
      { tab: "driver-register", label: "Driver Registration", icon: UserCheck },
      { tab: "waste-item-register", label: "Waste Item Registration", icon: Upload },
    ],
  },
  {
    group: "management",
    label: "Management",
    items: [
      { tab: "company", label: "Company Details", icon: Building2 },
      { tab: "drivers", label: "Driver Management", icon: UserCheck, badge: "New" },
      { tab: "driver-details", label: "Driver Details", icon: UserCheck },
      { tab: "customers", label: "Customers", icon: Users, badge: "New" },
      { tab: "bins", label: "Bins", icon: Package2 },
      { tab: "lorries", label: "Lorries", icon: Truck },
    ],
  },
  {
    group: "operations",
    label: "Operations",
    items: [
      { tab: "waste", label: "Collections", icon: Upload, badge: "5" },
      { tab: "bookings", label: "Bookings", icon: CalendarRange, badge: "12" },
    ],
  },
  {
    group: "financials",
    label: "Financials",
    items: [
      { tab: "invoices", label: "Invoices", icon: FileText },
      { tab: "commissions", label: "Commissions", icon: DollarSign },
      { tab: "refunds", label: "Refunds", icon: Receipt },
      { tab: "expenses", label: "Expenses", icon: DollarSign },
    ],
  },
  {
    group: "analytics",
    label: "Analytics",
    items: [{ tab: "reports", label: "Reports", icon: BarChart3 }],
  },
  {
    group: "system",
    label: "System",
    items: [{ tab: "settings", label: "Settings", icon: Settings }],
  },
];
