
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
import { CalendarRange, Plus, Phone, Globe, MessageSquare, MapPin, Clock, DollarSign, User, AlertCircle, Zap, Repeat, Bell, TrendingUp, CheckCircle, Navigation, Smartphone } from "lucide-react";
import DynamicPricingEngine from "@/utils/dynamicPricingEngine";

interface Booking {
  id: string;
  customerName: string;
  customerType: "Individual" | "SME" | "Corporate" | "Government";
  contactPerson: string;
  phone: string;
  email: string;
  bookingChannel: "web" | "mobile" | "phone" | "whatsapp";
  serviceType: string;
  binSize: string;
  location: string;
  coordinates: { lat: number; lng: number };
  zone: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  priority: "normal" | "high" | "emergency";
  recurringBooking: boolean;
  recurringFrequency?: "weekly" | "bi-weekly" | "monthly";
  dynamicPricing: number;
  basePricing: number;
  priceFactors: {
    locationMultiplier: number;
    demandSurcharge: number;
    binSizeAdjustment: number;
    emergencyPremium: number;
  };
  notes: string;
  customerPreferences: {
    preferredTimeSlots: string[];
    communicationMethod: "sms" | "email" | "whatsapp";
    specialInstructions: string;
  };
  automatedSuggestions: string[];
  confirmationSent: boolean;
  trackingId: string;
  estimatedDuration: number;
}

