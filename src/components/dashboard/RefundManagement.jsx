import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import {
  Receipt,
  Filter,
  Download,
  Plus,
  AlertCircle,
  FileText,
  ArrowUpDown,
  Search,
  Check,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Dummy data for refunds and cancellations
const initialRefunds = [
  {
    id: 1,
    type: "Refund",
    doNumber: "DO-001",
    invoiceId: "INV-001",
    customer: "John Smith",
    amount: 300.0,
    reason: "Customer Cancellation",
    status: "Pending",
    date: "2025-04-10",
  },
  {
    id: 2,
    type: "Refund",
    doNumber: "DO-002",
    invoiceId: "INV-002",
    customer: "Jane Doe",
    amount: 250.0,
    reason: "Incorrect Delivery",
    status: "Processed",
    date: "2025-04-08",
  },
  {
    id: 3,
    type: "Cancel Job",
    doNumber: "DO-003",
    invoiceId: "INV-003",
    customer: "Ali Ahmad",
    amount: 0.0,
    reason: "Job Not Completed",
    status: "Processed",
    date: "2025-04-07",
  },
];

const refundReasons = [
  "Customer Cancellation",
  "Incorrect Delivery",
  "Job Not Completed",
  "Others",
];

const RefundManagement = () => {
  const [refunds, setRefunds] = useState(initialRefunds);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRefund, setNewRefund] = useState({
    type: "Refund",
    doNumber: "",
    invoiceId: "",
    customer: "",
    amount: "",
    reason: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const printRef = useRef();
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "LattisEWM_Refund_Report",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Type", "DO Number", "Invoice ID", "Customer", "Amount", "Reason", "Status", "Date"],
      ...refunds.map((r) => [
        r.id,
        r.type,
        r.doNumber,
        r.invoiceId,
        r.customer,
        r.amount,
        r.reason,
        r.status,
        r.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LattisEWM_Refunds.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: "Refunds and cancellations have been exported as CSV.",
    });
  };

  const handleProcessRefund = (id) => {
    setRefunds((prev) =>
      prev.map((refund) =>
        refund.id === id ? { ...refund, status: "Processed" } : refund
      )
    );
    toast({
      title: "Refund Processed",
      description: "The refund has been successfully processed.",
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!newRefund.type) errors.type = "Type is required";
    if (!newRefund.doNumber.trim()) errors.doNumber = "DO Number is required";
    if (!newRefund.invoiceId.trim()) errors.invoiceId = "Invoice ID is required";
    if (!newRefund.customer.trim()) errors.customer = "Customer name is required";
    if (newRefund.type === "Refund" && (!newRefund.amount || newRefund.amount <= 0))
      errors.amount = "Valid amount is required for refunds";
    if (!newRefund.reason) errors.reason = "Reason is required";
    if (!newRefund.date) errors.date = "Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitiateRefund = () => {
    if (!validateForm()) return;

    const newId = Math.max(...refunds.map((r) => r.id), 0) + 1;
    setRefunds([
      ...refunds,
      {
        id: newId,
        type: newRefund.type,
        doNumber: newRefund.doNumber,
        invoiceId: newRefund.invoiceId,
        customer: newRefund.customer,
        amount: newRefund.type === "Refund" ? parseFloat(newRefund.amount) : 0.0,
        reason: newRefund.reason,
        status: "Pending",
        date: newRefund.date,
      },
    ]);
    setNewRefund({
      type: "Refund",
      doNumber: "",
      invoiceId: "",
      customer: "",
      amount: "",
      reason: "",
      date: "",
    });
    setFormErrors({});
    setIsCreateModalOpen(false);
    toast({
      title: `${newRefund.type} Initiated`,
      description: `A new ${newRefund.type.toLowerCase()} has been successfully initiated.`,
    });
  };

  const filteredRefunds = refunds
    .filter((refund) => {
      const matchesSearch =
        refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.doNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || refund.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesReason =
        filterReason === "all" || refund.reason === filterReason;
      return matchesSearch && matchesStatus && matchesReason;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      const valA = String(a[sortBy]).toLowerCase();
      const valB = String(b[sortBy]).toLowerCase();
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  const totalRefunds = refunds
    .filter((r) => r.type === "Refund")
    .reduce((sum, refund) => sum + refund.amount, 0);
  const statusCounts = {
    Pending: refunds.filter((r) => r.status === "Pending").length,
    Processed: refunds.filter((r) => r.status === "Processed").length,
  };
  const reasonBreakdown = refundReasons.reduce((acc, reason) => {
    const total = refunds
      .filter((r) => r.reason === reason)
      .reduce((sum, r) => sum + (r.type === "Refund" ? r.amount : 0), 0);
    return { ...acc, [reason]: total };
  }, {});

  const getStatusBadge = (status) => {
    const baseClasses = "font-medium flex items-center gap-1 px-3 py-1 rounded-full";
    switch (status) {
      case "Processed":
        return (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge className={`${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300`}>
              <Check className="h-4 w-4" /> {status}
            </Badge>
          </motion.div>
        );
      case "Pending":
        return (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge className={`${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300`}>
              <Clock className="h-4 w-4" /> {status}
            </Badge>
          </motion.div>
        );
      default:
        return (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</Badge>
          </motion.div>
        );
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "font-medium px-3 py-1 rounded-full";
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge
          className={`${baseClasses} ${
            type === "Refund"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          }`}
        >
          {type}
        </Badge>
      </motion.div>
    );
  };

  const getReasonBadge = (reason) => {
    const baseClasses = "font-medium px-3 py-1 rounded-full";
    const reasonStyles = {
      "Customer Cancellation": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Incorrect Delivery": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Job Not Completed": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Others: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge className={`${baseClasses} ${reasonStyles[reason]}`}>
          {reason}
        </Badge>
      </motion.div>
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={printRef}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Refund & Cancellation Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Track and manage refunds and canceled jobs
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Initiate Action
          </Button>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          {
            title: "Total Refunds",
            value: `RM ${totalRefunds.toFixed(2)}`,
            icon: Receipt,
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            title: "Pending Actions",
            value: statusCounts.Pending,
            icon: Clock,
            color: "amber",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
          },
          {
            title: "Processed Actions",
            value: statusCounts.Processed,
            icon: Check,
            color: "emerald",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
          {
            title: "Most Common Reason",
            value: refundReasons.reduce(
              (max, reason) =>
                reasonBreakdown[reason] > reasonBreakdown[max] ? reason : max,
              refundReasons[0]
            ),
            icon: AlertCircle,
            color: "purple",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{card.title}</p>
                  <p className={`text-2xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
                </div>
                <div className={`rounded-full ${card.iconBg} p-4 dark:${card.iconBg.replace("100", "900")}`}>
                  <card.icon className={`h-8 w-8 ${card.iconColor} dark:${card.iconColor.replace("600", "300")}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex gap-4 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <Filter className="h-5 w-5" />
                <span>{filterStatus === "all" ? "Filter by Status" : filterStatus}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuItem onClick={() => setFilterStatus("all")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Pending")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Processed")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Processed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <Filter className="h-5 w-5" />
                <span>{filterReason === "all" ? "Filter by Reason" : filterReason}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuItem onClick={() => setFilterReason("all")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All Reasons</DropdownMenuItem>
              {refundReasons.map((reason) => (
                <DropdownMenuItem
                  key={reason}
                  onClick={() => setFilterReason(reason)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {reason}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by customer, DO, or invoice..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
            onClick={exportToCSV}
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
            onClick={handlePrint}
          >
            <FileText className="h-5 w-5" />
            <span>Print</span>
          </Button>
        </div>
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
          {filteredRefunds.length} Records
        </Badge>
      </div>

      {/* Records Table */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            <Receipt className="h-6 w-6" />
            Refund & Cancellation Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-4 p-6">
                <Skeleton className="h-12 w-1/3 rounded-xl" />
                <Skeleton className="h-6 w-2/3 rounded-xl" />
                <Skeleton className="h-80 w-full rounded-xl" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {sortBy === "id" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-2">
                        Type
                        {sortBy === "type" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("doNumber")}
                    >
                      <div className="flex items-center gap-2">
                        DO Number
                        {sortBy === "doNumber" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("invoiceId")}
                    >
                      <div className="flex items-center gap-2">
                        Invoice ID
                        {sortBy === "invoiceId" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center gap-2">
                        Customer
                        {sortBy === "customer" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-2">
                        Amount
                        {sortBy === "amount" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("reason")}
                    >
                      <div className="flex items-center gap-2">
                        Reason
                        {sortBy === "reason" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "status" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortBy === "date" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredRefunds.length > 0 ? (
                      filteredRefunds.map((refund) => (
                        <motion.tr
                          key={refund.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">{refund.id}</TableCell>
                          <TableCell>{getTypeBadge(refund.type)}</TableCell>
                          <TableCell className="text-blue-600 dark:text-blue-400">{refund.doNumber}</TableCell>
                          <TableCell className="text-blue-600 dark:text-blue-400">{refund.invoiceId}</TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">{refund.customer}</TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">RM {refund.amount.toFixed(2)}</TableCell>
                          <TableCell>{getReasonBadge(refund.reason)}</TableCell>
                          <TableCell>{getStatusBadge(refund.status)}</TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {new Date(refund.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {refund.status !== "Processed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                                onClick={() => handleProcessRefund(refund.id)}
                              >
                                Process
                              </Button>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell colSpan={10} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center py-8">
                            <Receipt className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                              No records found
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                              Try adjusting your search or filter settings.
                            </p>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Refund/Cancel Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Initiate Refund or Cancellation
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Select
                value={newRefund.type}
                onValueChange={(value) => setNewRefund({ ...newRefund, type: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="Refund" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Refund</SelectItem>
                  <SelectItem value="Cancel Job" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel Job</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.type}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newRefund.doNumber}
                onChange={(e) => setNewRefund({ ...newRefund, doNumber: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">DO Number</label>
              {formErrors.doNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.doNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newRefund.invoiceId}
                onChange={(e) => setNewRefund({ ...newRefund, invoiceId: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Invoice ID</label>
              {formErrors.invoiceId && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.invoiceId}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newRefund.customer}
                onChange={(e) => setNewRefund({ ...newRefund, customer: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Customer Name</label>
              {formErrors.customer && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.customer}
                </motion.p>
              )}
            </div>
            {newRefund.type === "Refund" && (
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={newRefund.amount}
                  onChange={(e) => setNewRefund({ ...newRefund, amount: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Amount (RM)</label>
                {formErrors.amount && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.amount}
                  </motion.p>
                )}
              </div>
            )}
            <div className="relative">
              <Select
                value={newRefund.reason}
                onValueChange={(value) => setNewRefund({ ...newRefund, reason: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {refundReasons.map((reason) => (
                    <SelectItem key={reason} value={reason} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.reason && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.reason}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={newRefund.date}
                onChange={(e) => setNewRefund({ ...newRefund, date: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Date</label>
              {formErrors.date && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.date}
                </motion.p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleInitiateRefund}
            >
              Initiate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RefundManagement;