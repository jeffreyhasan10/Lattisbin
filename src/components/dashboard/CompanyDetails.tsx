
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";

const CompanyDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "Lattis Bin Management Sdn Bhd",
    registrationNumber: "202301234567",
    address: "No. 123, Jalan Teknologi 3/1, Taman Sains Selangor 1, 81300 Skudai, Johor",
    phone: "+60 7-1234 5678",
    email: "info@lattisbin.com",
    website: "www.lattisbin.com",
    established: "2023",
    description: "Leading waste management and bin rental services provider in Malaysia, specializing in construction site waste solutions and sustainable disposal practices."
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, this would save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Company Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company information and settings</p>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </motion.div>

      {/* Company Information Card */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                {isEditing ? (
                  <Input
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{companyData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="regNumber">Registration Number</Label>
                {isEditing ? (
                  <Input
                    id="regNumber"
                    value={companyData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{companyData.registrationNumber}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={companyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <p className="text-gray-900 dark:text-gray-100">{companyData.address}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900 dark:text-gray-100">{companyData.phone}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900 dark:text-gray-100">{companyData.email}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900 dark:text-gray-100">{companyData.website}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="established">Established</Label>
                {isEditing ? (
                  <Input
                    id="established"
                    value={companyData.established}
                    onChange={(e) => handleInputChange('established', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900 dark:text-gray-100">{companyData.established}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Company Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={companyData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-white dark:bg-gray-800"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">{companyData.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">150+</h3>
            <p className="text-gray-600 dark:text-gray-400">Active Customers</p>
            <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">500+</h3>
            <p className="text-gray-600 dark:text-gray-400">Bins Deployed</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Active Fleet
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</h3>
            <p className="text-gray-600 dark:text-gray-400">Locations</p>
            <Badge className="mt-2 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              Malaysia
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetails;
