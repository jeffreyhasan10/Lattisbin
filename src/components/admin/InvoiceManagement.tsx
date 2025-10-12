import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  Plus,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  orderIds: string[];
  issueDate: string;
  dueDate: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  currency: string;
  paymentTerms: string;
  template: string;
  emailSent: boolean;
  readReceipt: boolean;
  exchangeRate?: number;
  originalCurrency?: string;
  remindersSent: number;
  lastReminderDate?: string;
  creditNotes: any[];
  debitNotes: any[];
}

const InvoiceManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample invoice data
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV001",
      invoiceNumber: "INV-2024-001",
      customerName: "ABC Construction Sdn Bhd",
      customerType: "Corporate",
      orderIds: ["DO001", "DO002"],
      issueDate: "2024-03-01",
      dueDate: "2024-03-31",
      subtotal: 1850.0,
      gstAmount: 111.0,
      totalAmount: 1961.0,
      paidAmount: 1961.0,
      balanceAmount: 0.0,
      status: "paid",
      currency: "MYR",
      paymentTerms: "30 days",
      template: "corporate",
      emailSent: true,
      readReceipt: true,
      remindersSent: 0,
      creditNotes: [],
      debitNotes: [],
    },
    {
      id: "INV002",
      invoiceNumber: "INV-2024-002",
      customerName: "Sarah Lim",
      customerType: "Individual",
      orderIds: ["DO003"],
      issueDate: "2024-03-05",
      dueDate: "2024-03-20",
      subtotal: 320.0,
      gstAmount: 19.2,
      totalAmount: 339.2,
      paidAmount: 0.0,
      balanceAmount: 339.2,
      status: "overdue",
      currency: "MYR",
      paymentTerms: "15 days",
      template: "individual",
      emailSent: true,
      readReceipt: false,
      remindersSent: 2,
      lastReminderDate: "2024-03-18",
      creditNotes: [],
      debitNotes: [],
    },
    {
      id: "INV003",
      invoiceNumber: "INV-2024-003",
      customerName: "Ministry of Health",
      customerType: "Government",
      orderIds: ["DO004", "DO005"],
      issueDate: "2024-03-10",
      dueDate: "2024-04-09",
      subtotal: 2500.0,
      gstAmount: 150.0,
      totalAmount: 2650.0,
      paidAmount: 0.0,
      balanceAmount: 2650.0,
      status: "sent",
      currency: "MYR",
      paymentTerms: "30 days",
      template: "government",
      emailSent: true,
      readReceipt: true,
      remindersSent: 0,
      creditNotes: [],
      debitNotes: [],
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "cancelled":
        return <Badge className="bg-orange-100 text-orange-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "sent":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesCustomerType = customerTypeFilter === "all" || invoice.customerType === customerTypeFilter;
    
    return matchesSearch && matchesStatus && matchesCustomerType;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, customerTypeFilter]);

  const handleGenerateNewInvoice = () => {
    navigate("/admin/invoicing/generate");
  };

  const handleViewInvoiceDetails = (invoiceId: string) => {
    navigate(`/admin/invoicing/details/${invoiceId}`);
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === "paid").length;
  const pendingInvoices = invoices.filter(inv => inv.status === "sent").length;
  const overdueInvoices = invoices.filter(inv => inv.status === "overdue").length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstandingAmount = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-blue-600" />
            Invoice Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage all system-generated invoices, track payment status, and handle billing workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateNewInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">MYR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold">{paidInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{overdueInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold">MYR {outstandingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices by number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <div className="space-y-4">
        {/* Pagination Info and Items Per Page */}
        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </p>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Show:</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[100px]">
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
        
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || customerTypeFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by generating your first invoice."}
              </p>
              {(!searchTerm && statusFilter === "all" && customerTypeFilter === "all") && (
                <Button onClick={handleGenerateNewInvoice} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Invoice
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          paginatedInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Receipt className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {invoice.invoiceNumber}
                        <Badge variant="outline" className="text-xs">
                          {invoice.template}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {invoice.customerName} ({invoice.customerType})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invoice.status)}
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount Details</p>
                    <div className="space-y-1">
                      <p className="font-medium">
                        Subtotal: {invoice.currency} {invoice.subtotal.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tax: {invoice.currency} {invoice.gstAmount.toFixed(2)}
                      </p>
                      <p className="font-bold text-lg text-green-600">
                        Total: {invoice.currency} {invoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <div className="space-y-1">
                      <p className="font-medium">
                        Paid: {invoice.currency} {invoice.paidAmount.toFixed(2)}
                      </p>
                      <p className="font-medium text-red-600">
                        Balance: {invoice.currency} {invoice.balanceAmount.toFixed(2)}
                      </p>
                      {invoice.balanceAmount > 0 && (
                        <p className="text-xs text-orange-600">Payment pending</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Dates & Terms</p>
                    <div className="space-y-1">
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Issue: {invoice.issueDate}
                      </p>
                      <p className="font-medium">Due: {invoice.dueDate}</p>
                      <p className="text-sm text-gray-600">Terms: {invoice.paymentTerms}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Related Orders</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {invoice.orderIds.map((orderId) => (
                        <Badge key={orderId} variant="outline" className="text-xs">
                          {orderId}
                        </Badge>
                      ))}
                    </div>
                    {invoice.remindersSent > 0 && (
                      <p className="text-xs text-orange-600">
                        {invoice.remindersSent} reminders sent
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewInvoiceDetails(invoice.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Invoice Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {/* Pagination Controls */}
        {filteredInvoices.length > 0 && totalPages > 1 && (
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
      </div>
    </div>
  );
};

export default InvoiceManagement;
