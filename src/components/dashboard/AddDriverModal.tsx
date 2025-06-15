
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

const AddDriverModal: React.FC = () => {
  const { addDriver } = useOrders();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    icNumber: "",
    vehicle: "",
    location: "",
    status: "active" as "active" | "maintenance" | "offline"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.icNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const username = formData.name.toLowerCase().replace(/\s+/g, '.');
    const password = `driver${Math.random().toString(36).slice(-6)}`;

    const newDriver = {
      name: formData.name,
      phone: formData.phone,
      vehicle: formData.vehicle || "Not Assigned",
      status: formData.status,
      location: formData.location || "Not Set",
      email: formData.email || "",
      icNumber: formData.icNumber,
      joinDate: new Date().toISOString().split('T')[0],
      orders: 0,
      rating: 5.0,
      totalEarnings: 0,
      completedOrders: 0,
      loginCredentials: {
        username,
        password
      }
    };

    addDriver(newDriver);
    toast.success(`Driver added successfully! Username: ${username}, Password: ${password}`);
    
    setFormData({
      name: "",
      phone: "",
      email: "",
      icNumber: "",
      vehicle: "",
      location: "",
      status: "active"
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="icNumber">IC Number *</Label>
              <Input
                id="icNumber"
                value={formData.icNumber}
                onChange={(e) => setFormData(prev => ({...prev, icNumber: e.target.value}))}
                placeholder="YYMMDD-PB-XXXX"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                placeholder="+60 12-345 6789"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                placeholder="driver@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                value={formData.vehicle}
                onChange={(e) => setFormData(prev => ({...prev, vehicle: e.target.value}))}
                placeholder="Lorry ABC1234"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                placeholder="Kuala Lumpur"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: "active" | "maintenance" | "offline") => setFormData(prev => ({...prev, status: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Driver
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModal;
