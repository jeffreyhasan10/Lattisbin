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
import { Plus, Search, Filter, Eye, Edit, Package, MapPin, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Bin {
  id: string;
  serialNumber: string;
  size: string;
  type: string;
  dimensions: {
    height: string;
    length: string;
    width: string;
  };
  cubicYards?: string;
  weight?: string;
  status: "Available" | "Out for Collection" | "Collected" | "Under Maintenance";
  area?: string;
  lastUpdated: string;
}

const BIN_TYPES = [
  "Dumpster",
  "RORO (Roll-On/Roll-Off)",
  "Regular Bin",
  "Compactor",
  "Open Top"
];

const BIN_SIZES = [
  { label: "4 Yard", weight: "1,500lbs", dimensions: "10ft x 2ft x 5.5ft", cubic: "4" },
  { label: "6 Yard", weight: "1,700lbs", dimensions: "10ft x 3ft x 5.5ft", cubic: "6" },
  { label: "10 Yard", weight: "2,220lbs", dimensions: "10ft x 4ft x 7ft", cubic: "10" },
  { label: "15 Yard", weight: "2,620lbs", dimensions: "11ft x 4.5ft x 8ft", cubic: "14.8" },
  { label: "20 Yard", weight: "3,040lbs", dimensions: "11ft x 6ft x 8ft", cubic: "20" },
];

const CUSTOM_SIZES = [
  "2ft (H) x 12ft (L) x 6ft (W)",
  "2ft (H) x 20ft (L) x 8ft (W)",
  "4ft (H) x 12ft (L) x 6ft (W)",
  "4ft (H) x 14ft (L) x 6ft (W)",
  "5ft (H) x 12ft (L) x 6ft (W)",
  "5ft (H) x 23ft (L) x 8ft (W)",
  "6ft (H) x 12ft (L) x 6ft (W)",
  "6ft (H) x 24ft (L) x 8ft (W)",
  "6ft (H) x 23ft (L) x 8ft (W)",
  "6.5ft (H) x 14.5ft (L) x 6ft (W)",
  "6ft (H) x 12ft (L) x 7ft (W)",
  "4ft (H) x 12ft (L) x 6ft (W) (Cust)",
  "2ft (H) x 12ft (L) x 6ft (W) (Cust)",
  "5ft (H) x 12ft (L) x 6ft (W) (Cust)",
  "2ft (H) x 20ft (L) x 8ft (W) (Cust)",
  "4ft (H) x 16ft (L) x 8ft (W) (Cust)"
];

const SN_PREFIXES = ["ASR", "LASR", "PWD"];

const BinInventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState<Partial<Bin>>({
    serialNumber: "",
    size: "",
    type: "",
    dimensions: { height: "", length: "", width: "" },
    status: "Available",
    area: ""
  });

  // Sample bins data
  const [bins, setBins] = useState<Bin[]>([
    {
      id: "1",
      serialNumber: "ASR-100",
      size: "10 Yard",
      type: "Dumpster",
      dimensions: { height: "4ft", length: "10ft", width: "7ft" },
      cubicYards: "10",
      weight: "2,220lbs",
      status: "Available",
      area: "Downtown",
      lastUpdated: "2025-10-10"
    },
    {
      id: "2",
      serialNumber: "LASR-150",
      size: "20 Yard",
      type: "RORO (Roll-On/Roll-Off)",
      dimensions: { height: "6ft", length: "11ft", width: "8ft" },
      cubicYards: "20",
      weight: "3,040lbs",
      status: "Out for Collection",
      area: "Industrial Zone",
      lastUpdated: "2025-10-11"
    },
    {
      id: "3",
      serialNumber: "PWD-200",
      size: "6 Yard",
      type: "Regular Bin",
      dimensions: { height: "3ft", length: "10ft", width: "5.5ft" },
      cubicYards: "6",
      weight: "1,700lbs",
      status: "Collected",
      area: "Residential",
      lastUpdated: "2025-10-09"
    },
    {
      id: "4",
      serialNumber: "ASR-101",
      size: "Custom",
      type: "Compactor",
      dimensions: { height: "6.5ft", length: "14.5ft", width: "6ft" },
      status: "Available",
      area: "Commercial",
      lastUpdated: "2025-10-08"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Available": "bg-green-100 text-green-700 border-green-300",
      "Out for Collection": "bg-blue-100 text-blue-700 border-blue-300",
      "Collected": "bg-orange-100 text-orange-700 border-orange-300",
      "Under Maintenance": "bg-red-100 text-red-700 border-red-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || bin.type === filterType;
    const matchesStatus = filterStatus === "all" || bin.status === filterStatus;
    const matchesArea = filterArea === "all" || bin.area === filterArea;
    
    return matchesSearch && matchesType && matchesStatus && matchesArea;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBins = filteredBins.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, filterArea]);

  const areas = Array.from(new Set(bins.map(b => b.area).filter(Boolean)));

  const handleAddNew = () => {
    setEditingBin(null);
    setFormData({
      serialNumber: "",
      size: "",
      type: "",
      dimensions: { height: "", length: "", width: "" },
      status: "Available",
      area: ""
    });
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (bin: Bin) => {
    setEditingBin(bin);
    setFormData(bin);
    setIsAddEditModalOpen(true);
  };

  const handleViewTrack = (binId: string) => {
    navigate(`/admin/inventory/track/${binId}`);
  };

  const handleSaveBin = () => {
    if (!formData.serialNumber || !formData.type || !formData.size) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingBin) {
      // Update existing bin
      setBins(bins.map(bin => 
        bin.id === editingBin.id 
          ? { ...bin, ...formData, lastUpdated: new Date().toISOString().split('T')[0] } as Bin
          : bin
      ));
      toast.success("Bin updated successfully!");
    } else {
      // Add new bin
      const newBin: Bin = {
        id: Date.now().toString(),
        serialNumber: formData.serialNumber!,
        size: formData.size!,
        type: formData.type!,
        dimensions: formData.dimensions!,
        cubicYards: formData.cubicYards,
        weight: formData.weight,
        status: formData.status as Bin["status"] || "Available",
        area: formData.area,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setBins([...bins, newBin]);
      toast.success("Bin added successfully!");
    }

    setIsAddEditModalOpen(false);
  };

  const parseDimensions = (dimensionString: string) => {
    const parts = dimensionString.split(' x ');
    return {
      height: parts[0] || "",
      length: parts[1] || "",
      width: parts[2] || ""
    };
  };

  const handleSizeChange = (size: string) => {
    setFormData({ ...formData, size });
    
    const standardSize = BIN_SIZES.find(s => s.label === size);
    if (standardSize) {
      setFormData({
        ...formData,
        size,
        weight: standardSize.weight,
        cubicYards: standardSize.cubic,
        dimensions: parseDimensions(standardSize.dimensions)
      });
    } else if (CUSTOM_SIZES.includes(size)) {
      setFormData({
        ...formData,
        size: "Custom",
        dimensions: parseDimensions(size),
        weight: undefined,
        cubicYards: undefined
      });
    }
  };

  const stats = {
    total: bins.length,
    available: bins.filter(b => b.status === "Available").length,
    outForCollection: bins.filter(b => b.status === "Out for Collection").length,
    collected: bins.filter(b => b.status === "Collected").length
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Manage Bin Inventory</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage all bins in your inventory</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add New Bin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Bins</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.total}</span>
              <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Available</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{stats.available}</span>
              <Activity className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">Out for Collection</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{stats.outForCollection}</span>
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Collected</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">{stats.collected}</span>
              <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by SN or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {BIN_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Out for Collection">Out for Collection</SelectItem>
                <SelectItem value="Collected">Collected</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area} value={area!}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bins Table - Desktop View */}
      <Card className="hidden md:block">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Bin Inventory ({filteredBins.length})</CardTitle>
              <CardDescription>View and manage all bins in your system</CardDescription>
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
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No bins found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBins.map((bin) => (
                    <TableRow key={bin.id}>
                      <TableCell className="font-medium">{bin.serialNumber}</TableCell>
                      <TableCell>{bin.type}</TableCell>
                      <TableCell>
                        {bin.size}
                        {bin.cubicYards && (
                          <span className="text-xs text-gray-500 ml-1">({bin.cubicYards} yd³)</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {bin.dimensions.height} × {bin.dimensions.length} × {bin.dimensions.width}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {bin.weight || "N/A"}
                      </TableCell>
                      <TableCell>{bin.area || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(bin.status)}>
                          {bin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{bin.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTrack(bin.id)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View/Track
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(bin)}
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
          {filteredBins.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredBins.length)} of {filteredBins.length} bins
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
          <h2 className="text-lg font-semibold">Bin Inventory ({filteredBins.length})</h2>
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

        {filteredBins.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No bins found matching your criteria
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedBins.map((bin) => (
              <Card key={bin.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{bin.serialNumber}</CardTitle>
                      <CardDescription className="mt-1">{bin.type}</CardDescription>
                    </div>
                    <Badge className={getStatusBadge(bin.status)}>
                      {bin.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <p className="font-medium">{bin.size} {bin.cubicYards && `(${bin.cubicYards} yd³)`}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <p className="font-medium">{bin.weight || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Area:</span>
                      <p className="font-medium">{bin.area || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Updated:</span>
                      <p className="font-medium">{bin.lastUpdated}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Dimensions:</span>
                    <p className="font-medium text-sm">
                      {bin.dimensions.height} × {bin.dimensions.length} × {bin.dimensions.width}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTrack(bin.id)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View/Track
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bin)}
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredBins.length)} of {filteredBins.length} bins
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

      {/* Add/Edit Bin Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBin ? "Edit Bin" : "Add New Bin"}</DialogTitle>
            <DialogDescription>
              {editingBin 
                ? "Update the bin details below"
                : "Fill in the details to add a new bin to your inventory"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.serialNumber?.split('-')[0] || ""}
                    onValueChange={(prefix) => {
                      const number = formData.serialNumber?.split('-')[1] || "100";
                      setFormData({ ...formData, serialNumber: `${prefix}-${number}` });
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Prefix" />
                    </SelectTrigger>
                    <SelectContent>
                      {SN_PREFIXES.map(prefix => (
                        <SelectItem key={prefix} value={prefix}>{prefix}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="serialNumber"
                    type="number"
                    placeholder="100"
                    value={formData.serialNumber?.split('-')[1] || ""}
                    onChange={(e) => {
                      const prefix = formData.serialNumber?.split('-')[0] || "ASR";
                      setFormData({ ...formData, serialNumber: `${prefix}-${e.target.value}` });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Bin Type *</Label>
                <Select value={formData.type} onValueChange={(type) => setFormData({ ...formData, type })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BIN_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Select value={formData.size} onValueChange={handleSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard-sizes" disabled className="font-semibold">
                    Standard Sizes
                  </SelectItem>
                  {BIN_SIZES.map(size => (
                    <SelectItem key={size.label} value={size.label}>
                      {size.label} - {size.dimensions} ({size.cubic} yd³)
                    </SelectItem>
                  ))}
                  <SelectItem value="custom-sizes" disabled className="font-semibold mt-2">
                    Custom Sizes
                  </SelectItem>
                  {CUSTOM_SIZES.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  placeholder="e.g., 4ft"
                  value={formData.dimensions?.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, height: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length *</Label>
                <Input
                  id="length"
                  placeholder="e.g., 12ft"
                  value={formData.dimensions?.length}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, length: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width *</Label>
                <Input
                  id="width"
                  placeholder="e.g., 6ft"
                  value={formData.dimensions?.width}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, width: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area/Location</Label>
                <Input
                  id="area"
                  placeholder="e.g., Downtown"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(status) => setFormData({ ...formData, status: status as Bin["status"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Out for Collection">Out for Collection</SelectItem>
                    <SelectItem value="Collected">Collected</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.weight && (
              <div className="space-y-2">
                <Label>Approximate Weight</Label>
                <Input value={formData.weight} disabled className="bg-gray-50" />
              </div>
            )}

            {formData.cubicYards && (
              <div className="space-y-2">
                <Label>Cubic Volume</Label>
                <Input value={`${formData.cubicYards} Cubic Yards`} disabled className="bg-gray-50" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBin} className="bg-blue-600 hover:bg-blue-700">
              {editingBin ? "Update Bin" : "Save Bin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BinInventoryManagement;

