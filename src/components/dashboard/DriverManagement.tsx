import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Truck, AlertTriangle, ArrowUpDown, Filter, 
  MapPin, User, Calendar, AlertCircle
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
interface Lorry {
  id: number;
  lorryNumber: string;
  model: string;
  tonnage: string;
  driver: string;
  roadTaxExpiry: string;
  insuranceExpiry: string;
  status: "Active" | "Maintenance" | "Inactive" | "In-Use";
  lastMaintenance: string;
  currentBin: string | null;
  currentLocation: string;
  area?: string;
  state?: string;
}

// Dummy lorry data
const DUMMY_LORRIES: Lorry[] = [
  {
    id: 1,
    lorryNumber: "MYB 2345",
    model: "Mitsubishi Fuso",
    tonnage: "3 Ton",
    driver: "Ahmad bin Abdullah",
    roadTaxExpiry: "2024-06-15",
    insuranceExpiry: "2024-06-30",
    status: "Active",
    lastMaintenance: "2024-02-10",
    currentBin: "ASR100",
    currentLocation: "Kuala Lumpur",
    area: "City Center",
    state: "Kuala Lumpur",
  },
  {
    id: 2,
    lorryNumber: "MYC 6789",
    model: "Hino 300 Series",
    tonnage: "5 Ton",
    driver: "Tan Wei Ming",
    roadTaxExpiry: "2024-04-20",
    insuranceExpiry: "2024-05-10",
    status: "Active",
    lastMaintenance: "2024-01-25",
    currentBin: "LSR150",
    currentLocation: "Kedah",
    area: "Industrial Park",
    state: "Kedah",
  },
  {
    id: 3,
    lorryNumber: "MYD 1234",
    model: "Isuzu NPR",
    tonnage: "7 Ton",
    driver: "Rajesh a/l Kumar",
    roadTaxExpiry: "2024-09-05",
    insuranceExpiry: "2024-09-15",
    status: "Maintenance",
    lastMaintenance: "2024-03-15",
    currentBin: null,
    currentLocation: "Workshop, Pulau Pinang",
    area: "Service Center",
    state: "Pulau Pinang",
  },
  {
    id: 4,
    lorryNumber: "MYE 5678",
    model: "Nissan UD",
    tonnage: "10 Ton",
    driver: "Mohammad Zulkifli",
    roadTaxExpiry: "2024-04-05",
    insuranceExpiry: "2024-04-15",
    status: "In-Use",
    lastMaintenance: "2024-02-28",
    currentBin: "ASR105",
    currentLocation: "Johor Bahru",
    area: "Construction Site",
    state: "Johor",
  },
];

const AREAS = ["City Center", "Industrial Zone", "Industrial Park", "Service Center", "Construction Site"];
const STATES = ["Kuala Lumpur", "Pulau Pinang", "Kedah", "Johor", "Selangor"];
const LORRY_STATUSES = ["Active", "Maintenance", "Inactive", "In-Use"];
const LORRY_MODELS = ["Mitsubishi Fuso", "Hino 300 Series", "Isuzu NPR", "Nissan UD"];
const LORRY_TONNAGES = ["3 Ton", "5 Ton", "7 Ton", "10 Ton"];

const LorryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lorries, setLorries] = useState<Lorry[]>(DUMMY_LORRIES);
  const [sortBy, setSortBy] = useState<keyof Lorry>("lorryNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [areaFilter, setAreaFilter] = useState<string>("All");
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [isAddLorryModalOpen, setIsAddLorryModalOpen] = useState<boolean>(false);
  const [isEditLorryModalOpen, setIsEditLorryModalOpen] = useState<boolean>(false);
  const [addLorryForm, setAddLorryForm] = useState({
    lorryNumber: "",
    model: "",
    tonnage: "",
    driver: "",
    roadTaxExpiry: "",
    insuranceExpiry: "",
    lastMaintenance: "",
    currentLocation: "",
    area: "",
    state: "",
  });
  const [editLorryForm, setEditLorryForm] = useState({
    id: 0,
    lorryNumber: "",
    model: "",
    tonnage: "",
    driver: "",
    roadTaxExpiry: "",
    insuranceExpiry: "",
    status: "",
    lastMaintenance: "",
    currentLocation: "",
    area: "",
    state: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter lorries
  const filteredLorries = lorries.filter(lorry => 
    (statusFilter === "All" || lorry.status === statusFilter) &&
    (areaFilter === "All" || lorry.area === areaFilter) &&
    (stateFilter === "All" || lorry.state === stateFilter) &&
    (lorry.lorryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lorry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lorry.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (lorry.currentLocation && lorry.currentLocation.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Summary stats
  const totalLorries = lorries.length;
  const activeLorries = lorries.filter(lorry => lorry.status === "Active").length;
  const inUseLorries = lorries.filter(lorry => lorry.status === "In-Use").length;
  const maintenanceLorries = lorries.filter(lorry => lorry.status === "Maintenance").length;
  const expiringLorries = lorries.filter(lorry => {
    const roadTaxDays = getDaysUntil(lorry.roadTaxExpiry);
    const insuranceDays = getDaysUntil(lorry.insuranceExpiry);
    return roadTaxDays <= 30 || insuranceDays <= 30;
  }).length;

  // Calculate days until expiry
  const getDaysUntil = (dateStr: string): number => {
    const expiryDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "In-Use": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Maintenance": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Inactive": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get expiry warning
  const getExpiryWarning = (expiryDate: string) => {
    const daysUntil = getDaysUntil(expiryDate);
    if (daysUntil <= 0) {
      return (
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          className="flex items-center gap-1 text-red-600 dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4" />
          <span>Expired</span>
        </motion.div>
      );
    } else if (daysUntil <= 30) {
      return (
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          className="flex items-center gap-1 text-amber-600 dark:text-amber-400"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{daysUntil} days left</span>
        </motion.div>
      );
    }
    return null;
  };

  // Handle sort
  const handleSort = (column: keyof Lorry) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Apply sorting
  const sortedLorries = [...filteredLorries].sort((a, b) => {
    if (sortBy === "roadTaxExpiry" || sortBy === "insuranceExpiry" || sortBy === "lastMaintenance") {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    const valA = a[sortBy]?.toString().toLowerCase() || '';
    const valB = b[sortBy]?.toString().toLowerCase() || '';
    return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  // Validate add lorry form
  const validateAddLorryForm = () => {
    const errors: Record<string, string> = {};
    if (!addLorryForm.lorryNumber.trim()) errors.lorryNumber = "Lorry number is required";
    if (!addLorryForm.model) errors.model = "Model is required";
    if (!addLorryForm.tonnage) errors.tonnage = "Tonnage is required";
    if (!addLorryForm.driver.trim()) errors.driver = "Driver is required";
    if (!addLorryForm.roadTaxExpiry) errors.roadTaxExpiry = "Road tax expiry is required";
    if (!addLorryForm.insuranceExpiry) errors.insuranceExpiry = "Insurance expiry is required";
    if (!addLorryForm.lastMaintenance) errors.lastMaintenance = "Last maintenance date is required";
    if (!addLorryForm.currentLocation.trim()) errors.currentLocation = "Location is required";
    if (!addLorryForm.area) errors.area = "Area is required";
    if (!addLorryForm.state) errors.state = "State is required";
    return errors;
  };

  // Handle add lorry form
  const handleAddLorrySubmit = () => {
    const errors = validateAddLorryForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newLorry: Lorry = {
      id: lorries.length + 1,
      lorryNumber: addLorryForm.lorryNumber,
      model: addLorryForm.model,
      tonnage: addLorryForm.tonnage,
      driver: addLorryForm.driver,
      roadTaxExpiry: addLorryForm.roadTaxExpiry,
      insuranceExpiry: addLorryForm.insuranceExpiry,
      status: "Active",
      lastMaintenance: addLorryForm.lastMaintenance,
      currentBin: null,
      currentLocation: addLorryForm.currentLocation,
      area: addLorryForm.area,
      state: addLorryForm.state,
    };

    setLorries([...lorries, newLorry]);

    // Reset form and close modal
    setAddLorryForm({
      lorryNumber: "",
      model: "",
      tonnage: "",
      driver: "",
      roadTaxExpiry: "",
      insuranceExpiry: "",
      lastMaintenance: "",
      currentLocation: "",
      area: "",
      state: "",
    });
    setFormErrors({});
    setIsAddLorryModalOpen(false);
  };

  // Validate edit lorry form
  const validateEditLorryForm = () => {
    const errors: Record<string, string> = {};
    if (!editLorryForm.lorryNumber.trim()) errors.lorryNumber = "Lorry number is required";
    if (!editLorryForm.model) errors.model = "Model is required";
    if (!editLorryForm.tonnage) errors.tonnage = "Tonnage is required";
    if (!editLorryForm.driver.trim()) errors.driver = "Driver is required";
    if (!editLorryForm.roadTaxExpiry) errors.roadTaxExpiry = "Road tax expiry is required";
    if (!editLorryForm.insuranceExpiry) errors.insuranceExpiry = "Insurance expiry is required";
    if (!editLorryForm.status) errors.status = "Status is required";
    if (!editLorryForm.lastMaintenance) errors.lastMaintenance = "Last maintenance date is required";
    if (!editLorryForm.currentLocation.trim()) errors.currentLocation = "Location is required";
    if (!editLorryForm.area) errors.area = "Area is required";
    if (!editLorryForm.state) errors.state = "State is required";
    return errors;
  };

  // Handle edit lorry form
  const handleEditLorrySubmit = () => {
    const errors = validateEditLorryForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLorries(lorries.map(lorry => 
      lorry.id === editLorryForm.id 
        ? {
            ...lorry,
            lorryNumber: editLorryForm.lorryNumber,
            model: editLorryForm.model,
            tonnage: editLorryForm.tonnage,
            driver: editLorryForm.driver,
            roadTaxExpiry: editLorryForm.roadTaxExpiry,
            insuranceExpiry: editLorryForm.insuranceExpiry,
            status: editLorryForm.status as "Active" | "Maintenance" | "Inactive" | "In-Use",
            lastMaintenance: editLorryForm.lastMaintenance,
            currentLocation: editLorryForm.currentLocation,
            area: editLorryForm.area,
            state: editLorryForm.state,
          }
        : lorry
    ));

    // Reset form and close modal
    setEditLorryForm({
      id: 0,
      lorryNumber: "",
      model: "",
      tonnage: "",
      driver: "",
      roadTaxExpiry: "",
      insuranceExpiry: "",
      status: "",
      lastMaintenance: "",
      currentLocation: "",
      area: "",
      state: "",
    });
    setFormErrors({});
    setIsEditLorryModalOpen(false);
  };

  // Open edit modal with pre-filled data
  const openEditModal = (lorry: Lorry) => {
    setEditLorryForm({
      id: lorry.id,
      lorryNumber: lorry.lorryNumber,
      model: lorry.model,
      tonnage: lorry.tonnage,
      driver: lorry.driver,
      roadTaxExpiry: lorry.roadTaxExpiry,
      insuranceExpiry: lorry.insuranceExpiry,
      status: lorry.status,
      lastMaintenance: lorry.lastMaintenance,
      currentLocation: lorry.currentLocation,
      area: lorry.area || "",
      state: lorry.state || "",
    });
    setIsEditLorryModalOpen(true);
  };

  // Reset add lorry form when modal opens
  useEffect(() => {
    if (isAddLorryModalOpen) {
      setAddLorryForm({
        lorryNumber: "",
        model: "",
        tonnage: "",
        driver: "",
        roadTaxExpiry: "",
        insuranceExpiry: "",
        lastMaintenance: "",
        currentLocation: "",
        area: "",
        state: "",
      });
      setFormErrors({});
    }
  }, [isAddLorryModalOpen]);

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
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Lorry Fleet Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Monitor and manage your lorry fleet and documents efficiently
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search lorries by number, model, or driver..." 
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setIsAddLorryModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Add Lorry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          { title: "Total Lorries", value: totalLorries, color: "blue", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { title: "Active", value: activeLorries, color: "emerald", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
          { title: "In-Use", value: inUseLorries, color: "blue", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { title: "Maintenance", value: maintenanceLorries, color: "amber", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
          { title: "Expiring Soon", value: expiringLorries, color: "red", iconBg: "bg-red-100", iconColor: "text-red-600" },
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
                  <Truck className={`h-8 w-8 ${stat.iconColor} dark:${stat.iconColor.replace("600", "300")}`} />
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
              {LORRY_STATUSES.map(status => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{status}</DropdownMenuItem>
              ))}
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
          <Button 
            variant="outline" 
            size="lg" 
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
          >
            <Calendar className="h-5 w-5" />
            <span>Apr 2025</span>
          </Button>
        </div>
        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
          {filteredLorries.length} Lorries
        </Badge>
      </div>

      {/* Lorry Table */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            <Truck className="h-6 w-6" />
            Lorry Fleet Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("lorryNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Lorry Number
                      {sortBy === "lorryNumber" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("model")}
                  >
                    <div className="flex items-center gap-2">
                      Model & Tonnage
                      {sortBy === "model" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("driver")}
                  >
                    <div className="flex items-center gap-2">
                      Driver
                      {sortBy === "driver" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("roadTaxExpiry")}
                  >
                    <div className="flex items-center gap-2">
                      Road Tax Expiry
                      {sortBy === "roadTaxExpiry" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    onClick={() => handleSort("insuranceExpiry")}
                  >
                    <div className="flex items-center gap-2">
                      Insurance Expiry
                      {sortBy === "insuranceExpiry" && (
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
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
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Current Assignment</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sortedLorries.length > 0 ? (
                    sortedLorries.map((lorry, index) => (
                      <motion.tr
                        key={lorry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{lorry.lorryNumber}</TableCell>
                        <TableCell>
                          <div className="text-gray-900 dark:text-gray-100">{lorry.model}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{lorry.tonnage}</div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">{lorry.driver}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {new Date(lorry.roadTaxExpiry).toLocaleDateString()}
                          </div>
                          {getExpiryWarning(lorry.roadTaxExpiry)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {new Date(lorry.insuranceExpiry).toLocaleDateString()}
                          </div>
                          {getExpiryWarning(lorry.insuranceExpiry)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(lorry.status)} rounded-full px-3 py-1 font-medium`}>
                            {lorry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lorry.currentBin ? (
                            <div>
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                Bin: <span className="font-medium">{lorry.currentBin}</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{lorry.currentLocation}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                              onClick={() => openEditModal(lorry)}
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
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center py-8">
                          <Truck className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No lorries found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filter settings, or add a new lorry.</p>
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

      {/* Add Lorry Modal */}
      <Dialog open={isAddLorryModalOpen} onOpenChange={(open) => {
        setIsAddLorryModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Lorry
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={addLorryForm.lorryNumber}
                onChange={(e) => setAddLorryForm({ ...addLorryForm, lorryNumber: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Lorry Number</label>
              {formErrors.lorryNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.lorryNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={addLorryForm.model}
                onValueChange={(value) => setAddLorryForm({ ...addLorryForm, model: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {LORRY_MODELS.map(model => (
                    <SelectItem key={model} value={model} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.model && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.model}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={addLorryForm.tonnage}
                onValueChange={(value) => setAddLorryForm({ ...addLorryForm, tonnage: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select tonnage" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {LORRY_TONNAGES.map(tonnage => (
                    <SelectItem key={tonnage} value={tonnage} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{tonnage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.tonnage && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.tonnage}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={addLorryForm.driver}
                onChange={(e) => setAddLorryForm({ ...addLorryForm, driver: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Driver Name</label>
              {formErrors.driver && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.driver}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={addLorryForm.roadTaxExpiry}
                onChange={(e) => setAddLorryForm({ ...addLorryForm, roadTaxExpiry: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700players pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Road Tax Expiry</label>
              {formErrors.roadTaxExpiry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.roadTaxExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={addLorryForm.insuranceExpiry}
                onChange={(e) => setAddLorryForm({ ...addLorryForm, insuranceExpiry: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Insurance Expiry</label>
              {formErrors.insuranceExpiry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.insuranceExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={addLorryForm.lastMaintenance}
                onChange={(e) => setAddLorryForm({ ...addLorryForm, lastMaintenance: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Last Maintenance</label>
              {formErrors.lastMaintenance && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.lastMaintenance}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={addLorryForm.currentLocation}
                onChange={(e) => setAddLorryForm({ ...addLorryForm, currentLocation: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Current Location</label>
              {formErrors.currentLocation && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.currentLocation}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={addLorryForm.area}
                onValueChange={(value) => setAddLorryForm({ ...addLorryForm, area: value })}
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
                value={addLorryForm.state}
                onValueChange={(value) => setAddLorryForm({ ...addLorryForm, state: value })}
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
                setIsAddLorryModalOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddLorrySubmit}
            >
              Add Lorry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lorry Modal */}
      <Dialog open={isEditLorryModalOpen} onOpenChange={(open) => {
        setIsEditLorryModalOpen(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Edit Lorry
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={editLorryForm.lorryNumber}
                onChange={(e) => setEditLorryForm({ ...editLorryForm, lorryNumber: e.target.value })}
                className="w-full rounded-xl(border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Lorry Number</label>
              {formErrors.lorryNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.lorryNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editLorryForm.model}
                onValueChange={(value) => setEditLorryForm({ ...editLorryForm, model: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {LORRY_MODELS.map(model => (
                    <SelectItem key={model} value={model} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.model && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.model}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editLorryForm.tonnage}
                onValueChange={(value) => setEditLorryForm({ ...editLorryForm, tonnage: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select tonnage" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {LORRY_TONNAGES.map(tonnage => (
                    <SelectItem key={tonnage} value={tonnage} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{tonnage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.tonnage && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.tonnage}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={editLorryForm.driver}
                onChange={(e) => setEditLorryForm({ ...editLorryForm, driver: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Driver Name</label>
              {formErrors.driver && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.driver}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={editLorryForm.roadTaxExpiry}
                onChange={(e) => setEditLorryForm({ ...editLorryForm, roadTaxExpiry: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Road Tax Expiry</label>
              {formErrors.roadTaxExpiry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.roadTaxExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={editLorryForm.insuranceExpiry}
                onChange={(e) => setEditLorryForm({ ...editLorryForm, insuranceExpiry: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Insurance Expiry</label>
              {formErrors.insuranceExpiry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.insuranceExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editLorryForm.status}
                onValueChange={(value) => setEditLorryForm({ ...editLorryForm, status: value })}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {LORRY_STATUSES.map(status => (
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
                type="date"
                value={editLorryForm.lastMaintenance}
                onChange={(e) => setEditLorryForm({ ...editLorryForm, lastMaintenance: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Last Maintenance</label>
              {formErrors.lastMaintenance && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.lastMaintenance}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={editLorryForm.currentLocation}
                onChange={(e) => setEditLorryForm({ ...editLorryForm, currentLocation: e.target.value })}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Current Location</label>
              {formErrors.currentLocation && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.currentLocation}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={editLorryForm.area}
                onValueChange={(value) => setEditLorryForm({ ...editLorryForm, area: value })}
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
                value={editLorryForm.state}
                onValueChange={(value) => setEditLorryForm({ ...editLorryForm, state: value })}
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
                setIsEditLorryModalOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleEditLorrySubmit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default LorryManagement;