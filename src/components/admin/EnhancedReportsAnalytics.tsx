import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  Users,
  Truck,
  Package,
  Eye,
  FileText,
  PieChart,
  Activity,
  CheckSquare,
  Upload
} from "lucide-react";

const EnhancedReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const kpiMetrics = [
    {
      name: "Total Revenue",
      value: "RM 245,600",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Active Customers",
      value: "389",
      change: "+8.3%",
      trend: "up",
      period: "vs last month",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Fleet Utilization",
      value: "87.2%",
      change: "-2.1%",
      trend: "down",
      period: "vs last month",
      icon: Truck,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    },
    {
      name: "Order Completion",
      value: "96.8%",
      change: "+1.4%",
      trend: "up",
      period: "vs last month",
      icon: Package,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    }
  ];

  const reports = [
    {
      id: "RPT001",
      name: "Revenue Analysis",
      category: "Financial",
      description: "Comprehensive revenue breakdown by service type, customer segment, and time period",
      lastGenerated: "2024-03-15",
      frequency: "Weekly",
      format: "PDF + Excel",
      subscribers: 5,
      status: "active"
    },
    {
      id: "RPT002",
      name: "Fleet Utilization",
      category: "Operations",
      description: "Vehicle usage statistics, fuel consumption, and maintenance costs",
      lastGenerated: "2024-03-14",
      frequency: "Daily",
      format: "Dashboard + PDF",
      subscribers: 3,
      status: "active"
    },
    {
      id: "RPT003",
      name: "Customer Satisfaction",
      category: "Customer",
      description: "Customer feedback scores, complaint analysis, and retention metrics",
      lastGenerated: "2024-03-10",
      frequency: "Monthly",
      format: "Interactive Dashboard",
      subscribers: 8,
      status: "pending"
    },
    {
      id: "RPT004",
      name: "Driver Performance",
      category: "HR",
      description: "Driver efficiency metrics, on-time delivery rates, and commission calculations",
      lastGenerated: "2024-03-12",
      frequency: "Bi-weekly",
      format: "PDF Report",
      subscribers: 4,
      status: "active"
    },
    {
      id: "RPT005",
      name: "Customer Detail",
      category: "Customer",
      description: "Detailed information of all customers including contact and activity history.",
      lastGenerated: "2024-03-15",
      frequency: "Monthly",
      format: "PDF + Excel",
      subscribers: 10,
      status: "active"
    },
    {
      id: "RPT006",
      name: "Inventory Bin Record",
      category: "Inventory",
      description: "Inventory records for all bins, including status and location.",
      lastGenerated: "2024-03-15",
      frequency: "Weekly",
      format: "Excel",
      subscribers: 7,
      status: "active"
    },
    {
      id: "RPT007",
      name: "Lorry",
      category: "Fleet",
      description: "List and status of all lorries in the fleet.",
      lastGenerated: "2024-03-15",
      frequency: "Monthly",
      format: "PDF",
      subscribers: 6,
      status: "active"
    },
    {
      id: "RPT008",
      name: "Rentable Lorry",
      category: "Fleet",
      description: "Details of lorries available for rent, including rates and availability.",
      lastGenerated: "2024-03-15",
      frequency: "Weekly",
      format: "PDF + Excel",
      subscribers: 4,
      status: "active"
    },
    {
      id: "RPT009",
      name: "Add Item",
      category: "Inventory",
      description: "Record of items added to inventory, with timestamps and responsible staff.",
      lastGenerated: "2024-03-15",
      frequency: "Daily",
      format: "Excel",
      subscribers: 5,
      status: "active"
    },
    {
      id: "RPT010",
      name: "Driver",
      category: "HR",
      description: "Driver details, license status, and performance summary.",
      lastGenerated: "2024-03-15",
      frequency: "Monthly",
      format: "PDF",
      subscribers: 8,
      status: "active"
    },
    {
      id: "RPT011",
      name: "Booking Bin",
      category: "Operations",
      description: "All bin bookings, customer info, and booking status.",
      lastGenerated: "2024-03-15",
      frequency: "Daily",
      format: "PDF + Excel",
      subscribers: 9,
      status: "active"
    },
    {
      id: "RPT012",
      name: "Deliver Order",
      category: "Operations",
      description: "Delivery orders, assigned drivers, and delivery status.",
      lastGenerated: "2024-03-15",
      frequency: "Daily",
      format: "PDF",
      subscribers: 7,
      status: "active"
    },
    {
      id: "RPT013",
      name: "Invoice",
      category: "Financial",
      description: "All invoices issued, payment status, and customer details.",
      lastGenerated: "2024-03-15",
      frequency: "Weekly",
      format: "PDF + Excel",
      subscribers: 10,
      status: "active"
    },
    {
      id: "RPT014",
      name: "Commission",
      category: "Financial",
      description: "Commission calculations for drivers and agents.",
      lastGenerated: "2024-03-15",
      frequency: "Monthly",
      format: "Excel",
      subscribers: 3,
      status: "active"
    },
    {
      id: "RPT015",
      name: "Refund, Cancel Job",
      category: "Operations",
      description: "Records of refunds and cancelled jobs, with reasons and status.",
      lastGenerated: "2024-03-15",
      frequency: "Weekly",
      format: "PDF",
      subscribers: 2,
      status: "active"
    },
    {
      id: "RPT016",
      name: "Expenses (View Only)",
      category: "Financial",
      description: "Expense records for viewing only. No tally or calculations included.",
      lastGenerated: "2024-03-15",
      frequency: "Monthly",
      format: "PDF",
      subscribers: 1,
      status: "active"
    }
  ];

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkExport = () => {
    console.log('Exporting selected reports:', selectedReports);
  };

  const handleReportSelect = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Enhanced Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">Real-time insights with advanced filtering and export capabilities</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-gray-200/50"
              />
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50/50 p-1 rounded-xl">
            <TabsTrigger 
              value="dashboard"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <Activity className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="exports"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <Upload className="h-4 w-4 mr-2" />
              Exports
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiMetrics.map((metric, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {metric.value}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </span>
                        <span className="text-xs text-gray-500">{metric.period}</span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                      <metric.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-blue-400 mb-2" />
                    <p className="text-gray-600 font-medium">Interactive Revenue Chart</p>
                    <p className="text-sm text-gray-500">Real-time data visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Service Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-purple-400 mb-2" />
                    <p className="text-gray-600 font-medium">Service Breakdown</p>
                    <p className="text-sm text-gray-500">By category and volume</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Bulk Operations */}
          {selectedReports.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{selectedReports.length} reports selected</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedReports([])}>
                      Clear Selection
                    </Button>
                    <Button onClick={handleBulkExport} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Download className="h-4 w-4 mr-2" />
                      Bulk Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={(checked) => handleReportSelect(report.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{report.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {report.category}
                          </Badge>
                          <Badge 
                            variant={report.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600">Last Generated</p>
                      <p className="font-medium">{report.lastGenerated}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{report.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Frequency</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.frequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Format</p>
                      <p className="font-medium">{report.format}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/50">
              <PieChart className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Interactive charts and predictive insights coming soon</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/50">
              <Upload className="h-16 w-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Management</h3>
              <p className="text-gray-600">Scheduled exports and data synchronization</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedReportsAnalytics;
