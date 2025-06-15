
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Truck, Package, Eye } from "lucide-react";

const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  
  const [reports] = useState([
    {
      id: "RPT001",
      name: "Revenue Analysis",
      category: "Financial",
      description: "Comprehensive revenue breakdown by service type, customer segment, and time period",
      lastGenerated: "2024-03-15",
      frequency: "Weekly",
      format: "PDF + Excel",
      subscribers: 5
    },
    {
      id: "RPT002",
      name: "Fleet Utilization",
      category: "Operations",
      description: "Vehicle usage statistics, fuel consumption, and maintenance costs",
      lastGenerated: "2024-03-14",
      frequency: "Daily",
      format: "Dashboard + PDF",
      subscribers: 3
    },
    {
      id: "RPT003",
      name: "Customer Satisfaction",
      category: "Customer",
      description: "Customer feedback scores, complaint analysis, and retention metrics",
      lastGenerated: "2024-03-10",
      frequency: "Monthly",
      format: "Interactive Dashboard",
      subscribers: 8
    },
    {
      id: "RPT004",
      name: "Driver Performance",
      category: "HR",
      description: "Driver efficiency metrics, on-time delivery rates, and commission calculations",
      lastGenerated: "2024-03-12",
      frequency: "Bi-weekly",
      format: "PDF Report",
      subscribers: 4
    }
  ]);

  const [kpiMetrics] = useState([
    {
      name: "Total Revenue",
      value: "RM 245,600",
      change: "+12.5%",
      trend: "up",
      period: "vs last month"
    },
    {
      name: "Active Customers",
      value: "389",
      change: "+8.3%",
      trend: "up",
      period: "vs last month"
    },
    {
      name: "Fleet Utilization",
      value: "87.2%",
      change: "-2.1%",
      trend: "down",
      period: "vs last month"
    },
    {
      name: "Order Completion Rate",
      value: "96.8%",
      change: "+1.4%",
      trend: "up",
      period: "vs last month"
    },
    {
      name: "Customer Satisfaction",
      value: "4.6/5.0",
      change: "+0.2",
      trend: "up",
      period: "vs last month"
    },
    {
      name: "Average Order Value",
      value: "RM 425",
      change: "+5.7%",
      trend: "up",
      period: "vs last month"
    }
  ]);

  const [predictions] = useState([
    {
      metric: "Revenue Forecast",
      value: "RM 285,000",
      confidence: "92%",
      period: "Next Month",
      factors: ["Seasonal trends", "New customer acquisition", "Service expansion"]
    },
    {
      metric: "Demand Prediction",
      value: "15% increase",
      confidence: "88%",
      period: "Next Quarter",
      factors: ["Construction sector growth", "Urban development", "Weather patterns"]
    },
    {
      metric: "Fleet Requirements",
      value: "2 additional lorries",
      confidence: "85%",
      period: "Next 6 months",
      factors: ["Demand growth", "Route optimization", "Service expansion"]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Comprehensive Reports & Analytics
          </h2>
          <p className="text-gray-600 mt-1">Real-time metrics with predictive analytics and custom report builder</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Real-time KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time KPI Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiMetrics.map((metric, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </span>
                        <span className="text-xs text-gray-500">{metric.period}</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {index === 0 && <DollarSign className="h-6 w-6 text-blue-600" />}
                      {index === 1 && <Users className="h-6 w-6 text-blue-600" />}
                      {index === 2 && <Truck className="h-6 w-6 text-blue-600" />}
                      {index === 3 && <Package className="h-6 w-6 text-blue-600" />}
                      {index === 4 && <TrendingUp className="h-6 w-6 text-blue-600" />}
                      {index === 5 && <BarChart3 className="h-6 w-6 text-blue-600" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {predictions.map((prediction, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{prediction.metric}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold text-purple-600">{prediction.value}</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {prediction.confidence} confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{prediction.period}</p>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Key factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.factors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {report.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Generated</p>
                      <p className="font-medium">{report.lastGenerated}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                    <div>
                      <p className="text-gray-500">Subscribers</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {report.subscribers}
                      </p>
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
                    <Button size="sm" className="flex-1">
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Interactive revenue chart</p>
                <p className="text-sm text-gray-500">Real-time data visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Service breakdown pie chart</p>
                <p className="text-sm text-gray-500">By category and volume</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
