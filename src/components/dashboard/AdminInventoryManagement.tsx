
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, MapPin, Settings, QrCode } from "lucide-react";

const AdminInventoryManagement: React.FC = () => {
  const binSizes = [
    "2ft(H) × 12ft(L) × 6ft(W)",
    "4ft(H) × 12ft(L) × 6ft(W)", 
    "4ft(H) × 14ft(L) × 6ft(W)",
    "5ft(H) × 12ft(L) × 6ft(W)",
    "6ft(H) × 24ft(L) × 8ft(W)",
    "6.5ft(H) × 14.5ft(L) × 6ft(W)"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
            Inventory Management
          </h2>
          <p className="text-gray-600 mt-1">Track bins with GPS, manage maintenance, and monitor utilization</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Bin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                ASR100001
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">Available</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <strong>Size:</strong> 4ft(H) × 12ft(L) × 6ft(W)
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>Warehouse A, KL</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4 text-gray-500" />
              <span>Last Service: 2024-01-10</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1">
                <QrCode className="h-4 w-4 mr-1" />
                QR Code
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Track
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardHeader>
          <CardTitle>Available Bin Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {binSizes.map((size, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm font-medium">
                {size}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventoryManagement;
