import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500";
      case "pending": return "bg-orange-500";
      case "overdue": return "bg-red-500";
      default: return "bg-gray-500";
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-sm text-muted-foreground">
            Manage your company invoices and track payments.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search invoices..."
            className="w-[200px] lg:w-[300px]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">RM {totalRevenue.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">
                  Total amount of all invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Paid Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paidInvoicesCount}</div>
                <p className="text-sm text-muted-foreground">
                  Number of invoices with paid status
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInvoicesCount}</div>
                <p className="text-sm text-muted-foreground">
                  Number of invoices with pending status
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overdue Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overdueInvoicesCount}</div>
                <p className="text-sm text-muted-foreground">
                  Number of invoices with overdue status
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      RM {invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInvoiceSelect(invoice)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {selectedInvoice ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedInvoice.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Invoice Number: {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {selectedInvoice.date}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="text-xl font-bold">
                    RM {selectedInvoice.amount.toFixed(2)}
                  </h4>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Billing Details:</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedInvoice.customerName}
                  <br />
                  123 Main Street
                  <br />
                  Kuala Lumpur, 50000
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Payment Method:</h4>
                <p className="text-sm text-muted-foreground">
                  Credit Card ending in 1234
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invoice
                </Button>
              </div>
            </div>
          ) : (
            <p>No invoice selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceSection;
