import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Phone, MapPin, Calendar, DollarSign, Package, TrendingUp, Clock, CheckCircle, Mail, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";

interface DriverDetails {
  id: string;
  name: string;
  icNumber: string;
  hpNumber: string;
  email?: string;
  address: string;
  totalEarnings: number;
  totalCollections: number;
  currentAssignment: string | null;
  binAllocated: string | null;
  status: string;
  areaOfOperation: string;
  joinDate: string;
}

interface BinCollection {
  id: string;
  date: string;
  time: string;
  binSerialNumber: string;
  binType: string;
  customerName: string;
  location: string;
  status: "Completed" | "In Progress" | "Cancelled";
  earnings: number;
}

interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  collections: number;
  baseAmount: number;
  commission: number;
  bonus: number;
  deductions: number;
  totalPaid: number;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Processing";
}

const DriverDetailsPerformance: React.FC = () => {
  const navigate = useNavigate();
  const { driverId } = useParams<{ driverId: string }>();

  // Mock data - in real app, fetch from API based on driverId
  const [driverDetails] = useState<DriverDetails>({
    id: driverId || "DRV-001",
    name: "Ahmad bin Hassan",
    icNumber: "850123-10-5678",
    hpNumber: "+60123456789",
    email: "ahmad.hassan@lattisbin.com",
    address: "No. 45, Jalan Sentosa, Taman Desa, 58100 Kuala Lumpur",
    totalEarnings: 15750.50,
    totalCollections: 127,
    currentAssignment: "Order #12345",
    binAllocated: "ASR-100",
    status: "On Duty",
    areaOfOperation: "Downtown",
    joinDate: "2023-05-15"
  });

  const [binsCollected] = useState<BinCollection[]>([
    {
      id: "BC-001",
      date: "2025-10-11",
      time: "09:30",
      binSerialNumber: "ASR-100",
      binType: "10 Yard Dumpster",
      customerName: "ABC Construction Sdn Bhd",
      location: "Jalan Bukit Bintang, KL",
      status: "Completed",
      earnings: 150.00
    },
    {
      id: "BC-002",
      date: "2025-10-11",
      time: "11:45",
      binSerialNumber: "LASR-150",
      binType: "20 Yard RORO",
      customerName: "XYZ Manufacturing",
      location: "Industrial Park, Selangor",
      status: "Completed",
      earnings: 220.00
    },
    {
      id: "BC-003",
      date: "2025-10-10",
      time: "14:20",
      binSerialNumber: "PWD-200",
      binType: "6 Yard Regular",
      customerName: "Residential Complex A",
      location: "Taman Desa, KL",
      status: "Completed",
      earnings: 120.00
    },
    {
      id: "BC-004",
      date: "2025-10-10",
      time: "08:15",
      binSerialNumber: "ASR-101",
      binType: "10 Yard Dumpster",
      customerName: "DEF Retail Store",
      location: "Mid Valley, KL",
      status: "Completed",
      earnings: 150.00
    },
    {
      id: "BC-005",
      date: "2025-10-09",
      time: "10:00",
      binSerialNumber: "ASR-100",
      binType: "10 Yard Dumpster",
      customerName: "GHI Hotel",
      location: "KLCC Area",
      status: "Completed",
      earnings: 150.00
    }
  ]);

  const [paymentHistory] = useState<PaymentRecord[]>([
    {
      id: "PAY-001",
      date: "2025-10-01",
      description: "September 2025 Payment",
      collections: 45,
      baseAmount: 5400.00,
      commission: 810.00,
      bonus: 200.00,
      deductions: 50.00,
      totalPaid: 6360.00,
      paymentMethod: "Bank Transfer",
      status: "Paid"
    },
    {
      id: "PAY-002",
      date: "2025-09-01",
      description: "August 2025 Payment",
      collections: 42,
      baseAmount: 5040.00,
      commission: 756.00,
      bonus: 150.00,
      deductions: 30.00,
      totalPaid: 5916.00,
      paymentMethod: "Bank Transfer",
      status: "Paid"
    },
    {
      id: "PAY-003",
      date: "2025-08-01",
      description: "July 2025 Payment",
      collections: 40,
      baseAmount: 4800.00,
      commission: 720.00,
      bonus: 100.00,
      deductions: 20.00,
      totalPaid: 5600.00,
      paymentMethod: "Bank Transfer",
      status: "Paid"
    }
  ]);

  const handleBackToList = () => {
    navigate("/admin/drivers");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Completed": "bg-green-100 text-green-700 border-green-300",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
      "Cancelled": "bg-red-100 text-red-700 border-red-300",
      "Paid": "bg-green-100 text-green-700 border-green-300",
      "Pending": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Processing": "bg-blue-100 text-blue-700 border-blue-300"
    };
    return variants[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(driverDetails.joinDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const avgEarningsPerCollection = driverDetails.totalCollections > 0 
    ? driverDetails.totalEarnings / driverDetails.totalCollections 
    : 0;

  // Get unique bins collected
  const uniqueBins = Array.from(new Set(binsCollected.map(b => b.binSerialNumber)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Driver List
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {driverDetails.name}
          </h1>
          <p className="text-gray-600 mt-1">Driver ID: {driverDetails.id}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-lg px-4 py-2">
            {driverDetails.status}
          </Badge>
          {driverDetails.currentAssignment && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
              {driverDetails.currentAssignment}
            </Badge>
          )}
        </div>
      </div>

      {/* Driver Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-semibold">{driverDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IC Number</p>
                <p className="font-semibold font-mono">{driverDetails.icNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  HP Number
                </p>
                <p className="font-semibold">{driverDetails.hpNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </p>
                <p className="font-semibold text-sm">{driverDetails.email || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Address
                </p>
                <p className="font-semibold">{driverDetails.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Area of Operation</p>
                <p className="font-semibold">{driverDetails.areaOfOperation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Join Date
                </p>
                <p className="font-semibold">{driverDetails.joinDate}</p>
                <p className="text-xs text-gray-500">{daysSinceJoined} days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Assignment</p>
              {driverDetails.currentAssignment ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {driverDetails.currentAssignment}
                </Badge>
              ) : (
                <p className="text-gray-400">No active assignment</p>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Bin Allocated</p>
              {driverDetails.binAllocated ? (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 font-mono">
                  {driverDetails.binAllocated}
                </Badge>
              ) : (
                <p className="text-gray-400">No bin allocated</p>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <Badge className={getStatusBadge(driverDetails.status)}>
                {driverDetails.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                RM {driverDetails.totalEarnings.toFixed(2)}
              </span>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">{driverDetails.totalCollections}</span>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Per Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-indigo-600">
                RM {avgEarningsPerCollection.toFixed(2)}
              </span>
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Bins Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">{uniqueBins.length}</span>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="collections" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="collections">
                <Package className="w-4 h-4 mr-2" />
                Bins Collected
              </TabsTrigger>
              <TabsTrigger value="routes">
                <MapPin className="w-4 h-4 mr-2" />
                Completed Routes
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment History
              </TabsTrigger>
            </TabsList>

            {/* Bins Collected Tab */}
            <TabsContent value="collections" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Bins Collected</h3>
                  <p className="text-sm text-gray-600">
                    Total: {binsCollected.length} collections | Unique Bins: {uniqueBins.join(", ")}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Bin SN</TableHead>
                      <TableHead>Bin Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {binsCollected.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{collection.date}</p>
                              <p className="text-xs text-gray-500">{collection.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {collection.binSerialNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{collection.binType}</TableCell>
                        <TableCell className="text-sm">{collection.customerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {collection.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(collection.status)}>
                            {collection.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-green-600">
                            RM {collection.earnings.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Completed Routes Tab */}
            <TabsContent value="routes" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Completed Routes & Pickups</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Displaying route completion history for {driverDetails.name}
                </p>
              </div>

              <div className="space-y-3">
                {binsCollected.filter(c => c.status === "Completed").map((route) => (
                  <Card key={route.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold">{route.customerName}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {route.date} at {route.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              Bin: {route.binSerialNumber}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {route.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {route.binType}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            RM {route.earnings.toFixed(2)}
                          </p>
                          <Badge className={getStatusBadge(route.status)}>
                            {route.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="payments" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Payment History & Commission Breakdown</h3>
                <p className="text-sm text-gray-600">
                  Complete payment records with commission details
                </p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Collections</TableHead>
                      <TableHead>Base Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Total Paid</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{payment.date}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{payment.description}</TableCell>
                        <TableCell className="font-semibold text-center">
                          {payment.collections}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">RM {payment.baseAmount.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-blue-600">
                            +RM {payment.commission.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-green-600">
                            +RM {payment.bonus.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-red-600">
                            -RM {payment.deductions.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-green-600">
                            RM {payment.totalPaid.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Payment Summary */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Base</p>
                      <p className="text-xl font-bold text-gray-900">
                        RM {paymentHistory.reduce((sum, p) => sum + p.baseAmount, 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Commission</p>
                      <p className="text-xl font-bold text-blue-600">
                        RM {paymentHistory.reduce((sum, p) => sum + p.commission, 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Bonus</p>
                      <p className="text-xl font-bold text-green-600">
                        RM {paymentHistory.reduce((sum, p) => sum + p.bonus, 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Net Paid</p>
                      <p className="text-xl font-bold text-emerald-600">
                        RM {paymentHistory.reduce((sum, p) => sum + p.totalPaid, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Driver List
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/admin/drivers`)}
            >
              Edit Driver Details
            </Button>
            <Button variant="outline" onClick={() => toast.info("Export functionality coming soon")}>
              Export Performance Report
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.info("Payment processing functionality coming soon")}
            >
              Process Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDetailsPerformance;

