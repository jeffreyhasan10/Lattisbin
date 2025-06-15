
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import DriverLayout from "./components/layout/DriverLayout";

// Driver Components
import DriverLogin from "./components/driver/DriverLogin";
import DriverDashboard from "./components/driver/DriverDashboard";
import DriverOrders from "./components/driver/DriverOrders";
import DriverPayments from "./components/driver/DriverPayments";
import DriverExpenses from "./components/driver/DriverExpenses";
import DriverLorries from "./components/driver/DriverLorries";
import DriverProfile from "./components/driver/DriverProfile";

// Admin Dashboard Components
import DashboardOverview from "./components/dashboard/DashboardOverview";
import CompanyDetails from "./components/dashboard/CompanyDetails";
import CustomerManagement from "./components/dashboard/CustomerManagement";
import BinInventory from "./components/dashboard/BinInventory";
import RentableLorries from "./components/dashboard/RentableLorries";
import DriverManagement from "./components/dashboard/DriverManagement";
import WasteCollection from "./components/dashboard/WasteCollection";
import BookingOrders from "./components/dashboard/BookingOrders";
import InvoiceSection from "./components/dashboard/InvoiceSection";
import ReportsSection from "./components/dashboard/ReportsSection";
import Settings from "./components/dashboard/Settings";
import BusinessRegister from "./components/dashboard/BusinessRegister";
import CustomerRegister from "./components/dashboard/CustomerRegister";
import InventoryRegister from "./components/dashboard/InventoryRegister";
import LorryRegister from "./components/dashboard/LorryRegister";
import RentableLorryRegister from "./components/dashboard/RentableLorryRegister";
import DriverRegister from "./components/dashboard/DriverRegister";
import WasteItemRegister from "./components/dashboard/WasteItemRegister";
import CommissionManagement from "./components/dashboard/CommissionManagement";
import RefundManagement from "./components/dashboard/RefundManagement";
import ExpenseManagement from "./components/dashboard/ExpenseManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Driver Routes */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route element={<DriverLayout />}>
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/orders" element={<DriverOrders />} />
            <Route path="/driver/payments" element={<DriverPayments />} />
            <Route path="/driver/expenses" element={<DriverExpenses />} />
            <Route path="/driver/lorries" element={<DriverLorries />} />
            <Route path="/driver/profile" element={<DriverProfile />} />
          </Route>
          
          {/* Admin Dashboard Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/overview" element={<DashboardOverview />} />
            <Route path="/dashboard/company" element={<CompanyDetails />} />
            <Route path="/dashboard/customers" element={<CustomerManagement />} />
            <Route path="/dashboard/bins" element={<BinInventory />} />
            <Route path="/dashboard/lorries" element={<RentableLorries />} />
            <Route path="/dashboard/drivers" element={<DriverManagement />} />
            <Route path="/dashboard/waste" element={<WasteCollection />} />
            <Route path="/dashboard/bookings" element={<BookingOrders />} />
            <Route path="/dashboard/invoices" element={<InvoiceSection />} />
            <Route path="/dashboard/reports" element={<ReportsSection />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/business-register" element={<BusinessRegister />} />
            <Route path="/dashboard/customer-register" element={<CustomerRegister />} />
            <Route path="/dashboard/bin-register" element={<InventoryRegister />} />
            <Route path="/dashboard/lorry-register" element={<LorryRegister />} />
            <Route path="/dashboard/rentable-lorry-register" element={<RentableLorryRegister />} />
            <Route path="/dashboard/driver-register" element={<DriverRegister />} />
            <Route path="/dashboard/waste-item-register" element={<WasteItemRegister />} />
            <Route path="/dashboard/commissions" element={<CommissionManagement />} />
            <Route path="/dashboard/refunds" element={<RefundManagement />} />
            <Route path="/dashboard/expenses" element={<ExpenseManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
