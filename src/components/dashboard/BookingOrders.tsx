import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  CalendarRange,
  Clock,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  AlertCircle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Constants
const AREAS: { [key: string]: string[] } = {
  "Wilayah Persekutuan": ["Kuala Lumpur", "Putrajaya", "Labuan"],
  Kedah: ["Alor Setar", "Sungai Petani", "Kulim"],
  Johor: ["Johor Bahru", "Muar", "Batu Pahat"],
  "Pulau Pinang": ["Bukit Mertajam", "George Town", "Butterworth"],
};

const LORRIES = [
  { id: 1, number: "MYB 2345" },
  { id: 2, number: "MYC 6789" },
  { id: 3, number: "MYE 5678" },
];

const DRIVERS = [
  { id: 1, name: "Ahmad bin Abdullah" },
  { id: 2, name: "Tan Wei Ming" },
  { id: 3, name: "Mohammad Zulkifli" },
];

const BIN_SIZES = ["4 Yard", "6 Yard", "10 Yard", "20 Yard"];
const PAYMENT_METHODS = ["Cash", "Online Banking", "Cheque", "CMD", "Term"];
const COLLECTION_TYPES = ["Same-Day", "Term-Based", "Anytime"];
const COLLECTION_LOCATIONS = ["Warehouse", "Customer"];

// Interfaces
interface Booking {
  id: number;
  doNumber: string;
  customerName: string;
  phone: string;
  area: string;
  state: string;
  binSize: string;
  binSN: string;
  weight: string;
  requestDate: string;
  deliveryDate: string;
  collectionType: string;
  collectionDue: string;
  collectionLocation: string;
  assignedDriver: string;
  lorryNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: string;
  introducer: string;
  jobReference: string;
}

interface FormData {
  doNumber: string;
  customerName: string;
  phone: string;
  state: string;
  area: string;
  binSize: string;
  binSN: string;
  weight: string;
  deliveryDate: string;
  collectionType: string;
  collectionDue: string;
  collectionLocation: string;
  assignedDriver: string;
  lorryNumber: string;
  paymentMethod: string;
  amount: string;
  introducer: string;
  jobReference: string;
}

interface FormErrors {
  doNumber?: string;
  customerName?: string;
  phone?: string;
  state?: string;
  area?: string;
  binSize?: string;
  deliveryDate?: string;
  paymentMethod?: string;
  amount?: string;
}

// Reusable Booking Form Component
interface BookingFormProps {
  formData: FormData;
  formErrors: FormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEdit: boolean;
  isLoading: boolean;
  completionPercentage: number;
}

