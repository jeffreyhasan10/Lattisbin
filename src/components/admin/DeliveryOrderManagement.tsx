import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, MapPin, QrCode, Camera, User, Clock, Route, CheckCircle, AlertTriangle, Navigation, Smartphone, Weight, Edit, Zap, Shield, Eye, Phone, MessageSquare } from "lucide-react";
import SmartDeliveryEngine from "@/utils/smartDeliveryEngine";
import ExceptionHandler from "@/utils/exceptionHandler";

interface DeliveryOrder {
  id: string;
  bookingId: string;
  customerName: string;
  companyName: string;
  customerPhone: string;
  driverName: string;
  lorryId: string;
  binSerialNumber: string;
  binCollectionLocation: 'warehouse' | 'customer';
  doBookNumber: string;
  binSize: 'small' | 'medium' | 'large';
  binPrice: number;
  pickupAddress: string;
  deliveryAddress: string;
  scheduledTime: string;
  actualPickupTime: string | null;
  status: "assigned" | "en_route" | "at_location" | "in_transit" | "completed" | "exception";
  priority: "normal" | "high" | "emergency";
  estimatedWeight: number;
  actualWeight: number | null;
  photosTaken: number;
  qrScanned: boolean;
  customerSignature: boolean;
  routeOptimized: boolean;
  distanceKm: number;
  estimatedDuration: number;
  realTimeTracking: boolean;
  trafficDelay: number;
  deliveryWindow: string;
  exceptions: any[];
  autoAssigned: boolean;
  assignmentScore: number;
  paymentMethod: 'cash' | 'online' | 'cheque' | 'cdm' | 'term';
  paymentStatus: 'pending' | 'received' | 'confirmed';
  binCollectionConfirmed: boolean;
  releaseStatus: 'pending' | 'released';
  ownerEditable: boolean;
  invoiceStatus: 'pending' | 'issued' | 'paid';
}

const DeliveryOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      id: "DO001",
      bookingId: "BOOK001",
      customerName: "ABC Construction Sdn Bhd",
      companyName: "ABC Construction Sdn Bhd",
      customerPhone: "+60123456789",
      driverName: "John Doe",
      lorryId: "VEH001",
      binSerialNumber: "ASR001234",
      binCollectionLocation: "warehouse",
      doBookNumber: "DOBOOK001",
      binSize: "large",
      binPrice: 500,
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
      estimatedDuration: 90,
      realTimeTracking: true,
      trafficDelay: 15,
      deliveryWindow: "09:00-11:00",
      exceptions: [],
      autoAssigned: true,
      assignmentScore: 92,
      paymentMethod: "cash",
      paymentStatus: "received",
      binCollectionConfirmed: true,
      releaseStatus: "released",
      ownerEditable: true,
      invoiceStatus: "issued"
    },
    {
      id: "DO002",
      bookingId: "BOOK002", 
      customerName: "Sarah Lim",
      companyName: "Sarah Lim",
      customerPhone: "+60187654321",
      driverName: "Ali Hassan",
      lorryId: "VEH002",
      binSerialNumber: "LASR005678",
      binCollectionLocation: "customer",
      doBookNumber: "DOBOOK002",
      binSize: "medium",
      binPrice: 320,
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
      estimatedDuration: 75,
      realTimeTracking: true,
      trafficDelay: 0,
      deliveryWindow: "14:00-16:00",
      exceptions: [],
      autoAssigned: true,
      assignmentScore: 87,
      paymentMethod: "online",
      paymentStatus: "pending",
      binCollectionConfirmed: false,
      releaseStatus: "pending",
      ownerEditable: true,
      invoiceStatus: "pending"
    }
  ]);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<any>({});
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DeliveryOrder | null>(null);
  const [orderForm, setOrderForm] = useState<Partial<DeliveryOrder>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Simulate real-time tracking updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdates({
        timestamp: new Date().toLocaleTimeString(),
        activeDeliveries: orders.filter(o => ['en_route', 'at_location', 'in_transit'].includes(o.status)).length,
        avgDeliveryTime: 85,
        completionRate: 94.5
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [orders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Auto-Assigned</Badge>;
      case "en_route":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En Route</Badge>;
      case "at_location":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">At Location</Badge>;
      case "in_transit":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Transit</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "exception":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Exception</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleQRScan = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Simulate QR validation
      const mockQRData = JSON.stringify({ serialNumber: order.binSerialNumber });
      const validation = SmartDeliveryEngine.validateQRCode(mockQRData, order.binSerialNumber);
      
      if (validation.valid) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, qrScanned: true } : o
        ));
      }
    }
    setShowQRModal(false);
  };

  const handleWeightCapture = (orderId: string, weight: number) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, actualWeight: weight, photosTaken: 3 } : o
    ));
    setShowWeightModal(false);
  };

  const handleSignatureCapture = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, customerSignature: true, status: 'completed' as const } : o
    ));
    setShowSignatureModal(false);
  };

  const handleException = (orderId: string, type: string, description: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const exception = ExceptionHandler.createException(
        orderId,
        type as any,
        description,
        order.driverName,
        { lat: 3.1390, lng: 101.6869 }
      );
      
      setOrders(orders.map(o => 
        o.id === orderId ? { 
          ...o, 
          status: 'exception' as const, 
          exceptions: [...o.exceptions, exception] 
        } : o
      ));
    }
    setShowExceptionModal(false);
  };

  const optimizeRoute = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const waypoints = [
        { lat: 3.1390, lng: 101.6869 }, // Current location
        { lat: 3.1569, lng: 101.7123 }, // Pickup
        { lat: 2.9667, lng: 101.7333 }  // Delivery
      ];
      
      const optimized = SmartDeliveryEngine.calculateOptimalRoute(waypoints);
      
      setOrders(orders.map(o => 
        o.id === orderId ? { 
          ...o, 
          routeOptimized: true,
          distanceKm: optimized.distance,
          estimatedDuration: optimized.duration,
          trafficDelay: optimized.trafficDelay
        } : o
      ));
    }
  };

  const openCreateOrderModal = () => {
    setEditingOrder(null);
    setOrderForm({
      customerName: '',
      companyName: '',
      customerPhone: '',
      doBookNumber: '',
      lorryId: '',
      binSerialNumber: '',
      binCollectionLocation: 'warehouse',
      binSize: 'medium',
      binPrice: 0,
      pickupAddress: '',
      deliveryAddress: '',
      scheduledTime: '',
      status: 'assigned',
      priority: 'normal',
      estimatedWeight: 0,
      actualWeight: null,
      photosTaken: 0,
      qrScanned: false,
      customerSignature: false,
      routeOptimized: false,
      distanceKm: 0,
      estimatedDuration: 0,
      realTimeTracking: false,
      trafficDelay: 0,
      deliveryWindow: '',
      exceptions: [],
      autoAssigned: false,
      assignmentScore: 0,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      binCollectionConfirmed: false,
      releaseStatus: 'pending',
      ownerEditable: true,
      invoiceStatus: 'pending',
      driverName: '',
      bookingId: '',
      id: ''
    });
    setFormErrors({});
    setShowOrderModal(true);
  };

  const openEditOrderModal = (order: DeliveryOrder) => {
    setEditingOrder(order);
    setOrderForm({ ...order });
    setFormErrors({});
    setShowOrderModal(true);
  };

  const handleOrderFormChange = (field: keyof DeliveryOrder, value: any) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const validateOrderForm = () => {
    const errors: { [key: string]: string } = {};
    if (!orderForm.customerName) errors.customerName = 'Required';
    if (!orderForm.companyName) errors.companyName = 'Required';
    if (!orderForm.customerPhone) errors.customerPhone = 'Required';
    if (!orderForm.doBookNumber) errors.doBookNumber = 'Required';
    if (!orderForm.lorryId) errors.lorryId = 'Required';
    if (!orderForm.binSerialNumber) errors.binSerialNumber = 'Required';
    if (!orderForm.binCollectionLocation) errors.binCollectionLocation = 'Required';
    if (!orderForm.binSize) errors.binSize = 'Required';
    if (!orderForm.binPrice || orderForm.binPrice <= 0) errors.binPrice = 'Required';
    if (!orderForm.pickupAddress) errors.pickupAddress = 'Required';
    if (!orderForm.deliveryAddress) errors.deliveryAddress = 'Required';
    if (!orderForm.scheduledTime) errors.scheduledTime = 'Required';
    if (!orderForm.deliveryWindow) errors.deliveryWindow = 'Required';
    if (!orderForm.paymentMethod) errors.paymentMethod = 'Required';
    if (!orderForm.paymentStatus) errors.paymentStatus = 'Required';
    if (!orderForm.releaseStatus) errors.releaseStatus = 'Required';
    if (!orderForm.invoiceStatus) errors.invoiceStatus = 'Required';
    return errors;
  };

  const handleOrderFormSave = () => {
    const errors = validateOrderForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (editingOrder) {
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...editingOrder, ...orderForm, id: editingOrder.id } as DeliveryOrder : o));
    } else {
      const newId = `DO${String(orders.length + 1).padStart(3, '3')}`;
      setOrders(prev => [
        { ...orderForm, id: newId, bookingId: `BOOK${String(orders.length + 1).padStart(3, '3')}` } as DeliveryOrder,
        ...prev
      ]);
    }
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
             Smart Delivery Order Management
          </h2>
          <p className="text-gray-600 mt-1">AI-powered assignment, route optimization, and real-time tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Auto-Assign All
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreateOrderModal}>
            <Plus className="h-4 w-4 mr-2" />
            Create Smart Order
          </Button>
        </div>
      </div>

      {/* Real-time Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Live Tracking</p>
                <p className="text-2xl font-bold text-blue-600">
                  {realTimeUpdates.activeDeliveries || 2}
                </p>
                <p className="text-xs text-gray-500">Active deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Auto-Assigned</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.autoAssigned).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Optimized</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.routeOptimized).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">QR Verified</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.qrScanned).length}</p>
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

      {/* Smart Order List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Smart Order #{order.id}
                      <Badge variant="outline" className="text-xs">
                        {order.bookingId}
                      </Badge>
                      {order.autoAssigned && (
                        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          AI Score: {order.assignmentScore}%
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {order.priority === 'emergency' && (
                    <Badge className="bg-red-100 text-red-800">Emergency</Badge>
                  )}
                  {order.realTimeTracking && (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      Live
                    </Badge>
                  )}
                  {/* Payment Status Badge */}
                  <Badge className={
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.paymentStatus === 'received' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }>
                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                  {/* Release Status Badge */}
                  <Badge className={
                    order.releaseStatus === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }>
                    {order.releaseStatus === 'pending' ? 'Not Released' : 'Released'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Assignment & Driver Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Smart Assignment
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-medium">{order.driverName}</p>
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

                {/* Route & Tracking */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Smart Route
                  </h4>
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
                        <p className="text-sm text-gray-500">ETA</p>
                        <p className="font-medium">{order.estimatedDuration} min</p>
                      </div>
                    </div>
                    {order.trafficDelay > 0 && (
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        +{order.trafficDelay}min traffic delay
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verification
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">QR Scanned</span>
                      {order.qrScanned ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowQRModal(true);
                          }}
                        >
                          <QrCode className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Weight Captured</span>
                      <div className="flex items-center gap-1">
                        {order.actualWeight ? (
                          <div className="flex items-center gap-1">
                            <Weight className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{order.actualWeight}kg</span>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowWeightModal(true);
                            }}
                          >
                            <Weight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Digital Signature</span>
                      {order.customerSignature ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowSignatureModal(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Photos</span>
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{order.photosTaken}/3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time & Window */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timing
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Delivery Window</p>
                      <p className="font-medium">{order.deliveryWindow}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Scheduled</p>
                      <p className="font-medium">{order.scheduledTime}</p>
                    </div>
                    {order.actualPickupTime && (
                      <div>
                        <p className="text-sm text-gray-500">Actual Pickup</p>
                        <p className="font-medium">{order.actualPickupTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Live Track
                </Button>
                <Button size="sm" variant="outline" onClick={() => optimizeRoute(order.id)}>
                  <Route className="h-3 w-3 mr-1" />
                  Optimize Route
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Call Driver
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowExceptionModal(true);
                  }}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Report Issue
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEditOrderModal(order)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Scanning Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Scan bin QR code to verify serial number</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowQRModal(false)}>Cancel</Button>
              <Button onClick={() => selectedOrder && handleQRScan(selectedOrder.id)}>
                Simulate Scan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Weight Capture Modal */}
      <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weight & Photo Capture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <Input type="number" placeholder="Enter actual weight" />
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Take photos for evidence</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWeightModal(false)}>Cancel</Button>
              <Button onClick={() => selectedOrder && handleWeightCapture(selectedOrder.id, 485)}>
                Save Weight & Photos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Digital Signature Modal */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Signature Capture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center h-40">
              <Edit className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Customer signature area</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSignatureModal(false)}>Cancel</Button>
              <Button onClick={() => selectedOrder && handleSignatureCapture(selectedOrder.id)}>
                Capture Signature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exception Handling Modal */}
      <Dialog open={showExceptionModal} onOpenChange={setShowExceptionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Delivery Exception</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Exception Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select exception type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_unavailable">Customer Unavailable</SelectItem>
                  <SelectItem value="access_denied">Access Denied</SelectItem>
                  <SelectItem value="bin_issue">Bin Issue</SelectItem>
                  <SelectItem value="vehicle_breakdown">Vehicle Breakdown</SelectItem>
                  <SelectItem value="weather">Weather Conditions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea placeholder="Describe the issue in detail..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExceptionModal(false)}>Cancel</Button>
              <Button onClick={() => selectedOrder && handleException(selectedOrder.id, 'customer_unavailable', 'Customer not available at location')}>
                Report Exception
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delivery Order Create/Edit Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOrder ? 'Edit Delivery Order' : 'Create Delivery Order'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Customer Name" value={orderForm.customerName || ''} onChange={e => handleOrderFormChange('customerName', e.target.value)} />
              {formErrors.customerName && <span className="text-red-500 text-xs">{formErrors.customerName}</span>}
              <Input placeholder="Company Name" value={orderForm.companyName || ''} onChange={e => handleOrderFormChange('companyName', e.target.value)} />
              {formErrors.companyName && <span className="text-red-500 text-xs">{formErrors.companyName}</span>}
              <Input placeholder="Customer Phone" value={orderForm.customerPhone || ''} onChange={e => handleOrderFormChange('customerPhone', e.target.value)} />
              {formErrors.customerPhone && <span className="text-red-500 text-xs">{formErrors.customerPhone}</span>}
            </div>
            {/* DO Book Number, Bin Serial, Lorry, Bin Collection Location */}
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="DO Book Number" value={orderForm.doBookNumber || ''} onChange={e => handleOrderFormChange('doBookNumber', e.target.value)} />
              {formErrors.doBookNumber && <span className="text-red-500 text-xs">{formErrors.doBookNumber}</span>}
              <Input placeholder="Bin Serial Number" value={orderForm.binSerialNumber || ''} onChange={e => handleOrderFormChange('binSerialNumber', e.target.value)} />
              {formErrors.binSerialNumber && <span className="text-red-500 text-xs">{formErrors.binSerialNumber}</span>}
              <Input placeholder="Lorry ID" value={orderForm.lorryId || ''} onChange={e => handleOrderFormChange('lorryId', e.target.value)} />
              {formErrors.lorryId && <span className="text-red-500 text-xs">{formErrors.lorryId}</span>}
              <Input placeholder="Bin Collection Location (warehouse/customer)" value={orderForm.binCollectionLocation || ''} onChange={e => handleOrderFormChange('binCollectionLocation', e.target.value)} />
              {formErrors.binCollectionLocation && <span className="text-red-500 text-xs">{formErrors.binCollectionLocation}</span>}
            </div>
            {/* Bin Size, Price, Payment Method, Payment Status */}
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Bin Size (small/medium/large)" value={orderForm.binSize || ''} onChange={e => handleOrderFormChange('binSize', e.target.value)} />
              {formErrors.binSize && <span className="text-red-500 text-xs">{formErrors.binSize}</span>}
              <Input placeholder="Bin Price" type="number" value={orderForm.binPrice?.toString() || ''} onChange={e => handleOrderFormChange('binPrice', Number(e.target.value))} />
              {formErrors.binPrice && <span className="text-red-500 text-xs">{formErrors.binPrice}</span>}
              <Input placeholder="Payment Method" value={orderForm.paymentMethod || ''} onChange={e => handleOrderFormChange('paymentMethod', e.target.value)} />
              {formErrors.paymentMethod && <span className="text-red-500 text-xs">{formErrors.paymentMethod}</span>}
              <Input placeholder="Payment Status" value={orderForm.paymentStatus || ''} onChange={e => handleOrderFormChange('paymentStatus', e.target.value)} />
              {formErrors.paymentStatus && <span className="text-red-500 text-xs">{formErrors.paymentStatus}</span>}
            </div>
            {/* Bin Collection Confirmed, Release Status, Invoice Status */}
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Bin Collection Confirmed (true/false)" value={orderForm.binCollectionConfirmed ? 'Yes' : 'No'} onChange={e => handleOrderFormChange('binCollectionConfirmed', e.target.value === 'Yes')} />
              <Input placeholder="Release Status (pending/released)" value={orderForm.releaseStatus || ''} onChange={e => handleOrderFormChange('releaseStatus', e.target.value)} />
              {formErrors.releaseStatus && <span className="text-red-500 text-xs">{formErrors.releaseStatus}</span>}
              <Input placeholder="Invoice Status (pending/issued/paid)" value={orderForm.invoiceStatus || ''} onChange={e => handleOrderFormChange('invoiceStatus', e.target.value)} />
              {formErrors.invoiceStatus && <span className="text-red-500 text-xs">{formErrors.invoiceStatus}</span>}
            </div>
            {/* Owner Editable */}
            <div>
              <Input placeholder="Owner Editable (true/false)" value={orderForm.ownerEditable ? 'Yes' : 'No'} onChange={e => handleOrderFormChange('ownerEditable', e.target.value === 'Yes')} />
            </div>
            {/* Pickup/Delivery/Time/Window */}
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Pickup Address" value={orderForm.pickupAddress || ''} onChange={e => handleOrderFormChange('pickupAddress', e.target.value)} />
              {formErrors.pickupAddress && <span className="text-red-500 text-xs">{formErrors.pickupAddress}</span>}
              <Input placeholder="Delivery Address" value={orderForm.deliveryAddress || ''} onChange={e => handleOrderFormChange('deliveryAddress', e.target.value)} />
              {formErrors.deliveryAddress && <span className="text-red-500 text-xs">{formErrors.deliveryAddress}</span>}
              <Input placeholder="Scheduled Time" value={orderForm.scheduledTime || ''} onChange={e => handleOrderFormChange('scheduledTime', e.target.value)} />
              {formErrors.scheduledTime && <span className="text-red-500 text-xs">{formErrors.scheduledTime}</span>}
              <Input placeholder="Delivery Window" value={orderForm.deliveryWindow || ''} onChange={e => handleOrderFormChange('deliveryWindow', e.target.value)} />
              {formErrors.deliveryWindow && <span className="text-red-500 text-xs">{formErrors.deliveryWindow}</span>}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowOrderModal(false)}>Cancel</Button>
              <Button onClick={handleOrderFormSave}>{editingOrder ? 'Save Changes' : 'Create Order'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryOrderManagement;
