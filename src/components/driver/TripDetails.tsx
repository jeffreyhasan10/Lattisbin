import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Package,
  Truck,
  Phone,
  User,
  Navigation,
  Calendar,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Map,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface TripDetails {
  id: string;
  doNumber: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  pickupCoordinates: { lat: number; lng: number };
  dropoffLocation: string;
  dropoffCoordinates: { lat: number; lng: number };
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "urgent" | "high" | "normal" | "low";
  binDetails: {
    serialNumber: string;
    type: string;
    size: string;
    condition: string;
  };
  wasteType: string;
  lorryDetails: {
    id: string;
    plateNumber: string;
    model: string;
  };
  estimatedDuration: string;
  distance: string;
  collectionType: "pickup" | "delivery" | "both";
  notes: string;
  binStatus: "pending" | "picked" | "delivered" | "filled";
}

// Mock trip details
const mockTripDetails: TripDetails = {
  id: "TRP-001",
  doNumber: "DO-2024-1234",
  customer: "Tech Plaza Mall",
  customerPhone: "+60 12-345-6789",
  customerEmail: "contact@techplaza.com",
  pickupLocation: "Warehouse A, Jalan Tech, Cyberjaya, Selangor",
  pickupCoordinates: { lat: 2.9213, lng: 101.6559 },
  dropoffLocation: "Tech Plaza Mall, Persiaran Multimedia, Cyberjaya, Selangor 63000",
  dropoffCoordinates: { lat: 2.9189, lng: 101.6502 },
  scheduledDate: "2024-10-15",
  scheduledTime: "10:00 AM",
  status: "in-progress",
  priority: "urgent",
  binDetails: {
    serialNumber: "BIN-2024-0123",
    type: "Waste Bin",
    size: "Large (240L)",
    condition: "Good",
  },
  wasteType: "Electronic Waste",
  lorryDetails: {
    id: "LOR-001",
    plateNumber: "ABC 1234",
    model: "Isuzu NQR 2024",
  },
  estimatedDuration: "45 min",
  distance: "12.5 km",
  collectionType: "both",
  notes: "Please use service entrance. Contact site manager upon arrival.",
  binStatus: "pending",
};

const TripDetails = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [trip, setTrip] = useState<TripDetails>(() => {
    // Load trip from localStorage
    const savedTrips = localStorage.getItem("driverTrips");
    if (savedTrips && tripId) {
      const trips = JSON.parse(savedTrips) as Array<Record<string, unknown>>;
      const foundTrip = trips.find((t) => t.id === tripId);
      if (foundTrip) {
        // Map to TripDetails format
        return {
          ...mockTripDetails,
          ...foundTrip,
          status: (foundTrip.status as TripDetails["status"]) || mockTripDetails.status,
          binStatus: (foundTrip.binStatus as TripDetails["binStatus"]) || mockTripDetails.binStatus,
        } as TripDetails;
      }
    }
    return mockTripDetails;
  });

  // Reload trip data when returning to this page
  useEffect(() => {
    const savedTrips = localStorage.getItem("driverTrips");
    if (savedTrips && tripId) {
      const trips = JSON.parse(savedTrips) as Array<Record<string, unknown>>;
      const foundTrip = trips.find((t) => t.id === tripId);
      if (foundTrip) {
        setTrip((prev) => ({
          ...prev,
          ...foundTrip,
          status: (foundTrip.status as TripDetails["status"]) || prev.status,
          binStatus: (foundTrip.binStatus as TripDetails["binStatus"]) || prev.binStatus,
        } as TripDetails));
      }
    }
  }, [tripId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getBinStatusColor = (status: string) => {
    switch (status) {
      case "picked":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "filled":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleNavigateToPickup = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${trip.pickupCoordinates.lat},${trip.pickupCoordinates.lng}`;
    window.open(url, "_blank");
    toast.success("Opening navigation to pickup location");
  };

  const handleNavigateToDropoff = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${trip.dropoffCoordinates.lat},${trip.dropoffCoordinates.lng}`;
    window.open(url, "_blank");
    toast.success("Opening navigation to drop-off location");
  };

  const handleUpdateStatus = () => {
    navigate(`/driver/trips/${tripId}/confirm-collection`);
  };

  const handleRecordPayment = () => {
    navigate(`/driver/trips/${tripId}/record-payment`);
  };

  const handleBackToTrips = () => {
    navigate("/driver/trips");
  };

  const handleCallCustomer = () => {
    toast.info("Calling customer", {
      description: trip.customerPhone,
    });
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Map className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              Trip Details
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              DO Number: {trip.doNumber}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBackToTrips}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Trips
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Priority Card */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Trip Status</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 space-y-4 px-5">
              <div className="flex flex-wrap gap-3">
                <Badge className={`${getStatusColor(trip.status)} border text-sm px-3 py-1`}>
                  Trip: {trip.status}
                </Badge>
                <Badge className={`${getPriorityColor(trip.priority)} border text-sm px-3 py-1`}>
                  Priority: {trip.priority}
                </Badge>
                <Badge className={`${getBinStatusColor(trip.binStatus)} border text-sm px-3 py-1`}>
                  Bin: {trip.binStatus}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Scheduled Date</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {trip.scheduledDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Scheduled Time</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    {trip.scheduledTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Customer Information</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-gray-900">{trip.customer}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-gray-900">{trip.customerPhone}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCallCustomer}
                      className="ml-auto"
                    >
                      Call
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 mt-1">{trip.customerEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Location Details</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <p className="font-semibold text-blue-900">Pickup Location</p>
                      </div>
                      <p className="text-sm text-gray-700">{trip.pickupLocation}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleNavigateToPickup}
                      className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <p className="font-semibold text-green-900">Drop-off Location</p>
                      </div>
                      <p className="text-sm text-gray-700">{trip.dropoffLocation}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleNavigateToDropoff}
                      className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold text-gray-900 mt-1">{trip.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Duration</p>
                  <p className="font-semibold text-gray-900 mt-1">{trip.estimatedDuration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Notes */}
          {trip.notes && (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Special Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">{trip.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bin Details */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Bin Details</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Serial Number</p>
                <p className="font-semibold text-gray-900">{trip.binDetails.serialNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{trip.binDetails.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-medium text-gray-900">{trip.binDetails.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Condition</p>
                <p className="font-medium text-gray-900">{trip.binDetails.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Waste Type</p>
                <p className="font-medium text-gray-900">{trip.wasteType}</p>
              </div>
            </CardContent>
          </Card>

          {/* Lorry Details */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Assigned Lorry</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Lorry ID</p>
                <p className="font-semibold text-gray-900">{trip.lorryDetails.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Plate Number</p>
                <p className="font-medium text-gray-900">{trip.lorryDetails.plateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-medium text-gray-900">{trip.lorryDetails.model}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-5 py-4">
              <CardTitle className="text-white font-bold">Trip Actions</CardTitle>
            </div>
            <CardContent className="space-y-3 pt-4 px-4">
              <Button
                onClick={handleUpdateStatus}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Update Status & Proceed
              </Button>
              <Button
                onClick={handleRecordPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Record Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;

