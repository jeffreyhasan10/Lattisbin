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
import { Plus, Search, Filter, Eye, Edit, Truck, MapPin, Package, User } from "lucide-react";
import { toast } from "sonner";

interface RentLorry {
  id: string;
  name: string;
  lorryNumber: string;
  area: string;
  binNumber: string;
  registeredDate: string;
  status: "Active" | "Inactive";
}

const RentLorryRegister: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLorry, setEditingLorry] = useState<RentLorry | null>(null);
  const [formData, setFormData] = useState<Partial<RentLorry>>({
    name: "",
    lorryNumber: "",
    area: "",
    binNumber: "",
    status: "Active"
  });

  // Sample rent lorry data
  const [rentLorries, setRentLorries] = useState<RentLorry[]>([
    {
      id: "RL-001",
      name: "Tan Transport Services",
      lorryNumber: "WBD 7788",
      area: "Downtown",
      binNumber: "ASR-100",
      registeredDate: "2025-01-15",
      status: "Active"
    },
    {
      id: "RL-002",
      name: "Ahmad Logistics Sdn Bhd",
      lorryNumber: "WMK 3322",
      area: "Industrial Zone",
      binNumber: "LASR-150",
      registeredDate: "2025-02-20",
      status: "Active"
    },
    {
      id: "RL-003",
      name: "Lee Transport Co.",
      lorryNumber: "WKL 9988",
      area: "Residential",
      binNumber: "PWD-200",
      registeredDate: "2025-03-10",
      status: "Active"
    },
    {
      id: "RL-004",
      name: "Kumar Rental Lorries",
      lorryNumber: "WBJ 4455",
      area: "Commercial",
      binNumber: "ASR-101",
      registeredDate: "2025-04-05",
      status: "Active"
    },
    {
      id: "RL-005",
      name: "Siti Transport & Logistics",
      lorryNumber: "WSL 6677",
      area: "Downtown",
      binNumber: "LASR-151",
      registeredDate: "2025-05-12",
      status: "Inactive"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Active": "bg-green-100 text-green-700 border-green-300",
      "Inactive": "bg-gray-100 text-gray-700 border-gray-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const filteredLorries = rentLorries.filter(lorry => {
    const matchesSearch = lorry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lorry.lorryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lorry.binNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lorry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === "all" || lorry.area === filterArea;
    
    return matchesSearch && matchesArea;
  });

  const areas = Array.from(new Set(rentLorries.map(l => l.area)));

  const handleAddNew = () => {
    setEditingLorry(null);
    setFormData({
      name: "",
      lorryNumber: "",
      area: "",
      binNumber: "",
      status: "Active"
    });
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (lorry: RentLorry) => {
    setEditingLorry(lorry);
    setFormData(lorry);
    setIsAddEditModalOpen(true);
  };

  const handleViewDetails = (lorryId: string) => {
    navigate(`/admin/rental-lorries/details/${lorryId}`);
  };

  const handleSaveRentLorry = () => {
    if (!formData.name || !formData.lorryNumber || !formData.area || !formData.binNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check for duplicate lorry number (except when editing the same record)
    const isDuplicate = rentLorries.some(lorry => 
      lorry.lorryNumber.toUpperCase() === formData.lorryNumber?.toUpperCase() &&
      lorry.id !== editingLorry?.id
    );

    if (isDuplicate) {
      toast.error("This lorry number is already registered");
      return;
    }

    if (editingLorry) {
      // Update existing rent lorry
      setRentLorries(rentLorries.map(lorry => 
        lorry.id === editingLorry.id 
          ? { ...lorry, ...formData } as RentLorry
          : lorry
      ));
      toast.success("Rent lorry updated successfully!");
    } else {
      // Add new rent lorry
      const newRentLorry: RentLorry = {
        id: `RL-${String(rentLorries.length + 1).padStart(3, '0')}`,
        name: formData.name!,
        lorryNumber: formData.lorryNumber!.toUpperCase(),
        area: formData.area!,
        binNumber: formData.binNumber!.toUpperCase(),
        status: formData.status as RentLorry["status"] || "Active",
        registeredDate: new Date().toISOString().split('T')[0]
      };
      setRentLorries([...rentLorries, newRentLorry]);
      toast.success("Rent lorry registered successfully!");
    }

    setIsAddEditModalOpen(false);
  };

  const stats = {
    total: rentLorries.length,
    active: rentLorries.filter(l => l.status === "Active").length,
    inactive: rentLorries.filter(l => l.status === "Inactive").length,
    areas: areas.length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rent Lorry Register</h1>
          <p className="text-gray-600 mt-1">Manage and track all rented lorries and their operational assignments</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Rent Lorry Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Rent Lorries</CardTitle>
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
              <Truck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-600">{stats.inactive}</span>
              <Truck className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Operating Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-indigo-600">{stats.areas}</span>
              <MapPin className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
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
                placeholder="Search by name, lorry number, or bin number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

      {/* Rent Lorries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rent Lorry List ({filteredLorries.length})</CardTitle>
          <CardDescription>Complete overview of all rented lorries and their operational details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name (Owner/Renter)</TableHead>
                  <TableHead>Lorry Number</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Bin Number</TableHead>
                  <TableHead>Registered Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLorries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No rent lorries found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLorries.map((lorry) => (
                    <TableRow key={lorry.id}>
                      <TableCell className="font-medium">{lorry.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{lorry.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-500" />
                          <span className="font-bold font-mono">{lorry.lorryNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{lorry.area}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-purple-50 text-purple-700 border-purple-300">
                          <Package className="w-3 h-3 mr-1" />
                          {lorry.binNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{lorry.registeredDate}</TableCell>
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
                            onClick={() => handleViewDetails(lorry.id)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
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
        </CardContent>
      </Card>

      {/* Add/Edit Rent Lorry Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLorry ? "Edit Rent Lorry Entry" : "Add New Rent Lorry Entry"}</DialogTitle>
            <DialogDescription>
              {editingLorry 
                ? "Update the rent lorry details below"
                : "Fill in the details to register a new rented lorry. All fields are required."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Renter or Lorry Owner) *</Label>
              <Input
                id="name"
                placeholder="e.g., Tan Transport Services"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lorryNumber">Lorry Number *</Label>
              <Input
                id="lorryNumber"
                placeholder="e.g., WBD 7788"
                value={formData.lorryNumber}
                onChange={(e) => setFormData({ ...formData, lorryNumber: e.target.value.toUpperCase() })}
              />
              <p className="text-xs text-gray-500">License plate number of the rented lorry</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (Operational Zone or Region) *</Label>
              <Input
                id="area"
                placeholder="e.g., Downtown, Industrial Zone"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="binNumber">Bin Number (Associated Bin) *</Label>
              <Input
                id="binNumber"
                placeholder="e.g., ASR-100, LASR-150"
                value={formData.binNumber}
                onChange={(e) => setFormData({ ...formData, binNumber: e.target.value.toUpperCase() })}
              />
              <p className="text-xs text-gray-500">Bin serial number for collection or transport</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(status) => setFormData({ ...formData, status: status as RentLorry["status"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRentLorry} className="bg-blue-600 hover:bg-blue-700">
              {editingLorry ? "Update Rent Lorry" : "Save Rent Lorry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RentLorryRegister;

