import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  DollarSign,
  TrendingUp,
  Download,
  BarChart3,
  ArrowLeft,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const InvoiceReports: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month");

  // Sample invoice data
  const invoiceData = useMemo(() => {
    return {
      totalSales: 125600.0,
      paidAmount: 98400.0,
      pendingAmount: 27200.0,
      totalInvoices: 145,
      paidInvoices: 112,
      pendingInvoices: 28,
      overdueInvoices: 5,
      
      paymentMethods: [
        { name: "Cash", amount: 32500.0, count: 42, color: "#10b981" },
        { name: "Online", amount: 45200.0, count: 52, color: "#3b82f6" },
        { name: "CDM", amount: 15700.0, count: 14, color: "#8b5cf6" },
        { name: "E-Wallet", amount: 5000.0, count: 4, color: "#f59e0b" },
      ],
      
      monthlySales: [
        { month: "Jan", sales: 8500, paid: 7200, pending: 1300 },
        { month: "Feb", sales: 9200, paid: 8100, pending: 1100 },
        { month: "Mar", sales: 10800, paid: 9400, pending: 1400 },
        { month: "Apr", sales: 9500, paid: 8200, pending: 1300 },
        { month: "May", sales: 11200, paid: 9800, pending: 1400 },
        { month: "Jun", sales: 10500, paid: 9100, pending: 1400 },
        { month: "Jul", sales: 12100, paid: 10500, pending: 1600 },
        { month: "Aug", sales: 10800, paid: 9300, pending: 1500 },
        { month: "Sep", sales: 11500, paid: 10000, pending: 1500 },
        { month: "Oct", sales: 12300, paid: 10700, pending: 1600 },
        { month: "Nov", sales: 11800, paid: 10200, pending: 1600 },
        { month: "Dec", sales: 13400, paid: 11700, pending: 1700 },
      ],
      
      customerTypeSales: [
        { type: "Corporate", amount: 72500.0, percentage: 57.7 },
        { type: "Individual", amount: 31200.0, percentage: 24.8 },
        { type: "Government", amount: 21900.0, percentage: 17.5 },
      ],
    };
  }, []);

  const stats = useMemo(() => {
    const collectionRate = (invoiceData.paidAmount / invoiceData.totalSales) * 100;
    const avgInvoiceValue = invoiceData.totalSales / invoiceData.totalInvoices;
    const paymentEfficiency = (invoiceData.paidInvoices / invoiceData.totalInvoices) * 100;
    
    return {
      collectionRate,
      avgInvoiceValue,
      paymentEfficiency,
    };
  }, [invoiceData]);

  const handleExport = () => {
    const csvContent = [
      ["Invoice Financial Summary Report"],
      [""],
      ["Period", timeRange],
      ["Generated", new Date().toLocaleDateString()],
      [""],
      ["Overall Statistics"],
      ["Total Sales", `RM ${invoiceData.totalSales.toLocaleString()}`],
      ["Amount Collected", `RM ${invoiceData.paidAmount.toLocaleString()}`],
      ["Pending Amount", `RM ${invoiceData.pendingAmount.toLocaleString()}`],
      ["Collection Rate", `${stats.collectionRate.toFixed(1)}%`],
      [""],
      ["Payment Method Breakdown"],
      ["Method", "Amount", "Count", "Percentage"],
      ...invoiceData.paymentMethods.map((pm) => [
        pm.name,
        `RM ${pm.amount.toLocaleString()}`,
        pm.count.toString(),
        `${((pm.amount / invoiceData.paidAmount) * 100).toFixed(1)}%`,
      ]),
      [""],
      ["Customer Type Sales"],
      ["Type", "Amount", "Percentage"],
      ...invoiceData.customerTypeSales.map((ct) => [
        ct.type,
        `RM ${ct.amount.toLocaleString()}`,
        `${ct.percentage.toFixed(1)}%`,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `invoice-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoice report exported successfully!");
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash":
        return <Banknote className="w-5 h-5" />;
      case "Online":
        return <CreditCard className="w-5 h-5" />;
      case "CDM":
        return <Building2 className="w-5 h-5" />;
      case "E-Wallet":
        return <Smartphone className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="w-8 h-8 text-red-600" />
              Invoice Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Sales reports, payment tracking, and financial performance overview
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/reports")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports Summary
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    RM {invoiceData.totalSales.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-100 mt-1">
                    {invoiceData.totalInvoices} invoices
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Amount Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    RM {invoiceData.paidAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-100 mt-1">
                    {stats.collectionRate.toFixed(1)}% collection rate
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    RM {invoiceData.pendingAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-100 mt-1">
                    {invoiceData.pendingInvoices} pending
                  </p>
                </div>
                <Clock className="w-12 h-12 text-orange-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Avg Invoice Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    RM {stats.avgInvoiceValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-100 mt-1">Per invoice</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Download comprehensive financial report
                </p>
              </div>
              <Button
                onClick={handleExport}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Breakdown by payment type
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={invoiceData.paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {invoiceData.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Payment Method Details</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Detailed breakdown by method
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceData.paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: method.color + "20" }}
                      >
                        <div style={{ color: method.color }}>
                          {getPaymentMethodIcon(method.name)}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-600">{method.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        RM {method.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {((method.amount / invoiceData.paidAmount) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Sales Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Sales & Collection Trend</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Sales vs collected amounts over time
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={invoiceData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Total Sales" />
                <Bar dataKey="paid" fill="#10b981" name="Collected" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Type Sales */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sales by Customer Type</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Revenue distribution across customer segments
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoiceData.customerTypeSales.map((type, index) => {
                const colors = ["#3b82f6", "#10b981", "#8b5cf6"];
                return (
                  <div key={type.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {type.type}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">
                          RM {type.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({type.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${type.percentage}%`,
                          backgroundColor: colors[index],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Metric
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">Total Invoices</td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                      {invoiceData.totalInvoices}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">Paid Invoices</td>
                    <td className="py-3 px-4 text-sm font-bold text-green-600 text-right">
                      {invoiceData.paidInvoices}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">Pending Invoices</td>
                    <td className="py-3 px-4 text-sm font-bold text-orange-600 text-right">
                      {invoiceData.pendingInvoices}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">Overdue Invoices</td>
                    <td className="py-3 px-4 text-sm font-bold text-red-600 text-right">
                      {invoiceData.overdueInvoices}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-blue-50">
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      Payment Efficiency
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-blue-600 text-right">
                      {stats.paymentEfficiency.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceReports;

