import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Users, Package2, Truck, FileText, BarChart3, Calendar, Download, ShoppingCart,
  UserPlus, Percent, XCircle
} from 'lucide-react';

// TypeScript Interfaces
interface SalesSummary {
  totalSales: string;
  monthlyGrowth: string;
  averageInvoice: string;
  pendingPayments: string;
}

interface BinUtilization {
  totalBins: number;
  inUse: number;
  utilization: string;
  mostPopularSize: string;
  highestAreaUsage: string;
  averageRentalDuration: string;
}

interface LorryPerformance {
  totalTrips: number;
  averageTripsPerDay: number;
  topPerformingLorry: string;
  fuelCosts: string;
}

interface BookingsSummary {
  totalBookings: number;
  completed: number;
  pending: number;
  cancellationRate: string;
  averageBookingValue: string;
}

interface InvoicesSummary {
  totalInvoices: number;
  paid: number;
  outstanding: number;
  averageInvoiceAmount: string;
  overdue: number;
  collectionRate: string;
}

interface CustomerDetail {
  totalCustomers: number;
  newCustomers: number;
  retentionRate: string;
  avgRevenuePerCustomer: string;
}

interface Expenses {
  totalExpenses: string;
  fuelCosts: string;
  maintenanceCosts: string;
  otherCosts: string;
}

interface InventoryBinRecord {
  totalBins: number;
  inMaintenance: number;
  availableBins: number;
  avgRentalDays: string;
}

interface RentableLorry {
  totalLorries: number;
  availableLorries: number;
  rentedLorries: number;
  avgRentalDuration: string;
}

interface AddItem {
  totalItemsAdded: number;
  mostAddedItem: string;
  avgItemValue: string;
  itemsPendingApproval: number;
}

interface Driver {
  totalDrivers: number;
  activeDrivers: number;
  tripsPerDriver: number;
  avgDriverRating: number;
}

interface BookingBin {
  totalBinBookings: number;
  completedBookings: number;
  avgBookingValue: string;
  peakBookingDay: string;
}

interface DeliverOrder {
  totalDeliveries: number;
  onTimeDeliveries: number;
  avgDeliveryTime: string;
  deliverySuccessRate: string;
}

interface Commission {
  totalCommission: string;
  avgCommissionPerSale: string;
  topAgent: string;
  topAgentCommission: string;
}

interface RefundCancelJob {
  totalRefunds: number;
  totalCancellations: number;
  refundAmount: string;
  cancellationRate: string;
}

interface ReportData {
  salesSummary: SalesSummary;
  binUtilization: BinUtilization;
  lorryPerformance: LorryPerformance;
  bookingsSummary: BookingsSummary;
  invoicesSummary: InvoicesSummary;
  customerDetail: CustomerDetail;
  expenses: Expenses;
  inventoryBinRecord: InventoryBinRecord;
  rentableLorry: RentableLorry;
  addItem: AddItem;
  driver: Driver;
  bookingBin: BookingBin;
  deliverOrder: DeliverOrder;
  commission: Commission;
  refundCancelJob: RefundCancelJob;
}

interface SalesData {
  month: string;
  sales: number;
  profit: number;
}

interface BinSizeData {
  size: string;
  count: number;
  demand: number;
}

interface WasteTypeData {
  name: string;
  value: number;
}

interface LorryTripData {
  day: string;
  trips: number;
  maintenance: number;
}

interface CustomerData {
  name: string;
  value: number;
}

interface ExpensesData {
  category: string;
  amount: number;
}

interface InventoryBinData {
  area: string;
  deployed: number;
  maintenance: number;
  available: number;
}

interface RentableLorryData {
  lorry: string;
  rentals: number;
  revenue: number;
}

interface DriverPerformanceData {
  driver: string;
  trips: number;
  rating: number;
}

interface CommissionData {
  agent: string;
  commission: number;
}

