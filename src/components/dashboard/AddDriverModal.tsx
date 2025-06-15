
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User, Phone, Mail, MapPin, Car, CreditCard, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

const AddDriverModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addDriver } = useOrders();
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    icNumber: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    
    // License Information
    licenseNumber: "",
    licenseClass: "",
    licenseExpiry: "",
    
    // Vehicle Information
    vehicleType: "",
    plateNumber: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleCapacity: "",
    
    // Employment Details
    joinDate: "",
    employmentType: "",
    salary: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Additional Information
    experience: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.icNumber || !formData.phone || !formData.licenseNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create new driver
    const newDriver = {
      name: formData.fullName,
      phone: formData.phone,
      vehicle: `${formData.vehicleModel} ${formData.plateNumber}`,
      status: 'active' as const,
      location: "Available",
      email: formData.email,
      icNumber: formData.icNumber,
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      loginCredentials: {
        username: formData.fullName.toLowerCase().replace(/\s+/g, '.'),
        password: `driver${Math.floor(Math.random() * 1000)}`
      }
    };

    addDriver(newDriver);
    toast.success(`Driver ${formData.fullName} added successfully! Login: ${newDriver.loginCredentials.username} / ${newDriver.loginCredentials.password}`);
    
    setIsOpen(false);
    // Reset form
    setFormData({
      fullName: "", icNumber: "", email: "", phone: "", address: "", dateOfBirth: "",
      licenseNumber: "", licenseClass: "", licenseExpiry: "", vehicleType: "", plateNumber: "",
      vehicleModel: "", vehicleYear: "", vehicleCapacity: "", joinDate: "", employmentType: "",
      salary: "", emergencyContact: "", emergencyPhone: "", experience: "", notes: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg rounded-xl px-6 py-3">
          <Plus className="h-4 w-4 mr-2" />
          Add New Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <User className="h-6 w-6 text-blue-600" />
            Add New Driver
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete driver registration with all required information for fleet management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter driver's full name"
                  className="rounded-lg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="icNumber">IC Number *</Label>
                <Input
                  id="icNumber"
                  value={formData.icNumber}
                  onChange={(e) => handleInputChange("icNumber", e.target.value)}
                  placeholder="YYMMDD-PB-XXXX"
                  className="rounded-lg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="driver@example.com"
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="bg-blue-50/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              License Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  placeholder="Enter license number"
                  className="rounded-lg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="licenseClass">License Class</Label>
                <Select onValueChange={(value) => handleInputChange("licenseClass", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2">B2 - Car</SelectItem>
                    <SelectItem value="D">D - Lorry</SelectItem>
                    <SelectItem value="E">E - Heavy Vehicle</SelectItem>
                    <SelectItem value="E1">E1 - Bus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="licenseExpiry">License Expiry</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => handleInputChange("licenseExpiry", e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-green-50/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                  placeholder="Isuzu NKR"
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="plateNumber">Plate Number</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                  placeholder="WBM 1234"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6"
            >
              Add Driver
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModal;
