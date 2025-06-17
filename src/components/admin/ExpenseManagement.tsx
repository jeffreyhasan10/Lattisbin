import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Plus, Upload, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle, FileText, Scan, Shield, TrendingUp } from "lucide-react";
import ExpenseEngine from "@/utils/expenseEngine";

interface Expense {
  id: string;
  category: string;
  categoryId: string;
  subcategory: string;
  description: string;
  amount: number;
  date: string;
  vendor: string;
  paymentMethod: string;
  status: "draft" | "pending" | "approved" | "rejected" | "paid";
  approvedBy: string | null;
  receipts: any[];
  budgetCategory: string;
  recurring: boolean;
  ocrProcessed: boolean;
  approvalWorkflow?: any;
  validationResult?: any;
}

const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP001",
      category: "Vehicle & Fleet",
      categoryId: "VEHICLE",
      subcategory: "Fuel",
      description: "Monthly fuel expenses for fleet vehicles",
      amount: 4500.00,
      date: "2024-03-15",
      vendor: "Petronas Station",
      paymentMethod: "Corporate Card",
      status: "approved",
      approvedBy: "Fleet Manager",
      receipts: [
        { id: "REC001", filename: "fuel_receipt_001.jpg", extractedData: { amount: 4500, confidence: 0.92 } }
      ],
      budgetCategory: "Operations",
      recurring: true,
      ocrProcessed: true,
      validationResult: { valid: true, issues: [], warnings: [] }
    },
    {
      id: "EXP002",
      category: "Personnel Costs",
      categoryId: "PERSONNEL",
      subcategory: "Training",
      description: "Safety training certification for drivers",
      amount: 2800.00,
      date: "2024-03-10",
      vendor: "Safety Training Institute",
      paymentMethod: "Bank Transfer",
      status: "pending",
      approvedBy: null,
      receipts: [
        { id: "REC002", filename: "training_invoice.pdf", extractedData: { amount: 2800, confidence: 0.88 } }
      ],
      budgetCategory: "Personnel",
      recurring: false,
      ocrProcessed: true,
      approvalWorkflow: ExpenseEngine.createApprovalWorkflow(2800, "PERSONNEL")
    }
  ]);

  const [expenseCategories] = useState(ExpenseEngine.getCategories());
  const [budgetAnalysis, setBudgetAnalysis] = useState({
    totalBudget: 110000,
    totalSpent: 65300,
    utilizationRate: 59,
    categoryBreakdown: {
      "Vehicle & Fleet": { spent: 28500, budget: 25000 },
      "Personnel Costs": { spent: 18600, budget: 50000 },
      "Equipment & Supplies": { spent: 12200, budget: 15000 },
      "Operations": { spent: 6000, budget: 20000 }
    }
  });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [ocrResults, setOcrResults] = useState<any[]>([]);

  // --- STATE FOR ADD/EDIT EXPENSE FORM ---
  const [expenseForm, setExpenseForm] = useState<Omit<Expense, 'amount'> & { amount: string }>({
    id: '',
    category: '',
    categoryId: '',
    subcategory: '',
    description: '',
    amount: '',
    date: '',
    vendor: '',
    paymentMethod: '',
    status: 'pending',
    approvedBy: null,
    receipts: [],
    budgetCategory: '',
    recurring: false,
    ocrProcessed: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE FOR RECEIPT MODAL ---
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);
  const [receiptsToShow, setReceiptsToShow] = useState<any[]>([]);

  // --- STATE FOR OCR EDIT ---
  const [editingOcrIndex, setEditingOcrIndex] = useState<number | null>(null);
  const [ocrEditForm, setOcrEditForm] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
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

  const handleFileUpload = async (files: FileList) => {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const ocrResult = await ExpenseEngine.processReceiptOCR(file);
        results.push(ocrResult);
      } catch (error) {
        console.error('OCR processing failed:', error);
      }
    }
    setOcrResults(results);
    setShowOCRModal(true);
  };

  const handleApproveExpense = (expense: Expense, approverRole: string) => {
    const updatedExpenses = expenses.map(exp => 
      exp.id === expense.id 
        ? { 
            ...exp, 
            status: "approved" as const,
            approvedBy: approverRole,
            approvalWorkflow: expense.approvalWorkflow 
              ? ExpenseEngine.processApproval(expense.approvalWorkflow, approverRole, true)
              : undefined
          }
        : exp
    );
    setExpenses(updatedExpenses);
    setShowApprovalModal(false);
  };

  // --- HANDLERS ---
  const resetExpenseForm = () => {
    setExpenseForm({
      id: '',
      category: '',
      categoryId: '',
      subcategory: '',
      description: '',
      amount: '',
      date: '',
      vendor: '',
      paymentMethod: '',
      status: 'pending',
      approvedBy: null,
      receipts: [],
      budgetCategory: '',
      recurring: false,
      ocrProcessed: false,
    });
    setIsEditing(false);
  };

  const handleOpenAddExpense = () => {
    resetExpenseForm();
    setShowExpenseModal(true);
  };

  const handleExpenseFormChange = (field: keyof typeof expenseForm, value: any) => {
    setExpenseForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOrEditExpense = () => {
    if (!expenseForm.category || !expenseForm.subcategory || !expenseForm.amount || !expenseForm.date || !expenseForm.vendor || !expenseForm.paymentMethod) {
      alert('Please fill in all required fields.');
      return;
    }
    const safeStatus = expenseForm.status as Expense['status'];
    if (isEditing) {
      setExpenses((prev) => prev.map(exp => exp.id === expenseForm.id ? { ...expenseForm, amount: parseFloat(expenseForm.amount), status: safeStatus } as Expense : exp));
    } else {
      setExpenses((prev) => [
        ...prev,
        {
          ...expenseForm,
          id: `EXP${Math.floor(Math.random() * 100000)}`,
          amount: parseFloat(expenseForm.amount),
          receipts: expenseForm.receipts || [],
          ocrProcessed: expenseForm.ocrProcessed || false,
          status: safeStatus,
          approvedBy: null,
        } as Expense,
      ]);
    }
    setShowExpenseModal(false);
    resetExpenseForm();
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseForm({ ...expense, amount: expense.amount.toString() });
    setIsEditing(true);
    setShowExpenseModal(true);
  };

  const handleViewReceipts = (receipts: any[]) => {
    setReceiptsToShow(receipts);
    setShowReceiptsModal(true);
  };

  const handleOcrEdit = (index: number) => {
    setEditingOcrIndex(index);
    setOcrEditForm({ ...ocrResults[index].extractedData });
  };

  const handleOcrEditChange = (field: string, value: any) => {
    setOcrEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleOcrEditSave = () => {
    if (editingOcrIndex !== null && ocrEditForm) {
      setOcrResults((prev) => prev.map((r, i) => i === editingOcrIndex ? { ...r, extractedData: { ...ocrEditForm, amount: parseFloat(ocrEditForm.amount) } } : r));
      setEditingOcrIndex(null);
      setOcrEditForm(null);
    }
  };

  const handleOcrAccept = (result: any) => {
    setExpenseForm({
      id: '',
      category: '',
      categoryId: '',
      subcategory: '',
      description: '',
      amount: result.extractedData.amount.toString(),
      date: result.extractedData.date || '',
      vendor: result.extractedData.vendor || '',
      paymentMethod: '',
      status: 'pending',
      approvedBy: null,
      receipts: [{ id: `REC${Math.floor(Math.random() * 100000)}`, filename: result.filename, extractedData: result.extractedData }],
      budgetCategory: '',
      recurring: false,
      ocrProcessed: true,
    });
    setShowExpenseModal(true);
    setIsEditing(false);
  };

  const handleRejectExpense = (expense: Expense) => {
    setExpenses((prev) => prev.map(exp => exp.id === expense.id ? { ...exp, status: 'rejected', approvedBy: null } : exp));
    setShowApprovalModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Advanced Expense Management
          </h2>
          <p className="text-gray-600 mt-1">OCR processing, approval workflows, and budget analytics</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showOCRModal} onOpenChange={setShowOCRModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Scan className="h-4 w-4 mr-2" />
                OCR Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Receipt OCR Processing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">Upload Receipt Images</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to select files</p>
                    <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, PDF up to 10MB each</p>
                  </label>
                </div>
                
                {ocrResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">OCR Results</h3>
                    {ocrResults.map((result, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">{result.filename}</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Vendor</span>
                                  <span className="font-medium">{result.extractedData.vendor}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Amount</span>
                                  <span className="font-medium">RM {result.extractedData.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Date</span>
                                  <span className="font-medium">{result.extractedData.date}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-500">Confidence Score</span>
                                <Badge className={result.extractedData.confidence > 0.9 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                                  {(result.extractedData.confidence * 100).toFixed(1)}%
                                </Badge>
                              </div>
                              <Progress value={result.extractedData.confidence * 100} className="mb-2" />
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleOcrEdit(index)}>Edit</Button>
                                <Button size="sm" onClick={() => handleOcrAccept(result)}>Accept</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleOpenAddExpense}>
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
                  <Select value={expenseForm.categoryId} onValueChange={v => handleExpenseFormChange('categoryId', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Input value={expenseForm.subcategory} onChange={e => handleExpenseFormChange('subcategory', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Amount (RM)</Label>
                  <Input type="number" value={expenseForm.amount} onChange={e => handleExpenseFormChange('amount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={expenseForm.date} onChange={e => handleExpenseFormChange('date', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Vendor</Label>
                  <Input value={expenseForm.vendor} onChange={e => handleExpenseFormChange('vendor', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={expenseForm.paymentMethod} onValueChange={v => handleExpenseFormChange('paymentMethod', v)}>
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
                  <Textarea value={expenseForm.description} onChange={e => handleExpenseFormChange('description', e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
                <Button onClick={handleAddOrEditExpense}>{isEditing ? 'Save Changes' : 'Add Expense'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <Scan className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">OCR Processed</p>
                <p className="text-2xl font-bold">{expenses.filter(e => e.ocrProcessed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Auto-Approved</p>
                <p className="text-2xl font-bold">{expenses.filter(e => e.status === 'approved' && !e.approvalWorkflow).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Budget Used</p>
                <p className="text-2xl font-bold">{budgetAnalysis.utilizationRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Analysis & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(budgetAnalysis.categoryBreakdown).map(([category, data]) => {
              const utilizationRate = (data.spent / data.budget) * 100;
              const isOverBudget = data.spent > data.budget;
              
              return (
                <Card key={category} className={`border-l-4 ${isOverBudget ? 'border-l-red-500' : utilizationRate > 80 ? 'border-l-orange-500' : 'border-l-green-500'}`}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">{category}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Budget</span>
                        <span className="font-medium">RM {data.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Spent</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                          RM {data.spent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remaining</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          RM {(data.budget - data.spent).toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(utilizationRate, 100)} 
                        className="h-2"
                      />
                      <div className="text-center text-sm font-medium">
                        {utilizationRate.toFixed(1)}% utilized
                      </div>
                      {isOverBudget && (
                        <div className="bg-red-50 p-2 rounded text-xs text-red-800">
                          Over budget by RM {(data.spent - data.budget).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {expense.category}
                      <Badge variant="outline" className="text-xs">
                        {expense.subcategory}
                      </Badge>
                      {expense.ocrProcessed && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          <Scan className="h-3 w-3 mr-1" />
                          OCR
                        </Badge>
                      )}
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
                  <p className="text-gray-500">Transaction Details</p>
                  <div className="space-y-1 mt-2">
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {expense.date}
                    </p>
                    <p className="font-medium">{expense.vendor}</p>
                    <p className="text-gray-600">{expense.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500">Receipt Processing</p>
                  <div className="space-y-1 mt-2">
                    <p className="font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {expense.receipts.length} files
                    </p>
                    {expense.ocrProcessed && (
                      <div className="space-y-1">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Processed
                        </Badge>
                        {expense.receipts[0] && (
                          <p className="text-xs text-gray-600">
                            Confidence: {(expense.receipts[0].extractedData.confidence * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500">Approval Status</p>
                  <div className="space-y-1 mt-2">
                    {expense.approvalWorkflow ? (
                      <div>
                        <p className="text-xs text-gray-600">
                          Step {expense.approvalWorkflow.currentStep} of {expense.approvalWorkflow.steps.length}
                        </p>
                        <p className="font-medium text-orange-600">
                          Awaiting: {expense.approvalWorkflow.steps[expense.approvalWorkflow.currentStep - 1]?.approverRole}
                        </p>
                      </div>
                    ) : expense.approvedBy ? (
                      <div>
                        <Badge className="bg-green-100 text-green-800 text-xs mb-1">Auto-Approved</Badge>
                        <p className="font-medium">{expense.approvedBy}</p>
                      </div>
                    ) : (
                      <p className="text-gray-600">No approval required</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500">Validation</p>
                  <div className="space-y-1 mt-2">
                    {expense.validationResult ? (
                      <div>
                        {expense.validationResult.valid ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Issues Found
                          </Badge>
                        )}
                        {expense.validationResult.warnings?.length > 0 && (
                          <p className="text-xs text-orange-600 mt-1">
                            {expense.validationResult.warnings.length} warning(s)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600">Not validated</p>
                    )}
                  </div>
                </div>
              </div>
              
              {expense.approvedBy && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Approved by {expense.approvedBy}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleViewReceipts(expense.receipts)}>
                  <FileText className="h-3 w-3 mr-1" />
                  View Receipts
                </Button>
                {expense.status === 'pending' && expense.approvalWorkflow && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setShowApprovalModal(true);
                      }}
                    >
                      Review
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApproveExpense(expense, "Department Manager")}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={() => handleEditExpense(expense)}>
                  Edit Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Approval Review</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expense Details</Label>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{selectedExpense.description}</p>
                    <p className="text-sm text-gray-600">{selectedExpense.category} - {selectedExpense.subcategory}</p>
                    <p className="text-lg font-bold text-green-600">RM {selectedExpense.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <Label>Approval Workflow</Label>
                  <div className="space-y-2">
                    {selectedExpense.approvalWorkflow?.steps.map((step: any, index: number) => (
                      <div key={index} className={`p-2 rounded text-sm ${
                        index < selectedExpense.approvalWorkflow.currentStep - 1 
                          ? 'bg-green-50 text-green-800'
                          : index === selectedExpense.approvalWorkflow.currentStep - 1
                          ? 'bg-orange-50 text-orange-800'
                          : 'bg-gray-50 text-gray-600'
                      }`}>
                        <p className="font-medium">Level {step.level}: {step.approverRole}</p>
                        <p className="text-xs">{step.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label>Approval Comments</Label>
                <Textarea placeholder="Add approval comments..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowApprovalModal(false)}>Cancel</Button>
                <Button variant="outline" onClick={() => handleRejectExpense(selectedExpense!)}>Reject</Button>
                <Button onClick={() => handleApproveExpense(selectedExpense, "Department Manager")}>
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipts Modal */}
      <Dialog open={showReceiptsModal} onOpenChange={setShowReceiptsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipts</DialogTitle>
          </DialogHeader>
          {receiptsToShow.map((receipt) => (
            <div key={receipt.id} className="space-y-2">
              <p className="font-medium">{receipt.filename}</p>
              {receipt.filename.match(/\.(jpg|jpeg|png)$/i) ? (
                <img src={receipt.filename} alt={receipt.filename} className="max-h-64 rounded border" />
              ) : receipt.filename.match(/\.pdf$/i) ? (
                <a href={receipt.filename} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
              ) : null}
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowReceiptsModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OCR Edit Modal */}
      {editingOcrIndex !== null && (
        <Dialog open={true} onOpenChange={() => { setEditingOcrIndex(null); setOcrEditForm(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit OCR Data</DialogTitle>
            </DialogHeader>
            {ocrEditForm && (
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Input value={ocrEditForm.vendor || ''} onChange={e => handleOcrEditChange('vendor', e.target.value)} />
                <Label>Amount</Label>
                <Input type="number" value={ocrEditForm.amount || ''} onChange={e => handleOcrEditChange('amount', e.target.value)} />
                <Label>Date</Label>
                <Input type="date" value={ocrEditForm.date || ''} onChange={e => handleOcrEditChange('date', e.target.value)} />
                <Label>Confidence</Label>
                <Input type="number" step="0.01" value={ocrEditForm.confidence || ''} onChange={e => handleOcrEditChange('confidence', e.target.value)} />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { setEditingOcrIndex(null); setOcrEditForm(null); }}>Cancel</Button>
              <Button onClick={handleOcrEditSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExpenseManagement;
