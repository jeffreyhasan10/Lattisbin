import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Mail, 
  Shield,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editData, setEditData] = useState({
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // In a real app, this would call the backend
    toast.success("Password changed successfully!");
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleBackToDashboard = () => {
    navigate("/driver/dashboard");
  };

  if (!driverSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              My Profile
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your personal information and account security
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-xl mb-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        <CardContent className="p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30 backdrop-blur-sm shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold text-white">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-bold">{driverSession.name}</h2>
                <p className="text-blue-100 font-medium text-sm sm:text-base">Professional Driver</p>
                <p className="text-blue-200 text-xs sm:text-sm font-medium mt-1">ID: {driverSession.driverId}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-md font-semibold w-full sm:w-auto h-11 rounded-xl active:scale-95 transition-transform"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Personal Information</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={driverSession.name}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ic" className="text-sm font-medium text-gray-700">
                    IC Number
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="ic"
                      value={driverSession.ic}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <>
                  <Separator />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 rounded-xl font-semibold shadow-md active:scale-95 transition-transform">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1 h-11 rounded-xl font-semibold border-2 border-gray-300">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Emergency Contact</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact" className="text-sm font-medium text-gray-700">
                    Contact Person
                  </Label>
                  <Input
                    id="emergency-contact"
                    value={editData.emergencyContact}
                    onChange={(e) => setEditData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="emergency-phone"
                      value={editData.emergencyPhone}
                      onChange={(e) => setEditData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <div className="space-y-6">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Account Security</span>
              </CardTitle>
            </div>
            <CardContent className="pt-4 px-5 space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Verified Account</span>
                </div>
                <p className="text-sm text-green-700">
                  Your account is verified and secure
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Password</span>
                  </div>
                  {!isChangingPassword && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsChangingPassword(true)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <KeyRound className="h-3 w-3 mr-1" />
                      Change
                    </Button>
                  )}
                </div>

                {!isChangingPassword ? (
                  <Input
                    type="password"
                    value="••••••••"
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-sm">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        onClick={handlePasswordChange}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 h-11 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                      <Button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        }}
                        variant="outline"
                        className="w-full h-11 rounded-xl font-semibold border-2 border-gray-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Driver ID</span>
                <span className="font-semibold text-gray-900">{driverSession.driverId}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
