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
import {
  ArrowLeft,
  Receipt,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Package,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  serviceDate: string;
  amount: number;
  status: "completed" | "in-progress" | "pending";
  description: string;
}

interface Customer {
  id: string;
  name: string;
  type: "Corporate" | "Individual" | "Government";
  email: string;
  phone: string;
  address: string;
}

interface InvoiceForm {
  sourceType: "delivery_order" | "customer";
  selectedOrders: string[];
  selectedCustomer: string;
  customerName: string;
  customerType: string;
  template: string;
  currency: string;
  paymentTerms: string;
  serviceDetails: string;
  subtotal: string;
  taxRate: string;
  notes: string;
}

const GenerateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("source");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState<InvoiceForm>({
    sourceType: "delivery_order",
    selectedOrders: [],
    selectedCustomer: "",
    customerName: "",
    customerType: "",
    template: "",
    currency: "MYR",
    paymentTerms: "30",
    serviceDetails: "",
    subtotal: "",
    taxRate: "6",
    notes: "",
  });

  // Sample data
  const [deliveryOrders] = useState<DeliveryOrder[]>([
    {
      id: "DO001",
      orderNumber: "DO-2024-001",
      customerName: "ABC Construction Sdn Bhd",
      customerType: "Corporate",
      serviceDate: "2024-03-01",
      amount: 850.0,
      status: "completed",
      description: "Waste collection - Construction site",
    },
    {
      id: "DO002",
      orderNumber: "DO-2024-002",
      customerName: "ABC Construction Sdn Bhd",
      customerType: "Corporate",
      serviceDate: "2024-03-02",
      amount: 1000.0,
      status: "completed",
      description: "Waste collection - Office building",
    },
    {
      id: "DO003",
      orderNumber: "DO-2024-003",
      customerName: "Sarah Lim",
      customerType: "Individual",
      serviceDate: "2024-03-05",
      amount: 320.0,
      status: "completed",
      description: "Residential waste collection",
    },
    {
      id: "DO004",
      orderNumber: "DO-2024-004",
      customerName: "Ministry of Health",
      customerType: "Government",
      serviceDate: "2024-03-10",
      amount: 1200.0,
      status: "completed",
      description: "Medical waste collection",
    },
  ]);

  const [customers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "XYZ Corporation",
      type: "Corporate",
      email: "billing@xyzcorp.com",
      phone: "+60 3-1234 5678",
      address: "123 Business Park, Kuala Lumpur",
    },
    {
      id: "CUST002",
      name: "John Doe",
      type: "Individual",
      email: "john.doe@email.com",
      phone: "+60 12-345 6789",
      address: "456 Residential Street, Petaling Jaya",
    },
    {
      id: "CUST003",
      name: "Department of Environment",
      type: "Government",
      email: "finance@doe.gov.my",
      phone: "+60 3-9876 5432",
      address: "789 Government Complex, Putrajaya",
    },
  ]);

  const filteredOrders = deliveryOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOrdersData = deliveryOrders.filter(order =>
    formData.selectedOrders.includes(order.id)
  );

  const selectedCustomerData = customers.find(customer =>
    customer.id === formData.selectedCustomer
  );

  const calculateTotals = () => {
    let subtotal = 0;
    
    if (formData.sourceType === "delivery_order") {
      subtotal = selectedOrdersData.reduce((sum, order) => sum + order.amount, 0);
    } else {
      subtotal = parseFloat(formData.subtotal) || 0;
    }

    const taxRate = parseFloat(formData.taxRate) / 100;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const handleOrderSelection = (orderId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedOrders: checked
        ? [...prev.selectedOrders, orderId]
        : prev.selectedOrders.filter(id => id !== orderId)
    }));
  };

  const handleCustomerSelection = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      selectedCustomer: customerId,
      customerName: customer?.name || "",
      customerType: customer?.type || "",
    }));
  };

  const handleCreateInvoice = () => {
    // Validation
    if (formData.sourceType === "delivery_order" && formData.selectedOrders.length === 0) {
      alert("Please select at least one delivery order.");
      return;
    }

    if (formData.sourceType === "customer" && !formData.selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (!formData.template || !formData.currency || !formData.paymentTerms) {
      alert("Please fill in all required fields.");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Creating invoice with data:", formData);
    alert("Invoice created successfully!");
    
    // Navigate back to invoice management
    navigate("/admin/invoicing");
  };

  const handleBackToList = () => {
    navigate("/admin/invoicing");
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
            Back to Invoice List
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="h-6 w-6 text-blue-600" />
              Generate Invoice
            </h2>
            <p className="text-gray-600 mt-1">
              Create new invoices by selecting delivery orders or customers with service details and pricing
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="source">Select Source</TabsTrigger>
                  <TabsTrigger value="details">Invoice Details</TabsTrigger>
                  <TabsTrigger value="review">Review & Create</TabsTrigger>
                </TabsList>

                <TabsContent value="source" className="space-y-4">
                  <div>
                    <Label>Invoice Source</Label>
                    <Select
                      value={formData.sourceType}
                      onValueChange={(value: "delivery_order" | "customer") =>
                        setFormData(prev => ({ ...prev, sourceType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery_order">From Delivery Orders</SelectItem>
                        <SelectItem value="customer">From Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.sourceType === "delivery_order" && (
                    <div>
                      <Label>Select Delivery Orders</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                        {filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={formData.selectedOrders.includes(order.id)}
                                onChange={(e) => handleOrderSelection(order.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <div>
                                <p className="font-medium">{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">{order.customerName}</p>
                                <p className="text-xs text-gray-500">{order.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formData.currency} {order.amount.toFixed(2)}</p>
                              <Badge variant="outline" className="text-xs">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.sourceType === "customer" && (
                    <div>
                      <Label>Select Customer</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="mt-3 space-y-2">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                              formData.selectedCustomer === customer.id ? "border-blue-500 bg-blue-50" : ""
                            }`}
                            onClick={() => handleCustomerSelection(customer.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <p className="text-sm text-gray-600">{customer.type}</p>
                                <p className="text-xs text-gray-500">{customer.email}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {customer.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer Name</Label>
                      <Input
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <Label>Customer Type</Label>
                      <Select
                        value={formData.customerType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Invoice Template</Label>
                      <Select
                        value={formData.template}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Template</SelectItem>
                          <SelectItem value="individual">Individual Template</SelectItem>
                          <SelectItem value="government">Government Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MYR">MYR (Malaysian Ringgit)</SelectItem>
                          <SelectItem value="USD">USD (US Dollar)</SelectItem>
                          <SelectItem value="SGD">SGD (Singapore Dollar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Payment Terms (Days)</Label>
                      <Select
                        value={formData.paymentTerms}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Select
                        value={formData.taxRate}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, taxRate: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% (Tax Exempt)</SelectItem>
                          <SelectItem value="6">6% (GST Malaysia)</SelectItem>
                          <SelectItem value="7">7% (GST Singapore)</SelectItem>
                          <SelectItem value="10">10% (Custom Rate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.sourceType === "customer" && (
                    <div>
                      <Label>Subtotal Amount</Label>
                      <Input
                        type="number"
                        value={formData.subtotal}
                        onChange={(e) => setFormData(prev => ({ ...prev, subtotal: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Service Details</Label>
                    <Textarea
                      value={formData.serviceDetails}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceDetails: e.target.value }))}
                      placeholder="Describe the services provided..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes or terms..."
                      rows={2}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="review" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Invoice Summary</h3>
                    
                    {formData.sourceType === "delivery_order" && selectedOrdersData.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Selected Delivery Orders:</h4>
                        <div className="space-y-2">
                          {selectedOrdersData.map((order) => (
                            <div key={order.id} className="flex justify-between items-center text-sm">
                              <span>{order.orderNumber} - {order.description}</span>
                              <span>{formData.currency} {order.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.sourceType === "customer" && selectedCustomerData && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Customer:</h4>
                        <p className="text-sm">{selectedCustomerData.name} ({selectedCustomerData.type})</p>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal:</span>
                        <span>{formData.currency} {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tax ({formData.taxRate}%):</span>
                        <span>{formData.currency} {taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>{formData.currency} {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Payment Terms:</strong> {formData.paymentTerms} days</p>
                      <p><strong>Template:</strong> {formData.template}</p>
                    </div>
                    <div>
                      <p><strong>Currency:</strong> {formData.currency}</p>
                      <p><strong>Issue Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between gap-2 mt-6">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBackToList}>
                    Cancel
                  </Button>
                  {activeTab !== "source" && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (activeTab === "details") {
                          setActiveTab("source");
                        } else if (activeTab === "review") {
                          setActiveTab("details");
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                {activeTab === "review" ? (
                  <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      if (activeTab === "source") {
                        setActiveTab("details");
                      } else if (activeTab === "details") {
                        setActiveTab("review");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={
                      (activeTab === "source" && formData.sourceType === "delivery_order" && formData.selectedOrders.length === 0) ||
                      (activeTab === "source" && formData.sourceType === "customer" && !formData.selectedCustomer) ||
                      (activeTab === "details" && (!formData.template || !formData.currency || !formData.paymentTerms || !formData.customerName))
                    }
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formData.currency} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formData.currency} {taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg text-green-600">{formData.currency} {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {formData.sourceType === "delivery_order" && selectedOrdersData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Selected Orders ({selectedOrdersData.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedOrdersData.map((order) => (
                    <div key={order.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-gray-600">{order.customerName}</p>
                      </div>
                      <span className="font-medium">{formData.currency} {order.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {formData.sourceType === "customer" && selectedCustomerData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Selected Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{selectedCustomerData.name}</p>
                  <p className="text-sm text-gray-600">{selectedCustomerData.type}</p>
                  <p className="text-sm text-gray-600">{selectedCustomerData.email}</p>
                  <Badge variant="outline" className="text-xs">
                    {selectedCustomerData.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;
