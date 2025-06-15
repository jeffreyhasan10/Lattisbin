import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Play, 
  DollarSign,
  User,
  Phone,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

const DriverDashboard: React.FC = () => {
  const { orders, startOrder, completeOrder, cancelOrder, updatePaymentStatus } = useOrders();
  const [driverSession, setDriverSession] = useState<any>(null);
  const [driverOrders, setDriverOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [driverNotes, setDriverNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (session) {
      const parsedSession = JSON.parse(session);
      setDriverSession(parsedSession);
      
      // Filter orders for this driver
      const myOrders = orders.filter(order => 
        order.assignedDriverId === parsedSession.driverId ||
        (order.assignedDriverName === parsedSession.name && 
         ['assigned', 'in-progress', 'completed'].includes(order.status))
      );
      setDriverOrders(myOrders);
    }
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned": return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStartOrder = (orderId: string) => {
    startOrder(orderId);
    toast.success("Order started successfully!");
  };

  const handleCompleteOrder = (orderId: string) => {
    completeOrder(orderId);
    setDriverNotes("");
    setSelectedOrder(null);
    toast.success("Order completed successfully!");
  };

  const handleCancelOrder = (orderId: string) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    cancelOrder(orderId, cancelReason);
    setCancelReason("");
    setSelectedOrder(null);
    toast.success("Order cancelled");
  };

  const handlePaymentComplete = (orderId: string) => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    updatePaymentStatus(orderId, 'paid');
    
    setPaymentAmount("");
    setSelectedOrder(null);
    toast.success("Payment recorded successfully!");
  };

  if (!driverSession) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Not Logged In</h2>
            <p className="text-gray-600">Please log in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayOrders = driverOrders.filter(order => order.date === new Date().toISOString().split('T')[0]);
  const completedToday = todayOrders.filter(order => order.status === 'completed').length;
  const totalEarnings = driverOrders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + (order.paidAmount || order.amount), 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Driver Info Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Welcome, {driverSession.name}
          </CardTitle>
          <div className="flex items-center gap-4 text-green-100">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {driverSession.phone}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{driverOrders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedToday}</p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {driverOrders.filter(o => ['assigned', 'in-progress'].includes(o.status)).length}
                </p>
                <p className="text-sm text-gray-600">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">RM {totalEarnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            My Orders ({driverOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Info</TableHead>
                  <TableHead className="hidden sm:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Payment</TableHead>
                  <TableHead className="hidden lg:table-cell">Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driverOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.date} - {order.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} capitalize border`}>
                        {order.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge className={`${getPaymentStatusColor(order.paymentStatus)} capitalize border`}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="font-bold text-green-600">RM {order.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {order.status === 'assigned' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStartOrder(order.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {order.status === 'in-progress' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Complete Order {order.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Driver Notes</label>
                                  <Textarea
                                    value={driverNotes}
                                    onChange={(e) => setDriverNotes(e.target.value)}
                                    placeholder="Add any notes about the completion..."
                                    rows={3}
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleCompleteOrder(order.id)}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  Complete Order
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {order.status === 'completed' && order.paymentStatus === 'pending' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Record Payment - Order {order.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Payment Amount (RM)</label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder={`Expected: ${order.amount.toFixed(2)}`}
                                  />
                                </div>
                                <Button 
                                  onClick={() => handlePaymentComplete(order.id)}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  Record Payment
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {['assigned', 'in-progress'].includes(order.status) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Order {order.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Reason for Cancellation</label>
                                  <Textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Please provide a reason for cancelling this order..."
                                    rows={3}
                                    required
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="w-full bg-red-600 hover:bg-red-700"
                                >
                                  Cancel Order
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
