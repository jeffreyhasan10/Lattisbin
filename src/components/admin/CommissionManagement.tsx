
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DollarSign, Plus, TrendingUp, Users, Award, Calendar, CheckCircle, Clock } from "lucide-react";

const CommissionManagement: React.FC = () => {
  const [commissionStructures, setCommissionStructures] = useState([
    {
      id: "TIER1",
      name: "Standard Sales Commission",
      type: "sales",
      tier: 1,
      minTarget: 0,
      maxTarget: 50000,
      commissionRate: 5.0,
      bonusThreshold: 25000,
      bonusRate: 2.0,
      activeMembers: 15,
      totalEarnings: 12450
    },
    {
      id: "TIER2",
      name: "Premium Sales Commission",
      type: "sales",
      tier: 2,
      minTarget: 50000,
      maxTarget: 100000,
      commissionRate: 7.5,
      bonusThreshold: 75000,
      bonusRate: 3.0,
      activeMembers: 8,
      totalEarnings: 28750
    },
    {
      id: "REF1",
      name: "Customer Referral Program",
      type: "referral",
      tier: 1,
      minTarget: 0,
      maxTarget: null,
      commissionRate: 15.0,
      bonusThreshold: 10,
      bonusRate: 5.0,
      activeMembers: 25,
      totalEarnings: 8900
    }
  ]);

  const [payments, setPayments] = useState([
    {
      id: "PAY001",
      recipientName: "Ahmad Rahman",
      recipientType: "Driver",
      period: "March 2024",
      structureId: "TIER1",
      baseCommission: 1250.00,
      bonusAmount: 375.00,
      totalAmount: 1625.00,
      taxDeduction: 162.50,
      netAmount: 1462.50,
      status: "paid",
      paymentDate: "2024-03-31",
      targetAchievement: 28500
    },
    {
      id: "PAY002",
      recipientName: "Sarah Lim",
      recipientType: "Referrer",
      period: "March 2024",
      structureId: "REF1",
      baseCommission: 450.00,
      bonusAmount: 100.00,
      totalAmount: 550.00,
      taxDeduction: 55.00,
      netAmount: 495.00,
      status: "pending",
      paymentDate: null,
      targetAchievement: 12
    }
  ]);

  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "disputed":
        return <Badge className="bg-red-100 text-red-800">Disputed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Commission Management
          </h2>
          <p className="text-gray-600 mt-1">Multi-tier structures with performance tracking and automated payments</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Process Commission Payment</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Recipient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver1">Ahmad Rahman (Driver)</SelectItem>
                      <SelectItem value="referrer1">Sarah Lim (Referrer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Commission Structure</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {commissionStructures.map((structure) => (
                        <SelectItem key={structure.id} value={structure.id}>
                          {structure.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Base Commission (RM)</Label>
                  <Input type="number" placeholder="1250.00" />
                </div>
                <div className="space-y-2">
                  <Label>Bonus Amount (RM)</Label>
                  <Input type="number" placeholder="375.00" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                <Button onClick={() => setShowPaymentModal(false)}>Process Payment</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showStructureModal} onOpenChange={setShowStructureModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Structure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Commission Structure</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Structure Name</Label>
                  <Input placeholder="e.g., Premium Driver Commission" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Commission</SelectItem>
                      <SelectItem value="referral">Referral Commission</SelectItem>
                      <SelectItem value="performance">Performance Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input type="number" placeholder="5.0" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Target (RM)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Target (RM)</Label>
                  <Input type="number" placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <Label>Bonus Threshold</Label>
                  <Input type="number" placeholder="25000" />
                </div>
                <div className="space-y-2">
                  <Label>Bonus Rate (%)</Label>
                  <Input type="number" placeholder="2.0" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowStructureModal(false)}>Cancel</Button>
                <Button onClick={() => setShowStructureModal(false)}>Create Structure</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold">RM {payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.totalAmount : 0), 0).toLocaleString()}</p>
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
                <p className="text-2xl font-bold">RM {payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.totalAmount : 0), 0).toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{commissionStructures.reduce((sum, s) => sum + s.activeMembers, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Structures</p>
                <p className="text-2xl font-bold">{commissionStructures.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Structures */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {commissionStructures.map((structure) => (
              <Card key={structure.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{structure.name}</CardTitle>
                    <Badge variant="outline">{structure.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Commission Rate</p>
                      <p className="font-bold text-green-600">{structure.commissionRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bonus Rate</p>
                      <p className="font-bold text-purple-600">{structure.bonusRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Target Range</p>
                      <p className="font-medium">RM {structure.minTarget.toLocaleString()} - {structure.maxTarget ? structure.maxTarget.toLocaleString() : '∞'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bonus Threshold</p>
                      <p className="font-medium">RM {structure.bonusThreshold.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Active Members</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {structure.activeMembers}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Earnings</p>
                      <p className="font-medium text-green-600">RM {structure.totalEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit Structure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commission Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{payment.recipientName}</h4>
                    <p className="text-sm text-gray-600">{payment.recipientType} • {payment.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-bold">RM {payment.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Net: RM {payment.netAmount.toFixed(2)}</p>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionManagement;
