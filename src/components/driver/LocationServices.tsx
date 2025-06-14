
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Locate, 
  Filter,
  Navigation,
  Map,
  Target,
  Settings,
  RefreshCw
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

interface LocationServicesProps {
  jobs: Job[];
  currentLocation: { lat: number; lng: number } | null;
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

const LocationServices: React.FC<LocationServicesProps> = ({ 
  jobs, 
  currentLocation, 
  onLocationUpdate 
}) => {
  const [postcodeSearch, setPostcodeSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedState, setSelectedState] = useState('All States');
  const [locationHistory, setLocationHistory] = useState<Array<{
    address: string;
    timestamp: Date;
    coordinates: { lat: number; lng: number };
  }>>([]);

  const malaysianStates = [
    'All States', 'Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 
    'Perak', 'Kedah', 'Kelantan', 'Terengganu', 'Pahang', 
    'Negeri Sembilan', 'Melaka', 'Perlis', 'Sabah', 'Sarawak'
  ];

  const areas = [
    'All Areas', 'City Center', 'Suburbs', 'Industrial Area', 
    'Residential', 'Commercial', 'Mixed Development'
  ];

  useEffect(() => {
    // Load location history from localStorage
    const saved = localStorage.getItem('driverLocationHistory');
    if (saved) {
      setLocationHistory(JSON.parse(saved));
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onLocationUpdate(newLocation);
          
          // Add to history
          const newEntry = {
            address: 'Current Location',
            timestamp: new Date(),
            coordinates: newLocation
          };
          const updatedHistory = [newEntry, ...locationHistory.slice(0, 9)];
          setLocationHistory(updatedHistory);
          localStorage.setItem('driverLocationHistory', JSON.stringify(updatedHistory));
          
          toast.success("Location updated successfully");
        },
        (error) => {
          toast.error("Failed to get current location");
          console.error("Location error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const searchByPostcode = async () => {
    if (!postcodeSearch.trim()) {
      toast.error("Please enter a postcode");
      return;
    }

    // Simulate postcode lookup (in real app, use a geocoding service)
    const mockResults = {
      '50450': { lat: 3.1390, lng: 101.6869, area: 'Ampang', state: 'Kuala Lumpur' },
      '47800': { lat: 3.1073, lng: 101.5951, area: 'Petaling Jaya', state: 'Selangor' },
      '10200': { lat: 5.4164, lng: 100.3327, area: 'George Town', state: 'Penang' }
    };

    const result = mockResults[postcodeSearch as keyof typeof mockResults];
    if (result) {
      onLocationUpdate({ lat: result.lat, lng: result.lng });
      
      const newEntry = {
        address: `${postcodeSearch} - ${result.area}, ${result.state}`,
        timestamp: new Date(),
        coordinates: { lat: result.lat, lng: result.lng }
      };
      const updatedHistory = [newEntry, ...locationHistory.slice(0, 9)];
      setLocationHistory(updatedHistory);
      localStorage.setItem('driverLocationHistory', JSON.stringify(updatedHistory));
      
      toast.success(`Location set to ${result.area}, ${result.state}`);
      setPostcodeSearch('');
    } else {
      toast.error("Postcode not found");
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedState !== 'All States' && !job.deliveryAddress.includes(selectedState)) {
      return false;
    }
    if (selectedArea !== 'All Areas') {
      // Simple area filtering based on keywords
      const areaKeywords = {
        'City Center': ['city', 'center', 'central', 'downtown'],
        'Suburbs': ['suburb', 'residential', 'housing'],
        'Industrial Area': ['industrial', 'factory', 'warehouse'],
        'Residential': ['apartment', 'condo', 'house', 'residence'],
        'Commercial': ['mall', 'shop', 'office', 'commercial'],
        'Mixed Development': ['mixed', 'development', 'complex']
      };
      
      const keywords = areaKeywords[selectedArea as keyof typeof areaKeywords] || [];
      if (!keywords.some(keyword => 
        job.deliveryAddress.toLowerCase().includes(keyword.toLowerCase())
      )) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Location Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Locate className="h-5 w-5" />
            Location Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Location */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Current Location</p>
              <p className="text-xs text-gray-500">
                {currentLocation 
                  ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
                  : 'Location not available'
                }
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={getCurrentLocation}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Update
            </Button>
          </div>

          {/* Postcode Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Postcode Lookup</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter postcode (e.g., 50450)"
                value={postcodeSearch}
                onChange={(e) => setPostcodeSearch(e.target.value)}
                className="flex-1"
              />
              <Button onClick={searchByPostcode}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Area and State Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              >
                {malaysianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Area Type</label>
              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Recent Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationHistory.length > 0 ? (
            <div className="space-y-2">
              {locationHistory.slice(0, 5).map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onLocationUpdate(entry.coordinates)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{entry.address}</p>
                    <p className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent locations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtered Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtered Jobs ({filteredJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{job.customerName}</p>
                    <p className="text-xs text-gray-600">{job.binType}</p>
                    <p className="text-xs text-gray-500 truncate">{job.deliveryAddress}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs">
                      {job.distance}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      RM{job.amount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No jobs match the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedState('All States');
                setSelectedArea('All Areas');
                toast.info("Filters cleared");
              }}
            >
              Clear Filters
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setLocationHistory([]);
                localStorage.removeItem('driverLocationHistory');
                toast.info("History cleared");
              }}
            >
              Clear History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationServices;
