
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus, Camera, Scale, Shield, AlertTriangle, Recycle, Building, Home,  Factory, FileText, TrendingUp, Eye, CheckCircle } from "lucide-react";

interface PhotoDocument {
  id: string;
  url: string;
  timestamp: string;
  location: string;
  notes: string;
}

interface WeightVariance {
  estimated: number;
  actual: number;
  variance: number;
  percentageVariance: number;
  reason: string;
}

interface ComplianceRecord {
  certificateId: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired";
  issuingAuthority: string;
}

interface WasteCollection {
  id: string;
  date: string;
  location: string;
  categoryId: string;
  photos: PhotoDocument[];
  weightVariance: WeightVariance;
  complianceChecked: boolean;
  environmentalImpact: {
    carbonFootprint: number;
    recyclingRate: number;
    disposalMethod: string;
  };
}

interface WasteCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  riskLevel: "low" | "medium" | "high";
  requiresPhotos: number;
  averageWeight: number;
  pricePerKg: number;
  specialHandling: boolean;
  environmentalCompliance: string[];
  totalCollections: number;
  revenueGenerated: number;
  color: string;
  complianceRecords: ComplianceRecord[];
  collections: WasteCollection[];
  varianceThreshold: number; // percentage
  regulatoryRequirements: {
    permitRequired: boolean;
    reportingFrequency: "weekly" | "monthly" | "quarterly";
    auditRequired: boolean;
  };
}

