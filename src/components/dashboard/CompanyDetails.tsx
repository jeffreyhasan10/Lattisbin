import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  FileBarChart, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Upload,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast";

interface CompanyData {
  id: string;
  companyName: string;
  rocNumber: string;
  address: string;
  postcode: string;
  area: string;
  state: string;
  email: string;
  phoneNumber: string;
  contactPerson?: string;
  contactPersonId?: string;
  contactPersonIdType?: "IC" | "Passport";
  contactPersonPassport?: string;
  branchName?: string;
  logo?: File | null;
}

const initialCompanies: CompanyData[] = [
  {
    id: "1",
    companyName: "Lattis Solutions Sdn Bhd",
    rocNumber: "1234567-A",
    address: "123 Jalan Teknologi, Taman Perindustrian",
    postcode: "57000",
    area: "City Center",
    state: "Kuala Lumpur",
    email: "contact@simatexsolutions.com",
    phoneNumber: "+60 3-1234 5678",
    contactPerson: "John Doe",
    contactPersonId: "123456-12-1234",
    contactPersonIdType: "IC",
    branchName: "Main Branch",
  },
  {
    id: "2",
    companyName: "TechTrend Innovations",
    rocNumber: "9876543-B",
    address: "456 Jalan Inovasi, Cyberjaya",
    postcode: "63000",
    area: "Tech Park",
    state: "Selangor",
    email: "info@techtrend.com",
    phoneNumber: "+60 3-8765 4321",
    contactPerson: "Jane Smith",
    contactPersonPassport: "A12345678",
    contactPersonIdType: "Passport",
    branchName: "Cyberjaya Branch",
  },
];

