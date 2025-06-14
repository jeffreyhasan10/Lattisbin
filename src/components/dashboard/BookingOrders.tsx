import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Search, Plus, MapPin, Phone, Truck, Package2, Clock, CheckCircle, AlertTriangle, Eye, Edit, Trash2, Filter, Download, RotateCcw, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

const DUMMY_BOOKINGS = [
  {
    id: "BKG001",
    customerName: "ABC Construction",
    customerContact: "012-3456789",
    pickupAddress: "123, Jalan ABC, KL",
    deliveryAddress: "456, Jalan XYZ, PJ",
    binType: "Open Top",
    binSize: "10x10x5",
    pickupDate: "2024-03-15",
    deliveryDate: "2024-03-16",
    status: "pending",
    amount: 500,
  },
  {
    id: "BKG002",
    customerName: "XYZ Sdn Bhd",
    customerContact: "016-1234567",
    pickupAddress: "789, Lebuh WAU, Shah Alam",
    deliveryAddress: "012, Jalan Test, Subang",
    binType: "Roll-Off",
    binSize: "12x8x6",
    pickupDate: "2024-03-20",
    deliveryDate: "2024-03-21",
    status: "confirmed",
    amount: 750,
  },
  {
    id: "BKG003",
    customerName: "Test Corp",
    customerContact: "019-9876543",
    pickupAddress: "345, Lorong 1, Melawati",
    deliveryAddress: "678, Jalan 2, Ampang",
    binType: "Compactor",
    binSize: "8x6x4",
    pickupDate: "2024-03-25",
    deliveryDate: "2024-03-26",
    status: "completed",
    amount: 1000,
  },
];

const BookingOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    return DUMMY_BOOKINGS.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleOpenDeleteDialog = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleAddBooking = (newBooking) => {
    setBookings([...bookings, newBooking]);
    setIsAddDialogOpen(false);
    toast.success("Booking added successfully!");
  };

  const handleEditBooking = (editedBooking) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === editedBooking.id ? editedBooking : booking
      )
    );
    setIsEditDialogOpen(false);
    setSelectedBooking(null);
    toast.success("Booking edited successfully!");
  };

  const handleDeleteBooking = () => {
    if (selectedBooking) {
      setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id));
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
      toast.success("Booking deleted successfully!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="flex justify-between items-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Booking Orders</CardTitle>
        </CardHeader>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{booking.customerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="inline-block h-4 w-4 mr-1" />
                  {booking.pickupAddress}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="inline-block h-4 w-4 mr-1" />
                  {booking.pickupDate}
                </p>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEditDialog(booking)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDeleteDialog(booking)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Booking Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
          </DialogHeader>
          <AddEditBookingForm
            onClose={handleCloseAddDialog}
            onSave={handleAddBooking}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <AddEditBookingForm
            booking={selectedBooking}
            onClose={handleCloseEditDialog}
            onSave={handleEditBooking}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Booking Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Are you sure you want to delete this booking?</p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBooking}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AddEditBookingForm = ({ booking, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState(booking?.customerName || "");
  const [customerContact, setCustomerContact] = useState(booking?.customerContact || "");
  const [pickupAddress, setPickupAddress] = useState(booking?.pickupAddress || "");
  const [deliveryAddress, setDeliveryAddress] = useState(booking?.deliveryAddress || "");
  const [binType, setBinType] = useState(booking?.binType || "");
  const [binSize, setBinSize] = useState(booking?.binSize || "");
  const [pickupDate, setPickupDate] = useState(booking?.pickupDate || "");
  const [deliveryDate, setDeliveryDate] = useState(booking?.deliveryDate || "");
  const [status, setStatus] = useState(booking?.status || "pending");
  const [amount, setAmount] = useState(booking?.amount || "");

  const handleSubmit = () => {
    const newBooking = {
      id: booking?.id || Math.random().toString(36).substring(7),
      customerName,
      customerContact,
      pickupAddress,
      deliveryAddress,
      binType,
      binSize,
      pickupDate,
      deliveryDate,
      status,
      amount: parseFloat(amount),
    };
    onSave(newBooking);
    onClose();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerName" className="text-right">
          Customer Name
        </Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerContact" className="text-right">
          Customer Contact
        </Label>
        <Input
          id="customerContact"
          value={customerContact}
          onChange={(e) => setCustomerContact(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="pickupAddress" className="text-right">
          Pickup Address
        </Label>
        <Textarea
          id="pickupAddress"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deliveryAddress" className="text-right">
          Delivery Address
        </Label>
        <Textarea
          id="deliveryAddress"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="binType" className="text-right">
          Bin Type
        </Label>
        <Input
          id="binType"
          value={binType}
          onChange={(e) => setBinType(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="binSize" className="text-right">
          Bin Size
        </Label>
        <Input
          id="binSize"
          value={binSize}
          onChange={(e) => setBinSize(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="pickupDate" className="text-right">
          Pickup Date
        </Label>
        <Input
          id="pickupDate"
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deliveryDate" className="text-right">
          Delivery Date
        </Label>
        <Input
          id="deliveryDate"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  );
};

export default BookingOrders;
