
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Star,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  icNumber: string;
  address: string;
  joinDate: string;
  status: "Active" | "Inactive" | "Suspended";
  totalOrders: number;
  completedOrders: number;
  earnings: number;
  rating: number;
  vehicleInfo: {
    plateNumber: string;
    model: string;
    capacity: string;
  };
}

const DriverManagement = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "DRV001",
      name: "Ahmad Rahman",
      email: "ahmad.rahman@email.com",
      phone: "012-3456789",
      icNumber: "920815-14-5678",
      address: "123 Jalan Tun Razak, Kuala Lumpur",
      joinDate: "2023-01-15",
      status: "Active",
      totalOrders: 145,
      completedOrders: 140,
      earnings: 8500,
      rating: 4.8,
      vehicleInfo: {
        plateNumber: "WBM 1234",
        model: "Isuzu NKR",
        capacity: "3 tons"
      }
    },
    {
      id: "DRV002",
      name: "Lim Wei Ming",
      email: "lim.weiming@email.com",
      phone: "017-8901234",
      icNumber: "880422-05-1234",
      address: "456 Jalan Bukit Bintang, Kuala Lumpur",
      joinDate: "2023-03-20",
      status: "Active",
      totalOrders: 128,
      completedOrders: 125,
      earnings: 7800,
      rating: 4.9,
      vehicleInfo: {
        plateNumber: "WBM 5678",
        model: "Mitsubishi Canter",
        capacity: "2.5 tons"
      }
    },
    {
      id: "DRV003",
      name: "Raj Kumar",
      email: "raj.kumar@email.com",
      phone: "019-2345678",
      icNumber: "750308-01-9876",
      address: "789 Jalan Raja Laut, Kuala Lumpur",
      joinDate: "2022-11-10",
      status: "Inactive",
      totalOrders: 89,
      completedOrders: 85,
      earnings: 5200,
      rating: 4.6,
      vehicleInfo: {
        plateNumber: "WBM 9012",
        model: "Hino Dutro",
        capacity: "4 tons"
      }
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    icNumber: "",
    address: "",
    plateNumber: "",
    vehicleModel: "",
    vehicleCapacity: ""
  });

  const generateDriverId = () => {
    const lastId = drivers.length > 0 ? Math.max(...drivers.map(d => parseInt(d.id.replace('DRV', '')))) : 0;
    return `DRV${String(lastId + 1).padStart(3, '0')}`;
  };

  const handleCreateDriver = () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.icNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const driverId = generateDriverId();
    const driver: Driver = {
      id: driverId,
      name: newDriver.name,
      email: newDriver.email,
      phone: newDriver.phone,
      icNumber: newDriver.icNumber,
      address: newDriver.address,
      joinDate: new Date().toISOString().split('T')[0],
      status: "Active",
      totalOrders: 0,
      completedOrders: 0,
      earnings: 0,
      rating: 0,
      vehicleInfo: {
        plateNumber: newDriver.plateNumber,
        model: newDriver.vehicleModel,
        capacity: newDriver.vehicleCapacity
      }
    };

    setDrivers([...drivers, driver]);
    setNewDriver({
      name: "",
      email: "",
      phone: "",
      icNumber: "",
      address: "",
      plateNumber: "",
      vehicleModel: "",
      vehicleCapacity: ""
    });
    setIsCreateModalOpen(false);
    toast.success(`Driver ${driverId} created successfully!`);
  };

  const handleStatusChange = (driverId: string, newStatus: "Active" | "Inactive" | "Suspended") => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, status: newStatus } : driver
    ));
    toast.success(`Driver status updated to ${newStatus}`);
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(drivers.filter(driver => driver.id !== driverId));
    toast.success("Driver deleted successfully");
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Inactive": return <XCircle className="h-4 w-4 text-gray-500" />;
      case "Suspended": return <Clock className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Driver Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage driver accounts and assignments</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Driver Account</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  placeholder="Driver's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                  placeholder="driver@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  placeholder="012-3456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ic">IC Number *</Label>
                <Input
                  id="ic"
                  value={newDriver.icNumber}
                  onChange={(e) => setNewDriver({...newDriver, icNumber: e.target.value})}
                  placeholder="YYMMDD-PB-XXXX"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newDriver.address}
                  onChange={(e) => setNewDriver({...newDriver, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">Vehicle Plate Number</Label>
                <Input
                  id="plate"
                  value={newDriver.plateNumber}
                  onChange={(e) => setNewDriver({...newDriver, plateNumber: e.target.value})}
                  placeholder="WBM 1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Vehicle Model</Label>
                <Input
                  id="model"
                  value={newDriver.vehicleModel}
                  onChange={(e) => setNewDriver({...newDriver, vehicleModel: e.target.value})}
                  placeholder="Isuzu NKR"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Vehicle Capacity</Label>
                <Input
                  id="capacity"
                  value={newDriver.vehicleCapacity}
                  onChange={(e) => setNewDriver({...newDriver, vehicleCapacity: e.target.value})}
                  placeholder="3 tons"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDriver}>
                Create Driver Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search by name, driver ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Drivers ({filteredDrivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-500">{driver.id}</p>
                      <p className="text-xs text-gray-400">Joined: {driver.joinDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {driver.phone}
                      </div>
                      {driver.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {driver.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{driver.vehicleInfo.plateNumber}</p>
                      <p className="text-sm text-gray-500">{driver.vehicleInfo.model}</p>
                      <p className="text-xs text-gray-400">{driver.vehicleInfo.capacity}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm">{driver.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {driver.completedOrders}/{driver.totalOrders} orders
                      </p>
                      <p className="text-xs text-green-600">RM {driver.earnings}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(driver.status)}
                      <Select
                        value={driver.status}
                        onValueChange={(value) => handleStatusChange(driver.id, value as any)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDriver(driver.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Driver Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Driver Details - {selectedDriver?.id}</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm">{selectedDriver.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">IC Number</Label>
                    <p className="text-sm">{selectedDriver.icNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{selectedDriver.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedDriver.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm">{selectedDriver.address || "Not provided"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Plate Number</Label>
                    <p className="text-sm">{selectedDriver.vehicleInfo.plateNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Vehicle Model</Label>
                    <p className="text-sm">{selectedDriver.vehicleInfo.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Capacity</Label>
                    <p className="text-sm">{selectedDriver.vehicleInfo.capacity}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedDriver.totalOrders}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedDriver.completedOrders}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{selectedDriver.rating.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">RM {selectedDriver.earnings}</p>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverManagement;
