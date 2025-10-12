import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  RefreshCw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePayments } from "@/contexts/PaymentContext";
import { exportToCSV, formatCurrency, formatDate, getDaysUntilDue } from "@/utils/exportUtils";
import { toast } from "sonner";

const PaymentOverview: React.FC = () => {
  const navigate = useNavigate();
  const { payments, getPaymentStats } = usePayments();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "customer">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get payment statistics
  const stats = getPaymentStats();

  // Filter payments by date range
  const filterByDateRange = useMemo(() => (payment: { dueDate: string }) => {
    if (dateRange === "all") return true;
    
    const today = new Date();
    const paymentDate = new Date(payment.dueDate);
    
    switch (dateRange) {
      case "today":
        return paymentDate.toDateString() === today.toDateString();
      case "week": {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return paymentDate >= weekAgo;
      }
      case "month": {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return paymentDate >= monthAgo;
      }
      case "quarter": {
        const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        return paymentDate >= quarterAgo;
      }
      default:
        return true;
    }
  }, [dateRange]);

  // Filtering and sorting logic
  const filteredAndSortedPayments = useMemo(() => {
    const filtered = payments.filter((payment) => {
      const matchesSearch =
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPaymentMode =
        paymentModeFilter === "all" || payment.paymentMode === paymentModeFilter;

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      const matchesDateRange = filterByDateRange(payment);

      return matchesSearch && matchesPaymentMode && matchesStatus && matchesDateRange;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "customer":
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [payments, searchTerm, paymentModeFilter, statusFilter, sortBy, sortOrder, filterByDateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);
  const paginatedPayments = filteredAndSortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle export
  const handleExport = () => {
    if (filteredAndSortedPayments.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const filename = `payment-report-${new Date().toISOString().split("T")[0]}.csv`;
    exportToCSV(filteredAndSortedPayments, filename);
    toast.success("Report exported successfully!");
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm("");
    setPaymentModeFilter("all");
    setStatusFilter("all");
    setDateRange("all");
    setCurrentPage(1);
    toast.success("Filters cleared!");
  };

  // Toggle sort
  const toggleSort = (field: "date" | "amount" | "customer") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Received
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case "Cash":
        return <Banknote className="w-4 h-4 text-green-600" />;
      case "Online":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "CDM":
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case "E-Wallet":
        return <Smartphone className="w-4 h-4 text-orange-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getDueDateInfo = (dueDate: string, status: string) => {
    if (status === "received") return null;
    
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (daysUntil < 0) {
      return (
        <span className="text-xs text-red-600 font-semibold">
          {Math.abs(daysUntil)} days overdue
        </span>
      );
    } else if (daysUntil === 0) {
      return <span className="text-xs text-orange-600 font-semibold">Due today</span>;
    } else if (daysUntil <= 7) {
      return (
        <span className="text-xs text-amber-600 font-semibold">
          Due in {daysUntil} days
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-8 h-8 text-blue-600" />
              Payment Overview & Tracking
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor cash flow, track payments, and identify overdue accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                  <p className="text-xs text-blue-100 mt-1">All payments</p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Received Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(stats.totalReceived)}
                  </p>
                  <p className="text-xs text-emerald-100 mt-1">
                    {stats.paymentsCount.received} payments
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(stats.totalPending)}
                  </p>
                  <p className="text-xs text-amber-100 mt-1">
                    {stats.paymentsCount.pending} payments
                  </p>
                </div>
                <Clock className="w-12 h-12 text-amber-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">
                Overdue Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(stats.totalOverdue)}
                  </p>
                  <p className="text-xs text-red-100 mt-1">
                    {stats.paymentsCount.overdue} payments
                  </p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Mode Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Payment Mode Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.paymentByMode).map(([mode, amount]) => (
                <div
                  key={mode}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {mode}
                    </span>
                    {getPaymentModeIcon(mode)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(amount)}
                  </p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{
                        width: `${stats.totalReceived > 0 ? (amount / stats.totalReceived) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalReceived > 0
                      ? ((amount / stats.totalReceived) * 100).toFixed(1)
                      : 0}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customer or invoice..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={paymentModeFilter}
                onValueChange={(value) => {
                  setPaymentModeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="CDM">CDM</SelectItem>
                  <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateRange}
                onValueChange={(value) => {
                  setDateRange(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleExport} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Transactions</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {paginatedPayments.length} of {filteredAndSortedPayments.length} payments
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Invoice
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => toggleSort("customer")}
                    >
                      <div className="flex items-center gap-1">
                        Customer
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => toggleSort("amount")}
                    >
                      <div className="flex items-center gap-1">
                        Amount
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Payment Mode
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Due Date
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.invoiceNumber}
                          </p>
                          {payment.transactionRef && (
                            <p className="text-xs text-gray-500">
                              {payment.transactionRef}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.customerName}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {payment.customerType}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getPaymentModeIcon(payment.paymentMode)}
                          <span className="text-sm text-gray-700">
                            {payment.paymentMode}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {formatDate(payment.dueDate)}
                            </span>
                          </div>
                          {getDueDateInfo(payment.dueDate, payment.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            navigate(`/admin/invoicing/details/${payment.invoiceNumber}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {filteredAndSortedPayments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No payments found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentOverview;
