import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Eye, Edit, UserCheck, DollarSign, Package, Activity, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  icNumber: string;
  hpNumber: string;
  address: string;
  totalEarnings: number;
  totalCollections: number;
  currentAssignment: string | null;
  binAllocated: string | null;
  status: "Active" | "On Duty" | "Off Duty" | "Leave";
  areaOfOperation: string;
  joinDate: string;
  email?: string;
}

const DRIVER_STATUSES = ["Active", "On Duty", "Off Duty", "Leave"];

const DriverManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: "",
    icNumber: "",
    hpNumber: "",
    address: "",
    email: "",
    areaOfOperation: "",
    status: "Active",
    currentAssignment: null,
    binAllocated: null
  });

  // Sample drivers data
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "DRV-001",
      name: "Ahmad bin Hassan",
      icNumber: "850123-10-5678",
      hpNumber: "+60123456789",
      address: "No. 45, Jalan Sentosa, Taman Desa, 58100 Kuala Lumpur",
      totalEarnings: 15750.50,
      totalCollections: 127,
      currentAssignment: "Order #12345",
      binAllocated: "ASR-100",
      status: "On Duty",
      areaOfOperation: "Downtown",
      joinDate: "2023-05-15",
      email: "ahmad.hassan@lattisbin.com"
    },
    {
      id: "DRV-002",
      name: "Raj Kumar",
      icNumber: "900215-08-3456",
      hpNumber: "+60198765432",
      address: "12A, Jalan Bukit, Bandar Sunway, 47500 Selangor",
      totalEarnings: 22340.75,
      totalCollections: 184,
      currentAssignment: null,
      binAllocated: null,
      status: "Active",
      areaOfOperation: "Industrial Zone",
      joinDate: "2022-11-20",
      email: "raj.kumar@lattisbin.com"
    },
    {
      id: "DRV-003",
      name: "Lee Wei Ming",
      icNumber: "880930-14-7890",
      hpNumber: "+60176543210",
      address: "Lot 23, Taman Permata, 43000 Kajang, Selangor",
      totalEarnings: 18920.25,
      totalCollections: 156,
      currentAssignment: "Order #12346",
      binAllocated: "LASR-150",
      status: "On Duty",
      areaOfOperation: "Residential",
      joinDate: "2023-01-10",
      email: "lee.weiming@lattisbin.com"
    },
    {
      id: "DRV-004",
      name: "Muthu Selvam",
      icNumber: "920418-03-2345",
      hpNumber: "+60134567890",
      address: "56, Jalan Harmoni, Puchong, 47100 Selangor",
      totalEarnings: 12450.00,
      totalCollections: 98,
      currentAssignment: null,
      binAllocated: null,
      status: "Off Duty",
      areaOfOperation: "Commercial",
      joinDate: "2023-08-05",
      email: "muthu.selvam@lattisbin.com"
    },
    {
      id: "DRV-005",
      name: "Siti Nurhaliza",
      icNumber: "870625-12-4567",
      hpNumber: "+60167890123",
      address: "89, Jalan Mawar, Shah Alam, 40000 Selangor",
      totalEarnings: 19670.80,
      totalCollections: 162,
      currentAssignment: "Order #12347",
      binAllocated: "PWD-200",
      status: "On Duty",
      areaOfOperation: "Downtown",
      joinDate: "2022-09-12",
      email: "siti.nurhaliza@lattisbin.com"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Active": "bg-green-100 text-green-700 border-green-300",
      "On Duty": "bg-blue-100 text-blue-700 border-blue-300",
      "Off Duty": "bg-gray-100 text-gray-700 border-gray-300",
      "Leave": "bg-orange-100 text-orange-700 border-orange-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.icNumber.includes(searchTerm) ||
                         driver.hpNumber.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || driver.status === filterStatus;
    const matchesArea = filterArea === "all" || driver.areaOfOperation === filterArea;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterArea]);

  const areas = Array.from(new Set(drivers.map(d => d.areaOfOperation)));

  const handleAddNew = () => {
    setEditingDriver(null);
    setFormData({
      name: "",
      icNumber: "",
      hpNumber: "",
      address: "",
      email: "",
      areaOfOperation: "",
      status: "Active",
      currentAssignment: null,
      binAllocated: null
    });
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData(driver);
    setIsAddEditModalOpen(true);
  };

  const handleViewDetails = (driverId: string) => {
    navigate(`/admin/drivers/details/${driverId}`);
  };

  const handleSaveDriver = () => {
    if (!formData.name || !formData.icNumber || !formData.hpNumber || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingDriver) {
      // Update existing driver
      setDrivers(drivers.map(driver => 
        driver.id === editingDriver.id 
          ? { ...driver, ...formData } as Driver
          : driver
      ));
      toast.success("Driver updated successfully!");
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
        name: formData.name!,
        icNumber: formData.icNumber!,
        hpNumber: formData.hpNumber!,
        address: formData.address!,
        email: formData.email,
        areaOfOperation: formData.areaOfOperation!,
        status: formData.status as Driver["status"] || "Active",
        currentAssignment: null,
        binAllocated: null,
        totalEarnings: 0,
        totalCollections: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setDrivers([...drivers, newDriver]);
      toast.success("Driver added successfully!");
    }

    setIsAddEditModalOpen(false);
  };

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === "Active").length,
    onDuty: drivers.filter(d => d.status === "On Duty").length,
    totalEarnings: drivers.reduce((sum, d) => sum + d.totalEarnings, 0),
    totalCollections: drivers.reduce((sum, d) => sum + d.totalCollections, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Drivers</h1>
          <p className="text-gray-600 mt-1">View, add, and manage driver profiles and performance</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">{stats.active}</span>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">On Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">{stats.onDuty}</span>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-indigo-600">{stats.totalCollections}</span>
              <Package className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">RM {stats.totalEarnings.toFixed(2)}</span>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID, IC, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {DRIVER_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table - Desktop View */}
      <Card className="hidden md:block">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Driver List ({filteredDrivers.length})</CardTitle>
              <CardDescription>Complete list of all registered drivers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Show:</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>IC Number</TableHead>
                  <TableHead>HP Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Current Assignment</TableHead>
                  <TableHead>Bin Allocated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      No drivers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-xs text-gray-500">{driver.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{driver.icNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {driver.hpNumber}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-2">{driver.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{driver.areaOfOperation}</TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">
                          RM {driver.totalEarnings.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">
                          {driver.totalCollections}
                        </span>
                      </TableCell>
                      <TableCell>
                        {driver.currentAssignment ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            {driver.currentAssignment}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">No assignment</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {driver.binAllocated ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 font-mono">
                            {driver.binAllocated}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(driver.status)}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(driver.id)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(driver)}
                            className="hover:bg-orange-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredDrivers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredDrivers.length)} of {filteredDrivers.length} drivers
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-9 h-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Driver List ({filteredDrivers.length})</h2>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredDrivers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No drivers found matching your criteria
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <CardDescription className="mt-1">{driver.id}</CardDescription>
                    </div>
                    <Badge className={getStatusBadge(driver.status)}>
                      {driver.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">IC Number:</span>
                      <p className="font-medium font-mono">{driver.icNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{driver.hpNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Area:</span>
                      <p className="font-medium">{driver.areaOfOperation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Earnings:</span>
                      <p className="font-bold text-green-600">RM {driver.totalEarnings.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Collections:</span>
                      <p className="font-semibold text-blue-600">{driver.totalCollections}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Assignment:</span>
                      <p className="font-medium text-xs">{driver.currentAssignment || "None"}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Address:</span>
                    <p className="font-medium text-sm">{driver.address}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(driver.id)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(driver)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Mobile Pagination */}
            <div className="space-y-3">
              <div className="text-sm text-gray-600 text-center">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredDrivers.length)} of {filteredDrivers.length} drivers
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-9 h-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Driver Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
            <DialogDescription>
              {editingDriver 
                ? "Update the driver's details below"
                : "Fill in the details to add a new driver to your system"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Driver Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icNumber">IC Number *</Label>
                <Input
                  id="icNumber"
                  placeholder="e.g., 850123-10-5678"
                  value={formData.icNumber}
                  onChange={(e) => setFormData({ ...formData, icNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hpNumber">HP (Contact) Number *</Label>
                <Input
                  id="hpNumber"
                  placeholder="e.g., +60123456789"
                  value={formData.hpNumber}
                  onChange={(e) => setFormData({ ...formData, hpNumber: e.target.value })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="driver@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaOfOperation">Area of Operation *</Label>
                <Input
                  id="areaOfOperation"
                  placeholder="e.g., Downtown"
                  value={formData.areaOfOperation}
                  onChange={(e) => setFormData({ ...formData, areaOfOperation: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(status) => setFormData({ ...formData, status: status as Driver["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVER_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingDriver && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="currentAssignment">Current Assignment</Label>
                    <Input
                      id="currentAssignment"
                      placeholder="e.g., Order #12345"
                      value={formData.currentAssignment || ""}
                      onChange={(e) => setFormData({ ...formData, currentAssignment: e.target.value || null })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="binAllocated">Bin Allocated</Label>
                    <Input
                      id="binAllocated"
                      placeholder="e.g., ASR-100"
                      value={formData.binAllocated || ""}
                      onChange={(e) => setFormData({ ...formData, binAllocated: e.target.value || null })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDriver} className="bg-blue-600 hover:bg-blue-700">
              {editingDriver ? "Update Driver" : "Save Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverManagement;

