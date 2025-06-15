import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Edit, Trash2, Navigation } from "lucide-react";
import { toast } from "sonner";

interface BusinessLocation {
  id: string;
  address: string;
  state: string;
  city: string;
  postcode: string;
  gpsCoordinates: string;
  isPrimary: boolean;
  locationType: "Headquarters" | "Branch" | "Warehouse" | "Service Center";
  contactPerson?: string;
  contactPhone?: string;
}

interface BusinessLocationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  locations: BusinessLocation[];
  onLocationsUpdate: (locations: BusinessLocation[]) => void;
}

const BusinessLocationManager: React.FC<BusinessLocationManagerProps> = ({
  isOpen,
  onClose,
  businessId,
  locations,
  onLocationsUpdate
}) => {
  const [editingLocation, setEditingLocation] = useState<BusinessLocation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    address: "",
    state: "",
    city: "",
    postcode: "",
    gpsCoordinates: "",
    locationType: "Branch" as const,
    contactPerson: "",
    contactPhone: ""
  });

  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", 
    "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", 
    "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

  const handleAddLocation = () => {
    if (!newLocation.address || !newLocation.city || !newLocation.state) {
      toast.error("Please fill in all required fields");
      return;
    }

    const location: BusinessLocation = {
      id: `LOC${Date.now()}`,
      ...newLocation,
      isPrimary: locations.length === 0, // First location is primary
    };

    const updatedLocations = [...locations, location];
    onLocationsUpdate(updatedLocations);
    toast.success("Location added successfully");
    setShowAddModal(false);
    setNewLocation({
      address: "",
      state: "",
      city: "",
      postcode: "",
      gpsCoordinates: "",
      locationType: "Branch",
      contactPerson: "",
      contactPhone: ""
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    const locationToDelete = locations.find(loc => loc.id === locationId);
    if (locationToDelete?.isPrimary && locations.length > 1) {
      toast.error("Cannot delete primary location. Set another location as primary first.");
      return;
    }

    const updatedLocations = locations.filter(loc => loc.id !== locationId);
    onLocationsUpdate(updatedLocations);
    toast.success("Location deleted successfully");
  };

  const handleSetPrimary = (locationId: string) => {
    const updatedLocations = locations.map(loc => ({
      ...loc,
      isPrimary: loc.id === locationId
    }));
    onLocationsUpdate(updatedLocations);
    toast.success("Primary location updated");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNewLocation(prev => ({
            ...prev,
            gpsCoordinates: `${latitude.toFixed(6)},${longitude.toFixed(6)}`
          }));
          toast.success("GPS coordinates captured");
        },
        (error) => {
          toast.error("Failed to get current location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Management - Business ID: {businessId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Business Locations ({locations.length})</h3>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((location) => (
              <Card key={location.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {location.locationType}
                      {location.isPrimary && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditingLocation(location)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteLocation(location.id)}
                        disabled={location.isPrimary && locations.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Address:</strong> {location.address}</div>
                  <div><strong>City:</strong> {location.city}, {location.state} {location.postcode}</div>
                  {location.gpsCoordinates && (
                    <div><strong>GPS:</strong> {location.gpsCoordinates}</div>
                  )}
                  {location.contactPerson && (
                    <div><strong>Contact:</strong> {location.contactPerson} ({location.contactPhone})</div>
                  )}
                  {!location.isPrimary && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSetPrimary(location.id)}
                      className="mt-2"
                    >
                      Set as Primary
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Location Modal */}
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <Label>Location Type</Label>
                  <Select 
                    value={newLocation.locationType} 
                    onValueChange={(value: any) => setNewLocation(prev => ({...prev, locationType: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Headquarters">Headquarters</SelectItem>
                      <SelectItem value="Branch">Branch</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Service Center">Service Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Address *</Label>
                  <Input
                    value={newLocation.address}
                    onChange={(e) => setNewLocation(prev => ({...prev, address: e.target.value}))}
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input
                    value={newLocation.city}
                    onChange={(e) => setNewLocation(prev => ({...prev, city: e.target.value}))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Select 
                    value={newLocation.state} 
                    onValueChange={(value) => setNewLocation(prev => ({...prev, state: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {malaysianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Postcode</Label>
                  <Input
                    value={newLocation.postcode}
                    onChange={(e) => setNewLocation(prev => ({...prev, postcode: e.target.value}))}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label>GPS Coordinates</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newLocation.gpsCoordinates}
                      onChange={(e) => setNewLocation(prev => ({...prev, gpsCoordinates: e.target.value}))}
                      placeholder="lat,lng"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={getCurrentLocation}>
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={newLocation.contactPerson}
                    onChange={(e) => setNewLocation(prev => ({...prev, contactPerson: e.target.value}))}
                    placeholder="Person in charge"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={newLocation.contactPhone}
                    onChange={(e) => setNewLocation(prev => ({...prev, contactPhone: e.target.value}))}
                    placeholder="+60 12-345 6789"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleAddLocation}>Add Location</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessLocationManager;
