
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Eye, MapPin, User, Clock } from "lucide-react";
import AddOrderModal from "./AddOrderModal";

const DashboardOrderTable: React.FC = () => {
  const orders = [
    {
      id: "ORD001",
      customer: "ABC Construction",
      service: "Waste Collection",
      location: "KLCC, KL",
      driver: "Ahmad Rahman",
      amount: "RM 450.00",
      status: "completed",
      priority: "high",
      scheduledDate: "Today, 2:00 PM"
    },
    {
      id: "ORD002",
      customer: "XYZ Corporation", 
      service: "Bin Rental",
      location: "Petaling Jaya",
      driver: "Lim Wei Ming",
      amount: "RM 280.00",
      status: "in-progress",
      priority: "medium",
      scheduledDate: "Today, 3:30 PM"
    },
    {
      id: "ORD003",
      customer: "Tech Plaza Mall",
      service: "Recycling",
      location: "Mid Valley, KL",
      driver: "Raj Kumar",
      amount: "RM 520.00",
      status: "pending",
      priority: "low",
      scheduledDate: "Tomorrow, 10:00 AM"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
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

  const handleViewOrder = (orderId: string) => {
    console.log("Viewing order:", orderId);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Package className="h-5 w-5 text-green-600" />
            Order Management
          </CardTitle>
          <div className="flex gap-2">
            <AddOrderModal />
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
                <TableHead className="hidden lg:table-cell">Driver</TableHead>
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
                        {order.scheduledDate}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="font-medium text-gray-900">{order.customer}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium">{order.service}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User className="h-3 w-3" />
                      {order.driver}
                    </div>
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
                    <div className="font-bold text-green-600">{order.amount}</div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewOrder(order.id)}
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

export default DashboardOrderTable;
