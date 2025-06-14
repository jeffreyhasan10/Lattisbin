import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  DollarSign,
  Users,
  Package2,
  FileText,
  Calendar,
  ArrowRight,
  Truck,
  Receipt,
  BarChart3,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MetricCard from "@/components/dashboard/MetricCard";

// Chart data
const revenueData = [
  { month: "Jan", revenue: 10500, target: 9000, expenses: 7500 },
  { month: "Feb", revenue: 12000, target: 10000, expenses: 8000 },
  { month: "Mar", revenue: 9800, target: 10000, expenses: 7800 },
  { month: "Apr", revenue: 15750, target: 11000, expenses: 9200 },
  { month: "May", revenue: 14300, target: 12000, expenses: 8900 },
  { month: "Jun", revenue: 18200, target: 13000, expenses: 10500 },
];

const wasteCollectionData = [
  { date: "Mon", scrap: 5.4, trash: 4.2, construction: 2.8 },
  { date: "Tue", scrap: 6.8, trash: 5.0, construction: 3.0 },
  { date: "Wed", scrap: 4.7, trash: 3.5, construction: 1.5 },
  { date: "Thu", scrap: 7.2, trash: 5.5, construction: 3.5 },
  { date: "Fri", scrap: 8.5, trash: 6.0, construction: 4.0 },
  { date: "Sat", scrap: 5.3, trash: 4.0, construction: 2.0 },
  { date: "Sun", scrap: 3.5, trash: 2.5, construction: 1.5 },
];

const binStatusData = [
  { name: "In Use", value: 65 },
  { name: "Available", value: 25 },
  { name: "Maintenance", value: 10 },
];

