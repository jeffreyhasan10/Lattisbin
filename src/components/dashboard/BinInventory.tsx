import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Package2, ArrowUpDown, Filter, 
  MapPin, User, Phone, DollarSign, Truck, Ruler, AlertCircle, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Types
interface Bin {
  id: number;
  serialNumber: string;
  size: string;
  dimensions: string;
  capacity: string;
  status: "Available" | "In-Use" | "In Maintenance";
  location: string;
  customer: string | null;
  deployedDate: string | null;
  area?: string;
  state?: string;
}

interface Booking {
  id: number;
  binId: number;
  customerName: string;
  phoneNumber: string;
  binNumber: string;
  binSize: string;
  amount: number;
  jobReference: string;
  introducer: string;
  driver: string;
  area: string;
  state: string;
  bookingDate: string;
}

// Dummy data
const DUMMY_BINS: Bin[] = [
  {
    id: 1,
    serialNumber: "ASR100",
    size: "4 Yard",
    dimensions: "10 ft x 2 ft x 5.5 ft",
    capacity: "1,500 lbs",
    status: "In-Use",
    location: "Azlan Sdn Bhd, Kuala Lumpur",
    customer: "Azlan Sdn Bhd",
    deployedDate: "2023-12-15",
    area: "City Center",
    state: "Kuala Lumpur",
  },
  {
    id: 2,
    serialNumber: "ASR101",
    size: "6 Yard",
    dimensions: "12 ft x 2 ft x 6 ft",
    capacity: "2,000 lbs",
    status: "Available",
    location: "Warehouse, Pulau Pinang",
    customer: null,
    deployedDate: null,
    area: "Industrial Zone",
    state: "Pulau Pinang",
  },
  {
    id: 3,
    serialNumber: "LSR150",
    size: "10 Yard",
    dimensions: "14 ft x 4 ft x 7 ft",
    capacity: "2,500 lbs",
    status: "In-Use",
    location: "Eastern Metal Works, Kedah",
    customer: "Eastern Metal Works",
    deployedDate: "2024-01-10",
    area: "Industrial Park",
    state: "Kedah",
  },
  {
    id: 4,
    serialNumber: "LSR152",
    size: "15 Yard",
    dimensions: "16 ft x 5 ft x 7.5 ft",
    capacity: "3,000 lbs",
    status: "In Maintenance",
    location: "Repair Shop, Pulau Pinang",
    customer: null,
    deployedDate: null,
    area: "Service Center",
    state: "Pulau Pinang",
  },
  {
    id: 5,
    serialNumber: "ASR105",
    size: "20 Yard",
    dimensions: "11 ft x 6 ft x 8 ft",
    capacity: "3,040 lbs",
    status: "In-Use",
    location: "Johor Construction Co., Johor",
    customer: "Johor Construction Co.",
    deployedDate: "2024-02-20",
    area: "Construction Site",
    state: "Johor",
  },
];

const AREAS = ["City Center", "Industrial Zone", "Industrial Park", "Service Center", "Construction Site"];
const STATES = ["Kuala Lumpur", "Pulau Pinang", "Kedah", "Johor", "Selangor"];
const BIN_SIZES = ["4 Yard", "6 Yard", "10 Yard", "15 Yard", "20 Yard"];
const BIN_STATUSES = ["Available", "In-Use", "In Maintenance"];

const BinInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bins, setBins] = useState<Bin[]>(DUMMY_BINS);
  const [sortBy, setSortBy] = useState<keyof Bin>("serialNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [areaFilter, setAreaFilter] = useState<string>("All");
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isAddBinModalOpen, setIsAddBinModalOpen] = useState<boolean>(false);
  const [isEditBinModalOpen, setIsEditBinModalOpen] = useState<boolean>(false);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    phoneNumber: "",
    amount: "",
    jobReference: "",
    introducer: "",
    driver: "",
    area: "",
    state: "",
    bookingDate: "",
  });
  const [addBinForm, setAddBinForm] = useState({
    serialNumber: "",
    size: "",
    dimensions: "",
    capacity: "",
    location: "",
    area: "",
    state: "",
  });
  const [editBinForm, setEditBinForm] = useState({
    id: 0,
    serialNumber: "",
    size: "",
    dimensions: "",
    capacity: "",
    status: "",
    location: "",
    area: "",
    state: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter bins
  const filteredBins = bins.filter(bin => 
    (statusFilter === "All" || bin.status === statusFilter) &&
    (areaFilter === "All" || bin.area === areaFilter) &&
    (stateFilter === "All" || bin.state === stateFilter) &&
    (bin.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     bin.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (bin.location && bin.location.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Available bins for booking
  const availableBins = bins.filter(bin => bin.status === "Available");

  // Summary stats
  const totalBins = bins.length;
  const availableBinsCount = bins.filter(bin => bin.status === "Available").length;
  const inUseBins = bins.filter(bin => bin.status === "In-Use").length;
  const maintenanceBins = bins.filter(bin => bin.status === "In Maintenance").length;

  // Status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Available": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "In-Use": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "In Maintenance": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Handle sort
  const handleSort = (column: keyof Bin) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Apply sorting
  const sortedBins = [...filteredBins].sort((a, b) => {
    const valA = a[sortBy]?.toString().toLowerCase() || '';
    const valB = b[sortBy]?.toString().toLowerCase() || '';
    return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  // Validate booking form
  const validateBookingForm = () => {
    const errors: Record<string, string> = {};
    if (!selectedBinId) errors.bin = "Please select a bin";
    if (!bookingForm.customerName.trim()) errors.customerName = "Customer name is required";
    if (!bookingForm.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!bookingForm.amount || parseFloat(bookingForm.amount) <= 0) errors.amount = "Valid amount is required";
    if (!bookingForm.area) errors.area = "Area is required";
    if (!bookingForm.state) errors.state = "State is required";
    if (!bookingForm.bookingDate) errors.bookingDate = "Booking date is required";
    return errors;
  };

  // Handle booking form
  const handleBookingSubmit = () => {
    const errors = validateBookingForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const selectedBin = bins.find(bin => bin.id === selectedBinId);
    if (!selectedBin) return;

    const newBooking: Booking = {
      id: Math.random(),
      binId: selectedBin.id,
      binNumber: selectedBin.serialNumber,
      binSize: selectedBin.size,
      customerName: bookingForm.customerName,
      phoneNumber: bookingForm.phoneNumber,
      amount: parseFloat(bookingForm.amount),
      jobReference: bookingForm.jobReference,
      introducer: bookingForm.introducer,
      driver: bookingForm.driver,
      area: bookingForm.area,
      state: bookingForm.state,
      bookingDate: bookingForm.bookingDate,
    };

    // Update bin status
    setBins(bins.map(bin => 
      bin.id === selectedBin.id 
        ? { ...bin, status: "In-Use", customer: bookingForm.customerName, deployedDate: new Date().toISOString() }
        : bin
    ));

    // Reset form and close modal
    setBookingForm({
      customerName: "",
      phoneNumber: "",
      amount: "",
      jobReference: "",
      introducer: "",
      driver: "",
      area: "",
      state: "",
      bookingDate: "",
    });
    setSelectedBinId(null);
    setFormErrors({});
    setIsBookingModalOpen(false);
  };

  // Validate add bin form
  const validateAddBinForm = () => {
    const errors: Record<string, string> = {};
    if (!addBinForm.serialNumber.trim()) errors.serialNumber = "Serial number is required";
    if (!addBinForm.size) errors.size = "Size is required";
    if (!addBinForm.dimensions.trim()) errors.dimensions = "Dimensions are required";
    if (!addBinForm.capacity.trim()) errors.capacity = "Capacity is required";
    if (!addBinForm.location.trim()) errors.location = "Location is required";
    if (!addBinForm.area) errors.area = "Area is required";
    if (!addBinForm.state) errors.state = "State is required";
    return errors;
  };

  // Handle add bin form
  const handleAddBinSubmit = () => {
    const errors = validateAddBinForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newBin: Bin = {
      id: bins.length + 1,
      serialNumber: addBinForm.serialNumber,
      size: addBinForm.size,
      dimensions: addBinForm.dimensions,
      capacity: addBinForm.capacity,
      status: "Available",
      location: addBinForm.location,
      customer: null,
      deployedDate: null,
      area: addBinForm.area,
      state: addBinForm.state,
    };

    setBins([...bins, newBin]);

    // Reset form and close modal
    setAddBinForm({
      serialNumber: "",
      size: "",
      dimensions: "",
      capacity: "",
      location: "",
      area: "",
      state: "",
    });
    setFormErrors({});
    setIsAddBinModalOpen(false);
  };

  // Validate edit bin form
  const validateEditBinForm = () => {
    const errors: Record<string, string> = {};
    if (!editBinForm.serialNumber.trim()) errors.serialNumber = "Serial number is required";
    if (!editBinForm.size) errors.size = "Size is required";
    if (!editBinForm.dimensions.trim()) errors.dimensions = "Dimensions are required";
    if (!editBinForm.capacity.trim()) errors.capacity = "Capacity is required";
    if (!editBinForm.status) errors.status = "Status is required";
    if (!editBinForm.location.trim()) errors.location = "Location is required";
    if (!editBinForm.area) errors.area = "Area is required";
    if (!editBinForm.state) errors.state = "State is required";
    return errors;
  };

  // Handle edit bin form
  const handleEditBinSubmit = () => {
    const errors = validateEditBinForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBins(bins.map(bin => 
      bin.id === editBinForm.id 
        ? {
            ...bin,
            serialNumber: editBinForm.serialNumber,
            size: editBinForm.size,
            dimensions: editBinForm.dimensions,
            capacity: editBinForm.capacity,
            status: editBinForm.status as "Available" | "In-Use" | "In Maintenance",
            location: editBinForm.location,
            area: editBinForm.area,
            state: editBinForm.state,
            customer: editBinForm.status === "Available" ? null : bin.customer,
            deployedDate: editBinForm.status === "Available" ? null : bin.deployedDate
          }
        : bin
    ));

    // Reset form and close modal
    setEditBinForm({
      id: 0,
      serialNumber: "",
      size: "",
      dimensions: "",
      capacity: "",
      status: "",
      location: "",
      area: "",
      state: "",
    });
    setFormErrors({});
    setIsEditBinModalOpen(false);
  };

  // Reset booking form when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setBookingForm({
        customerName: "",
        phoneNumber: "",
        amount: "",
        jobReference: "",
        introducer: "",
        driver: "",
        area: "",
        state: "",
        bookingDate: "",
      });
      setFormErrors({});
    }
  }, [isBookingModalOpen]);

  // Open edit modal with pre-filled data
  const openEditModal = (bin: Bin) => {
    setEditBinForm({
      id: bin.id,
      serialNumber: bin.serialNumber,
      size: bin.size,
      dimensions: bin.dimensions,
      capacity: bin.capacity,
      status: bin.status,
      location: bin.location,
      area: bin.area || "",
      state: bin.state || "",
    });
    setIsEditBinModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Bin Inventory</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Efficiently manage and track waste bins with booking and addition capabilities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search bins by serial, size, or location..." 
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Plus className="h-5 w-5" /> Book Bin
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsAddBinModalOpen(true)}
            >
              <Plus className="h-5 w-5" /> Add Bin
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          { title: "Total Bins", value: totalBins, color: "blue", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { title: "Available", value: availableBinsCount, color: "emerald", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
          { title: "In-Use", value: inUseBins, color: "blue", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { title: "Maintenance", value: maintenanceBins, color: "amber", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{stat.title}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</p>
                </div>
                <div className={`rounded-full ${stat.iconBg} p-4 dark:${stat.iconBg.replace("100", "900")}`}>
                  <Package2 className={`h-8 w-8 ${stat.iconColor} dark:${stat.iconColor.replace("600", "300")}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex gap-4 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <Filter className="h-5 w-5" />
                <span>{statusFilter === "All" ? "Filter by Status" : statusFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuLabel className="font-semibold">Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("All")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Available")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Available</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("In-Use")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">In-Use</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("In Maintenance")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">In Maintenance</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <MapPin className="h-5 w-5" />
                <span>{areaFilter === "All" ? "Filter by Area" : areaFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuLabel className="font-semibold">Filter by Area</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAreaFilter("All")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All</DropdownMenuItem>
              {AREAS.map(area => (
                <DropdownMenuItem key={area} onClick={() => setAreaFilter(area)} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{area}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <MapPin className="h-5 w-5" />
                <span>{stateFilter === "All" ? "Filter by State" : stateFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
              <DropdownMenuLabel className="font-semibold">Filter by State</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStateFilter("All")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All</DropdownMenuItem>
              {STATES.map(state => (
                <DropdownMenuItem key={state} onClick={() => setStateFilter(state)} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{state}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
          {filteredBins.length} Bins
        </Badge>
      </div>

      {/* Bin Table */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            <Package2 className="h-6 w-6" />
            Bin Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("serialNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Serial Number
                      {sortBy === "serialNumber" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("size")}
                  >
                    <div className="flex items-center gap-2">
                      Size
                      {sortBy === "size" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Dimensions</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortBy === "status" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("location")}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      {sortBy === "location" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("deployedDate")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {sortBy === "deployedDate" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sortedBins.length > 0 ? (
                    sortedBins.map((bin) => (
                      <motion.tr
                        key={bin.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{bin.serialNumber}</TableCell>
                        <TableCell>
                          <div className="text-gray-900 dark:text-gray-100">{bin.size}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{bin.capacity}</div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">{bin.dimensions}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(bin.status)} rounded-full px-3 py-1 font-medium`}>
                            {bin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">{bin.location || "—"}</TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {bin.deployedDate ? (
                            <div>
                              <div>{new Date(bin.deployedDate).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {bin.status === "In-Use" ? "Deployed" : bin.status === "In Maintenance" ? "Maintenance" : "Available"}
                              </div>
                            </div>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                              onClick={() => {
                                setSelectedBinId(bin.id);
                                setBookingForm({
                                  ...bookingForm,
                                  area: bin.area || "",
                                  state: bin.state || "",
                                });
                                setIsBookingModalOpen(true);
                              }}
                              disabled={bin.status !== "Available"}
                            >
                              Book
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                              onClick={() => openEditModal(bin)}
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center py-8">
                          <Package2 className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No bins found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filter settings, or add a new bin.</p>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={(open) => {
        setIsBookingModalOpen(open);
        if (!open) {
          setSelectedBinId(null);
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Book a Bin
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Select
                value={selectedBinId?.toString() || ""}
                onValueChange={(value) => {
                  setSelectedBinId(parseInt(value));
                  const bin = bins.find(b => b.id === parseInt(value));
                  setBookingForm({
                    ...bookingForm,
                    area: bin?.area || "",
                    state: bin?.state || "",
                  });
                }}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                  <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select a bin" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {availableBins.map(bin => (
                    <SelectItem key={bin.id} value={bin.id.toString()} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      {bin.serialNumber} ({bin.size})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.bin && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.bin}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={bookingForm.customerName}
                onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Customer Name</label>
              {formErrors.customerName && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.customerName}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={bookingForm.phoneNumber}
                onChange={(e) => setBookingForm({ ...bookingForm, phoneNumber: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Phone Number</label>
              {formErrors.phoneNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phoneNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                value={bookingForm.amount}
                onChange={(e) => setBookingForm({ ...bookingForm, amount: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Amount</label>
              {formErrors.amount && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.amount}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={bookingForm.jobReference}
                onChange={(e) => setBookingForm({ ...bookingForm, jobReference: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Job Reference</label>
            </div>
            <div className="relative">
              <Input
                value={bookingForm.introducer}
                onChange={(e) => setBookingForm({ ...bookingForm, introducer: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Introducer</label>
            </div>
            <div className="relative">
              <Input
                value={bookingForm.driver}
                onChange={(e) => setBookingForm({ ...bookingForm, driver: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Driver</label>
            </div>
            <div className="relative">
              <Select
                value={bookingForm.area}
                onValueChange={(value) => setBookingForm({ ...bookingForm, area: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {AREAS.map(area => (
                    <SelectItem key={area} value={area} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.area && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.area}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={bookingForm.state}
                onValueChange={(value) => setBookingForm({ ...bookingForm, state: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {STATES.map(state => (
                    <SelectItem key={state} value={state} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.state && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.state}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={bookingForm.bookingDate}
                onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Booking Date</label>
              {formErrors.bookingDate && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.bookingDate}
                </motion.p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsBookingModalOpen(false);
                setSelectedBinId(null);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleBookingSubmit}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bin Modal */}
      <Dialog open={isAddBinModalOpen} onOpenChange={(open) => {
        setIsAddBinModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Bin
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={addBinForm.serialNumber}
                onChange={(e) => setAddBinForm({ ...addBinForm, serialNumber: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Serial Number</label>
              {formErrors.serialNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.serialNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={addBinForm.size}
                onValueChange={(value) => setAddBinForm({ ...addBinForm, size: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select bin size" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {BIN_SIZES.map(size => (
                    <SelectItem key={size} value={size} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.size && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.size}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={addBinForm.dimensions}
                onChange={(e) => setAddBinForm({ ...addBinForm, dimensions: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Dimensions (e.g., 10 ft x 2 ft x 5.5 ft)</label>
              {formErrors.dimensions && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.dimensions}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={addBinForm.capacity}
                onChange={(e) => setAddBinForm({ ...addBinForm, capacity: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Capacity (e.g., 1,500 lbs)</label>
              {formErrors.capacity && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.capacity}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={addBinForm.location}
                onChange={(e) => setAddBinForm({ ...addBinForm, location: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Location</label>
              {formErrors.location && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.location}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={addBinForm.area}
                onValueChange={(value) => setAddBinForm({ ...addBinForm, area: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {AREAS.map(area => (
                    <SelectItem key={area} value={area} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.area && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.area}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={addBinForm.state}
                onValueChange={(value) => setAddBinForm({ ...addBinForm, state: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {STATES.map(state => (
                    <SelectItem key={state} value={state} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.state && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.state}
                </motion.p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsAddBinModalOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddBinSubmit}
            >
              Add Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bin Modal */}
      <Dialog open={isEditBinModalOpen} onOpenChange={(open) => {
        setIsEditBinModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Edit Bin
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={editBinForm.serialNumber}
                onChange={(e) => setEditBinForm({ ...editBinForm, serialNumber: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Serial Number</label>
              {formErrors.serialNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.serialNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editBinForm.size}
                onValueChange={(value) => setEditBinForm({ ...editBinForm, size: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select bin size" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {BIN_SIZES.map(size => (
                    <SelectItem key={size} value={size} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.size && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.size}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={editBinForm.dimensions}
                onChange={(e) => setEditBinForm({ ...editBinForm, dimensions: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Dimensions (e.g., 10 ft x 2 ft x 5.5 ft)</label>
              {formErrors.dimensions && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.dimensions}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={editBinForm.capacity}
                onChange={(e) => setEditBinForm({ ...editBinForm, capacity: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Capacity (e.g., 1,500 lbs)</label>
              {formErrors.capacity && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.capacity}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editBinForm.status}
                onValueChange={(value) => setEditBinForm({ ...editBinForm, status: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {BIN_STATUSES.map(status => (
                    <SelectItem key={status} value={status} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.status && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.status}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={editBinForm.location}
                onChange={(e) => setEditBinForm({ ...editBinForm, location: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Location</label>
              {formErrors.location && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.location}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editBinForm.area}
                onValueChange={(value) => setEditBinForm({ ...editBinForm, area: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {AREAS.map(area => (
                    <SelectItem key={area} value={area} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.area && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.area}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editBinForm.state}
                onValueChange={(value) => setEditBinForm({ ...editBinForm, state: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {STATES.map(state => (
                    <SelectItem key={state} value={state} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.state && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.state}
                </motion.p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsEditBinModalOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleEditBinSubmit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BinInventory;