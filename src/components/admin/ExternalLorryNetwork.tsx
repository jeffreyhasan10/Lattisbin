import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, Star, Truck, Calendar, DollarSign, Phone, User, Clock, TrendingUp, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface SLAMetric {
  responseTime: number; // hours
  completionRate: number; // percentage
  onTimeDelivery: number; // percentage
  customerSatisfaction: number; // rating out of 5
  lastUpdated: string;
}

interface PricingRule {
  timeSlot: "peak" | "off-peak" | "weekend";
  demandMultiplier: number;
  seasonalAdjustment: number;
  urgencyPremium: number;
}

interface Vendor {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  totalJobs: number;
  completionRate: number;
  averagePrice: number;
  availability: "available" | "busy" | "unavailable";
  lorries: Array<{
    id: string;
    model: string;
    tonnage: string;
    status: "available" | "booked" | "maintenance";
    rate: number;
    dynamicPrice: number;
  }>;
  specializations: string[];
  insuranceValid: boolean;
  lastUpdated: string;
  slaMetrics: SLAMetric;
  pricingRules: PricingRule[];
  performanceHistory: Array<{
    date: string;
    jobsCompleted: number;
    avgResponseTime: number;
    satisfaction: number;
  }>;
  contractTerms: {
    paymentTerms: string;
    cancellationPolicy: string;
    penaltyClause: string;
  };
}

