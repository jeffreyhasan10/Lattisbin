
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Plus, AlertTriangle, CheckCircle, Clock, DollarSign, FileText } from "lucide-react";

const RefundManagement: React.FC = () => {
  const [refunds, setRefunds] = useState([
    {
      id: "REF001",
      orderNumber: "ORD001",
      customerName: "ABC Construction Sdn Bhd",
      requestDate: "2024-03-10",
      reason: "service_not_provided",
      description: "Driver unable to access location due to road closure",
      originalAmount: 850.00,
      refundAmount: 850.00,
      processingFee: 25.00,
      netRefund: 825.00,
      status: "approved",
      approvedBy: "Admin User",
      processedDate: "2024-03-12",
      refundMethod: "bank_transfer",
      impactAnalysis: {
        operationalCost: 120.00,
        driverCompensation: 50.00,
        customerSatisfaction: "maintained"
      }
    },
    {
      id: "REF002",
      orderNumber: "ORD002",
      customerName: "Sarah Lim",
      requestDate: "2024-03-15",
      reason: "customer_cancellation",
      description: "Customer changed mind, cancelled within 24 hours",
      originalAmount: 320.00,
      refundAmount: 288.00,
      processingFee: 32.00,
      netRefund: 288.00,
      status: "pending",
      approvedBy: null,
      processedDate: null,
      refundMethod: "original_payment",
      impactAnalysis: {
        operationalCost: 0.00,
        driverCompensation: 0.00,
        customerSatisfaction: "positive"
      }
    }
  ]);

  const [policies] = useState([
    {
      id: "POL001",
      category: "Service Not Provided",
      refundPercentage: 100,
      processingFee: 25.00,
      timeLimit: 30,
      autoApprove: false
    },
    {
      id: "POL002", 
      category: "Early Cancellation",
      refundPercentage: 90,
      processingFee: 0.00,
      timeLimit: 24,
      autoApprove: true
    },
    {
      id: "POL003",
      category: "Service Quality Issue",
      refundPercentage: 50,
      processingFee: 0.00,
      timeLimit: 7,
      autoApprove: false
    }
  ]);

  const [showRefundModal, setShowRefundModal] = useState(false);

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
      case "disputed":
        return <Badge className="bg-purple-100 text-purple-800">Disputed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            Refund & Cancellation Management
          </h2>
          <p className="text-gray-600 mt-1">Policy implementation with automated processing and dispute resolution</p>
        </div>
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
                <Label>Refund Reason</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_not_provided">Service Not Provided</SelectItem>
                    <SelectItem value="customer_cancellation">Customer Cancellation</SelectItem>
                    <SelectItem value="service_quality">Service Quality Issue</SelectItem>
                    <SelectItem value="billing_error">Billing Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Original Amount (RM)</Label>
                <Input type="number" placeholder="850.00" />
              </div>
              <div className="space-y-2">
                <Label>Refund Amount (RM)</Label>
                <Input type="number" placeholder="850.00" />
              </div>
              <div className="space-y-2">
                <Label>Processing Fee (RM)</Label>
                <Input type="number" placeholder="25.00" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the refund reason" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRefundModal(false)}>Cancel</Button>
              <Button onClick={() => setShowRefundModal(false)}>Process Refund</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Refund Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{refunds.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold">{refunds.filter(r => r.status === 'processed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refund Requests */}
      <div className="space-y-4">
        {refunds.map((refund) => (
          <Card key={refund.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Refund #{refund.id}
                      <Badge variant="outline" className="text-xs">
                        {refund.orderNumber}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{refund.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(refund.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Request Date</p>
                      <p className="font-medium">{refund.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Reason</p>
                      <p className="font-medium capitalize">{refund.reason.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium">{refund.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Financial Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Original Amount</span>
                      <span className="font-medium">RM {refund.originalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Refund Amount</span>
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
                    <div className="flex justify-between">
                      <span className="text-gray-500">Operational Cost</span>
                      <span className="font-medium">RM {refund.impactAnalysis.operationalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Driver Compensation</span>
                      <span className="font-medium">RM {refund.impactAnalysis.driverCompensation.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer Satisfaction</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {refund.impactAnalysis.customerSatisfaction}
                      </Badge>
                    </div>
                    {refund.approvedBy && (
                      <div>
                        <p className="text-gray-500">Approved By</p>
                        <p className="font-medium">{refund.approvedBy}</p>
                      </div>
                    )}
                  </div>
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
                    <Button size="sm">
                      Approve
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
