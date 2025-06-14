import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Truck,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  UserCheck,
  Route,
} from "lucide-react";
import ReportCard from "./ReportCard";

const driverMetrics = [
  {
    id: "DRV001",
    name: "Ahmad Rahman",
    status: "Active",
    totalOrders: 45,
    completedOrders: 43,
    earnings: 2850,
    rating: 4.8
  },
  {
    id: "DRV002", 
    name: "Lim Wei Ming",
    status: "Active",
    totalOrders: 52,
    completedOrders: 50,
    earnings: 3200,
    rating: 4.9
  },
  {
    id: "DRV003",
    name: "Raj Kumar",
    status: "Inactive",
    totalOrders: 28,
    completedOrders: 26,
    earnings: 1650,
    rating: 4.6
  }
];

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 2000 },
  { name: "Sep", value: 2780 },
  { name: "Oct", value: 1890 },
  { name: "Nov", value: 2390 },
  { name: "Dec", value: 3490 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const pieData = [
  { name: "Construction", value: 400 },
  { name: "Recycling", value: 300 },
  { name: "Hazardous", value: 300 },
  { name: "Mixed Waste", value: 200 },
];

const latestOrders = [
  {
    id: "1",
    customer: "ABC Construction",
    date: "2024-01-20",
    location: "Johor Bahru",
    status: "Pending",
    driverId: "DRV001",
    driverName: "Ahmad Rahman"
  },
  {
    id: "2",
    customer: "XYZ Development",
    date: "2024-01-19",
    location: "Kuala Lumpur",
    status: "Completed",
    driverId: "DRV002",
    driverName: "Lim Wei Ming"
  },
  {
    id: "3",
    customer: "PQR Builders",
    date: "2024-01-18",
    location: "Penang",
    status: "In Transit",
    driverId: "DRV001",
    driverName: "Ahmad Rahman"
  },
];

const latestActivities = [
  {
    id: "1",
    time: "08:00 AM",
    location: "Site A, Johor",
    activity: "Bin Deployment",
    status: "Completed",
    driverId: "DRV001"
  },
  {
    id: "2",
    time: "10:30 AM",
    location: "Site B, KL",
    activity: "Waste Collection",
    status: "In Transit",
    driverId: "DRV002"
  },
  {
    id: "3",
    time: "02:15 PM",
    location: "Site C, Penang",
    activity: "Maintenance Check",
    status: "Pending",
    driverId: "DRV003"
  },
];

const DashboardOverview = () => {
  const activeDrivers = driverMetrics.filter(d => d.status === "Active").length;
  const totalDrivers = driverMetrics.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <ReportCard
          title="Total Revenue"
          amount={125000}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <ReportCard
          title="Active Customers"
          amount={342}
          change="+8.2%"
          trend="up"
          icon={Users}
        />
        <ReportCard
          title="Active Drivers"
          amount={activeDrivers}
          change={`${activeDrivers}/${totalDrivers}`}
          trend="up"
          icon={UserCheck}
        />
        <ReportCard
          title="Bins Deployed"
          amount="1,247"
          change="-2.1%"
          trend="down"
          icon={Package}
        />
        <ReportCard
          title="Revenue Growth"
          amount="15.3%"
          change="+3.2%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Driver Performance and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Driver Performance Overview */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Driver Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driverMetrics.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{driver.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{driver.id}</span>
                        <Badge variant={driver.status === "Active" ? "default" : "secondary"}>
                          {driver.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">RM {driver.earnings}</p>
                    <p className="text-sm text-gray-500">{driver.completedOrders}/{driver.totalOrders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Orders and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Orders with Driver Assignment */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Driver</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="border-t px-4 py-2">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                      </td>
                      <td className="border-t px-4 py-2">
                        <div>
                          <p className="font-medium">{order.driverName}</p>
                          <p className="text-xs text-gray-500">{order.driverId}</p>
                        </div>
                      </td>
                      <td className="border-t px-4 py-2">{order.location}</td>
                      <td className="border-t px-4 py-2">
                        <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Latest Activities with Driver Info */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Latest Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {latestActivities.map((activity) => (
                <li key={activity.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.activity}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.location} - {activity.time}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Driver: {activity.driverId}
                      </p>
                    </div>
                    <Badge variant="secondary">{activity.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
