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
  Phone,
  Navigation,
  FileText,
  Fuel,
  Map,
  Route,
  Target,
  Wifi,
  WifiOff,
  Home,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import InteractiveMap from "./InteractiveMap";
import LocationServices from "./LocationServices";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  const getViewTitle = () => {
    switch (activeView) {
      case 'map': return 'Interactive Map';
      case 'location': return 'Location Services';
      default: return 'Dashboard Overview';
    }
  };

  if (!driverSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/driver/dashboard" 
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {activeView !== 'overview' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-gray-700 font-medium">
                        {getViewTitle()}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            
            {activeView !== 'overview' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView('overview')}
                className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex">
          {[
            { key: 'overview', label: 'Overview', icon: Home },
            { key: 'map', label: 'Map', icon: Map },
            { key: 'location', label: 'Location', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                activeView === key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="flex items-center gap-2 text-green-600">
                <Wifi className="h-5 w-5" />
                <span className="font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <WifiOff className="h-5 w-5" />
                <span className="font-medium">Offline Mode</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {driverSession.name}! 👋
              </h1>
              <p className="text-blue-100 text-base lg:text-lg">Ready to make today productive?</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-sm text-blue-200">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
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
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: 'Pending', value: pendingJobs, color: 'orange', icon: AlertCircle },
                { label: 'Active', value: inProgressJobs, color: 'blue', icon: Clock },
                { label: 'Completed', value: completedJobs, color: 'green', icon: CheckCircle },
                { label: 'Earned', value: `RM${totalPayments}`, color: 'purple', icon: DollarSign }
              ].map(({ label, value, color, icon: Icon }) => (
                <Card key={label} className={`shadow-lg border-0 bg-gradient-to-br from-white to-${color}-50/50 hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
                        <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                      </div>
                      <div className={`bg-${color}-100 rounded-full p-3`}>
                        <Icon className={`h-6 w-6 text-${color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Route className="h-6 w-6" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Orders', icon: FileText, action: () => navigate("/driver/orders"), color: 'blue' },
                    { label: 'Map View', icon: Map, action: () => setActiveView('map'), color: 'green' },
                    { label: 'Lorries', icon: Truck, action: () => navigate("/driver/lorries"), color: 'purple' },
                    { label: 'Expenses', icon: Fuel, action: () => navigate("/driver/expenses"), color: 'orange' }
                  ].map(({ label, icon: Icon, action, color }) => (
                    <Button
                      key={label}
                      onClick={action}
                      className={`bg-gradient-to-r from-${color}-500 to-${color}-600 hover:from-${color}-600 hover:to-${color}-700 text-white flex-col h-20 gap-2 shadow-md hover:shadow-lg transition-all duration-200`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Jobs */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Today's Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${getStatusColor(job.status)} shadow-sm`}>
                            {getStatusIcon(job.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-base truncate">{job.customerName}</p>
                            <p className="text-sm text-gray-600 mb-1">{job.binType} • {job.assignedTime}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.distance}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            RM{job.amount}
                          </Badge>
                          <p className="text-xs text-gray-500">{job.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50/50">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Phone className="h-6 w-6" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    { label: 'Office', number: '03-1234 5678' },
                    { label: 'Supervisor', number: '012-345 6789' }
                  ].map(({ label, number }) => (
                    <Button
                      key={label}
                      variant="outline"
                      className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
                    >
                      <Phone className="h-5 w-5 mr-3 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-base">{label}</p>
                        <p className="text-sm text-gray-500">{number}</p>
                      </div>
                    </Button>
                  ))}
                  <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md">
                    🚨 Emergency Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Map Tab */}
        {activeView === 'map' && (
          <InteractiveMap 
            jobs={jobs}
            currentLocation={currentLocation}
            isOnline={isOnline}
          />
        )}

        {/* Location Tab */}
        {activeView === 'location' && (
          <LocationServices 
            jobs={jobs}
            currentLocation={currentLocation}
            onLocationUpdate={setCurrentLocation}
          />
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
