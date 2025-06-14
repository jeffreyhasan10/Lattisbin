import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import {
  DollarSign,
  Filter,
  FileText,
  Download,
  Plus,
  Check,
  Clock,
  AlertCircle,
  User,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Dummy data for commissions
const initialCommissions = [
  {
    id: 1,
    introducer: "John Smith",
    invoiceId: "INV-001",
    amount: 150.0,
    status: "Pending",
    date: "2025-04-10",
  },
  {
    id: 2,
    introducer: "Jane Doe",
    invoiceId: "INV-002",
    amount: 200.0,
    status: "Paid",
    date: "2025-04-08",
  },
  {
    id: 3,
    introducer: "Alice Brown",
    invoiceId: "INV-003",
    amount: 100.0,
    status: "Pending",
    date: "2025-04-05",
  },
];

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState(initialCommissions);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIntroducer, setFilterIntroducer] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommission, setNewCommission] = useState({
    introducer: "",
    invoiceId: "",
    amount: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const printRef = useRef();
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "LattisEWM_Commissions_Report",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Introducer", "Invoice ID", "Amount", "Status", "Date"],
      ...commissions.map((c) => [
        c.id,
        c.introducer,
        c.invoiceId,
        c.amount,
        c.status,
        c.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LattisEWM_Commissions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: "Commissions have been exported as CSV.",
    });
  };

  const handleMarkPaid = (id) => {
    setCommissions((prev) =>
      prev.map((commission) =>
        commission.id === id ? { ...commission, status: "Paid" } : commission
      )
    );
    toast({
      title: "Commission Paid",
      description: "The commission has been marked as paid.",
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!newCommission.introducer.trim())
      errors.introducer = "Introducer name is required";
    if (!newCommission.invoiceId.trim())
      errors.invoiceId = "Invoice ID is required";
    if (!newCommission.amount || isNaN(parseFloat(newCommission.amount)) || parseFloat(newCommission.amount) <= 0)
      errors.amount = "Valid amount is required";
    if (!newCommission.date) errors.date = "Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCommission = () => {
    if (!validateForm()) return;

    const newId = Math.max(...commissions.map((c) => c.id), 0) + 1;
    setCommissions([
      ...commissions,
      {
        id: newId,
        introducer: newCommission.introducer,
        invoiceId: newCommission.invoiceId,
        amount: parseFloat(newCommission.amount),
        status: "Pending",
        date: newCommission.date,
      },
    ]);
    setNewCommission({
      introducer: "",
      invoiceId: "",
      amount: "",
      date: "",
    });
    setFormErrors({});
    setIsModalOpen(false);
    toast({
      title: "Commission Added",
      description: "A new commission has been successfully added.",
    });
  };

  const introducers = [...new Set(commissions.map((c) => c.introducer))];

  const filteredCommissions = commissions
    .filter((commission) => {
      const matchesSearch =
        commission.introducer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterStatus === "all") return matchesSearch;
      return matchesSearch && commission.status.toLowerCase() === filterStatus.toLowerCase();
    })
    .filter((commission) =>
      filterIntroducer === "all" || commission.introducer === filterIntroducer
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      const valA = String(a[sortBy]).toLowerCase();
      const valB = String(b[sortBy]).toLowerCase();
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valB);
    });

  const totalCommissions = commissions.reduce(
    (sum, commission) => sum + commission.amount,
    0
  );
  const paidCommissions = commissions
    .filter((c) => c.status === "Paid")
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions
    .filter((c) => c.status === "Pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const getStatusBadge = (status) => {
    const baseClasses = "font-medium flex items-center gap-1 px-3 py-1 rounded-full";
    switch (status) {
      case "Paid":
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
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Commission Management
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Track and manage commissions for introducers
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Add Commission
          </Button>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          {
            title: "Total Commissions",
            value: `RM ${totalCommissions.toFixed(2)}`,
            icon: DollarSign,
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            title: "Paid Commissions",
            value: `RM ${paidCommissions.toFixed(2)}`,
            icon: Check,
            color: "emerald",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
          {
            title: "Pending Commissions",
            value: `RM ${pendingCommissions.toFixed(2)}`,
            icon: Clock,
            color: "amber",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
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
                  <p className={`text-3xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
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
              <DropdownMenuItem onClick={() => setFilterStatus("Paid")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Pending")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <Filter className="h-5 w-5" />
                <span>{filterIntroducer === "all" ? "Filter by Introducer" : filterIntroducer}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuItem onClick={() => setFilterIntroducer("all")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All Introducers</DropdownMenuItem>
              {introducers.map((introducer) => (
                <DropdownMenuItem
                  key={introducer}
                  onClick={() => setFilterIntroducer(introducer)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {introducer}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1 w-full sm:w-72">
            <Input
              placeholder="Search commissions..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
          {filteredCommissions.length} Commissions
        </Badge>
      </div>

      {/* Commission List */}
      {isLoading ? (
        <div className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-12 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="h-80 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
            <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
              <FileText className="h-6 w-6" />
              Commission Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                      onClick={() => handleSort("introducer")}
                    >
                      <div className="flex items-center gap-2">
                        Introducer
                        {sortBy === "introducer" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
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
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-2">
                        Amount
                        {sortBy === "amount" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
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
                    {filteredCommissions.length > 0 ? (
                      filteredCommissions.map((commission) => (
                        <motion.tr
                          key={commission.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">{commission.id}</TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">{commission.introducer}</TableCell>
                          <TableCell className="text-blue-600 dark:text-blue-400">{commission.invoiceId}</TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">RM {commission.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(commission.status)}</TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {new Date(commission.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-3">
                              {commission.status !== "Paid" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                                  onClick={() => handleMarkPaid(commission.id)}
                                >
                                  Mark as Paid
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                                onClick={handlePrint}
                              >
                                Print
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                                onClick={exportToCSV}
                              >
                                Export
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center py-8">
                            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                              No commissions found
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Commission Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Commission
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={newCommission.introducer}
                onChange={(e) =>
                  setNewCommission({ ...newCommission, introducer: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Introducer Name</label>
              {formErrors.introducer && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.introducer}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newCommission.invoiceId}
                onChange={(e) =>
                  setNewCommission({ ...newCommission, invoiceId: e.target.value })
                }
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
                type="number"
                step="0.01"
                value={newCommission.amount}
                onChange={(e) =>
                  setNewCommission({ ...newCommission, amount: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-doctor -translate-y-1/2 text-gray-400 h-5 w-5" />
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
            <div className="relative">
              <Input
                type="date"
                value={newCommission.date}
                onChange={(e) =>
                  setNewCommission({ ...newCommission, date: e.target.value })
                }
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
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text AUGUST 2025-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddCommission}
            >
              Add Commission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CommissionManagement;