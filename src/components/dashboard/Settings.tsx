
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: false,
      weeklyReports: true,
      maintenanceAlerts: true
    },
    preferences: {
      theme: "system",
      language: "en",
      timezone: "GMT+8",
      currency: "MYR"
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      passwordExpiry: "90"
    },
    system: {
      autoBackup: true,
      debugMode: false,
      apiLogging: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  const handleReset = () => {
    // Reset to default settings
    toast.info("Settings reset to default values");
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your application preferences and security</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-sm text-gray-500">Receive important updates via email</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={(value) => updateSetting('notifications', 'emailAlerts', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Automated weekly summary reports</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(value) => updateSetting('notifications', 'weeklyReports', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                  <p className="text-sm text-gray-500">Bin maintenance reminders</p>
                </div>
                <Switch
                  id="maintenanceAlerts"
                  checked={settings.notifications.maintenanceAlerts}
                  onCheckedChange={(value) => updateSetting('notifications', 'maintenanceAlerts', value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.preferences.theme} 
                onValueChange={(value) => updateSetting('preferences', 'theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.preferences.language} 
                onValueChange={(value) => updateSetting('preferences', 'language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.preferences.timezone} 
                onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMT+8">GMT+8 (Malaysia)</SelectItem>
                  <SelectItem value="GMT+7">GMT+7 (Thailand)</SelectItem>
                  <SelectItem value="GMT+9">GMT+9 (Japan)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={settings.preferences.currency} 
                onValueChange={(value) => updateSetting('preferences', 'currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MYR">MYR (Malaysian Ringgit)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="SGD">SGD (Singapore Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="twoFactor"
                  checked={settings.security.twoFactor}
                  onCheckedChange={(value) => updateSetting('security', 'twoFactor', value)}
                />
                {settings.security.twoFactor && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting('security', 'passwordExpiry', e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">Automatic Backup</Label>
                <p className="text-sm text-gray-500">Daily database backups</p>
              </div>
              <Switch
                id="autoBackup"
                checked={settings.system.autoBackup}
                onCheckedChange={(value) => updateSetting('system', 'autoBackup', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debugMode">Debug Mode</Label>
                <p className="text-sm text-gray-500">Enable detailed error logging</p>
                <Badge className="mt-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Development Only
                </Badge>
              </div>
              <Switch
                id="debugMode"
                checked={settings.system.debugMode}
                onCheckedChange={(value) => updateSetting('system', 'debugMode', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="apiLogging">API Logging</Label>
                <p className="text-sm text-gray-500">Log all API requests and responses</p>
              </div>
              <Switch
                id="apiLogging"
                checked={settings.system.apiLogging}
                onCheckedChange={(value) => updateSetting('system', 'apiLogging', value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-gray-600" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">Database</p>
                <p className="text-sm text-green-600 dark:text-green-400">Connected</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">API Services</p>
                <p className="text-sm text-green-600 dark:text-green-400">Operational</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Last Backup</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">2 hours ago</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
