
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Camera,
  Phone,
  Navigation,
  Bell,
  User,
  FileText,
  Fuel,
  Map,
  Locate,
  Route,
  Target,
  Wifi,
  WifiOff
} from "lucide-react";
import { toast } from "sonner";
import InteractiveMap from "./InteractiveMap";
import LocationServices from "./LocationServices";

interface DriverSession {
  name: string;
  ic: string;
  phone: string;
  driverId: string;
}

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverSession, setDriverSession] = useState<DriverSession | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState<'overview' | 'map' | 'location'>('overview');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Dummy job data with location coordinates
  const [jobs] = useState([
    {
      id: "JOB001",
      customerName: "ABC Construction Sdn Bhd",
      customerPhone: "03-9876 5432",
      pickupAddress: "Jalan Ampang, 50450 Kuala Lumpur",
      deliveryAddress: "No. 123, Jalan Tun Razak, 50400 KL",
      binType: "ASR100",
      binSerial: "ASR100-001",
      binSize: "4x12x6ft",
      status: "pending",
      amount: 350.00,
      paymentMethod: "Cash",
      assignedTime: "08:00 AM",
      priority: "high",
      coordinates: { lat: 3.1390, lng: 101.6869 },
      distance: "2.3 km"
    },
    {
      id: "JOB002", 
      customerName: "Green Valley Resort",
      customerPhone: "012-345 6789",
      pickupAddress: "Warehouse B, Port Klang",
      deliveryAddress: "Green Valley Resort, Genting Highlands",
      binType: "LASR100",
      binSerial: "LASR100-045",
      binSize: "6x12x8ft",
      status: "in-progress",
      amount: 450.00,
      paymentMethod: "Online Transfer",
      assignedTime: "10:30 AM",
      priority: "medium",
      coordinates: { lat: 3.4221, lng: 101.7933 },
      distance: "45.2 km"
    },
    {
      id: "JOB003",
      customerName: "Sunshine Apartments",
      customerPhone: "016-789 0123",
      pickupAddress: "Customer Site",
      deliveryAddress: "Sunshine Apartments, Petaling Jaya",
      binType: "PWD100",
      binSerial: "PWD100-023",
      binSize: "3x10x5ft",
      status: "completed",
      amount: 280.00,
      paymentMethod: "Cheque",
      assignedTime: "07:00 AM",
      priority: "low",
      coordinates: { lat: 3.1073, lng: 101.5951 },
      distance: "8.7 km"
    }
  ]);

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (!session) {
      navigate("/driver/login");
      return;
    }
    setDriverSession(JSON.parse(session));

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-500";
      case "in-progress": return "bg-blue-600";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingJobs = jobs.filter(job => job.status === "pending").length;
  const inProgressJobs = jobs.filter(job => job.status === "in-progress").length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const totalPayments = jobs.filter(job => job.status === "completed")
    .reduce((sum, job) => sum + job.amount, 0);

  if (!driverSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeView === 'overview' 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeView === 'map' 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveView('location')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeView === 'location' 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Location
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>

        {/* Welcome Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 lg:p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold mb-1">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {driverSession.name}! 👋
              </h1>
              <p className="text-white/90 text-sm lg:text-base">Ready to make today productive?</p>
            </div>
            <div className="text-right">
              <p className="text-xl lg:text-2xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-xs lg:text-sm text-white/80">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <>
            {/* Performance Metrics - Mobile Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="border-orange-100 hover:border-orange-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingJobs}</p>
                    </div>
                    <div className="bg-orange-100 rounded-full p-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:border-blue-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Active</p>
                      <p className="text-2xl font-bold text-blue-600">{inProgressJobs}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Done</p>
                      <p className="text-2xl font-bold text-green-600">{completedJobs}</p>
                    </div>
                    <div className="bg-green-100 rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:border-blue-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Earned</p>
                      <p className="text-lg font-bold text-blue-600">RM{totalPayments}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions - Mobile Grid */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/90 to-primary/70 text-white rounded-t-xl">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white flex-col h-16 gap-1"
                    onClick={() => navigate("/driver/orders")}
                  >
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Orders</span>
                  </Button>

                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white flex-col h-16 gap-1"
                    onClick={() => setActiveView('map')}
                  >
                    <Map className="h-5 w-5" />
                    <span className="text-xs">Map</span>
                  </Button>

                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white flex-col h-16 gap-1"
                    onClick={() => navigate("/driver/lorries")}
                  >
                    <Truck className="h-5 w-5" />
                    <span className="text-xs">Lorries</span>
                  </Button>

                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white flex-col h-16 gap-1"
                    onClick={() => navigate("/driver/expenses")}
                  >
                    <Fuel className="h-5 w-5" />
                    <span className="text-xs">Expenses</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Jobs - Mobile Optimized */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/90 to-primary/70 text-white rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm truncate">{job.customerName}</p>
                          <p className="text-xs text-gray-600">{job.binType} • {job.assignedTime}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.distance}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs mb-1">
                          RM{job.amount}
                        </Badge>
                        <p className="text-xs text-gray-500">{job.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start h-10" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Office</p>
                      <p className="text-xs text-gray-500">03-1234 5678</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-10" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Supervisor</p>
                      <p className="text-xs text-gray-500">012-345 6789</p>
                    </div>
                  </Button>
                  <Button variant="destructive" className="w-full h-10 text-base font-semibold" size="sm">
                    🚨 Emergency Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Map Tab */}
        {activeView === 'map' && (
          <div className="space-y-4">
            <InteractiveMap 
              jobs={jobs}
              currentLocation={currentLocation}
              isOnline={isOnline}
            />
          </div>
        )}

        {/* Location Tab */}
        {activeView === 'location' && (
          <div className="space-y-4">
            <LocationServices 
              jobs={jobs}
              currentLocation={currentLocation}
              onLocationUpdate={setCurrentLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
