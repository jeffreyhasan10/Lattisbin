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
  Calendar,
  TrendingUp,
  Download,
  BarChart3,
  ArrowLeft,
  Package,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BookingData {
  date: string;
  bookings: number;
  completed: number;
  cancelled: number;
}

const BookingReports: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Sample booking data - in a real app, this would come from an API
  const generateData = (range: string): BookingData[] => {
    if (range === "daily") {
      return Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        bookings: Math.floor(Math.random() * 20) + 10,
        completed: Math.floor(Math.random() * 18) + 8,
        cancelled: Math.floor(Math.random() * 3),
      }));
    } else if (range === "weekly") {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        bookings: Math.floor(Math.random() * 100) + 50,
        completed: Math.floor(Math.random() * 90) + 45,
        cancelled: Math.floor(Math.random() * 10),
      }));
    } else if (range === "monthly") {
      return [
        { date: "Jan", bookings: 245, completed: 230, cancelled: 15 },
        { date: "Feb", bookings: 289, completed: 275, cancelled: 14 },
        { date: "Mar", bookings: 312, completed: 298, cancelled: 14 },
        { date: "Apr", bookings: 275, completed: 260, cancelled: 15 },
        { date: "May", bookings: 298, completed: 285, cancelled: 13 },
        { date: "Jun", bookings: 334, completed: 320, cancelled: 14 },
        { date: "Jul", bookings: 356, completed: 340, cancelled: 16 },
        { date: "Aug", bookings: 325, completed: 310, cancelled: 15 },
        { date: "Sep", bookings: 342, completed: 328, cancelled: 14 },
        { date: "Oct", bookings: 368, completed: 352, cancelled: 16 },
        { date: "Nov", bookings: 385, completed: 370, cancelled: 15 },
        { date: "Dec", bookings: 398, completed: 382, cancelled: 16 },
      ];
    } else {
      return [
        { date: "2020", bookings: 2450, completed: 2350, cancelled: 100 },
        { date: "2021", bookings: 2890, completed: 2780, cancelled: 110 },
        { date: "2022", bookings: 3420, completed: 3290, cancelled: 130 },
        { date: "2023", bookings: 3850, completed: 3710, cancelled: 140 },
        { date: "2024", bookings: 1200, completed: 1150, cancelled: 50 },
      ];
    }
  };

  const [bookingData] = useState<BookingData[]>(generateData(timeRange));

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBookings = bookingData.reduce((sum, d) => sum + d.bookings, 0);
    const totalCompleted = bookingData.reduce((sum, d) => sum + d.completed, 0);
    const totalCancelled = bookingData.reduce((sum, d) => sum + d.cancelled, 0);
    const completionRate = (totalCompleted / totalBookings) * 100;
    const cancellationRate = (totalCancelled / totalBookings) * 100;
    const avgBookingsPerPeriod = totalBookings / bookingData.length;

    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(bookingData.length / 2);
    const firstHalf = bookingData
      .slice(0, midPoint)
      .reduce((sum, d) => sum + d.bookings, 0);
    const secondHalf = bookingData
      .slice(midPoint)
      .reduce((sum, d) => sum + d.bookings, 0);
    const trend = ((secondHalf - firstHalf) / firstHalf) * 100;

    return {
      totalBookings,
      totalCompleted,
      totalCancelled,
      completionRate,
      cancellationRate,
      avgBookingsPerPeriod,
      trend,
    };
  }, [bookingData]);

  const handleExport = () => {
    const csvContent = [
      ["Period", "Total Bookings", "Completed", "Cancelled"],
      ...bookingData.map((d) => [
        d.date,
        d.bookings.toString(),
        d.completed.toString(),
        d.cancelled.toString(),
      ]),
      ["", "", "", ""],
      ["Summary", "", "", ""],
      ["Total Bookings", stats.totalBookings.toString(), "", ""],
      ["Completion Rate", `${stats.completionRate.toFixed(1)}%`, "", ""],
      ["Cancellation Rate", `${stats.cancellationRate.toFixed(1)}%`, "", ""],
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `booking-report-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Booking report exported successfully!");
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as "daily" | "weekly" | "monthly" | "yearly");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-600" />
              Booking Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Delivery Order trends, volumes, and capacity planning insights
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
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-xs text-blue-100 mt-1">
                    {stats.avgBookingsPerPeriod.toFixed(0)} avg per period
                  </p>
                </div>
                <Package className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                  <p className="text-xs text-green-100 mt-1">
                    {stats.totalCompleted} completed
                  </p>
                </div>
                <Clock className="w-12 h-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {stats.trend > 0 ? "+" : ""}
                    {stats.trend.toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-100 mt-1">Period over period</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Cancellation Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {stats.cancellationRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-100 mt-1">
                    {stats.totalCancelled} cancelled
                  </p>
                </div>
                <BarChart3 className="w-12 h-12 text-orange-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Range Selector */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View by Time Range</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select a time range to view booking trends
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (30 days)</SelectItem>
                    <SelectItem value="weekly">Weekly (12 weeks)</SelectItem>
                    <SelectItem value="monthly">Monthly (1 year)</SelectItem>
                    <SelectItem value="yearly">Yearly (5 years)</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleExport}
                  className="gap-2 bg-orange-600 hover:bg-orange-700"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Trend Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Booking Trend Over Time</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Visual representation of booking volumes
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Bookings"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Cancelled"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Distribution Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Comparison of completed vs cancelled bookings
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Data Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Detailed Booking Data</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {bookingData.length} periods
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Period
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Bookings
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Completed
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Cancelled
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.map((data, index) => {
                    const completionRate = (data.completed / data.bookings) * 100;
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{data.date}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900">{data.bookings}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-semibold">
                            {data.completed}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-red-600 font-semibold">
                            {data.cancelled}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900">
                            {completionRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingReports;

