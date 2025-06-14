
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  FileText,
  Award,
  Globe,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
  Camera,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const CompanyDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [companyData, setCompanyData] = useState({
    name: "Lattis Environmental Waste Management",
    email: "info@lattis.com",
    phone: "+60 3-1234 5678",
    address: "123 Green Valley, Kuala Lumpur, Malaysia",
    founded: "2018",
    employees: "50-100",
    website: "www.lattis.com",
    description: "Leading environmental waste management company specializing in sustainable bin rental and waste collection services across Malaysia.",
    services: ["Bin Rental", "Waste Collection", "Environmental Consulting", "Recycling Services"],
    certifications: ["ISO 14001", "Malaysian Green Certificate", "Waste Management License"],
  });

  const [formData, setFormData] = useState(companyData);

  useEffect(() => {
    setFormData(companyData);
  }, [companyData]);

  const handleSave = () => {
    setCompanyData(formData);
    setIsEditing(false);
    toast.success("Company details updated successfully!");
  };

  const handleCancel = () => {
    setFormData(companyData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Company Details</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your company information and settings
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </div>

        {/* Company Overview Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">{companyData.name}</CardTitle>
                <CardDescription className="text-blue-100">
                  Environmental Waste Management Company
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Company Description</Label>
                      {isEditing ? (
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          className="mt-1"
                          rows={4}
                        />
                      ) : (
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{companyData.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Founded</Label>
                        {isEditing ? (
                          <Input
                            value={formData.founded}
                            onChange={(e) => handleInputChange("founded", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{companyData.founded}</p>
                        )}
                      </div>
                      <div>
                        <Label>Employees</Label>
                        {isEditing ? (
                          <Input
                            value={formData.employees}
                            onChange={(e) => handleInputChange("employees", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{companyData.employees}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Website</Label>
                      {isEditing ? (
                        <Input
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-blue-600 dark:text-blue-400">{companyData.website}</p>
                      )}
                    </div>

                    <div>
                      <Label>Certifications</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {companyData.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{companyData.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{companyData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      <div className="mt-1 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <span className="text-gray-600 dark:text-gray-400">{companyData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-6 mt-6">
                <div>
                  <Label>Services Offered</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {companyData.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">150+</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">500+</h3>
              <p className="text-gray-600 dark:text-gray-400">Completed Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">6</h3>
              <p className="text-gray-600 dark:text-gray-400">Years in Business</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</h3>
              <p className="text-gray-600 dark:text-gray-400">Cities Served</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDetails;
