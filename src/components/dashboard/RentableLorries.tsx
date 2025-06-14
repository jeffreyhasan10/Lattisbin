import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Truck,
  UserCheck,
  Filter,
  MapPin,
  Phone,
  User,
  Calendar,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interfaces (unchanged)
interface Driver {
  id: number;
  name: string;
  icNumber: string;
  licenseNo: string;
  licenseExpiry: string;
  phone: string;
  address: string;
  type: "Internal" | "Third-Party";
  assignedLorry: string | null;
  status: "Active" | "Available" | "On Leave";
}

interface RentableLorry {
  id: number;
  lorryNumber: string;
  model: string;
  tonnage: string;
  owner: string;
  phone: string;
  rentalRate: string;
  status: "Available" | "Rented" | "In Maintenance";
  roadTaxExpiry: string;
  insuranceExpiry: string;
  isRegularlyRentable: boolean;
  area: string;
  binNumber: string;
  rentedTo?: string;
  untilDate?: string;
}

// Dummy data (unchanged)
const DUMMY_DRIVERS: Driver[] = [
  {
    id: 1,
    name: "Ahmad bin Ismail",
    icNumber: "920101-14-5678",
    licenseNo: "D12345678",
    licenseExpiry: "2025-06-30",
    phone: "+60123456789",
    address: "123 Jalan Ampang, Kuala Lumpur",
    type: "Internal",
    assignedLorry: "WXX 1234",
    status: "Active",
  },
  {
    id: 2,
    name: "Siti binti Hassan",
    icNumber: "890215-08-1234",
    licenseNo: "D87654321",
    licenseExpiry: "2025-05-15",
    phone: "+60198765432",
    address: "45 Jalan Pinang, Penang",
    type: "Third-Party",
    assignedLorry: null,
    status: "Available",
  },
  {
    id: 3,
    name: "Lim Wei Jie",
    icNumber: "950630-12-9876",
    licenseNo: "D45678912",
    licenseExpiry: "2025-04-20", // Expiring soon
    phone: "+60187654321",
    address: "78 Jalan Tun Razak, Johor Bahru",
    type: "Internal",
    assignedLorry: "JXX 5678",
    status: "On Leave",
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    icNumber: "880912-03-4567",
    licenseNo: "D78912345",
    licenseExpiry: "2026-01-10",
    phone: "+60134567890",
    address: "12 Jalan Ipoh, Ipoh",
    type: "Third-Party",
    assignedLorry: "QXX 9012",
    status: "Active",
  },
  {
    id: 5,
    name: "Noraini binti Abdullah",
    icNumber: "930725-07-2345",
    licenseNo: "D32165498",
    licenseExpiry: "2025-12-31",
    phone: "+60123459876",
    address: "56 Jalan Klang Lama, Klang",
    type: "Internal",
    assignedLorry: null,
    status: "Available",
  },
];
const DUMMY_RENTABLE_LORRIES: RentableLorry[] = [
  {
    id: 1,
    lorryNumber: "WXX 1234",
    model: "Hino 500",
    tonnage: "10 Ton",
    owner: "TransLogistics Sdn Bhd",
    phone: "+60123456789",
    rentalRate: "RM 500/day",
    status: "Rented",
    roadTaxExpiry: "2025-08-15",
    insuranceExpiry: "2025-07-30",
    isRegularlyRentable: true,
    area: "Kuala Lumpur",
    binNumber: "BIN-001",
    rentedTo: "ABC Construction",
    untilDate: "2025-05-30",
  },
  {
    id: 2,
    lorryNumber: "JXX 5678",
    model: "Isuzu NPR",
    tonnage: "5 Ton",
    owner: "FreightMaster",
    phone: "+60198765432",
    rentalRate: "RM 300/day",
    status: "Available",
    roadTaxExpiry: "2025-04-25", // Expiring soon
    insuranceExpiry: "2025-06-10",
    isRegularlyRentable: true,
    area: "Johor Bahru",
    binNumber: "BIN-002",
  },
  {
    id: 3,
    lorryNumber: "QXX 9012",
    model: "Mitsubishi Fuso",
    tonnage: "8 Ton",
    owner: "LogiMove Sdn Bhd",
    phone: "+60187654321",
    rentalRate: "RM 400/day",
    status: "In Maintenance",
    roadTaxExpiry: "2025-11-20",
    insuranceExpiry: "2025-10-15",
    isRegularlyRentable: false,
    area: "Penang",
    binNumber: "BIN-003",
  },
  {
    id: 4,
    lorryNumber: "PXX 3456",
    model: "Volvo FMX",
    tonnage: "12 Ton",
    owner: "HeavyDuty Trans",
    phone: "+60134567890",
    rentalRate: "RM 600/day",
    status: "Available",
    roadTaxExpiry: "2026-02-28",
    insuranceExpiry: "2026-01-31",
    isRegularlyRentable: true,
    area: "Ipoh",
    binNumber: "BIN-004",
  },
  {
    id: 5,
    lorryNumber: "KXX 7890",
    model: "Scania P410",
    tonnage: "15 Ton",
    owner: "MegaFreight Co.",
    phone: "+60123459876",
    rentalRate: "RM 700/day",
    status: "Rented",
    roadTaxExpiry: "2025-09-30",
    insuranceExpiry: "2025-04-15", // Expiring soon
    isRegularlyRentable: true,
    area: "Klang",
    binNumber: "BIN-005",
    rentedTo: "XYZ Logistics",
    untilDate: "2025-06-15",
  },
];

