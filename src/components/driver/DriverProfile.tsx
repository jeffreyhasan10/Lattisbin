import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ArrowLeft, User, Phone, CreditCard, MapPin, Calendar, Award, Edit, Save, X, Mail, Clock, Star, TrendingUp, Shield, LogOut } from "lucide-react";
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

  const handleLogout = () => {
    localStorage.removeItem("driverSession");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  if (!driverSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completionRate = ((performanceData.completedJobs / performanceData.totalJobs) * 100).toFixed(1);
  const onTimeRate = ((performanceData.onTimeDeliveries / performanceData.completedJobs) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Clean Breadcrumbs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-blue-600 font-semibold text-lg">
                    My Profile
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Clean Header Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm">
                    <User className="h-10 w-10" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{driverSession.name}</h1>
                  <p className="text-blue-100 font-medium text-lg mb-1">Professional Driver</p>
                  <p className="text-blue-200 text-sm font-medium">ID: {driverSession.driverId}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                      <Star className="h-4 w-4 text-yellow-300 fill-current" />
                      <span className="text-sm font-semibold">{performanceData.customerRating}/5.0</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                      <Shield className="h-4 w-4 text-green-300" />
                      <span className="text-sm font-semibold">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white text-blue-600 hover:bg-gray-100 border-0 shadow-md font-semibold"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-white text-red-600 hover:bg-red-50 border-0 shadow-md font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="xl:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">IC Number</p>
                          <p className="font-semibold text-gray-900">{driverSession.ic}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                          {isEditing ? (
                            <Input
                              value={editData.phone}
                              onChange={(e) => setEditData(prev => ({...prev, phone: e.target.value}))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-semibold text-gray-900">{editData.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Email Address</p>
                          {isEditing ? (
                            <Input
                              value={editData.email}
                              onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-semibold text-gray-900">{editData.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Address</p>
                          {isEditing ? (
                            <Input
                              value={editData.address}
                              onChange={(e) => setEditData(prev => ({...prev, address: e.target.value}))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-semibold text-gray-900">{editData.address}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Join Date</p>
                          <p className="font-semibold text-gray-900">{performanceData.joinDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Experience</p>
                          <p className="font-semibold text-blue-800">{performanceData.experienceYears} Years</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-medium mb-1">Contact Person</p>
                    {isEditing ? (
                      <Input
                        value={editData.emergencyContact}
                        onChange={(e) => setEditData(prev => ({...prev, emergencyContact: e.target.value}))}
                      />
                    ) : (
                      <p className="font-semibold text-red-800">{editData.emergencyContact}</p>
                    )}
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-medium mb-1">Phone Number</p>
                    {isEditing ? (
                      <Input
                        value={editData.emergencyPhone}
                        onChange={(e) => setEditData(prev => ({...prev, emergencyPhone: e.target.value}))}
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
          <div className="space-y-8">
            {/* Performance Statistics */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600 mb-1">{performanceData.totalJobs}</p>
                      <p className="text-xs text-blue-700 font-medium">Total Jobs</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-2xl font-bold text-green-600 mb-1">{completionRate}%</p>
                      <p className="text-xs text-green-700 font-medium">Completion</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-2xl font-bold text-purple-600 mb-1">{onTimeRate}%</p>
                      <p className="text-xs text-purple-700 font-medium">On Time</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-2xl font-bold text-yellow-600 mb-1">{performanceData.customerRating}</p>
                      <p className="text-xs text-yellow-700 font-medium">Rating</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm text-green-700 font-medium">Total Earnings</span>
                      <span className="font-bold text-green-600">RM{performanceData.totalEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm text-blue-700 font-medium">This Month</span>
                      <span className="font-bold text-blue-600">RM{performanceData.thisMonthEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Job History */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                  </div>
                  Recent Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobHistory.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{job.customer}</p>
                        <p className="text-xs text-gray-600">#{job.id} • {job.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">RM{job.amount.toFixed(2)}</p>
                        <div className="flex items-center gap-1 justify-end">
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
                      <Badge variant="outline" className="text-xs">
                        {job.binType}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
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
    </div>
  );
};

export default DriverProfile;
