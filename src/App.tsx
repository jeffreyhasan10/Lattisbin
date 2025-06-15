
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
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
                
                {/* Admin Dashboard Routes - Direct routing without AppLayout */}
                <Route path="/dashboard" element={<Dashboard />} />
                
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
