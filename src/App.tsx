
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
                  {/* Placeholder routes for remaining modules */}
                  <Route path="fleet" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Fleet Management</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="external-lorries" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">External Lorries</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="waste" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Waste Management</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="bookings" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Booking System</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="invoicing" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Invoicing System</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="commission" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Commission Management</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="refunds" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Refunds & Cancellations</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="expenses" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Expense Management</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="reports" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Reports & Analytics</h2><p className="text-gray-600">Coming Soon</p></div>} />
                  <Route path="printing" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Printing System</h2><p className="text-gray-600">Coming Soon</p></div>} />
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
