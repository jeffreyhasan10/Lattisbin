
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, MapPin, Fuel, CheckCircle, Clock, AlertTriangle } from "lucide-react";
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
      features: ["GPS Tracking", "Hydraulic Lift", "Cargo Restraints"]
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
      features: ["GPS Tracking", "Manual Load"]
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
      rentalCost: "RM 120/day"
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
      features: ["GPS Tracking", "Hydraulic Lift", "Cargo Restraints", "Air Conditioning"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "in-use": return "bg-blue-500";
      case "maintenance": return "bg-yellow-500";
      case "unavailable": return "bg-red-500";
      default: return "bg-gray-500";
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
    if (level >= 70) return "text-green-600";
    if (level >= 30) return "text-yellow-600";
    return "text-red-600";
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/driver/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Lorry Selection</h1>
              <p className="text-sm text-gray-600">Choose your vehicle for today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Current Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              Current Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-xl font-bold text-green-600">WQA 5678</p>
              <p className="text-sm text-gray-600">Mitsubishi Canter (2 Ton)</p>
              <Badge className="bg-blue-500 text-white mt-2">
                Currently Assigned
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Available Lorries */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Available Lorries</h2>
          
          {lorries.map((lorry) => (
            <Card 
              key={lorry.id} 
              className={`cursor-pointer transition-all ${
                selectedLorry === lorry.id ? "ring-2 ring-green-500 shadow-md" : ""
              } ${lorry.status !== "available" ? "opacity-60" : "hover:shadow-md"}`}
              onClick={() => lorry.status === "available" && handleSelectLorry(lorry.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">{lorry.registrationNumber}</p>
                    <p className="text-sm text-gray-600">{lorry.model}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {lorry.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(lorry.status)} text-white text-xs mb-1`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(lorry.status)}
                        {lorry.status}
                      </div>
                    </Badge>
                    <p className="text-sm font-medium">{lorry.capacity}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{lorry.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Fuel className={`h-4 w-4 ${getFuelLevelColor(lorry.fuelLevel)}`} />
                    <span className={getFuelLevelColor(lorry.fuelLevel)}>Fuel: {lorry.fuelLevel}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="font-medium">{lorry.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Service</p>
                      <p className="font-medium">{lorry.lastService}</p>
                    </div>
                  </div>

                  {lorry.rentalCost && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded">
                      <p className="text-xs text-yellow-800">Rental Cost: {lorry.rentalCost}</p>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {lorry.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {lorry.driverAssigned && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-800">
                        Assigned to: {lorry.driverAssigned}
                      </p>
                    </div>
                  )}
                </div>

                {lorry.status === "available" && (
                  <Button 
                    className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLorry(lorry.id);
                    }}
                  >
                    Select This Lorry
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Need help with lorry selection?</p>
              <Button variant="outline" size="sm">
                Contact Fleet Manager
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverLorries;
