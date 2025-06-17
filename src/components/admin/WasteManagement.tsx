
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Camera, Scale, FileText, AlertTriangle, CheckCircle, TrendingUp, Recycle, Factory, Leaf, ClipboardCheck } from "lucide-react";

interface WasteCategory {
  id: string;
  name: string;
  type: "recyclable" | "hazardous" | "organic" | "general";
  color: string;
  description: string;
  pricePerKg: number;
  environmentalImpact: "low" | "medium" | "high";
  specialHandling: boolean;
  regulations: string[];
}

interface WasteCollection {
  id: string;
  categoryId: string;
  categoryName: string;
  collectionDate: string;
  estimatedWeight: number;
  actualWeight: number;
  photos: string[];
  location: string;
  driverName: string;
  complianceStatus: "compliant" | "pending" | "violation";
  notes: string;
  variance: number;
  variancePercent: number;
}

const WasteManagement: React.FC = () => {
  const [categories, setCategories] = useState<WasteCategory[]>([
    {
      id: "CAT001",
      name: "Construction Debris",
      type: "general",
      color: "bg-gray-100 text-gray-800",
      description: "Concrete, bricks, tiles, and construction materials",
      pricePerKg: 0.15,
      environmentalImpact: "medium",
      specialHandling: false,
      regulations: ["Building Waste Regulation 2020", "Environmental Quality Act"]
    },
    {
      id: "CAT002",
      name: "Electronic Waste",
      type: "hazardous",
      color: "bg-red-100 text-red-800",
      description: "Old electronics, batteries, circuit boards",
      pricePerKg: 0.80,
      environmentalImpact: "high",
      specialHandling: true,
      regulations: ["E-Waste Management Guidelines", "Hazardous Waste Regulation"]
    },
    {
      id: "CAT003",
      name: "Recyclable Materials",
      type: "recyclable",
      color: "bg-green-100 text-green-800",
      description: "Paper, cardboard, plastic, glass, metals",
      pricePerKg: 0.25,
      environmentalImpact: "low",
      specialHandling: false,
      regulations: ["Recycling Standards 2023"]
    },
    {
      id: "CAT004",
      name: "Organic Waste",
      type: "organic",
      color: "bg-orange-100 text-orange-800",
      description: "Food waste, garden trimmings, biodegradable materials",
      pricePerKg: 0.10,
      environmentalImpact: "low",
      specialHandling: false,
      regulations: ["Organic Waste Composting Guidelines"]
    }
  ]);

  const [collections, setCollections] = useState<WasteCollection[]>([
    {
      id: "COL001",
      categoryId: "CAT001",
      categoryName: "Construction Debris",
      collectionDate: "2024-06-15",
      estimatedWeight: 500,
      actualWeight: 485,
      photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
      location: "Jalan Ampang, KL",
      driverName: "Ahmad Rahman",
      complianceStatus: "compliant",
      notes: "Collection completed without issues",
      variance: -15,
      variancePercent: -3.0
    },
    {
      id: "COL002",
      categoryId: "CAT002",
      categoryName: "Electronic Waste",
      collectionDate: "2024-06-14",
      estimatedWeight: 150,
      actualWeight: 180,
      photos: ["photo4.jpg", "photo5.jpg", "photo6.jpg"],
      location: "Shah Alam, Selangor",
      driverName: "Lim Wei Ming",
      complianceStatus: "pending",
      notes: "Awaiting hazardous waste certification",
      variance: 30,
      variancePercent: 20.0
    }
  ]);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recyclable":
        return <Recycle className="h-4 w-4" />;
      case "hazardous":
        return <AlertTriangle className="h-4 w-4" />;
      case "organic":
        return <Leaf className="h-4 w-4" />;
      case "general":
        return <Factory className="h-4 w-4" />;
      default:
        return <Trash2 className="h-4 w-4" />;
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      case "violation":
        return <Badge className="bg-red-100 text-red-800">Violation</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getVarianceBadge = (variance: number) => {
    if (variance > 10) {
      return <Badge className="bg-red-100 text-red-800">High Variance</Badge>;
    } else if (variance > 5) {
      return <Badge className="bg-orange-100 text-orange-800">Medium Variance</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Low Variance</Badge>;
    }
  };

  const getTotalWeightVariance = () => {
    const totalEstimated = collections.reduce((sum, col) => sum + col.estimatedWeight, 0);
    const totalActual = collections.reduce((sum, col) => sum + col.actualWeight, 0);
    return ((totalActual - totalEstimated) / totalEstimated) * 100;
  };

  const getComplianceRate = () => {
    const compliantCount = collections.filter(col => col.complianceStatus === "compliant").length;
    return (compliantCount / collections.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-green-600" />
             Comprehensive Waste Management System
          </h2>
          <p className="text-gray-600 mt-1">Advanced waste classification, photo documentation, and environmental compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showComplianceModal} onOpenChange={setShowComplianceModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Environmental Compliance Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Compliance Rate</h3>
                      <div className="text-2xl font-bold text-green-600">{getComplianceRate().toFixed(1)}%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Pending Reviews</h3>
                      <div className="text-2xl font-bold text-orange-600">
                        {collections.filter(c => c.complianceStatus === "pending").length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Violations</h3>
                      <div className="text-2xl font-bold text-red-600">
                        {collections.filter(c => c.complianceStatus === "violation").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Regulatory Compliance by Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-600">
                            Regulations: {category.regulations.join(", ")}
                          </div>
                        </div>
                        <Badge className={category.color}>
                          {category.specialHandling ? "Special Handling" : "Standard"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Waste Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Waste Category</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input placeholder="e.g., Hazardous Chemicals" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recyclable">Recyclable</SelectItem>
                      <SelectItem value="hazardous">Hazardous</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="general">General Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Detailed description of waste category..." />
                </div>
                <div className="space-y-2">
                  <Label>Price per KG (RM)</Label>
                  <Input type="number" placeholder="0.25" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Environmental Impact</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Impact</SelectItem>
                      <SelectItem value="medium">Medium Impact</SelectItem>
                      <SelectItem value="high">High Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddCategoryModal(false)}>Cancel</Button>
                <Button onClick={() => setShowAddCategoryModal(false)}>Add Category</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Collected (kg)</p>
                <p className="text-2xl font-bold">{collections.reduce((sum, col) => sum + col.actualWeight, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Weight Variance</p>
                <p className="text-2xl font-bold">{getTotalWeightVariance() > 0 ? '+' : ''}{getTotalWeightVariance().toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold">{getComplianceRate().toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waste Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-green-600" />
            Waste Categories & Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(category.type)}
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    <Badge className={category.color} variant="outline">
                      {category.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Price per KG</p>
                      <p className="font-medium">RM {category.pricePerKg.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Environmental Impact</p>
                      <Badge 
                        className={
                          category.environmentalImpact === 'high' ? 'bg-red-100 text-red-800' :
                          category.environmentalImpact === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {category.environmentalImpact}
                      </Badge>
                    </div>
                  </div>
                  {category.specialHandling && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-1 text-sm text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        Requires Special Handling
                      </div>
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Applicable Regulations:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.regulations.map((reg, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Collections with Photo Documentation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              Recent Collections with Documentation
            </CardTitle>
            <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Log New Waste Collection</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Waste Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Collection Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Weight (kg)</Label>
                    <Input type="number" placeholder="500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Actual Weight (kg)</Label>
                    <Input type="number" placeholder="485" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Collection Location</Label>
                    <Input placeholder="Complete address" />
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned Driver</Label>
                    <Input placeholder="Driver name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Compliance Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="violation">Violation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Photo Documentation (Min. 3 Photos Required)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload collection photos</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Choose Files
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Collection Notes</Label>
                    <Textarea placeholder="Any additional notes or observations..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCollectionModal(false)}>Cancel</Button>
                  <Button onClick={() => setShowCollectionModal(false)}>Log Collection</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        {getTypeIcon(categories.find(c => c.id === collection.categoryId)?.type || 'general')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{collection.categoryName}</h3>
                        <p className="text-sm text-gray-600">{collection.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getComplianceStatusBadge(collection.complianceStatus)}
                      {getVarianceBadge(Math.abs(collection.variancePercent))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Collection Date</p>
                      <p className="font-medium">{collection.collectionDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Weight</p>
                      <p className="font-medium">{collection.estimatedWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Actual Weight</p>
                      <p className="font-medium">{collection.actualWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Variance</p>
                      <p className={`font-medium ${collection.variance > 0 ? 'text-orange-600' : collection.variance < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                        {collection.variance > 0 ? '+' : ''}{collection.variance} kg ({collection.variancePercent > 0 ? '+' : ''}{collection.variancePercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {collection.photos.length} photos documented
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Driver: {collection.driverName}</span>
                    </div>
                  </div>

                  {collection.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{collection.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteManagement;
