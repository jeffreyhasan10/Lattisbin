import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarRange, Plus, FileText, Filter, Search, Package, Truck, DollarSign, User, MapPin, Clock, CheckCircle, AlertCircle, Edit, Download, Receipt, RefreshCw, Bell, ArrowRight, ArrowLeft, Save, X, UserPlus, Phone, Mail, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";

interface Customer {
  id: string;
  name: string;
  type: "Individual" | "SME" | "Corporate" | "Government";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  state: string;
}

interface BookingDO {
  id: string;
  type: "booking" | "delivery-order";
  doNumber: string;
  doBookNumber?: string;
  customerName: string;
  customerId: string;
  customerType: "Individual" | "SME" | "Corporate" | "Government";
  contactPerson: string;
  phone: string;
  email: string;
  binSerialNumber?: string;
  binSize: string;
  binWeight?: number;
  location: string;
  area: string;
  state: string;
  scheduledDate: string;
  scheduledTime: string;
  collectionDate?: string;
  collectionTime?: string;
  collectionSource?: "warehouse" | "customer";
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  assignedDriver?: string;
  assignedLorry?: string;
  paymentMode: "Cash" | "Online" | "Cheque" | "CDM" | "Term";
  paymentStatus: "pending" | "received" | "confirmed";
  invoiceStatus: "pending" | "issued" | "paid";
  invoiceId?: string;
  invoiceAmount?: number;
  introducer?: string;
  jobReference?: string;
  ownerManagerSupervisor?: string;
  amount: number;
  commissionAmount?: number;
  commissionPaid?: boolean;
  notes?: string;
  issuedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  doId: string;
  doNumber: string;
  customerName: string;
  amount: number;
  paymentMode: string;
  status: "pending" | "paid";
  issuedDate: string;
  dueDate: string;
}