const WasteManagement: React.FC = () => {
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([
    {
      id: "WASTE001",
      name: "Construction Debris",
      description: "Concrete, bricks, tiles, steel, wood waste from construction sites",
      icon: Building,
      riskLevel: "medium",
      requiresPhotos: 3,
      averageWeight: 500,
      pricePerKg: 0.15,
      specialHandling: false,
      environmentalCompliance: ["DOE Registration", "Manifest Required"],
      totalCollections: 145,
      revenueGenerated: 45600,
      color: "bg-orange-500",
      varianceThreshold: 15,
      complianceRecords: [
        {
          certificateId: "DOE-2024-001",
          issueDate: "2024-01-01",
          expiryDate: "2024-12-31",
          status: "valid",
          issuingAuthority: "Department of Environment"
        }
      ],
      collections: [
        {
          id: "COL001",
          date: "2024-06-15",
          location: "Jalan Sultan, KL",
          categoryId: "WASTE001",
          photos: [
            { id: "PH001", url: "", timestamp: "2024-06-15 10:00", location: "Site entrance", notes: "Initial waste assessment" },
            { id: "PH002", url: "", timestamp: "2024-06-15 10:15", location: "Loading area", notes: "Concrete debris loaded" },
            { id: "PH003", url: "", timestamp: "2024-06-15 10:30", location: "Truck bed", notes: "Final load verification" }
          ],
          weightVariance: {
            estimated: 500,
            actual: 485,
            variance: -15,
            percentageVariance: -3.0,
            reason: "Accurate estimation"
          },
          complianceChecked: true,
          environmentalImpact: {
            carbonFootprint: 2.5,
            recyclingRate: 85,
            disposalMethod: "Recycling facility"
          }
        }
      ],
      regulatoryRequirements: {
        permitRequired: true,
        reportingFrequency: "monthly",
        auditRequired: false
      }
    },
    {
      id: "WASTE002",
      name: "Household Waste",
      description: "General household items, furniture, appliances, garden waste",
      icon: Home,
      riskLevel: "low",
      requiresPhotos: 2,
      averageWeight: 150,
      pricePerKg: 0.25,
      specialHandling: false,
      environmentalCompliance: ["Basic Sorting Required"],
      totalCollections: 287,
      revenueGenerated: 28950,
      color: "bg-green-500",
      varianceThreshold: 20,
      complianceRecords: [],
      collections: [],
      regulatoryRequirements: {
        permitRequired: false,
        reportingFrequency: "quarterly",
        auditRequired: false
      }
    },
    {
      id: "WASTE003",
      name: "Industrial Scrap",
      description: "Metal scraps, machinery parts, industrial equipment",
      icon: Factory,
      riskLevel: "medium",
      requiresPhotos: 4,
      averageWeight: 800,
      pricePerKg: 0.35,
      specialHandling: true,
      environmentalCompliance: ["DOE License", "Chain of Custody"],
      totalCollections: 89,
      revenueGenerated: 67850,
      color: "bg-blue-500",
      varianceThreshold: 10,
      complianceRecords: [
        {
          certificateId: "DOE-IND-2024-005",
          issueDate: "2024-02-01",
          expiryDate: "2025-01-31",
          status: "valid",
          issuingAuthority: "Department of Environment"
        }
      ],
      collections: [],
      regulatoryRequirements: {
        permitRequired: true,
        reportingFrequency: "monthly",  
        auditRequired: true
      }
    },
    {
      id: "WASTE004",
      name: "Hazardous Waste",
      description: "Chemical containers, batteries, electronic waste, medical waste",
      icon: AlertTriangle,
      riskLevel: "high",
      requiresPhotos: 5,
      averageWeight: 50,
      pricePerKg: 2.50,
      specialHandling: true,
      environmentalCompliance: ["DOE License", "Specialized Transport", "Certified Disposal"],
      totalCollections: 23,
      revenueGenerated: 15750,
      color: "bg-red-500",
      varianceThreshold: 5,
      complianceRecords: [
        {
          certificateId: "DOE-HAZ-2024-010",
          issueDate: "2024-01-15",
          expiryDate: "2024-07-15",
          status: "expiring",
          issuingAuthority: "Department of Environment"
        }
      ],
      collections: [],
      regulatoryRequirements: {
        permitRequired: true,
        reportingFrequency: "weekly",
        auditRequired: true
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | null>(null);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getComplianceStatusBadge = (records: ComplianceRecord[]) => {
    const expiring = records.filter(r => r.status === 'expiring').length;
    const expired = records.filter(r => r.status === 'expired').length;
    
    if (expired > 0) return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
    if (expiring > 0) return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
    return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
  };

  const getVarianceAnalysis = () => {
    const allCollections = wasteCategories.flatMap(cat => cat.collections);
    const totalVariance = allCollections.reduce((sum, col) => sum + Math.abs(col.weightVariance.percentageVariance), 0);
    const avgVariance = allCollections.length > 0 ? totalVariance / allCollections.length : 0;
    const highVarianceCollections = allCollections.filter(col => 
      Math.abs(col.weightVariance.percentageVariance) > 15
    ).length;
    
    return { avgVariance, highVarianceCollections, totalCollections: allCollections.length };
  };

  const varianceStats = getVarianceAnalysis();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            Phase 6: Advanced Waste Category Management
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive classification with photo documentation, weight variance analysis, and environmental compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Weight Variance & Environmental Analytics</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Avg Weight Variance</h3>
                      <div className="text-2xl font-bold text-blue-600">{varianceStats.avgVariance.toFixed(1)}%</div>
                      <p className="text-sm text-gray-600">Estimation accuracy</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">High Variance</h3>
                      <div className="text-2xl font-bold text-orange-600">{varianceStats.highVarianceCollections}</div>
                      <p className="text-sm text-gray-600">Collections >15% variance</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Total Collections</h3>
                      <div className="text-2xl font-bold text-green-600">{varianceStats.totalCollections}</div>
                      <p className="text-sm text-gray-600">Documented collections</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Collection Details with Photo Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {wasteCategories.map(category => 
                      category.collections.map(collection => (
                        <div key={collection.id} className="p-4 border rounded-lg mb-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{category.name}</h4>
                              <p className="text-sm text-gray-600">{collection.date} - {collection.location}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">Est: {collection.weightVariance.estimated}kg</div>
                              <div className="text-sm">Act: {collection.weightVariance.actual}kg</div>
                              <div className={`text-sm font-bold ${Math.abs(collection.weightVariance.percentageVariance) > 10 ? 'text-red-600' : 'text-green-600'}`}>
                                {collection.weightVariance.percentageVariance > 0 ? '+' : ''}{collection.weightVariance.percentageVariance.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-2">Photo Documentation ({collection.photos.length} photos)</p>
                            <div className="grid grid-cols-3 gap-2">
                              {collection.photos.map(photo => (
                                <div key={photo.id} className="p-2 bg-gray-100 rounded text-xs">
                                  <div className="font-medium">{photo.location}</div>
                                  <div className="text-gray-600">{photo.timestamp}</div>
                                  <div className="text-gray-500">{photo.notes}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Carbon Footprint:</span>
                              <div className="font-medium">{collection.environmentalImpact.carbonFootprint} kg CO₂</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Recycling Rate:</span>
                              <div className="font-medium">{collection.environmentalImpact.recyclingRate}%</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Disposal:</span>
                              <div className="font-medium">{collection.environmentalImpact.disposalMethod}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showComplianceModal} onOpenChange={setShowComplianceModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Compliance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Environmental Compliance Dashboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {wasteCategories.map(category => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        {getComplianceStatusBadge(category.complianceRecords)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Regulatory Requirements</h4>
                          <div className="text-sm space-y-1">
                            <div>Permit Required: {category.regulatoryRequirements.permitRequired ? 'Yes' : 'No'}</div>
                            <div>Reporting: {category.regulatoryRequirements.reportingFrequency}</div>
                            <div>Audit Required: {category.regulatoryRequirements.auditRequired ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Active Certificates</h4>
                          {category.complianceRecords.length > 0 ? (
                            <div className="space-y-2">
                              {category.complianceRecords.map((record, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                  <div className="font-medium">{record.certificateId}</div>
                                  <div className="text-gray-600">Expires: {record.expiryDate}</div>
                                  <div className="text-gray-600">Authority: {record.issuingAuthority}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No certificates required</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Log Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Advanced Waste Collection Logging</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Waste Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Weight (kg)</Label>
                    <Input type="number" placeholder="500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Collection Location</Label>
                  <Input placeholder="Complete address with GPS coordinates" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Actual Weight (kg)</Label>
                    <Input type="number" placeholder="Enter after weighing" />
                  </div>
                  <div className="space-y-2">
                    <Label>Variance Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accurate">Accurate Estimation</SelectItem>
                        <SelectItem value="underestimated">Underestimated Volume</SelectItem>
                        <SelectItem value="overestimated">Overestimated Volume</SelectItem>
                        <SelectItem value="moisture">Moisture Content</SelectItem>
                        <SelectItem value="density">Material Density Different</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Photo Documentation (Min. 3 photos required)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Camera className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-600">Before</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Camera className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-600">During</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Camera className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-600">After</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Environmental Impact</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Carbon Footprint (kg CO₂)</Label>
                      <Input type="number" step="0.1" placeholder="2.5" />
                    </div>
                    <div>
                      <Label className="text-xs">Recycling Rate (%)</Label>
                      <Input type="number" placeholder="85" />
                    </div>
                    <div>
                      <Label className="text-xs">Disposal Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recycling">Recycling Facility</SelectItem>
                          <SelectItem value="landfill">Landfill</SelectItem>
                          <SelectItem value="incineration">Incineration</SelectItem>
                          <SelectItem value="treatment">Treatment Plant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Special Notes & Compliance Checks</Label>
                  <Textarea placeholder="Document any special handling requirements, compliance verifications, or observations" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCollectionModal(false)}>Cancel</Button>
                <Button onClick={() => setShowCollectionModal(false)}>Log Collection</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Waste Category with Compliance Settings</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input placeholder="e.g., Electronic Waste" />
                </div>
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Photos Required</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Photos</SelectItem>
                      <SelectItem value="3">3 Photos</SelectItem>  
                      <SelectItem value="4">4 Photos</SelectItem>
                      <SelectItem value="5">5 Photos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price per KG (RM)</Label>
                  <Input type="number" step="0.01" placeholder="0.25" />
                </div>
                <div className="space-y-2">
                  <Label>Weight Variance Threshold (%)</Label>
                  <Input type="number" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label>Reporting Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Detailed description of waste category and handling requirements" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={() => setShowAddModal(false)}>Add Category</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Waste Management Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold">{wasteCategories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Collections</p>
                <p className="text-2xl font-bold">{wasteCategories.reduce((sum, c) => sum + c.totalCollections, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Photo Documents</p>
                <p className="text-2xl font-bold">{wasteCategories.reduce((sum, c) => sum + c.collections.reduce((s, col) => s + col.photos.length, 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Variance</p>
                <p className="text-2xl font-bold">{varianceStats.avgVariance.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-2xl font-bold">{wasteCategories.filter(c => c.complianceRecords.every(r => r.status === 'valid')).length}/{wasteCategories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wasteCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className={`${category.color} p-2 rounded-lg text-white`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  {category.name}
                </CardTitle>
                <div className="flex gap-1">
                  {getRiskBadge(category.riskLevel)}
                  {getComplianceStatusBadge(category.complianceRecords)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{category.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Photos Required</p>
                  <p className="font-medium flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {category.requiresPhotos} minimum
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Variance Threshold</p>
                  <p className="font-medium">±{category.varianceThreshold}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Collections</p>
                  <p className="font-medium">{category.totalCollections}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reporting</p>
                  <p className="font-medium capitalize">{category.regulatoryRequirements.reportingFrequency}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Environmental Compliance</p>
                <div className="flex flex-wrap gap-1">
                  {category.environmentalCompliance.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              {category.specialHandling && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Requires Special Handling</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCollectionModal(true)}
                >
                  <Camera className="h-3 w-3 mr-1" />
                  Log Collection
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowAnalyticsModal(true);
                  }}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analytics
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <FileText className="h-3 w-3 mr-1" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WasteManagement;
