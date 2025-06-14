
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ArrowLeft, Fuel, Camera, Receipt, Car, MapPin, Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

const DriverExpenses = () => {
  const navigate = useNavigate();
  
  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
    description: "",
    location: "",
    orderId: ""
  });

  const [receipt, setReceipt] = useState<File | null>(null);

  const expenseCategories = [
    { value: "fuel", label: "Fuel", icon: <Fuel className="h-4 w-4" />, color: "bg-orange-500" },
    { value: "toll", label: "Toll", icon: <Car className="h-4 w-4" />, color: "bg-blue-500" },
    { value: "parking", label: "Parking", icon: <MapPin className="h-4 w-4" />, color: "bg-purple-500" },
    { value: "meals", label: "Meals", icon: <Receipt className="h-4 w-4" />, color: "bg-green-500" },
    { value: "maintenance", label: "Vehicle Maintenance", icon: <Car className="h-4 w-4" />, color: "bg-red-500" },
    { value: "other", label: "Other", icon: <Receipt className="h-4 w-4" />, color: "bg-gray-500" }
  ];

  // Recent expenses for display
  const [recentExpenses] = useState([
    {
      id: "EXP001",
      category: "fuel",
      amount: 45.50,
      description: "Petrol for delivery run",
      location: "Shell Station, Jalan Ampang",
      timestamp: "2024-01-15 09:30",
      orderId: "JOB001"
    },
    {
      id: "EXP002",
      category: "toll",
      amount: 8.50,
      description: "PLUS Highway toll",
      location: "Sungai Besi Toll Plaza",
      timestamp: "2024-01-15 08:15",
      orderId: "JOB002"
    },
    {
      id: "EXP003",
      category: "parking",
      amount: 3.00,
      description: "Customer site parking",
      location: "KLCC Parking",
      timestamp: "2024-01-15 11:00",
      orderId: "JOB001"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseData.category || !expenseData.amount || !expenseData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate expense recording
    toast.success(`Expense of RM${expenseData.amount} recorded successfully!`);
    
    // Reset form
    setExpenseData({
      category: "",
      amount: "",
      description: "",
      location: "",
      orderId: ""
    });
    setReceipt(null);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      toast.success("Receipt uploaded");
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.icon : <Receipt className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.color : "bg-gray-500";
  };

  const todayTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Breadcrumbs */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm">
        <div className="px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/driver/dashboard")}
                  className="text-gray-600 hover:text-blue-600 p-0 h-auto font-normal"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  Expense Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Receipt className="h-6 w-6" />
                </div>
                Expense Tracking
              </h1>
              <p className="text-green-100">Record and manage job-related expenses</p>
            </div>
            <div className="text-center">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-bold">RM{todayTotal.toFixed(2)}</p>
                <p className="text-sm text-green-100">Today's Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Fuel className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">RM45.50</p>
                <p className="text-sm text-gray-600">Fuel Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">RM8.50</p>
                <p className="text-sm text-gray-600">Toll & Parking</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">3</p>
                <p className="text-sm text-gray-600">Expenses Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Form */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <Plus className="h-5 w-5 text-emerald-600" />
              Record New Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Expense Category</Label>
                <Select 
                  value={expenseData.category} 
                  onValueChange={(value) => setExpenseData(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:ring-emerald-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${category.color} text-white`}>
                            {category.icon}
                          </div>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 font-medium">Amount (RM)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData(prev => ({...prev, amount: e.target.value}))}
                    placeholder="0.00"
                    className="pl-10 h-12 border-gray-300 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                <Input
                  id="description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Brief description of expense"
                  className="h-12 border-gray-300 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">Location (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="location"
                    value={expenseData.location}
                    onChange={(e) => setExpenseData(prev => ({...prev, location: e.target.value}))}
                    placeholder="Where the expense occurred"
                    className="pl-10 h-12 border-gray-300 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId" className="text-gray-700 font-medium">Related Order ID (Optional)</Label>
                <Input
                  id="orderId"
                  value={expenseData.orderId}
                  onChange={(e) => setExpenseData(prev => ({...prev, orderId: e.target.value}))}
                  placeholder="e.g., JOB001"
                  className="h-12 border-gray-300 focus:ring-emerald-500"
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Receipt Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    {receipt ? (
                      <div className="text-emerald-600">
                        <Camera className="h-10 w-10 mx-auto mb-3" />
                        <p className="font-medium">{receipt.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Receipt uploaded successfully</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Camera className="h-10 w-10 mx-auto mb-3" />
                        <p className="font-medium">Upload Receipt</p>
                        <p className="text-sm mt-1">Tap to capture or select image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-white font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Record Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                  <p className="text-4xl font-bold text-red-600 mb-2">RM{todayTotal.toFixed(2)}</p>
                  <p className="text-red-700 font-medium">Total Expenses Today</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <Fuel className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-orange-600">RM45.50</p>
                  <p className="text-xs text-orange-700 font-medium">Fuel</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Car className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-600">RM8.50</p>
                  <p className="text-xs text-blue-700 font-medium">Toll</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-purple-600">RM3.00</p>
                  <p className="text-xs text-purple-700 font-medium">Parking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Expenses List */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                <Receipt className="h-5 w-5 text-gray-600" />
                Recent Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)} text-white`}>
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-600">{getCategoryLabel(expense.category)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">RM{expense.amount.toFixed(2)}</p>
                      {expense.orderId && (
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                          {expense.orderId}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{expense.location}</span>
                    </div>
                    <span>{expense.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverExpenses;
