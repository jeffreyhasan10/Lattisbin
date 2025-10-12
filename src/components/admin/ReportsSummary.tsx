import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileBarChart,
  Users,
  Package,
  Truck,
  Calendar,
  Receipt,
  ArrowRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface ReportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  stats?: string;
}

const ReportsSummary: React.FC = () => {
  const navigate = useNavigate();

  const reportCategories: ReportCategory[] = [
    {
      id: "customer",
      title: "Customer Reports",
      description: "Customer activity, area distribution, phone numbers, and total bookings. Insights for targeted marketing and service improvements.",
      icon: Users,
      route: "/admin/reports/customer",
      color: "from-blue-500 to-blue-600",
      stats: "Engagement & Distribution Analysis",
    },
    {
      id: "bin",
      title: "Bin Reports",
      description: "Bin inventory tracking, in/out records, serial number monitoring, and area-wise dispatch statistics for optimal allocation.",
      icon: Package,
      route: "/admin/reports/bin",
      color: "from-green-500 to-green-600",
      stats: "Asset Utilization & Tracking",
    },
    {
      id: "lorry",
      title: "Lorry Reports",
      description: "Lorry performance, trip history, bin transport records, and driver-wise trip analyses for fleet optimization.",
      icon: Truck,
      route: "/admin/reports/lorry",
      color: "from-purple-500 to-purple-600",
      stats: "Fleet Performance & Efficiency",
    },
    {
      id: "booking",
      title: "Booking Reports",
      description: "Daily, weekly, monthly, and yearly Delivery Order trends. Booking volumes and service demand for capacity planning.",
      icon: Calendar,
      route: "/admin/reports/booking",
      color: "from-orange-500 to-orange-600",
      stats: "Volume Trends & Forecasting",
    },
    {
      id: "invoice",
      title: "Invoice Reports",
      description: "Sales reports, pending payments, and payment method breakdown (Cash/Online/CDM). Comprehensive financial performance overview.",
      icon: Receipt,
      route: "/admin/reports/invoice",
      color: "from-red-500 to-red-600",
      stats: "Financial Performance & Revenue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileBarChart className="w-8 h-8 text-blue-600" />
              Reports Summary
            </h1>
            <p className="text-gray-600 mt-1">
              Central hub for all analytical reports and performance insights
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Report Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">5</p>
                  <p className="text-xs text-blue-100 mt-1">Available reports</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Data Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">Real-Time</p>
                  <p className="text-xs text-emerald-100 mt-1">Live data analysis</p>
                </div>
                <TrendingUp className="w-12 h-12 text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">CSV</p>
                  <p className="text-xs text-purple-100 mt-1">Data export available</p>
                </div>
                <FileBarChart className="w-12 h-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 overflow-hidden"
                onClick={() => navigate(category.route)}
              >
                <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${category.color} text-white`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-xl mt-4">{category.title}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{category.stats}</span>
                  </div>
                  <Button
                    className="w-full mt-4 group-hover:bg-blue-600 transition-colors"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(category.route);
                    }}
                  >
                    View Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-blue-600" />
              About Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Date Range Selection:</strong> All reports support flexible date range filtering
              to analyze data for specific periods.
            </p>
            <p>
              <strong>Export Capability:</strong> Download reports in CSV format for further analysis
              in spreadsheet applications.
            </p>
            <p>
              <strong>Real-Time Data:</strong> Reports reflect the latest data from your system,
              ensuring accurate and up-to-date insights.
            </p>
            <p>
              <strong>Performance Metrics:</strong> Each report category provides key performance
              indicators relevant to that business area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsSummary;

