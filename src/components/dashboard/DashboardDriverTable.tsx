import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Eye, Star, Phone, MapPin } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import AddDriverModal from "./AddDriverModal";

const DashboardDriverTable: React.FC = () => {
  const { drivers } = useOrders();
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-gray-100 text-gray-800 border-gray-200";
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
            <Truck className="h-5 w-5 text-blue-600" />
            Driver Management ({drivers.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddDriverModalOpen(true)} size="sm">
              Add Driver
            </Button>
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
                <TableHead>Driver Info</TableHead>
                <TableHead className="hidden sm:table-cell">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Performance</TableHead>
                <TableHead className="hidden lg:table-cell">Earnings</TableHead>
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
                      {driver.icNumber && (
                        <div className="text-xs text-gray-400">IC: {driver.icNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {driver.phone}
                      </div>
                      {driver.email && (
                        <div className="text-xs text-gray-500">{driver.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium">{driver.vehicle}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {driver.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(driver.status)} capitalize border`}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{driver.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {driver.completedOrders || 0} orders
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="font-bold text-green-600">
                      RM {(driver.totalEarnings || 0).toFixed(2)}
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
      
      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)} 
      />
    </Card>
  );
};

export default DashboardDriverTable;