const BookingForm = React.memo(
  ({
    formData,
    formErrors,
    setFormErrors,
    onInputChange,
    onSelectChange,
    onSubmit,
    onCancel,
    isEdit,
    isLoading,
    completionPercentage,
  }: BookingFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
      { title: "Booking Details", fields: ["doNumber"] },
      { title: "Customer Info", fields: ["customerName", "phone"] },
      { title: "Location", fields: ["state", "area"] },
      { title: "Bin Details", fields: ["binSize", "binSN", "weight"] },
      {
        title: "Delivery",
        fields: [
          "deliveryDate",
          "collectionType",
          "collectionDue",
          "collectionLocation",
          "assignedDriver",
          "lorryNumber",
        ],
      },
      { title: "Payment", fields: ["paymentMethod", "amount", "introducer", "jobReference"] },
    ];

    const handleNext = useCallback(() => {
      const currentFields = steps[currentStep].fields;
      const errors: FormErrors = {};
      currentFields.forEach((field) => {
        if (
          [
            "doNumber",
            "customerName",
            "phone",
            "state",
            "area",
            "binSize",
            "deliveryDate",
            "paymentMethod",
            "amount",
          ].includes(field) &&
          !formData[field as keyof FormData]
        ) {
          errors[field as keyof FormErrors] = `${
            field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")
          } is required`;
        }
      });
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error("Please fill in all required fields");
        return;
      }
      setFormErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, [currentStep, formData, setFormErrors, steps]);

    const handlePrev = useCallback(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    return (
      <div className="p-6 space-y-6">
        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <motion.div
                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full ${
                  index <= currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }`}
                animate={{ scale: index === currentStep ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                role="status"
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                {index + 1}
              </motion.div>
              <p
                className={`mt-2 text-sm font-medium ${
                  index <= currentStep ? "text-indigo-600" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <form onSubmit={onSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label
                      htmlFor="doNumber"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      DO Number *
                    </Label>
                    <Input
                      id="doNumber"
                      name="doNumber"
                      value={formData.doNumber}
                      onChange={onInputChange}
                      readOnly={isEdit}
                      className={`mt-1 rounded-lg ${
                        formErrors.doNumber ? "border-red-500" : ""
                      } ${isEdit ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}`}
                      placeholder="DO-2024-XXXX"
                      aria-invalid={!!formErrors.doNumber}
                      aria-describedby={formErrors.doNumber ? "doNumber-error" : undefined}
                    />
                    {formErrors.doNumber && (
                      <p
                        id="doNumber-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.doNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="customerName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Customer Name/Company *
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={onInputChange}
                      className={`mt-1 rounded-lg ${formErrors.customerName ? "border-red-500" : ""}`}
                      placeholder="Enter customer name"
                      aria-invalid={!!formErrors.customerName}
                      aria-describedby={formErrors.customerName ? "customerName-error" : undefined}
                    />
                    {formErrors.customerName && (
                      <p
                        id="customerName-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={onInputChange}
                      className={`mt-1 rounded-lg ${formErrors.phone ? "border-red-500" : ""}`}
                      placeholder="+60 12-345 6789"
                      aria-invalid={!!formErrors.phone}
                      aria-describedby={formErrors.phone ? "phone-error" : undefined}
                    />
                    {formErrors.phone && (
                      <p
                        id="phone-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      State *
                    </Label>
                    <Select
                      name="state"
                      value={formData.state}
                      onValueChange={(value) => onSelectChange("state", value)}
                    >
                      <SelectTrigger
                        className={`mt-1 rounded-lg ${formErrors.state ? "border-red-500" : ""}`}
                        aria-invalid={!!formErrors.state}
                        aria-describedby={formErrors.state ? "state-error" : undefined}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(AREAS).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.state && (
                      <p
                        id="state-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="area"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Area *
                    </Label>
                    <Select
                      name="area"
                      value={formData.area}
                      onValueChange={(value) => onSelectChange("area", value)}
                      disabled={!formData.state}
                    >
                      <SelectTrigger
                        className={`mt-1 rounded-lg ${formErrors.area ? "border-red-500" : ""}`}
                        aria-invalid={!!formErrors.area}
                        aria-describedby={formErrors.area ? "area-error" : undefined}
                      >
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.state &&
                          AREAS[formData.state].map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {formErrors.area && (
                      <p
                        id="area-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.area}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <Label
                      htmlFor="binSize"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Bin Size *
                    </Label>
                    <Select
                      name="binSize"
                      value={formData.binSize}
                      onValueChange={(value) => onSelectChange("binSize", value)}
                    >
                      <SelectTrigger
                        className={`mt-1 rounded-lg ${formErrors.binSize ? "border-red-500" : ""}`}
                        aria-invalid={!!formErrors.binSize}
                        aria-describedby={formErrors.binSize ? "binSize-error" : undefined}
                      >
                        <SelectValue placeholder="Select bin size" />
                      </SelectTrigger>
                      <SelectContent>
                        {BIN_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.binSize && (
                      <p
                        id="binSize-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.binSize}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="binSN"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Bin Serial Number
                    </Label>
                    <Input
                      id="binSN"
                      name="binSN"
                      value={formData.binSN}
                      onChange={onInputChange}
                      className="mt-1 rounded-lg"
                      placeholder="Enter bin serial number"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="weight"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Weight (KG)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={onInputChange}
                      className="mt-1 rounded-lg"
                      placeholder="Enter weight"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="deliveryDate"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Delivery Date *
                    </Label>
                    <Input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={onInputChange}
                      className={`mt-1 rounded-lg ${formErrors.deliveryDate ? "border-red-500" : ""}`}
                      aria-invalid={!!formErrors.deliveryDate}
                      aria-describedby={formErrors.deliveryDate ? "deliveryDate-error" : undefined}
                    />
                    {formErrors.deliveryDate && (
                      <p
                        id="deliveryDate-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.deliveryDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="collectionType"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Collection Type
                    </Label>
                    <Select
                      name="collectionType"
                      value={formData.collectionType}
                      onValueChange={(value) => onSelectChange("collectionType", value)}
                    >
                      <SelectTrigger className="mt-1 rounded-lg">
                        <SelectValue placeholder="Select collection type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLECTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="collectionDue"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Collection Due Date
                    </Label>
                    <Input
                      id="collectionDue"
                      name="collectionDue"
                      type="date"
                      value={formData.collectionDue}
                      onChange={onInputChange}
                      className="mt-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="collectionLocation"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Collection Location
                    </Label>
                    <Select
                      name="collectionLocation"
                      value={formData.collectionLocation}
                      onValueChange={(value) => onSelectChange("collectionLocation", value)}
                    >
                      <SelectTrigger className="mt-1 rounded-lg">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLECTION_LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="assignedDriver"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Assigned Driver
                    </Label>
                    <Select
                      name="assignedDriver"
                      value={formData.assignedDriver}
                      onValueChange={(value) => onSelectChange("assignedDriver", value)}
                    >
                      <SelectTrigger className="mt-1 rounded-lg">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRIVERS.map((driver) => (
                          <SelectItem key={driver.id} value={driver.name}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="lorryNumber"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Lorry Number
                    </Label>
                    <Select
                      name="lorryNumber"
                      value={formData.lorryNumber}
                      onValueChange={(value) => onSelectChange("lorryNumber", value)}
                    >
                      <SelectTrigger className="mt-1 rounded-lg">
                        <SelectValue placeholder="Select lorry" />
                      </SelectTrigger>
                      <SelectContent>
                        {LORRIES.map((lorry) => (
                          <SelectItem key={lorry.id} value={lorry.number}>
                            {lorry.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="paymentMethod"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Payment Method *
                    </Label>
                    <Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onValueChange={(value) => onSelectChange("paymentMethod", value)}
                    >
                      <SelectTrigger
                        className={`mt-1 rounded-lg ${formErrors.paymentMethod ? "border-red-500" : ""}`}
                        aria-invalid={!!formErrors.paymentMethod}
                        aria-describedby={formErrors.paymentMethod ? "paymentMethod-error" : undefined}
                      >
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.paymentMethod && (
                      <p
                        id="paymentMethod-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.paymentMethod}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="amount"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Amount (RM) *
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={onInputChange}
                      className={`mt-1 rounded-lg ${formErrors.amount ? "border-red-500" : ""}`}
                      placeholder="Enter amount"
                      aria-invalid={!!formErrors.amount}
                      aria-describedby={formErrors.amount ? "amount-error" : undefined}
                    />
                    {formErrors.amount && (
                      <p
                        id="amount-error"
                        className="mt-1 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.amount}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="introducer"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Introducer
                    </Label>
                    <Input
                      id="introducer"
                      name="introducer"
                      value={formData.introducer}
                      onChange={onInputChange}
                      className="mt-1 rounded-lg"
                      placeholder="Enter introducer"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="jobReference"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Job Reference
                    </Label>
                    <Input
                      id="jobReference"
                      name="jobReference"
                      value={formData.jobReference}
                      onChange={onInputChange}
                      className="mt-1 rounded-lg"
                      placeholder="Enter job reference"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Form Actions */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 0 ? onCancel : handlePrev}
              className="rounded-lg"
              disabled={isLoading}
            >
              {currentStep === 0 ? "Cancel" : "Previous"}
            </Button>
            <Button
              type={currentStep === steps.length - 1 ? "submit" : "button"}
              onClick={currentStep === steps.length - 1 ? undefined : handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : currentStep === steps.length - 1
                ? isEdit
                  ? "Update Booking"
                  : "Create Booking"
                : "Next"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
);

const BookingOrders = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      doNumber: "DO-2024-0001",
      customerName: "Azlan Sdn Bhd",
      phone: "+60 12-345 6789",
      area: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      binSize: "4 Yard",
      binSN: "ASR100",
      weight: "500",
      requestDate: "2024-03-05",
      deliveryDate: "2024-03-10",
      collectionType: "Term-Based",
      collectionDue: "2024-04-10",
      collectionLocation: "Customer",
      assignedDriver: "Ahmad bin Abdullah",
      lorryNumber: "MYB 2345",
      status: "Active",
      paymentStatus: "Paid",
      paymentMethod: "Cash",
      amount: "300",
      introducer: "John Doe",
      jobReference: "JR001",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "doNumber", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    doNumber: "",
    customerName: "",
    phone: "",
    state: "",
    area: "",
    binSize: "",
    binSN: "",
    weight: "",
    deliveryDate: "",
    collectionType: "",
    collectionDue: "",
    collectionLocation: "",
    assignedDriver: "",
    lorryNumber: "",
    paymentMethod: "",
    amount: "",
    introducer: "",
    jobReference: "",
  });

  // Sorting function
  const sortBookings = useCallback(
    (key: string) => {
      const direction =
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
      setSortConfig({ key, direction });

      const sortedBookings = [...bookings].sort((a, b) => {
        if (a[key as keyof Booking] < b[key as keyof Booking]) return direction === "asc" ? -1 : 1;
        if (a[key as keyof Booking] > b[key as keyof Booking]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setBookings(sortedBookings);
    },
    [bookings, sortConfig]
  );

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.binSN && booking.binSN.toLowerCase().includes(searchTerm.toLowerCase())) ||
        booking.jobReference.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "All" || booking.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    return filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredBookings, currentPage]);

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "Pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case "Pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Collection date check
  const isCollectionApproaching = useCallback((dateStr: string) => {
    if (!dateStr) return false;
    try {
      const collectionDate = new Date(dateStr);
      if (isNaN(collectionDate.getTime())) return false;
      const today = new Date();
      const diffTime = collectionDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    } catch (error) {
      console.error("Invalid date format:", dateStr, error);
      return false;
    }
  }, []);

  // Validate form
  const validateForm = useCallback(
    (data: FormData, isEdit: boolean): FormErrors => {
      const errors: FormErrors = {};
      if (!data.doNumber.trim()) errors.doNumber = "DO Number is required";
      else if (
        !isEdit &&
        bookings.some((b) => b.doNumber === data.doNumber && b.id !== selectedBooking?.id)
      ) {
        errors.doNumber = "DO Number already exists";
      }
      if (!data.customerName.trim()) errors.customerName = "Customer name is required";
      if (!data.phone.trim()) errors.phone = "Phone number is required";
      else if (!/^\+?\d{10,15}$/.test(data.phone.replace(/\s/g, "")))
        errors.phone = "Invalid phone number";
      if (!data.state) errors.state = "State is required";
      if (!data.area) errors.area = "Area is required";
      if (!data.binSize) errors.binSize = "Bin size is required";
      if (!data.deliveryDate) errors.deliveryDate = "Delivery date is required";
      if (!data.paymentMethod) errors.paymentMethod = "Payment method is required";
      if (!data.amount.trim()) errors.amount = "Amount is required";
      else if (isNaN(Number(data.amount)) || Number(data.amount) <= 0)
        errors.amount = "Invalid amount";
      return errors;
    },
    [bookings, selectedBooking]
  );

  // Calculate form completion
  const calculateCompletion = useCallback(() => {
    const requiredFields = [
      "doNumber",
      "customerName",
      "phone",
      "state",
      "area",
      "binSize",
      "deliveryDate",
      "paymentMethod",
      "amount",
    ];
    const filledFields = requiredFields.filter(
      (field) => formData[field as keyof FormData]
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, [formData]);

  // Handle form submission
  const handleAddBooking = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const errors = validateForm(formData, false);
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          toast.error("Please fix the form errors before submitting");
          return;
        }
        const newBooking: Booking = {
          id: bookings.length + 1,
          doNumber: formData.doNumber || `DO-2024-${String(bookings.length + 1).padStart(4, "0")}`,
          status: "Pending",
          paymentStatus: "Pending",
          requestDate: new Date().toISOString().split("T")[0],
          ...formData,
        };
        setBookings((prev) => [...prev, newBooking]);
        setIsAddDialogOpen(false);
        setFormData({
          doNumber: "",
          customerName: "",
          phone: "",
          state: "",
          area: "",
          binSize: "",
          binSN: "",
          weight: "",
          deliveryDate: "",
          collectionType: "",
          collectionDue: "",
          collectionLocation: "",
          assignedDriver: "",
          lorryNumber: "",
          paymentMethod: "",
          amount: "",
          introducer: "",
          jobReference: "",
        });
        setFormErrors({});
        toast.success("Booking added successfully!");
      } catch (error) {
        toast.error("Failed to add booking. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [bookings, formData, validateForm]
  );

  // Handle edit booking
  const handleEditBooking = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const errors = validateForm(formData, true);
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          toast.error("Please fix the form errors before submitting");
          return;
        }
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === selectedBooking?.id ? { ...booking, ...formData } : booking
          )
        );
        setIsEditDialogOpen(false);
        setSelectedBooking(null);
        setFormErrors({});
        toast.success("Booking updated successfully!");
      } catch (error) {
        toast.error("Failed to update booking. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, selectedBooking, validateForm]
  );

  // Handle delete booking
  const handleDeleteBooking = useCallback((id: number) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
    toast.success("Booking deleted successfully!");
  }, []);

  // Generate invoice
  const generateInvoice = useCallback((booking: Booking) => {
    toast.info(`Generating invoice for ${booking.doNumber}`);
  }, []);

  // Form input handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name as keyof FormErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [formErrors]
  );

  // Handle select change
  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "state") {
        setFormData((prev) => ({ ...prev, area: "" }));
      }
      if (formErrors[name as keyof FormErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [formErrors]
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Auto-collection popup check with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      bookings.forEach((booking) => {
        if (isCollectionApproaching(booking.collectionDue)) {
          toast.warning(`Collection due soon for ${booking.doNumber}!`, {
            description: `Customer: ${booking.customerName}`,
            id: `collection-due-${booking.id}`,
          });
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [bookings, isCollectionApproaching]);

  // Edit booking handler
  const openEditDialog = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setFormData({
      doNumber: booking.doNumber,
      customerName: booking.customerName,
      phone: booking.phone,
      state: booking.state,
      area: booking.area,
      binSize: booking.binSize,
      binSN: booking.binSN,
      weight: booking.weight,
      deliveryDate: booking.deliveryDate,
      collectionType: booking.collectionType,
      collectionDue: booking.collectionDue,
      collectionLocation: booking.collectionLocation,
      assignedDriver: booking.assignedDriver,
      lorryNumber: booking.lorryNumber,
      paymentMethod: booking.paymentMethod,
      amount: booking.amount,
      introducer: booking.introducer,
      jobReference: booking.jobReference,
    });
    setIsEditDialogOpen(true);
  }, []);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Booking & Delivery Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Comprehensive waste management booking system
            </p>
          </div>
          <div className="flex gap-3 items-center flex-col sm:flex-row">
            <div className="relative flex-1 w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by customer, DO, area, bin SN, or job ref..."
                className="pl-10 py-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all duration-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search bookings"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm"
                >
                  <Filter className="h-4 w-4" />
                  {filterStatus === "All" ? "Filter by Status" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                {["All", "Active", "Pending", "Completed", "Cancelled"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md rounded-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" /> New Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm">
                <DialogHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create New Booking
                  </DialogTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mt-2">
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute h-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${calculateCompletion()}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Form Completion: {calculateCompletion()}%
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Percentage of required fields completed
                    </TooltipContent>
                  </Tooltip>
                </DialogHeader>
                <BookingForm
                  formData={formData}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onSubmit={handleAddBooking}
                  onCancel={() => {
                    setIsAddDialogOpen(false);
                    setFormErrors({});
                    setFormData({
                      doNumber: "",
                      customerName: "",
                      phone: "",
                      state: "",
                      area: "",
                      binSize: "",
                      binSN: "",
                      weight: "",
                      deliveryDate: "",
                      collectionType: "",
                      collectionDue: "",
                      collectionLocation: "",
                      assignedDriver: "",
                      lorryNumber: "",
                      paymentMethod: "",
                      amount: "",
                      introducer: "",
                      jobReference: "",
                    });
                  }}
                  isEdit={false}
                  isLoading={isLoading}
                  completionPercentage={calculateCompletion()}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Status Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            {
              title: "Total Bookings",
              value: bookings.length,
              color: "indigo",
              bg: "bg-indigo-50 dark:bg-indigo-900/30",
              iconColor: "text-indigo-600 dark:text-indigo-300",
            },
            {
              title: "Active Orders",
              value: bookings.filter((b) => b.status === "Active").length,
              color: "green",
              bg: "bg-green-50 dark:bg-green-900/30",
              iconColor: "text-green-600 dark:text-green-300",
            },
            {
              title: "Pending Payments",
              value: bookings.filter((b) => b.paymentStatus === "Pending").length,
              color: "amber",
              bg: "bg-amber-50 dark:bg-amber-900/30",
              iconColor: "text-amber-600 dark:text-amber-300",
            },
            {
              title: "Completed",
              value: bookings.filter((b) => b.status === "Completed").length,
              color: "blue",
              bg: "bg-blue-50 dark:bg-blue-900/30",
              iconColor: "text-blue-600 dark:text-blue-300",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`${stat.bg} shadow-md hover:shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      {stat.title}
                    </p>
                    <p
                      className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-300`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/50 p-3`}
                  >
                    <CalendarRange className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Table */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 pb-3 pt-4">
            <CardTitle className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Delivery Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <TableRow>
                    {[
                      { label: "DO Number", key: "doNumber" },
                      { label: "Customer", key: "customerName" },
                      { label: "Area", key: "area" },
                      { label: "Bin Details", key: "binSize" },
                      { label: "Collection", key: "deliveryDate" },
                      { label: "Payment", key: "paymentStatus" },
                      { label: "Introducer", key: "introducer" },
                      { label: "Status", key: "status" },
                      { label: "Actions", key: null },
                    ].map((header) => (
                      <TableHead
                        key={header.label}
                        className="font-semibold text-gray-700 dark:text-gray-300"
                      >
                        <div className="flex items-center gap-1">
                          {header.label}
                          {header.key && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sortBookings(header.key)}
                              className="p-1"
                              aria-label={`Sort by ${header.label}`}
                            >
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedBookings.length > 0 ? (
                      paginatedBookings.map((booking, index) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`${
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-50 dark:bg-gray-700"
                          } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}
                        >
                          <TableCell className="font-medium text-indigo-600 dark:text-indigo-400">
                            {booking.doNumber}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.customerName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900 dark:text-gray-100">{booking.area}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900 dark:text-gray-100">
                              {booking.binSize} ({booking.weight}KG)
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              SN: {booking.binSN || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarRange className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {new Date(booking.deliveryDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Clock className="h-4 w-4 mr-1.5" />
                              <span>
                                {booking.collectionType} ({booking.collectionLocation})
                              </span>
                              {isCollectionApproaching(booking.collectionDue) && (
                                <Badge className="ml-2 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-full">
                                  Due soon
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getPaymentStatusColor(
                                booking.paymentStatus
                              )} font-medium rounded-full px-2.5 py-0.5 flex items-center gap-1`}
                            >
                              {booking.paymentStatus}
                            </Badge>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {booking.paymentMethod} • RM {booking.amount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900 dark:text-gray-100">
                              {booking.introducer || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Ref: {booking.jobReference || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                booking.status
                              )} font-medium rounded-full px-2.5 py-0.5 flex items-center gap-1`}
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(booking)}
                                  className="h-8 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label={`Edit booking ${booking.doNumber}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit booking</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  className="h-8 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label={`Delete booking ${booking.doNumber}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete booking</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateInvoice(booking)}
                                  className="h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label={`Generate invoice for ${booking.doNumber}`}
                                >
                                  <span>Invoice</span>
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Generate invoice</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarRange className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-600 dark:text-gray-300">
                              No bookings found matching your criteria.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{" "}
                  {filteredBookings.length} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md"
                          : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      }
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <DialogHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Booking - {selectedBooking?.doNumber}
              </DialogTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-2">
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute h-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${calculateCompletion()}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Form Completion: {calculateCompletion()}%
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Percentage of required fields completed
                </TooltipContent>
              </Tooltip>
            </DialogHeader>
            {selectedBooking && (
              <BookingForm
                formData={formData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleEditBooking}
                onCancel={() => setIsEditDialogOpen(false)}
                isEdit={true}
                isLoading={isLoading}
                completionPercentage={calculateCompletion()}
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
    </TooltipProvider>
  );
};

export default BookingOrders;
