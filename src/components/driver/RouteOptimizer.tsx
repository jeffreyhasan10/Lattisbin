
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Route, 
  Navigation, 
  Clock, 
  MapPin, 
  Fuel, 
  TrendingUp,
  RefreshCw,
  Play,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { useNavigation, GPSPosition } from "@/contexts/NavigationProvider";

interface RouteStop {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  estimatedDuration: number;
  priority: 'high' | 'medium' | 'low';
  timeWindow?: { start: string; end: string };
  notes?: string;
}

interface OptimizedRoute {
  stops: RouteStop[];
  totalDistance: number;
  totalTime: number;
  estimatedFuel: number;
  efficiency: number;
  trafficDelay: number;
}

interface RouteOptimizerProps {
  stops: RouteStop[];
  onRouteOptimized: (route: OptimizedRoute) => void;
  onNavigationStart: (route: OptimizedRoute) => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({
  stops,
  onRouteOptimized,
  onNavigationStart
}) => {
  const { navigationState, getCurrentPosition } = useNavigation();
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routePreferences, setRoutePreferences] = useState({
    avoidTolls: false,
    avoidHighways: false,
    preferFastestRoute: true,
  });

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Simulate traffic-aware route optimization
  const optimizeRoute = async () => {
    if (stops.length === 0) {
      toast.info("No stops to optimize");
      return;
    }

    setIsOptimizing(true);
    
    try {
      const currentPosition = await getCurrentPosition();
      if (!currentPosition) {
        toast.error("Unable to get current location");
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Priority-based optimization with distance consideration
      const optimizedStops = [...stops].sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority];
        const bPriority = priorityWeight[b.priority];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        // If same priority, sort by distance
        const aDistance = calculateDistance(currentPosition, a.coordinates);
        const bDistance = calculateDistance(currentPosition, b.coordinates);
        return aDistance - bDistance;
      });

      // Calculate route metrics
      let totalDistance = 0;
      let totalTime = 0;
      let currentPos = currentPosition;

      optimizedStops.forEach((stop, index) => {
        const distance = calculateDistance(currentPos, stop.coordinates);
        totalDistance += distance;
        totalTime += stop.estimatedDuration + (distance / 40 * 60); // 40km/h average speed
        currentPos = stop.coordinates;
      });

      const trafficDelay = Math.random() * 20; // Random traffic delay (0-20 minutes)
      const estimatedFuel = totalDistance * 0.08; // 8L per 100km
      const efficiency = Math.max(0, 100 - (totalDistance / stops.length) * 2);

      const optimized: OptimizedRoute = {
        stops: optimizedStops,
        totalDistance: Math.round(totalDistance * 100) / 100,
        totalTime: Math.round(totalTime + trafficDelay),
        estimatedFuel: Math.round(estimatedFuel * 100) / 100,
        efficiency: Math.round(efficiency),
        trafficDelay: Math.round(trafficDelay),
      };

      setOptimizedRoute(optimized);
      onRouteOptimized(optimized);
      toast.success(`Route optimized! ${optimized.stops.length} stops planned`);
      
    } catch (error) {
      console.error('Route optimization failed:', error);
      toast.error('Failed to optimize route');
    } finally {
      setIsOptimizing(false);
    }
  };

  const startNavigation = () => {
    if (optimizedRoute) {
      onNavigationStart(optimizedRoute);
      toast.success('Navigation started');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Route Optimizer Header */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Route className="h-5 w-5" />
            Smart Route Optimizer
            {navigationState.isOnline ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">Live Traffic</Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">Offline Mode</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={optimizeRoute}
              disabled={isOptimizing || stops.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Optimize Route
                </>
              )}
            </Button>
            
            {optimizedRoute && (
              <Button 
                onClick={startNavigation}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Route Metrics */}
      {optimizedRoute && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{optimizedRoute.totalDistance}km</p>
              <p className="text-sm text-gray-600">Total Distance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{Math.floor(optimizedRoute.totalTime / 60)}h {optimizedRoute.totalTime % 60}m</p>
              <p className="text-sm text-gray-600">Est. Time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Fuel className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{optimizedRoute.estimatedFuel}L</p>
              <p className="text-sm text-gray-600">Est. Fuel</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{optimizedRoute.efficiency}%</p>
              <p className="text-sm text-gray-600">Efficiency</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimized Route Stops */}
      {optimizedRoute && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-600" />
              Optimized Route ({optimizedRoute.stops.length} stops)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {optimizedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">{stop.address}</p>
                      <Badge className={`${getPriorityColor(stop.priority)} text-xs`}>
                        {stop.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {stop.estimatedDuration}min
                      </span>
                      {stop.timeWindow && (
                        <span>{stop.timeWindow.start} - {stop.timeWindow.end}</span>
                      )}
                    </div>
                    {stop.notes && (
                      <p className="text-xs text-gray-500 mt-1">{stop.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteOptimizer;
