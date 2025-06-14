
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Fuel, Camera, Receipt, Car, MapPin } from "lucide-react";
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
    { value: "fuel", label: "Fuel", icon: <Fuel className="h-4 w-4" /> },
    { value: "toll", label: "Toll", icon: <Car className="h-4 w-4" /> },
    { value: "parking", label: "Parking", icon: <MapPin className="h-4 w-4" /> },
    { value: "meals", label: "Meals", icon: <Receipt className="h-4 w-4" /> },
    { value: "maintenance", label: "Vehicle Maintenance", icon: <Car className="h-4 w-4" /> },
    { value: "other", label: "Other", icon: <Receipt className="h-4 w-4" /> }
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

  const todayTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/driver/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Expense Tracking</h1>
              <p className="text-sm text-gray-600">Record job-related expenses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              Record Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Expense Category</Label>
                <Select 
                  value={expenseData.category} 
                  onValueChange={(value) => setExpenseData(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (RM)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData(prev => ({...prev, amount: e.target.value}))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Brief description of expense"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={expenseData.location}
                  onChange={(e) => setExpenseData(prev => ({...prev, location: e.target.value}))}
                  placeholder="Where the expense occurred"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId">Related Order ID (Optional)</Label>
                <Input
                  id="orderId"
                  value={expenseData.orderId}
                  onChange={(e) => setExpenseData(prev => ({...prev, orderId: e.target.value}))}
                  placeholder="e.g., JOB001"
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label>Receipt Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    {receipt ? (
                      <div className="text-green-600">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{receipt.name}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Tap to upload receipt</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Record Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-red-600">RM{todayTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Expenses</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-orange-600">RM45.50</p>
                <p className="text-xs text-gray-600">Fuel</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">RM8.50</p>
                <p className="text-xs text-gray-600">Toll</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">RM3.00</p>
                <p className="text-xs text-gray-600">Parking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(expense.category)}
                    <div>
                      <p className="font-medium text-sm">{expense.description}</p>
                      <p className="text-xs text-gray-600">{getCategoryLabel(expense.category)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">RM{expense.amount.toFixed(2)}</p>
                    {expense.orderId && (
                      <Badge variant="outline" className="text-xs">
                        {expense.orderId}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{expense.location}</span>
                  <span>{expense.timestamp}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverExpenses;
