
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  TrendingUp, 
  Activity, 
  Eye,
  Plus,
  Filter,
  Search,
  Phone,
  Mail,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Truck
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";

const DriverMonitoring: React.FC = () => {
  const { drivers, orders, addDriver, updateDriver, assignOrderToDriver } = useOrders();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Real-time location updates simulation
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      // Simulate real-time location updates
      drivers.forEach(driver => {
        if (driver.status === 'active') {
          const randomLat = (Math.random() - 0.5) * 0.01;
          const randomLng = (Math.random() - 0.5) * 0.01;
          // In real implementation, this would come from GPS tracking
          console.log(`Driver ${driver.id} location updated`);
        }
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [liveUpdates, drivers]);

  const getDriverOrders = (driverId: string) => {
    return orders.filter(order => order.assignedDriverId === driverId);
  };

  const getDriverPerformance = (driverId: string) => {
    const driverOrders = getDriverOrders(driverId);
    const completedOrders = driverOrders.filter(order => order.status === 'completed');
    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.amount, 0);
    const avgRating = completedOrders.length > 0 ? 4.8 : 0; // Simulate rating
    
    return {
      totalOrders: driverOrders.length,
      completedOrders: completedOrders.length,
      totalEarnings,
      avgRating,
      completionRate: driverOrders.length > 0 ? (completedOrders.length / driverOrders.length) * 100 : 0
    };
  };

  const handleCreateDriver = (driverData: any) => {
    addDriver({
      name: driverData.name,
      phone: driverData.phone,
      vehicle: driverData.vehicle,
      status: 'active',
      location: driverData.location || 'Unknown',
      orders: 0,
      rating: 5.0,
      email: driverData.email,
      icNumber: driverData.icNumber,
      joinDate: new Date().toISOString().split('T')[0],
      loginCredentials: {
        username: driverData.username,
        password: driverData.password
      }
    });
    setShowCreateModal(false);
  };

  const assignOrderToDriverHandler = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      assignOrderToDriver(orderId, driverId, driver.name);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unassignedOrders = orders.filter(order => order.status === 'pending' && !order.assignedDriverId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Live Driver Monitoring
          </h2>
          <p className="text-gray-600 mt-1">Real-time driver tracking and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={liveUpdates ? "default" : "outline"}
            onClick={() => setLiveUpdates(!liveUpdates)}
            className="flex items-center gap-2"
          >
            <Activity className={`h-4 w-4 ${liveUpdates ? 'animate-pulse' : ''}`} />
            {liveUpdates ? 'Live' : 'Paused'}
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Driver Account</DialogTitle>
              </DialogHeader>
              <CreateDriverForm onSubmit={handleCreateDriver} onCancel={() => setShowCreateModal(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {drivers.filter(d => d.status === 'active').length}
                </p>
                <p className="text-sm text-green-600">Active Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {orders.filter(o => o.status === 'in-progress').length}
                </p>
                <p className="text-sm text-blue-600">En Route</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {unassignedOrders.length}
                </p>
                <p className="text-sm text-orange-600">Pending Assignment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  RM {orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">Daily Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Driver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const performance = getDriverPerformance(driver.id);
          const driverOrders = getDriverOrders(driver.id);
          const activeOrder = driverOrders.find(order => order.status === 'in-progress');
          
          return (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        driver.status === 'active' ? 'bg-green-500' : 
                        driver.status === 'maintenance' ? 'bg-orange-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <p className="text-sm text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                  <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                    {driver.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Current Status */}
                {activeOrder && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Navigation className="h-4 w-4" />
                      <span className="font-medium">En Route</span>
                    </div>
                    <p className="text-sm text-blue-600">{activeOrder.customer}</p>
                    <p className="text-xs text-blue-500">{activeOrder.location}</p>
                  </div>
                )}
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Today's Orders</p>
                    <p className="font-bold">{performance.totalOrders}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Completion Rate</p>
                    <p className="font-bold">{performance.completionRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-bold">{performance.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Earnings</p>
                    <p className="font-bold text-green-600">RM {performance.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-3 w-3" />
                    {driver.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {driver.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Truck className="h-3 w-3" />
                    {driver.vehicle}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedDriver(driver.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Assignment Panel */}
      {unassignedOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pending Order Assignments ({unassignedOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unassignedOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.location} • {order.time}</p>
                    <p className="text-sm text-green-600">RM {order.amount}</p>
                  </div>
                  <Select onValueChange={(driverId) => assignOrderToDriverHandler(order.id, driverId)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assign Driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.filter(d => d.status === 'active').map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Create Driver Form Component
const CreateDriverForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    icNumber: '',
    vehicle: '',
    location: 'Kuala Lumpur',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Driver's full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number *</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+60 12-345 6789"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="driver@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label>IC Number *</Label>
          <Input
            value={formData.icNumber}
            onChange={(e) => setFormData({...formData, icNumber: e.target.value})}
            placeholder="YYMMDD-PB-XXXX"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Details *</Label>
          <Input
            value={formData.vehicle}
            onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
            placeholder="Lorry ABC1234"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Base Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Kuala Lumpur"
          />
        </div>
        <div className="space-y-2">
          <Label>Username *</Label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="driver.username"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Password *</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Secure password"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Driver Account</Button>
      </div>
    </form>
  );
};

export default DriverMonitoring;