const CompanyDetails = () => {
  const [companies, setCompanies] = useState<CompanyData[]>(initialCompanies);
  const [expanded, setExpanded] = useState<string[]>([initialCompanies[0].id]);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState<CompanyData>({
    id: "",
    companyName: "",
    rocNumber: "",
    address: "",
    postcode: "",
    area: "",
    state: "",
    email: "",
    phoneNumber: "",
    contactPerson: "",
    contactPersonId: "",
    contactPersonIdType: "IC",
    contactPersonPassport: "",
    branchName: "",
    logo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("All");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
    tap: { scale: 0.95 }
  };

  const toastVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.rocNumber || !/^[0-9A-Za-z-]+$/.test(formData.rocNumber))
      newErrors.rocNumber = "Valid ROC number is required (e.g., 12345678-A)";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.postcode || !/^\d{5}$/.test(formData.postcode))
      newErrors.postcode = "Valid 5-digit postcode is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phoneNumber || !/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      newErrors.phoneNumber = "Valid phone number is required (e.g., +1234567890)";
    if (!formData.contactPerson) newErrors.contactPerson = "Contact person name is required";
    if (!formData.contactPersonId || !/^[0-9A-Za-z-]+$/.test(formData.contactPersonId))
      newErrors.contactPersonId = "Valid ID number is required";
    if (formData.logo && !["image/png", "image/jpeg"].includes(formData.logo.type))
      newErrors.logo = "Logo must be a PNG or JPEG image";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setErrors((prev) => ({ ...prev, logo: "" }));
    } else {
      setErrors((prev) => ({ ...prev, logo: "Please upload a valid PNG or JPEG image" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isEditModalOpen && selectedCompany) {
        setCompanies(companies.map(company => 
          company.id === selectedCompany.id ? { ...formData, id: selectedCompany.id } : company
        ));
        setToastMessage(`${formData.companyName} updated successfully!`);
      } else {
        const newCompany = { ...formData, id: `${Date.now()}` };
        setCompanies([...companies, newCompany]);
        setToastMessage(`${formData.companyName} registered successfully!`);
      }
      setShowSuccessToast(true);
      setIsAddBusinessModalOpen(false);
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      setErrors({ submit: "Failed to save business. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (company: CompanyData) => {
    setSelectedCompany(company);
    setFormData(company);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCompany) {
      setCompanies(companies.filter(company => company.id !== selectedCompany.id));
      setToastMessage(`${selectedCompany.companyName} deleted successfully!`);
      setShowSuccessToast(true);
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      companyName: "",
      rocNumber: "",
      address: "",
      postcode: "",
      area: "",
      state: "",
      email: "",
      phoneNumber: "",
      contactPerson: "",
      contactPersonId: "",
      contactPersonIdType: "IC",
      contactPersonPassport: "",
      branchName: "",
      logo: null,
    });
    setErrors({});
  };

  const filteredCompanies = companies.filter(company => 
    (filterState === "All" || company.state === filterState) &&
    (company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     company.rocNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     company.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const states = ["All", ...new Set(companies.map(company => company.state))];

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  return (
    <ToastProvider>
      <motion.div 
        className="p-4 md:p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Business Directory</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Manage and explore your registered business profiles</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search by name, ROC, or email..."
              className="w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button 
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  resetForm();
                  setIsAddBusinessModalOpen(true);
                }}
              >
                <Plus className="h-5 w-5" /> Add Business
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2.5">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Registered Businesses</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                    Detailed overview of all registered companies
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">Company Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">ROC Number</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">Location</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCompanies.map((company) => (
                    <TableRow key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100 py-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpanded(expanded.includes(company.id) 
                              ? expanded.filter(id => id !== company.id) 
                              : [...expanded, company.id])}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          >
                            {expanded.includes(company.id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </Button>
                          <span className="truncate max-w-xs">{company.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-4">{company.rocNumber}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-4">{`${company.area}, ${company.state}`}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 py-4 truncate max-w-xs">{company.email}</TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                            onClick={() => handleEdit(company)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                            onClick={() => {
                              setSelectedCompany(company);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredCompanies.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No companies found. Try adjusting your search or filter.
                </div>
              )}
              {filteredCompanies.length > itemsPerPage && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="rounded-xl"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
              {paginatedCompanies.map((company) => (
                <AnimatePresence key={company.id}>
                  {expanded.includes(company.id) && (
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-white dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { icon: Building2, label: "Company Name", value: company.companyName },
                          { icon: FileBarChart, label: "ROC Number", value: company.rocNumber },
                          { icon: MapPin, label: "Address", value: company.address },
                          { icon: MapPin, label: "Postcode", value: company.postcode },
                          { icon: MapPin, label: "Area", value: company.area },
                          { icon: MapPin, label: "State", value: company.state },
                          { icon: Mail, label: "Email", value: company.email },
                          { icon: Phone, label: "Phone Number", value: company.phoneNumber },
                          { icon: Building2, label: "Contact Person", value: company.contactPerson || "N/A" },
                          { 
                            icon: FileBarChart, 
                            label: company.contactPersonIdType === "IC" ? "IC Number" : "Passport Number", 
                            value: company.contactPersonIdType === "IC" ? company.contactPersonId : company.contactPersonPassport || "N/A" 
                          },
                          { icon: Building2, label: "ID Type", value: company.contactPersonIdType || "N/A" },
                          { icon: Building2, label: "Branch Name", value: company.branchName || "N/A" },
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md group transition-all duration-200"
                          >
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">
                              <motion.div whileHover={{ rotate: 5 }}>
                                <item.icon className="h-4 w-4 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                              </motion.div>
                              {item.label}
                            </p>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-base truncate">{item.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={isAddBusinessModalOpen || isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddBusinessModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-[600px] w-[95vw] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-0 max-h-[90vh] overflow-y-auto">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <DialogHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2.5">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditModalOpen ? "Edit Business Profile" : "Register New Business"}
                </DialogTitle>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="Lattis EWM"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rocNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">ROC Number</Label>
                    <Input
                      id="rocNumber"
                      name="rocNumber"
                      value={formData.rocNumber}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="12345678-A"
                    />
                    {errors.rocNumber && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.rocNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                    placeholder="123 Main St"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postcode" className="text-sm font-medium text-gray-700 dark:text-gray-300">Postcode</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="12345"
                    />
                    {errors.postcode && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.postcode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-medium text-gray-700 dark:text-gray-300">Area</Label>
                    <Input
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="Downtown"
                    />
                    {errors.area && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.area}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700 dark:text-gray-300">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="Kuala Lumpur"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.state}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="contact@lattisewm.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="+60 3-1234 5678"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                      placeholder="John Doe"
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.contactPerson}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPersonIdType" className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Type</Label>
                    <Select 
                      value={formData.contactPersonIdType} 
                      onValueChange={(value: "IC" | "Passport") => setFormData(prev => ({ ...prev, contactPersonIdType: value }))}
                    >
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IC">Identity Card (IC)</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.contactPersonIdType === "IC" ? (
                    <>
                      <Label htmlFor="contactPersonId" className="text-sm font-medium text-gray-700 dark:text-gray-300">Identity Card Number</Label>
                      <Input
                        id="contactPersonId"
                        name="contactPersonId"
                        value={formData.contactPersonId}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                        placeholder="123456-12-1234"
                      />
                      {errors.contactPersonId && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.contactPersonId}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <Label htmlFor="contactPersonPassport" className="text-sm font-medium text-gray-700 dark:text-gray-300">Passport Number</Label>
                      <Input
                        id="contactPersonPassport"
                        name="contactPersonPassport"
                        value={formData.contactPersonPassport}
                        onChange={handleChange}
                        className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                        placeholder="A12345678"
                      />
                      {errors.contactPersonPassport && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.contactPersonPassport}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name (Optional)</Label>
                  <Input
                    id="branchName"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    className="border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-800"
                    placeholder="Main Branch"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo (Optional)</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl bg-white dark:bg-gray-800"
                      onClick={() => document.getElementById("logo")?.click()}
                    >
                      <Upload className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>Upload Logo</span>
                    </Button>
                    {formData.logo && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {formData.logo.name}
                      </span>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.logo}
                    </p>
                  )}
                </div>
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> {errors.submit}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsAddBusinessModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditModalOpen ? "Updating..." : "Registering..."}
                    </span>
                  ) : (
                    isEditModalOpen ? "Update Business" : "Register Business"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px] w-[95vw] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
            <div className="h-2 bg-gradient-to-r from-red-600 to-pink-600" />
            <DialogHeader className="pt-4">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Delete Business</DialogTitle>
            </DialogHeader>
            <div className="py-4 px-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCompany?.companyName}</span>? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex justify-end gap-3 px-6 pb-6">
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ToastViewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-[350px] max-w-[95vw]">
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                variants={toastVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Toast className="bg-green-600 text-white rounded-xl shadow-lg border-0 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <ToastTitle className="font-semibold">Success</ToastTitle>
                      <ToastDescription>{toastMessage}</ToastDescription>
                    </div>
                    <ToastClose className="ml-auto" />
                  </div>
                </Toast>
              </motion.div>
            )}
          </AnimatePresence>
        </ToastViewport>
      </motion.div>
    </ToastProvider>
  );
};

export default CompanyDetails;