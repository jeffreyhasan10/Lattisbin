import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Truck,
  AlertTriangle,
  Filter,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy lorry data
const DUMMY_LORRIES = [
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
  },
  {
    id: 4,
    lorryNumber: "MYE 5678",
    model: "Nissan UD",
    tonnage: "10 Ton",
    driver: "Mohammad Zulkifli",
    roadTaxExpiry: "2024-04-05",
    insuranceExpiry: "2024-04-15",
    status: "Active",
    lastMaintenance: "2024-02-28",
    currentBin: "ASR105",
    currentLocation: "Johor Bahru",
  },
];

const LorryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterValue, setFilterValue] = useState("all");
  const [sortBy, setSortBy] = useState("lorryNumber");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter and sort lorries based on search term, active tab, and sort settings
  const filteredLorries = DUMMY_LORRIES
    .filter((lorry) => {
      // Apply search filter
      const matchesSearch =
        lorry.lorryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lorry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lorry.driver.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply tab filter
      if (activeTab === "all") return matchesSearch;
      if (activeTab === "expiring") {
        const roadTaxDays = getDaysUntil(lorry.roadTaxExpiry);
        const insuranceDays = getDaysUntil(lorry.insuranceExpiry);
        return matchesSearch && (roadTaxDays <= 30 || insuranceDays <= 30);
      }
      return matchesSearch && lorry.status.toLowerCase() === activeTab.toLowerCase();
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "roadTaxExpiry" || sortBy === "insuranceExpiry") {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Default sort by lorry number or other string fields
      const valA = a[sortBy].toString().toLowerCase();
      const valB = b[sortBy].toString().toLowerCase();
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  // Calculate days until expiry
  const getDaysUntil = (dateStr: string): number => {
    const expiryDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get badge color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "Maintenance":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Inactive":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 hover:bg-gray-200";
    }
  };

  // Get expiry warning if needed
  const getExpiryWarning = (expiryDate: string) => {
    const daysUntil = getDaysUntil(expiryDate);
    if (daysUntil <= 0) {
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge variant="destructive">Expired</Badge>
        </motion.div>
      );
    } else if (daysUntil <= 30) {
      return (
        <motion.div
          className="flex items-center text-amber-600"
          whileHover={{ scale: 1.05 }}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>{daysUntil} days left</span>
        </motion.div>
      );
    }
    return null;
  };

  // Count lorries by status
  const countActive = DUMMY_LORRIES.filter((lorry) => lorry.status === "Active").length;
  const countMaintenance = DUMMY_LORRIES.filter((lorry) => lorry.status === "Maintenance").length;

  // Count expiring documents
  const countExpiring = DUMMY_LORRIES.filter((lorry) => {
    const roadTaxDays = getDaysUntil(lorry.roadTaxExpiry);
    const insuranceDays = getDaysUntil(lorry.insuranceExpiry);
    return roadTaxDays <= 30 || insuranceDays <= 30;
  }).length;

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-display tracking-tight">
            Lorry Fleet Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage your lorry fleet and documents
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Lorry
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {[
          {
            title: "All Lorries",
            subtitle: "Total fleet",
            count: DUMMY_LORRIES.length,
            color: "blue-500",
            tab: "all",
          },
          {
            title: "Active Fleet",
            subtitle: "Ready for operations",
            count: countActive,
            color: "emerald-500",
            tab: "active",
          },
          {
            title: "Expiring Soon",
            subtitle: "Road tax or insurance",
            count: countExpiring,
            color: "amber-500",
            tab: "expiring",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`border-l-4 ${
                activeTab === card.tab ? `border-l-${card.color}` : "border-l-transparent"
              } cursor-pointer transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-gray-200 dark:border-gray-700`}
              onClick={() => setActiveTab(card.tab)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-800 dark:text-gray-100 font-display">
                    {card.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.subtitle}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg bg-${card.color}/10 flex items-center justify-center shadow-sm`}
                >
                  <span className={`font-bold text-${card.color} text-lg`}>{card.count}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-4"
        variants={itemVariants}
      >
        <motion.div
          className="relative flex-1"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search lorries..."
            className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 rounded-lg shadow-sm transition-all duration-200 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        <div className="flex flex-wrap gap-2">
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-[160px] border-gray-200 dark:border-gray-700 hover:border-blue-500/30 rounded-lg shadow-sm transition-colors bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-colors bg-white dark:bg-gray-800"
            >
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Apr 2025</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-700 shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 pb-3 pt-4">
            <CardTitle className="text-white text-xl font-display flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Lorry Fleet Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                >
                  {filteredLorries.length} Vehicles
                </Badge>
              </motion.div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {[
                      { key: "lorryNumber", label: "Lorry Number" },
                      { key: "model", label: "Model & Tonnage" },
                      { key: "driver", label: "Driver" },
                      { key: "roadTaxExpiry", label: "Road Tax Expiry" },
                      { key: "insuranceExpiry", label: "Insurance Expiry" },
                      { key: "status", label: "Status" },
                      { key: "currentAssignment", label: "Current Assignment" },
                    ].map((header) => (
                      <TableHead
                        key={header.key}
                        className={`cursor-pointer hover:text-primary transition-colors font-semibold text-gray-700 ${
                          header.key === "currentAssignment" ? "text-right" : ""
                        }`}
                        onClick={() => header.key !== "currentAssignment" && handleSort(header.key)}
                      >
                        <div className="flex items-center">
                          {header.label}
                          {sortBy === header.key && (
                            <ArrowUpDown
                              className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-right font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredLorries.length > 0 ? (
                      filteredLorries.map((lorry, index) => (
                        <motion.tr
                          key={lorry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-800">
                            {lorry.lorryNumber}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-800">{lorry.model}</div>
                            <div className="text-xs text-gray-500">{lorry.tonnage}</div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">{lorry.driver}</TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-700">
                              {new Date(lorry.roadTaxExpiry).toLocaleDateString()}
                            </div>
                            {getExpiryWarning(lorry.roadTaxExpiry)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-700">
                              {new Date(lorry.insuranceExpiry).toLocaleDateString()}
                            </div>
                            {getExpiryWarning(lorry.insuranceExpiry)}
                          </TableCell>
                          <TableCell>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Badge className={getStatusColor(lorry.status)}>
                                {lorry.status}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell>
                            {lorry.currentBin ? (
                              <div>
                                <div className="text-sm text-gray-700">
                                  Bin: <span className="font-medium">{lorry.currentBin}</span>
                                </div>
                                <div className="text-xs text-gray-500">{lorry.currentLocation}</div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg text-primary hover:bg-primary/10"
                                >
                                  View
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg text-primary hover:bg-primary/10"
                                >
                                  Edit
                                </Button>
                              </motion.div>
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
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Truck className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-3" />
                            <p>No lorries found matching your criteria.</p>
                            <p className="text-sm mt-1">Try changing your search or filter settings.</p>
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
      </motion.div>
    </motion.div>
  );
};

export default LorryManagement;