interface RefundCancelData {
  month: string;
  refunds: number;
  cancellations: number;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ReportsSection: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<string>("sales");
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("all");
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>("csv");

  const reportData: ReportData = {
    salesSummary: {
      totalSales: "RM 15,750.00",
      monthlyGrowth: "+12%",
      averageInvoice: "RM 450.00",
      pendingPayments: "RM 1,800.00",
    },
    binUtilization: {
      totalBins: 85,
      inUse: 65,
      utilization: "76%",
      mostPopularSize: "10 Yard",
      highestAreaUsage: "Kuala Lumpur",
      averageRentalDuration: "18 days",
    },
    lorryPerformance: {
      totalTrips: 142,
      averageTripsPerDay: 4.7,
      topPerformingLorry: "MYB 2345",
      fuelCosts: "RM 4,200.00",
    },
    bookingsSummary: {
      totalBookings: 156,
      completed: 142,
      pending: 14,
      cancellationRate: "4.5%",
      averageBookingValue: "RM 425.00",
    },
    invoicesSummary: {
      totalInvoices: 165,
      paid: 148,
      outstanding: 17,
      averageInvoiceAmount: "RM 443.92",
      overdue: 5,
      collectionRate: "95%",
    },
    customerDetail: {
      totalCustomers: 42,
      newCustomers: 7,
      retentionRate: "92%",
      avgRevenuePerCustomer: "RM 375.00",
    },
    expenses: {
      totalExpenses: "RM 8,500.00",
      fuelCosts: "RM 4,200.00",
      maintenanceCosts: "RM 1,200.00",
      otherCosts: "RM 3,100.00",
    },
    inventoryBinRecord: {
      totalBins: 85,
      inMaintenance: 8,
      availableBins: 12,
      avgRentalDays: "18 days",
    },
    rentableLorry: {
      totalLorries: 10,
      availableLorries: 7,
      rentedLorries: 3,
      avgRentalDuration: "5 days",
    },
    addItem: {
      totalItemsAdded: 50,
      mostAddedItem: "10 Yard Bin",
      avgItemValue: "RM 200.00",
      itemsPendingApproval: 5,
    },
    driver: {
      totalDrivers: 15,
      activeDrivers: 12,
      tripsPerDriver: 9.5,
      avgDriverRating: 4.7,
    },
    bookingBin: {
      totalBinBookings: 156,
      completedBookings: 142,
      avgBookingValue: "RM 425.00",
      peakBookingDay: "Wednesday",
    },
    deliverOrder: {
      totalDeliveries: 140,
      onTimeDeliveries: 130,
      avgDeliveryTime: "2.5 hours",
      deliverySuccessRate: "93%",
    },
    commission: {
      totalCommission: "RM 2,500.00",
      avgCommissionPerSale: "RM 50.00",
      topAgent: "Agent A",
      topAgentCommission: "RM 800.00",
    },
    refundCancelJob: {
      totalRefunds: 10,
      totalCancellations: 7,
      refundAmount: "RM 1,200.00",
      cancellationRate: "4.5%",
    },
  };

  const salesData: SalesData[] = [
    { month: "Jan", sales: 3500, profit: 1200 },
    { month: "Feb", sales: 4200, profit: 1450 },
    { month: "Mar", sales: 3800, profit: 1300 },
    { month: "Apr", sales: 5100, profit: 1800 },
    { month: "May", sales: 4800, profit: 1650 },
    { month: "Jun", sales: 5500, profit: 1900 },
    { month: "Jul", sales: 6200, profit: 2100 },
    { month: "Aug", sales: 5800, profit: 1950 },
    { month: "Sep", sales: 6400, profit: 2200 },
    { month: "Oct", sales: 7100, profit: 2400 },
    { month: "Nov", sales: 6800, profit: 2300 },
    { month: "Dec", sales: 7500, profit: 2500 },
  ];

