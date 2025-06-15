import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

const AddOrderModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addOrder, drivers } = useOrders();
  
  const [formData, setFormData] = useState({
    customer: "",
    customerPhone: "",
    location: "",
    pickupLocation: "",
    time: "",
    date: "",
    amount: "",
    priority: "medium" as "high" | "medium" | "low",
    wasteType: "",
    lorryType: "",
    distance: "",
    estimatedDuration: "",
    notes: "",
    paymentStatus: "pending" as "pending" | "paid" | "overdue"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer || !formData.customerPhone || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newOrder = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      status: 'pending' as const,
      nearestBin: {
        name: "Central Collection Point",
        distance: "2.5 km",
        location: "Industrial Area",
        capacity: "75%",
        type: "General Waste"
      }
    };

    addOrder(newOrder);
    toast.success("Order created successfully!");
    
    // Reset form
    setFormData({
      customer: "",
      customerPhone: "",
      location: "",
      pickupLocation: "",
      time: "",
      date: "",
      amount: "",
      priority: "medium",
      wasteType: "",
      lorryType: "",
      distance: "",
      estimatedDuration: "",
      notes: "",
      paymentStatus: "pending"
    });
    
    setOpen(false);
  };

  const availableDrivers = drivers.filter(driver => driver.status === 'active');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="customerPhone">Customer Phone *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                placeholder="+60123456789"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Service Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter service location"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                placeholder="Specific pickup point"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Service Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="time">Service Time</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                placeholder="e.g., 09:30 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wasteType">Waste Type</Label>
              <Select onValueChange={(value) => handleInputChange("wasteType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Construction Debris">Construction Debris</SelectItem>
                  <SelectItem value="Household Waste">Household Waste</SelectItem>
                  <SelectItem value="Commercial Waste">Commercial Waste</SelectItem>
                  <SelectItem value="Recyclable Materials">Recyclable Materials</SelectItem>
                  <SelectItem value="Hazardous Waste">Hazardous Waste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="lorryType">Lorry Type</Label>
              <Select onValueChange={(value) => handleInputChange("lorryType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lorry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 Ton Truck">3 Ton Truck</SelectItem>
                  <SelectItem value="5 Ton Lorry">5 Ton Lorry</SelectItem>
                  <SelectItem value="7 Ton Lorry">7 Ton Lorry</SelectItem>
                  <SelectItem value="10 Ton Lorry">10 Ton Lorry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount (RM)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                value={formData.distance}
                onChange={(e) => handleInputChange("distance", e.target.value)}
                placeholder="e.g., 12.5 km"
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedDuration">Est. Duration</Label>
              <Input
                id="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                placeholder="e.g., 45 min"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select onValueChange={(value: "high" | "medium" | "low") => handleInputChange("priority", value)}>
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
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