const BookingsAndDOs: React.FC = () => {
  const navigate = useNavigate();
  const { getCollectionReminderByDO } = useOrders();
  
  // State for records and customers
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "ABC Construction Sdn Bhd",
      type: "Corporate",
      contactPerson: "Ahmad Rahman",
      phone: "+60123456789",
      email: "ahmad@abc-construction.com",
      address: "Jalan Ampang, Kuala Lumpur",
      area: "Ampang",
      state: "Kuala Lumpur"
    },
    {
      id: "CUST002",
      name: "Sarah Lim",
      type: "Individual",
      contactPerson: "Sarah Lim",
      phone: "+60198765432",
      email: "sarah.lim@gmail.com",
      address: "Taman Desa, Kuala Lumpur",
      area: "Taman Desa",
      state: "Kuala Lumpur"
    }
  ]);

  // Load bookings from localStorage and merge with default data
  const loadBookings = () => {
    const defaultBookings: BookingDO[] = [
      {
        id: "REC001",
        type: "booking",
        doNumber: "DO-0001",
        doBookNumber: "DOBOOK-0001",
        customerName: "ABC Construction Sdn Bhd",
        customerId: "CUST001",
        customerType: "Corporate",
        contactPerson: "Ahmad Rahman",
        phone: "+60123456789",
        email: "ahmad@abc-construction.com",
        binSerialNumber: "BIN-SN-001",
        binSize: "6ft(H) × 24ft(L) × 8ft(W)",
        binWeight: 500,
        location: "Jalan Ampang, Kuala Lumpur",
        area: "Ampang",
        state: "Kuala Lumpur",
        scheduledDate: "2024-06-15",
        scheduledTime: "09:00",
        collectionDate: "2024-06-20",
        collectionTime: "14:00",
        collectionSource: "warehouse",
        status: "assigned",
        priority: "medium",
        assignedDriver: "John Doe",
        assignedLorry: "VEH001",
        paymentMode: "Cash",
        paymentStatus: "pending",
        invoiceStatus: "pending",
        introducer: "Agent Smith",
        jobReference: "JOB001",
        ownerManagerSupervisor: "Manager A",
        amount: 850,
        commissionAmount: 85,
        commissionPaid: false,
        notes: "Access via back lane, contact security first",
        issuedBy: "Admin User",
        createdAt: "2024-06-14T10:00:00",
        updatedAt: "2024-06-14T10:00:00"
      },
      {
        id: "REC002",
        type: "delivery-order",
        doNumber: "DO-0002",
        doBookNumber: "DOBOOK-0002",
        customerName: "Sarah Lim",
        customerId: "CUST002",
        customerType: "Individual",
        contactPerson: "Sarah Lim",
        phone: "+60198765432",
        email: "sarah.lim@gmail.com",
        binSerialNumber: "BIN-SN-002",
        binSize: "4ft(H) × 12ft(L) × 6ft(W)",
        binWeight: 250,
        location: "Taman Desa, Kuala Lumpur",
        area: "Taman Desa",
        state: "Kuala Lumpur",
        scheduledDate: "2024-06-16",
        scheduledTime: "14:00",
        collectionDate: "2024-06-22",
        collectionTime: "10:00",
        collectionSource: "customer",
        status: "in-progress",
        priority: "high",
        assignedDriver: "Ali Hassan",
        assignedLorry: "VEH002",
        paymentMode: "Online",
        paymentStatus: "received",
        invoiceStatus: "issued",
        invoiceId: "INV-0001",
        invoiceAmount: 420,
        introducer: "Agent Jones",
        jobReference: "JOB002",
        ownerManagerSupervisor: "Supervisor B",
        amount: 420,
        commissionAmount: 42,
        commissionPaid: false,
        notes: "Recurring monthly booking",
        issuedBy: "Admin User",
        createdAt: "2024-06-15T10:00:00",
        updatedAt: "2024-06-15T12:00:00"
      }
    ];

    const savedBookings = JSON.parse(localStorage.getItem('lattisbin_bookings') || '[]');
    return [...defaultBookings, ...savedBookings];
  };

  const [records, setRecords] = useState<BookingDO[]>(loadBookings());

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-0001",
      doId: "REC002",
      doNumber: "DO-0002",
      customerName: "Sarah Lim",
      amount: 420,
      paymentMode: "Online",
      status: "pending",
      issuedDate: "2024-06-16",
      dueDate: "2024-06-30"
    }
  ]);

  // Modal states
  const [selectedRecord, setSelectedRecord] = useState<BookingDO | null>(null);
  const [showDODetailsModal, setShowDODetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonType, setCancelReasonType] = useState("");
  
  // Refund form states
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReasonType, setRefundReasonType] = useState("");
  const [refundNotes, setRefundNotes] = useState("");
  
  // Invoice modal states
  const [showInvoiceDetailsModal, setShowInvoiceDetailsModal] = useState(false);
  const [showConvertInvoiceModal, setShowConvertInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter and search states
  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  // Bin size options with pricing
  const binSizeOptions = [
    { id: "2x12x6", name: "2ft(H) × 12ft(L) × 6ft(W)", price: 200 },
    { id: "2x20x8", name: "2ft(H) × 20ft(L) × 8ft(W)", price: 280 },
    { id: "4x12x6", name: "4ft(H) × 12ft(L) × 6ft(W)", price: 320 },
    { id: "4x14x6", name: "4ft(H) × 14ft(L) × 6ft(W)", price: 350 },
    { id: "5x12x6", name: "5ft(H) × 12ft(L) × 6ft(W)", price: 380 },
    { id: "5x23x8", name: "5ft(H) × 23ft(L) × 8ft(W)", price: 650 },
    { id: "6x12x6", name: "6ft(H) × 12ft(L) × 6ft(W)", price: 420 },
    { id: "6x24x8", name: "6ft(H) × 24ft(L) × 8ft(W)", price: 750 },
    { id: "6x23x8", name: "6ft(H) × 23ft(L) × 8ft(W)", price: 720 },
    { id: "6.5x14.5x6", name: "6.5ft(H) × 14.5ft(L) × 6ft(W)", price: 450 },
    { id: "6x12x7", name: "6ft(H) × 12ft(L) × 7ft(W)", price: 440 },
    { id: "4x12x6_cust", name: "4ft(H) × 12ft(L) × 6ft(W) (Cust)", price: 340 },
    { id: "2x12x6_cust", name: "2ft(H) × 12ft(L) × 6ft(W) (Cust)", price: 220 },
    { id: "5x12x6_cust", name: "5ft(H) × 12ft(L) × 6ft(W) (Cust)", price: 400 },
    { id: "2x20x8_cust", name: "2ft(H) × 20ft(L) × 8ft(W) (Cust)", price: 300 },
    { id: "4x16x8_cust", name: "4ft(H) × 16ft(L) × 8ft(W) (Cust)", price: 480 }
  ];

  // Helper functions
  const getStatusBadge = (status: string) => {
    const badges = {
      assigned: <Badge className="bg-green-100 text-green-800">Assigned</Badge>,
      pending: <Badge className="bg-orange-100 text-orange-800">Pending</Badge>,
      "in-progress": <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>,
      completed: <Badge className="bg-purple-100 text-purple-800">Completed</Badge>,
      cancelled: <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    };
    return badges[status] || <Badge variant="secondary">Unknown</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-100 text-red-800">High</Badge>,
      medium: <Badge className="bg-orange-100 text-orange-800">Medium</Badge>,
      low: <Badge className="bg-gray-100 text-gray-800">Low</Badge>
    };
    return badges[priority] || <Badge variant="secondary">Unknown</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges = {
      confirmed: <Badge className="bg-green-100 text-green-800">Confirmed</Badge>,
      received: <Badge className="bg-blue-100 text-blue-800">Received</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    };
    return badges[status] || <Badge variant="secondary">Unknown</Badge>;
  };

  const getInvoiceStatusBadge = (status: string) => {
    const badges = {
      paid: <Badge className="bg-green-100 text-green-800">Paid</Badge>,
      issued: <Badge className="bg-blue-100 text-blue-800">Issued</Badge>,
      pending: <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
    };
    return badges[status] || <Badge variant="secondary">Unknown</Badge>;
  };

  // Filtering logic
  const filteredRecords = records.filter((record) => {
    if (activeTab === "bookings" && record.type !== "booking") return false;
    if (activeTab === "delivery-orders" && record.type !== "delivery-order") return false;
    if (filterStatus !== "all" && record.status !== filterStatus) return false;
    if (filterArea !== "all" && record.area !== filterArea) return false;
    if (searchQuery && !record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !record.doNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateFrom && new Date(record.scheduledDate) < dateFrom) return false;
    if (dateTo && new Date(record.scheduledDate) > dateTo) return false;
    return true;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterArea, activeTab]);

  // Reload bookings when component mounts or when returning from create page
  React.useEffect(() => {
    const reloadBookings = () => {
      const defaultBookings: BookingDO[] = [
        {
          id: "REC001",
          type: "booking",
          doNumber: "DO-0001",
          doBookNumber: "DOBOOK-0001",
          customerName: "ABC Construction Sdn Bhd",
          customerId: "CUST001",
          customerType: "Corporate",
          contactPerson: "Ahmad Rahman",
          phone: "+60123456789",
          email: "ahmad@abc-construction.com",
          binSerialNumber: "BIN-SN-001",
          binSize: "6ft(H) × 24ft(L) × 8ft(W)",
          binWeight: 500,
          location: "Jalan Ampang, Kuala Lumpur",
          area: "Ampang",
          state: "Kuala Lumpur",
          scheduledDate: "2024-06-15",
          scheduledTime: "09:00",
          collectionDate: "2024-06-20",
          collectionTime: "14:00",
          collectionSource: "warehouse",
          status: "assigned",
          priority: "medium",
          assignedDriver: "John Doe",
          assignedLorry: "VEH001",
          paymentMode: "Cash",
          paymentStatus: "pending",
          invoiceStatus: "pending",
          introducer: "Agent Smith",
          jobReference: "JOB001",
          ownerManagerSupervisor: "Manager A",
          amount: 850,
          commissionAmount: 85,
          commissionPaid: false,
          notes: "Access via back lane, contact security first",
          issuedBy: "Admin User",
          createdAt: "2024-06-14T10:00:00",
          updatedAt: "2024-06-14T10:00:00"
        },
        {
          id: "REC002",
          type: "delivery-order",
          doNumber: "DO-0002",
          doBookNumber: "DOBOOK-0002",
          customerName: "Sarah Lim",
          customerId: "CUST002",
          customerType: "Individual",
          contactPerson: "Sarah Lim",
          phone: "+60198765432",
          email: "sarah.lim@gmail.com",
          binSerialNumber: "BIN-SN-002",
          binSize: "4ft(H) × 12ft(L) × 6ft(W)",
          binWeight: 250,
          location: "Taman Desa, Kuala Lumpur",
          area: "Taman Desa",
          state: "Kuala Lumpur",
          scheduledDate: "2024-06-16",
          scheduledTime: "14:00",
          collectionDate: "2024-06-22",
          collectionTime: "10:00",
          collectionSource: "customer",
          status: "in-progress",
          priority: "high",
          assignedDriver: "Ali Hassan",
          assignedLorry: "VEH002",
          paymentMode: "Online",
          paymentStatus: "received",
          invoiceStatus: "issued",
          invoiceId: "INV-0001",
          invoiceAmount: 420,
          introducer: "Agent Jones",
          jobReference: "JOB002",
          ownerManagerSupervisor: "Supervisor B",
          amount: 420,
          commissionAmount: 42,
          commissionPaid: false,
          notes: "Recurring monthly booking",
          issuedBy: "Admin User",
          createdAt: "2024-06-15T10:00:00",
          updatedAt: "2024-06-15T12:00:00"
        }
      ];

      const savedBookings = JSON.parse(localStorage.getItem('lattisbin_bookings') || '[]');
      return [...defaultBookings, ...savedBookings];
    };
    
    setRecords(reloadBookings());
  }, []);

  // Statistics
  const stats = {
    totalBookings: records.filter(r => r.type === "booking").length,
    totalDOs: records.filter(r => r.type === "delivery-order").length,
    pendingInvoices: records.filter(r => r.invoiceStatus === "pending").length,
    pendingPayments: records.filter(r => r.paymentStatus === "pending").length,
  };

  // Workflow handlers
  const startCreateBooking = () => {
    navigate("/admin/bookings-dos/create");
  };


  const handleOpenConvertInvoiceModal = (record: BookingDO) => {
    if (record.invoiceStatus !== "pending") {
      alert("Invoice already generated for this DO");
      return;
    }
    setSelectedRecord(record);
    setShowConvertInvoiceModal(true);
  };

  const handleConfirmConvertToInvoice = () => {
    if (!selectedRecord) return;

    const invoiceId = `INV-${String(invoices.length + 1).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      id: invoiceId,
      doId: selectedRecord.id,
      doNumber: selectedRecord.doNumber,
      customerName: selectedRecord.customerName,
      amount: selectedRecord.amount,
      paymentMode: selectedRecord.paymentMode,
      status: "pending",
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setInvoices([...invoices, newInvoice]);
    setRecords(records.map(r => r.id === selectedRecord.id ? { ...r, invoiceStatus: "issued", invoiceId, invoiceAmount: selectedRecord.amount } : r));
    setShowConvertInvoiceModal(false);
    alert(`Invoice ${invoiceId} generated successfully!`);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowInvoiceDetailsModal(true);
    }
  };

  const handleMarkPaymentReceived = (record: BookingDO) => {
    setRecords(records.map(r => r.id === record.id ? { ...r, paymentStatus: "received" } : r));
    alert("Payment marked as received");
  };

  const handlePayCommission = (record: BookingDO) => {
    if (!record.commissionAmount || record.commissionPaid) {
      alert("No commission to pay or already paid");
      return;
    }
    setRecords(records.map(r => r.id === record.id ? { ...r, commissionPaid: true } : r));
    alert(`Commission of RM ${record.commissionAmount} paid to ${record.introducer}`);
  };

  const handleCancelBooking = (record: BookingDO) => {
    setSelectedRecord(record);
    setCancelReason("");
    setCancelReasonType("");
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = () => {
    if (!cancelReasonType || !cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }
    if (selectedRecord) {
      setRecords(records.map(r => r.id === selectedRecord.id ? { 
        ...r, 
        status: "cancelled",
        notes: `${r.notes || ''}\n\nCANCELLED - ${cancelReasonType}: ${cancelReason}`
      } : r));
      setShowCancelModal(false);
      alert(`Booking ${selectedRecord.doNumber} has been cancelled successfully`);
    }
  };

  const handleOpenRefundModal = (record: BookingDO) => {
    setSelectedRecord(record);
    setRefundAmount(record.amount);
    setRefundReasonType("");
    setRefundNotes("");
    setShowRefundModal(true);
  };

  const handleProcessRefund = () => {
    if (!refundReasonType || !refundNotes.trim()) {
      alert("Please provide refund reason and notes");
      return;
    }
    if (refundAmount <= 0 || refundAmount > (selectedRecord?.amount || 0)) {
      alert("Invalid refund amount");
      return;
    }
    if (selectedRecord) {
      // Update record with refund information
      setRecords(records.map(r => r.id === selectedRecord.id ? { 
        ...r, 
        status: "cancelled",
        paymentStatus: "confirmed", // Mark as confirmed to indicate refund processed
        notes: `${r.notes || ''}\n\nREFUND PROCESSED - ${refundReasonType}\nAmount: RM${refundAmount}\nReason: ${refundNotes}\nDate: ${new Date().toLocaleString()}`
      } : r));
      
      // If there's commission, adjust it
      if (selectedRecord.commissionAmount && !selectedRecord.commissionPaid) {
        alert(`Refund of RM ${refundAmount} processed. Commission of RM ${selectedRecord.commissionAmount} has been cancelled.`);
      } else {
        alert(`Refund of RM ${refundAmount} processed successfully`);
      }
      
      setShowRefundModal(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarRange className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span className="truncate">View Bookings & DOs</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
            Unified interface for managing bin bookings and delivery orders
          </p>
        </div>
        <Button 
          onClick={startCreateBooking} 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">Create New Booking</span>
          <span className="xs:hidden">New Booking</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg w-fit">
                <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg w-fit">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Delivery Orders</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalDOs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg w-fit">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Pending Invoices</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.pendingInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="bg-red-100 p-2 rounded-lg w-fit">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Pending Payments</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer or DO number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="Ampang">Ampang</SelectItem>
                <SelectItem value="Taman Desa">Taman Desa</SelectItem>
                <SelectItem value="Petaling Jaya">Petaling Jaya</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Date Range</span>
              <span className="sm:hidden">Filter Date</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for All / Bookings / DOs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">All Records ({records.length})</span>
            <span className="sm:hidden">All ({records.length})</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Bookings Only ({stats.totalBookings})</span>
            <span className="sm:hidden">Bookings ({stats.totalBookings})</span>
          </TabsTrigger>
          <TabsTrigger value="delivery-orders" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Delivery Orders Only ({stats.totalDOs})</span>
            <span className="sm:hidden">DOs ({stats.totalDOs})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {/* Pagination Info and Items Per Page */}
          {filteredRecords.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length}
              </p>
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm text-gray-600">Show:</Label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-[80px] sm:w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No records found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            paginatedRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-3 sm:p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${record.type === "booking" ? "bg-blue-100" : "bg-green-100"}`}>
                          {record.type === "booking" ? (
                            <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-base flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="truncate">{record.customerName}</span>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {record.customerType}
                            </Badge>
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{record.contactPerson} • {record.phone}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        {getPriorityBadge(record.priority)}
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`text-xs ${record.type === "booking" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                        {record.type === "booking" ? "Booking" : "Delivery Order"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">DO Number</p>
                      <p className="font-medium text-blue-700">{record.doNumber}</p>
                      {record.doBookNumber && (
                        <p className="text-xs text-gray-500">Book: {record.doBookNumber}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Bin Details</p>
                      <p className="font-medium flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {record.binSize}
                      </p>
                      {record.binSerialNumber && (
                        <p className="text-xs text-gray-500">SN: {record.binSerialNumber}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {record.area}, {record.state}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Schedule</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {record.scheduledDate} at {record.scheduledTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium">
                        {record.assignedDriver || "Not assigned"}
                      </p>
                      {record.assignedLorry && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {record.assignedLorry}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="font-medium">
                        RM {record.amount} ({record.paymentMode})
                      </p>
                      <div className="flex gap-1 mt-1">
                        {getPaymentStatusBadge(record.paymentStatus)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Invoice Status</p>
                      {getInvoiceStatusBadge(record.invoiceStatus)}
                      {record.invoiceStatus === "pending" && (
                        <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Pending Invoice
                        </p>
                      )}
                    </div>

                    {record.commissionAmount && (
                      <div>
                        <p className="text-sm text-gray-500">Commission</p>
                        <p className="font-medium">
                          RM {record.commissionAmount}
                        </p>
                        {record.commissionPaid ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">Paid</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">Pending</Badge>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500">Collection Reminder</p>
                      {(() => {
                        const reminder = getCollectionReminderByDO(record.doNumber);
                        if (reminder) {
                          return (
                            <div className="flex items-center gap-1 mt-1">
                              <Bell className="h-3 w-3 text-blue-600" />
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                {reminder.status === "scheduled" && "Scheduled"}
                                {reminder.status === "sent" && "Sent"}
                                {reminder.status === "completed" && "Completed"}
                                {reminder.status === "overdue" && "Overdue"}
                              </Badge>
                            </div>
                          );
                        }
                        return (
                          <p className="text-xs text-gray-500 mt-1">Not scheduled</p>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Additional Details */}
                  {(record.introducer || record.jobReference || record.ownerManagerSupervisor) && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Additional Information:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                        {record.introducer && (
                          <div>
                            <span className="text-gray-500">Introducer:</span>
                            <span className="ml-2 font-medium">{record.introducer}</span>
                          </div>
                        )}
                        {record.jobReference && (
                          <div>
                            <span className="text-gray-500">Job Reference:</span>
                            <span className="ml-2 font-medium">{record.jobReference}</span>
                          </div>
                        )}
                        {record.ownerManagerSupervisor && (
                          <div>
                            <span className="text-gray-500">Owner/Manager:</span>
                            <span className="ml-2 font-medium">{record.ownerManagerSupervisor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">{record.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-end gap-2 mt-4">
                    {!getCollectionReminderByDO(record.doNumber) && record.status === "completed" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-blue-50 border-blue-300 hover:bg-blue-100"
                        onClick={() => navigate(`/admin/collection-reminders`)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Schedule Collection
                      </Button>
                    )}
                    
                    {getCollectionReminderByDO(record.doNumber) && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/admin/collection-reminders`)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        View Collection
                      </Button>
                    )}

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowDODetailsModal(true);
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View DO Details
                    </Button>
                    
                    {record.invoiceStatus === "pending" && record.status !== "cancelled" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenConvertInvoiceModal(record)}
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        Convert to Invoice
                      </Button>
                    )}

                    {record.invoiceStatus === "issued" && record.invoiceId && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewInvoice(record.invoiceId!)}
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        View Invoice
                      </Button>
                    )}
                    
                    {record.paymentStatus === "pending" && record.status !== "cancelled" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkPaymentReceived(record)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Payment Received
                      </Button>
                    )}

                    {record.commissionAmount > 0 && !record.commissionPaid && record.paymentStatus === "received" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePayCommission(record)}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Pay Commission
                      </Button>
                    )}

                    {record.status !== "cancelled" && record.status !== "completed" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCancelBooking(record)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}

                    {(record.status === "cancelled" || record.paymentStatus === "received") && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenRefundModal(record)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Process Refund
                      </Button>
                    )}

                    <Button size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {/* Pagination Controls */}
          {filteredRecords.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-9 h-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>


      {/* DO Details Modal */}
      <Dialog open={showDODetailsModal} onOpenChange={setShowDODetailsModal}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Delivery Order Details</DialogTitle>
            <DialogDescription className="text-sm">Complete information for DO: {selectedRecord?.doNumber}</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 md:space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm md:text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{selectedRecord.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-medium">{selectedRecord.customerType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contact Person</p>
                      <p className="font-medium">{selectedRecord.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{selectedRecord.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{selectedRecord.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bin & DO Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm md:text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Bin & DO Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">DO Number</p>
                      <p className="font-medium">{selectedRecord.doNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">DO Book Number</p>
                      <p className="font-medium">{selectedRecord.doBookNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bin Serial Number</p>
                      <p className="font-medium">{selectedRecord.binSerialNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bin Size</p>
                      <p className="font-medium">{selectedRecord.binSize}</p>
                    </div>
                    {selectedRecord.binWeight && (
                      <div>
                        <p className="text-gray-600">Weight (KG)</p>
                        <p className="font-medium">{selectedRecord.binWeight} kg</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Collection Source</p>
                      <p className="font-medium capitalize">{selectedRecord.collectionSource || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm md:text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Schedule & Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date/Time</p>
                      <p className="font-medium">{selectedRecord.scheduledDate} at {selectedRecord.scheduledTime}</p>
                    </div>
                    {selectedRecord.collectionDate && (
                      <div>
                        <p className="text-gray-600">Collection Date/Time</p>
                        <p className="font-medium">{selectedRecord.collectionDate} at {selectedRecord.collectionTime}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Assigned Driver</p>
                      <p className="font-medium">{selectedRecord.assignedDriver || "Not assigned"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assigned Lorry</p>
                      <p className="font-medium">{selectedRecord.assignedLorry || "Not assigned"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium">{selectedRecord.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Area / State</p>
                      <p className="font-medium">{selectedRecord.area}, {selectedRecord.state}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Invoice */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm md:text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment & Invoice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-medium text-lg">RM {selectedRecord.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Mode</p>
                      <p className="font-medium">{selectedRecord.paymentMode}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Status</p>
                      {getPaymentStatusBadge(selectedRecord.paymentStatus)}
                    </div>
                    <div>
                      <p className="text-gray-600">Invoice Status</p>
                      {getInvoiceStatusBadge(selectedRecord.invoiceStatus)}
                    </div>
                    {selectedRecord.invoiceId && (
                      <div>
                        <p className="text-gray-600">Invoice ID</p>
                        <p className="font-medium">{selectedRecord.invoiceId}</p>
                      </div>
                    )}
                    {selectedRecord.commissionAmount && (
                      <div>
                        <p className="text-gray-600">Commission</p>
                        <p className="font-medium">RM {selectedRecord.commissionAmount}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status & Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm md:text-base">Status & Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      <span className="text-sm text-gray-600">Status:</span>
                      {getStatusBadge(selectedRecord.status)}
                      {getPriorityBadge(selectedRecord.priority)}
                    </div>
                    {selectedRecord.notes && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm bg-gray-50 p-3 rounded break-words">{selectedRecord.notes}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm pt-2">
                      {selectedRecord.introducer && (
                        <div>
                          <p className="text-gray-600">Introducer</p>
                          <p className="font-medium">{selectedRecord.introducer}</p>
                        </div>
                      )}
                      {selectedRecord.jobReference && (
                        <div>
                          <p className="text-gray-600">Job Reference</p>
                          <p className="font-medium">{selectedRecord.jobReference}</p>
                        </div>
                      )}
                      {selectedRecord.ownerManagerSupervisor && (
                        <div>
                          <p className="text-gray-600">Owner/Manager</p>
                          <p className="font-medium">{selectedRecord.ownerManagerSupervisor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDODetailsModal(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {selectedRecord?.invoiceStatus === "pending" && (
              <Button onClick={() => {
                setShowDODetailsModal(false);
                handleOpenConvertInvoiceModal(selectedRecord);
              }} className="w-full sm:w-auto">
                <Receipt className="h-4 w-4 mr-2" />
                Convert to Invoice
              </Button>
            )}
            {selectedRecord?.invoiceStatus === "issued" && selectedRecord.invoiceId && (
              <Button variant="outline" onClick={() => {
                setShowDODetailsModal(false);
                handleViewInvoice(selectedRecord.invoiceId!);
              }} className="w-full sm:w-auto">
                <Receipt className="h-4 w-4 mr-2" />
                View Invoice
              </Button>
            )}
            <Button className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" />
              Edit DO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Process Refund</DialogTitle>
            <DialogDescription className="text-sm">Enter refund details for DO: {selectedRecord?.doNumber}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRecord && (
              <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm mb-2">Booking Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{selectedRecord.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Original Amount:</span>
                    <span className="ml-2 font-medium">RM {selectedRecord.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Mode:</span>
                    <span className="ml-2 font-medium">{selectedRecord.paymentMode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="ml-2 font-medium">{selectedRecord.paymentStatus}</span>
                  </div>
                  {selectedRecord.commissionAmount && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Commission:</span>
                      <span className="ml-2 font-medium">RM {selectedRecord.commissionAmount}</span>
                      {!selectedRecord.commissionPaid && (
                        <span className="ml-2 text-xs text-orange-600">(Unpaid - will be cancelled)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Refund Amount (RM) *</Label>
              <Input 
                type="number"
                placeholder="Enter refund amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                max={selectedRecord?.amount}
                min={0}
              />
              <p className="text-xs text-gray-500">Maximum refundable: RM {selectedRecord?.amount}</p>
            </div>

            <div className="space-y-2">
              <Label>Refund Reason Type *</Label>
              <Select value={refundReasonType} onValueChange={setRefundReasonType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Job Cancellation">Job Cancellation</SelectItem>
                  <SelectItem value="Customer Request">Customer Request</SelectItem>
                  <SelectItem value="Overpayment">Overpayment</SelectItem>
                  <SelectItem value="Service Not Delivered">Service Not Delivered</SelectItem>
                  <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                  <SelectItem value="Commission Adjustment">Commission Adjustment</SelectItem>
                  <SelectItem value="Billing Error">Billing Error</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Detailed Reason *</Label>
              <Textarea 
                placeholder="Enter detailed explanation for refund..."
                value={refundNotes}
                onChange={(e) => setRefundNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Important</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Refund will be processed immediately</li>
                    <li>Booking status will be updated to cancelled</li>
                    {selectedRecord?.commissionAmount && !selectedRecord.commissionPaid && (
                      <li className="text-orange-600">Linked commission of RM {selectedRecord.commissionAmount} will be cancelled</li>
                    )}
                    {selectedRecord?.invoiceStatus === "issued" && (
                      <li className="text-orange-600">Please update related invoice records</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowRefundModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleProcessRefund}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Cancel Booking / Delivery Order</DialogTitle>
            <DialogDescription className="text-sm">
              Please provide a reason for cancellation: {selectedRecord?.doNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 md:p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-red-800">Warning</p>
                  <p className="text-sm text-gray-700">This action will cancel the booking and update all related records.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cancellation Reason Type *</Label>
              <Select value={cancelReasonType} onValueChange={setCancelReasonType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer Request">Customer Request</SelectItem>
                  <SelectItem value="Service Issue">Service Issue</SelectItem>
                  <SelectItem value="Payment Problem">Payment Problem</SelectItem>
                  <SelectItem value="Weather Conditions">Weather Conditions</SelectItem>
                  <SelectItem value="Equipment Unavailable">Equipment Unavailable</SelectItem>
                  <SelectItem value="Driver Unavailable">Driver Unavailable</SelectItem>
                  <SelectItem value="Duplicate Booking">Duplicate Booking</SelectItem>
                  <SelectItem value="Change of Plan">Change of Plan</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Detailed Reason *</Label>
              <Textarea 
                placeholder="Provide detailed explanation for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>

            {selectedRecord && (
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-semibold">Booking Details:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{selectedRecord.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 font-medium">RM {selectedRecord.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="ml-2 font-medium">{selectedRecord.paymentStatus}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Invoice Status:</span>
                    <span className="ml-2 font-medium">{selectedRecord.invoiceStatus}</span>
                  </div>
                </div>
                {selectedRecord.paymentStatus === "received" && (
                  <p className="text-orange-600 text-xs mt-2">
                    Note: Payment was already received. You may need to process a refund.
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="w-full sm:w-auto">
              Keep Booking
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmCancellation}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Invoice Confirmation Modal */}
      <Dialog open={showConvertInvoiceModal} onOpenChange={setShowConvertInvoiceModal}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Convert to Invoice</DialogTitle>
            <DialogDescription className="text-sm">
              Generate invoice for DO: {selectedRecord?.doNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm mb-3">Delivery Order Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">DO Number:</span>
                    <span className="ml-2 font-medium">{selectedRecord.doNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{selectedRecord.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 font-medium text-lg text-green-600">RM {selectedRecord.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Mode:</span>
                    <span className="ml-2 font-medium">{selectedRecord.paymentMode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Service Date:</span>
                    <span className="ml-2 font-medium">{selectedRecord.scheduledDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bin Size:</span>
                    <span className="ml-2 font-medium">{selectedRecord.binSize}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-sm mb-2">Invoice Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice ID:</span>
                    <span className="font-medium">INV-{String(invoices.length + 1).padStart(4, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-300">
                    <span className="text-gray-600 font-semibold">Invoice Amount:</span>
                    <span className="font-bold text-lg text-green-700">RM {selectedRecord.amount}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Important Notes</p>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1 list-disc list-inside">
                      <li>Invoice will be issued immediately</li>
                      <li>Customer will receive invoice notification</li>
                      <li>Payment tracking will be activated</li>
                      {selectedRecord.commissionAmount && (
                        <li className="text-green-600">Commission of RM {selectedRecord.commissionAmount} will be tracked</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowConvertInvoiceModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleConfirmConvertToInvoice} className="w-full sm:w-auto">
              <Receipt className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Modal */}
      <Dialog open={showInvoiceDetailsModal} onOpenChange={setShowInvoiceDetailsModal}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Invoice Details</DialogTitle>
            <DialogDescription className="text-sm">
              Invoice ID: {selectedInvoice?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 md:space-y-6">
              {/* Invoice Header */}
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <h3 className="text-2xl font-bold">INVOICE</h3>
                    <p className="text-blue-100 mt-1">{selectedInvoice.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">LattisBin Services</p>
                    <p className="text-sm text-blue-100">Waste Management Solutions</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm md:text-base">Bill To</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">{selectedInvoice.customerName}</p>
                      <p className="text-gray-600">DO Number: {selectedInvoice.doNumber}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm md:text-base">Invoice Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">{new Date(selectedInvoice.issuedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Mode:</span>
                        <span className="font-medium">{selectedInvoice.paymentMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {selectedInvoice.status === "paid" ? (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm md:text-base">Invoice Items</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[300px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-semibold">Description</th>
                        <th className="text-right py-2 text-sm font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 text-sm">Bin Service - DO: {selectedInvoice.doNumber}</td>
                        <td className="py-3 text-sm text-right">RM {selectedInvoice.amount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300">
                        <td className="py-3 text-right font-bold">Total Amount:</td>
                        <td className="py-3 text-right font-bold text-lg text-green-600">RM {selectedInvoice.amount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-sm mb-2">Payment Instructions</h4>
                <p className="text-sm text-gray-600">
                  Please make payment via {selectedInvoice.paymentMode} within the due date.
                  For inquiries, contact our billing department.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowInvoiceDetailsModal(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {selectedInvoice?.status === "pending" && (
              <Button className="w-full sm:w-auto">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsAndDOs;
