
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  DollarSign, 
  Activity,
  Target,
  Award,
  Zap
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";

const PerformanceAnalytics: React.FC = () => {
  const { orders, drivers } = useOrders();
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Calculate performance metrics
  const getDriverPerformanceData = () => {
    return drivers.map(driver => {
      const driverOrders = orders.filter(o => o.assignedDriverId === driver.id);
      const completedOrders = driverOrders.filter(o => o.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
      const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
      const completionRate = driverOrders.length > 0 ? (completedOrders.length / driverOrders.length) * 100 : 0;
      
      return {
        id: driver.id,
        name: driver.name,
        totalOrders: driverOrders.length,
        completedOrders: completedOrders.length,
        totalRevenue,
        avgOrderValue,
        completionRate,
        rating: driver.rating || 4.5,
        status: driver.status
      };
    });
  };

  const getHourlyPerformanceData = () => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      orders: Math.floor(Math.random() * 10) + 1,
      revenue: Math.floor(Math.random() * 1000) + 200,
      activeDrivers: Math.floor(Math.random() * 5) + 2
    }));
    return hourlyData;
  };

  const getOrderStatusData = () => {
    const statusCounts = {
      pending: orders.filter(o => o.status === 'pending').length,
      assigned: orders.filter(o => o.status === 'assigned').length,
      'in-progress': orders.filter(o => o.status === 'in-progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      value: count,
      color: {
        pending: '#f59e0b',
        assigned: '#3b82f6',
        'in-progress': '#10b981',
        completed: '#059669',
        cancelled: '#ef4444'
      }[status]
    }));
  };

  const performanceData = getDriverPerformanceData();
  const hourlyData = getHourlyPerformanceData();
  const orderStatusData = getOrderStatusData();

  const topPerformers = performanceData
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  const totalRevenue = performanceData.reduce((sum, d) => sum + d.totalRevenue, 0);
  const avgCompletionRate = performanceData.length > 0 
    ? performanceData.reduce((sum, d) => sum + d.completionRate, 0) / performanceData.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-purple-600" />
            Performance Analytics
          </h2>
          <p className="text-gray-600 mt-1">Real-time driver and operational performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  RM {totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">Total Revenue</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+12% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {avgCompletionRate.toFixed(1)}%
                </p>
                <p className="text-sm text-green-600">Avg Completion Rate</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+5% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {performanceData.reduce((sum, d) => sum + d.totalOrders, 0)}
                </p>
                <p className="text-sm text-blue-600">Total Orders</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+8% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {(performanceData.reduce((sum, d) => sum + d.rating, 0) / performanceData.length || 0).toFixed(1)}
                </p>
                <p className="text-sm text-orange-600">Avg Driver Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+0.2 vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Driver Performance</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Trends</TabsTrigger>
          <TabsTrigger value="status">Order Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Driver Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completedOrders" fill="#3b82f6" name="Completed Orders" />
                  <Bar dataKey="totalRevenue" fill="#10b981" name="Revenue (RM)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" />
                  <Line type="monotone" dataKey="activeDrivers" stroke="#10b981" name="Active Drivers" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gold-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((driver, index) => (
              <div key={driver.id} className="bg-gradient-to-r from-gold-50 to-yellow-50 p-4 rounded-lg border border-gold-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-gold-500' : index === 1 ? 'bg-silver-500' : 'bg-bronze-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-sm text-gray-600">{driver.id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-medium">{driver.completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Orders Completed</span>
                    <span className="font-medium">{driver.completedOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Generated</span>
                    <span className="font-medium text-green-600">RM {driver.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-medium">{driver.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
