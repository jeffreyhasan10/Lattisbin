
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Truck, Plus, Calendar as CalendarIcon, MapPin, User, 
  Phone, Clock, CheckCircle, XCircle, AlertCircle, Eye,
  Edit, Trash2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface DriveBooking {
  id: string;
  bookingId: string;
  driverId: string;
  driverName: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  vehicleType: string;
  estimatedDuration: string;
  priority: "low" | "medium" | "high" | "urgent";
  notes: string;
}

const DriveBookingManagement = () => {
  const [bookings, setBookings] = useState<DriveBooking[]>([
    {
      id: "DB001",
      bookingId: "BK001",
      driverId: "DRV001",
      driverName: "Ahmad Rahman",
      customerName: "ABC Construction",
      pickupAddress: "Jalan Ampang, KL",
      deliveryAddress: "Jalan Tun Razak, KL",
      scheduledDate: new Date(),
      scheduledTime: "morning",
      status: "confirmed",
      vehicleType: "Lorry",
      estimatedDuration: "2 hours",
      priority: "high",
      notes: "Construction waste pickup"
    },
    {
      id: "DB002",
      bookingId: "BK002",
      driverId: "DRV002",
      driverName: "Lim Wei Ming",
      customerName: "XYZ Corporation",
      pickupAddress: "Persiaran KLCC, KL",
      deliveryAddress: "Bukit Bintang, KL",
      scheduledDate: new Date(),
      scheduledTime: "afternoon",
      status: "in-progress",
      vehicleType: "Truck",
      estimatedDuration: "1.5 hours",
      priority: "medium",
      notes: "Regular waste collection"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<DriveBooking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [newBooking, setNewBooking] = useState({
    bookingId: "",
    driverId: "",
    customerName: "",
    pickupAddress: "",
    deliveryAddress: "",
    scheduledDate: undefined as Date | undefined,
    scheduledTime: "",
    vehicleType: "",
    estimatedDuration: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    notes: ""
  });

  const availableDrivers = [
    { id: "DRV001", name: "Ahmad Rahman", vehicle: "WBM 1234 - Isuzu NKR" },
    { id: "DRV002", name: "Lim Wei Ming", vehicle: "WBM 5678 - Mitsubishi Canter" },
    { id: "DRV003", name: "Raj Kumar", vehicle: "WBM 9012 - Hino Dutro" }
  ];

  const handleCreateBooking = () => {
    if (!newBooking.customerName || !newBooking.driverId || !newBooking.pickupAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bookingId = `DB${String(bookings.length + 1).padStart(3, '0')}`;
    const selectedDriver = availableDrivers.find(d => d.id === newBooking.driverId);
    
    const booking: DriveBooking = {
      id: bookingId,
      bookingId: newBooking.bookingId || `BK${String(bookings.length + 1).padStart(3, '0')}`,
      driverId: newBooking.driverId,
      driverName: selectedDriver?.name || "",
      customerName: newBooking.customerName,
      pickupAddress: newBooking.pickupAddress,
      deliveryAddress: newBooking.deliveryAddress,
      scheduledDate: newBooking.scheduledDate || new Date(),
      scheduledTime: newBooking.scheduledTime,
      status: "pending",
      vehicleType: newBooking.vehicleType,
      estimatedDuration: newBooking.estimatedDuration,
      priority: newBooking.priority,
      notes: newBooking.notes
    };

    setBookings([...bookings, booking]);
    setNewBooking({
      bookingId: "", driverId: "", customerName: "", pickupAddress: "", 
      deliveryAddress: "", scheduledDate: undefined, scheduledTime: "", 
      vehicleType: "", estimatedDuration: "", priority: "medium", notes: ""
    });
    setIsCreateModalOpen(false);
    toast.success(`Drive booking ${bookingId} created successfully!`);
  };

  const handleStatusChange = (bookingId: string, newStatus: DriveBooking['status']) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter(booking => booking.id !== bookingId));
    toast.success("Booking deleted successfully");
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress": return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <AlertCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drive Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage driver assignments and booking schedules</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg rounded-xl px-6 py-3">
              <Plus className="h-5 w-5 mr-2" />
              Create Drive Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                <Truck className="h-6 w-6 text-blue-600" />
                Create Drive Booking
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking Reference</Label>
                <Input
                  id="bookingId"
                  value={newBooking.bookingId}
                  onChange={(e) => setNewBooking({...newBooking, bookingId: e.target.value})}
                  placeholder="BK001 (auto-generated if empty)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">Assign Driver *</Label>
                <Select onValueChange={(value) => setNewBooking({...newBooking, driverId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name *</Label>
                <Input
                  id="customer"
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({...newBooking, customerName: e.target.value})}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => setNewBooking({...newBooking, vehicleType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Lorry">Lorry</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="pickup">Pickup Address *</Label>
                <Input
                  id="pickup"
                  value={newBooking.pickupAddress}
                  onChange={(e) => setNewBooking({...newBooking, pickupAddress: e.target.value})}
                  placeholder="Pickup address"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="delivery">Delivery Address</Label>
                <Input
                  id="delivery"
                  value={newBooking.deliveryAddress}
                  onChange={(e) => setNewBooking({...newBooking, deliveryAddress: e.target.value})}
                  placeholder="Delivery address"
                />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newBooking.scheduledDate ? format(newBooking.scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newBooking.scheduledDate}
                      onSelect={(date) => setNewBooking({...newBooking, scheduledDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select onValueChange={(value) => setNewBooking({...newBooking, scheduledTime: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                    <SelectItem value="evening">Evening (6PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  value={newBooking.estimatedDuration}
                  onChange={(e) => setNewBooking({...newBooking, estimatedDuration: e.target.value})}
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => setNewBooking({...newBooking, priority: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBooking}>
                Create Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Bookings", value: bookings.length, color: "from-blue-500 to-cyan-500" },
          { label: "Active Today", value: bookings.filter(b => b.status === "in-progress").length, color: "from-green-500 to-emerald-500" },
          { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "from-purple-500 to-violet-500" },
          { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "from-orange-500 to-red-500" }
        ].map((stat, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
            <CardContent className="p-6">
              <div className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 text-white mb-4`}>
                <div className="text-3xl font-bold">{stat.value}</div>
              </div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search by customer, driver, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-white/80 backdrop-blur-sm border-white/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle>Drive Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Info</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.id}</p>
                        <p className="text-sm text-gray-500">{booking.bookingId}</p>
                        <p className="text-xs text-gray-400">{booking.vehicleType}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{booking.driverName}</p>
                          <p className="text-sm text-gray-500">{booking.driverId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{booking.customerName}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{format(booking.scheduledDate, "MMM dd, yyyy")}</p>
                        <p className="text-xs text-gray-500 capitalize">{booking.scheduledTime}</p>
                        <p className="text-xs text-gray-400">{booking.estimatedDuration}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-green-500" />
                          <span className="truncate max-w-32">{booking.pickupAddress}</span>
                        </div>
                        {booking.deliveryAddress && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-red-500" />
                            <span className="truncate max-w-32">{booking.deliveryAddress}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(booking.priority)} capitalize`}>
                        {booking.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value as any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* View Booking Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Driver</Label>
                    <p className="text-sm">{selectedBooking.driverName} ({selectedBooking.driverId})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Customer</Label>
                    <p className="text-sm">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Vehicle Type</Label>
                    <p className="text-sm">{selectedBooking.vehicleType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <Badge className={`${getPriorityColor(selectedBooking.priority)} capitalize`}>
                      {selectedBooking.priority}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Scheduled Date</Label>
                    <p className="text-sm">{format(selectedBooking.scheduledDate, "PPP")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Preferred Time</Label>
                    <p className="text-sm capitalize">{selectedBooking.scheduledTime}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Estimated Duration</Label>
                    <p className="text-sm">{selectedBooking.estimatedDuration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedBooking.status)}
                      <Badge className={`${getStatusColor(selectedBooking.status)} capitalize`}>
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Pickup Address</Label>
                  <p className="text-sm">{selectedBooking.pickupAddress}</p>
                </div>
                {selectedBooking.deliveryAddress && (
                  <div>
                    <Label className="text-sm font-medium">Delivery Address</Label>
                    <p className="text-sm">{selectedBooking.deliveryAddress}</p>
                  </div>
                )}
                {selectedBooking.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriveBookingManagement;
