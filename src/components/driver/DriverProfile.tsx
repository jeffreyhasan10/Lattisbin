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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const completionRate = ((performanceData.completedJobs / performanceData.totalJobs) * 100).toFixed(1);
  const onTimeRate = ((performanceData.onTimeDeliveries / performanceData.completedJobs) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6">
      {/* Enhanced Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl mb-6 shadow-lg">
        <div className="px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-indigo-600 font-semibold text-lg">
                  My Profile
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Enhanced Header Card */}
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="relative p-8">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-xl backdrop-blur-sm">
                  <User className="h-10 w-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">{driverSession.name}</h1>
                <p className="text-indigo-100 font-medium text-lg mb-1">Professional Driver</p>
                <p className="text-indigo-200 text-sm font-medium">ID: {driverSession.driverId}</p>
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
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-white text-indigo-600 hover:bg-gray-100 shadow-lg" : "border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-300/50 text-red-100 hover:bg-red-500/20 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Enhanced Personal Info */}
        <div className="xl:col-span-2 space-y-8">
          {/* Enhanced Basic Information */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-3 text-indigo-700">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-semibold mb-1">IC Number</p>
                        <p className="font-bold text-gray-900 text-lg">{driverSession.ic}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Phone Number</p>
                        {isEditing ? (
                          <Input
                            value={editData.phone}
                            onChange={(e) => setEditData(prev => ({...prev, phone: e.target.value}))}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg"
                          />
                        ) : (
                          <p className="font-bold text-gray-900 text-lg">{editData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Email Address</p>
                        {isEditing ? (
                          <Input
                            value={editData.email}
                            onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg"
                          />
                        ) : (
                          <p className="font-bold text-gray-900 text-lg">{editData.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Address</p>
                        {isEditing ? (
                          <Input
                            value={editData.address}
                            onChange={(e) => setEditData(prev => ({...prev, address: e.target.value}))}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg"
                          />
                        ) : (
                          <p className="font-bold text-gray-900">{editData.address}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Join Date</p>
                        <p className="font-bold text-gray-900 text-lg">{performanceData.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-200 rounded-lg group-hover:bg-indigo-300 transition-colors">
                        <Clock className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-indigo-700 font-semibold mb-1">Experience</p>
                        <p className="font-bold text-indigo-800 text-lg">{performanceData.experienceYears} Years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Emergency Contact */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-3 text-red-700">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Phone className="h-5 w-5" />
                </div>
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:shadow-md transition-all duration-300">
                  <p className="text-sm text-red-700 font-semibold mb-2">Contact Person</p>
                  {isEditing ? (
                    <Input
                      value={editData.emergencyContact}
                      onChange={(e) => setEditData(prev => ({...prev, emergencyContact: e.target.value}))}
                      className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg"
                    />
                  ) : (
                    <p className="font-bold text-red-800 text-lg">{editData.emergencyContact}</p>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:shadow-md transition-all duration-300">
                  <p className="text-sm text-red-700 font-semibold mb-2">Phone Number</p>
                  {isEditing ? (
                    <Input
                      value={editData.emergencyPhone}
                      onChange={(e) => setEditData(prev => ({...prev, emergencyPhone: e.target.value}))}
                      className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg"
                    />
                  ) : (
                    <p className="font-bold text-red-800 text-lg">{editData.emergencyPhone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Enhanced Performance & History */}
        <div className="space-y-8">
          {/* Enhanced Performance Statistics */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-3 text-yellow-700">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                    <p className="text-3xl font-bold text-blue-600 mb-1">{performanceData.totalJobs}</p>
                    <p className="text-xs text-blue-700 font-semibold">Total Jobs</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                    <p className="text-3xl font-bold text-emerald-600 mb-1">{completionRate}%</p>
                    <p className="text-xs text-emerald-700 font-semibold">Completion</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                    <p className="text-3xl font-bold text-purple-600 mb-1">{onTimeRate}%</p>
                    <p className="text-xs text-purple-700 font-semibold">On Time</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
                    <p className="text-3xl font-bold text-yellow-600 mb-1">{performanceData.customerRating}</p>
                    <p className="text-xs text-yellow-700 font-semibold">Rating</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                    <span className="text-sm text-emerald-700 font-semibold">Total Earnings</span>
                    <span className="font-bold text-emerald-600 text-lg">RM{performanceData.totalEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                    <span className="text-sm text-blue-700 font-semibold">This Month</span>
                    <span className="font-bold text-blue-600 text-lg">RM{performanceData.thisMonthEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Job History */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                Recent Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {jobHistory.map((job) => (
                <div key={job.id} className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-sm text-gray-900 group-hover:text-indigo-700 transition-colors">{job.customer}</p>
                      <p className="text-xs text-gray-600">#{job.id} • {job.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-lg">RM{job.amount.toFixed(2)}</p>
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
                    <Badge variant="outline" className="text-xs border-gray-300 bg-white">
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
