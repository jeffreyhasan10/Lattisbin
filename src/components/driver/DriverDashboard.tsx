
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  MapPin,
  Clock,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Timer,
  Route,
  Truck,
  Phone,
  MessageSquare,
  ListTodo,
  ClipboardCheck,
  Zap,
  CircleDot,
  Play,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for task-focused dashboard
const mockTodayTrips = [
  {
    id: "TRP-2024-001",
    customer: "Tech Plaza Mall",
    location: "Cyberjaya, Selangor",
    time: "10:00 AM",
    status: "completed",
    priority: "high",
    wasteType: "Electronic Waste",
    binSize: "Large",
    duration: "45 min"
  },
  {
    id: "TRP-2024-002", 
    customer: "Green Valley Resort",
    location: "Mont Kiara, KL",
    time: "2:15 PM",
    status: "in-progress",
    priority: "medium",
    wasteType: "General Waste",
    binSize: "Medium",
    duration: "30 min"
  },
  {
    id: "TRP-2024-003",
    customer: "Sunrise Apartments",
    location: "Petaling Jaya",
    time: "4:30 PM",  
    status: "pending",
    priority: "high",
    wasteType: "Household Waste",
    binSize: "Large",
    duration: "40 min"
  },
  {
    id: "TRP-2024-004",
    customer: "Metro Shopping Center",
    location: "Subang Jaya",
    time: "6:00 PM",  
    status: "pending",
    priority: "urgent",
    wasteType: "Commercial Waste",
    binSize: "XL",
    duration: "60 min"
  }
];

const mockPendingCollections = [
  {
    id: "COL-2024-001",
    customer: "Bangsar Heights Condo",
    location: "Bangsar, KL",
    binType: "Large Bin",
    quantity: 2,
    scheduledTime: "Tomorrow 9:00 AM",
    priority: "high"
  },
  {
    id: "COL-2024-002",
    customer: "Damansara Corporate Tower",
    location: "Damansara Heights",
    binType: "Medium Bin",
    quantity: 3,
    scheduledTime: "Tomorrow 11:30 AM",
    priority: "medium"
  },
  {
    id: "COL-2024-003",
    customer: "Sunway Pyramid",
    location: "Bandar Sunway",
    binType: "XL Bin",
    quantity: 1,
    scheduledTime: "Today 7:00 PM",
    priority: "urgent"
  }
];

const mockWeekTrips = [
  { day: "Mon", trips: 7, completed: 7 },
  { day: "Tue", trips: 8, completed: 8 },
  { day: "Wed", trips: 6, completed: 6 },
  { day: "Thu", trips: 9, completed: 9 },
  { day: "Fri", trips: 8, completed: 6 },
  { day: "Sat", trips: 4, completed: 0 },
  { day: "Sun", trips: 2, completed: 0 }
];

const DriverDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trips, setTrips] = useState(mockTodayTrips);
  const [collections, setCollections] = useState(mockPendingCollections);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm";
      case "in-progress": return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm";
      case "pending": return "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm";
      case "high": return "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm";
      case "medium": return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm";
      case "low": return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress": return <Play className="h-4 w-4" />;
      case "pending": return <CircleDot className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const handleStartTrip = (tripId: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId ? { ...trip, status: 'in-progress' } : trip
      )
    );
    toast.success(`Started trip ${tripId}`, {
      description: "Navigate to the location to begin collection"
    });
  };

  const handleCompleteTrip = (tripId: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId ? { ...trip, status: 'completed' } : trip
      )
    );
    toast.success(`Completed trip ${tripId}`, {
      description: "Great job! Trip has been marked as completed"
    });
  };

  const handleViewDetails = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      // Open Google Maps with the location
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.location)}`;
      window.open(mapsUrl, '_blank');
      toast.info(`Opening navigation to ${trip.customer}`);
    }
  };

  const handleCallDispatch = () => {
    toast.info("Calling dispatch center...", {
      description: "Contact: +60 12-345-6789"
    });
  };

  const handleReportIssue = () => {
    toast.info("Opening issue report form...");
  };

  const handleEmergencySupport = () => {
    toast.error("Emergency Support", {
      description: "Connecting to emergency hotline: 999"
    });
  };

  const handleViewCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      toast.info(`Collection Details: ${collection.customer}`, {
        description: `${collection.quantity}x ${collection.binType} at ${collection.location}`
      });
    }
  };

  // Calculate stats from current trips
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const activeTrips = trips.filter(t => t.status !== 'completed').length;
  const urgentTasks = trips.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Welcome Banner - Colorful Gradient */}
      <div className="mb-5">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-white">A</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Welcome back, Ahmad!</h1>
              <p className="text-sm text-blue-100 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • 
                <span className="font-medium">Ready for today's trips</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Colorful Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
          <CardContent className="p-4 sm:p-5">
            <div className="text-center text-white">
              <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{trips.length}</p>
              <p className="text-xs sm:text-sm font-medium text-blue-100">Today's Trips</p>
              <p className="text-xs text-blue-100 mt-1">{completedTrips} done</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
          <CardContent className="p-4 sm:p-5">
            <div className="text-center text-white">
              <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                <ListTodo className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{collections.length}</p>
              <p className="text-xs sm:text-sm font-medium text-orange-100">Pending</p>
              <p className="text-xs text-orange-100 mt-1">Collections</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 shadow-lg hover:shadow-xl active:scale-95 transition-all border-0">
          <CardContent className="p-4 sm:p-5">
            <div className="text-center text-white">
              <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{urgentTasks}</p>
              <p className="text-xs sm:text-sm font-medium text-red-100">Urgent</p>
              <p className="text-xs text-red-100 mt-1">Tasks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Trips Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
        {/* Today's Trips & Schedule */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
              <CardTitle className="flex items-center justify-between flex-wrap gap-2 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Route className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold">My Trips</span>
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs sm:text-sm px-3 py-1 font-bold">
                  {activeTrips} active
                </Badge>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-4">
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="today" className="text-xs sm:text-sm">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Today
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs sm:text-sm">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    This Week
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-3 mt-0">
                  {trips.map((trip) => (
                    <div 
                      key={trip.id} 
                      className="p-4 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-2xl shadow-md hover:shadow-xl active:scale-[0.98] transition-all border border-blue-100"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-base mb-1.5">{trip.customer}</h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`${getStatusColor(trip.status)} border-0 text-xs font-semibold`}>
                                {getStatusIcon(trip.status)}
                                <span className="ml-1">{trip.status.replace('-', ' ')}</span>
                              </Badge>
                              {trip.priority === 'urgent' && (
                                <Badge className="bg-red-500 text-white border-0 text-xs font-semibold">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate font-medium">{trip.location}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{trip.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Timer className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{trip.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          {trip.status === 'pending' && (
                            <Button 
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform"
                              onClick={() => handleStartTrip(trip.id)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Trip
                            </Button>
                          )}
                          {trip.status === 'in-progress' && (
                            <Button 
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform"
                              onClick={() => handleCompleteTrip(trip.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            className="h-11 px-4 rounded-xl font-semibold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 active:scale-95 transition-transform"
                            onClick={() => handleViewDetails(trip.id)}
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="week" className="space-y-3 mt-0">
                  <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 border-2 border-indigo-200 shadow-md">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      Weekly Overview
                    </h3>
                    <div className="space-y-3">
                      {mockWeekTrips.map((day, index) => (
                        <div key={day.day} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-700 w-12">{day.day}</span>
                          <div className="flex-1 h-10 bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                            <div 
                              className={`h-full flex items-center justify-center text-xs font-bold text-white transition-all ${
                                index === 4 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                              }`}
                              style={{ width: `${(day.completed / day.trips) * 100}%` }}
                            >
                              {day.completed > 0 && `${day.completed}/${day.trips}`}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-16 text-right">{day.trips} trips</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Pending Collections & Quick Actions */}
        <div className="space-y-4">
          {/* Pending Collections */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <ListTodo className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Collections</span>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs px-2.5 py-1 font-bold">
                  {collections.length}
                </Badge>
              </CardTitle>
            </div>
            <CardContent className="space-y-2.5 pt-4 px-4">
              {collections.map((collection) => (
                <div 
                  key={collection.id} 
                  className={`p-4 rounded-2xl shadow-md active:scale-[0.98] transition-all border-0 ${
                    collection.priority === 'urgent' 
                      ? 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200' 
                      : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2.5">
                    <div className="flex-1">
                      <h5 className="font-bold text-sm text-gray-900">{collection.customer}</h5>
                      {collection.priority === 'urgent' && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 text-xs mt-1.5 font-semibold shadow-sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700 font-medium">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="truncate">{collection.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      {collection.quantity}x {collection.binType}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      {collection.scheduledTime}
                    </p>
                  </div>
                  <Button 
                    className="w-full mt-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white h-11 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                    onClick={() => handleViewCollection(collection.id)}
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Quick Actions</span>
              </CardTitle>
            </div>
            <CardContent className="space-y-2.5 pt-4 px-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white justify-start h-12 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                onClick={handleCallDispatch}
              >
                <Phone className="h-5 w-5 mr-3" />
                Call Dispatch
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white justify-start h-12 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                onClick={handleReportIssue}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Report Issue
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white justify-start h-12 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                onClick={handleEmergencySupport}
              >
                <AlertTriangle className="h-5 w-5 mr-3" />
                Emergency Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default DriverDashboard;