const ExternalLorryNetwork: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "VENDOR001",
      name: "KL Transport Services",
      contact: "Ahmad Rahman",
      phone: "+60123456789",
      email: "ahmad@kltransport.com",
      address: "Jalan Sultan, Kuala Lumpur",
      rating: 4.8,
      totalJobs: 156,
      completionRate: 98.5,
      averagePrice: 350,
      availability: "available",
      lorries: [
        { id: "EXT001", model: "Isuzu NPR", tonnage: "3.5T", status: "available", rate: 300, dynamicPrice: 330 },
        { id: "EXT002", model: "Mitsubishi Canter", tonnage: "5T", status: "booked", rate: 400, dynamicPrice: 420 }
      ],
      specializations: ["Construction Waste", "Household Items"],
      insuranceValid: true,
      lastUpdated: "2024-01-15",
      slaMetrics: {
        responseTime: 2.5,
        completionRate: 98.5,
        onTimeDelivery: 96.8,
        customerSatisfaction: 4.8,
        lastUpdated: "2024-06-15"
      },
      pricingRules: [
        { timeSlot: "peak", demandMultiplier: 1.3, seasonalAdjustment: 1.1, urgencyPremium: 1.2 },
        { timeSlot: "off-peak", demandMultiplier: 0.9, seasonalAdjustment: 1.0, urgencyPremium: 1.0 },
        { timeSlot: "weekend", demandMultiplier: 1.5, seasonalAdjustment: 1.0, urgencyPremium: 1.3 }
      ],
      performanceHistory: [
        { date: "2024-06-01", jobsCompleted: 25, avgResponseTime: 2.1, satisfaction: 4.9 },
        { date: "2024-05-01", jobsCompleted: 28, avgResponseTime: 2.3, satisfaction: 4.7 },
        { date: "2024-04-01", jobsCompleted: 22, avgResponseTime: 2.8, satisfaction: 4.6 }
      ],
      contractTerms: {
        paymentTerms: "Net 30 days",
        cancellationPolicy: "24 hours notice required",
        penaltyClause: "5% penalty for delays > 2 hours"
      }
    },
    {
      id: "VENDOR002",
      name: "Selangor Heavy Haulage",
      contact: "Lim Wei Ming",
      phone: "+60198765432",
      email: "lim@selangortruck.com",
      address: "Shah Alam, Selangor",
      rating: 4.5,
      totalJobs: 89,
      completionRate: 95.2,
      averagePrice: 450,
      availability: "busy",
      lorries: [
        { id: "EXT003", model: "Hino 500", tonnage: "10T", status: "available", rate: 600, dynamicPrice: 750 },
        { id: "EXT004", model: "UD Trucks", tonnage: "15T", status: "maintenance", rate: 800, dynamicPrice: 800 }
      ],
      specializations: ["Industrial Waste", "Heavy Machinery"],
      insuranceValid: true,
      lastUpdated: "2024-01-10",
      slaMetrics: {
        responseTime: 3.2,
        completionRate: 95.2,
        onTimeDelivery: 93.1,
        customerSatisfaction: 4.5,
        lastUpdated: "2024-06-15"
      },
      pricingRules: [
        { timeSlot: "peak", demandMultiplier: 1.4, seasonalAdjustment: 1.2, urgencyPremium: 1.3 },
        { timeSlot: "off-peak", demandMultiplier: 0.85, seasonalAdjustment: 1.0, urgencyPremium: 1.0 },
        { timeSlot: "weekend", demandMultiplier: 1.6, seasonalAdjustment: 1.1, urgencyPremium: 1.4 }
      ],
      performanceHistory: [
        { date: "2024-06-01", jobsCompleted: 18, avgResponseTime: 3.1, satisfaction: 4.6 },
        { date: "2024-05-01", jobsCompleted: 20, avgResponseTime: 3.0, satisfaction: 4.4 },
        { date: "2024-04-01", jobsCompleted: 15, avgResponseTime: 3.5, satisfaction: 4.3 }
      ],
      contractTerms: {
        paymentTerms: "Net 15 days",
        cancellationPolicy: "48 hours notice required",
        penaltyClause: "10% penalty for delays > 1 hour"
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const getDynamicPrice = (baseRate: number, vendor: Vendor, timeSlot: "peak" | "off-peak" | "weekend" = "peak") => {
    const rule = vendor.pricingRules.find(r => r.timeSlot === timeSlot) || vendor.pricingRules[0];
    return Math.round(baseRate * rule.demandMultiplier * rule.seasonalAdjustment * rule.urgencyPremium);
  };

  const getSLAStatusBadge = (metric: SLAMetric) => {
    const overallScore = (metric.completionRate + metric.onTimeDelivery + (metric.customerSatisfaction * 20)) / 3;
    if (overallScore >= 95) return <Badge className="bg-green-100 text-green-800">Excellent SLA</Badge>;
    if (overallScore >= 85) return <Badge className="bg-blue-100 text-blue-800">Good SLA</Badge>;
    if (overallScore >= 75) return <Badge className="bg-orange-100 text-orange-800">Fair SLA</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor SLA</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "busy":
        return <Badge className="bg-orange-100 text-orange-800">Busy</Badge>;
      case "unavailable":
        return <Badge className="bg-red-100 text-red-800">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
              Lorry Network & Vendor Management
          </h2>
          <p className="text-gray-600 mt-1">Advanced third-party rental management with dynamic pricing, SLA monitoring, and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSchedulingModal} onOpenChange={setShowSchedulingModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Advanced Scheduling with Conflict Resolution</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <Label>Select Vendor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.filter(v => v.availability === 'available').map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name} (Rating: {vendor.rating})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" />
                  </div>
                  <div>
                    <Label>Duration (hours)</Label>
                    <Input type="number" placeholder="8" />
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent (+20% premium)</SelectItem>
                        <SelectItem value="emergency">Emergency (+50% premium)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Dynamic Pricing Preview</h4>
                    <div className="text-sm space-y-1">
                      <div>Base Rate: RM 400</div>
                      <div>Peak Hour Multiplier: +30%</div>
                      <div>Seasonal Adjustment: +10%</div>
                      <div>Urgency Premium: +20%</div>
                      <div className="font-bold border-t pt-1">Total: RM 624</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Availability Check</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        3 vendors available
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Peak demand period
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSchedulingModal(false)}>Cancel</Button>
                <Button onClick={() => setShowSchedulingModal(false)}>Confirm Booking</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor with SLA Terms
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vendor with SLA Terms</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="e.g., KL Transport Services" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input placeholder="e.g., Ahmad Rahman" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+60123456789" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="contact@company.com" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Textarea placeholder="Complete business address" />
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction Waste</SelectItem>
                      <SelectItem value="household">Household Items</SelectItem>
                      <SelectItem value="industrial">Industrial Waste</SelectItem>
                      <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Base Rate (RM)</Label>
                  <Input type="number" placeholder="300" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15 days</SelectItem>
                      <SelectItem value="net30">Net 30 days</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>SLA Response Time (hours)</Label>
                  <Input type="number" placeholder="2" step="0.5" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={() => setShowAddModal(false)}>Add Vendor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Network Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available Lorries</p>
                <p className="text-2xl font-bold">{vendors.reduce((sum, v) => sum + v.lorries.filter(l => l.status === 'available').length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. SLA Score</p>
                <p className="text-2xl font-bold">{((vendors.reduce((sum, v) => sum + v.slaMetrics.completionRate, 0) / vendors.length)).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Dynamic Rate Avg</p>
                <p className="text-2xl font-bold">RM {Math.round(vendors.reduce((sum, v) => sum + v.lorries.reduce((s, l) => s + l.dynamicPrice, 0) / v.lorries.length, 0) / vendors.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-2xl font-bold">{(vendors.reduce((sum, v) => sum + v.slaMetrics.responseTime, 0) / vendors.length).toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Vendor List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {vendor.name}
                </CardTitle>
                <div className="flex gap-1">
                  {getAvailabilityBadge(vendor.availability)}
                  {getSLAStatusBadge(vendor.slaMetrics)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getRatingStars(vendor.rating)}
                <span className="text-sm text-gray-600">({vendor.rating}) • {vendor.totalJobs} jobs</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Contact Person</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {vendor.contact}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Response Time</p>
                  <p className="font-medium text-blue-600">{vendor.slaMetrics.responseTime}h avg</p>
                </div>
                <div>
                  <p className="text-gray-500">Completion Rate</p>
                  <p className="font-medium text-green-600">{vendor.completionRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">On-Time Delivery</p>
                  <p className="font-medium text-purple-600">{vendor.slaMetrics.onTimeDelivery}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Available Lorries with Dynamic Pricing</p>
                <div className="space-y-2">
                  {vendor.lorries.map((lorry) => (
                    <div key={lorry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{lorry.model} ({lorry.tonnage})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm line-through text-gray-500">RM {lorry.rate}</div>
                          <div className="text-sm font-bold text-blue-600">RM {lorry.dynamicPrice}</div>
                        </div>
                        <Badge 
                          variant={lorry.status === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {lorry.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Contract Terms</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Payment: {vendor.contractTerms.paymentTerms}</div>
                  <div>Cancellation: {vendor.contractTerms.cancellationPolicy}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setShowDetailModal(true);
                  }}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analytics
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Analytics Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendor Performance Analytics - {selectedVendor?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">SLA Compliance</h3>
                    <div className="text-2xl font-bold text-green-600">{selectedVendor.slaMetrics.completionRate}%</div>
                    <p className="text-sm text-gray-600">Overall completion rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Avg Response</h3>
                    <div className="text-2xl font-bold text-blue-600">{selectedVendor.slaMetrics.responseTime}h</div>
                    <p className="text-sm text-gray-600">Response time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Customer Rating</h3>
                    <div className="text-2xl font-bold text-yellow-600">{selectedVendor.slaMetrics.customerSatisfaction}/5</div>
                    <p className="text-sm text-gray-600">Satisfaction score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">On-Time Rate</h3>
                    <div className="text-2xl font-bold text-purple-600">{selectedVendor.slaMetrics.onTimeDelivery}%</div>
                    <p className="text-sm text-gray-600">Delivery punctuality</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedVendor.performanceHistory.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{record.date}</div>
                          <div className="text-sm text-gray-600">{record.jobsCompleted} jobs completed</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Response: {record.avgResponseTime}h</div>
                          <div className="text-sm">Rating: {record.satisfaction}/5</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dynamic Pricing Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedVendor.pricingRules.map((rule, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium capitalize">{rule.timeSlot}</h4>
                        <div className="text-sm space-y-1 mt-2">
                          <div>Demand: ×{rule.demandMultiplier}</div>
                          <div>Seasonal: ×{rule.seasonalAdjustment}</div>
                          <div>Urgency: ×{rule.urgencyPremium}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExternalLorryNetwork;
