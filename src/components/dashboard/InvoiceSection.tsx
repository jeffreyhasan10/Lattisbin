import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  FileText,
  Receipt,
  Filter,
  Download,
  Share,
  Check,
  Clock,
  AlertCircle,
  User,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Types for invoice
interface Invoice {
  id: number;
  invoiceNumber: string;
  doNumber: string | null;
  customerName: string;
  phone: string;
  date: string;
  amount: string;
  status: string;
  paymentMethod: string;
  paymentDate: string;
  sentVia: string;
  service: string;
}

// Dummy invoice data
const DUMMY_INVOICES: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-0001",
    doNumber: "DO-2024-1001",
    customerName: "ABC Construction",
    phone: "+60123456789",
    date: "2025-04-10",
    amount: "RM 2500.00",
    status: "Paid",
    paymentMethod: "Online Banking",
    paymentDate: "2025-04-12",
    sentVia: "Email",
    service: "Lorry Rental (10 Ton Hino 500)",
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-0002",
    doNumber: null,
    customerName: "XYZ Logistics",
    phone: "+60198765432",
    date: "2025-04-15",
    amount: "RM 1200.00",
    status: "Pending",
    paymentMethod: "-",
    paymentDate: "-",
    sentVia: "Not Sent",
    service: "Freight Transport (Klang to Penang)",
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-0003",
    doNumber: "DO-2024-1002",
    customerName: "MegaFreight Co.",
    phone: "+60187654321",
    date: "2025-03-30",
    amount: "RM 1800.00",
    status: "Overdue",
    paymentMethod: "-",
    paymentDate: "-",
    sentVia: "WhatsApp",
    service: "Lorry Rental (8 Ton Mitsubishi Fuso)",
  },
  {
    id: 4,
    invoiceNumber: "INV-2024-0004",
    doNumber: "DO-2024-1003",
    customerName: "HeavyDuty Trans",
    phone: "+60134567890",
    date: "2025-04-18",
    amount: "RM 3000.00",
    status: "Paid",
    paymentMethod: "Cheque",
    paymentDate: "2025-04-19",
    sentVia: "Email",
    service: "Lorry Rental (12 Ton Volvo FMX)",
  },
  {
    id: 5,
    invoiceNumber: "INV-2024-0005",
    doNumber: null,
    customerName: "FreightMaster",
    phone: "+60123459876",
    date: "2025-04-05",
    amount: "RM 900.00",
    status: "Pending",
    paymentMethod: "-",
    paymentDate: "-",
    sentVia: "Not Sent",
    service: "Delivery Service (Johor Bahru)",
  },
];

const InvoiceSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(DUMMY_INVOICES);
  const [filterValue, setFilterValue] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sortBy, setSortBy] = useState<keyof Invoice>("invoiceNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    phone: "",
    amount: "",
    service: "",
    paymentMethod: "Cash",
  });

  // Filter invoices with proper type safety
  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchesSearch =
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.doNumber &&
          invoice.doNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        invoice.phone.includes(searchTerm);

      if (filterValue === "all") return matchesSearch;
      return matchesSearch && invoice.status.toLowerCase() === filterValue.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === "date" || sortBy === "paymentDate") {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === "amount") {
        const amountA = parseFloat(a.amount.replace("RM ", "").replace(",", ""));
        const amountB = parseFloat(b.amount.replace("RM ", "").replace(",", ""));
        return sortDirection === "asc" ? amountA - amountB : amountB - amountA;
      }
      // For string fields, ensure we're working with strings
      const valA = String(a[sortBy]).toLowerCase();
      const valB = String(b[sortBy]).toLowerCase();
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  // Calculate totals
  const totalAmount = invoices.reduce((sum, invoice) => {
    const amountNum = parseFloat(invoice.amount.replace("RM ", "").replace(",", ""));
    return sum + amountNum;
  }, 0);

  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, invoice) => {
      const amountNum = parseFloat(invoice.amount.replace("RM ", "").replace(",", ""));
      return sum + amountNum;
    }, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pending" || inv.status === "Overdue")
    .reduce((sum, invoice) => {
      const amountNum = parseFloat(invoice.amount.replace("RM ", "").replace(",", ""));
      return sum + amountNum;
    }, 0);

  // Status badge styling
  const getStatusBadge = (status: string) => {
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
      case "Overdue":
        return (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>
              <AlertCircle className="h-4 w-4" /> {status}
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

  // Form validation
  const validateInvoiceForm = (invoice: typeof newInvoice) => {
    const errors: Record<string, string> = {};
    if (!invoice.customerName.trim()) errors.customerName = "Customer name is required";
    if (!invoice.phone.trim()) errors.phone = "Phone number is required";
    if (!/^\+601[0-9]{8,9}$/.test(invoice.phone)) errors.phone = "Invalid Malaysian phone number";
    if (!invoice.amount.trim() || isNaN(parseFloat(invoice.amount))) errors.amount = "Valid amount is required";
    if (!invoice.service.trim()) errors.service = "Service description is required";
    return errors;
  };

  // Handle create invoice
  const handleCreateInvoice = () => {
    const errors = validateInvoiceForm(newInvoice);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const newId = invoices.length + 1;
    const newInvoiceData: Invoice = {
      id: newId,
      invoiceNumber: `INV-2024-${String(newId).padStart(4, "0")}`,
      doNumber: null,
      customerName: newInvoice.customerName,
      phone: newInvoice.phone,
      date: new Date().toISOString().split("T")[0],
      amount: `RM ${parseFloat(newInvoice.amount).toFixed(2)}`,
      status: "Pending",
      paymentMethod: newInvoice.paymentMethod,
      paymentDate: "-",
      sentVia: "Not Sent",
      service: newInvoice.service,
    };
    setInvoices([...invoices, newInvoiceData]);
    setIsCreateModalOpen(false);
    setNewInvoice({
      customerName: "",
      phone: "",
      amount: "",
      service: "",
      paymentMethod: "Cash",
    });
    setFormErrors({});
  };

  // Handle edit invoice
  const handleEditInvoice = () => {
    if (!selectedInvoice) return;
    const errors = validateInvoiceForm({
      customerName: selectedInvoice.customerName,
      phone: selectedInvoice.phone,
      amount: selectedInvoice.amount.replace("RM ", ""),
      service: selectedInvoice.service,
      paymentMethod: selectedInvoice.paymentMethod,
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setInvoices(invoices.map((inv) => (inv.id === selectedInvoice.id ? { ...selectedInvoice } : inv)));
    setIsEditModalOpen(false);
    setSelectedInvoice(null);
    setFormErrors({});
  };

  // Handle sorting
  const handleSort = (column: keyof Invoice) => {
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
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Invoice Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Track and manage customer invoices with ease
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Create Invoice
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
            title: "Total Revenue",
            value: `RM ${totalAmount.toFixed(2)}`,
            icon: FileText,
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            title: "Received Payments",
            value: `RM ${paidAmount.toFixed(2)}`,
            icon: Receipt,
            color: "emerald",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
          {
            title: "Pending Payments",
            value: `RM ${pendingAmount.toFixed(2)}`,
            icon: Receipt,
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
                <span>{filterValue === "all" ? "Filter by Status" : filterValue}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuItem onClick={() => setFilterValue("all")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue("Paid")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue("Pending")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue("Overdue")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Overdue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
            <Calendar className="h-5 w-5" />
            <span>Apr 2025</span>
          </Button>
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search invoices..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
          {filteredInvoices.length} Invoices
        </Badge>
      </div>

      {/* Invoice List */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            <FileText className="h-6 w-6" />
            Invoice Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("invoiceNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Invoice #
                      {sortBy === "invoiceNumber" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Issue Date
                      {sortBy === "date" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-2">
                      Amount
                      {sortBy === "amount" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Service</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Payment</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="text-blue-600 dark:text-blue-400">{invoice.invoiceNumber}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {invoice.doNumber ? `DO: ${invoice.doNumber}` : "Direct Invoice"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{invoice.customerName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{invoice.phone}</div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {new Date(invoice.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{invoice.amount}</TableCell>
                        <TableCell>
                          <div className="text-sm max-w-[200px] truncate text-gray-700 dark:text-gray-300" title={invoice.service}>
                            {invoice.service}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Sent via: {invoice.sentVia}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          {invoice.paymentMethod !== "-" ? (
                            <>
                              <div className="font-medium text-gray-900 dark:text-gray-100">{invoice.paymentMethod}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(invoice.paymentDate).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setIsEditModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            >
                              Send
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
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center py-8">
                        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                          No invoices found
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

      {/* Create Invoice Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Create New Invoice
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={newInvoice.customerName}
                onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Customer Name</label>
              {formErrors.customerName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.customerName}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newInvoice.phone}
                onChange={(e) => setNewInvoice({ ...newInvoice, phone: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Phone Number</label>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                value={newInvoice.service}
                onChange={(e) => setNewInvoice({ ...newInvoice, service: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Service</label>
              {formErrors.service && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.service}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={newInvoice.paymentMethod}
                onValueChange={(value) => setNewInvoice({ ...newInvoice, paymentMethod: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="Cash" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cash</SelectItem>
                  <SelectItem value="Online Banking" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Online Banking</SelectItem>
                  <SelectItem value="CDM" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">CDM</SelectItem>
                  <SelectItem value="Cheque" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cheque</SelectItem>
                  <SelectItem value="Term" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Term</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={handleCreateInvoice}
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) {
          setSelectedInvoice(null);
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Edit Invoice
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={selectedInvoice?.customerName || ""}
                onChange={(e) => setSelectedInvoice({ ...selectedInvoice!, customerName: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Customer Name</label>
              {formErrors.customerName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.customerName}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedInvoice?.phone || ""}
                onChange={(e) => setSelectedInvoice({ ...selectedInvoice!, phone: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Phone Number</label>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                value={selectedInvoice?.amount.replace("RM ", "") || ""}
                onChange={(e) => setSelectedInvoice({ ...selectedInvoice!, amount: `RM ${parseFloat(e.target.value).toFixed(2)}` })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                value={selectedInvoice?.service || ""}
                onChange={(e) => setSelectedInvoice({ ...selectedInvoice!, service: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Service</label>
              {formErrors.service && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.service}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={selectedInvoice?.paymentMethod || "Cash"}
                onValueChange={(value) => setSelectedInvoice({ ...selectedInvoice!, paymentMethod: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="Cash" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cash</SelectItem>
                  <SelectItem value="Online Banking" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Online Banking</SelectItem>
                  <SelectItem value="CDM" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">CDM</SelectItem>
                  <SelectItem value="Cheque" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cheque</SelectItem>
                  <SelectItem value="Term" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Select
                value={selectedInvoice?.status || "Pending"}
                onValueChange={(value) => setSelectedInvoice({ ...selectedInvoice!, status: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="Paid" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Paid</SelectItem>
                  <SelectItem value="Pending" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Pending</SelectItem>
                  <SelectItem value="Overdue" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                type="date"
                value={selectedInvoice?.paymentDate === "-" ? "" : selectedInvoice?.paymentDate || ""}
                onChange={(e) => setSelectedInvoice({ ...selectedInvoice!, paymentDate: e.target.value || "-" })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Payment Date</label>
            </div>
            <div className="relative">
              <Select
                value={selectedInvoice?.sentVia || "Not Sent"}
                onValueChange={(value) => setSelectedInvoice({ ...selectedInvoice!, sentVia: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Share className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select sent via" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="Not Sent" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Not Sent</SelectItem>
                  <SelectItem value="Email" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Email</SelectItem>
                  <SelectItem value="WhatsApp" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedInvoice(null);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleEditInvoice}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InvoiceSection;
