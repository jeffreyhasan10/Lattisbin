import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Package2,
  Truck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Target,
  Activity,
  BarChart3,
} from "lucide-react";
import ReportCard from "./ReportCard";
import CollectionCard from "./CollectionCard";

const DUMMY_COLLECTIONS = [
  {
    id: 1,
    type: "Scheduled",
    date: "2024-01-16T10:00:00",
    images: [
      "https://source.unsplash.com/400x300/?waste,bin",
      "https://source.unsplash.com/400x300/?garbage,container",
      "https://source.unsplash.com/400x300/?recycling,pickup",
    ],
    weight: "450 kg",
    customer: "ABC Construction Site",
    binSN: "ASR100-001",
    location: "Jalan Ampang, Kuala Lumpur",
  },
  {
    id: 2,
    type: "On-Demand",
    date: "2024-01-15T14:30:00",
    images: [
      "https://source.unsplash.com/400x300/?waste,management",
      "https://source.unsplash.com/400x300/?dumpster,collection",
      "https://source.unsplash.com/400x300/?trash,removal",
    ],
    weight: "280 kg",
    customer: "Residensi Gembira",
    binSN: "PWD100-023",
    location: "Jalan Klang Lama, Kuala Lumpur",
  },
  {
    id: 3,
    type: "Scheduled",
    date: "2024-01-14T09:15:00",
    images: [
      "https://source.unsplash.com/400x300/?recycling,center",
      "https://source.unsplash.com/400x300/?waste,sorting",
      "https://source.unsplash.com/400x300/?garbage,truck",
    ],
    weight: "320 kg",
    customer: "Taman Desa Medical Centre",
    binSN: "ASR100-012",
    location: "Taman Desa, Kuala Lumpur",
  },
  {
    id: 4,
    type: "Emergency",
    date: "2024-01-13T16:45:00",
    images: [
      "https://source.unsplash.com/400x300/?hazardous,waste",
      "https://source.unsplash.com/400x300/?chemical,disposal",
      "https://source.unsplash.com/400x300/?safety,gear",
    ],
    weight: "180 kg",
    customer: "Sentral Workshop",
    binSN: "HZW050-007",
    location: "Brickfields, Kuala Lumpur",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DUMMY_REVENUE_DATA = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
  { name: "Aug", revenue: 4000 },
  { name: "Sep", revenue: 3000 },
  { name: "Oct", revenue: 2000 },
  { name: "Nov", revenue: 2780 },
  { name: "Dec", revenue: 1890 },
];

const DUMMY_FLEET_DATA = [
  { name: "Isuzu NPR75", utilization: 75 },
  { name: "Mitsubishi Canter", utilization: 60 },
  { name: "Daihatsu Gran Max", utilization: 80 },
  { name: "Isuzu ELF", utilization: 90 },
  { name: "Hino 300 Series", utilization: 50 },
];

const DUMMY_BOOKING_DATA = [
  { name: "Jan", bookings: 45 },
  { name: "Feb", bookings: 30 },
  { name: "Mar", bookings: 50 },
  { name: "Apr", bookings: 65 },
  { name: "May", bookings: 55 },
];

const DUMMY_WASTE_DATA = [
  { name: "General", value: 400 },
  { name: "Recyclable", value: 300 },
  { name: "Hazardous", value: 200 },
  { name: "Organic", value: 100 },
];

const DashboardOverview = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe);
  };

  const totalRevenue = DUMMY_REVENUE_DATA.reduce(
    (sum, data) => sum + data.revenue,
    0
  );
  const averageRevenue = totalRevenue / DUMMY_REVENUE_DATA.length;

  const totalFleetUtilization = DUMMY_FLEET_DATA.reduce(
    (sum, data) => sum + data.utilization,
    0
  );
  const averageFleetUtilization = totalFleetUtilization / DUMMY_FLEET_DATA.length;

  const totalBookings = DUMMY_BOOKING_DATA.reduce(
    (sum, data) => sum + data.bookings,
    0
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor key metrics and track performance
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <ReportCard
          title="Total Customers"
          value={1247}
          change="+12.5%"
          trend={"up" as const}
          icon={Users}
        />
        <ReportCard
          title="Active Bins"
          value={856}
          change="+8.2%"
          trend={"up" as const}
          icon={Package2}
        />
        <ReportCard
          title="Fleet Utilization"
          value="78%"
          change="-2.1%"
          trend={"down" as const}
          icon={Truck}
        />
        <ReportCard
          title="Monthly Revenue"
          value="RM 45,230"
          change="+15.3%"
          trend={"up" as const}
          icon={DollarSign}
        />
      </div>

      {/* Charts and Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={DUMMY_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fleet Utilization Chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Fleet Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DUMMY_FLEET_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Booking and Waste Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Booking Statistics */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Booking Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {totalBookings}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Bookings
              </p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={DUMMY_BOOKING_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waste Type Distribution */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Waste Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DUMMY_WASTE_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {DUMMY_WASTE_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Collection Efficiency
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                85%
              </span>
            </div>
            <Progress value={85} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Customer Satisfaction
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                92%
              </span>
            </div>
            <Progress value={92} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                On-Time Delivery
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                98%
              </span>
            </div>
            <Progress value={98} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Collections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Recent Collections
          </h2>
          <Button variant="link">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {DUMMY_COLLECTIONS.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
