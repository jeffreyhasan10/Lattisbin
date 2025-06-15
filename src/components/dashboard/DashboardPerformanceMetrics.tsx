
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrendingUp, Target, Clock, Award, Fuel, CheckCircle, Eye, BarChart3, ArrowUp, ArrowDown } from "lucide-react";

const DashboardPerformanceMetrics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<any>(null);

  const performanceData = [
    {
      id: 1,
      title: "On-Time Delivery",
      value: 94.2,
      target: 95,
      icon: Clock,
      status: "good",
      trend: "+2.5%",
      description: "Percentage of deliveries completed on time",
      details: {
        thisMonth: 94.2,
        lastMonth: 91.7,
        yearToDate: 93.1,
        benchmark: 95
      }
    },
    {
      id: 2,
      title: "Customer Satisfaction",
      value: 87.8,
      target: 90,
      icon: Award,
      status: "warning",
      trend: "+1.2%",
      description: "Average customer rating across all services",
      details: {
        thisMonth: 87.8,
        lastMonth: 86.6,
        yearToDate: 88.2,
        benchmark: 90
      }
    },
    {
      id: 3,
      title: "Route Efficiency",
      value: 91.5,
      target: 85,
      icon: Target,
      status: "excellent",
      trend: "+5.3%",
      description: "Optimal route utilization and fuel efficiency",
      details: {
        thisMonth: 91.5,
        lastMonth: 86.2,
        yearToDate: 89.7,
        benchmark: 85
      }
    },
    {
      id: 4,
      title: "Fuel Efficiency",
      value: 78.3,
      target: 80,
      icon: Fuel,
      status: "warning",
      trend: "-0.8%",
      description: "Miles per gallon across fleet vehicles",
      details: {
        thisMonth: 78.3,
        lastMonth: 79.1,
        yearToDate: 79.8,
        benchmark: 80
      }
    },
    {
      id: 5,
      title: "Order Completion",
      value: 96.7,
      target: 95,
      icon: CheckCircle,
      status: "excellent",
      trend: "+3.1%",
      description: "Percentage of orders completed successfully",
      details: {
        thisMonth: 96.7,
        lastMonth: 93.6,
        yearToDate: 95.8,
        benchmark: 95
      }
    },
    {
      id: 6,
      title: "Driver Performance",
      value: 88.9,
      target: 85,
      icon: TrendingUp,
      status: "good",
      trend: "+4.2%",
      description: "Overall driver performance rating",
      details: {
        thisMonth: 88.9,
        lastMonth: 84.7,
        yearToDate: 87.2,
        benchmark: 85
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 dark:text-green-400";
      case "good": return "text-blue-600 dark:text-blue-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "poor": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "good": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "poor": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleViewDetails = (metric: any) => {
    setSelectedMetric(metric);
  };

  const handleViewReport = () => {
    console.log("View full performance report clicked");
    // Add navigation logic here
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold">Performance Metrics</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">Key performance indicators</p>
            </div>
          </CardTitle>
          <Button 
            onClick={handleViewReport}
            variant="outline" 
            size="sm" 
            className="text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Full Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.map((metric) => {
            const Icon = metric.icon;
            const isPositiveTrend = metric.trend.startsWith('+');
            return (
              <div key={metric.id} className="p-4 lg:p-5 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gradient-to-br from-gray-50/30 to-gray-100/30 dark:from-gray-800/30 dark:to-gray-900/30 hover:from-gray-50/50 hover:to-gray-100/50 dark:hover:from-gray-700/30 dark:hover:to-gray-800/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getStatusColor(metric.status).includes('green') ? 'from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20' : 
                      getStatusColor(metric.status).includes('blue') ? 'from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20' :
                      getStatusColor(metric.status).includes('yellow') ? 'from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20' :
                      'from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20'}`}>
                      <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100 block">
                        {metric.title}
                      </span>
                      <Badge className={`${getStatusBadge(metric.status)} text-xs mt-1`}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleViewDetails(metric)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Icon className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
                          {metric.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                          {metric.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.details.thisMonth}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.details.lastMonth}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Last Month</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{metric.details.yearToDate}%</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Year to Date</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">{metric.details.benchmark}%</div>
                            <div className="text-sm text-green-600 dark:text-green-400">Target</div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {metric.value}%
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                      isPositiveTrend ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    }`}>
                      {isPositiveTrend ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      <span>{metric.trend}</span>
                    </div>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                  <span>Target: {metric.target}%</span>
                  <span>Current: {metric.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPerformanceMetrics;
