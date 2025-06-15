
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminBusinessRegister from "./components/dashboard/AdminBusinessRegister";
import AdminCustomerRegister from "./components/dashboard/AdminCustomerRegister";
import AdminInventoryManagement from "./components/dashboard/AdminInventoryManagement";
import AdminDriverManagement from "./components/dashboard/AdminDriverManagement";
import AdminOrderManagement from "./components/dashboard/AdminOrderManagement";
import FleetManagement from "./components/admin/FleetManagement";
import ExternalLorryNetwork from "./components/admin/ExternalLorryNetwork";
import WasteManagement from "./components/admin/WasteManagement";
import BookingSystem from "./components/admin/BookingSystem";
import DeliveryOrderManagement from "./components/admin/DeliveryOrderManagement";
import InvoicingSystem from "./components/admin/InvoicingSystem";
import CommissionManagement from "./components/admin/CommissionManagement";
import RefundManagement from "./components/admin/RefundManagement";
import ExpenseManagement from "./components/admin/ExpenseManagement";
import ReportsAnalytics from "./components/admin/ReportsAnalytics";
import PrintingSystem from "./components/admin/PrintingSystem";
import DriverLayout from "./components/layout/DriverLayout";
import DriverDashboard from "./components/driver/DriverDashboard";
import DriverOrders from "./components/driver/DriverOrders";
import DriverCalendar from "./components/driver/DriverCalendar";
import DriverPayments from "./components/driver/DriverPayments";
import DriverExpenses from "./components/driver/DriverExpenses";
import DriverLorries from "./components/driver/DriverLorries";
import DriverProfile from "./components/driver/DriverProfile";
import { OrderProvider } from "./contexts/OrderContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderProvider>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Legacy dashboard route - redirect to new admin */}
                <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="business" element={<AdminBusinessRegister />} />
                  <Route path="customers" element={<AdminCustomerRegister />} />
                  <Route path="inventory" element={<AdminInventoryManagement />} />
                  <Route path="drivers" element={<AdminDriverManagement />} />
                  <Route path="orders" element={<AdminOrderManagement />} />
                  <Route path="fleet" element={<FleetManagement />} />
                  <Route path="external-lorries" element={<ExternalLorryNetwork />} />
                  <Route path="waste" element={<WasteManagement />} />
                  <Route path="bookings" element={<BookingSystem />} />
                  <Route path="delivery-orders" element={<DeliveryOrderManagement />} />
                  <Route path="invoicing" element={<InvoicingSystem />} />
                  <Route path="commission" element={<CommissionManagement />} />
                  <Route path="refunds" element={<RefundManagement />} />
                  <Route path="expenses" element={<ExpenseManagement />} />
                  <Route path="reports" element={<ReportsAnalytics />} />
                  <Route path="printing" element={<PrintingSystem />} />
                  <Route path="settings" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">System Settings</h2><p className="text-gray-600">Coming Soon</p></div>} />
                </Route>
                
                {/* Driver Dashboard Routes */}
                <Route path="/driver" element={<DriverLayout />}>
                  <Route index element={<Navigate to="/driver/dashboard" replace />} />
                  <Route path="dashboard" element={<DriverDashboard />} />
                  <Route path="orders" element={<DriverOrders />} />
                  <Route path="calendar" element={<DriverCalendar />} />
                  <Route path="payments" element={<DriverPayments />} />
                  <Route path="expenses" element={<DriverExpenses />} />
                  <Route path="lorries" element={<DriverLorries />} />
                  <Route path="profile" element={<DriverProfile />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </TooltipProvider>
      </OrderProvider>
    </QueryClientProvider>
  );
}

export default App;
