import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import CompanyManagement from "./components/admin/CompanyManagement";
import CustomerManagement from "./components/admin/CustomerManagement";
import BinInventoryManagement from "./components/admin/BinInventoryManagement";
import BinTrackingDetails from "./components/admin/BinTrackingDetails";
import DriverManagement from "./components/admin/DriverManagement";
import DriverDetailsPerformance from "./components/admin/DriverDetailsPerformance";
import LorryManagement from "./components/admin/LorryManagement";
import AssignDriverToLorry from "./components/admin/AssignDriverToLorry";
import LorryTrackingDetails from "./components/admin/LorryTrackingDetails";
import RentLorryRegister from "./components/admin/RentLorryRegister";
import RentLorryDetails from "./components/admin/RentLorryDetails";
import WasteManagement from "./components/admin/WasteManagement";
import BookingsAndDOs from "./components/admin/BookingsAndDOs";
import InvoiceManagement from "./components/admin/InvoiceManagement";
import GenerateInvoice from "./components/admin/GenerateInvoice";
import InvoiceDetails from "./components/admin/InvoiceDetails";
import RecordPayment from "./components/admin/RecordPayment";
import ReceiptConfirmation from "./components/admin/ReceiptConfirmation";
import CreateBooking from "./components/admin/CreateBooking";
import ReportsSummary from "./components/admin/ReportsSummary";
import CustomerReports from "./components/admin/CustomerReports";
import BinReports from "./components/admin/BinReports";
import LorryReports from "./components/admin/LorryReports";
import BookingReports from "./components/admin/BookingReports";
import InvoiceReports from "./components/admin/InvoiceReports";
import AdminSystemAlerts from "./components/admin/AdminSystemAlerts";
import AdminProfile from "./components/admin/AdminProfile";
import AdminUserManagement from "./components/admin/AdminUserManagement";
import PrintingSystem from "./components/admin/PrintingSystem";
import DriverLayout from "./components/layout/DriverLayout";
import DriverDashboard from "./components/driver/DriverDashboard";
import MyTrips from "./components/driver/MyTrips";
import TripHistory from "./components/driver/TripHistory";
import TripDetails from "./components/driver/TripDetails";
import ConfirmCollection from "./components/driver/ConfirmCollection";
import TripRecordPayment from "./components/driver/TripRecordPayment";
import DriverLorries from "./components/driver/DriverLorries";
import DriverProfile from "./components/driver/DriverProfile";
import PaymentOverview from "./components/admin/PaymentOverview";
import { OrderProvider } from "./contexts/OrderContext";
import { PaymentProvider } from "./contexts/PaymentContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderProvider>
        <PaymentProvider>
          <TooltipProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
                <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Legacy dashboard route - redirect to new admin */}
                <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="companies" element={<CompanyManagement />} />
                  <Route path="customers" element={<CustomerManagement />} />
                  <Route path="inventory" element={<BinInventoryManagement />} />
                  <Route path="inventory/track/:binId" element={<BinTrackingDetails />} />
                  <Route path="drivers" element={<DriverManagement />} />
                  <Route path="drivers/details/:driverId" element={<DriverDetailsPerformance />} />
                  <Route path="fleet" element={<LorryManagement />} />
                  <Route path="fleet/assign/:lorryId" element={<AssignDriverToLorry />} />
                  <Route path="fleet/track/:lorryId" element={<LorryTrackingDetails />} />
                  <Route path="rental-lorries" element={<RentLorryRegister />} />
                  <Route path="rental-lorries/details/:lorryId" element={<RentLorryDetails />} />
                  <Route path="waste" element={<WasteManagement />} />
                  <Route path="bookings-dos" element={<BookingsAndDOs />} />
                  <Route path="bookings-dos/create" element={<CreateBooking />} />
                  <Route path="invoicing" element={<InvoiceManagement />} />
                  <Route path="invoicing/generate" element={<GenerateInvoice />} />
                  <Route path="invoicing/details/:id" element={<InvoiceDetails />} />
                  <Route path="invoicing/payment/:id" element={<RecordPayment />} />
                  <Route path="invoicing/receipt/:id" element={<ReceiptConfirmation />} />
                  <Route path="payment-overview" element={<PaymentOverview />} />
                  <Route path="reports" element={<ReportsSummary />} />
                  <Route path="reports/customer" element={<CustomerReports />} />
                  <Route path="reports/bin" element={<BinReports />} />
                  <Route path="reports/lorry" element={<LorryReports />} />
                  <Route path="reports/booking" element={<BookingReports />} />
                  <Route path="reports/invoice" element={<InvoiceReports />} />
                  <Route path="system-alerts" element={<AdminSystemAlerts />} />
                  <Route path="printing" element={<PrintingSystem />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="users" element={<AdminUserManagement />} />
                </Route>
                
                {/* Driver Dashboard Routes */}
                <Route path="/driver" element={<DriverLayout />}>
                  <Route index element={<Navigate to="/driver/dashboard" replace />} />
                  <Route path="dashboard" element={<DriverDashboard />} />
                  <Route path="trips" element={<MyTrips />} />
                  <Route path="trip-history" element={<TripHistory />} />
                  <Route path="trips/:tripId" element={<TripDetails />} />
                  <Route path="trips/:tripId/confirm-collection" element={<ConfirmCollection />} />
                  <Route path="trips/:tripId/record-payment" element={<TripRecordPayment />} />
                  <Route path="lorries" element={<DriverLorries />} />
                  <Route path="profile" element={<DriverProfile />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </TooltipProvider>
        </PaymentProvider>
      </OrderProvider>
    </QueryClientProvider>
  );
}

export default App;
