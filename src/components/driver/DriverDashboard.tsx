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
  ArrowLeft,
  TrendingUp,
  Calendar
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
      case "pending": return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "in-progress": return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "completed": return "bg-gradient-to-r from-emerald-500 to-green-500";
      default: return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4 text-white" />;
      case "in-progress": return <Clock className="h-4 w-4 text-white" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-white" />;
      default: return <Clock className="h-4 w-4 text-white" />;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Breadcrumbs */}
      <div className="bg-white/80 dark:bg-gray-900/80 border-b border-blue-100/60 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/driver/dashboard" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {activeView !== 'overview' && (
                  <>
                    <BreadcrumbSeparator className="text-blue-300 dark:text-blue-600" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-slate-700 dark:text-gray-300 font-semibold">
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
                className="flex items-center gap-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-white/90 dark:bg-gray-900/90 border-b border-blue-100/50 dark:border-gray-700/50 sticky top-16 z-40 shadow-sm backdrop-blur-sm">
        <div className="flex">
          {[
            { key: 'overview', label: 'Overview', icon: Home },
            { key: 'map', label: 'Map', icon: Map },
            { key: 'location', label: 'Location', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex-1 py-4 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                activeView === key
                  ? 'text-blue-600 dark:text-blue-400 border-b-3 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/30' 
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800/50'
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
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-6 lg:p-8 rounded-3xl shadow-2xl border border-blue-200/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold mb-3 flex items-center gap-3">
                <span className="text-3xl">👋</span>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {driverSession.name}!
              </h1>
              <p className="text-blue-100 text-base lg:text-lg font-medium">Ready to make today productive and efficient?</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 lg:p-6 text-center border border-white/20 shadow-lg">
              <p className="text-2xl lg:text-3xl font-bold mb-1">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-sm text-blue-200 flex items-center justify-center gap-1">
                <Calendar className="h-4 w-4" />
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
                { label: 'Pending Jobs', value: pendingJobs, color: 'from-amber-400 to-orange-500', icon: AlertCircle, bgColor: 'from-amber-50 to-orange-50' },
                { label: 'Active Jobs', value: inProgressJobs, color: 'from-blue-400 to-indigo-500', icon: Clock, bgColor: 'from-blue-50 to-indigo-50' },
                { label: 'Completed', value: completedJobs, color: 'from-emerald-400 to-green-500', icon: CheckCircle, bgColor: 'from-emerald-50 to-green-50' },
                { label: 'Total Earned', value: `RM${totalPayments}`, color: 'from-purple-400 to-pink-500', icon: DollarSign, bgColor: 'from-purple-50 to-pink-50' }
              ].map(({ label, value, color, icon: Icon, bgColor }) => (
                <Card key={label} className={`shadow-xl border-0 bg-gradient-to-br ${bgColor} dark:from-gray-800 dark:to-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-gray-400 mb-2">{label}</p>
                        <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
                      </div>
                      <div className={`bg-gradient-to-r ${color} rounded-2xl p-3 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-3xl">
                <CardTitle className="text-xl lg:text-2xl flex items-center gap-3 font-bold">
                  <Route className="h-6 w-6" />
                  Quick Actions
                  <TrendingUp className="h-5 w-5 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 lg:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {[
                    { label: 'My Orders', icon: FileText, action: () => navigate("/driver/orders"), gradient: 'from-blue-500 via-blue-600 to-indigo-600', shadow: 'shadow-blue-500/25' },
                    { label: 'Map View', icon: Map, action: () => setActiveView('map'), gradient: 'from-emerald-500 via-green-600 to-teal-600', shadow: 'shadow-emerald-500/25' },
                    { label: 'My Lorries', icon: Truck, action: () => navigate("/driver/lorries"), gradient: 'from-purple-500 via-violet-600 to-indigo-600', shadow: 'shadow-purple-500/25' },
                    { label: 'Expenses', icon: Fuel, action: () => navigate("/driver/expenses"), gradient: 'from-amber-500 via-orange-600 to-red-600', shadow: 'shadow-amber-500/25' }
                  ].map(({ label, icon: Icon, action, gradient, shadow }) => (
                    <Button
                      key={label}
                      onClick={action}
                      className={`bg-gradient-to-r ${gradient} hover:scale-105 text-white flex-col h-24 lg:h-28 gap-3 ${shadow} hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 font-semibold text-sm lg:text-base transform active:scale-95`}
                    >
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Jobs */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 text-white rounded-t-3xl">
                <CardTitle className="text-xl lg:text-2xl flex items-center gap-3 font-bold">
                  <Clock className="h-6 w-6" />
                  Today's Jobs
                  <Badge className="ml-auto bg-white/20 text-white border-white/30 font-bold">
                    {jobs.length} Total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 lg:p-6 border border-slate-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-2xl ${getStatusColor(job.status)} shadow-lg`}>
                            {getStatusIcon(job.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white text-base lg:text-lg truncate">{job.customerName}</p>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mb-2 font-medium">{job.binType} • {job.assignedTime}</p>
                            <p className="text-sm text-slate-500 dark:text-gray-500 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              {job.distance}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 font-bold shadow-lg">
                            RM{job.amount}
                          </Badge>
                          <p className="text-xs text-slate-500 dark:text-gray-500 font-medium">{job.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-pink-700 text-white rounded-t-3xl">
                <CardTitle className="text-xl lg:text-2xl flex items-center gap-3 font-bold">
                  <Phone className="h-6 w-6" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 lg:p-8">
                <div className="space-y-4">
                  {[
                    { label: 'Office Support', number: '03-1234 5678', icon: Phone },
                    { label: 'Supervisor', number: '012-345 6789', icon: User }
                  ].map(({ label, number, icon: Icon }) => (
                    <Button
                      key={label}
                      variant="outline"
                      className="w-full justify-start h-14 border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Icon className="h-5 w-5 mr-4 text-blue-600 dark:text-blue-400" />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-base text-slate-800 dark:text-white">{label}</p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{number}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </Button>
                  ))}
                  <Button className="w-full h-14 text-base font-bold bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
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
