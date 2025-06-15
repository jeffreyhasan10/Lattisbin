
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
import { RefreshCw, Plus, AlertTriangle, CheckCircle, Clock, DollarSign, FileText, TrendingDown, BarChart, Brain } from "lucide-react";
import RefundEngine from "@/utils/refundEngine";

interface RefundRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  requestDate: string;
  reason: string;
  category: string;
  description: string;
  originalAmount: number;
  refundAmount: number;
  processingFee: number;
  netRefund: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  approvedBy: string | null;
  processedDate: string | null;
  refundMethod: string;
  impactAnalysis: any;
  autoProcessed: boolean;
  preventionRecommendations: string[];
}

const RefundManagement: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([
    {
      id: "REF001",
      orderNumber: "ORD001",
      customerName: "ABC Construction Sdn Bhd",
      requestDate: "2024-03-10",
      reason: "service_not_provided",
      category: "Service Not Provided",
      description: "Driver unable to access location due to road closure",
      originalAmount: 850.00,
      refundAmount: 850.00,
      processingFee: 0.00,
      netRefund: 850.00,
      status: "approved",
      approvedBy: "System Auto-Approval",
      processedDate: "2024-03-12",
      refundMethod: "bank_transfer",
      impactAnalysis: {
        financialImpact: 127.50,
        operationalImpact: "Medium - monitor frequency",
        customerSatisfactionImpact: "Positive - maintains customer relationship"
      },
      autoProcessed: true,
      preventionRecommendations: [
        "Improve route planning and accessibility checks",
        "Enhance driver training for difficult locations"
      ]
    },
    {
      id: "REF002",
      orderNumber: "ORD002",
      customerName: "Sarah Lim",
      requestDate: "2024-03-15",
      reason: "customer_cancellation",
      category: "Early Cancellation",
      description: "Customer changed mind, cancelled within 24 hours",
      originalAmount: 320.00,
      refundAmount: 288.00,
      processingFee: 25.00,
      netRefund: 263.00,
      status: "pending",
      approvedBy: null,
      processedDate: null,
      refundMethod: "original_payment",
      impactAnalysis: {
        financialImpact: 32.00,
        operationalImpact: "Low - standard processing",
        customerSatisfactionImpact: "Positive - maintains customer relationship"
      },
      autoProcessed: false,
      preventionRecommendations: [
        "Send confirmation reminders 24h before service",
        "Implement flexible rescheduling options"
      ]
    }
  ]);

  const [policies] = useState(RefundEngine.getPolicies());
  const [cancellationAnalytics] = useState(RefundEngine.getCancellationAnalytics());
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "processed":
        return <Badge className="bg-blue-100 text-blue-800">Processed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleProcessRefund = (refund: RefundRequest) => {
    const mockRequest = {
      id: refund.id,
      orderId: refund.orderNumber,
      customerId: refund.customerName,
      amount: refund.originalAmount,
      reason: refund.reason,
      category: refund.category,
      description: refund.description,
      requestDate: new Date(refund.requestDate)
    };

    const result = RefundEngine.processRefundRequest(mockRequest);
    
    const updatedRefunds = refunds.map(r => 
      r.id === refund.id 
        ? { 
            ...r, 
            status: result.approved ? "approved" as const : "rejected" as const,
            refundAmount: result.refundAmount,
            processingFee: result.processingFee,
            netRefund: result.netRefund,
            autoProcessed: result.autoProcessed,
            impactAnalysis: result.impactAnalysis,
            approvedBy: result.autoProcessed ? "System Auto-Approval" : "Manual Review"
          }
        : r
    );
    setRefunds(updatedRefunds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            Refund & Cancellation Management
          </h2>
          <p className="text-gray-600 mt-1">Automated processing with AI-powered impact analysis</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Cancellation Analytics & Insights</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cancellation Reasons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cancellationAnalytics.reasons.map((reason, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{reason.subcategory}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{reason.frequency}%</span>
                              {reason.preventable && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">Preventable</Badge>
                              )}
                            </div>
                          </div>
                          <Progress value={reason.frequency} className="h-2" />
                          <p className="text-xs text-gray-500">Avg Impact: RM {reason.averageImpact}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Impact Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-blue-600 font-medium">Total Cancellations</p>
                        <p className="text-2xl font-bold text-blue-800">{cancellationAnalytics.totalCancellations}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <p className="text-sm text-orange-600 font-medium">Preventable Cancellations</p>
                        <p className="text-2xl font-bold text-orange-800">{cancellationAnalytics.preventableCancellations}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-sm text-red-600 font-medium">Average Impact</p>
                        <p className="text-2xl font-bold text-red-800">RM {cancellationAnalytics.averageImpactPerCancellation.toFixed(0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Policies
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Refund Policy Management</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {policies.map((policy) => (
                  <Card key={policy.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">{policy.category}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Refund %</span>
                          <span className="font-medium">{policy.refundPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Processing Fee</span>
                          <span className="font-medium">RM {policy.processingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Time Limit</span>
                          <span className="font-medium">{policy.timeLimit} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Auto Approve</span>
                          {policy.autoApprove ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="mt-3 pt-2 border-t">
                          <p className="text-xs text-gray-600 font-medium mb-1">Impact Factors:</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Customer Retention</span>
                              <span>{(policy.impactFactors.customerRetention * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>Operational Cost</span>
                              <span>{(policy.impactFactors.operationalCost * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>Driver Compensation</span>
                              <span>{(policy.impactFactors.driverCompensation * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Process Refund
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Process Refund Request</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Order Number</Label>
                  <Input placeholder="ORD001" />
                </div>
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input placeholder="Customer name" />
                </div>
                <div className="space-y-2">
                  <Label>Refund Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.category}>
                          {policy.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Original Amount (RM)</Label>
                  <Input type="number" placeholder="850.00" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Detailed description of the refund reason" />
                </div>
                <div className="col-span-2">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      <Brain className="h-4 w-4 inline mr-1" />
                      AI Impact Prediction
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-600">Financial Impact</p>
                        <p className="font-bold">RM 127.50</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Customer Retention</p>
                        <p className="font-bold text-green-600">95%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Auto-Process</p>
                        <p className="font-bold text-blue-600">Yes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRefundModal(false)}>Cancel</Button>
                <Button onClick={() => setShowRefundModal(false)}>Process Refund</Button>
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
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{refunds.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Refunded</p>
                <p className="text-2xl font-bold">RM {refunds.reduce((sum, r) => sum + r.netRefund, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Auto-Processed</p>
                <p className="text-2xl font-bold">{refunds.filter(r => r.autoProcessed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Preventable</p>
                <p className="text-2xl font-bold">{cancellationAnalytics.preventableCancellations}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund Requests */}
      <div className="space-y-4">
        {refunds.map((refund) => (
          <Card key={refund.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Refund #{refund.id}
                      <Badge variant="outline" className="text-xs">
                        {refund.orderNumber}
                      </Badge>
                      {refund.autoProcessed && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          Auto-Processed
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{refund.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(refund.status)}
                  <div className="text-right">
                    <p className="font-bold text-lg text-red-600">RM {refund.netRefund.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Net Refund</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{refund.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Request Date</p>
                      <p className="font-medium">{refund.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium text-xs">{refund.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Financial Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Original</span>
                      <span className="font-medium">RM {refund.originalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Refund</span>
                      <span className="font-medium">RM {refund.refundAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing Fee</span>
                      <span className="font-medium">RM {refund.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Net Refund</span>
                      <span className="font-bold text-red-600">RM {refund.netRefund.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Impact Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Financial Impact</p>
                      <p className="font-medium">RM {refund.impactAnalysis.financialImpact.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Operational Impact</p>
                      <p className="font-medium text-xs">{refund.impactAnalysis.operationalImpact}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Customer Satisfaction</p>
                      <p className="font-medium text-xs text-green-600">{refund.impactAnalysis.customerSatisfactionImpact}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prevention Insights</h4>
                  <div className="space-y-1">
                    {refund.preventionRecommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="bg-orange-50 p-2 rounded text-xs">
                        <p className="text-orange-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                  {refund.approvedBy && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-xs">Approved By</p>
                      <p className="font-medium text-xs">{refund.approvedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  View Order
                </Button>
                {refund.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleProcessRefund(refund)}>
                      <Brain className="h-3 w-3 mr-1" />
                      AI Process
                    </Button>
                  </>
                )}
                {refund.status === 'approved' && (
                  <Button size="sm">
                    Process Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RefundManagement;
