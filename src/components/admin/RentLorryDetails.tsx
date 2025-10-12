import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Truck, User, MapPin, Package, Calendar, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";

interface RentLorryDetails {
  id: string;
  name: string;
  lorryNumber: string;
  area: string;
  binNumber: string;
  registeredDate: string;
  status: "Active" | "Inactive";
  contactNumber?: string;
  email?: string;
  address?: string;
  binType?: string;
  totalTrips?: number;
  lastTrip?: string;
}

const RentLorryDetails: React.FC = () => {
  const navigate = useNavigate();
  const { lorryId } = useParams<{ lorryId: string }>();

  // Mock data - in real app, fetch from API based on lorryId
  const [lorryDetails] = useState<RentLorryDetails>({
    id: lorryId || "RL-001",
    name: "Tan Transport Services",
    lorryNumber: "WBD 7788",
    area: "Downtown",
    binNumber: "ASR-100",
    registeredDate: "2025-01-15",
    status: "Active",
    contactNumber: "+60123456789",
    email: "tan.transport@example.com",
    address: "No. 123, Jalan Perdagangan, Taman Perindustrian, 47000 Selangor",
    binType: "10 Yard Dumpster",
    totalTrips: 45,
    lastTrip: "2025-10-11"
  });

  const handleBackToList = () => {
    navigate("/admin/rental-lorries");
  };

  const handleEditLorry = () => {
    navigate("/admin/rental-lorries");
    // In real app, you might want to pass the lorry ID to open the edit modal
    setTimeout(() => {
      toast.info("Click Edit on the specific entry to modify details");
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Active": "bg-green-100 text-green-700 border-green-300",
      "Inactive": "bg-gray-100 text-gray-700 border-gray-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const daysSinceRegistered = Math.floor(
    (new Date().getTime() - new Date(lorryDetails.registeredDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rent Lorry List
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Rent Lorry Details - {lorryDetails.lorryNumber}
          </h1>
          <p className="text-gray-600 mt-1">{lorryDetails.name} ({lorryDetails.id})</p>
        </div>
        <Badge className={`${getStatusBadge(lorryDetails.status)} text-lg px-4 py-2`}>
          {lorryDetails.status}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Renter/Owner Information */}
        <Card className="md:col-span-2 border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Renter / Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-semibold text-lg">{lorryDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Registration ID</p>
                <p className="font-semibold text-lg">{lorryDetails.id}</p>
              </div>
              {lorryDetails.contactNumber && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                  <p className="font-semibold">{lorryDetails.contactNumber}</p>
                </div>
              )}
              {lorryDetails.email && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-sm">{lorryDetails.email}</p>
                </div>
              )}
              {lorryDetails.address && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-semibold">{lorryDetails.address}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Registered Date
                </p>
                <p className="font-semibold">{lorryDetails.registeredDate}</p>
                <p className="text-xs text-gray-500">{daysSinceRegistered} days ago</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className={getStatusBadge(lorryDetails.status)}>
                  {lorryDetails.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-blue-600">{lorryDetails.totalTrips || 0}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Trip</p>
              <p className="font-semibold">{lorryDetails.lastTrip || "N/A"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Days Active</p>
              <p className="font-semibold text-lg">{daysSinceRegistered} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lorry & Operational Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lorry Information */}
        <Card className="border-2 border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              Lorry Information
            </CardTitle>
            <CardDescription>Vehicle details and identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Lorry Number</p>
              <p className="text-3xl font-bold font-mono text-indigo-600">
                {lorryDetails.lorryNumber}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-2">Registration ID</p>
              <Badge variant="outline" className="text-base px-3 py-1 font-mono">
                {lorryDetails.id}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bin Allocation */}
        <Card className="border-2 border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Bin Allocation
            </CardTitle>
            <CardDescription>Associated bin for collection or transport</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Bin Number</p>
              <p className="text-3xl font-bold font-mono text-purple-600">
                {lorryDetails.binNumber}
              </p>
            </div>
            {lorryDetails.binType && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Bin Type</p>
                  <p className="font-semibold text-lg">{lorryDetails.binType}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Operational Area */}
      <Card className="border-2 border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Operational Area
          </CardTitle>
          <CardDescription>Zone or region where this lorry operates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 rounded-lg p-6 flex items-center gap-4">
            <MapPin className="w-12 h-12 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Operating in</p>
              <p className="text-3xl font-bold text-orange-600">{lorryDetails.area}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Rental Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Renter/Owner:</span>
              <span className="font-bold text-gray-900">{lorryDetails.name}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Lorry Number:</span>
              <span className="font-bold text-gray-900 font-mono">{lorryDetails.lorryNumber}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Operating Area:</span>
              <span className="font-bold text-gray-900">{lorryDetails.area}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Associated Bin:</span>
              <Badge variant="outline" className="font-mono bg-purple-50 text-purple-700 border-purple-300">
                {lorryDetails.binNumber}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Status:</span>
              <Badge className={getStatusBadge(lorryDetails.status)}>
                {lorryDetails.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rent Lorry List
            </Button>
            <Button 
              variant="outline"
              onClick={handleEditLorry}
            >
              Edit Rent Lorry Entry
            </Button>
            <Button variant="outline" onClick={() => toast.info("Export functionality coming soon")}>
              Export Details
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.info("Trip history functionality coming soon")}
            >
              View Trip History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentLorryDetails;

