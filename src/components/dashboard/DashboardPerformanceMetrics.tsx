
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Award, Fuel, CheckCircle } from "lucide-react";

const DashboardPerformanceMetrics: React.FC = () => {
  const performanceData = [
    {
      title: "On-Time Delivery",
      value: 94.2,
      target: 95,
      icon: Clock,
      status: "good",
      trend: "+2.5%"
    },
    {
      title: "Customer Satisfaction",
      value: 87.8,
      target: 90,
      icon: Award,
      status: "warning",
      trend: "+1.2%"
    },
    {
      title: "Route Efficiency",
      value: 91.5,
      target: 85,
      icon: Target,
      status: "excellent",
      trend: "+5.3%"
    },
    {
      title: "Fuel Efficiency",
      value: 78.3,
      target: 80,
      icon: Fuel,
      status: "warning",
      trend: "-0.8%"
    },
    {
      title: "Order Completion",
      value: 96.7,
      target: 95,
      icon: CheckCircle,
      status: "excellent",
      trend: "+3.1%"
    },
    {
      title: "Driver Performance",
      value: 88.9,
      target: 85,
      icon: TrendingUp,
      status: "good",
      trend: "+4.2%"
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

  const getProgressColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-500";
      case "good": return "bg-blue-500";
      case "warning": return "bg-yellow-500";
      case "poor": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performanceData.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="p-4 border rounded-lg bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                    <span className="font-medium text-sm text-gray-900">
                      {metric.title}
                    </span>
                  </div>
                  <Badge className={`${getStatusBadge(metric.status)} text-xs`}>
                    {metric.status}
                  </Badge>
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
