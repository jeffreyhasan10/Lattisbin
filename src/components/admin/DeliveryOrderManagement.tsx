
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, MapPin, QrCode, Camera, User, Clock, Route, CheckCircle, AlertTriangle, Navigation } from "lucide-react";

const DeliveryOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState([
    {
      id: "DO001",
      bookingId: "BOOK001",
      customerName: "ABC Construction Sdn Bhd",
      driverName: "John Doe",
      lorryId: "VEH001",
      binSerialNumber: "ASR001234",
      pickupAddress: "Jalan Ampang, Kuala Lumpur",
      deliveryAddress: "Disposal Site, Semenyih",
      scheduledTime: "09:00",
      actualPickupTime: "09:15",
      status: "in_transit",
      priority: "normal",
      estimatedWeight: 500,
      actualWeight: 485,
      photosTaken: 3,
      qrScanned: true,
      customerSignature: false,
      routeOptimized: true,
      distanceKm: 35,
      estimatedDuration: 90
    },
    {
      id: "DO002",
      bookingId: "BOOK002",
      customerName: "Sarah Lim",
      driverName: "Ali Hassan",
      lorryId: "VEH002",
      binSerialNumber: "LASR005678",
      pickupAddress: "Taman Desa, Kuala Lumpur",
      deliveryAddress: "Recycling Center, Shah Alam",
      scheduledTime: "14:00",
      actualPickupTime: null,
      status: "assigned",
      priority: "high",
      estimatedWeight: 150,
      actualWeight: null,
      photosTaken: 0,
      qrScanned: false,
      customerSignature: false,
      routeOptimized: true,
      distanceKm: 28,
      estimatedDuration: 75
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case "en_route":
        return <Badge className="bg-orange-100 text-orange-800">En Route</Badge>;
      case "at_location":
        return <Badge className="bg-purple-100 text-purple-800">At Location</Badge>;
      case "in_transit":
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "exception":
        return <Badge className="bg-red-100 text-red-800">Exception</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Smart Delivery Order Management
          </h2>
          <p className="text-gray-600 mt-1">Auto-assignment, route optimization, and real-time tracking</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{orders.filter(o => ['assigned', 'en_route', 'at_location', 'in_transit'].includes(o.status)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Route Optimized</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.routeOptimized).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Exceptions</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'exception').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{order.id}
                      <Badge variant="outline" className="text-xs">
                        {order.bookingId}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {order.priority === 'high' && (
                    <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assignment Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Assignment</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.driverName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">{order.lorryId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bin Serial</p>
                      <p className="font-medium flex items-center gap-1">
                        <QrCode className="h-3 w-3" />
                        {order.binSerialNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location & Route */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Route Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Pickup</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-green-500" />
                        {order.pickupAddress.split(',')[0]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-500" />
                        {order.deliveryAddress.split(',')[0]}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="font-medium">{order.distanceKm} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{order.estimatedDuration} min</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress & Verification */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Progress & Verification</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">QR Code Scanned</span>
                      {order.qrScanned ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Photos Taken</span>
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{order.photosTaken}/3</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Customer Signature</span>
                      {order.customerSignature ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">
                        {order.actualWeight ? `${order.actualWeight} kg` : `Est. ${order.estimatedWeight} kg`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Time</p>
                    <p className="font-medium">{order.scheduledTime}</p>
                  </div>
                  {order.actualPickupTime && (
                    <div>
                      <p className="text-sm text-gray-500">Actual Pickup</p>
                      <p className="font-medium">{order.actualPickupTime}</p>
                    </div>
                  )}
                  {order.routeOptimized && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Route className="h-4 w-4" />
                      <span className="text-sm font-medium">Route Optimized</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Navigation className="h-3 w-3 mr-1" />
                  Track Live
                </Button>
                <Button size="sm" variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  View Route
                </Button>
                <Button size="sm" variant="outline">
                  Contact Driver
                </Button>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOrderManagement;
