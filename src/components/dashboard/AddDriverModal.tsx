
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

const AddDriverModal = () => {
  const [isOpen, setIsOpen] = useState(false);
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

    // Simulate API call
    setTimeout(() => {
      toast.success(`Driver ${formData.fullName} added successfully!`);
      setIsOpen(false);
      // Reset form
      setFormData({
        fullName: "", icNumber: "", email: "", phone: "", address: "", dateOfBirth: "",
        licenseNumber: "", licenseClass: "", licenseExpiry: "", vehicleType: "", plateNumber: "",
        vehicleModel: "", vehicleYear: "", vehicleCapacity: "", joinDate: "", employmentType: "",
        salary: "", emergencyContact: "", emergencyPhone: "", experience: "", notes: ""
      });
    }, 1000);
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
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Emergency contact name"
                  className="rounded-lg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
                rows={2}
                className="rounded-lg"
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => handleInputChange("vehicleType", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="lorry">Lorry</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="pickup">Pickup Truck</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
                  placeholder="2020"
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="vehicleCapacity">Capacity</Label>
                <Input
                  id="vehicleCapacity"
                  value={formData.vehicleCapacity}
                  onChange={(e) => handleInputChange("vehicleCapacity", e.target.value)}
                  placeholder="3 tons"
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="5"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange("joinDate", e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select onValueChange={(value) => handleInputChange("employmentType", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary">Monthly Salary (RM)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="3000"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information about the driver"
              rows={3}
              className="rounded-lg"
            />
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
