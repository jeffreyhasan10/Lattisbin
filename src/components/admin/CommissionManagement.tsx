
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, TrendingUp, Users, Award, Calendar, CheckCircle, Clock, AlertTriangle, Target, Zap } from "lucide-react";
import CommissionEngine from "@/utils/commissionEngine";

interface CommissionPayment {
  id: string;
  recipientName: string;
  recipientType: "Driver" | "Referrer" | "Partner";
  period: string;
  salesAmount: number;
  kpiScores: {
    deliveryTime: number;
    customerSatisfaction: number;
    safetyScore: number;
    fuelEfficiency: number;
    attendanceRate: number;
  };
  referralCount: number;
  tierId: string;
  calculation: any;
  status: "pending" | "approved" | "paid" | "disputed";
  paymentDate: string | null;
  disputeReason?: string;
}

const CommissionManagement: React.FC = () => {
  const [commissionTiers, setCommissionTiers] = useState(CommissionEngine.getTiers());
  const [payments, setPayments] = useState<CommissionPayment[]>([
    {
      id: "PAY001",
      recipientName: "Ahmad Rahman",
      recipientType: "Driver",
      period: "March 2024",
      salesAmount: 45000,
      kpiScores: {
        deliveryTime: 85,
        customerSatisfaction: 92,
        safetyScore: 88,
        fuelEfficiency: 78,
        attendanceRate: 95
      },
      referralCount: 3,
      tierId: "SILVER",
      calculation: CommissionEngine.calculateCommission(45000, {
        deliveryTime: 85,
        customerSatisfaction: 92,
        safetyScore: 88,
        fuelEfficiency: 78,
        attendanceRate: 95
      }, 3, "SILVER"),
      status: "approved",
      paymentDate: "2024-03-31"
    },
    {
      id: "PAY002",
      recipientName: "Sarah Lim",
      recipientType: "Referrer",
      period: "March 2024",
      salesAmount: 12000,
      kpiScores: {
        deliveryTime: 90,
        customerSatisfaction: 88,
        safetyScore: 85,
        fuelEfficiency: 82,
        attendanceRate: 90
      },
      referralCount: 8,
      tierId: "BRONZE",
      calculation: CommissionEngine.calculateCommission(12000, {
        deliveryTime: 90,
        customerSatisfaction: 88,
        safetyScore: 85,
        fuelEfficiency: 82,
        attendanceRate: 90
      }, 8, "BRONZE"),
      status: "pending",
      paymentDate: null
    }
  ]);

  const [showTierModal, setShowTierModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<CommissionPayment | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "disputed":
        return <Badge className="bg-red-100 text-red-800">Disputed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTierBadge = (tierId: string) => {
    const colors = {
      BRONZE: "bg-amber-100 text-amber-800",
      SILVER: "bg-gray-100 text-gray-800", 
      GOLD: "bg-yellow-100 text-yellow-800",
      PLATINUM: "bg-purple-100 text-purple-800"
    };
    return <Badge className={colors[tierId as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{tierId}</Badge>;
  };

  const handleProcessPayment = (payment: CommissionPayment) => {
    const updatedPayments = payments.map(p => 
      p.id === payment.id 
        ? { ...p, status: "paid" as const, paymentDate: new Date().toISOString().split('T')[0] }
        : p
    );
    setPayments(updatedPayments);
    setShowPaymentModal(false);
  };

  const handleDispute = (paymentId: string, reason: string) => {
    const updatedPayments = payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: "disputed" as const, disputeReason: reason }
        : p
    );
    setPayments(updatedPayments);
    setShowDisputeModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Phase 10: Commission & Financial Management
          </h2>
          <p className="text-gray-600 mt-1">Multi-tier structures with KPI integration and automated processing</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showTierModal} onOpenChange={setShowTierModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Manage Tiers
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Commission Tier Management</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                {commissionTiers.map((tier) => (
                  <Card key={tier.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{tier.name}</h4>
                        {getTierBadge(tier.id)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Target Range</span>
                          <span>RM {tier.minTarget.toLocaleString()} - {tier.maxTarget ? tier.maxTarget.toLocaleString() : '∞'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Base Rate</span>
                          <span className="font-medium text-green-600">{tier.baseRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bonus Rate</span>
                          <span className="font-medium text-purple-600">{tier.bonusRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">KPI Multiplier</span>
                          <span className="font-medium text-blue-600">{tier.kpiMultiplier}x</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Process Commission Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {payments.filter(p => p.status === 'approved').map((payment) => (
                          <SelectItem key={payment.id} value={payment.id}>
                            {payment.recipientName} ({payment.recipientType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                  <Button onClick={() => selectedPayment && handleProcessPayment(selectedPayment)}>
                    Process Payment
                  </Button>
                </div>
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
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold">RM {payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.calculation.netAmount : 0), 0).toFixed(0)}</p>
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
                <p className="text-2xl font-bold">RM {payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.calculation.netAmount : 0), 0).toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg KPI Score</p>
                <p className="text-2xl font-bold">{Math.round(payments.reduce((sum, p) => sum + p.calculation.kpiScore, 0) / payments.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Top Tier</p>
                <p className="text-lg font-bold">PLATINUM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Payments */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {payment.recipientName}
                      {getTierBadge(payment.tierId)}
                      <Badge variant="outline" className="text-xs">
                        {payment.recipientType}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{payment.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(payment.status)}
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">RM {payment.calculation.netAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Gross: RM {payment.calculation.totalGross.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>KPI Score</span>
                        <span className="font-medium">{payment.calculation.kpiScore.toFixed(1)}/100</span>
                      </div>
                      <Progress value={payment.calculation.kpiScore} className="h-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sales Achievement</p>
                      <p className="font-medium">RM {payment.salesAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Referrals</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {payment.referralCount}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Commission Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base Commission</span>
                      <span className="font-medium">RM {payment.calculation.baseCommission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Performance Bonus</span>
                      <span className="font-medium text-purple-600">RM {payment.calculation.performanceBonus.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Referral Bonus</span>
                      <span className="font-medium text-blue-600">RM {payment.calculation.referralBonus.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Gross</span>
                      <span className="font-bold">RM {payment.calculation.totalGross.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">KPI Breakdown</h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(payment.kpiScores).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax Deduction</span>
                      <span className="font-medium text-red-600">RM {payment.calculation.taxDeduction.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Net Amount</span>
                      <span className="font-bold text-green-600">RM {payment.calculation.netAmount.toFixed(2)}</span>
                    </div>
                    {payment.paymentDate && (
                      <div>
                        <p className="text-gray-500">Paid On</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {payment.paymentDate}
                        </p>
                      </div>
                    )}
                    {payment.disputeReason && (
                      <div className="bg-red-50 p-2 rounded">
                        <p className="text-red-800 text-xs font-medium">Dispute: {payment.disputeReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {payment.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => {
                      setSelectedPayment(payment);
                      handleProcessPayment(payment);
                    }}>
                      Approve & Pay
                    </Button>
                  </>
                )}
                {payment.status === 'approved' && (
                  <Button size="sm" onClick={() => handleProcessPayment(payment)}>
                    <Zap className="h-3 w-3 mr-1" />
                    Process Payment
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedPayment(payment);
                    setShowDisputeModal(true);
                  }}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Dispute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dispute Modal */}
      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Commission Dispute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Dispute Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calculation_error">Calculation Error</SelectItem>
                  <SelectItem value="kpi_dispute">KPI Score Dispute</SelectItem>
                  <SelectItem value="sales_amount">Sales Amount Discrepancy</SelectItem>
                  <SelectItem value="tier_assignment">Tier Assignment Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Detailed description of the dispute..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDisputeModal(false)}>Cancel</Button>
              <Button onClick={() => selectedPayment && handleDispute(selectedPayment.id, "calculation_error")}>
                Submit Dispute
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommissionManagement;