const lorryStatusData = [
  { name: "Active", value: 70 },
  { name: "Idle", value: 20 },
  { name: "Maintenance", value: 10 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"]; // Blue-500, Green-500, Amber-500

const upcomingBookings = [
  {
    id: 1,
    customer: "Azlan Sdn Bhd",
    area: "Kuala Lumpur",
    binSize: "4ft (H) x 12ft (L) x 6ft (W)",
    status: "Scheduled",
    date: "Today, 2:30 PM",
    commission: "Pending",
    jobRef: "JR001",
  },
  {
    id: 2,
    customer: "Eastern Metal Works",
    area: "Alor Setar",
    binSize: "6ft (H) x 24ft (L) x 8ft (W)",
    status: "Pending",
    date: "Tomorrow, 9:00 AM",
    commission: "Not Assigned",
    jobRef: "JR002",
  },
  {
    id: 3,
    customer: "Greentech Recyclers",
    area: "Bukit Mertajam",
    binSize: "2ft (H) x 12ft (L) x 6ft (W)",
    status: "Delivered",
    date: "Yesterday, 11:15 AM",
    commission: "Paid",
    jobRef: "JR003",
  },
];

const DashboardOverview: React.FC = () => {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [chartFilter, setChartFilter] = useState("all");
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const getStatusBadgeClasses = useCallback((status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 hover:bg-green-600 text-white transition-colors";
      case "Pending":
        return "bg-amber-500 hover:bg-amber-600 text-white transition-colors";
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white transition-colors";
    }
  }, []);

  const getCommissionBadgeClasses = useCallback((commission: string) => {
    switch (commission) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300";
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/60 dark:text-gray-300";
    }
  }, []);

  return (
    <motion.div
      className="dashboard-content space-y-6 sm:space-y-8 p-3 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="dashboard-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <h1 className="dashboard-title text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100 transition-colors"
              onClick={() => navigate("/dashboard/reports")}
            >
              <Download className="h-4 w-4" />
              Export Reports
            </Button>
          </motion.div>
          <Tabs
            defaultValue="thisMonth"
            value={dateRange}
            onValueChange={setDateRange}
          >
            <TabsList className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
              <TabsTrigger
                value="thisWeek"
                className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                This Week
              </TabsTrigger>
              <TabsTrigger
                value="thisMonth"
                className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                This Month
              </TabsTrigger>
              <TabsTrigger
                value="thisYear"
                className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                This Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        variants={containerVariants}
      >
        {[
          {
            title: "Total Revenue",
            value: "RM 15,750",
            icon: DollarSign,
            trend: "up",
            change: "+12% from last month",
            variant: "success",
            onClick: () => navigate("/dashboard/invoices"),
          },
          {
            title: "Active Customers",
            value: "42",
            icon: Users,
            trend: "up",
            change: "+4 new customers",
            onClick: () => navigate("/dashboard/customers"),
          },
          {
            title: "Bin Utilization",
            value: "76%",
            icon: Package2,
            trend: "up",
            change: "+3% from last month",
            variant: "info",
            onClick: () => navigate("/dashboard/bins"),
          },
          {
            title: "Pending Invoices",
            value: "8",
            icon: FileText,
            trend: "down",
            change: "-2 from last month",
            variant: "warning",
            onClick: () => navigate("/dashboard/invoices"),
          },
          {
            title: "Lorry Utilization",
            value: "70%",
            icon: Truck,
            trend: "up",
            change: "+5% from last month",
            variant: "info",
            onClick: () => navigate("/dashboard/lorries"),
          },
          {
            title: "Pending Commissions",
            value: "RM 1,200",
            icon: DollarSign,
            trend: "up",
            change: "+10% from last month",
            variant: "warning",
            onClick: () => navigate("/dashboard/commissions"),
          },
          {
            title: "Active Bookings",
            value: "12",
            icon: Calendar,
            trend: "up",
            change: "+3 new bookings",
            variant: "success",
            onClick: () => navigate("/dashboard/bookings"),
          },
          {
            title: "Expenses",
            value: "RM 9,200",
            icon: Receipt,
            trend: "down",
            change: "-5% from last month",
            onClick: () => navigate("/dashboard/expenses"),
          },
        ].map((metric, index) => (
          <motion.div key={index} variants={itemVariants}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              change={metric.change}
              variant={metric.variant}
              onClick={metric.onClick}
              className="cursor-pointer bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-blue-500 transition-all duration-300"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Financial Overview */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="dashboard-card bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Financial Overview
              </CardTitle>
              <div className="flex items-center gap-3">
                <Select value={chartFilter} onValueChange={setChartFilter}>
                  <SelectTrigger className="w-[120px] h-8 text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(value) => `RM ${value}`}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                      formatter={(value) => [`RM ${value}`, undefined]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        color: "#111827",
                      }}
                    />
                    {chartFilter === "all" || chartFilter === "revenue" ? (
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                    ) : null}
                    {chartFilter === "all" || chartFilter === "target" ? (
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#10B981"
                        fill="url(#targetGradient)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    ) : null}
                    {chartFilter === "all" || chartFilter === "expenses" ? (
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#6b7280"
                        fill="url(#expensesGradient)"
                        strokeWidth={2}
                      />
                    ) : null}
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b7280" stopOpacity= {0.3} />
                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
              <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Target</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <span>Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bin Status */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Bin Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={binStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                    >
                      {binStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} bins`, undefined]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        color: "#111827",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
              <div className="mt-6 grid grid-cols-3 w-full text-center">
                {binStatusData.map((status, index) => (
                  <motion.div
                    key={status.name}
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {status.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {status.name}
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100"
                  onClick={() => navigate("/dashboard/bins")}
                >
                  Manage Bins
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Waste Collections */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="dashboard-card bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Waste Collections by Type
              </CardTitle>
              <div className="flex items-center gap-3">
                <Select value={chartFilter} onValueChange={setChartFilter}>
                  <SelectTrigger className="w-[120px] h-8 text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="banken">Scrap</SelectItem>
                    <SelectItem value="trash">Trash</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    className="h-8 gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => navigate("/dashboard/waste")}
                  >
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={wasteCollectionData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(value) => `${value} tons`}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} tons`, undefined]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        color: "#111827",
                      }}
                    />
                    {chartFilter === "all" || chartFilter === "scrap" ? (
                      <Bar
                        dataKey="scrap"
                        stackId="a"
                        fill="#3B82F6"
                        radius={[0, 0, 0, 0]}
                      />
                    ) : null}
                    {chartFilter === "all" || chartFilter === "trash" ? (
                      <Bar
                        dataKey="trash"
                        stackId="a"
                        fill="#10B981"
                        radius={[0, 0, 0, 0]}
                      />
                    ) : null}
                    {chartFilter === "all" || chartFilter === "construction" ? (
                      <Bar
                        dataKey="construction"
                        stackId="a"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                      />
                    ) : null}
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
              <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Scrap</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Trash</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span>Construction</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lorry Status */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Lorry Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lorryStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                    >
                      {lorryStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} lorries`, undefined]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        color: "#111827",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
              <div className="mt-6 grid grid-cols-3 w-full text-center">
                {lorryStatusData.map((status, index) => (
                  <motion.div
                    key={status.name}
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {status.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {status.name}
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100"
                  onClick={() => navigate("/dashboard/lorries")}
                >
                  Manage Lorries
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Upcoming Bookings & Quick Actions */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="dashboard-card bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Upcoming Bookings
              </CardTitle>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  className="h-8 gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => navigate("/dashboard/bookings")}
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-center gap-4 py-3 ${
                      index !== upcomingBookings.length - 1
                        ? "border-b border-gray-200 dark:border-gray-700"
                        : ""
                    } hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors rounded-lg p-3`}
                  >
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"
                      whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="h-6 w-6" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.customer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.area} | {booking.binSize}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Job Ref: {booking.jobRef}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusBadgeClasses(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge
                        className={getCommissionBadgeClasses(booking.commission)}
                      >
                        Comm: {booking.commission}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.date}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100"
                  onClick={() => navigate("/dashboard/bookings")}
                >
                  Manage Bookings
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Register New Bin",
                  icon: Package2,
                  path: "/dashboard/bin-register",
                },
                {
                  label: "Add New Customer",
                  icon: Users,
                  path: "/dashboard/customer-register",
                },
                {
                  label: "Issue Invoice",
                  icon: FileText,
                  path: "/dashboard/invoices",
                },
                {
                  label: "View Reports",
                  icon: BarChart3,
                  path: "/dashboard/reports",
                },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-sm border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100 transition-colors"
                    onClick={() => navigate(action.path)}
                  >
                    <action.icon className="h-5 w-5" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;