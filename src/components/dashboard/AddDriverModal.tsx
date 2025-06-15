
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/contexts/OrderContext";

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose }) => {
  const { addDriver } = useOrders();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    status: "active" as "active" | "inactive" | "on-break" | "maintenance" | "offline",
    location: "",
    icNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDriver = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      vehicle: formData.vehicle,
      status: formData.status,
      currentLocation: formData.location,
      location: formData.location,
      icNumber: formData.icNumber,
      totalDeliveries: 0,
      rating: 5.0,
      completedOrders: 0,
      totalEarnings: 0,
    };

    addDriver(newDriver);
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicle: "",
      status: "active",
      location: "",
      icNumber: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                value={formData.vehicle}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-break">On Break</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icNumber">IC Number</Label>
              <Input
                id="icNumber"
                value={formData.icNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, icNumber: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Driver</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModal;
