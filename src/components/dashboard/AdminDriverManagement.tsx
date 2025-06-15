import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Truck, Eye, Star, Phone, MapPin, Clock, DollarSign, Activity, Search, Filter } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import AddDriverModal from "./AddDriverModal";

const AdminDriverManagement: React.FC = () => {
  const { drivers, orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDriverOrders = (driverId: string) => {
    return orders.filter(order => order.assignedDriverId === driverId);
  };

  const getDriverTodayOrders = (driverId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => 
      order.assignedDriverId === driverId && 
      order.date === today
    );
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDriver = (driverId: string) => {
    console.log("Viewing driver details:", driverId);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-indigo-600" />
            Driver Management
          </h2>
          <p className="text-gray-600 mt-1">Monitor and manage all drivers with real-time status</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDriverModalOpen(true)}>
            Add Driver
          </Button>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Driver Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {drivers.filter(d => d.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {drivers.filter(d => d.status === 'maintenance').length}
                </p>
                <p className="text-sm text-gray-600">In Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => ['assigned', 'in-progress'].includes(o.status)).length}
                </p>
                <p className="text-sm text-gray-600">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  RM {drivers.reduce((sum, d) => sum + (d.totalEarnings || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers by name, phone, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Truck className="h-5 w-5 text-indigo-600" />
            All Drivers ({filteredDrivers.length})
          </CardTitle>
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
                  <TableHead className="hidden md:table-cell">Today's Orders</TableHead>
                  <TableHead className="hidden lg:table-cell">Performance</TableHead>
                  <TableHead className="hidden lg:table-cell">Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => {
                  const driverOrders = getDriverOrders(driver.id);
                  const todayOrders = getDriverTodayOrders(driver.id);
                  
                  return (
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
                          <div className="text-sm font-medium">{todayOrders.length} orders</div>
                          <div className="text-xs text-gray-500">
                            {todayOrders.filter(o => o.status === 'completed').length} completed
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm font-medium">{driver.rating}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {driver.completedOrders || 0} total orders
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)} 
      />
    </div>
  );
};

export default AdminDriverManagement;
