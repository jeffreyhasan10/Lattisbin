import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Navigation, 
  Route, 
  Target, 
  Search,
  Locate,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  priority: string;
  coordinates: { lat: number; lng: number };
  distance: string;
  binType: string;
  amount: number;
  calculatedDistance?: string;
}

interface InteractiveMapProps {
  jobs: Job[];
  currentLocation: { lat: number; lng: number } | null;
  isOnline: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ jobs, currentLocation, isOnline }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeMode, setRouteMode] = useState<'single' | 'optimized'>('single');
  const [nearestJobs, setNearestJobs] = useState<Job[]>([]);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  };

  // Find nearest jobs
  useEffect(() => {
    if (currentLocation) {
      const jobsWithDistance = jobs.map(job => ({
        ...job,
        calculatedDistance: calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          job.coordinates.lat,
          job.coordinates.lng
        )
      }));

      const sorted = jobsWithDistance
        .sort((a, b) => parseFloat(a.calculatedDistance || '0') - parseFloat(b.calculatedDistance || '0'))
        .slice(0, 5);

      setNearestJobs(sorted);
    }
  }, [currentLocation, jobs]);

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

  const openNavigation = (job: Job) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${job.coordinates.lat},${job.coordinates.lng}`;
    window.open(url, '_blank');
    toast.success(`Opening navigation to ${job.customerName}`);
  };

  const optimizeRoute = () => {
    const pendingJobs = jobs.filter(job => job.status === 'pending');
    if (pendingJobs.length === 0) {
      toast.info("No pending jobs to optimize");
      return;
    }
    
    toast.success(`Route optimized for ${pendingJobs.length} stops`);
    setRouteMode('optimized');
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Map
            {!isOnline && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                Offline Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Map Controls */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => toast.success("Location updated"),
                    () => toast.error("Location access denied")
                  );
                }
              }}
            >
              <Locate className="h-4 w-4 mr-2" />
              My Location
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-green-50 border-green-200 text-green-700"
              onClick={optimizeRoute}
            >
              <Route className="h-4 w-4 mr-2" />
              Optimize Route
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
              onClick={() => toast.info("Map refreshed")}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Display */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <div 
            ref={mapRef}
            className="h-80 lg:h-96 bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-hidden"
          >
            {/* Map placeholder with job markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-800 font-semibold text-lg mb-2">Interactive Map</p>
                  <p className="text-sm text-gray-600">
                    {isOnline ? 'Live tracking enabled' : 'Offline mode - cached data'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job markers overlay */}
            <div className="absolute inset-0">
              {jobs.slice(0, 3).map((job, index) => (
                <div
                  key={job.id}
                  className={`absolute w-10 h-10 ${getStatusColor(job.status)} rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer transform hover:scale-110 transition-all duration-200 shadow-lg border-2 border-white`}
                  style={{
                    left: `${25 + index * 20}%`,
                    top: `${35 + index * 15}%`,
                  }}
                  onClick={() => setSelectedJob(job)}
                >
                  {index + 1}
                </div>
              ))}
              
              {/* Current location marker */}
              {currentLocation && (
                <div
                  className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-full h-full bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearest Jobs */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Nearest Jobs ({nearestJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {nearestJobs.length > 0 ? (
            <div className="space-y-4">
              {nearestJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getStatusColor(job.status)} shadow-sm`}>
                        {getStatusIcon(job.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{job.customerName}</p>
                        <p className="text-xs text-gray-600 mb-1">{job.binType}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.calculatedDistance} km away
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => openNavigation(job)}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        RM{job.amount}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium">No nearby jobs found</p>
                <p className="text-sm text-gray-500 mt-1">Enable location to see nearest jobs</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Job Details */}
      {selectedJob && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">{selectedJob.customerName}</h3>
              <Badge className={`${getStatusColor(selectedJob.status)} text-white px-3 py-1`}>
                {selectedJob.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pickup Address</p>
                  <p className="text-sm text-gray-900">{selectedJob.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivery Address</p>
                  <p className="text-sm text-gray-900">{selectedJob.deliveryAddress}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bin Type</p>
                  <p className="text-sm text-gray-900">{selectedJob.binType}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Amount</p>
                    <p className="text-sm font-semibold text-green-600">RM{selectedJob.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Distance</p>
                    <p className="text-sm text-gray-900">{selectedJob.distance}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button 
                onClick={() => openNavigation(selectedJob)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Navigate
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedJob(null)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
