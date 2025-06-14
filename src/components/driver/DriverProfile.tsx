
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, CreditCard, MapPin, Calendar, Award, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface DriverSession {
  name: string;
  ic: string;
  phone: string;
  driverId: string;
}

const DriverProfile = () => {
  const navigate = useNavigate();
  const [driverSession, setDriverSession] = useState<DriverSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: ""
  });

  // Driver performance data
  const [performanceData] = useState({
    totalJobs: 156,
    completedJobs: 148,
    onTimeDeliveries: 142,
    customerRating: 4.8,
    totalEarnings: 12450.00,
    thisMonthJobs: 23,
    thisMonthEarnings: 1850.00
  });

  // Recent job history
  const [jobHistory] = useState([
    {
      id: "JOB045",
      date: "2024-01-15",
      customer: "ABC Construction",
      binType: "ASR100",
      status: "completed",
      amount: 350.00,
      rating: 5
    },
    {
      id: "JOB044",
      date: "2024-01-15",
      customer: "Green Valley Resort",
      binType: "LASR100",
      status: "completed",
      amount: 450.00,
      rating: 5
    },
    {
      id: "JOB043",
      date: "2024-01-14",
      customer: "Sunshine Apartments",
      binType: "PWD100",
      status: "completed",
      amount: 280.00,
      rating: 4
    }
  ]);

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (!session) {
      navigate("/driver/login");
      return;
    }
    const sessionData = JSON.parse(session);
    setDriverSession(sessionData);
    setEditData({
      phone: sessionData.phone,
      address: "123 Jalan Ampang, 50450 Kuala Lumpur",
      emergencyContact: "Siti Rahman (Wife)",
      emergencyPhone: "012-9876543"
    });
  }, [navigate]);

  const handleSave = () => {
    // In a real app, this would update the backend
    toast.success("Profile updated successfully!");
    setIsEditing(false);
    
    // Update session if phone changed
    if (driverSession && editData.phone !== driverSession.phone) {
      const updatedSession = { ...driverSession, phone: editData.phone };
      localStorage.setItem("driverSession", JSON.stringify(updatedSession));
      setDriverSession(updatedSession);
    }
  };

  const handleCancel = () => {
    if (driverSession) {
      setEditData({
        phone: driverSession.phone,
        address: "123 Jalan Ampang, 50450 Kuala Lumpur",
        emergencyContact: "Siti Rahman (Wife)",
        emergencyPhone: "012-9876543"
      });
    }
    setIsEditing(false);
  };

  if (!driverSession) {
    return <div>Loading...</div>;
  }

  const completionRate = ((performanceData.completedJobs / performanceData.totalJobs) * 100).toFixed(1);
  const onTimeRate = ((performanceData.onTimeDeliveries / performanceData.completedJobs) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/driver/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">My Profile</h1>
                <p className="text-sm text-gray-600">{driverSession.driverId}</p>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold">{driverSession.name}</h3>
              <Badge className="bg-green-600 text-white">Active Driver</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">IC Number</p>
                  <p className="font-medium">{driverSession.ic}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone Number</p>
                  {isEditing ? (
                    <Input
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({...prev, phone: e.target.value}))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{editData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Address</p>
                  {isEditing ? (
                    <Input
                      value={editData.address}
                      onChange={(e) => setEditData(prev => ({...prev, address: e.target.value}))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{editData.address}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-600">
              <Phone className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Contact Person</p>
              {isEditing ? (
                <Input
                  value={editData.emergencyContact}
                  onChange={(e) => setEditData(prev => ({...prev, emergencyContact: e.target.value}))}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{editData.emergencyContact}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              {isEditing ? (
                <Input
                  value={editData.emergencyPhone}
                  onChange={(e) => setEditData(prev => ({...prev, emergencyPhone: e.target.value}))}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{editData.emergencyPhone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Performance Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{performanceData.totalJobs}</p>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{onTimeRate}%</p>
                <p className="text-sm text-gray-600">On Time Delivery</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{performanceData.customerRating}</p>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Earnings</span>
                <span className="font-bold text-green-600">RM{performanceData.totalEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-bold text-blue-600">RM{performanceData.thisMonthEarnings.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Job History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Recent Job History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobHistory.map((job) => (
              <div key={job.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{job.customer}</p>
                    <p className="text-xs text-gray-600">{job.id} • {job.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">RM{job.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < job.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {job.binType}
                  </Badge>
                  <Badge className="bg-green-500 text-white text-xs">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverProfile;
