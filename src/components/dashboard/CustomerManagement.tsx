import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  MapPin,
  Phone,
  Mail,
  FileText,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  RotateCcw,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDebounce } from "use-debounce";

// Error Boundary Component
import { Component, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong.</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please try refreshing the page or contact support.</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface Customer {
  id: number;
  companyName: string;
  rocNumber: string;
  contactPerson: string;
  identityCard: string;
  address: string;
  postcode: string;
  area: string;
  state: string;
  email: string;
  phoneNumber: string;
  registeredByMobile: string;
  notes: string;
  registeredBy: string;
}

interface Column {
  key: keyof Customer | "actions";
  header: string;
  sortable?: boolean;
  visibleOnMobile?: boolean;
  className?: string;
  tooltip?: string;
  render: (value: any, customer: Customer) => JSX.Element;
}

const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: 1,
    companyName: "Azlan Sdn Bhd",
    rocNumber: "201901234567",
    contactPerson: "Ahmad Zaki",
    identityCard: "830505-14-5581",
    address: "15 Jalan Bayan, Taman Sri Rampai",
    postcode: "53300",
    area: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    email: "contact@azlan.com.my",
    phoneNumber: "+60 12-345 6789",
    registeredByMobile: "+60 12-345 6789",
    notes: "Preferred supplier for construction materials",
    registeredBy: "Admin",
  },
  {
    id: 2,
    companyName: "Eastern Metal Works",
    rocNumber: "200805419283",
    contactPerson: "Lee Wei",
    identityCard: "771122-07-5511",
    address: "Lot 23, Kawasan Perindustrian Mergong",
    postcode: "05150",
    area: "Alor Setar",
    state: "Kedah",
    email: "info@easternmetal.com.my",
    phoneNumber: "+60 19-876 5432",
    registeredByMobile: "+60 19-876 5432",
    notes: "Specializes in metal fabrication",
    registeredBy: "Manager",
  },
  {
    id: 3,
    companyName: "Greentech Recyclers",
    rocNumber: "201705283941",
    contactPerson: "Siti Nurhaliza",
    identityCard: "890224-33-6644",
    address: "18 Jalan Bukit Minyak, Taman Perindustrian",
    postcode: "14100",
    area: "Bukit Mertajam",
    state: "Pulau Pinang",
    email: "sales@greentech.com.my",
    phoneNumber: "+60 16-543 2109",
    registeredByMobile: "+60 16-543 2109",
    notes: "Focuses on electronic waste recycling",
    registeredBy: "Supervisor",
  },
  {
    id: 4,
    companyName: "Johor Construction Co.",
    rocNumber: "199901234567",
    contactPerson: "Tan Wei Ming",
    identityCard: "751230-01-1122",
    address: "32 Jalan Permas, Permas Jaya",
    postcode: "81750",
    area: "Johor Bahru",
    state: "Johor",
    email: "projects@johorconstruction.com.my",
    phoneNumber: "+60 13-987 6543",
    registeredByMobile: "+60 13-987 6543",
    notes: "Large-scale construction projects",
    registeredBy: "Admin",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const DataTable = ({ columns, data, emptyMessage }) => {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{emptyMessage}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filter settings, or add a new customer.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm ${column.className || ''}`}
                title={column.tooltip}
              >
                {column.header}
                {column.sortable && (
                  <span className="ml-1 text-gray-400">▼</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
            >
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className={`py-3 px-4 ${column.className || ''}`}
                >
                  {column.render(item[column.key], item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [customers, setCustomers] = useState<Customer[]>(DUMMY_CUSTOMERS);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [addCustomerForm, setAddCustomerForm] = useState({
    companyName: "",
    rocNumber: "",
    contactPerson: "",
    identityCard: "",
    address: "",
    postcode: "",
    area: "",
    state: "",
    email: "",
    phoneNumber: "",
    registeredByMobile: "",
    notes: "",
    registeredBy: "",
  });
  const [editCustomerForm, setEditCustomerForm] = useState({
    id: 0,
    companyName: "",
    rocNumber: "",
    contactPerson: "",
    identityCard: "",
    address: "",
    postcode: "",
    area: "",
    state: "",
    email: "",
    phoneNumber: "",
    registeredByMobile: "",
    notes: "",
    registeredBy: "",
  });

  const AREAS = ["Kuala Lumpur", "Alor Setar", "Bukit Mertajam", "Johor Bahru", "City Center", "Industrial Zone"];
  const STATES = ["Wilayah Persekutuan", "Kedah", "Pulau Pinang", "Johor", "Selangor"];
  const REGISTERED_BY = ["Admin", "Manager", "Supervisor", "Driver"];

  const filteredCustomers = useMemo(() => {
    setIsLoading(true);
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.companyName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(debouncedSearchTerm) ||
        customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.area.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesState =
        selectedState === "all" ? true : customer.state === selectedState;

      const matchesTab =
        activeTab === "all"
          ? true
          : (activeTab === "kl" && customer.state === "Wilayah Persekutuan") ||
            (activeTab === "kedah" && customer.state === "Kedah") ||
            (activeTab === "penang" && customer.state === "Pulau Pinang") ||
            (activeTab === "johor" && customer.state === "Johor");

      return matchesSearch && matchesState && matchesTab;
    });
    setTimeout(() => setIsLoading(false), 300);
    return filtered;
  }, [customers, debouncedSearchTerm, selectedState, activeTab]);

  const uniqueStates = useMemo(
    () => Array.from(new Set(customers.map((customer) => customer.state))).sort(),
    [customers]
  );

  const handleExportCSV = useCallback(() => {
    const headers = [
      "ID",
      "Company Name",
      "ROC Number",
      "Contact Person",
      "Identity Card",
      "Address",
      "Postcode",
      "Area",
      "State",
      "Email",
      "Phone Number",
      "Registered By Mobile",
      "Notes",
      "Registered By",
    ];
    const rows = filteredCustomers.map((customer) =>
      [
        customer.id,
        `"${customer.companyName}"`,
        customer.rocNumber,
        `"${customer.contactPerson}"`,
        customer.identityCard,
        `"${customer.address}"`,
        customer.postcode,
        customer.area,
        customer.state,
        customer.email,
        customer.phoneNumber,
        customer.registeredByMobile,
        `"${customer.notes}"`,
        customer.registeredBy,
      ].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "customers.csv");
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredCustomers]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedState("all");
    setActiveTab("all");
  }, []);

  const validateCustomerForm = (form: typeof addCustomerForm) => {
    const errors: Record<string, string> = {};
    if (!form.companyName.trim()) errors.companyName = "Company name is required";
    if (!form.rocNumber.trim()) errors.rocNumber = "ROC number is required";
    if (!form.contactPerson.trim()) errors.contactPerson = "Contact person is required";
    if (!form.identityCard.trim()) errors.identityCard = "Identity card is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.postcode.trim()) errors.postcode = "Postcode is required";
    if (!form.area) errors.area = "Area is required";
    if (!form.state) errors.state = "State is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Valid email is required";
    if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!form.registeredByMobile.trim()) errors.registeredByMobile = "Registered by mobile is required";
    if (!form.registeredBy) errors.registeredBy = "Registered by is required";
    return errors;
  };

  const handleAddCustomerSubmit = () => {
    const errors = validateCustomerForm(addCustomerForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newCustomer: Customer = {
      id: customers.length + 1,
      companyName: addCustomerForm.companyName,
      rocNumber: addCustomerForm.rocNumber,
      contactPerson: addCustomerForm.contactPerson,
      identityCard: addCustomerForm.identityCard,
      address: addCustomerForm.address,
      postcode: addCustomerForm.postcode,
      area: addCustomerForm.area,
      state: addCustomerForm.state,
      email: addCustomerForm.email,
      phoneNumber: addCustomerForm.phoneNumber,
      registeredByMobile: addCustomerForm.registeredByMobile,
      notes: addCustomerForm.notes,
      registeredBy: addCustomerForm.registeredBy,
    };

    setCustomers([...customers, newCustomer]);
    setAddCustomerForm({
      companyName: "",
      rocNumber: "",
      contactPerson: "",
      identityCard: "",
      address: "",
      postcode: "",
      area: "",
      state: "",
      email: "",
      phoneNumber: "",
      registeredByMobile: "",
      notes: "",
      registeredBy: "",
    });
    setFormErrors({});
    setIsAddCustomerModalOpen(false);
  };

  const handleEditCustomerSubmit = () => {
    const errors = validateCustomerForm(editCustomerForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCustomers(customers.map((customer) =>
      customer.id === editCustomerForm.id
        ? { ...editCustomerForm }
        : customer
    ));

    setEditCustomerForm({
      id: 0,
      companyName: "",
      rocNumber: "",
      contactPerson: "",
      identityCard: "",
      address: "",
      postcode: "",
      area: "",
      state: "",
      email: "",
      phoneNumber: "",
      registeredByMobile: "",
      notes: "",
      registeredBy: "",
    });
    setFormErrors({});
    setIsEditCustomerModalOpen(false);
  };

  const openEditModal = (customer: Customer) => {
    setEditCustomerForm(customer);
    setIsEditCustomerModalOpen(true);
  };

  useEffect(() => {
    if (isAddCustomerModalOpen) {
      setAddCustomerForm({
        companyName: "",
        rocNumber: "",
        contactPerson: "",
        identityCard: "",
        address: "",
        postcode: "",
        area: "",
        state: "",
        email: "",
        phoneNumber: "",
        registeredByMobile: "",
        notes: "",
        registeredBy: "",
      });
      setFormErrors({});
    }
  }, [isAddCustomerModalOpen]);

  const columns: Column[] = [
    {
      key: "companyName",
      header: "Company",
      sortable: true,
      visibleOnMobile: true,
      className: "min-w-[250px] max-w-[250px]",
      tooltip: "Company name and ROC number",
      render: (_, customer) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <AvatarFallback>
              <span
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {getInitials(customer.companyName)}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {customer.companyName}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
              <FileText className="h-3 w-3 mr-1.5 text-blue-500 dark:text-blue-400" />
              {customer.rocNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contactPerson",
      header: "Contact",
      visibleOnMobile: true,
      className: "min-w-[200px] max-w-[200px]",
      tooltip: "Contact person and phone number",
      render: (_, customer) => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Users className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
            {customer.contactPerson}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Phone className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
            {customer.phoneNumber}
          </div>
        </div>
      ),
    },
    {
      key: "area",
      header: "Location",
      sortable: true,
      visibleOnMobile: false,
      className: "min-w-[200px] max-w-[200px]",
      tooltip: "Area, state, and postcode",
      render: (_, customer) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
          <div className="text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {customer.area}, {customer.state}
            </span>
            <Badge
              variant="outline"
              className="ml-2 text-xs bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300"
            >
              {customer.postcode}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      visibleOnMobile: false,
      className: "min-w-[200px] max-w-[200px]",
      tooltip: "Customer email",
      render: (_, customer) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {customer.email}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[120px] text-right",
      visibleOnMobile: true,
      render: (_, customer) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            aria-label="View customer details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            aria-label="Edit customer"
            onClick={() => openEditModal(customer)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                More Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 py-2">
                <Eye className="h-4 w-4 text-blue-500 dark:text-blue-400" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 py-2"
                onClick={() => openEditModal(customer)}
              >
                <Pencil className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Edit Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem className="text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 py-2">
                <Trash2 className="h-4 w-4" /> Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              Customer Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Manage your customer database and business relationships efficiently</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, email, phone..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl"
                onClick={handleExportCSV}
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setIsAddCustomerModalOpen(true)}
              >
                <Plus className="h-5 w-5" /> Add Customer
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
            { title: "Total Customers", value: customers.length, color: "blue", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            { title: "Active Locations", value: uniqueStates.length, color: "emerald", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
            { title: "Last Updated", value: "Today, 10:42 AM", color: "purple", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
            { title: "Filtered Results", value: filteredCustomers.length, color: "amber", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
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
                    {stat.title.includes("Customer") && <Users className={`h-8 w-8 ${stat.iconColor} dark:${stat.iconColor.replace("600", "300")}`} />}
                    {stat.title.includes("Location") && <MapPin className={`h-8 w-8 ${stat.iconColor} dark:${stat.iconColor.replace("600", "300")}`} />}
                    {stat.title.includes("Updated") && <RotateCcw className={`h-8 w-8 ${stat.iconColor} dark:${stat.iconColor.replace("600", "300")}`} />}
                    {stat.title.includes("Filtered") && <Filter className={`h-8 w-8 ${stat.iconColor} dark:${stat.iconColor.replace("600", "300")}`} />}
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
                  <span>{selectedState === "all" ? "Filter by State" : selectedState}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 rounded-xl">
                <DropdownMenuLabel className="font-semibold">Filter by State</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedState("all")} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">All</DropdownMenuItem>
                {uniqueStates.map((state) => (
                  <DropdownMenuItem key={state} onClick={() => setSelectedState(state)} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{state}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="lg"
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              onClick={handleResetFilters}
            >
              <RotateCcw className="h-5 w-5" />
              Reset Filters
            </Button>
          </div>
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full">
            {filteredCustomers.length} Customers
          </Badge>
        </div>

        {/* Tabs and Table */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <div className="px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
      <TabsList className="bg-transparent h-12 flex gap-2">
        <TabsTrigger
          value="all"
          className="relative px-4 py-2 text-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 font-medium transition-all duration-300"
        >
          All Customers
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={false}
            animate={activeTab === "all" ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </TabsTrigger>
        <TabsTrigger
          value="kl"
          className="relative px-4 py-2 text-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 font-medium transition-all duration-300"
        >
          Kuala Lumpur
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={false}
            animate={activeTab === "kl" ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </TabsTrigger>
        <TabsTrigger
          value="kedah"
          className="relative px-4 py-2 text-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 font-medium transition-all duration-300"
        >
          Kedah
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={false}
            animate={activeTab === "kedah" ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </TabsTrigger>
        <TabsTrigger
          value="penang"
          className="relative px-4 py-2 text-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 font-medium transition-all duration-300"
        >
          Pulau Pinang
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={false}
            animate={activeTab === "penang" ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </TabsTrigger>
        <TabsTrigger
          value="johor"
          className="relative px-4 py-2 text-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 font-medium transition-all duration-300"
        >
          Johor
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={false}
            animate={activeTab === "johor" ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value={activeTab} className="mt-0 p-0">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DataTable
              columns={columns}
              data={filteredCustomers}
              emptyMessage="No customers found matching your criteria."
            />
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {filteredCustomers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {customers.length}
              </span>{" "}
              total customers
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  </Tabs>
</Card>

        {/* Add Customer Modal */}
        <Dialog open={isAddCustomerModalOpen} onOpenChange={(open) => {
          setIsAddCustomerModalOpen(open);
          if (!open) setFormErrors({});
        }}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                Add New Customer
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-6 px-2">
              <div className="relative">
                <Input
                  value={addCustomerForm.companyName}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, companyName: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Company Name</label>
                {formErrors.companyName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.companyName}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={addCustomerForm.rocNumber}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, rocNumber: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">ROC Number</label>
                {formErrors.rocNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.rocNumber}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={addCustomerForm.contactPerson}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, contactPerson: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Contact Person</label>
                {formErrors.contactPerson && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.contactPerson}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={addCustomerForm.identityCard}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, identityCard: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Identity Card/Passport</label>
                {formErrors.identityCard && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.identityCard}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={addCustomerForm.address}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, address: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Address</label>
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
                <Input
                  value={addCustomerForm.postcode}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, postcode: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Postcode</label>
                {formErrors.postcode && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.postcode}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Select
                  value={addCustomerForm.area}
                  onValueChange={(value) => setAddCustomerForm({ ...addCustomerForm, area: value })}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                    {AREAS.map((area) => (
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
                  value={addCustomerForm.state}
                  onValueChange={(value) => setAddCustomerForm({ ...addCustomerForm, state: value })}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                    {STATES.map((state) => (
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
                  value={addCustomerForm.email}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, email: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Email</label>
                {formErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.email}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={addCustomerForm.phoneNumber}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, phoneNumber: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
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
                  value={addCustomerForm.registeredByMobile}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, registeredByMobile: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Registered By Mobile</label>
                {formErrors.registeredByMobile && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.registeredByMobile}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={addCustomerForm.notes}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, notes: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Notes</label>
              </div>
              <div className="relative">
                <Select
                  value={addCustomerForm.registeredBy}
                  onValueChange={(value) => setAddCustomerForm({ ...addCustomerForm, registeredBy: value })}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <SelectValue placeholder="Select registered by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                    {REGISTERED_BY.map((role) => (
                      <SelectItem key={role} value={role} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.registeredBy && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.registeredBy}
                  </motion.p>
                )}
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setIsAddCustomerModalOpen(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={handleAddCustomerSubmit}
              >
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Modal */}
        <Dialog open={isEditCustomerModalOpen} onOpenChange={(open) => {
          setIsEditCustomerModalOpen(open);
          if (!open) setFormErrors({});
        }}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Pencil className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                Edit Customer
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-6 px-2">
              <div className="relative">
                <Input
                  value={editCustomerForm.companyName}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, companyName: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Company Name</label>
                {formErrors.companyName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.companyName}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={editCustomerForm.rocNumber}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, rocNumber: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">ROC Number</label>
                {formErrors.rocNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.rocNumber}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={editCustomerForm.contactPerson}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, contactPerson: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Contact Person</label>
                {formErrors.contactPerson && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.contactPerson}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={editCustomerForm.identityCard}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, identityCard: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Identity Card/Passport</label>
                {formErrors.identityCard && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.identityCard}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={editCustomerForm.address}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, address: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Address</label>
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
                <Input
                  value={editCustomerForm.postcode}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, postcode: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Postcode</label>
                {formErrors.postcode && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.postcode}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Select
                  value={editCustomerForm.area}
                  onValueChange={(value) => setEditCustomerForm({ ...editCustomerForm, area: value })}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                    {AREAS.map((area) => (
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
                  value={editCustomerForm.state}
                  onValueChange={(value) => setEditCustomerForm({ ...editCustomerForm, state: value })}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                    {STATES.map((state) => (
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
                  value={editCustomerForm.email}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, email: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Email</label>
                {formErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.email}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={editCustomerForm.phoneNumber}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phoneNumber: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
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
                  value={editCustomerForm.registeredByMobile}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, registeredByMobile: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Registered By Mobile</label>
                {formErrors.registeredByMobile && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.registeredByMobile}
                  </motion.p>
                )}
              </div>
              <div className="relative">
                <Input
                  value={editCustomerForm.notes}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, notes: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300 peer"
                  placeholder=" "
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">Notes</label>
              </div>
              <div className="relative">
                <Select
                  value={editCustomerForm.registeredBy}
                  onValueChange={(value) => setEditCustomerForm({ ...editCustomerForm, registeredBy: value })}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <SelectValue placeholder="Select registered by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                    {REGISTERED_BY.map((role) => (
                      <SelectItem key={role} value={role} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.registeredBy && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" /> {formErrors.registeredBy}
                  </motion.p>
                )}
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setIsEditCustomerModalOpen(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={handleEditCustomerSubmit}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </ErrorBoundary>
  );
};

export default CustomerManagement;