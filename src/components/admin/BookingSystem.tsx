import React, { useState, useEffect } from "react";
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
import { useOrders } from "@/contexts/OrderContext";
import { useLocation, useNavigate } from "react-router-dom";

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
  status: "pending" | "in-progress" | "completed" | "cancelled" | "assigned";
  priority: "high" | "medium" | "low";
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
  // New fields for advanced booking/order management
  ownerManagerSupervisor?: string;
  introducer?: string;
  jobReference?: string;
  area?: string;
  state?: string;
  manualBookingByDriver?: {
    name: string;
    phone: string;
    binNumber: string;
    binSize: string;
    amount: number;
  };
  doNumber: string; // Delivery Order Number (mandatory)
  // New fields for driver assignment
  assignedDriverName?: string;
  assignedDriverId?: string;
  assignedDate?: string; // Date when driver was assigned
  lorryType?: string;
  paymentStatus?: "pending" | "paid" | "overdue";
}

const BookingSystem: React.FC = () => {
  const { addOrder, updateOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BOOK001",
      doNumber: "DO-0001",
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
      status: "assigned",
      priority: "medium",
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
      doNumber: "DO-0002",
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
      priority: "high",
      recurringBooking: true,
      recurringFrequency: "monthly",
      dynamicPricing: 420,
      basePricing: 280,
      priceFactors: {
        locationMultiplier: 1.0,
        demandSurcharge: 40,
        binSizeAdjustment: 0.9,
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

  // New state for Assign Driver Modal
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [assignDriverBookingId, setAssignDriverBookingId] = useState<string | null>(null);
  const [assignedDriverNameInput, setAssignedDriverNameInput] = useState("");
  const [assignedDriverIdInput, setAssignedDriverIdInput] = useState("");

  // Form state for booking fields
  const [customerName, setCustomerName] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookingChannel, setBookingChannel] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [binSize, setBinSize] = useState("");
  const [locationField, setLocationField] = useState("");
  const [zone, setZone] = useState("");
  const [scheduledDateField, setScheduledDateField] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [priority, setPriority] = useState("");
  const [recurringBooking, setRecurringBooking] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("");
  const [dynamicPricing, setDynamicPricing] = useState(0);
  const [basePricing, setBasePricing] = useState(0);
  const [notes, setNotes] = useState("");
  const [ownerManagerSupervisor, setOwnerManagerSupervisor] = useState("");
  const [introducer, setIntroducer] = useState("");
  const [jobReference, setJobReference] = useState("");
  const [area, setArea] = useState("");
  const [stateField, setStateField] = useState("");
  const [manualDriverName, setManualDriverName] = useState("");
  const [manualDriverPhone, setManualDriverPhone] = useState("");
  const [manualBinNumber, setManualBinNumber] = useState("");
  const [manualBinSize, setManualBinSize] = useState("");
  const [manualAmount, setManualAmount] = useState(0);
  const [doNumber, setDoNumber] = useState("");

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
    priority: "high" | "medium" | "low",
    timeSlot: string,
    isRecurring: boolean
  ) => {
    let totalPrice = baseBinPrice * zoneMultiplier;
    
    // Time-based pricing
    const isPeakHour = ["09:00", "17:00", "18:00"].includes(timeSlot);
    if (isPeakHour) totalPrice *= 1.2;
    
    // Priority pricing
    if (priority === "high") totalPrice += 150; // High priority
    else if (priority === "medium") totalPrice += 50;
    
    // Recurring discount
    if (isRecurring) totalPrice *= 0.9;
    
    // Current demand simulation
    const currentDemand = Math.random() * 0.3 + 0.9; // 0.9-1.2 multiplier
    totalPrice *= currentDemand;
    
    return Math.round(totalPrice);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-green-100 text-green-800">Assigned</Badge>;
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
      case "high":
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <Zap className="h-3 w-3" />
          High Priority
        </Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low Priority</Badge>;
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

  // Prefill logic
  useEffect(() => {
    if (location.state && showAddModal) {
      setCustomerName(location.state.customerName || "");
      setCustomerType(location.state.customerType || "");
      setContactPerson(location.state.contactPerson || "");
      setPhone(location.state.phone || "");
      setEmail(location.state.email || "");
      setBookingChannel(location.state.bookingChannel || "");
      setServiceType(location.state.serviceType || "");
      setBinSize(location.state.binSize || "");
      setLocationField(location.state.location || "");
      setZone(location.state.zone || "");
      setScheduledDateField(location.state.scheduledDate || "");
      setScheduledTime(location.state.scheduledTime || "");
      setPriority(location.state.priority || "");
      setRecurringBooking(location.state.recurringBooking || false);
      setRecurringFrequency(location.state.recurringFrequency || "");
      setDynamicPricing(location.state.dynamicPricing || 0);
      setBasePricing(location.state.basePricing || 0);
      setNotes(location.state.notes || "");
      setOwnerManagerSupervisor(location.state.ownerManagerSupervisor || "");
      setIntroducer(location.state.introducer || "");
      setJobReference(location.state.jobReference || "");
      setArea(location.state.area || "");
      setStateField(location.state.state || "");
      setManualDriverName(location.state.manualDriverName || "");
      setManualDriverPhone(location.state.manualDriverPhone || "");
      setManualBinNumber(location.state.manualBinNumber || "");
      setManualBinSize(location.state.manualBinSize || "");
      setManualAmount(location.state.manualAmount || 0);
      setDoNumber(location.state.doNumber || "");
    }
  }, [location.state, showAddModal]);

  // Add useEffect for dynamic pricing calculation
  useEffect(() => {
    // Find selected bin size object
    const selectedBin = binSizeOptions.find((bin) => bin.id === binSize);
    // Find selected zone object
    const selectedZone = zones.find((z) => z.id === zone);
    const baseBinPrice = selectedBin ? selectedBin.basePrice : 0;
    const zoneMultiplier = selectedZone ? selectedZone.multiplier : 1;
    // Determine if recurring
    const isRecurringBooking = recurringBooking;
    // Calculate price
    setBasePricing(baseBinPrice);
    setDynamicPricing(
      calculateDynamicPrice(
        baseBinPrice,
        zoneMultiplier,
        priority as "high" | "medium" | "low",
        scheduledTime,
        isRecurringBooking
      )
    );
  }, [binSize, zone, priority, scheduledTime, recurringBooking]);

  // Helper to map serviceType to binType for OrderContext
  const mapServiceTypeToBinType = (service: string): "Recycling" | "Waste" | "Compost" => {
    switch (service.toLowerCase()) {
      case "household items":
      case "office cleanout":
        return "Recycling"; 
      case "construction debris removal":
      case "industrial waste":
      case "renovation waste":
        return "Waste";
      case "hazardous materials":
        return "Waste"; 
      default:
        return "Waste"; // Default to Waste if type is unknown
    }
  };

  const handleCreateBooking = () => {
    if (!doNumber.trim()) {
      alert("DO Number is required!");
      return;
    }
    const order = {
      doNumber,
      customerName,
      pickupAddress: locationField,
      deliveryAddress: "",
      status: "pending" as "pending" | "in-progress" | "completed" | "cancelled" | "assigned",
      binType: mapServiceTypeToBinType(serviceType), 
      scheduledDate: scheduledDateField,
      price: dynamicPricing,
      driverName: "",
      estimatedDuration: 1,
      priority: priority as "high" | "medium" | "low",
      customer: customerName,
      customerPhone: phone,
      location: locationField,
      date: scheduledDateField,
      time: scheduledTime,
      wasteType: serviceType, 
      lorryType: "",
      assignedDriverName: "",
      assignedDriverId: "",
      assignedDate: "",
      paymentStatus: "pending" as "pending" | "paid" | "overdue",
      amount: dynamicPricing,
      ownerManagerSupervisor,
      introducer,
      jobReference,
      area,
      state: stateField,
      manualBookingByDriver: manualDriverName || manualDriverPhone || manualBinNumber || manualBinSize || manualAmount ? {
        name: manualDriverName,
        phone: manualDriverPhone,
        binNumber: manualBinNumber,
        binSize: manualBinSize,
        amount: manualAmount,
      } : undefined,
    };
    addOrder(order);
    setShowAddModal(false);
    navigate("/admin/orders");
  };

  const handleAssignDriver = () => {
    if (!assignDriverBookingId) return;

    // Find the current booking to get existing data
    const currentBooking = bookings.find(b => b.id === assignDriverBookingId);
    if (!currentBooking) return;

    // Update the local bookings state first
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === assignDriverBookingId
          ? {
              ...booking,
              assignedDriverName: assignedDriverNameInput,
              assignedDriverId: assignedDriverIdInput,
              assignedDate: new Date().toISOString().split('T')[0],
              status: "assigned" 
            }
          : booking
      )
    );

    // Prepare updated order for OrderContext
    const updatedOrderForContext = {
      doNumber: currentBooking.doNumber,
      customerName: currentBooking.customerName,
      pickupAddress: currentBooking.location,
      deliveryAddress: "",
      status: "assigned" as "pending" | "in-progress" | "completed" | "cancelled" | "assigned",
      binType: mapServiceTypeToBinType(currentBooking.serviceType), 
      scheduledDate: currentBooking.scheduledDate,
      price: currentBooking.dynamicPricing,
      driverName: assignedDriverNameInput, 
      estimatedDuration: currentBooking.estimatedDuration,
      priority: currentBooking.priority, 
      customer: currentBooking.customerName,
      customerPhone: currentBooking.phone,
      location: currentBooking.location,
      date: currentBooking.scheduledDate,
      time: currentBooking.scheduledTime,
      wasteType: currentBooking.serviceType, 
      lorryType: currentBooking.lorryType || "",
      assignedDriverName: assignedDriverNameInput,
      assignedDriverId: assignedDriverIdInput,
      assignedDate: new Date().toISOString().split('T')[0],
      paymentStatus: currentBooking.paymentStatus || "pending",
      amount: currentBooking.dynamicPricing,
      ownerManagerSupervisor: currentBooking.ownerManagerSupervisor,
      introducer: currentBooking.introducer,
      jobReference: currentBooking.jobReference,
      area: currentBooking.area,
      state: currentBooking.state,
      manualBookingByDriver: currentBooking.manualBookingByDriver,
    };
    updateOrder(currentBooking.id, updatedOrderForContext);

    setShowAssignDriverModal(false);
    setAssignDriverBookingId(null);
    setAssignedDriverNameInput("");
    setAssignedDriverIdInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-blue-600" />
            Advanced Multi-Channel Booking System
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
                    <Label>DO Number <span className="text-red-500">*</span></Label>
                    <Input value={doNumber} onChange={e => setDoNumber(e.target.value)} placeholder="Enter DO Number" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Booking Channel</Label>
                    <Select value={bookingChannel} onValueChange={setBookingChannel}>
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
                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Company/Individual name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Type</Label>
                    <Select value={customerType} onValueChange={setCustomerType}>
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
                    <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Contact person name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+60123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="customer@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
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
                    <Select value={binSize} onValueChange={setBinSize}>
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
                    <Textarea value={locationField} onChange={(e) => setLocationField(e.target.value)} placeholder="Complete address with landmarks" />
                    <Select value={zone} onValueChange={setZone}>
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
                    <Select value={scheduledTime} onValueChange={setScheduledTime}>
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
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium (+RM 50)</SelectItem>
                        <SelectItem value="high">High (+RM 150)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Owner/Manager/Supervisor Bin</Label>
                      <Input value={ownerManagerSupervisor} onChange={(e) => setOwnerManagerSupervisor(e.target.value)} placeholder="Assign owner/manager/supervisor" />
                    </div>
                    <div className="space-y-2">
                      <Label>Introducer</Label>
                      <Input value={introducer} onChange={(e) => setIntroducer(e.target.value)} placeholder="Introducer name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Reference (for commission)</Label>
                      <Input value={jobReference} onChange={(e) => setJobReference(e.target.value)} placeholder="Job reference code" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Area</Label>
                      <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area (e.g. Ampang, PJ)" />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={stateField} onChange={(e) => setStateField(e.target.value)} placeholder="State (e.g. Selangor, KL)" />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <h4 className="font-semibold mb-2">Manual Booking by Driver (if applicable)</h4>
                    <div className="grid grid-cols-5 gap-2">
                      <Input value={manualDriverName} onChange={(e) => setManualDriverName(e.target.value)} placeholder="Driver Name" />
                      <Input value={manualDriverPhone} onChange={(e) => setManualDriverPhone(e.target.value)} placeholder="Phone Number" />
                      <Input value={manualBinNumber} onChange={(e) => setManualBinNumber(e.target.value)} placeholder="Bin Number" />
                      <Input value={manualBinSize} onChange={(e) => setManualBinSize(e.target.value)} placeholder="Bin Size" />
                      <Input value={manualAmount} onChange={(e) => setManualAmount(Number(e.target.value))} type="number" />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Dynamic Price Preview</h4>
                    <div className="text-sm space-y-1">
                      <div>Base Rate: RM {basePricing}</div>
                      <div>Zone Multiplier (Central KL): +20%</div>
                      <div>Peak Hour Surcharge: +20%</div>
                      <div>High Priority: +RM 50</div>
                      <div>Recurring Discount: -10%</div>
                      <div className="font-bold border-t pt-1 text-lg">Final Price: RM {dynamicPricing}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleCreateBooking}>Create Booking</Button>
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
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.priority === 'high').length}</p>
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
                  {booking.status === 'pending' && !booking.confirmationSent && (
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
                  <p className="text-sm text-gray-500">DO Number</p>
                  <p className="font-medium text-blue-700">{booking.doNumber}</p>
                </div>
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
                {booking.status === 'pending' && !booking.confirmationSent && (
                  <Button 
                    size="sm" 
                    onClick={() => sendBookingConfirmation(booking.id)}
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    Send Confirmation
                  </Button>
                )}
                {/* Assign Driver Button */}
                <Button
                  size="sm"
                  onClick={() => {
                    setAssignDriverBookingId(booking.id);
                    setAssignedDriverNameInput(booking.assignedDriverName || "");
                    setAssignedDriverIdInput(booking.assignedDriverId || "");
                    setShowAssignDriverModal(true);
                  }}
                >
                  Assign Driver
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assign Driver Dialog */}
      <Dialog open={showAssignDriverModal} onOpenChange={setShowAssignDriverModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Driver to Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                value={assignedDriverNameInput}
                onChange={(e) => setAssignedDriverNameInput(e.target.value)}
                placeholder="Enter driver's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverId">Driver ID (Optional)</Label>
              <Input
                id="driverId"
                value={assignedDriverIdInput}
                onChange={(e) => setAssignedDriverIdInput(e.target.value)}
                placeholder="Enter driver's ID"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAssignDriverModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignDriver}>Assign</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingSystem;
