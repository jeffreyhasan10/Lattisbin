import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Truck, 
  User,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye
} from "lucide-react";

interface WasteCollectionRecord {
  binSN: string;
  customerName: string;
  collectionDate: string;
  wasteType: string;
  weight: number;
  collectedBy: string;
  lorryNumber: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
}

const WasteCollection = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecord, setNewRecord] = useState<Partial<WasteCollectionRecord>>({
    binSN: "",
    customerName: "",
    collectionDate: "",
    wasteType: "",
    weight: 0,
    collectedBy: "",
    lorryNumber: ""
  });

  // Mock data for waste collection records
  const wasteRecords: WasteCollectionRecord[] = [
    {
      binSN: "ASR001",
      customerName: "ABC Construction Sdn Bhd",
      collectionDate: "2024-01-15",
      wasteType: "Construction Debris",
      weight: 2.5,
      collectedBy: "Ahmad Rahman",
      lorryNumber: "WLT1234",
      status: "completed"
    },
    {
      binSN: "LASR002", 
      customerName: "XYZ Development",
      collectionDate: "2024-01-14",
      wasteType: "Mixed Waste",
      weight: 1.8,
      collectedBy: "Lim Wei Ming",
      lorryNumber: "WLT5678",
      status: "completed"
    }
  ];

  // Mock data for drivers
  const drivers: Driver[] = [
    { id: "1", name: "Ahmad Rahman", licenseNumber: "DL001", phone: "012-3456789" },
    { id: "2", name: "Lim Wei Ming", licenseNumber: "DL002", phone: "017-8901234" }
  ];

  const handleInputChange = (field: keyof WasteCollectionRecord, value: string | number) => {
    setNewRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New waste collection record:", newRecord);
    // Reset form
    setNewRecord({
      binSN: "",
      customerName: "",
      collectionDate: "",
      wasteType: "",
      weight: 0,
      collectedBy: "",
      lorryNumber: ""
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Waste Collection Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage waste collection operations</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Collection Records</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Collections</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Trash2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          {/* Collection Records Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Collection Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="binSN">Bin Serial Number</Label>
                  <Input
                    id="binSN"
                    value={newRecord.binSN}
                    onChange={(e) => handleInputChange('binSN', e.target.value)}
                    placeholder="Enter bin serial number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newRecord.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionDate">Collection Date</Label>
                  <Input
                    id="collectionDate"
                    type="date"
                    value={newRecord.collectionDate}
                    onChange={(e) => handleInputChange('collectionDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type</Label>
                  <Select value={newRecord.wasteType} onValueChange={(value) => handleInputChange('wasteType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction Debris</SelectItem>
                      <SelectItem value="mixed">Mixed Waste</SelectItem>
                      <SelectItem value="recyclable">Recyclable Materials</SelectItem>
                      <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (tons)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newRecord.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder="Enter weight"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectedBy">Collected By</Label>
                  <Select value={newRecord.collectedBy} onValueChange={(value) => handleInputChange('collectedBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.name}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lorryNumber">Lorry Number</Label>
                  <Input
                    id="lorryNumber"
                    value={newRecord.lorryNumber}
                    onChange={(e) => handleInputChange('lorryNumber', e.target.value)}
                    placeholder="Enter lorry number"
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Collection Record
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Collection Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Bin S/N</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Waste Type</th>
                      <th className="text-left p-4">Weight</th>
                      <th className="text-left p-4">Driver</th>
                      <th className="text-left p-4">Lorry</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteRecords.map((record, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{record.binSN}</td>
                        <td className="p-4">{record.customerName}</td>
                        <td className="p-4">{record.collectionDate}</td>
                        <td className="p-4">{record.wasteType}</td>
                        <td className="p-4">{record.weight} tons</td>
                        <td className="p-4">{record.collectedBy}</td>
                        <td className="p-4">{record.lorryNumber}</td>
                        <td className="p-4">
                          <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Collection Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Schedule management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasteCollection;
