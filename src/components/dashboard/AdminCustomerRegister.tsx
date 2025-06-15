
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Phone, Mail, MapPin, CreditCard } from "lucide-react";

const AdminCustomerRegister: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-green-600" />
            Customer Register
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive customer database with verification and contact management</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Sunshine Apartments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span>ROC: 202345678901</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>+60 19-876 5432</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>contact@sunshine-apt.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>Petaling Jaya, Selangor</span>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-4">
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomerRegister;
