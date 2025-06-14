
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
        .sort((a, b) => parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance))
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
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Map
            {!isOnline && (
              <Badge variant="outline" className="text-orange-600">
                Offline Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Map Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => toast.success("Location updated"),
                    () => toast.error("Location access denied")
                  );
                }
              }}
            >
              <Locate className="h-4 w-4 mr-1" />
              My Location
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={optimizeRoute}
            >
              <Route className="h-4 w-4 mr-1" />
              Optimize Route
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.info("Map refreshed")}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef}
            className="h-64 lg:h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden"
          >
            {/* Map placeholder with job markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">
                  {isOnline ? 'Live tracking enabled' : 'Offline mode - cached data'}
                </p>
              </div>
            </div>

            {/* Job markers overlay */}
            <div className="absolute inset-0">
              {jobs.slice(0, 3).map((job, index) => (
                <div
                  key={job.id}
                  className={`absolute w-8 h-8 ${getStatusColor(job.status)} rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transform hover:scale-110 transition-transform`}
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`,
                  }}
                  onClick={() => setSelectedJob(job)}
                >
                  {index + 1}
                </div>
              ))}
              
              {/* Current location marker */}
              {currentLocation && (
                <div
                  className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Nearest Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nearestJobs.length > 0 ? (
            nearestJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{job.customerName}</p>
                    <p className="text-xs text-gray-600">{job.binType}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.calculatedDistance} km away
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openNavigation(job)}
                    className="h-8 px-2"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    <span className="text-xs">Navigate</span>
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    RM{job.amount}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enable location to see nearest jobs</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selecte Job Details */}
      {selectedJob && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selectedJob.customerName}</h3>
              <Badge className={`${getStatusColor(selectedJob.status)} text-white`}>
                {selectedJob.status}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Pickup:</strong> {selectedJob.pickupAddress}</p>
              <p><strong>Delivery:</strong> {selectedJob.deliveryAddress}</p>
              <p><strong>Bin Type:</strong> {selectedJob.binType}</p>
              <p><strong>Amount:</strong> RM{selectedJob.amount}</p>
              <p><strong>Distance:</strong> {selectedJob.distance}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => openNavigation(selectedJob)}
                className="flex-1"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Navigate
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedJob(null)}
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
