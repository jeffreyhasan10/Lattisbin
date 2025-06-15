
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useOrders } from "@/contexts/OrderContext";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ isOpen, onClose }) => {
  const { addOrder } = useOrders();
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    deliveryAddress: "",
    binType: "Recycling" as "Recycling" | "Waste" | "Compost",
    scheduledDate: "",
    time: "",
    priority: "medium" as "low" | "medium" | "high",
    price: 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder = {
      customerName: formData.customerName,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      status: "pending" as const,
      binType: formData.binType,
      scheduledDate: formData.scheduledDate,
      price: formData.price,
      driverName: "",
      estimatedDuration: 60,
      priority: formData.priority,
      customer: formData.customerName,
      customerPhone: formData.customerPhone,
      location: formData.pickupAddress,
      date: formData.scheduledDate,
      time: formData.time,
      wasteType: formData.binType,
      lorryType: "Small",
      assignedDriverName: "",
      assignedDriverId: "",
      assignedDate: "",
      paymentStatus: "pending" as const,
      amount: formData.price,
    };

    addOrder(newOrder);
    onClose();
    
    // Reset form
    setFormData({
      customerName: "",
      customerPhone: "",
      pickupAddress: "",
      deliveryAddress: "",
      binType: "Recycling",
      scheduledDate: "",
      time: "",
      priority: "medium",
      price: 50,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Pickup Address</Label>
            <Textarea
              id="pickupAddress"
              value={formData.pickupAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Textarea
              id="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="binType">Bin Type</Label>
              <Select value={formData.binType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, binType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recycling">Recycling</SelectItem>
                  <SelectItem value="Waste">Waste</SelectItem>
                  <SelectItem value="Compost">Compost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
