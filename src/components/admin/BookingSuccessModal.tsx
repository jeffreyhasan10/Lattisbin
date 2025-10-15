import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Bell } from "lucide-react";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  doNumber: string;
  hasReminder: boolean;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  doNumber,
  hasReminder,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewBookings = () => {
    onClose();
    navigate("/admin/bookings-dos");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-fade-in-up shadow-2xl border-2 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Created Successfully!
          </h2>
          
          <div className="space-y-3 my-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Delivery Order Number</p>
              <p className="text-lg font-bold text-blue-600">{doNumber}</p>
            </div>

            {hasReminder && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">Collection reminder scheduled</span>
              </div>
            )}

            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ Customer notified</p>
              <p>✓ Driver will be assigned</p>
              <p>✓ Invoice pending</p>
            </div>
          </div>

          <Button 
            onClick={handleViewBookings}
            className="w-full"
          >
            View Bookings & DOs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccessModal;