  const binSizeData: BinSizeData[] = [
    { size: "4 Yard", count: 15, demand: 80 },
    { size: "6 Yard", count: 20, demand: 90 },
    { size: "10 Yard", count: 30, demand: 95 },
    { size: "15 Yard", count: 10, demand: 75 },
    { size: "20 Yard", count: 10, demand: 60 },
  ];

  const COLORS: string[] = ["#3B82F6", "#60A5FA", "#93C5FD", "#FBBF24", "#F87171"];

  const wasteTypeData: WasteTypeData[] = [
    { name: "Scrap Metal", value: 45 },
    { name: "Plastic Waste", value: 25 },
    { name: "Construction", value: 15 },
    { name: "Bulk Trash", value: 10 },
    { name: "Mixed", value: 5 },
  ];

  const lorryTripData: LorryTripData[] = [
    { day: "Mon", trips: 18, maintenance: 2 },
    { day: "Tue", trips: 22, maintenance: 1 },
    { day: "Wed", trips: 28, maintenance: 0 },
    { day: "Thu", trips: 25, maintenance: 1 },
    { day: "Fri", trips: 30, maintenance: 0 },
    { day: "Sat", trips: 15, maintenance: 0 },
    { day: "Sun", trips: 12, maintenance: 3 },
  ];

  const customerData: CustomerData[] = [
    { name: "Construction", value: 40 },
    { name: "Manufacturing", value: 30 },
    { name: "Retail", value: 15 },
    { name: "Residential", value: 10 },
    { name: "Industrial", value: 5 },
  ];

  const expensesData: ExpensesData[] = [
    { category: "Fuel", amount: 4200 },
    { category: "Maintenance", amount: 1200 },
    { category: "Staff", amount: 1800 },
    { category: "Other", amount: 1300 },
  ];

  const inventoryBinData: InventoryBinData[] = [
    { area: "Kuala Lumpur", deployed: 35, maintenance: 5, available: 10 },
    { area: "Selangor", deployed: 20, maintenance: 2, available: 5 },
    { area: "Johor", deployed: 10, maintenance: 1, available: 3 },
    { area: "Penang", deployed: 15, maintenance: 2, available: 4 },
  ];

  const rentableLorryData: RentableLorryData[] = [
    { lorry: "MYB 2345", rentals: 10, revenue: 1500 },
    { lorry: "MYC 5678", rentals: 8, revenue: 1200 },
    { lorry: "MYD 9012", rentals: 5, revenue: 800 },
  ];

  const driverPerformanceData: DriverPerformanceData[] = [
    { driver: "John Doe", trips: 12, rating: 4.8 },
    { driver: "Jane Smith", trips: 10, rating: 4.6 },
    { driver: "Ali Ahmad", trips: 8, rating: 4.7 },
  ];

  const commissionData: CommissionData[] = [
    { agent: "Agent A", commission: 800 },
    { agent: "Agent B", commission: 600 },
    { agent: "Agent C", commission: 400 },
    { agent: "Agent D", commission: 300 },
  ];

  const refundCancelData: RefundCancelData[] = [
    { month: "Jan", refunds: 2, cancellations: 1 },
    { month: "Feb", refunds: 1, cancellations: 2 },
    { month: "Mar", refunds: 3, cancellations: 1 },
    { month: "Apr", refunds: 2, cancellations: 2 },
  ];

