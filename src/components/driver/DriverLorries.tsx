import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ArrowLeft, Truck, MapPin, Fuel, CheckCircle, Clock, AlertTriangle, Star, Users } from "lucide-react";
import { toast } from "sonner";

const DriverLorries = () => {
  const navigate = useNavigate();
  const [selectedLorry, setSelectedLorry] = useState<string | null>(null);

  // Dummy lorry data
  const [lorries] = useState([
    {
      id: "LRY001",
      registrationNumber: "WMD 1234",
      type: "Company Owned",
      model: "Isuzu NPR75",
      capacity: "3 Ton",
      fuelLevel: 85,
      status: "available",
      location: "Depot A - Jalan Ampang",
      lastService: "2024-01-10",
      mileage: 45000,
      driverAssigned: null,
      features: ["GPS Tracking", "Hydraulic Lift", "Cargo Restraints"],
      rating: 4.8,
      condition: "Excellent"
    },
    {
      id: "LRY002",
      registrationNumber: "WQA 5678",
      type: "Company Owned",
      model: "Mitsubishi Canter",
      capacity: "2 Ton",
      fuelLevel: 60,
      status: "in-use",
      location: "On Route - Jalan Tun Razak",
      lastService: "2024-01-08",
      mileage: 38000,
      driverAssigned: "Ahmad Rahman",
      features: ["GPS Tracking", "Manual Load"],
      rating: 4.5,
      condition: "Good"
    },
    {
      id: "LRY003",
      registrationNumber: "WBA 9876",
      type: "Rental",
      model: "Daihatsu Gran Max",
      capacity: "1 Ton",
      fuelLevel: 40,
      status: "available",
      location: "Rental Partner - Petaling Jaya",
      lastService: "2024-01-12",
      mileage: 22000,
      driverAssigned: null,
      features: ["Basic GPS", "Manual Load"],
      rentalCost: "RM 120/day",
      rating: 4.2,
      condition: "Good"
    },
    {
      id: "LRY004",
      registrationNumber: "WAB 1111",
      type: "Company Owned",
      model: "Isuzu ELF",
      capacity: "4 Ton",
      fuelLevel: 95,
      status: "maintenance",
      location: "Service Center - Shah Alam",
      lastService: "2024-01-15",
      mileage: 65000,
      driverAssigned: null,
      features: ["GPS Tracking", "Hydraulic Lift", "Cargo Restraints", "Air Conditioning"],
      rating: 4.9,
      condition: "Under Maintenance"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-500 text-white";
      case "in-use": return "bg-blue-500 text-white";
      case "maintenance": return "bg-orange-500 text-white";
      case "unavailable": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <CheckCircle className="h-4 w-4" />;
      case "in-use": return <Clock className="h-4 w-4" />;
      case "maintenance": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level >= 70) return "text-emerald-600";
    if (level >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getFuelBarColor = (level: number) => {
    if (level >= 70) return "bg-emerald-500";
    if (level >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Under Maintenance": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleSelectLorry = (lorryId: string) => {
    const lorry = lorries.find(l => l.id === lorryId);
    if (lorry?.status !== "available") {
      toast.error("This lorry is not available for assignment");
      return;
    }
    
    setSelectedLorry(lorryId);
    toast.success(`Selected ${lorry.registrationNumber} for your shift`);
    
    // In a real app, this would update the backend
    setTimeout(() => {
      navigate("/driver/dashboard");
    }, 1500);
  };

  const currentLorry = lorries.find(l => l.driverAssigned === "Ahmad Rahman");

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-screen-xl mx-auto">
      {/* Breadcrumbs */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm">
        <div className="px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  Lorry Selection
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Truck className="h-6 w-6" />
                </div>
                Lorry Selection
              </h1>
              <p className="text-orange-100">Choose your vehicle for today's work</p>
            </div>
            <div className="text-center">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-bold">{lorries.filter(l => l.status === 'available').length}</p>
                <p className="text-sm text-orange-100">Available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Assignment */}
      {currentLorry && (
        <Card className="shadow-sm border-gray-200 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              <Truck className="h-5 w-5" />
              Current Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Truck className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-800">{currentLorry.registrationNumber}</p>
                    <p className="text-emerald-600 font-medium">{currentLorry.model} ({currentLorry.capacity})</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-emerald-700 font-medium">{currentLorry.rating}/5.0</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white px-3 py-1">
                  Currently Assigned
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Lorries Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Available Lorries</h2>
          <p className="text-sm text-gray-600">{lorries.filter(l => l.status === 'available').length} vehicles available</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lorries.map((lorry) => (
            <Card 
              key={lorry.id} 
              className={`cursor-pointer transition-all duration-200 shadow-sm border-gray-200 ${
                selectedLorry === lorry.id ? "ring-2 ring-blue-500 shadow-md border-blue-300" : ""
              } ${lorry.status !== "available" ? "opacity-60" : "hover:shadow-md hover:border-blue-300"}`}
              onClick={() => lorry.status === "available" && handleSelectLorry(lorry.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">{lorry.registrationNumber}</p>
                      <p className="text-gray-600 font-medium">{lorry.model}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {lorry.type}
                        </Badge>
                        <Badge className={`text-xs border ${getConditionColor(lorry.condition)}`}>
                          {lorry.condition}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(lorry.status)} text-xs mb-2 px-3 py-1`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(lorry.status)}
                        {lorry.status}
                      </div>
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{lorry.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Capacity</span>
                    </div>
                    <p className="font-bold text-gray-900">{lorry.capacity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Mileage</span>
                    </div>
                    <p className="font-bold text-gray-900">{lorry.mileage.toLocaleString()} km</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-700 font-medium">{lorry.location}</span>
                </div>
                
                {/* Fuel Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Fuel className={`h-4 w-4 ${getFuelLevelColor(lorry.fuelLevel)}`} />
                      <span className="text-sm font-medium text-gray-700">Fuel Level</span>
                    </div>
                    <span className={`text-sm font-bold ${getFuelLevelColor(lorry.fuelLevel)}`}>
                      {lorry.fuelLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getFuelBarColor(lorry.fuelLevel)}`}
                      style={{ width: `${lorry.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Service Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Last Service</p>
                  <p className="font-medium text-gray-900">{lorry.lastService}</p>
                </div>

                {lorry.rentalCost && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-700 font-medium">Rental Cost: {lorry.rentalCost}</p>
                  </div>
                )}

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 font-medium mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {lorry.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {lorry.driverAssigned && lorry.driverAssigned !== "Ahmad Rahman" && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <p className="text-xs text-blue-700 font-medium">
                        Assigned to: {lorry.driverAssigned}
                      </p>
                    </div>
                  </div>
                )}

                {lorry.status === "available" && (
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLorry(lorry.id);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Select This Lorry
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="shadow-sm border-gray-200 mt-6">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-gray-700 font-medium mb-3">Need help with lorry selection?</p>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Contact Fleet Manager
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverLorries;
