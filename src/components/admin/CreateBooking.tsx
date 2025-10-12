import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CalendarRange,
  Plus,
  Search,
  User,
  Package,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  UserPlus,
  AlertCircle,
  Bell,
  Save,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  type: "Individual" | "SME" | "Corporate" | "Government";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  state: string;
}

interface BookingForm {
  customerId: string;
  customerName: string;
  customerType: "Individual" | "SME" | "Corporate" | "Government";
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  area: string;
  state: string;
  binSize: string;
  binWeight?: number;
  scheduledDate: string;
  scheduledTime: string;
  collectionDate: string;
  collectionTime: string;
  collectionSource: "warehouse" | "customer";
  paymentMode: "Cash" | "Online" | "Cheque" | "CDM" | "Term";
  priority: "high" | "medium" | "low";
  assignedDriver: string;
  assignedLorry: string;
  introducer: string;
  jobReference: string;
  ownerManagerSupervisor: string;
  amount: number;
  notes: string;
  doGenerationMode: "auto" | "manual";
  manualDONumber: string;
  manualDOBookNumber: string;
  manualBinSerialNumber: string;
}

interface NewCustomerForm {
  name: string;
  type: "Individual" | "SME" | "Corporate" | "Government";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  state: string;
}

const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customer");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [formData, setFormData] = useState<BookingForm>({
    customerId: "",
    customerName: "",
    customerType: "Individual",
    contactPerson: "",
    phone: "",
    email: "",
    location: "",
    area: "",
    state: "",
    binSize: "",
    binWeight: undefined,
    scheduledDate: "",
    scheduledTime: "",
    collectionDate: "",
    collectionTime: "",
    collectionSource: "warehouse",
    paymentMode: "Cash",
    priority: "medium",
    assignedDriver: "",
    assignedLorry: "",
    introducer: "",
    jobReference: "",
    ownerManagerSupervisor: "",
    amount: 0,
    notes: "",
    doGenerationMode: "auto",
    manualDONumber: "",
    manualDOBookNumber: "",
    manualBinSerialNumber: "",
  });

  const [newCustomer, setNewCustomer] = useState<NewCustomerForm>({
    name: "",
    type: "Individual",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    state: "",
  });

  // Sample customers data
  const [customers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "ABC Construction Sdn Bhd",
      type: "Corporate",
      contactPerson: "Ahmad Rahman",
      phone: "+60123456789",
      email: "ahmad@abc-construction.com",
      address: "Jalan Ampang, Kuala Lumpur",
      area: "Ampang",
      state: "Kuala Lumpur"
    },
    {
      id: "CUST002",
      name: "Sarah Lim",
      type: "Individual",
      contactPerson: "Sarah Lim",
      phone: "+60198765432",
      email: "sarah.lim@gmail.com",
      address: "Taman Desa, Kuala Lumpur",
      area: "Taman Desa",
      state: "Kuala Lumpur"
    },
    {
      id: "CUST003",
      name: "XYZ Corporation",
      type: "Corporate",
      contactPerson: "John Smith",
      phone: "+60134567890",
      email: "john@xyzcorp.com",
      address: "Petaling Jaya, Selangor",
      area: "Petaling Jaya",
      state: "Selangor"
    }
  ]);

  // Bin size options with pricing
  const binSizeOptions = [
    { id: "2x12x6", name: "2ft(H) × 12ft(L) × 6ft(W)", price: 200 },
    { id: "4x12x6", name: "4ft(H) × 12ft(L) × 6ft(W)", price: 280 },
    { id: "4x14x6", name: "4ft(H) × 14ft(L) × 6ft(W)", price: 320 },
    { id: "5x12x6", name: "5ft(H) × 12ft(L) × 6ft(W)", price: 350 },
    { id: "6x24x8", name: "6ft(H) × 24ft(L) × 8ft(W)", price: 750 },
    { id: "6.5x14.5x6", name: "6.5ft(H) × 14.5ft(L) × 6ft(W)", price: 450 }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCustomerSelection = (customer: Customer) => {
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email,
      location: customer.address,
      area: customer.area,
      state: customer.state
    }));
  };

  const handleAddNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.email) {
      alert("Please fill in all required customer fields");
      return;
    }

    const customerId = `CUST${String(customers.length + 1).padStart(3, '0')}`;
    const customer: Customer = {
      id: customerId,
      name: newCustomer.name,
      type: newCustomer.type,
      contactPerson: newCustomer.contactPerson,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      area: newCustomer.area,
      state: newCustomer.state
    };

    // In a real app, you would add this to your customers list
    handleCustomerSelection(customer);
    setShowAddCustomerModal(false);
    setNewCustomer({
      name: "",
      type: "Individual",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      area: "",
      state: ""
    });
  };

  const handleBinSizeChange = (binSize: string) => {
    const selectedBin = binSizeOptions.find(b => b.name === binSize);
    setFormData(prev => ({
      ...prev,
      binSize,
      amount: selectedBin?.price || 0
    }));
  };

  const handleCreateBooking = () => {
    // Validation
    if (!formData.customerId) {
      alert("Please select a customer.");
      return;
    }

    if (!formData.binSize || !formData.scheduledDate || !formData.scheduledTime) {
      alert("Please fill in all required booking fields.");
      return;
    }

    if (!formData.collectionDate || !formData.collectionTime) {
      alert("Please set collection date and time.");
      return;
    }

    if (formData.doGenerationMode === "manual" && !formData.manualDONumber.trim()) {
      alert("Please enter DO Number for manual mode.");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Creating booking with data:", formData);
    alert("Booking created successfully!");
    
    // Navigate back to bookings list
    navigate("/admin/bookings-dos");
  };

  const handleBackToList = () => {
    navigate("/admin/bookings-dos");
  };

  const canProceedToNext = () => {
    if (activeTab === "customer") {
      return !!formData.customerId;
    } else if (activeTab === "details") {
      return !!(formData.binSize && formData.scheduledDate && formData.scheduledTime);
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings & DOs
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarRange className="h-6 w-6 text-blue-600" />
              Create New Booking
            </h2>
            <p className="text-gray-600 mt-1">
              Create new bin bookings with customer selection, service details, and scheduling
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="customer">Select Customer</TabsTrigger>
                  <TabsTrigger value="details">Booking Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule & Confirm</TabsTrigger>
                </TabsList>

                <TabsContent value="customer" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Select Customer</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddCustomerModal(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New Customer
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers by name, contact, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredCustomers.map(customer => (
                      <Card 
                        key={customer.id} 
                        className={`hover:shadow-md cursor-pointer transition-shadow ${
                          formData.customerId === customer.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handleCustomerSelection(customer)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-600">{customer.contactPerson}</p>
                              <p className="text-sm text-gray-500">{customer.phone} • {customer.email}</p>
                              <p className="text-xs text-gray-500">{customer.area}, {customer.state}</p>
                            </div>
                            <Badge variant="outline">{customer.type}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No customers found matching your search.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  {formData.customerId && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Selected Customer: {formData.customerName}</h4>
                      <p className="text-sm text-gray-600">{formData.contactPerson} • {formData.phone}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bin Size & Type *</Label>
                      <Select 
                        value={formData.binSize} 
                        onValueChange={handleBinSizeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bin size" />
                        </SelectTrigger>
                        <SelectContent>
                          {binSizeOptions.map(bin => (
                            <SelectItem key={bin.id} value={bin.name}>
                              {bin.name} - RM {bin.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Mode *</Label>
                      <Select 
                        value={formData.paymentMode} 
                        onValueChange={(value: "Cash" | "Online" | "Cheque" | "CDM" | "Term") => 
                          setFormData(prev => ({ ...prev, paymentMode: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Online">Online Transfer</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="CDM">CDM</SelectItem>
                          <SelectItem value="Term">Term</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Scheduled Date *</Label>
                      <Input 
                        type="date" 
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Scheduled Time *</Label>
                      <Input 
                        type="time" 
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned Driver</Label>
                      <Input 
                        placeholder="Driver name"
                        value={formData.assignedDriver}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignedDriver: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned Lorry</Label>
                      <Input 
                        placeholder="Lorry ID"
                        value={formData.assignedLorry}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignedLorry: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value: "high" | "medium" | "low") => 
                          setFormData(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Owner/Manager/Supervisor</Label>
                      <Input 
                        placeholder="Assigned supervisor"
                        value={formData.ownerManagerSupervisor}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerManagerSupervisor: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* DO Generation Mode Selection */}
                  <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">DO Generation Mode</Label>
                      <p className="text-sm text-gray-600">Choose how you want to generate the Delivery Order number</p>
                      <RadioGroup 
                        value={formData.doGenerationMode} 
                        onValueChange={(value: "auto" | "manual") => 
                          setFormData(prev => ({ ...prev, doGenerationMode: value }))
                        }
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auto" id="auto-mode" />
                          <Label htmlFor="auto-mode" className="font-normal cursor-pointer">
                            Automatic Generation
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="manual-mode" />
                          <Label htmlFor="manual-mode" className="font-normal cursor-pointer">
                            Manual Entry
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.doGenerationMode === "auto" && (
                      <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900">Automatic Mode Selected</p>
                            <p className="text-sm text-blue-800">System will automatically generate DO Number, DO Book Number, and Bin Serial Number</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.doGenerationMode === "manual" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-yellow-900">Manual Mode Selected</p>
                              <p className="text-sm text-yellow-800">Please enter unique DO numbers. System will check for duplicates.</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-2">
                            <Label className="font-semibold">DO Number *</Label>
                            <Input 
                              placeholder="e.g., DO-0001 or custom format"
                              value={formData.manualDONumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, manualDONumber: e.target.value }))}
                              className="border-purple-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>DO Book Number (Optional)</Label>
                            <Input 
                              placeholder="e.g., DOBOOK-0001"
                              value={formData.manualDOBookNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, manualDOBookNumber: e.target.value }))}
                              className="border-purple-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Bin Serial Number (Optional)</Label>
                            <Input 
                              placeholder="e.g., BIN-SN-001"
                              value={formData.manualBinSerialNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, manualBinSerialNumber: e.target.value }))}
                              className="border-purple-300"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Introducer (for commission)</Label>
                      <Input 
                        placeholder="Introducer name"
                        value={formData.introducer}
                        onChange={(e) => setFormData(prev => ({ ...prev, introducer: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Job Reference</Label>
                      <Input 
                        placeholder="Job reference code"
                        value={formData.jobReference}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobReference: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea 
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {formData.amount > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="font-semibold">Total Amount: RM {formData.amount}</p>
                      {formData.introducer && (
                        <p className="text-sm text-gray-600">Commission (10%): RM {formData.amount * 0.1}</p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-semibold mb-4">Review Booking Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-medium">{formData.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Contact</p>
                        <p className="font-medium">{formData.contactPerson} • {formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bin Size</p>
                        <p className="font-medium">{formData.binSize}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-medium">RM {formData.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Schedule</p>
                        <p className="font-medium">{formData.scheduledDate} at {formData.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Mode</p>
                        <p className="font-medium">{formData.paymentMode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">DO Generation Mode</p>
                        <p className="font-medium capitalize">{formData.doGenerationMode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Schedule Bin Collection</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Collection Date *</Label>
                        <Input 
                          type="date" 
                          value={formData.collectionDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, collectionDate: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Collection Time *</Label>
                        <Input 
                          type="time" 
                          value={formData.collectionTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, collectionTime: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label>Bin Collection Source</Label>
                        <Select 
                          value={formData.collectionSource} 
                          onValueChange={(value: "warehouse" | "customer") => 
                            setFormData(prev => ({ ...prev, collectionSource: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                            <SelectItem value="customer">Customer Location</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Auto-Notifications</p>
                          <p className="text-sm text-gray-600">Owner/Manager and assigned driver will be notified automatically</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between gap-2 mt-6">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBackToList}>
                    Cancel
                  </Button>
                  {activeTab !== "customer" && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (activeTab === "details") {
                          setActiveTab("customer");
                        } else if (activeTab === "schedule") {
                          setActiveTab("details");
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                {activeTab === "schedule" ? (
                  <Button onClick={handleCreateBooking} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Create Booking
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      if (activeTab === "customer") {
                        setActiveTab("details");
                      } else if (activeTab === "details") {
                        setActiveTab("schedule");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!canProceedToNext()}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          {formData.customerId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Selected Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{formData.customerName}</p>
                  <p className="text-sm text-gray-600">{formData.customerType}</p>
                  <p className="text-sm text-gray-600">{formData.contactPerson}</p>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                  <p className="text-xs text-gray-500">{formData.area}, {formData.state}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.binSize && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Bin Size</p>
                    <p className="font-medium">{formData.binSize}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-green-600">RM {formData.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Mode</p>
                    <p className="font-medium">{formData.paymentMode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Priority</p>
                    <Badge variant="outline" className="text-xs">
                      {formData.priority}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.scheduledDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Service Date</p>
                    <p className="font-medium">{formData.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Service Time</p>
                    <p className="font-medium">{formData.scheduledTime}</p>
                  </div>
                  {formData.collectionDate && (
                    <>
                      <div>
                        <p className="text-gray-600">Collection Date</p>
                        <p className="font-medium">{formData.collectionDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Collection Time</p>
                        <p className="font-medium">{formData.collectionTime}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add New Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <p className="text-sm text-gray-600">Enter customer details to create a new customer profile</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input 
                    placeholder="Company or Individual name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Customer Type *</Label>
                  <Select 
                    value={newCustomer.type} 
                    onValueChange={(value: "Individual" | "SME" | "Corporate" | "Government") => 
                      setNewCustomer(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="SME">SME</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Contact Person *</Label>
                  <Input 
                    placeholder="Contact person name"
                    value={newCustomer.contactPerson}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input 
                    placeholder="+60123456789"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Email *</Label>
                  <Input 
                    type="email"
                    placeholder="customer@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Address *</Label>
                  <Textarea 
                    placeholder="Complete address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Area *</Label>
                  <Input 
                    placeholder="e.g. Ampang, Petaling Jaya"
                    value={newCustomer.area}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, area: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input 
                    placeholder="e.g. Selangor, Kuala Lumpur"
                    value={newCustomer.state}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => setShowAddCustomerModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewCustomer}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateBooking;
