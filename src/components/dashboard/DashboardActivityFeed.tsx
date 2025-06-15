
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Activity, Truck, Package, User, MapPin, Clock, Eye, Filter } from "lucide-react";

const DashboardActivityFeed: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  const recentActivities = [
    {
      id: "1",
      type: "collection",
      title: "Waste Collection Completed",
      description: "Construction waste collected from KLCC Tower",
      driver: "Ahmad Rahman",
      customer: "KLCC Management",
      amount: "RM 450.00",
      location: "KLCC, KL",
      time: "5 minutes ago",
      status: "completed",
      priority: "high",
      details: {
        vehicleId: "WMD1234",
        wasteType: "Construction Debris",
        quantity: "2.5 tons",
        duration: "45 minutes",
        route: "Route A-12"
      }
    },
    {
      id: "2", 
      type: "delivery",
      title: "New Order Assignment",
      description: "Mixed waste delivery to Sunshine Apartments",
      driver: "Lim Wei Ming",
      customer: "Sunshine Apartments",
      amount: "RM 280.00",
      location: "Petaling Jaya",
      time: "15 minutes ago",
      status: "in-progress",
      priority: "medium",
      details: {
        vehicleId: "ABC5678",
        wasteType: "Mixed Recyclables",
        quantity: "1.8 tons",
        duration: "30 minutes",
        route: "Route B-7"
      }
    },
    {
      id: "3",
      type: "maintenance",
      title: "Vehicle Maintenance",
      description: "Scheduled maintenance for Lorry #WMD1234",
      driver: "Raj Kumar",
      customer: null,
      amount: null,
      location: "Service Center",
      time: "1 hour ago",
      status: "scheduled",
      priority: "low",
      details: {
        vehicleId: "WMD1234",
        maintenanceType: "Routine Service",
        estimatedDuration: "2 hours",
        nextService: "2024-08-15"
      }
    },
    {
      id: "4",
      type: "payment",
      title: "Payment Received",
      description: "Invoice payment from Tech Plaza Mall",
      driver: null,
      customer: "Tech Plaza Mall",
      amount: "RM 520.00",
      location: "Mid Valley, KL",
      time: "2 hours ago",
      status: "completed",
      priority: "medium",
      details: {
        invoiceId: "INV-2024-001",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN123456",
        services: "Waste Collection & Disposal"
      }
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "collection": return <Package className="h-4 w-4 text-green-600" />;
      case "delivery": return <Truck className="h-4 w-4 text-blue-600" />;
      case "maintenance": return <Activity className="h-4 w-4 text-orange-600" />;
      case "payment": return <User className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (activity: any) => {
    setSelectedActivity(activity);
  };

  const filteredActivities = recentActivities.filter(activity => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  return (
    <Card className="h-full bg-white border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <div className="flex gap-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 text-gray-700 bg-white"
            >
              <option value="all">All</option>
              <option value="collection">Collections</option>
              <option value="delivery">Deliveries</option>
              <option value="maintenance">Maintenance</option>
              <option value="payment">Payments</option>
            </select>
            <Button variant="outline" size="sm" className="text-gray-700 border-gray-300">
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-6 pt-0">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 group"
              >
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                    {activity.driver && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.driver}
                      </div>
                    )}
                    {activity.customer && (
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {activity.customer}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="mt-2 text-right">
                      <span className="font-bold text-green-600 text-sm">
                        {activity.amount}
                      </span>
                    </div>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
                      onClick={() => handleViewDetails(activity)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-gray-900">
                        {getActivityIcon(activity.type)}
                        {activity.title}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Detailed information about this activity
                      </DialogDescription>
                    </DialogHeader>
                    {selectedActivity && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <Badge className={`${getStatusColor(selectedActivity.status)} mt-1`}>
                              {selectedActivity.status}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Time</label>
                            <p className="text-sm text-gray-900 mt-1">{selectedActivity.time}</p>
                          </div>
                        </div>
                        
                        {selectedActivity.details && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Additional Details</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {Object.entries(selectedActivity.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                  <span className="text-gray-900 font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedActivity.amount && (
                          <div className="pt-3 border-t">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-bold text-green-600 text-lg">{selectedActivity.amount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardActivityFeed;
