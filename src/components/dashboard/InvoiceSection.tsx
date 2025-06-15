
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
    toast({
      title: "Invoice Preview",
      description: `Viewing invoice ${invoice.invoiceNumber}`,
    });
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedInvoice(null);
  };

  const handleAddInvoice = () => {
    toast({
      title: "Add Invoice",
      description: "Invoice creation form will open shortly.",
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
    return DUMMY_INVOICES.reduce((sum, invoice) => {
      return sum + invoice.amount;
    }, 0);
  };

  const totalRevenue = calculateTotalRevenue();
  const paidInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "paid").length;
  const pendingInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "pending").length;
  const overdueInvoicesCount = DUMMY_INVOICES.filter(invoice => invoice.status === "overdue").length;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    Invoice Management
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Track payments and manage your billing efficiently
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Total: RM {totalRevenue.toFixed(2)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {DUMMY_INVOICES.length} Invoices
                </span>
              </div>
            </div>
            
            <Button 
              onClick={handleAddInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Invoice
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">RM {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All invoices combined</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{paidInvoicesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully collected</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{pendingInvoicesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{overdueInvoicesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-gray-200/50 px-4 sm:px-6">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-gray-100/50 rounded-xl">
              <TabsTrigger 
                value="overview" 
                className="px-4 py-3 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="px-4 py-3 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">All Invoices</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 sm:p-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">RM {totalRevenue.toFixed(2)}</div>
                    <p className="text-sm text-gray-500 mt-1">Total amount of all invoices</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Paid Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{paidInvoicesCount}</div>
                    <p className="text-sm text-gray-500 mt-1">Invoices successfully paid</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      Pending Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{pendingInvoicesCount}</div>
                    <p className="text-sm text-gray-500 mt-1">Awaiting payment</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Overdue Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{overdueInvoicesCount}</div>
                    <p className="text-sm text-gray-500 mt-1">Need immediate attention</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-0">
              <div className="border border-gray-200/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200/50">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-200/30">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {invoice.invoiceNumber}
                                </div>
                                <div className="text-xs text-gray-500 sm:hidden">
                                  {invoice.date}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.customerName}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900">
                              {invoice.date}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
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
                                className="hover:bg-blue-50 text-blue-600 p-1 sm:p-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline ml-1">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadInvoice(invoice)}
                                className="hover:bg-green-50 text-green-600 p-1 sm:p-2"
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
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Invoice Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl lg:max-w-4xl bg-white border border-gray-200/50 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <Receipt className="w-5 h-5 text-blue-600" />
              Invoice Preview
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice ? (
            <div className="space-y-6">
              <div className="bg-gray-50/50 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedInvoice.customerName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Invoice: {selectedInvoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {selectedInvoice.date}
                    </p>
                  </div>
                  <div className="text-left sm:text-right space-y-2">
                    <h4 className="text-2xl sm:text-3xl font-bold text-gray-900">
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
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Billing Details
                    </h4>
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-sm text-gray-700">
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
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Details
                    </h4>
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-sm text-gray-700">
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
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button 
                  onClick={handleSendInvoice}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Invoice
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No invoice selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceSection;
