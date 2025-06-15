
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose }) => {
  const { addDriver } = useOrders();
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    icNumber: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Employment Details
    employeeId: "",
    dateJoined: "",
    position: "Driver",
    department: "Operations",
    
    // Vehicle Assignment
    vehicle: "",
    vehicleRegistration: "",
    
    // Documents
    licenseNumber: "",
    licenseClass: "",
    licenseExpiry: "",
    insuranceNumber: "",
    insuranceExpiry: "",
    
    // Status and Location
    status: "active" as "active" | "inactive" | "on-break" | "maintenance" | "offline",
    location: "",
    
    // Performance
    baseSalary: 0,
    commissionRate: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.icNumber || !formData.licenseNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

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
      // Additional fields for comprehensive profile
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      employeeId: formData.employeeId,
      dateJoined: formData.dateJoined,
      position: formData.position,
      department: formData.department,
      vehicleRegistration: formData.vehicleRegistration,
      licenseNumber: formData.licenseNumber,
      licenseClass: formData.licenseClass,
      licenseExpiry: formData.licenseExpiry,
      insuranceNumber: formData.insuranceNumber,
      insuranceExpiry: formData.insuranceExpiry,
      baseSalary: formData.baseSalary,
      commissionRate: formData.commissionRate,
    };

    addDriver(newDriver);
    toast.success("Driver account created successfully");
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      icNumber: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      employeeId: "",
      dateJoined: "",
      position: "Driver",
      department: "Operations",
      vehicle: "",
      vehicleRegistration: "",
      licenseNumber: "",
      licenseClass: "",
      licenseExpiry: "",
      insuranceNumber: "",
      insuranceExpiry: "",
      status: "active",
      location: "",
      baseSalary: 0,
      commissionRate: 5,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Driver Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icNumber">IC Number *</Label>
                <Input
                  id="icNumber"
                  value={formData.icNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, icNumber: e.target.value }))}
                  placeholder="e.g., 123456-78-9012"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g., +60123456789"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Home Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  placeholder="e.g., EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateJoined">Date Joined</Label>
                <Input
                  id="dateJoined"
                  type="date"
                  value={formData.dateJoined}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateJoined: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Senior Driver">Senior Driver</SelectItem>
                    <SelectItem value="Lead Driver">Lead Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                    <SelectItem value="Waste Management">Waste Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Assignment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Model</Label>
                <Input
                  id="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                  placeholder="e.g., Isuzu NPR"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleRegistration">Vehicle Registration</Label>
                <Input
                  id="vehicleRegistration"
                  value={formData.vehicleRegistration}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleRegistration: e.target.value }))}
                  placeholder="e.g., ABC1234"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* License & Insurance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">License & Insurance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseClass">License Class</Label>
                <Select value={formData.licenseClass} onValueChange={(value) => setFormData(prev => ({ ...prev, licenseClass: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2">B2 (Car)</SelectItem>
                    <SelectItem value="D">D (Motorcycle)</SelectItem>
                    <SelectItem value="E">E (Lorry)</SelectItem>
                    <SelectItem value="E1">E1 (Small Lorry)</SelectItem>
                    <SelectItem value="E2">E2 (Heavy Lorry)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">License Expiry</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceNumber">Insurance Policy Number</Label>
                <Input
                  id="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Status and Compensation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Status & Compensation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Employment Status</Label>
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
              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Kuala Lumpur"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base Salary (RM)</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseSalary: Number(e.target.value) }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Driver Account</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModal;
