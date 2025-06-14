
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ArrowLeft, User, Phone, CreditCard, MapPin, Calendar, Award, Edit, Save, X, Mail, Clock, Star, TrendingUp } from "lucide-react";
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
    emergencyPhone: "",
    email: ""
  });

  // Driver performance data
  const [performanceData] = useState({
    totalJobs: 156,
    completedJobs: 148,
    onTimeDeliveries: 142,
    customerRating: 4.8,
    totalEarnings: 12450.00,
    thisMonthJobs: 23,
    thisMonthEarnings: 1850.00,
    joinDate: "2023-06-15",
    experienceYears: 8
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
      emergencyPhone: "012-9876543",
      email: "ahmad.rahman@email.com"
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
        emergencyPhone: "012-9876543",
        email: "ahmad.rahman@email.com"
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
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Breadcrumbs */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm">
        <div className="px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  My Profile
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{driverSession.name}</h1>
                <p className="text-indigo-100 font-medium">Professional Driver • ID: {driverSession.driverId}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-yellow-300 fill-current" />
                  <span className="text-sm font-medium">{performanceData.customerRating}/5.0 Rating</span>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "bg-white text-indigo-600 hover:bg-gray-100" : "border-white/30 text-white hover:bg-white/10"}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-600">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">IC Number</p>
                      <p className="font-semibold text-gray-900">{driverSession.ic}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                      {isEditing ? (
                        <Input
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({...prev, phone: e.target.value}))}
                          className="mt-1 border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{editData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Email Address</p>
                      {isEditing ? (
                        <Input
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                          className="mt-1 border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{editData.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Address</p>
                      {isEditing ? (
                        <Input
                          value={editData.address}
                          onChange={(e) => setEditData(prev => ({...prev, address: e.target.value}))}
                          className="mt-1 border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{editData.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Join Date</p>
                      <p className="font-semibold text-gray-900">{performanceData.joinDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-indigo-700 font-medium">Experience</p>
                      <p className="font-semibold text-indigo-800">{performanceData.experienceYears} Years</p>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 border-gray-300">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-1">Contact Person</p>
                  {isEditing ? (
                    <Input
                      value={editData.emergencyContact}
                      onChange={(e) => setEditData(prev => ({...prev, emergencyContact: e.target.value}))}
                      className="border-red-200 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                    />
                  ) : (
                    <p className="font-semibold text-red-800">{editData.emergencyContact}</p>
                  )}
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-1">Phone Number</p>
                  {isEditing ? (
                    <Input
                      value={editData.emergencyPhone}
                      onChange={(e) => setEditData(prev => ({...prev, emergencyPhone: e.target.value}))}
                      className="border-red-200 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                    />
                  ) : (
                    <p className="font-semibold text-red-800">{editData.emergencyPhone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance & History */}
        <div className="space-y-6">
          {/* Performance Statistics */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                <Award className="h-5 w-5" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{performanceData.totalJobs}</p>
                    <p className="text-xs text-blue-700 font-medium">Total Jobs</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-600">{completionRate}%</p>
                    <p className="text-xs text-emerald-700 font-medium">Completion</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-2xl font-bold text-purple-600">{onTimeRate}%</p>
                    <p className="text-xs text-purple-700 font-medium">On Time</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{performanceData.customerRating}</p>
                    <p className="text-xs text-yellow-700 font-medium">Rating</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                    <span className="text-sm text-emerald-700 font-medium">Total Earnings</span>
                    <span className="font-bold text-emerald-600">RM{performanceData.totalEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-blue-700 font-medium">This Month</span>
                    <span className="font-bold text-blue-600">RM{performanceData.thisMonthEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Job History */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                Recent Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobHistory.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{job.customer}</p>
                      <p className="text-xs text-gray-600">#{job.id} • {job.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-sm">RM{job.amount.toFixed(2)}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < job.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-gray-300">
                      {job.binType}
                    </Badge>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
