import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Package,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload,
  FileText,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

interface BinStatus {
  value: "picked" | "delivered" | "filled";
  label: string;
  description: string;
  icon: typeof Package;
  color: string;
}

const binStatuses: BinStatus[] = [
  {
    value: "picked",
    label: "Bin Picked Up",
    description: "Mark the bin as collected from the customer location",
    icon: Truck,
    color: "blue",
  },
  {
    value: "delivered",
    label: "Bin Delivered",
    description: "Mark the bin as delivered to the customer location",
    icon: CheckCircle,
    color: "green",
  },
  {
    value: "filled",
    label: "Bin Filled",
    description: "Mark the bin as filled and ready for collection",
    icon: AlertCircle,
    color: "orange",
  },
];

const ConfirmCollection = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [binCondition, setBinCondition] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [wastePhoto, setWastePhoto] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setWastePhoto(file);
      toast.success("Photo uploaded successfully");
    }
  };

  const handleConfirmAction = () => {
    if (!selectedStatus) {
      toast.error("Please select a bin status");
      return;
    }
    if (!binCondition) {
      toast.error("Please select bin condition");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    // Update trip status in localStorage
    const savedTrips = localStorage.getItem("driverTrips");
    if (savedTrips) {
      const trips = JSON.parse(savedTrips) as Array<Record<string, unknown>>;
      const updatedTrips = trips.map((trip) => {
        if (trip.id === tripId) {
          const hasPayment = trip.paymentRecorded === true;
          return {
            ...trip,
            binStatus: selectedStatus,
            statusUpdated: true,
            // Mark as completed if payment is also recorded
            status: hasPayment ? "completed" : trip.status,
          };
        }
        return trip;
      });
      localStorage.setItem("driverTrips", JSON.stringify(updatedTrips));
    }
    
    toast.success("Collection status updated successfully!", {
      description: "Admin has been notified for next collection scheduling",
    });
    
    // Navigate back to trip details
    setTimeout(() => {
      navigate(`/driver/trips/${tripId}`);
    }, 1500);
  };

  const handleBackToDetails = () => {
    navigate(`/driver/trips/${tripId}`);
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case "blue":
        return "border-blue-300 bg-blue-50 hover:bg-blue-100";
      case "green":
        return "border-green-300 bg-green-50 hover:bg-green-100";
      case "orange":
        return "border-orange-300 bg-orange-50 hover:bg-orange-100";
      default:
        return "border-gray-300 bg-gray-50 hover:bg-gray-100";
    }
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              Confirm Collection
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Update bin status and confirm collection details
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBackToDetails}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip Details
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trip Information */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Trip Information</span>
            </CardTitle>
          </div>
          <CardContent className="pt-4 px-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Trip ID</p>
                <p className="font-semibold text-gray-900">{tripId}</p>
              </div>
              <div>
                <p className="text-gray-600">DO Number</p>
                <p className="font-semibold text-gray-900">DO-2024-1234</p>
              </div>
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">Tech Plaza Mall</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select Bin Status */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Update Bin Status</span>
            </CardTitle>
          </div>
          <CardContent className="pt-4 px-5">
            <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
              <div className="space-y-3">
                {binStatuses.map((status) => {
                  const Icon = status.icon;
                  return (
                    <label
                      key={status.value}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStatus === status.value
                          ? `${getStatusColor(status.color)} border-${status.color}-500 ring-2 ring-${status.color}-200`
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <RadioGroupItem value={status.value} id={status.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-5 w-5 text-${status.color}-600`} />
                          <span className="font-semibold text-gray-900">{status.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{status.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Bin Condition */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Bin Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bin-condition">Current Condition *</Label>
              <Select value={binCondition} onValueChange={setBinCondition}>
                <SelectTrigger id="bin-condition">
                  <SelectValue placeholder="Select bin condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Like new</SelectItem>
                  <SelectItem value="good">Good - Minor wear</SelectItem>
                  <SelectItem value="fair">Fair - Some damage</SelectItem>
                  <SelectItem value="poor">Poor - Needs repair</SelectItem>
                  <SelectItem value="damaged">Damaged - Requires replacement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {binCondition && ["fair", "poor", "damaged"].includes(binCondition) && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 mb-1">Damage Detected</p>
                    <p className="text-sm text-yellow-800">
                      Please provide additional notes and photos of the damage below. Admin will be notified.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Waste Photo */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Upload Waste/Bin Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  {wastePhoto ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-600" />
                      <p className="font-medium text-green-700">{wastePhoto.name}</p>
                      <p className="text-sm text-gray-600">Click to change photo</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400" />
                      <p className="font-medium text-gray-700">Click to upload photo</p>
                      <p className="text-sm text-gray-500">or use camera to take a photo</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Photo will be attached to the delivery order for documentation
            </p>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any additional notes or observations about the collection..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-5 py-4">
            <CardTitle className="text-white font-bold">Confirm Changes</CardTitle>
          </div>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleBackToDetails}
                className="flex-1 h-12 rounded-xl font-semibold border-2 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                disabled={!selectedStatus || !binCondition}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirm Action
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Confirm Collection Status
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to update the collection status?</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Status Summary:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Status: <strong className="capitalize">{selectedStatus?.replace("-", " ")}</strong></li>
                  <li>• Condition: <strong className="capitalize">{binCondition}</strong></li>
                  {wastePhoto && <li>• Photo: <strong>Attached</strong></li>}
                  {notes && <li>• Notes: <strong>Included</strong></li>}
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Admin will be automatically notified to schedule the next collection.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalConfirm}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Confirm & Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfirmCollection;

