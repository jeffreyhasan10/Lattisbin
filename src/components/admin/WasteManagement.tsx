
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus, Camera, Scale, Shield, AlertTriangle, Recycle, Building, Home, Factory } from "lucide-react";

const WasteManagement: React.FC = () => {
  const [wasteCategories, setWasteCategories] = useState([
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
      color: "bg-orange-500"
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
      color: "bg-green-500"
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
      color: "bg-blue-500"
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
      color: "bg-red-500"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            Waste Category Management
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive classification with photo documentation and compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Log Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log Waste Collection</DialogTitle>
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
                  <Input placeholder="Complete address" />
                </div>
                <div className="space-y-2">
                  <Label>Photo Documentation (Min. 3 photos required)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Special Notes</Label>
                  <Textarea placeholder="Any special handling requirements or observations" />
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
                <DialogTitle>Add New Waste Category</DialogTitle>
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
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Detailed description of waste category" />
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

      {/* Waste Management Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">High Risk Items</p>
                <p className="text-2xl font-bold">{wasteCategories.filter(c => c.riskLevel === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue (RM)</p>
                <p className="text-2xl font-bold">{(wasteCategories.reduce((sum, c) => sum + c.revenueGenerated, 0) / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category List */}
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
                {getRiskBadge(category.riskLevel)}
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
                  <p className="text-gray-500">Price per KG</p>
                  <p className="font-medium">RM {category.pricePerKg.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Collections</p>
                  <p className="font-medium">{category.totalCollections}</p>
                </div>
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <p className="font-medium text-green-600">RM {category.revenueGenerated.toLocaleString()}</p>
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
                <Button size="sm" variant="outline" className="flex-1">
                  <Camera className="h-3 w-3 mr-1" />
                  Log Collection
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View History
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
