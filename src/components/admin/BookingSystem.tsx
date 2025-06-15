
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarRange, Plus, Phone, Globe, MessageSquare, MapPin, Clock, DollarSign, User, AlertCircle } from "lucide-react";

const BookingSystem: React.FC = () => {
  const [bookings, setBookings] = useState([
    {
      id: "BOOK001",
      customerName: "ABC Construction Sdn Bhd",
      customerType: "Corporate",
      contactPerson: "Ahmad Rahman",
      phone: "+60123456789",
      bookingChannel: "web",
      serviceType: "Construction Debris Removal",
      binSize: "6ft(H) × 24ft(L) × 8ft(W)",
      location: "Jalan Ampang, Kuala Lumpur",
      scheduledDate: "2024-03-15",
      scheduledTime: "09:00",
      status: "confirmed",
      priority: "normal",
      recurringBooking: false,
      dynamicPricing: 850,
      basePricing: 750,
      notes: "Access via back lane, contact security first"
    },
    {
      id: "BOOK002",
      customerName: "Sarah Lim",
      customerType: "Individual",
      contactPerson: "Sarah Lim",
      phone: "+60198765432",
      bookingChannel: "whatsapp",
      serviceType: "Household Items",
      binSize: "4ft(H) × 12ft(L) × 6ft(W)",
      location: "Taman Desa, Kuala Lumpur",
      scheduledDate: "2024-03-16",
      scheduledTime: "14:00",
      status: "pending",
      priority: "emergency",
      recurringBooking: true,
      dynamicPricing: 320,
      basePricing: 280,
      notes: "Recurring monthly booking, preferred afternoon slots"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "normal":
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "web":
        return <Globe className="h-4 w-4 text-blue-500" />;
      case "phone":
        return <Phone className="h-4 w-4 text-green-500" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-blue-600" />
            Advanced Booking System
          </h2>
          <p className="text-gray-600 mt-1">Multi-channel bookings with geographic scheduling and dynamic pricing</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input placeholder="Company/Individual name" />
                </div>
                <div className="space-y-2">
                  <Label>Customer Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="sme">SME</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input placeholder="Contact person name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+60123456789" />
                </div>
                <div className="space-y-2">
                  <Label>Booking Channel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Website</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="mobile">Mobile App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction Debris</SelectItem>
                      <SelectItem value="household">Household Items</SelectItem>
                      <SelectItem value="industrial">Industrial Waste</SelectItem>
                      <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bin Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bin size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2x12x6">2ft(H) × 12ft(L) × 6ft(W)</SelectItem>
                      <SelectItem value="4x12x6">4ft(H) × 12ft(L) × 6ft(W)</SelectItem>
                      <SelectItem value="4x14x6">4ft(H) × 14ft(L) × 6ft(W)</SelectItem>
                      <SelectItem value="5x12x6">5ft(H) × 12ft(L) × 6ft(W)</SelectItem>
                      <SelectItem value="6x24x8">6ft(H) × 24ft(L) × 8ft(W)</SelectItem>
                      <SelectItem value="6.5x14.5x6">6.5ft(H) × 14.5ft(L) × 6ft(W)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Collection Address</Label>
                  <Textarea placeholder="Complete address with landmarks" />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="emergency">Emergency (+50% charge)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label>Special Notes</Label>
                <Textarea placeholder="Access instructions, special requirements, customer preferences..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={() => setShowAddModal(false)}>Create Booking</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmed Today</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Emergency</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.priority === 'emergency').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue (RM)</p>
                <p className="text-2xl font-bold">{bookings.reduce((sum, b) => sum + b.dynamicPricing, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getChannelIcon(booking.bookingChannel)}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {booking.customerName}
                      <Badge variant="outline" className="text-xs">
                        {booking.customerType}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{booking.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(booking.priority)}
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service & Bin Size</p>
                  <p className="font-medium">{booking.serviceType}</p>
                  <p className="text-sm text-gray-600">{booking.binSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.location.split(',')[0]}
                  </p>
                  <p className="text-sm text-gray-600">{booking.location.split(',').slice(1).join(',')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarRange className="h-3 w-3" />
                    {booking.scheduledDate}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.scheduledTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pricing</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-600">RM {booking.dynamicPricing}</span>
                    {booking.dynamicPricing > booking.basePricing && (
                      <span className="text-xs text-gray-500 line-through">RM {booking.basePricing}</span>
                    )}
                  </div>
                  {booking.recurringBooking && (
                    <Badge variant="outline" className="text-xs">Recurring</Badge>
                  )}
                </div>
              </div>
              
              {booking.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{booking.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  View Map
                </Button>
                <Button size="sm" variant="outline">
                  Edit Booking
                </Button>
                <Button size="sm">
                  Assign Driver
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingSystem;
