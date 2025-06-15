
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
import { Plus, Package, Calendar as CalendarIcon, MapPin, User, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const AddOrderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [formData, setFormData] = useState({
    customer: "",
    customerPhone: "",
    binType: "",
    pickupAddress: "",
    deliveryAddress: "",
    amount: "",
    driver: "",
    priority: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customer || !formData.binType || !formData.pickupAddress || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(`Order for ${formData.customer} created successfully!`);
      setIsOpen(false);
      setFormData({
        customer: "",
        customerPhone: "",
        binType: "",
        pickupAddress: "",
        deliveryAddress: "",
        amount: "",
        driver: "",
        priority: "",
        notes: ""
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Create a new waste collection order for your customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h3>
              
              <div>
                <Label htmlFor="customer">Customer Name *</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => handleInputChange("customer", e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="+60 12-345 6789"
                />
              </div>

              <div>
                <Label htmlFor="driver">Assign Driver</Label>
                <Select onValueChange={(value) => handleInputChange("driver", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmad">Ahmad Rahman</SelectItem>
                    <SelectItem value="lim">Lim Wei Ming</SelectItem>
                    <SelectItem value="raj">Raj Kumar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Service Details
              </h3>

              <div>
                <Label htmlFor="binType">Bin Type *</Label>
                <Select onValueChange={(value) => handleInputChange("binType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction Waste</SelectItem>
                    <SelectItem value="mixed">Mixed Waste</SelectItem>
                    <SelectItem value="recyclable">Recyclable</SelectItem>
                    <SelectItem value="commercial">Commercial Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (RM) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Textarea
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                placeholder="Enter pickup address"
                rows={3}
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
                rows={3}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special instructions or notes"
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
