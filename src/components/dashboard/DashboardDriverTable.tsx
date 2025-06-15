
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Eye, Phone, MapPin } from "lucide-react";
import AddDriverModal from "./AddDriverModal";

const DashboardDriverTable: React.FC = () => {
  const drivers = [
    {
      id: "D001",
      name: "Ahmad Rahman",
      phone: "+60 12-345 6789",
      vehicle: "Lorry WMD1234",
      status: "active",
      location: "KLCC, KL",
      orders: 8,
      rating: 4.8
    },
    {
      id: "D002", 
      name: "Lim Wei Ming",
      phone: "+60 16-789 0123",
      vehicle: "Truck ABC5678",
      status: "active",
      location: "Petaling Jaya",
      orders: 6,
      rating: 4.6
    },
    {
      id: "D003",
      name: "Raj Kumar",
      phone: "+60 19-456 7890",
      vehicle: "Van DEF9012",
      status: "maintenance",
      location: "Service Center",
      orders: 0,
      rating: 4.9
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDriver = (driverId: string) => {
    console.log("Viewing driver:", driverId);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="h-5 w-5 text-blue-600" />
            Driver Management
          </CardTitle>
          <div className="flex gap-2">
            <AddDriverModal />
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90"
            >
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead className="hidden sm:table-cell">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Orders</TableHead>
                <TableHead className="hidden lg:table-cell">Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id} className="hover:bg-white/50 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.id}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      {driver.phone}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium">{driver.vehicle}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(driver.status)} capitalize border`}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {driver.location}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium">{driver.orders}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{driver.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDriver(driver.id)}
                      className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardDriverTable;
