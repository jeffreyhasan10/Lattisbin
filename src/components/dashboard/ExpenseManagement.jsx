import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import {
  DollarSign,
  Filter,
  File,
  Download,
  Plus,
  AlertCircle,
  FileText,
  Calendar,
  ArrowUpDown,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Dummy data for expenses
const initialExpenses = [
  {
    id: 1,
    category: "Salary",
    description: "Monthly staff salary",
    amount: 5000.0,
    date: "2025-04-01",
  },
  {
    id: 2,
    category: "Lorry Repair",
    description: "Repair for lorry ABC123",
    amount: 1200.0,
    date: "2025-04-05",
  },
  {
    id: 3,
    category: "Petrol",
    description: "Fuel for lorry fleet",
    amount: 800.0,
    date: "2025-04-10",
  },
  {
    id: 4,
    category: "Advance Salary",
    description: "Advance payment for staff",
    amount: 1000.0,
    date: "2025-04-12",
  },
  {
    id: 5,
    category: "Bin Repair",
    description: "Repair for damaged bins",
    amount: 600.0,
    date: "2025-04-15",
  },
  {
    id: 6,
    category: "Others",
    description: "Miscellaneous expenses",
    amount: 400.0,
    date: "2025-04-18",
  },
];

const expenseCategories = [
  "Salary",
  "Advance Salary",
  "Lorry Repair",
  "Petrol",
  "Bin Repair",
  "Others",
];

const categoryColors = {
  Salary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Advance Salary": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Lorry Repair": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Petrol: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Bin Repair": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Others: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const printRef = useRef();
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "LattisEWM_Expenses_Report",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Category", "Description", "Amount", "Date"],
      ...expenses.map((e) => [e.id, e.category, e.description, e.amount, e.date]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LattisEWM_Expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: "Expenses have been exported as CSV.",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newExpense.category) newErrors.category = "Category is required";
    if (!newExpense.description.trim())
      newErrors.description = "Description is required";
    if (!newExpense.amount || newExpense.amount <= 0)
      newErrors.amount = "Valid amount is required";
    if (!newExpense.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExpense = () => {
    if (!validateForm()) return;

    const newId = Math.max(...expenses.map((e) => e.id), 0) + 1;
    setExpenses([
      ...expenses,
      {
        id: newId,
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
      },
    ]);
    setNewExpense({ category: "", description: "", amount: "", date: "" });
    setErrors({});
    setIsModalOpen(false);
    toast({
      title: "Expense Added",
      description: "New expense has been successfully added.",
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        (filterCategory === "All" || expense.category === filterCategory) &&
        (expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === "amount") {
        return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
      }
      const valA = String(a[sortBy]).toLowerCase();
      const valB = String(b[sortBy]).toLowerCase();
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryBreakdown = expenseCategories.reduce((acc, category) => {
    const total = expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...acc, [category]: total };
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
      ref={printRef}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Expense Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Track and manage company expenses with ease
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Add Expense
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
            title: "Total Expenses",
            value: `RM ${totalExpenses.toFixed(2)}`,
            icon: DollarSign,
            color: "red",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
          },
          {
            title: "Salary Expenses",
            value: `RM ${(categoryBreakdown["Salary"] || 0).toFixed(2)}`,
            icon: FileText,
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            title: "Other Expenses",
            value: `RM ${(totalExpenses - (categoryBreakdown["Salary"] || 0)).toFixed(2)}`,
            icon: File,
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
                <span>{filterCategory === "All" ? "Filter by Category" : filterCategory}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterCategory("All")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All</DropdownMenuItem>
              {expenseCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
            <Calendar className="h-5 w-5" />
            <span>Apr 2025</span>
          </Button>
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
            <File className="h-5 w-5" />
            <span>Print</span>
          </Button>
          <div className="relative flex-1 w-full sm:w-72">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search expenses..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
          {filteredExpenses.length} Expenses
        </Badge>
      </div>

      {/* Expense List */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            <FileText className="h-6 w-6" />
            Expense Directory
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
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {sortBy === "category" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("description")}
                  >
                    <div className="flex items-center gap-2">
                      Description
                      {sortBy === "description" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
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
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {sortBy === "date" && <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium text-blue-600 dark:text-blue-400">{expense.id}</TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Badge className={`${categoryColors[expense.category]} font-medium flex items-center gap-1 px-3 py-1 rounded-full`}>
                              {expense.category}
                            </Badge>
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">{expense.description}</TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">RM {expense.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">{new Date(expense.date).toLocaleDateString()}</TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center py-8">
                          <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No expenses found
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

      {/* Add Expense Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Expense
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Select
                value={newExpense.category}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, category: value })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {errors.category}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Description</label>
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {errors.description}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Amount (RM)</label>
              {errors.amount && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {errors.amount}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text- sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Date</label>
              {errors.date && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {errors.date}
                </motion.p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsModalOpen(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddExpense}
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ExpenseManagement;