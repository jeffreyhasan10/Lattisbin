import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle, XCircle, MapPin, User, Phone, FileText, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Booking {
  id: number;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  binType: string;
  binSerial: string;
  bookingDate: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const DUMMY_BOOKINGS: Booking[] = [
  {
    id: 1,
    customerName: "ABC Construction",
    customerPhone: "03-12345678",
    pickupAddress: "Jalan Ampang, KL",
    deliveryAddress: "Jalan Tun Razak, KL",
    binType: "ASR100",
    binSerial: "ASR100-001",
    bookingDate: new Date(),
    status: "pending",
  },
  {
    id: 2,
    customerName: "XYZ Corporation",
    customerPhone: "03-98765432",
    pickupAddress: "Persiaran KLCC, KL",
    deliveryAddress: "Bukit Bintang, KL",
    binType: "LASR100",
    binSerial: "LASR100-002",
    bookingDate: new Date(),
    status: "confirmed",
  },
  {
    id: 3,
    customerName: "PQR Industries",
    customerPhone: "03-55555555",
    pickupAddress: "Jalan Kuching, KL",
    deliveryAddress: "Mont Kiara, KL",
    binType: "PWD100",
    binSerial: "PWD100-003",
    bookingDate: new Date(),
    status: "completed",
  },
];

const BookingOrders = () => {
  const [bookings, setBookings] = useState<Booking[]>(DUMMY_BOOKINGS);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const openModal = (booking?: any) => {
    setSelectedBooking(booking || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSave = (newBooking: any) => {
    if (selectedBooking) {
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...selectedBooking, ...newBooking } : b));
    } else {
      const id = Math.max(...bookings.map(b => b.id)) + 1;
      setBookings(prev => [...prev, { id, ...newBooking }]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 mr-1" />;
      case "confirmed": return <CheckCircle className="h-4 w-4 mr-1" />;
      case "completed": return <CheckCircle className="h-4 w-4 mr-1" />;
      case "cancelled": return <XCircle className="h-4 w-4 mr-1" />;
      default: return <FileText className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Booking Orders</h2>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </div>

      <ScrollArea className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="[&_th]:px-4 [&_tr]:border-b">
            <tr>
              <th className="h-12 font-medium text-left">Customer</th>
              <th className="h-12 font-medium text-left">Phone</th>
              <th className="h-12 font-medium text-left">Pickup Address</th>
              <th className="h-12 font-medium text-left">Delivery Address</th>
              <th className="h-12 font-medium text-left">Bin Details</th>
              <th className="h-12 font-medium text-left">Booking Date</th>
              <th className="h-12 font-medium text-left">Status</th>
              <th className="h-12 font-medium"></th>
            </tr>
          </thead>
          <tbody className="[&_td]:p-4 [&_tr]:border-b last:border-none">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <div className="font-medium">{booking.customerName}</div>
                </td>
                <td>{booking.customerPhone}</td>
                <td>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {booking.pickupAddress}
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {booking.deliveryAddress}
                  </div>
                </td>
                <td>
                  {booking.binType} ({booking.binSerial})
                </td>
                <td>{booking.bookingDate.toLocaleDateString()}</td>
                <td>
                  <Badge className={getStatusColor(booking.status)}>
                    <div className="flex items-center">
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(booking)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the booking.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(booking.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      
      {modalOpen && (
        <BookingModal 
          booking={selectedBooking}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSave: (booking: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ booking, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState(booking?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(booking?.customerPhone || "");
  const [pickupAddress, setPickupAddress] = useState(booking?.pickupAddress || "");
  const [deliveryAddress, setDeliveryAddress] = useState(booking?.deliveryAddress || "");
  const [binType, setBinType] = useState(booking?.binType || "");
  const [binSerial, setBinSerial] = useState(booking?.binSerial || "");
  const [date, setDate] = useState<Date | undefined>(booking?.bookingDate || undefined);
  const [status, setStatus] = useState(booking?.status || "pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      customerName,
      customerPhone,
      pickupAddress,
      deliveryAddress,
      binType,
      binSerial,
      bookingDate: date,
      status,
    };
    onSave(newBooking);
    toast.success(`Booking ${booking ? 'updated' : 'created'} successfully!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">{booking ? "Edit Booking" : "Add Booking"}</h2>
        <Separator />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input
              id="customerPhone"
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="pickupAddress">Pickup Address</Label>
            <Input
              id="pickupAddress"
              type="text"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Input
              id="deliveryAddress"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="binType">Bin Type</Label>
            <Input
              id="binType"
              type="text"
              value={binType}
              onChange={(e) => setBinType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="binSerial">Bin Serial</Label>
            <Input
              id="binSerial"
              type="text"
              value={binSerial}
              onChange={(e) => setBinSerial(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Booking Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "confirmed" | "completed" | "cancelled")}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{booking ? "Update Booking" : "Create Booking"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingOrders;