  const tabs: Tab[] = [
    { id: "sales", label: "Sales", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "bins", label: "Bins", icon: Package2 },
    { id: "lorries", label: "Lorries", icon: Truck },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "customerDetail", label: "Customer Detail", icon: Users },
    { id: "inventoryBinRecord", label: "Inventory Bin", icon: Package2 },
    { id: "rentableLorry", label: "Rentable Lorry", icon: Truck },
    { id: "addItem", label: "Add Item", icon: ShoppingCart },
    { id: "driver", label: "Driver", icon: UserPlus },
    { id: "bookingBin", label: "Booking Bin", icon: Calendar },
    { id: "deliverOrder", label: "Deliver Order", icon: Truck },
    { id: "commission", label: "Commission", icon: Percent },
    { id: "refundCancelJob", label: "Refund/Cancel", icon: XCircle },
    { id: "expenses", label: "Expenses", icon: ({ className }) => <XCircle className={className} /> },
  ];

  const handleExport = (): void => {
    console.log(`Exporting ${activeReportTab} report as ${exportFormat}`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
          title="Export report"
        >
          <Download className="h-5 w-5" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeframe(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <select
            value={areaFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAreaFilter(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="all">All Areas</option>
            <option value="kuala-lumpur">Kuala Lumpur</option>
            <option value="selangor">Selangor</option>
            <option value="johor">Johor</option>
            <option value="penang">Penang</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
          <select
            value={wasteTypeFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWasteTypeFilter(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="all">All Types</option>
            <option value="scrap-metal">Scrap Metal</option>
            <option value="plastic-waste">Plastic Waste</option>
            <option value="construction">Construction</option>
            <option value="bulk-trash">Bulk Trash</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {tabs.map((tab: Tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm ${
                activeReportTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Sales Tab */}
        {activeReportTab === "sales" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total {timeframe} Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.salesSummary.totalSales}</p>
                    <p className="text-sm text-emerald-600">{reportData.salesSummary.monthlyGrowth}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Pending Payments</p>
                    <p className="font-medium text-gray-900">{reportData.salesSummary.pendingPayments}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Sales (RM)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" name="Profit (RM)" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Invoice</p>
                    <p className="font-medium text-gray-900">{reportData.salesSummary.averageInvoice}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Waste Type Distribution</h3>
              <div className="space-y-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {wasteTypeData.map((entry: WasteTypeData, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary Waste Type</p>
                  <p className="font-medium text-gray-900">Scrap Metal (45%)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeReportTab === "customers" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {customerData.map((entry: CustomerData, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="font-medium text-gray-900">{reportData.customerDetail.totalCustomers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Retention Rate</p>
                  <p className="font-medium text-gray-900">{reportData.customerDetail.retentionRate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bins Tab */}
        {activeReportTab === "bins" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bin Utilization</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bins</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.binUtilization.totalBins}</p>
                    <p className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md inline-block mt-1">
                      Utilization: {reportData.binUtilization.utilization}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Most Popular Size</p>
                    <p className="font-medium text-gray-900">{reportData.binUtilization.mostPopularSize}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={binSizeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="size" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Number of Bins" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="demand" name="Demand (%)" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lorries Tab */}
        {activeReportTab === "lorries" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lorry Performance</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Trips</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.lorryPerformance.totalTrips}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Top Lorry</p>
                    <p className="font-medium text-gray-900">{reportData.lorryPerformance.topPerformingLorry}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lorryTripData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="trips" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeReportTab === "bookings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bookings Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.bookingsSummary.totalBookings}</p>
                    <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block mt-1">
                      Pending: {reportData.bookingsSummary.pending}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Cancellation Rate</p>
                    <p className="font-medium text-gray-900">{reportData.bookingsSummary.cancellationRate}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeReportTab === "invoices" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Invoices</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.invoicesSummary.totalInvoices}</p>
                    <p className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-md inline-block mt-1">
                      Overdue: {reportData.invoicesSummary.overdue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Collection Rate</p>
                    <p className="font-medium text-gray-900">{reportData.invoicesSummary.collectionRate}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Invoices Issued" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Detail Tab */}
        {activeReportTab === "customerDetail" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.customerDetail.totalCustomers}</p>
                    <p className="text-sm text-emerald-600">+{reportData.customerDetail.newCustomers} new</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Retention Rate</p>
                    <p className="font-medium text-gray-900">{reportData.customerDetail.retentionRate}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {customerData.map((entry: CustomerData, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Bin Record Tab */}
        {activeReportTab === "inventoryBinRecord" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bin Inventory Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bins</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.inventoryBinRecord.totalBins}</p>
                    <p className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md inline-block mt-1">
                      Available: {reportData.inventoryBinRecord.availableBins}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">In Maintenance</p>
                    <p className="font-medium text-gray-900">{reportData.inventoryBinRecord.inMaintenance}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryBinData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="area" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="deployed" name="Deployed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="maintenance" name="Maintenance" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="available" name="Available" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rentable Lorry Tab */}
        {activeReportTab === "rentableLorry" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Rentable Lorry Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Lorries</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.rentableLorry.totalLorries}</p>
                    <p className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md inline-block mt-1">
                      Available: {reportData.rentableLorry.availableLorries}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Avg Rental Duration</p>
                    <p className="font-medium text-gray-900">{reportData.rentableLorry.avgRentalDuration}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rentableLorryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="lorry" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="rentals" name="Rentals" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="revenue" name="Revenue (RM)" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Tab */}
        {activeReportTab === "addItem" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Item Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Items Added</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.addItem.totalItemsAdded}</p>
                    <p className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-md inline-block mt-1">
                      Pending Approval: {reportData.addItem.itemsPendingApproval}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Most Added Item</p>
                    <p className="font-medium text-gray-900">{reportData.addItem.mostAddedItem}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={binSizeData.map((item: BinSizeData) => ({
                          name: item.size,
                          value: item.count,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {binSizeData.map((entry: BinSizeData, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver Tab */}
        {activeReportTab === "driver" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Driver Performance</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Drivers</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.driver.totalDrivers}</p>
                    <p className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md inline-block mt-1">
                      Active: {reportData.driver.activeDrivers}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Avg Driver Rating</p>
                    <p className="font-medium text-gray-900">{reportData.driver.avgDriverRating}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driverPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="driver" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="trips" name="Trips" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rating" name="Rating" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Bin Tab */}
        {activeReportTab === "bookingBin" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bin Booking Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.bookingBin.totalBinBookings}</p>
                    <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block mt-1">
                      Completed: {reportData.bookingBin.completedBookings}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Peak Booking Day</p>
                    <p className="font-medium text-gray-900">{reportData.bookingBin.peakBookingDay}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deliver Order Tab */}
        {activeReportTab === "deliverOrder" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.deliverOrder.totalDeliveries}</p>
                    <p className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md inline-block mt-1">
                      On-Time: {reportData.deliverOrder.onTimeDeliveries}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="font-medium text-gray-900">{reportData.deliverOrder.deliverySuccessRate}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lorryTripData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="trips" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Commission Tab */}
        {activeReportTab === "commission" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Commission Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Commission</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.commission.totalCommission}</p>
                    <p className="text-sm text-emerald-600">+5% from last month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Top Agent</p>
                    <p className="font-medium text-gray-900">{reportData.commission.topAgent}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={commissionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="agent" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="commission" name="Commission (RM)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refund/Cancel Job Tab */}
        {activeReportTab === "refundCancelJob" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund/Cancellation Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Refunds</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.refundCancelJob.totalRefunds}</p>
                    <p className="text-sm text-amber-600">-2% from last month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Refund Amount</p>
                    <p className="font-medium text-gray-900">{reportData.refundCancelJob.refundAmount}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={refundCancelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="refunds" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="cancellations" stroke="#60A5FA" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeReportTab === "expenses" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses Overview</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.expenses.totalExpenses}</p>
                    <p className="text-sm text-blue-600">View-only data</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Fuel Costs</p>
                    <p className="font-medium text-gray-900">{reportData.expenses.fuelCosts}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        label
                      >
                        {expensesData.map((entry: ExpensesData, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `RM ${value}`}
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Export Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the format to export the {activeReportTab} report.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportFormat(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;