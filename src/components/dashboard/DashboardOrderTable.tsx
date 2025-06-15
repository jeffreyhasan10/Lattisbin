import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Eye, MapPin, User, Clock, UserPlus } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import AddOrderModal from "./AddOrderModal";

const DashboardOrderTable: React.FC = () => {
  const { orders, drivers, assignOrderToDriver } = useOrders();
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      assignOrderToDriver(orderId, driverId);
      toast.success(`Order assigned to ${driver.name}`);
    }
  };

  const handleViewOrder = (orderId: string) => {
    console.log("Viewing order:", orderId);
  };

  // Get available drivers (active status)
  const availableDrivers = drivers.filter(driver => driver.status === 'active');

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Package className="h-5 w-5 text-green-600" />
            Order Management ({orders.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddOrderModalOpen(true)} size="sm">
              Add Order
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
                <TableHead>Order Info</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="hidden lg:table-cell">Assigned Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-white/50 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{order.id}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {order.date} - {order.time}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="font-medium text-gray-900">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium">{order.wasteType}</div>
                    <div className="text-xs text-gray-500">{order.lorryType}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {order.assignedDriverName ? (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{order.assignedDriverName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select onValueChange={(driverId) => handleAssignDriver(order.id, driverId)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDrivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} capitalize border`}>
                      {order.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={`${getPriorityColor(order.priority)} capitalize border`}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="font-bold text-green-600">RM {order.amount.toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewOrder(order.id)}
                        className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!order.assignedDriverName && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          disabled
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <AddOrderModal 
        isOpen={isAddOrderModalOpen} 
        onClose={() => setIsAddOrderModalOpen(false)} 
      />
    </Card>
  );
};

export default DashboardOrderTable;
