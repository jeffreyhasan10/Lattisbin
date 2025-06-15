
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
import { Activity, Truck, Package, User, MapPin, Clock, Eye, Filter, ArrowRight } from "lucide-react";

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
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "scheduled": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleViewDetails = (activity: any) => {
    setSelectedActivity(activity);
  };

  const handleViewAll = () => {
    console.log("View all activities clicked");
    // Add navigation logic here
  };

  const filteredActivities = recentActivities.filter(activity => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  return (
    <Card className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold">Recent Activity</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">Latest operations and updates</p>
            </div>
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Activities</option>
              <option value="collection">Collections</option>
              <option value="delivery">Deliveries</option>
              <option value="maintenance">Maintenance</option>
              <option value="payment">Payments</option>
            </select>
            <Button 
              onClick={handleViewAll}
              variant="outline" 
              size="sm" 
              className="text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] lg:h-[500px]">
          <div className="space-y-1 p-4 lg:p-6">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 dark:hover:from-gray-700/30 dark:hover:to-gray-800/30 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 group"
                >
                  <div className="mt-1 p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:shadow-md transition-all">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                        {activity.title}
                      </h4>
                      <Badge className={`${getStatusColor(activity.status)} text-xs shrink-0`}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {activity.driver && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{activity.driver}</span>
                        </div>
                      )}
                      {activity.customer && (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 shrink-0" />
                          <span className="truncate">{activity.customer}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span className="truncate">{activity.time}</span>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="mt-3 flex justify-between items-center">
                        <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                          {activity.amount}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                              onClick={() => handleViewDetails(activity)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                {getActivityIcon(activity.type)}
                                {activity.title}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600 dark:text-gray-400">
                                Detailed information about this activity
                              </DialogDescription>
                            </DialogHeader>
                            {selectedActivity && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                    <Badge className={`${getStatusColor(selectedActivity.status)} mt-1`}>
                                      {selectedActivity.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{selectedActivity.time}</p>
                                  </div>
                                </div>
                                
                                {selectedActivity.details && (
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Additional Details</h4>
                                    <div className="grid grid-cols-1 gap-3 text-sm">
                                      {Object.entries(selectedActivity.details).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                          <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                          <span className="text-gray-900 dark:text-gray-100 font-medium">{String(value)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {selectedActivity.amount && (
                                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                      <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                                      <span className="font-bold text-green-600 dark:text-green-400 text-lg">{selectedActivity.amount}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardActivityFeed;