const BookingSystem: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BOOK001",
      customerName: "ABC Construction Sdn Bhd",
      customerType: "Corporate",
      contactPerson: "Ahmad Rahman",
      phone: "+60123456789",
      email: "ahmad@abc-construction.com",
      bookingChannel: "web",
      serviceType: "Construction Debris Removal",
      binSize: "6ft(H) × 24ft(L) × 8ft(W)",
      location: "Jalan Ampang, Kuala Lumpur",
      coordinates: { lat: 3.1569, lng: 101.7123 },
      zone: "Central KL",
      scheduledDate: "2024-06-15",
      scheduledTime: "09:00",
      status: "confirmed",
      priority: "normal",
      recurringBooking: false,
      dynamicPricing: 850,
      basePricing: 750,
      priceFactors: {
        locationMultiplier: 1.1,
        demandSurcharge: 50,
        binSizeAdjustment: 1.0,
        emergencyPremium: 0
      },
      notes: "Access via back lane, contact security first",
      customerPreferences: {
        preferredTimeSlots: ["09:00-12:00"],
        communicationMethod: "email",
        specialInstructions: "Call before arrival"
      },
      automatedSuggestions: ["Schedule regular monthly pickup", "Consider larger bin size"],
      confirmationSent: true,
      trackingId: "TRK-BOOK001-240615",
      estimatedDuration: 2
    },
    {
      id: "BOOK002",
      customerName: "Sarah Lim",
      customerType: "Individual",
      contactPerson: "Sarah Lim",
      phone: "+60198765432",
      email: "sarah.lim@gmail.com",
      bookingChannel: "whatsapp",
      serviceType: "Household Items",
      binSize: "4ft(H) × 12ft(L) × 6ft(W)",
      location: "Taman Desa, Kuala Lumpur",
      coordinates: { lat: 3.0833, lng: 101.6833 },
      zone: "South KL",
      scheduledDate: "2024-06-16",
      scheduledTime: "14:00",
      status: "pending",
      priority: "emergency",
      recurringBooking: true,
      recurringFrequency: "monthly",
      dynamicPricing: 420,
      basePricing: 280,
      priceFactors: {
        locationMultiplier: 1.0,
        demandSurcharge: 40,
        binS izeAdjustment: 0.9,
        emergencyPremium: 100
      },
      notes: "Recurring monthly booking, preferred afternoon slots",
      customerPreferences: {
        preferredTimeSlots: ["14:00-17:00", "17:00-19:00"],
        communicationMethod: "whatsapp",
        specialInstructions: "Weekend pickups preferred"
      },
      automatedSuggestions: ["Book next month's pickup", "Emergency service upgrade available"],
      confirmationSent: false,
      trackingId: "TRK-BOOK002-240616",
      estimatedDuration: 1.5
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Zone-based pricing and availability
  const zones = [
    { id: "central-kl", name: "Central KL", multiplier: 1.2, demandLevel: "high" },
    { id: "north-kl", name: "North KL", multiplier: 1.0, demandLevel: "medium" },
    { id: "south-kl", name: "South KL", multiplier: 1.0, demandLevel: "medium" },
    { id: "east-kl", name: "East KL", multiplier: 0.9, demandLevel: "low" },
    { id: "west-kl", name: "West KL", multiplier: 0.9, demandLevel: "low" },
    { id: "pj", name: "Petaling Jaya", multiplier: 1.1, demandLevel: "high" },
    { id: "shah-alam", name: "Shah Alam", multiplier: 0.95, demandLevel: "medium" }
  ];

  const binSizeOptions = [
    { id: "2x12x6", name: "2ft(H) × 12ft(L) × 6ft(W)", basePrice: 200, multiplier: 0.8 },
    { id: "4x12x6", name: "4ft(H) × 12ft(L) × 6ft(W)", basePrice: 280, multiplier: 1.0 },
    { id: "4x14x6", name: "4ft(H) × 14ft(L) × 6ft(W)", basePrice: 320, multiplier: 1.1 },
    { id: "5x12x6", name: "5ft(H) × 12ft(L) × 6ft(W)", basePrice: 350, multiplier: 1.2 },
    { id: "6x24x8", name: "6ft(H) × 24ft(L) × 8ft(W)", basePrice: 750, multiplier: 2.0 },
    { id: "6.5x14.5x6", name: "6.5ft(H) × 14.5ft(L) × 6ft(W)", basePrice: 450, multiplier: 1.4 }
  ];

  const calculateDynamicPrice = (
    baseBinPrice: number,
    zoneMultiplier: number,
    priority: string,
    timeSlot: string,
    isRecurring: boolean
  ) => {
    let totalPrice = baseBinPrice * zoneMultiplier;
    
    // Time-based pricing
    const isPeakHour = ["09:00", "17:00", "18:00"].includes(timeSlot);
    if (isPeakHour) totalPrice *= 1.2;
    
    // Priority pricing
    if (priority === "emergency") totalPrice += 150;
    else if (priority === "high") totalPrice += 50;
    
    // Recurring discount
    if (isRecurring) totalPrice *= 0.9;
    
    // Current demand simulation
    const currentDemand = Math.random() * 0.3 + 0.9; // 0.9-1.2 multiplier
    totalPrice *= currentDemand;
    
    return Math.round(totalPrice);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "emergency":
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Emergency
        </Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High Priority</Badge>;
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
      case "mobile":
        return <Smartphone className="h-4 w-4 text-purple-500" />;
      case "phone":
        return <Phone className="h-4 w-4 text-green-500" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const sendBookingConfirmation = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, confirmationSent: true } : b
      ));
      // Simulate SMS/Email/WhatsApp sending
      console.log(`Confirmation sent via ${booking.customerPreferences.communicationMethod} to ${booking.customerName}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-blue-600" />
            Phase 7: Advanced Multi-Channel Booking System
          </h2>
          <p className="text-gray-600 mt-1">Multi-channel integration with dynamic pricing, zone optimization, and automated customer management</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showZoneModal} onOpenChange={setShowZoneModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Zone Management
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Geographic Zone Management & Optimization</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {zones.map((zone) => (
                    <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{zone.name}</h3>
                          <Badge className={`${getDemandLevelColor(zone.demandLevel)} bg-opacity-10`}>
                            {zone.demandLevel} demand
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Price Multiplier:</span>
                            <span className="font-medium">×{zone.multiplier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Bookings:</span>
                            <span className="font-medium">
                              {bookings.filter(b => b.zone === zone.name).length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg. Response Time:</span>
                            <span className="font-medium">45 mins</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-600">
                            Optimization suggestions:
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            • Schedule 3 more pickups for efficiency
                            • Peak hours: 9AM-11AM, 2PM-4PM
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Dynamic Pricing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Real-Time Dynamic Pricing Engine</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Current Pricing Factors</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between p-2 bg-blue-50 rounded">
                        <span>Base Pricing</span>
                        <span>RM 280 - RM 750</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span>Location Multiplier</span>
                        <span>0.9x - 1.2x</span>
                      </div>
                      <div className="flex justify-between p-2 bg-orange-50 rounded">
                        <span>Peak Hour Surcharge</span>
                        <span>+20%</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span>Emergency Premium</span>
                        <span>+RM 150</span>
                      </div>
                      <div className="flex justify-between p-2 bg-purple-50 rounded">
                        <span>Recurring Discount</span>
                        <span>-10%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Market Demand Analytics</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Current Hour Demand</span>
                          <Badge className="bg-orange-100 text-orange-800">High</Badge>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">87%</div>
                        <div className="text-xs text-gray-600">15% above average</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Weekend Premium</span>
                          <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">+25%</div>
                        <div className="text-xs text-gray-600">Sat-Sun surcharge</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Seasonal Adjustment</span>
                          <Badge className="bg-green-100 text-green-800">Normal</Badge>
                        </div>
                        <div className="text-2xl font-bold text-green-600">+0%</div>
                        <div className="text-xs text-gray-600">No adjustment</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">AI-Powered Price Recommendations</h4>
                  <div className="text-sm space-y-1">
                    <div>• Increase Central KL rates by 5% due to high demand</div>
                    <div>• Offer 15% discount for off-peak bookings (11PM-6AM)</div>
                    <div>• Bundle pricing for multiple bin sizes (+30% efficiency)</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Multi-Channel Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Advanced Booking</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Booking Channel</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="How did they book?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Website Portal</SelectItem>
                        <SelectItem value="mobile">Mobile App</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="SME">SME</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
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
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="customer@example.com" />
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
                        <SelectItem value="renovation">Renovation Waste</SelectItem>
                        <SelectItem value="office">Office Cleanout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bin Size with Dynamic Pricing</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bin size" />
                      </SelectTrigger>
                      <SelectContent>
                        {binSizeOptions.map((bin) => (
                          <SelectItem key={bin.id} value={bin.id}>
                            {bin.name} - Base: RM {bin.basePrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Collection Address & Zone</Label>
                    <Textarea placeholder="Complete address with landmarks" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name} (×{zone.multiplier} pricing)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label>Preferred Time Slot</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00 AM (Peak +20%)</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">02:00 PM</SelectItem>
                        <SelectItem value="16:00">04:00 PM</SelectItem>
                        <SelectItem value="17:00">05:00 PM (Peak +20%)</SelectItem>
                        <SelectItem value="19:00">07:00 PM</SelectItem>
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
                        <SelectItem value="high">High (+RM 50)</SelectItem>
                        <SelectItem value="emergency">Emergency (+RM 150)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Recurring Booking</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="One-time or recurring?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time booking</SelectItem>
                          <SelectItem value="weekly">Weekly (-10% discount)</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly (-10% discount)</SelectItem>
                          <SelectItem value="monthly">Monthly (-10% discount)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Communication Preference</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="How to send updates?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sms">SMS Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Preferences & Special Instructions</Label>
                    <Textarea placeholder="Preferred time slots, access instructions, special requirements..." />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Dynamic Price Preview</h4>
                    <div className="text-sm space-y-1">
                      <div>Base Rate: RM 280</div>
                      <div>Zone Multiplier (Central KL): +20%</div>
                      <div>Peak Hour Surcharge: +20%</div>
                      <div>High Priority: +RM 50</div>
                      <div>Recurring Discount: -10%</div>
                      <div className="font-bold border-t pt-1 text-lg">Final Price: RM 388</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={() => setShowAddModal(false)}>Create Booking</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <Zap className="h-5 w-5 text-red-600" />
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
              <Repeat className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Recurring</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.recurringBooking).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.bookingChannel === 'whatsapp').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue (RM)</p>
                <p className="text-2xl font-bold">{bookings.reduce((sum, b) => sum + b.dynamicPricing, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.confirmationSent).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Booking List */}
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
                      {booking.recurringBooking && (
                        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {booking.recurringFrequency}
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{booking.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(booking.priority)}
                  {getStatusBadge(booking.status)}
                  {!booking.confirmationSent && (
                    <Badge className="bg-orange-100 text-orange-800">
                      Confirmation Pending
                    </Badge>
                  )}
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
                  <p className="text-sm text-gray-500">Location & Zone</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.location.split(',')[0]}
                  </p>
                  <p className="text-sm text-gray-600">Zone: {booking.zone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarRange className="h-3 w-3" />
                    {booking.scheduledDate}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.scheduledTime} ({booking.estimatedDuration}h est.)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dynamic Pricing</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-600">RM {booking.dynamicPricing}</span>
                    {booking.dynamicPricing > booking.basePricing && (
                      <span className="text-xs text-gray-500 line-through">RM {booking.basePricing}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Track: {booking.trackingId}</p>
                </div>
              </div>

              {/* Automated Suggestions */}
              {booking.automatedSuggestions.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">AI Suggestions:</h4>
                  <ul className="text-sm space-y-1">
                    {booking.automatedSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customer Preferences */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Customer Preferences:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Preferred Times:</span>
                    <span className="ml-2">{booking.customerPreferences.preferredTimeSlots.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Communication:</span>
                    <span className="ml-2 capitalize">{booking.customerPreferences.communicationMethod}</span>
                  </div>
                </div>
                {booking.customerPreferences.specialInstructions && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Instructions:</span>
                    <span className="ml-2">{booking.customerPreferences.specialInstructions}</span>
                  </div>
                )}
              </div>
              
              {booking.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{booking.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Call Customer
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  WhatsApp
                </Button>
                <Button size="sm" variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  Route Planning
                </Button>
                {!booking.confirmationSent && (
                  <Button 
                    size="sm" 
                    onClick={() => sendBookingConfirmation(booking.id)}
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    Send Confirmation
                  </Button>
                )}
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
