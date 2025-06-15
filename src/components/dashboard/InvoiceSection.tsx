
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  FileText,
  Download,
  Eye,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Printer,
  Mail,
  Send,
  TrendingUp,
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleInvoiceSelect = (invoice: typeof DUMMY_INVOICES[0]) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedInvoice(null);
  };

  const handleAddInvoice = () => {
    toast({
      title: "Add Invoice",
      description: "Add invoice functionality will be implemented soon.",
    });
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Download Started",
      description: "Invoice is being downloaded...",
    });
  };

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Sent",
      description: "Invoice has been sent successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "pending": return "bg-gradient-to-r from-orange-500 to-amber-600 text-white";
      case "overdue": return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
      default: return "bg-gradient-to-r from-gray-500 to-slate-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertTriangle className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  const calculateTotalRevenue = () => {
    return DUMMY_INVOICES.reduce((sum, invoice) => {
      return sum + invoice.amount;
    }, 0);
  };

  const totalRevenue = calculateTotalRevenue();
  const paidInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "paid").length;
  const pendingInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "pending").length;
  const overdueInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "overdue").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    Invoice Management
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Track payments and manage your billing efficiently
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-200 pt-2">
                <span>📊 Total Revenue: RM {totalRevenue.toFixed(2)}</span>
                <span>•</span>
                <span>📄 {DUMMY_INVOICES.length} Total Invoices</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm border-0 text-gray-900 w-full sm:w-80 rounded-xl shadow-lg"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 hover:bg-white rounded-xl shadow-lg px-6 py-3 w-full sm:w-auto">
                  <Filter className="mr-2 h-5 w-5" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleAddInvoice}
                className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 hover:bg-white rounded-xl shadow-lg px-6 py-3"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">RM {totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-green-100 mt-1">
                    All invoices combined
                  </p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{paidInvoicesCount}</div>
                  <p className="text-xs text-blue-100 mt-1">
                    Successfully collected
                  </p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{pendingInvoicesCount}</div>
                  <p className="text-xs text-orange-100 mt-1">
                    Awaiting payment
                  </p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-rose-600 border-0 text-white shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{overdueInvoicesCount}</div>
                  <p className="text-xs text-red-100 mt-1">
                    Need attention
                  </p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <TabsList className="grid w-full grid-cols-2 h-auto p-2 bg-transparent gap-1">
                <TabsTrigger 
                  value="overview" 
                  className="px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="all"
                  className="px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  All Invoices
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 lg:p-8">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Total Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">RM {totalRevenue.toFixed(2)}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total amount of all invoices
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Paid Invoices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{paidInvoicesCount}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Invoices successfully paid
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        Pending Invoices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{pendingInvoicesCount}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Awaiting payment
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Overdue Invoices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{overdueInvoicesCount}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Need immediate attention
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="all" className="space-y-6 mt-0">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/30 shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Invoice Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/40 dark:bg-gray-900/40 divide-y divide-gray-200/30 dark:divide-gray-700/30">
                        {filteredInvoices.map((invoice, index) => (
                          <tr key={invoice.id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-gray-50/20 dark:bg-gray-800/20' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {invoice.invoiceNumber}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Invoice #{invoice.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.customerName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {invoice.date}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">
                                RM {invoice.amount.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium`}>
                                {getStatusIcon(invoice.status)}
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleInvoiceSelect(invoice)}
                                className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDownloadInvoice}
                                className="hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Invoice Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Receipt className="w-6 h-6 text-blue-600" />
                Invoice Preview
              </DialogTitle>
            </DialogHeader>
            {selectedInvoice ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedInvoice.customerName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Invoice Number: {selectedInvoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Date: {selectedInvoice.date}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <h4 className="text-3xl font-bold text-gray-900 dark:text-white">
                        RM {selectedInvoice.amount.toFixed(2)}
                      </h4>
                      <Badge className={`${getStatusColor(selectedInvoice.status)} flex items-center gap-1 px-3 py-1 rounded-full`}>
                        {getStatusIcon(selectedInvoice.status)}
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Billing Details
                      </h4>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
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
                        <CreditCard className="w-5 h-5" />
                        Payment Details
                      </h4>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
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
                    onClick={handleDownloadInvoice}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => toast({ title: "Print", description: "Print functionality will be implemented soon." })}
                    className="flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button 
                    onClick={handleSendInvoice}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
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
      </div>
    </div>
  );
};

export default InvoiceSection;