const AREAS = ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh", "Klang"];
const DRIVER_STATUSES = ["Active", "Available", "On Leave"];
const LORRY_STATUSES = ["Available", "Rented", "In Maintenance"];
const DRIVER_TYPES = ["Internal", "Third-Party"];

const RentableLorries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"drivers" | "lorries">("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [drivers, setDrivers] = useState<Driver[]>(DUMMY_DRIVERS);
  const [lorries, setLorries] = useState<RentableLorry[]>(
    DUMMY_RENTABLE_LORRIES
  );
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isAddLorryOpen, setIsAddLorryOpen] = useState(false);
  const [isEditDriverOpen, setIsEditDriverOpen] = useState(false);
  const [isEditLorryOpen, setIsEditLorryOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedLorry, setSelectedLorry] = useState<RentableLorry | null>(
    null
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [newDriver, setNewDriver] = useState<Driver>({
    id: 0,
    name: "",
    icNumber: "",
    licenseNo: "",
    licenseExpiry: "",
    phone: "",
    address: "",
    type: "Internal",
    assignedLorry: "",
    status: "Available",
  });

  const [newLorry, setNewLorry] = useState<RentableLorry>({
    id: 0,
    lorryNumber: "",
    model: "",
    tonnage: "",
    owner: "",
    phone: "",
    rentalRate: "",
    status: "Available",
    roadTaxExpiry: "",
    insuranceExpiry: "",
    isRegularlyRentable: true,
    area: "",
    binNumber: "",
  });

  // Summary stats
  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(
    (d) => d.status === "Available"
  ).length;
  const totalLorries = lorries.length;
  const availableLorries = lorries.filter(
    (l) => l.status === "Available"
  ).length;

  // Filter and sort logic
  const filteredDrivers = drivers
    .filter(
      (driver) =>
        (statusFilter === "All" || driver.status === statusFilter) &&
        (areaFilter === "All" ||
          driver.address.toLowerCase().includes(areaFilter.toLowerCase())) &&
        (driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone.includes(searchTerm) ||
          (driver.assignedLorry &&
            driver.assignedLorry
              .toLowerCase()
              .includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "licenseExpiry") {
        const dateA = new Date(a.licenseExpiry).getTime();
        const dateB = new Date(b.licenseExpiry).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      const valA = a[sortBy as keyof Driver]?.toString().toLowerCase() || "";
      const valB = b[sortBy as keyof Driver]?.toString().toLowerCase() || "";
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  const filteredLorries = lorries
    .filter(
      (lorry) =>
        (statusFilter === "All" || lorry.status === statusFilter) &&
        (areaFilter === "All" || lorry.area === areaFilter) &&
        (lorry.lorryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lorry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lorry.owner.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "roadTaxExpiry" || sortBy === "insuranceExpiry") {
        const dateA = new Date(a[sortBy as keyof RentableLorry]).getTime();
        const dateB = new Date(b[sortBy as keyof RentableLorry]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      const valA =
        a[sortBy as keyof RentableLorry]?.toString().toLowerCase() || "";
      const valB =
        b[sortBy as keyof RentableLorry]?.toString().toLowerCase() || "";
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Available":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "On Leave":
      case "In Maintenance":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Rented":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const validateDriverForm = (driver: Driver) => {
    const errors: Record<string, string> = {};
    if (!driver.name.trim()) errors.name = "Name is required";
    if (!driver.icNumber.trim()) errors.icNumber = "IC Number is required";
    if (!driver.licenseNo.trim())
      errors.licenseNo = "License Number is required";
    if (!driver.licenseExpiry)
      errors.licenseExpiry = "License Expiry is required";
    if (!driver.phone.trim()) errors.phone = "Phone Number is required";
    if (!/^\+601[0-9]{8,9}$/.test(driver.phone))
      errors.phone = "Invalid Malaysian phone number";
    if (!driver.address.trim()) errors.address = "Address is required";
    return errors;
  };

  const validateLorryForm = (lorry: RentableLorry) => {
    const errors: Record<string, string> = {};
    if (!lorry.lorryNumber.trim())
      errors.lorryNumber = "Lorry Number is required";
    if (!lorry.model.trim()) errors.model = "Model is required";
    if (!lorry.tonnage.trim()) errors.tonnage = "Tonnage is required";
    if (!lorry.owner.trim()) errors.owner = "Owner is required";
    if (!lorry.phone.trim()) errors.phone = "Phone Number is required";
    if (!/^\+601[0-9]{8,9}$/.test(lorry.phone))
      errors.phone = "Invalid Malaysian phone number";
    if (!lorry.rentalRate.trim()) errors.rentalRate = "Rental Rate is required";
    if (!lorry.roadTaxExpiry)
      errors.roadTaxExpiry = "Road Tax Expiry is required";
    if (!lorry.insuranceExpiry)
      errors.insuranceExpiry = "Insurance Expiry is required";
    if (!lorry.area) errors.area = "Area is required";
    if (!lorry.binNumber.trim()) errors.binNumber = "BIN Number is required";
    return errors;
  };

  const handleAddDriver = () => {
    const errors = validateDriverForm(newDriver);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const newId = drivers.length + 1;
    setDrivers([
      ...drivers,
      {
        ...newDriver,
        id: newId,
        assignedLorry: newDriver.assignedLorry || null,
      },
    ]);
    setNewDriver({
      id: 0,
      name: "",
      icNumber: "",
      licenseNo: "",
      licenseExpiry: "",
      phone: "",
      address: "",
      type: "Internal",
      assignedLorry: "",
      status: "Available",
    });
    setFormErrors({});
    setIsAddDriverOpen(false);
  };

  const handleAddLorry = () => {
    const errors = validateLorryForm(newLorry);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const newId = lorries.length + 1;
    setLorries([...lorries, { ...newLorry, id: newId }]);
    setNewLorry({
      id: 0,
      lorryNumber: "",
      model: "",
      tonnage: "",
      owner: "",
      phone: "",
      rentalRate: "",
      status: "Available",
      roadTaxExpiry: "",
      insuranceExpiry: "",
      isRegularlyRentable: true,
      area: "",
      binNumber: "",
    });
    setFormErrors({});
    setIsAddLorryOpen(false);
  };

  const handleEditDriver = () => {
    if (!selectedDriver) return;
    const errors = validateDriverForm(selectedDriver);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setDrivers(
      drivers.map((d) =>
        d.id === selectedDriver.id ? { ...selectedDriver } : d
      )
    );
    setFormErrors({});
    setIsEditDriverOpen(false);
    setSelectedDriver(null);
  };

  const handleEditLorry = () => {
    if (!selectedLorry) return;
    const errors = validateLorryForm(selectedLorry);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setLorries(
      lorries.map((l) => (l.id === selectedLorry.id ? { ...selectedLorry } : l))
    );
    setFormErrors({});
    setIsEditLorryOpen(false);
    setSelectedLorry(null);
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
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {activeTab === "drivers" ? "Driver Management" : "Rentable Lorries"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {activeTab === "drivers"
              ? "Manage your driver roster and assignments"
              : "Track and manage rentable lorries for your operations"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={`Search ${
                activeTab === "drivers" ? "drivers" : "lorries"
              }...`}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                setActiveTab(activeTab === "drivers" ? "lorries" : "drivers")
              }
            >
              {activeTab === "drivers" ? (
                <Truck className="h-5 w-5" />
              ) : (
                <UserCheck className="h-5 w-5" />
              )}
              {activeTab === "drivers" ? "View Lorries" : "View Drivers"}
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                activeTab === "drivers"
                  ? setIsAddDriverOpen(true)
                  : setIsAddLorryOpen(true)
              }
            >
              <Plus className="h-5 w-5" />
              {activeTab === "drivers" ? "Add Driver" : "Add Lorry"}
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
          {
            title: activeTab === "drivers" ? "Total Drivers" : "Total Lorries",
            value: activeTab === "drivers" ? totalDrivers : totalLorries,
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            title:
              activeTab === "drivers"
                ? "Available Drivers"
                : "Available Lorries",
            value:
              activeTab === "drivers" ? availableDrivers : availableLorries,
            color: "emerald",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
          {
            title:
              activeTab === "drivers" ? "Active Drivers" : "Rented Lorries",
            value:
              activeTab === "drivers"
                ? drivers.filter((d) => d.status === "Active").length
                : lorries.filter((l) => l.status === "Rented").length,
            color: "blue",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            title: activeTab === "drivers" ? "On Leave" : "In Maintenance",
            value:
              activeTab === "drivers"
                ? drivers.filter((d) => d.status === "On Leave").length
                : lorries.filter((l) => l.status === "In Maintenance").length,
            color: "amber",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
          },
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`rounded-full ${
                    stat.iconBg
                  } p-4 dark:${stat.iconBg.replace("100", "900")}`}
                >
                  {activeTab === "drivers" ? (
                    <UserCheck
                      className={`h-8 w-8 ${
                        stat.iconColor
                      } dark:${stat.iconColor.replace("600", "300")}`}
                    />
                  ) : (
                    <Truck
                      className={`h-8 w-8 ${
                        stat.iconColor
                      } dark:${stat.iconColor.replace("600", "300")}`}
                    />
                  )}
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
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <Filter className="h-5 w-5" />
                <span>
                  {statusFilter === "All" ? "Filter by Status" : statusFilter}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-gray-800 rounded-xl"
            >
              <DropdownMenuLabel className="font-semibold">
                Filter by Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter("All")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                All
              </DropdownMenuItem>
              {(activeTab === "drivers" ? DRIVER_STATUSES : LORRY_STATUSES).map(
                (status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {status}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <MapPin className="h-5 w-5" />
                <span>
                  {areaFilter === "All" ? "Filter by Area" : areaFilter}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-gray-800 rounded-xl"
            >
              <DropdownMenuLabel className="font-semibold">
                Filter by Area
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setAreaFilter("All")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                All
              </DropdownMenuItem>
              {AREAS.map((area) => (
                <DropdownMenuItem
                  key={area}
                  onClick={() => setAreaFilter(area)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {area}
                </DropdownMenuItem>
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
        <Badge
          variant="outline"
          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full"
        >
          {activeTab === "drivers"
            ? filteredDrivers.length
            : filteredLorries.length}{" "}
          {activeTab === "drivers" ? "Drivers" : "Lorries"}
        </Badge>
      </div>

      {/* Table */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            {activeTab === "drivers" ? (
              <UserCheck className="h-6 w-6" />
            ) : (
              <Truck className="h-6 w-6" />
            )}
            {activeTab === "drivers"
              ? "Driver Directory"
              : "Rentable Lorry Directory"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {activeTab === "drivers" ? (
                    <>
                      <TableHead
                        className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {sortBy === "name" && (
                            <ArrowUpDown
                              className={`h-4 w-4 ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("licenseExpiry")}
                      >
                        <div className="flex items-center gap-2">
                          License
                          {sortBy === "licenseExpiry" && (
                            <ArrowUpDown
                              className={`h-4 w-4 ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Assigned Lorry
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead
                        className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("lorryNumber")}
                      >
                        <div className="flex items-center gap-2">
                          Lorry Number
                          {sortBy === "lorryNumber" && (
                            <ArrowUpDown
                              className={`h-4 w-4 ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Model & Tonnage
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Owner
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Rental Rate
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("roadTaxExpiry")}
                      >
                        <div className="flex items-center gap-2">
                          Road Tax
                          {sortBy === "roadTaxExpiry" && (
                            <ArrowUpDown
                              className={`h-4 w-4 ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-500 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("insuranceExpiry")}
                      >
                        <div className="flex items-center gap-2">
                          Insurance
                          {sortBy === "insuranceExpiry" && (
                            <ArrowUpDown
                              className={`h-4 w-4 ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Details
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {activeTab === "drivers" ? (
                    filteredDrivers.length > 0 ? (
                      filteredDrivers.map((driver) => (
                        <motion.tr
                          key={driver.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            {driver.name}
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900 dark:text-gray-100">
                              {driver.licenseNo}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              Exp:{" "}
                              {new Date(
                                driver.licenseExpiry
                              ).toLocaleDateString()}
                              {isExpiringSoon(driver.licenseExpiry) && (
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {driver.phone}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                driver.type === "Internal"
                                  ? "outline"
                                  : "secondary"
                              }
                              className="rounded-full"
                            >
                              {driver.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {driver.assignedLorry || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                driver.status
                              )} rounded-full px-3 py-1 font-medium`}
                            >
                              {driver.status}
                            </Badge>
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
                                onClick={() => {
                                  setSelectedDriver(driver);
                                  setIsEditDriverOpen(true);
                                }}
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
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center py-8">
                            <UserCheck className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                              No drivers found
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                              Try adjusting your search or filter settings.
                            </p>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )
                  ) : filteredLorries.length > 0 ? (
                    filteredLorries.map((lorry) => (
                      <motion.tr
                        key={lorry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {lorry.lorryNumber}
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-900 dark:text-gray-100">
                            {lorry.model}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {lorry.tonnage}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-900 dark:text-gray-100">
                            {lorry.owner}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {lorry.phone}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            BIN: {lorry.binNumber}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {lorry.rentalRate}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            Exp:{" "}
                            {new Date(lorry.roadTaxExpiry).toLocaleDateString()}
                            {isExpiringSoon(lorry.roadTaxExpiry) && (
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            Exp:{" "}
                            {new Date(
                              lorry.insuranceExpiry
                            ).toLocaleDateString()}
                            {isExpiringSoon(lorry.insuranceExpiry) && (
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              lorry.status
                            )} rounded-full px-3 py-1 font-medium`}
                          >
                            {lorry.status}
                          </Badge>
                          {!lorry.isRegularlyRentable && (
                            <Badge
                              variant="secondary"
                              className="ml-2 rounded-full"
                            >
                              Non-Regular
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {lorry.status === "Rented" ? (
                            <div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {lorry.rentedTo}
                              </span>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Until:{" "}
                                {new Date(
                                  lorry.untilDate!
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              —
                            </span>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Area: {lorry.area}
                          </div>
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
                              onClick={() => {
                                setSelectedLorry(lorry);
                                setIsEditLorryOpen(true);
                              }}
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
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center py-8">
                          <Truck className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No lorries found
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            Try adjusting your search or filter settings.
                          </p>
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

      {/* Add Driver Modal */}
      <Dialog
        open={isAddDriverOpen}
        onOpenChange={(open) => {
          setIsAddDriverOpen(open);
          if (!open) setFormErrors({});
        }}
      >
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Driver
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={newDriver.name}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, name: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Name
              </label>
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.name}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newDriver.icNumber}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, icNumber: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                IC Number
              </label>
              {formErrors.icNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.icNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newDriver.licenseNo}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, licenseNo: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                License Number
              </label>
              {formErrors.licenseNo && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.licenseNo}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={newDriver.licenseExpiry}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, licenseExpiry: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                License Expiry
              </label>
              {formErrors.licenseExpiry && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.licenseExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newDriver.phone}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, phone: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Phone Number
              </label>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newDriver.address}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, address: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Address
              </label>
              {formErrors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.address}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={newDriver.type}
                onValueChange={(value) =>
                  setNewDriver({
                    ...newDriver,
                    type: value as "Internal" | "Third-Party",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {DRIVER_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                value={newDriver.assignedLorry}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, assignedLorry: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Assigned Lorry
              </label>
            </div>
            <div className="relative">
              <Select
                value={newDriver.status}
                onValueChange={(value) =>
                  setNewDriver({
                    ...newDriver,
                    status: value as "Active" | "Available" | "On Leave",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {DRIVER_STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsAddDriverOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddDriver}
            >
              Add Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lorry Modal */}
      <Dialog
        open={isAddLorryOpen}
        onOpenChange={(open) => {
          setIsAddLorryOpen(open);
          if (!open) setFormErrors({});
        }}
      >
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
                value={newLorry.lorryNumber}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, lorryNumber: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Lorry Number
              </label>
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
              <Input
                value={newLorry.model}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, model: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Model
              </label>
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
              <Input
                value={newLorry.tonnage}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, tonnage: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Tonnage
              </label>
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
                value={newLorry.owner}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, owner: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Owner
              </label>
              {formErrors.owner && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.owner}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newLorry.phone}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, phone: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Phone Number
              </label>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={newLorry.rentalRate}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, rentalRate: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Rental Rate
              </label>
              {formErrors.rentalRate && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.rentalRate}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={newLorry.roadTaxExpiry}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, roadTaxExpiry: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Road Tax Expiry
              </label>
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
                value={newLorry.insuranceExpiry}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, insuranceExpiry: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Insurance Expiry
              </label>
              {formErrors.insuranceExpiry && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />{" "}
                  {formErrors.insuranceExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={newLorry.isRegularlyRentable ? "yes" : "no"}
                onValueChange={(value) =>
                  setNewLorry({
                    ...newLorry,
                    isRegularlyRentable: value === "yes",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select rentable status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="yes"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Yes
                  </SelectItem>
                  <SelectItem
                    value="no"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    No - Not Regularly Rentable
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Select
                value={newLorry.area}
                onValueChange={(value) =>
                  setNewLorry({ ...newLorry, area: value })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {AREAS.map((area) => (
                    <SelectItem
                      key={area}
                      value={area}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {area}
                    </SelectItem>
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
              <Input
                value={newLorry.binNumber}
                onChange={(e) =>
                  setNewLorry({ ...newLorry, binNumber: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                BIN Number
              </label>
              {formErrors.binNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.binNumber}
                </motion.p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsAddLorryOpen(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddLorry}
            >
              Add Lorry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Driver Modal */}
      <Dialog
        open={isEditDriverOpen}
        onOpenChange={(open) => {
          setIsEditDriverOpen(open);
          if (!open) {
            setSelectedDriver(null);
            setFormErrors({});
          }
        }}
      >
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Edit Driver
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                value={selectedDriver?.name || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Name
              </label>
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.name}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedDriver?.icNumber || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    icNumber: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                IC Number
              </label>
              {formErrors.icNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.icNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedDriver?.licenseNo || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    licenseNo: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                License Number
              </label>
              {formErrors.licenseNo && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.licenseNo}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={selectedDriver?.licenseExpiry || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    licenseExpiry: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                License Expiry
              </label>
              {formErrors.licenseExpiry && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.licenseExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedDriver?.phone || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Phone Number
              </label>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedDriver?.address || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    address: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Address
              </label>
              {formErrors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.address}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={selectedDriver?.type || "Internal"}
                onValueChange={(value) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    type: value as "Internal" | "Third-Party",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {DRIVER_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                value={selectedDriver?.assignedLorry || ""}
                onChange={(e) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    assignedLorry: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Assigned Lorry
              </label>
            </div>
            <div className="relative">
              <Select
                value={selectedDriver?.status || "Available"}
                onValueChange={(value) =>
                  setSelectedDriver({
                    ...selectedDriver!,
                    status: value as "Active" | "Available" | "On Leave",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {DRIVER_STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsEditDriverOpen(false);
                setSelectedDriver(null);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleEditDriver}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lorry Modal */}
      <Dialog
        open={isEditLorryOpen}
        onOpenChange={(open) => {
          setIsEditLorryOpen(open);
          if (!open) {
            setSelectedLorry(null);
            setFormErrors({});
          }
        }}
      >
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
                value={selectedLorry?.lorryNumber || ""}
                onChange={(e) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    lorryNumber: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Lorry Number
              </label>
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
              <Input
                value={selectedLorry?.model || ""}
                onChange={(e) =>
                  setSelectedLorry({ ...selectedLorry!, model: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Model
              </label>
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
              <Input
                value={selectedLorry?.tonnage || ""}
                onChange={(e) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    tonnage: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Tonnage
              </label>
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
                value={selectedLorry?.owner || ""}
                onChange={(e) =>
                  setSelectedLorry({ ...selectedLorry!, owner: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Owner
              </label>
              {formErrors.owner && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.owner}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedLorry?.phone || ""}
                onChange={(e) =>
                  setSelectedLorry({ ...selectedLorry!, phone: e.target.value })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Phone Number
              </label>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                value={selectedLorry?.rentalRate || ""}
                onChange={(e) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    rentalRate: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Rental Rate
              </label>
              {formErrors.rentalRate && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.rentalRate}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                value={selectedLorry?.roadTaxExpiry || ""}
                onChange={(e) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    roadTaxExpiry: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Road Tax Expiry
              </label>
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
                value={selectedLorry?.insuranceExpiry || ""}
                onChange={(e) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    insuranceExpiry: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Insurance Expiry
              </label>
              {formErrors.insuranceExpiry && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />{" "}
                  {formErrors.insuranceExpiry}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select
                value={selectedLorry?.isRegularlyRentable ? "yes" : "no"}
                onValueChange={(value) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    isRegularlyRentable: value === "yes",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select rentable status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="yes"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Yes
                  </SelectItem>
                  <SelectItem
                    value="no"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    No - Not Regularly Rentable
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Select
                value={selectedLorry?.area || ""}
                onValueChange={(value) =>
                  setSelectedLorry({ ...selectedLorry!, area: value })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {AREAS.map((area) => (
                    <SelectItem
                      key={area}
                      value={area}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {area}
                    </SelectItem>
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
              <Input
                value={selectedLorry?.binNumber || ""}
                onChange={(e) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    binNumber: e.target.value,
                  })
                }
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                BIN Number
              </label>
              {formErrors.binNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.binNumber}
                </motion.p>
              )}
            </div>
            {selectedLorry?.status === "Rented" && (
              <>
                <div className="relative">
                  <Input
                    value={selectedLorry?.rentedTo || ""}
                    onChange={(e) =>
                      setSelectedLorry({
                        ...selectedLorry!,
                        rentedTo: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                    placeholder=" "
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                    Rented To
                  </label>
                </div>
                <div className="relative">
                  <Input
                    type="date"
                    value={selectedLorry?.untilDate || ""}
                    onChange={(e) =>
                      setSelectedLorry({
                        ...selectedLorry!,
                        untilDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                    placeholder=" "
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                    Until Date
                  </label>
                </div>
              </>
            )}
            <div className="relative">
              <Select
                value={selectedLorry?.status || "Available"}
                onValueChange={(value) =>
                  setSelectedLorry({
                    ...selectedLorry!,
                    status: value as "Available" | "Rented" | "In Maintenance",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {LORRY_STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsEditLorryOpen(false);
                setSelectedLorry(null);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleEditLorry}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RentableLorries;
