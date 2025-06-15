
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AddInvoiceModal from "./AddInvoiceModal";
import {
  Search,
  FileText,
  Download,
  Eye,
  Plus,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Printer,
  Send,
  Receipt,
  CreditCard,
} from "lucide-react";

const DUMMY_INVOICES = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    customerName: "ABC Construction",
    date: "2024-01-15",
    amount: 550.00,
    status: "paid",
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    customerName: "Green Solutions Ltd",
    date: "2024-01-10",
    amount: 320.00,
    status: "pending",
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    customerName: "City Apartments",
    date: "2024-01-05",
    amount: 870.00,
    status: "overdue",
  },
  {
    id: 4,
    invoiceNumber: "INV-2023-124",
    customerName: "New Tech Inc",
    date: "2023-12-28",
    amount: 1200.00,
    status: "paid",
  },
  {
    id: 5,
    invoiceNumber: "INV-2023-123",
    customerName: "Global Enterprises",
    date: "2023-12-22",
    amount: 760.00,
    status: "pending",
  },
  {
    id: 6,
    invoiceNumber: "INV-2023-122",
    customerName: "Star Manufacturing",
    date: "2023-12-15",
    amount: 410.00,
    status: "overdue",
  },
];

const InvoiceSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof DUMMY_INVOICES[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredInvoices = useMemo(() => {
    return DUMMY_INVOICES.filter((invoice) => {
      const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(invoice.amount).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleInvoiceSelect = (invoice: typeof DUMMY_INVOICES[0]) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
    toast({
      title: "Invoice Preview",
      description: `Viewing invoice ${invoice.invoiceNumber}`,
    });
  };

  const handleDownloadInvoice = (invoice?: typeof DUMMY_INVOICES[0]) => {
    const invoiceRef = invoice || selectedInvoice;
    toast({
      title: "Download Started",
      description: `Downloading ${invoiceRef?.invoiceNumber || 'invoice'}...`,
    });
  };

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${selectedInvoice?.invoiceNumber} has been sent successfully.`,
    });
  };

  const handlePrintInvoice = () => {
    toast({
      title: "Print Invoice",
      description: `Printing ${selectedInvoice?.invoiceNumber}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-3 h-3" />;
      case "pending": return <Clock className="w-3 h-3" />;
      case "overdue": return <AlertTriangle className="w-3 h-3" />;
      default: return <Receipt className="w-3 h-3" />;
    }
  };

  const calculateTotalRevenue = () => {
    return DUMMY_INVOICES.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const totalRevenue = calculateTotalRevenue();
  const paidInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "paid").length;
  const pendingInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "pending").length;
  const overdueInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "overdue").length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Invoice Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track payments and manage billing efficiently
              </p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <div className="p-1 bg-green-100 dark:bg-green-800 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">RM {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">All invoices combined</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{paidInvoicesCount}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Successfully collected</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
              <div className="p-1 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{pendingInvoicesCount}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
              <div className="p-1 bg-red-100 dark:bg-red-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{overdueInvoicesCount}</div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                            {invoice.date}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.customerName}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {invoice.date}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        RM {invoice.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border w-fit`}>
                        {getStatusIcon(invoice.status)}
                        <span className="hidden sm:inline">
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInvoiceSelect(invoice)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-1 sm:p-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="hover:bg-green-50 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 p-1 sm:p-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Download</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <Receipt className="w-5 h-5 text-blue-600" />
              Invoice Preview
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedInvoice.customerName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invoice: {selectedInvoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date: {selectedInvoice.date}
                    </p>
                  </div>
                  <div className="text-left sm:text-right space-y-2">
                    <h4 className="text-3xl font-bold text-gray-900 dark:text-white">
                      RM {selectedInvoice.amount.toFixed(2)}
                    </h4>
                    <Badge className={`${getStatusColor(selectedInvoice.status)} flex items-center gap-1 px-3 py-1 rounded-full border w-fit`}>
                      {getStatusIcon(selectedInvoice.status)}
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-lg">
                        <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      Billing Details
                    </h4>
                    <div className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedInvoice.customerName}
                        <br />
                        123 Main Street
                        <br />
                        Kuala Lumpur, 50000
                        <br />
                        Malaysia
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <div className="p-1 bg-green-100 dark:bg-green-800 rounded-lg">
                        <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      Payment Details
                    </h4>
                    <div className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Payment Method: Credit Card
                        <br />
                        Card ending in: **** 1234
                        <br />
                        Due Date: {new Date(selectedInvoice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadInvoice()}
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button 
                  onClick={handleSendInvoice}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Invoice
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No invoice selected.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Invoice Modal */}
      <AddInvoiceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default InvoiceSection;
