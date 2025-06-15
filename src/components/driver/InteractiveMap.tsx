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
  Clock,
  Satellite,
  Download,
  Wifi,
  WifiOff
} from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/contexts/NavigationProvider";
import RouteOptimizer from "./RouteOptimizer";
import OfflineMapManager, { OfflineArea } from "@/utils/OfflineMapManager";
import GeofenceManager from "@/utils/GeofenceManager";

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
  const { navigationState, startTracking, stopTracking, getCurrentPosition } = useNavigation();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeMode, setRouteMode] = useState<'single' | 'optimized'>('single');
  const [nearestJobs, setNearestJobs] = useState<Job[]>([]);
  const [offlineMapManager] = useState(new OfflineMapManager());
  const [geofenceManager] = useState(new GeofenceManager());
  const [offlineAreas, setOfflineAreas] = useState<OfflineArea[]>([]);
  const [showRouteOptimizer, setShowRouteOptimizer] = useState(false);

  // Initialize offline map manager and geofence manager
  useEffect(() => {
    const initializeManagers = async () => {
      try {
        await offlineMapManager.initialize();
        const areas = await offlineMapManager.getOfflineAreas();
        setOfflineAreas(areas);

        // Setup geofence monitoring
        geofenceManager.addEventListener((event) => {
          console.log('Geofence event:', event);
          toast.info(`Geofence ${event.event}: ${event.geofenceId}`);
        });

        if (navigationState.isTracking) {
          geofenceManager.startMonitoring(getCurrentPosition);
        }
      } catch (error) {
        console.error('Failed to initialize managers:', error);
      }
    };

    initializeManagers();

    return () => {
      geofenceManager.stopMonitoring();
    };
  }, []);

  // Start geofence monitoring when GPS tracking starts
  useEffect(() => {
    if (navigationState.isTracking) {
      geofenceManager.startMonitoring(getCurrentPosition);
    } else {
      geofenceManager.stopMonitoring();
    }
  }, [navigationState.isTracking]);

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
    if (navigationState.currentPosition) {
      const jobsWithDistance = jobs.map(job => ({
        ...job,
        calculatedDistance: calculateDistance(
          navigationState.currentPosition!.lat,
          navigationState.currentPosition!.lng,
          job.coordinates.lat,
          job.coordinates.lng
        )
      }));

      const sorted = jobsWithDistance
        .sort((a, b) => parseFloat(a.calculatedDistance || '0') - parseFloat(b.calculatedDistance || '0'))
        .slice(0, 5);

      setNearestJobs(sorted);
    }
  }, [navigationState.currentPosition, jobs]);

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

  const handleStartTracking = async () => {
    const success = await startTracking();
    if (success) {
      // Create geofences for active jobs
      jobs.filter(job => job.status === 'pending').forEach(job => {
        const geofence = geofenceManager.createCustomerGeofence(
          job.id,
          job.customerName,
          job.pickupAddress,
          job.coordinates
        );
        geofenceManager.addGeofence(geofence);
      });
    }
  };

  const handleStopTracking = () => {
    stopTracking();
    geofenceManager.stopMonitoring();
  };

  const openNavigation = (job: Job) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${job.coordinates.lat},${job.coordinates.lng}`;
    window.open(url, '_blank');
    toast.success(`Opening navigation to ${job.customerName}`);
  };

  const downloadOfflineArea = async () => {
    if (!navigationState.currentPosition) {
      toast.error('Current location required for offline download');
      return;
    }

    const area: Omit<OfflineArea, 'downloadStatus' | 'progress' | 'size' | 'lastUpdated'> = {
      id: `area_${Date.now()}`,
      name: 'Current Area',
      bounds: {
        north: navigationState.currentPosition.lat + 0.05,
        south: navigationState.currentPosition.lat - 0.05,
        east: navigationState.currentPosition.lng + 0.05,
        west: navigationState.currentPosition.lng - 0.05,
      },
      priority: 'high',
    };

    try {
      toast.info('Starting offline map download...');
      await offlineMapManager.downloadArea(area);
      const updatedAreas = await offlineMapManager.getOfflineAreas();
      setOfflineAreas(updatedAreas);
      toast.success('Offline map downloaded successfully');
    } catch (error) {
      toast.error('Failed to download offline map');
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Map Controls */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            GPS Navigation & Tracking
            <div className="flex gap-2 ml-auto">
              {navigationState.isOnline ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              {navigationState.isTracking && (
                <Badge className="bg-green-100 text-green-800 border-green-300 animate-pulse">
                  <Satellite className="h-3 w-3 mr-1" />
                  GPS Active
                </Badge>
              )}
            </div>
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

          {/* Enhanced Controls */}
          <div className="flex flex-wrap gap-3">
            {!navigationState.isTracking ? (
              <Button 
                onClick={handleStartTracking}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Satellite className="h-4 w-4 mr-2" />
                Start GPS Tracking
              </Button>
            ) : (
              <Button 
                onClick={handleStopTracking}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <Satellite className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}
            
            <Button 
              onClick={() => setShowRouteOptimizer(!showRouteOptimizer)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Route className="h-4 w-4 mr-2" />
              Route Optimizer
            </Button>
            
            <Button 
              onClick={downloadOfflineArea}
              variant="outline"
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Area
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

          {/* GPS Status */}
          {navigationState.currentPosition && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-800 font-medium">GPS Active</span>
                </div>
                <div className="text-green-700">
                  Accuracy: {navigationState.currentPosition.accuracy.toFixed(0)}m
                  {navigationState.currentPosition.speed && (
                    <span className="ml-2">Speed: {(navigationState.currentPosition.speed * 3.6).toFixed(0)} km/h</span>
                  )}
                </div>
              </div>
              {navigationState.lastUpdate && (
                <div className="text-xs text-green-600 mt-1">
                  Last update: {navigationState.lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Optimizer */}
      {showRouteOptimizer && (
        <RouteOptimizer
          stops={jobs.filter(job => job.status === 'pending').map(job => ({
            id: job.id,
            address: job.pickupAddress,
            coordinates: job.coordinates,
            estimatedDuration: 30, // Default 30 minutes
            priority: job.priority as 'high' | 'medium' | 'low',
            notes: `${job.binType} - RM${job.amount}`,
          }))}
          onRouteOptimized={(route) => {
            toast.success(`Route optimized with ${route.stops.length} stops`);
            setRouteMode('optimized');
          }}
          onNavigationStart={(route) => {
            toast.success('Navigation started for optimized route');
          }}
        />
      )}

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

      {/* Offline Areas */}
      {offlineAreas.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Offline Maps ({offlineAreas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {offlineAreas.map((area) => (
                <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{area.name}</p>
                    <p className="text-sm text-gray-600">
                      {(area.size / (1024 * 1024)).toFixed(1)} MB • 
                      {area.downloadStatus === 'completed' ? 'Ready' : area.downloadStatus}
                    </p>
                  </div>
                  <Badge className={
                    area.downloadStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    area.downloadStatus === 'downloading' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {area.progress}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearest Jobs - Enhanced with GPS data */}
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
