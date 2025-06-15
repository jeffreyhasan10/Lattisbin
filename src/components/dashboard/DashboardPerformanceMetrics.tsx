
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
import { TrendingUp, Target, Clock, Award, Fuel, CheckCircle, Eye, BarChart3 } from "lucide-react";

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
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "warning": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (metric: any) => {
    setSelectedMetric(metric);
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance Metrics
          </CardTitle>
          <Button variant="outline" size="sm" className="text-gray-700 border-gray-300">
            <BarChart3 className="h-4 w-4 mr-1" />
            View Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/30 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                    <span className="font-medium text-sm text-gray-900">
                      {metric.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusBadge(metric.status)} text-xs`}>
                      {metric.status}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                          onClick={() => handleViewDetails(metric)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-gray-900">
                            <Icon className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
                            {metric.title}
                          </DialogTitle>
                          <DialogDescription className="text-gray-600">
                            {metric.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-gray-900">{metric.details.thisMonth}%</div>
                              <div className="text-sm text-gray-600">This Month</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-gray-900">{metric.details.lastMonth}%</div>
                              <div className="text-sm text-gray-600">Last Month</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-xl font-bold text-blue-600">{metric.details.yearToDate}%</div>
                              <div className="text-sm text-blue-600">Year to Date</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-xl font-bold text-green-600">{metric.details.benchmark}%</div>
                              <div className="text-sm text-green-600">Target</div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.value}%
                    </span>
                    <span className={`text-sm font-medium ${
                      metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend}
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  Target: {metric.target}% • Current: {metric.value}%
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
