
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Edit, Trash2, Navigation, Home, Building, Mail } from "lucide-react";
import { toast } from "sonner";

interface CustomerAddress {
  id: string;
  type: "Billing" | "Service" | "Mailing";
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  gpsCoordinates?: string;
  isPrimary: boolean;
  isActive: boolean;
  deliveryInstructions?: string;
  accessNotes?: string;
}

interface CustomerAddressManagerProps {
  customerId: string;
  addresses: CustomerAddress[];
  onAddressesUpdate: (addresses: CustomerAddress[]) => void;
}

const CustomerAddressManager: React.FC<CustomerAddressManagerProps> = ({
  customerId,
  addresses,
  onAddressesUpdate
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [geolocating, setGeolocating] = useState(false);
  const [newAddress, setNewAddress] = useState<{
    type: "Billing" | "Service" | "Mailing";
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    gpsCoordinates: string;
    isPrimary: boolean;
    deliveryInstructions: string;
    accessNotes: string;
  }>({
    type: "Service",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "Malaysia",
    gpsCoordinates: "",
    isPrimary: false,
    deliveryInstructions: "",
    accessNotes: ""
  });

  const malaysianStates = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan",
    "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
  ];

  const geocodeAddress = async () => {
    if (!newAddress.address || !newAddress.city) {
      toast.error("Please enter address and city first");
      return;
    }

    setGeolocating(true);
    try {
      // Simulate geocoding API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock coordinates for Malaysian addresses
      const mockCoordinates = {
        "Kuala Lumpur": "3.1390,101.6869",
        "Petaling Jaya": "3.1073,101.6067",
        "Shah Alam": "3.0738,101.5183",
        "Johor Bahru": "1.4927,103.7414",
        "Penang": "5.4164,100.3327"
      };

      const coordinates = mockCoordinates[newAddress.city as keyof typeof mockCoordinates] || "3.1390,101.6869";
      setNewAddress(prev => ({ ...prev, gpsCoordinates: coordinates }));
      toast.success("Address geocoded successfully");
    } catch (error) {
      toast.error("Geocoding failed. Please enter coordinates manually.");
    } finally {
      setGeolocating(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.postcode) {
      toast.error("Please fill in required fields");
      return;
    }

    // Validate postcode format
    if (!/^\d{5}$/.test(newAddress.postcode)) {
      toast.error("Invalid postcode format (5 digits required)");
      return;
    }

    // Check for primary address limit per type
    if (newAddress.isPrimary) {
      const existingPrimary = addresses.find(addr => addr.type === newAddress.type && addr.isPrimary);
      if (existingPrimary && !editingAddress) {
        toast.error(`A primary ${newAddress.type.toLowerCase()} address already exists`);
        return;
      }
    }

    const address: CustomerAddress = {
      id: editingAddress ? editingAddress.id : `ADDR${Date.now()}`,
      type: newAddress.type,
      address: newAddress.address,
      city: newAddress.city,
      state: newAddress.state,
      postcode: newAddress.postcode,
      country: newAddress.country,
      gpsCoordinates: newAddress.gpsCoordinates || undefined,
      isPrimary: newAddress.isPrimary,
      isActive: true,
      deliveryInstructions: newAddress.deliveryInstructions || undefined,
      accessNotes: newAddress.accessNotes || undefined
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? address : addr
      );
    } else {
      updatedAddresses = [...addresses, address];
    }

    // If setting as primary, unset other primary addresses of same type
    if (newAddress.isPrimary) {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.type === newAddress.type && addr.id !== address.id
          ? { ...addr, isPrimary: false }
          : addr
      );
    }

    onAddressesUpdate(updatedAddresses);
    toast.success(editingAddress ? "Address updated successfully" : "Address added successfully");
    setShowAddModal(false);
    resetForm();
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddress(address);
    setNewAddress({
      type: address.type,
      address: address.address,
      city: address.city,
      state: address.state,
      postcode: address.postcode,
      country: address.country,
      gpsCoordinates: address.gpsCoordinates || "",
      isPrimary: address.isPrimary,
      deliveryInstructions: address.deliveryInstructions || "",
      accessNotes: address.accessNotes || ""
    });
    setShowAddModal(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedAddresses = addresses.filter(address => address.id !== addressId);
    onAddressesUpdate(updatedAddresses);
    toast.success("Address deleted successfully");
  };

  const toggleAddressStatus = (addressId: string) => {
    const updatedAddresses = addresses.map(address =>
      address.id === addressId
        ? { ...address, isActive: !address.isActive }
        : address
    );
    onAddressesUpdate(updatedAddresses);
  };

  const setPrimaryAddress = (addressId: string, type: string) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isPrimary: address.id === addressId ? true : address.type === type ? false : address.isPrimary
    }));
    onAddressesUpdate(updatedAddresses);
    toast.success("Primary address updated");
  };

  const resetForm = () => {
    setNewAddress({
      type: "Service",
      address: "",
      city: "",
      state: "",
      postcode: "",
      country: "Malaysia",
      gpsCoordinates: "",
      isPrimary: false,
      deliveryInstructions: "",
      accessNotes: ""
    });
    setEditingAddress(null);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "Billing":
        return <Building className="h-4 w-4" />;
      case "Service":
        return <Home className="h-4 w-4" />;
      case "Mailing":
        return <Mail className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressBadge = (type: string) => {
    switch (type) {
      case "Billing":
        return <Badge className="bg-blue-100 text-blue-800">Billing</Badge>;
      case "Service":
        return <Badge className="bg-green-100 text-green-800">Service</Badge>;
      case "Mailing":
        return <Badge className="bg-purple-100 text-purple-800">Mailing</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Address Management
            </CardTitle>
            <Dialog open={showAddModal} onOpenChange={(open) => {
              setShowAddModal(open);
              if (!open) {
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 space-y-2">
                  <div>
                    <Label htmlFor="type">Address Type *</Label>
                    <Select value={newAddress.type} onValueChange={(value: "Billing" | "Service" | "Mailing") => setNewAddress(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Billing">Billing Address</SelectItem>
                        <SelectItem value="Service">Service Address</SelectItem>
                        <SelectItem value="Mailing">Mailing Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={newAddress.isPrimary}
                      onChange={(e) => setNewAddress(prev => ({...prev, isPrimary: e.target.checked}))}
                    />
                    <Label htmlFor="isPrimary">Set as Primary</Label>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({...prev, address: e.target.value}))}
                      placeholder="123 Jalan ABC, Taman DEF"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({...prev, city: e.target.value}))}
                      placeholder="Kuala Lumpur"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={newAddress.state} onValueChange={(value) => setNewAddress(prev => ({...prev, state: value}))}>
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
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={newAddress.postcode}
                      onChange={(e) => setNewAddress(prev => ({...prev, postcode: e.target.value}))}
                      placeholder="50000"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress(prev => ({...prev, country: e.target.value}))}
                      placeholder="Malaysia"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                    <div className="flex gap-2">
                      <Input
                        id="gpsCoordinates"
                        value={newAddress.gpsCoordinates}
                        onChange={(e) => setNewAddress(prev => ({...prev, gpsCoordinates: e.target.value}))}
                        placeholder="3.1390,101.6869"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={geocodeAddress}
                        disabled={geolocating}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {geolocating ? "Locating..." : "Geocode"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                    <Input
                      id="deliveryInstructions"
                      value={newAddress.deliveryInstructions}
                      onChange={(e) => setNewAddress(prev => ({...prev, deliveryInstructions: e.target.value}))}
                      placeholder="Ring bell twice, use side entrance"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="accessNotes">Access Notes</Label>
                    <Input
                      id="accessNotes"
                      value={newAddress.accessNotes}
                      onChange={(e) => setNewAddress(prev => ({...prev, accessNotes: e.target.value}))}
                      placeholder="Security code: 1234, Contact guard"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button 
                    onClick={handleAddAddress}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {editingAddress ? "Update Address" : "Add Address"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className={`p-4 border rounded-lg ${!address.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      {getAddressIcon(address.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {getAddressBadge(address.type)}
                        {address.isPrimary && <Badge className="bg-yellow-100 text-yellow-800">Primary</Badge>}
                        {!address.isActive && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {!address.isPrimary && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPrimaryAddress(address.id, address.type)}
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAddressStatus(address.id)}
                    >
                      {address.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">{address.address}</div>
                  <div className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.postcode}, {address.country}
                  </div>
                  
                  {address.gpsCoordinates && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Navigation className="h-3 w-3" />
                      <span>GPS: {address.gpsCoordinates}</span>
                    </div>
                  )}
                  
                  {address.deliveryInstructions && (
                    <div className="text-sm">
                      <span className="font-medium">Delivery: </span>
                      <span className="text-gray-600">{address.deliveryInstructions}</span>
                    </div>
                  )}
                  
                  {address.accessNotes && (
                    <div className="text-sm">
                      <span className="font-medium">Access: </span>
                      <span className="text-gray-600">{address.accessNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {addresses.length ===


            0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No addresses added yet</p>
                <p className="text-sm">Add addresses for billing, service, and mailing purposes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAddressManager;
