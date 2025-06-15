
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Plus, Upload, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";

const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState([
    {
      id: "EXP001",
      category: "Vehicle Maintenance",
      subcategory: "Fuel",
      description: "Monthly fuel expenses for fleet vehicles",
      amount: 4500.00,
      date: "2024-03-15",
      vendor: "Petronas Station",
      paymentMethod: "Corporate Card",
      status: "approved",
      approvedBy: "Finance Manager",
      receipts: 12,
      budgetCategory: "Operations",
      recurring: true
    },
    {
      id: "EXP002",
      category: "Staff Costs",
      subcategory: "Salary",
      description: "Driver salaries for March 2024",
      amount: 15600.00,
      date: "2024-03-01",
      vendor: "Payroll",
      paymentMethod: "Bank Transfer",
      status: "approved",
      approvedBy: "HR Manager",
      receipts: 1,
      budgetCategory: "Personnel",
      recurring: true
    },
    {
      id: "EXP003",
      category: "Equipment",
      subcategory: "Bin Purchase",
      description: "New waste bins - 5x ASR series",
      amount: 2800.00,
      date: "2024-03-10",
      vendor: "Industrial Supplies Sdn Bhd",
      paymentMethod: "Purchase Order",
      status: "pending",
      approvedBy: null,
      receipts: 3,
      budgetCategory: "Capital",
      recurring: false
    }
  ]);

  const [budgetCategories] = useState([
    {
      name: "Operations",
      allocated: 25000,
      spent: 18500,
      remaining: 6500,
      percentage: 74
    },
    {
      name: "Personnel",
      allocated: 50000,
      spent: 31200,
      remaining: 18800,
      percentage: 62
    },
    {
      name: "Capital",
      allocated: 15000,
      spent: 2800,
      remaining: 12200,
      percentage: 19
    },
    {
      name: "Marketing",
      allocated: 8000,
      spent: 3200,
      remaining: 4800,
      percentage: 40
    }
  ]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending Approval</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "paid":
        return <Badge className="bg-blue-100 text-blue-800">Paid</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Advanced Expense Management
          </h2>
          <p className="text-gray-600 mt-1">Multi-category tracking with receipt upload and approval workflows</p>
        </div>
        <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle">Vehicle Maintenance</SelectItem>
                    <SelectItem value="staff">Staff Costs</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="office">Office & Admin</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Input placeholder="e.g., Fuel, Repairs, etc." />
              </div>
              <div className="space-y-2">
                <Label>Amount (RM)</Label>
                <Input type="number" placeholder="1000.00" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Input placeholder="Vendor name" />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Corporate Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the expense" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Receipt Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload receipts or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
              <Button onClick={() => setShowExpenseModal(false)}>Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold">RM {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{expenses.filter(e => e.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{expenses.filter(e => e.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold">{expenses.reduce((sum, e) => sum + e.receipts, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetCategories.map((budget) => (
              <Card key={budget.name} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">{budget.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Allocated</span>
                      <span className="font-medium">RM {budget.allocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Spent</span>
                      <span className="font-medium text-red-600">RM {budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining</span>
                      <span className="font-medium text-green-600">RM {budget.remaining.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${budget.percentage > 80 ? 'bg-red-500' : budget.percentage > 60 ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{ width: `${budget.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm font-medium">
                      {budget.percentage}% utilized
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {expense.category}
                      <Badge variant="outline" className="text-xs">
                        {expense.subcategory}
                      </Badge>
                      {expense.recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{expense.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(expense.status)}
                  <div className="text-right">
                    <p className="font-bold text-lg">RM {expense.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {expense.date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Vendor</p>
                  <p className="font-medium">{expense.vendor}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium">{expense.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500">Receipts</p>
                  <p className="font-medium flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {expense.receipts} files
                  </p>
                </div>
              </div>
              
              {expense.approvedBy && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Approved by {expense.approvedBy}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  View Receipts
                </Button>
                {expense.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline">
                  Edit Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpenseManagement;
