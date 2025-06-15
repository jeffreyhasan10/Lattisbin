
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Package, Calendar as CalendarIcon, MapPin, User, DollarSign, Clock, Truck, Phone } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const AddOrderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    customerType: "",
    
    // Service Details
    serviceType: "",
    binType: "",
    binSize: "",
    wasteType: "",
    estimatedWeight: "",
    
    // Location Details
    pickupAddress: "",
    deliveryAddress: "",
    pickupFloor: "",
    specialInstructions: "",
    
    // Scheduling
    preferredTime: "",
    urgency: "",
    frequency: "",
    
    // Pricing
    quotedAmount: "",
    deposit: "",
    paymentMethod: "",
    
    // Assignment
    assignedDriver: "",
    assignedVehicle: "",
    
    // Additional Information
    accessRequirements: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName || !formData.customerPhone || !formData.serviceType || !formData.pickupAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(`Order for ${formData.customerName} created successfully!`);
      setIsOpen(false);
      // Reset form
      setFormData({
        customerName: "", customerPhone: "", customerEmail: "", customerAddress: "", customerType: "",
        serviceType: "", binType: "", binSize: "", wasteType: "", estimatedWeight: "",
        pickupAddress: "", deliveryAddress: "", pickupFloor: "", specialInstructions: "",
        preferredTime: "", urgency: "", frequency: "", quotedAmount: "", deposit: "", paymentMethod: "",
        assignedDriver: "", assignedVehicle: "", accessRequirements: "", notes: ""
      });
      setScheduledDate(undefined);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg rounded-xl px-6 py-3">
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <Package className="h-6 w-6 text-green-600" />
            Create New Order
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a comprehensive waste collection order with all necessary details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="bg-blue-50/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  className="rounded-lg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="rounded-lg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  placeholder="customer@example.com"
                  className="rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="customerAddress">Customer Address</Label>
                <Input
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                  placeholder="Enter customer address"
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select onValueChange={(value) => handleInputChange("customerType", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-green-50/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select onValueChange={(value) => handleInputChange("serviceType", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collection">Waste Collection</SelectItem>
                    <SelectItem value="disposal">Waste Disposal</SelectItem>
                    <SelectItem value="recycling">Recycling</SelectItem>
                    <SelectItem value="rental">Bin Rental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="binType">Bin Type</Label>
                <Select onValueChange={(value) => handleInputChange("binType", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select bin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Waste</SelectItem>
                    <SelectItem value="construction">Construction Waste</SelectItem>
                    <SelectItem value="recyclable">Recyclable</SelectItem>
                    <SelectItem value="organic">Organic Waste</SelectItem>
                    <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="binSize">Bin Size</Label>
                <Select onValueChange={(value) => handleInputChange("binSize", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (240L)</SelectItem>
                    <SelectItem value="medium">Medium (660L)</SelectItem>
                    <SelectItem value="large">Large (1100L)</SelectItem>
                    <SelectItem value="extra-large">Extra Large (3m³)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedWeight">Estimated Weight (kg)</Label>
                <Input
                  id="estimatedWeight"
                  type="number"
                  value={formData.estimatedWeight}
                  onChange={(e) => handleInputChange("estimatedWeight", e.target.value)}
                  placeholder="100"
                  className="rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Service Frequency</Label>
                <Select onValueChange={(value) => handleInputChange("frequency", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urgency">Priority Level</Label>
                <Select onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location & Scheduling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Details */}
            <div className="bg-orange-50/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Location Details
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickupAddress">Pickup Address *</Label>
                  <Textarea
                    id="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                    placeholder="Enter pickup address"
                    rows={2}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                    placeholder="Enter delivery address"
                    rows={2}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="pickupFloor">Floor/Unit</Label>
                  <Input
                    id="pickupFloor"
                    value={formData.pickupFloor}
                    onChange={(e) => handleInputChange("pickupFloor", e.target.value)}
                    placeholder="Ground Floor, Unit 12A"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Scheduling
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal rounded-lg"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select onValueChange={(value) => handleInputChange("preferredTime", value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                      <SelectItem value="evening">Evening (6PM - 8PM)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Assignment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing */}
            <div className="bg-yellow-50/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Pricing Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotedAmount">Quoted Amount (RM)</Label>
                  <Input
                    id="quotedAmount"
                    type="number"
                    step="0.01"
                    value={formData.quotedAmount}
                    onChange={(e) => handleInputChange("quotedAmount", e.target.value)}
                    placeholder="0.00"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Deposit Required (RM)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    step="0.01"
                    value={formData.deposit}
                    onChange={(e) => handleInputChange("deposit", e.target.value)}
                    placeholder="0.00"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="company-account">Company Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-indigo-50/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-600" />
                Assignment
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignedDriver">Assign Driver</Label>
                  <Select onValueChange={(value) => handleInputChange("assignedDriver", value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahmad">Ahmad Rahman</SelectItem>
                      <SelectItem value="lim">Lim Wei Ming</SelectItem>
                      <SelectItem value="raj">Raj Kumar</SelectItem>
                      <SelectItem value="auto">Auto-assign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedVehicle">Assign Vehicle</Label>
                  <Select onValueChange={(value) => handleInputChange("assignedVehicle", value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wbm1234">WBM 1234 - Isuzu NKR</SelectItem>
                      <SelectItem value="wbm5678">WBM 5678 - Mitsubishi Canter</SelectItem>
                      <SelectItem value="wbm9012">WBM 9012 - Hino Dutro</SelectItem>
                      <SelectItem value="auto">Auto-assign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                placeholder="Any special handling instructions"
                rows={2}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="accessRequirements">Access Requirements</Label>
              <Textarea
                id="accessRequirements"
                value={formData.accessRequirements}
                onChange={(e) => handleInputChange("accessRequirements", e.target.value)}
                placeholder="Parking, elevator access, security clearance, etc."
                rows={2}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information"
                rows={3}
                className="rounded-lg"
              />
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
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-6"
            >
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
