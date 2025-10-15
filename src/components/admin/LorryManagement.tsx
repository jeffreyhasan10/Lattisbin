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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Search, Filter, Eye, Edit, Truck, UserPlus, AlertTriangle, CheckCircle, Calendar, Weight, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Lorry {
  id: string;
  model: string;
  tonnage: number;
  licensePlate: string;
  roadTaxExpiry: string;
  insuranceExpiry: string;
  status: "Active" | "Maintenance" | "Inactive" | "Assigned";
  assignedDriver?: string;
  driverId?: string;
  lastService?: string;
  totalTrips?: number;
}

const LORRY_STATUSES = ["Active", "Maintenance", "Inactive", "Assigned"];

const LorryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLorry, setEditingLorry] = useState<Lorry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState<Partial<Lorry>>({
    model: "",
    tonnage: 0,
    licensePlate: "",
    roadTaxExpiry: "",
    insuranceExpiry: "",
    status: "Active",
    lastService: ""
  });

  // Sample lorries data
  const [lorries, setLorries] = useState<Lorry[]>([
    {
      id: "LRY-001",
      model: "Hino 500 Series",
      tonnage: 10,
      licensePlate: "WMK 1234",
      roadTaxExpiry: "2025-11-15",
      insuranceExpiry: "2025-12-20",
      status: "Assigned",
      assignedDriver: "Ahmad bin Hassan",
      driverId: "DRV-001",
      lastService: "2025-09-10",
      totalTrips: 245
    },
    {
      id: "LRY-002",
      model: "Isuzu FVZ",
      tonnage: 15,
      licensePlate: "WMK 5678",
      roadTaxExpiry: "2025-10-25",
      insuranceExpiry: "2025-10-30",
      status: "Assigned",
      assignedDriver: "Raj Kumar",
      driverId: "DRV-002",
      lastService: "2025-08-15",
      totalTrips: 312
    },
    {
      id: "LRY-003",
      model: "UD Trucks Quester",
      tonnage: 20,
      licensePlate: "WMK 9012",
      roadTaxExpiry: "2026-02-10",
      insuranceExpiry: "2026-03-15",
      status: "Active",
      lastService: "2025-09-20",
      totalTrips: 189
    },
    {
      id: "LRY-004",
      model: "Mercedes-Benz Actros",
      tonnage: 25,
      licensePlate: "WMK 3456",
      roadTaxExpiry: "2025-10-20",
      insuranceExpiry: "2025-11-05",
      status: "Maintenance",
      lastService: "2025-10-05",
      totalTrips: 278
    },
    {
      id: "LRY-005",
      model: "Scania R Series",
      tonnage: 30,
      licensePlate: "WMK 7890",
      roadTaxExpiry: "2025-12-30",
      insuranceExpiry: "2026-01-15",
      status: "Assigned",
      assignedDriver: "Lee Wei Ming",
      driverId: "DRV-003",
      lastService: "2025-09-01",
      totalTrips: 356
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Active": "bg-green-100 text-green-700 border-green-300",
      "Assigned": "bg-blue-100 text-blue-700 border-blue-300",
      "Maintenance": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Inactive": "bg-gray-100 text-gray-700 border-gray-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  // Check if road tax or insurance is expiring soon (within 30 days)
  const isExpiringSoon = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const filteredLorries = lorries.filter(lorry => {
    const matchesSearch = lorry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lorry.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lorry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || lorry.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLorries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLorries = filteredLorries.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Get lorries with expiring documents
  const expiringLorries = lorries.filter(lorry => 
    isExpiringSoon(lorry.roadTaxExpiry) || 
    isExpiringSoon(lorry.insuranceExpiry) ||
    isExpired(lorry.roadTaxExpiry) ||
    isExpired(lorry.insuranceExpiry)
  );

  const handleAddNew = () => {
    setEditingLorry(null);
    setFormData({
      model: "",
      tonnage: 0,
      licensePlate: "",
      roadTaxExpiry: "",
      insuranceExpiry: "",
      status: "Active",
      lastService: ""
    });
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (lorry: Lorry) => {
    setEditingLorry(lorry);
    setFormData(lorry);
    setIsAddEditModalOpen(true);
  };

  const handleViewTracking = (lorryId: string) => {
    navigate(`/admin/fleet/track/${lorryId}`);
  };

  const handleAssignDriver = (lorryId: string) => {
    navigate(`/admin/fleet/assign/${lorryId}`);
  };

  const handleSaveLorry = () => {
    if (!formData.model || !formData.licensePlate || !formData.roadTaxExpiry || !formData.insuranceExpiry) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingLorry) {
      // Update existing lorry
      setLorries(lorries.map(lorry => 
        lorry.id === editingLorry.id 
          ? { ...lorry, ...formData } as Lorry
          : lorry
      ));
      toast.success("Lorry updated successfully!");
    } else {
      // Add new lorry
      const newLorry: Lorry = {
        id: `LRY-${String(lorries.length + 1).padStart(3, '0')}`,
        model: formData.model!,
        tonnage: formData.tonnage || 0,
        licensePlate: formData.licensePlate!,
        roadTaxExpiry: formData.roadTaxExpiry!,
        insuranceExpiry: formData.insuranceExpiry!,
        status: formData.status as Lorry["status"] || "Active",
        lastService: formData.lastService,
        totalTrips: 0
      };
      setLorries([...lorries, newLorry]);
      toast.success("Lorry added successfully!");
    }

    setIsAddEditModalOpen(false);
  };

  const stats = {
    total: lorries.length,
    active: lorries.filter(l => l.status === "Active").length,
    assigned: lorries.filter(l => l.status === "Assigned").length,
    maintenance: lorries.filter(l => l.status === "Maintenance").length,
    expiring: expiringLorries.length
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Lorries</h1>
          <p className="text-gray-600 mt-1">Complete fleet management with automatic renewal alerts</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Lorry
        </Button>
      </div>

      {/* Expiry Alerts */}
      {expiringLorries.length > 0 && (
        <Alert className="border-orange-300 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Renewal Alert:</strong> {expiringLorries.length} lorry/lorries have road tax or insurance expiring soon or already expired. Please take action immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Lorries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
              <Truck className="w-8 h-8 text-blue-500" />
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
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">{stats.assigned}</span>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-600">{stats.maintenance}</span>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={stats.expiring > 0 ? "border-orange-300 bg-orange-50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${stats.expiring > 0 ? "text-orange-600" : "text-gray-600"}`}>
                {stats.expiring}
              </span>
              <Calendar className={`w-8 h-8 ${stats.expiring > 0 ? "text-orange-500" : "text-gray-500"}`} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by model, license plate, or ID..."
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
                {LORRY_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lorries Table - Desktop View */}
      <Card className="hidden md:block">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Fleet List ({filteredLorries.length})</CardTitle>
              <CardDescription>Complete list of all lorries with renewal alerts</CardDescription>
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
                  <TableHead>Lorry ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Tonnage</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Road Tax Expiry</TableHead>
                  <TableHead>Insurance Expiry</TableHead>
                  <TableHead>Assigned Driver</TableHead>
                  <TableHead>Total Trips</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLorries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No lorries found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLorries.map((lorry) => (
                    <TableRow key={lorry.id}>
                      <TableCell className="font-medium">{lorry.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{lorry.model}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Weight className="w-3 h-3 text-gray-400" />
                          <span className="font-semibold">{lorry.tonnage} tons</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold">{lorry.licensePlate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={
                            isExpired(lorry.roadTaxExpiry) 
                              ? "text-red-600 font-semibold" 
                              : isExpiringSoon(lorry.roadTaxExpiry) 
                              ? "text-orange-600 font-semibold" 
                              : ""
                          }>
                            {lorry.roadTaxExpiry}
                          </span>
                          {(isExpired(lorry.roadTaxExpiry) || isExpiringSoon(lorry.roadTaxExpiry)) && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={
                            isExpired(lorry.insuranceExpiry) 
                              ? "text-red-600 font-semibold" 
                              : isExpiringSoon(lorry.insuranceExpiry) 
                              ? "text-orange-600 font-semibold" 
                              : ""
                          }>
                            {lorry.insuranceExpiry}
                          </span>
                          {(isExpired(lorry.insuranceExpiry) || isExpiringSoon(lorry.insuranceExpiry)) && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lorry.assignedDriver ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            {lorry.assignedDriver}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-indigo-600">
                        {lorry.totalTrips || 0}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(lorry.status)}>
                          {lorry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTracking(lorry.id)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Track
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignDriver(lorry.id)}
                            className="hover:bg-green-50"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lorry)}
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
          {filteredLorries.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLorries.length)} of {filteredLorries.length} lorries
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
          <h2 className="text-lg font-semibold">Fleet List ({filteredLorries.length})</h2>
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

        {filteredLorries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No lorries found matching your criteria
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedLorries.map((lorry) => (
              <Card key={lorry.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{lorry.model}</CardTitle>
                      <CardDescription className="mt-1">{lorry.id}</CardDescription>
                    </div>
                    <Badge className={getStatusBadge(lorry.status)}>
                      {lorry.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">License Plate:</span>
                      <p className="font-bold font-mono">{lorry.licensePlate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tonnage:</span>
                      <p className="font-semibold">{lorry.tonnage} tons</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Road Tax:</span>
                      <p className={`font-medium ${
                        isExpired(lorry.roadTaxExpiry) 
                          ? "text-red-600" 
                          : isExpiringSoon(lorry.roadTaxExpiry) 
                          ? "text-orange-600" 
                          : ""
                      }`}>
                        {lorry.roadTaxExpiry}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Insurance:</span>
                      <p className={`font-medium ${
                        isExpired(lorry.insuranceExpiry) 
                          ? "text-red-600" 
                          : isExpiringSoon(lorry.insuranceExpiry) 
                          ? "text-orange-600" 
                          : ""
                      }`}>
                        {lorry.insuranceExpiry}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Trips:</span>
                      <p className="font-semibold text-indigo-600">{lorry.totalTrips || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Driver:</span>
                      <p className="font-medium text-xs">{lorry.assignedDriver || "Not assigned"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTracking(lorry.id)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignDriver(lorry.id)}
                      className="flex-1"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(lorry)}
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLorries.length)} of {filteredLorries.length} lorries
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

      {/* Add/Edit Lorry Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLorry ? "Edit Lorry" : "Add New Lorry"}</DialogTitle>
            <DialogDescription>
              {editingLorry 
                ? "Update the lorry details below. System will auto-alert for renewal dates."
                : "Fill in the details to add a new lorry to your fleet. Auto-alerts will be configured for renewals."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="model">Lorry Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., Hino 500 Series"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tonnage">Tonnage / Capacity (tons) *</Label>
                <Input
                  id="tonnage"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.tonnage}
                  onChange={(e) => setFormData({ ...formData, tonnage: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate Number *</Label>
                <Input
                  id="licensePlate"
                  placeholder="e.g., WMK 1234"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roadTaxExpiry">Road Tax Expiry Date *</Label>
                <Input
                  id="roadTaxExpiry"
                  type="date"
                  value={formData.roadTaxExpiry}
                  onChange={(e) => setFormData({ ...formData, roadTaxExpiry: e.target.value })}
                />
                <p className="text-xs text-gray-500">System will alert 30 days before expiry</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Expiry Date *</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                />
                <p className="text-xs text-gray-500">System will alert 30 days before expiry</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastService">Last Service Date</Label>
                <Input
                  id="lastService"
                  type="date"
                  value={formData.lastService}
                  onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(status) => setFormData({ ...formData, status: status as Lorry["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {LORRY_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info box */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Auto-Alert Feature:</strong> The system will automatically notify you 30 days before road tax and insurance expiry dates. Ensure dates are accurate for proper fleet compliance.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLorry} className="bg-blue-600 hover:bg-blue-700">
              {editingLorry ? "Update Lorry" : "Save Lorry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LorryManagement;

