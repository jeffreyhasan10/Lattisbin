
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Activity, 
  Eye, 
  Navigation,
  Phone,
  AlertCircle
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";

const DriverMonitoring: React.FC = () => {
  const { drivers, orders, assignOrderToDriver } = useOrders();
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time driver location updates
    const interval = setInterval(() => {
      const updatedData = drivers.map(driver => ({
        ...driver,
        lastUpdate: new Date().toLocaleTimeString(),
        batteryLevel: Math.floor(Math.random() * 100),
        speed: Math.floor(Math.random() * 60),
        coordinates: {
          lat: 3.1390 + (Math.random() - 0.5) * 0.1,
          lng: 101.6869 + (Math.random() - 0.5) * 0.1
        }
      }));
      setRealTimeData(updatedData);
    }, 5000);

    return () => clearInterval(interval);
  }, [drivers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    assignOrderToDriver(orderId, driverId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Live Driver Monitoring
          </h2>
          <p className="text-gray-600 mt-1">Real-time tracking and status of all drivers</p>
        </div>
      </div>

      {/* Driver Status Cards */}
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
              <div className="bg-blue-100 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-600">En Route</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {drivers.filter(d => d.status === 'maintenance').length}
                </p>
                <p className="text-sm text-gray-600">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {drivers.filter(d => d.status === 'offline').length}
                </p>
                <p className="text-sm text-gray-600">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Monitoring Table */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Navigation className="h-5 w-5 text-blue-600" />
            Live Driver Status ({realTimeData.length || drivers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver Info</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Update</TableHead>
                  <TableHead className="hidden lg:table-cell">Vehicle Info</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(realTimeData.length > 0 ? realTimeData : drivers).map((driver) => (
                  <TableRow key={driver.id} className="hover:bg-white/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            driver.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                          }`} />
                          {driver.name}
                        </div>
                        <div className="text-sm text-gray-500">{driver.id}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Phone className="h-3 w-3" />
                          {driver.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={`${getStatusColor(driver.status)} capitalize border`}>
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{driver.location || driver.currentLocation}</span>
                      </div>
                      {driver.coordinates && (
                        <div className="text-xs text-gray-400">
                          {driver.coordinates.lat.toFixed(4)}, {driver.coordinates.lng.toFixed(4)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <div>{driver.lastUpdate || 'Just now'}</div>
                        {driver.speed !== undefined && (
                          <div className="text-xs text-gray-500">{driver.speed} km/h</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <div className="font-medium">{driver.vehicle}</div>
                        {driver.batteryLevel !== undefined && (
                          <div className="text-xs text-gray-500">
                            Battery: {driver.batteryLevel}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
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
    </div>
  );
};

export default DriverMonitoring;
