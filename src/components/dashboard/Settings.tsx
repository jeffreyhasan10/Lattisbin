import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Shield,
  BellRing,
  UserCog,
  Palette,
  MailCheck,
  LayoutGrid,
  FileCode,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  RefreshCw,
  Briefcase,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Ahmad Zulkifli",
    email: "ahmad@simatex.my",
    phone: "+60 12-345 6789",
    position: "System Administrator",
    company: "Lattis EWM Sdn Bhd",
    timezone: "Asia/Kuala_Lumpur",
    language: "en",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appNotifications: true,
    weeklyReports: true,
    systemUpdates: true,
    marketingEmails: false,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    density: "comfortable",
    sidebarCollapsed: false,
    animations: true,
    fontSize: "normal",
  });

  // Handle form submission
  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  // Handle notification toggle
  const handleToggleNotification = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });

    toast({
      title: "Notification Settings Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, " $1")} has been ${
        notificationSettings[setting] ? "disabled" : "enabled"
      }.`,
    });
  };

  // Handle appearance save
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Settings Updated",
      description: "Your display preferences have been saved.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    },
  };

  const tabContentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      className="space-y-6 p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight">
            Settings
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Customize your account preferences and configurations
          </p>
        </div>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 bg-gray-100/50 rounded-xl p-2">
            {[
              { value: "profile", icon: User, label: "Profile" },
              { value: "notifications", icon: BellRing, label: "Notifications" },
              // { value: "appearance", icon: Palette, label: "Appearance" },
              { value: "security", icon: Shield, label: "Security" },
              { value: "company", icon: Building2, label: "Company" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex gap-2 items-center rounded-lg py-2.5 px-3 text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary hover:bg-gray-50 transition-all duration-200"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <tab.icon className="h-5 w-5" />
                </motion.div>
                <span className="text-sm font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <TabsContent value="profile" className="mt-0">
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl overflow-hidden" variants={cardVariants}>
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <motion.div
                        className="w-full lg:w-1/4 space-y-3"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="h-36 w-36 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto lg:mx-0">
                          <User size={56} />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-36 mx-auto lg:mx-0 border-primary/30 hover:bg-primary/10 transition-colors"
                        >
                          Change Photo
                        </Button>
                      </motion.div>
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: "name", label: "Full Name", icon: User, value: userData.name },
                            { id: "email", label: "Email Address", icon: Mail, value: userData.email, type: "email" },
                            { id: "phone", label: "Phone Number", icon: Phone, value: userData.phone },
                            { id: "position", label: "Job Position", icon: Briefcase, value: userData.position },
                          ].map((field) => (
                            <motion.div key={field.id} className="space-y-2" variants={itemVariants}>
                              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
                              <div className="relative">
                                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  id={field.id}
                                  type={field.type || "text"}
                                  value={field.value}
                                  onChange={(e) =>
                                    setUserData({ ...userData, [field.id]: e.target.value })
                                  }
                                  className="pl-10 border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div className="space-y-2" variants={itemVariants}>
                            <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                            <Select
                              value={userData.timezone}
                              onValueChange={(value) => setUserData({ ...userData, timezone: value })}
                            >
                              <SelectTrigger
                                id="timezone"
                                className="border-gray-200 hover:border-primary/30 rounded-lg shadow-sm transition-colors"
                              >
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Asia/Kuala_Lumpur">Malaysia (GMT+8)</SelectItem>
                                <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                                <SelectItem value="Asia/Jakarta">Indonesia (GMT+7)</SelectItem>
                                <SelectItem value="Asia/Bangkok">Thailand (GMT+7)</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                          <motion.div className="space-y-2" variants={itemVariants}>
                            <Label htmlFor="language" className="text-sm font-medium text-gray-700">Language</Label>
                            <Select
                              value={userData.language}
                              onValueChange={(value) => setUserData({ ...userData, language: value })}
                            >
                              <SelectTrigger
                                id="language"
                                className="border-gray-200 hover:border-primary/30 rounded-lg shadow-sm transition-colors"
                              >
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                                <SelectItem value="zh">中文 (Chinese)</SelectItem>
                                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t p-4 bg-gray-50/50">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 px-6"
                        onClick={handleSaveProfile}
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Configure how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-4">
                      {[
                        {
                          key: "emailAlerts",
                          label: "Email Alerts",
                          description: "Receive notifications via email",
                        },
                        {
                          key: "smsAlerts",
                          label: "SMS Alerts",
                          description: "Receive important alerts via SMS",
                        },
                        {
                          key: "appNotifications",
                          label: "In-App Notifications",
                          description: "Show notifications within the application",
                        },
                        {
                          key: "weeklyReports",
                          label: "Weekly Report Emails",
                          description: "Receive weekly summary reports",
                        },
                        {
                          key: "systemUpdates",
                          label: "System Updates",
                          description: "Get notified about system updates",
                        },
                        {
                          key: "marketingEmails",
                          label: "Marketing Emails",
                          description: "Receive promotional content and news",
                        },
                      ].map((setting, index) => (
                        <motion.div
                          key={setting.key}
                          className={`flex items-center justify-between py-4 ${
                            index < 5 ? "border-b border-gray-100" : ""
                          }`}
                          variants={itemVariants}
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-800">{setting.label}</div>
                            <div className="text-sm text-gray-500">{setting.description}</div>
                          </div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Switch
                              checked={notificationSettings[setting.key]}
                              onCheckedChange={() => handleToggleNotification(setting.key)}
                              className="data-[state=checked]:bg-primary"
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Display Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Customize how the application looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-6">
                      <motion.div className="space-y-3" variants={itemVariants}>
                        <Label className="text-sm font-medium text-gray-700">Theme</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { value: "light", label: "Light", color: "bg-white" },
                            { value: "dark", label: "Dark", color: "bg-slate-900" },
                            { value: "system", label: "System", color: "bg-gradient-to-br from-white to-slate-900" },
                          ].map((theme) => (
                            <motion.div
                              key={theme.value}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Button
                                variant="outline"
                                className={`h-28 w-full flex flex-col items-center justify-center gap-3 border-gray-200 hover:bg-gray-50 ${
                                  appearanceSettings.theme === theme.value
                                    ? "border-primary bg-primary/10"
                                    : ""
                                } rounded-lg shadow-sm transition-all duration-200`}
                                onClick={() =>
                                  setAppearanceSettings({ ...appearanceSettings, theme: theme.value })
                                }
                              >
                                <div className={`h-14 w-14 rounded-md ${theme.color} border border-gray-200`} />
                                <span className="text-gray-800 text-sm">{theme.label}</span>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div className="space-y-2" variants={itemVariants}>
                          <Label htmlFor="density" className="text-sm font-medium text-gray-700">Layout Density</Label>
                          <Select
                            value={appearanceSettings.density}
                            onValueChange={(value) =>
                              setAppearanceSettings({ ...appearanceSettings, density: value })
                            }
                          >
                            <SelectTrigger
                              id="density"
                              className="border-gray-200 hover:border-primary/30 rounded-lg shadow-sm transition-colors"
                            >
                              <SelectValue placeholder="Select density" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="comfortable">Comfortable</SelectItem>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="spacious">Spacious</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div className="space-y-2" variants={itemVariants}>
                          <Label htmlFor="fontSize" className="text-sm font-medium text-gray-700">Font Size</Label>
                          <Select
                            value={appearanceSettings.fontSize}
                            onValueChange={(value) =>
                              setAppearanceSettings({ ...appearanceSettings, fontSize: value })
                            }
                          >
                            <SelectTrigger
                              id="fontSize"
                              className="border-gray-200 hover:border-primary/30 rounded-lg shadow-sm transition-colors"
                            >
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            key: "sidebarCollapsed",
                            label: "Sidebar Collapsed by Default",
                            description: "Start with a collapsed sidebar for more screen space",
                          },
                          {
                            key: "animations",
                            label: "Enable Animations",
                            description: "Use animations and transitions in the interface",
                          },
                        ].map((setting, index) => (
                          <motion.div
                            key={setting.key}
                            className={`flex items-center justify-between py-4 ${
                              index === 0 ? "border-b border-gray-100" : ""
                            }`}
                            variants={itemVariants}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-gray-800">{setting.label}</div>
                              <div className="text-sm text-gray-500">{setting.description}</div>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Switch
                                checked={appearanceSettings[setting.key]}
                                onCheckedChange={(checked) =>
                                  setAppearanceSettings({
                                    ...appearanceSettings,
                                    [setting.key]: checked,
                                  })
                                }
                                className="data-[state=checked]:bg-primary"
                              />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t p-4 bg-gray-50/50">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 px-6"
                        onClick={handleSaveAppearance}
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Preferences
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 p-6">
                    <motion.div className="space-y-4" variants={containerVariants}>
                      <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: "current-password", label: "Current Password", placeholder: "Enter current password" },
                          { id: "new-password", label: "New Password", placeholder: "Enter new password" },
                          {
                            id: "confirm-password",
                            label: "Confirm New Password",
                            placeholder: "Confirm new password",
                          },
                        ].map((field) => (
                          <motion.div key={field.id} className="space-y-2" variants={itemVariants}>
                            <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id={field.id}
                                type="password"
                                placeholder={field.placeholder}
                                className="pl-10 border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 px-6">
                          Update Password
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="border-t pt-6 space-y-4"
                      variants={containerVariants}
                    >
                      <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
                      <motion.div
                        className="flex items-center justify-between"
                        variants={itemVariants}
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-gray-800">
                            Enable Two-Factor Authentication
                          </div>
                          <div className="text-sm text-gray-500">Secure your account with 2FA</div>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            className="border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors px-6"
                          >
                            Configure
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="border-t pt-6 space-y-4"
                      variants={containerVariants}
                    >
                      <h3 className="text-lg font-medium text-gray-800">Recent Login Activities</h3>
                      <div className="space-y-3">
                        {[
                          {
                            time: "Today, 09:41 AM",
                            device: "Chrome on Windows • Kuala Lumpur, MY",
                            status: "Current Session",
                          },
                          {
                            time: "Yesterday, 03:12 PM",
                            device: "Safari on iPhone • Kuala Lumpur, MY",
                          },
                          {
                            time: "Apr 12, 2024, 10:24 AM",
                            device: "Firefox on macOS • Petaling Jaya, MY",
                          },
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            className="flex justify-between items-start p-3 bg-gray-50/50 rounded-lg"
                            variants={itemVariants}
                            whileHover={{ backgroundColor: "#f9fafb" }}
                          >
                            <div>
                              <div className="font-medium text-gray-800">{activity.time}</div>
                              <div className="text-sm text-gray-500">{activity.device}</div>
                            </div>
                            {activity.status && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                {activity.status}
                              </Badge>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors px-6"
                        >
                          View All Activity
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Company Information
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your company details and configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 p-6">
                    <motion.div
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                      variants={containerVariants}
                    >
                      <motion.div className="space-y-4" variants={itemVariants}>
                        <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
                        <div className="space-y-4">
                          {[
                            {
                              id: "company-name",
                              label: "Company Name",
                              icon: Building2,
                              value: "Lattis EWM Sdn Bhd",
                            },
                            {
                              id: "company-email",
                              label: "Company Email",
                              icon: Mail,
                              value: "info@simatex.my",
                            },
                            {
                              id: "company-phone",
                              label: "Phone Number",
                              icon: Phone,
                              value: "+60 3-1234 5678",
                            },
                            {
                              id: "company-website",
                              label: "Website",
                              icon: Globe,
                              value: "https://simatex.my",
                            },
                          ].map((field) => (
                            <motion.div key={field.id} className="space-y-2" variants={itemVariants}>
                              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
                              <div className="relative">
                                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  id={field.id}
                                  value={field.value}
                                  className="pl-10 border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div className="space-y-4" variants={itemVariants}>
                        <h3 className="text-lg font-medium text-gray-800">Address</h3>
                        <div className="space-y-4">
                          <motion.div className="space-y-2" variants={itemVariants}>
                            <Label htmlFor="company-address" className="text-sm font-medium text-gray-700">Street Address</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                              <Textarea
                                id="company-address"
                                value="15, Jalan Teknologi 3/1, Taman Sains Selangor, Kota Damansara"
                                className="pl-10 min-h-[100px] border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                              />
                            </div>
                          </motion.div>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { id: "company-city", label: "City", value: "Petaling Jaya" },
                              { id: "company-postcode", label: "Postcode", value: "47810" },
                            ].map((field) => (
                              <motion.div
                                key={field.id}
                                className="space-y-2"
                                variants={itemVariants}
                              >
                                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
                                <Input
                                  id={field.id}
                                  value={field.value}
                                  className="border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                                />
                              </motion.div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { id: "company-state", label: "State", value: "Selangor" },
                              { id: "company-country", label: "Country", value: "Malaysia" },
                            ].map((field) => (
                              <motion.div
                                key={field.id}
                                className="space-y-2"
                                variants={itemVariants}
                              >
                                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
                                <Input
                                  id={field.id}
                                  value={field.value}
                                  className="border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="border-t pt-6 space-y-4"
                      variants={containerVariants}
                    >
                      <h3 className="text-lg font-medium text-gray-800">Business Registration</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: "reg-number", label: "Registration Number", value: "201901234567" },
                          { id: "tax-id", label: "Tax ID/GST Number", value: "GST-123456" },
                        ].map((field) => (
                          <motion.div
                            key={field.id}
                            className="space-y-2"
                            variants={itemVariants}
                          >
                            <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
                            <Input
                              id={field.id}
                              value={field.value}
                              className="border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-primary/30 transition-all duration-200"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      className="border-t pt-6 space-y-4"
                      variants={containerVariants}
                    >
                      <h3 className="text-lg font-medium text-gray-800">System Settings</h3>
                      <div className="space-y-4">
                        {[
                          {
                            label: "Auto Backup",
                            description: "Automatically backup your data daily",
                            checked: true,
                          },
                          {
                            label: "Client Portal",
                            description: "Enable client access portal",
                            checked: true,
                          },
                          {
                            label: "Data Synchronization",
                            description: "Sync data across all connected devices",
                            checked: true,
                          },
                        ].map((setting, index) => (
                          <motion.div
                            key={setting.label}
                            className={`flex items-center justify-between py-4 ${
                              index < 2 ? "border-b border-gray-100" : ""
                            }`}
                            variants={itemVariants}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-gray-800">{setting.label}</div>
                              <div className="text-sm text-gray-500">{setting.description}</div>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Switch
                                defaultChecked={setting.checked}
                                className="data-[state=checked]:bg-primary"
                              />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t p-4 bg-gray-50/50">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 px-6">
                        <Save className="h-4 w-4 mr-2" /> Save Company Settings
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
