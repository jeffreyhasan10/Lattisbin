import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  MapPin,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  BarChart3,
  ArrowLeft,
  Hash,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

interface BinData {
  serialNumber: string;
  binType: string;
  area: string;
  status: "In Stock" | "Dispatched" | "In Transit" | "Maintenance";
  dispatchDate?: string;
  returnDate?: string;
  customerName?: string;
  utilizationDays: number;
}

const BinReports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [binTypeFilter, setBinTypeFilter] = useState("all");

  // Sample bin data
  const [bins] = useState<BinData[]>([
    {
      serialNumber: "BIN-001",
      binType: "Recycling",
      area: "Kuala Lumpur",
      status: "Dispatched",
      dispatchDate: "2024-03-15",
      customerName: "ABC Construction",
      utilizationDays: 8,
    },
    {
      serialNumber: "BIN-002",
      binType: "Waste",
      area: "Petaling Jaya",
      status: "In Stock",
      utilizationDays: 0,
    },
    {
      serialNumber: "BIN-003",
      binType: "Recycling",
      area: "Shah Alam",
      status: "Dispatched",
      dispatchDate: "2024-03-10",
      customerName: "Green Solutions",
      utilizationDays: 13,
    },
    {
      serialNumber: "BIN-004",
      binType: "Waste",
      area: "Kuala Lumpur",
      status: "In Transit",
      dispatchDate: "2024-03-22",
      returnDate: "2024-03-23",
      customerName: "City Council",
      utilizationDays: 1,
    },
    {
      serialNumber: "BIN-005",
      binType: "Mixed",
      area: "Cyberjaya",
      status: "In Stock",
      utilizationDays: 0,
    },
    {
      serialNumber: "BIN-006",
      binType: "Recycling",
      area: "Petaling Jaya",
      status: "Dispatched",
      dispatchDate: "2024-03-18",
      customerName: "Tech Innovators",
      utilizationDays: 5,
    },
    {
      serialNumber: "BIN-007",
      binType: "Waste",
      area: "Putrajaya",
      status: "Maintenance",
      utilizationDays: 0,
    },
    {
      serialNumber: "BIN-008",
      binType: "Mixed",
      area: "Kuala Lumpur",
      status: "In Stock",
      utilizationDays: 0,
    },
    {
      serialNumber: "BIN-009",
      binType: "Recycling",
      area: "Shah Alam",
      status: "Dispatched",
      dispatchDate: "2024-03-20",
      customerName: "Ministry of Health",
      utilizationDays: 3,
    },
    {
      serialNumber: "BIN-010",
      binType: "Waste",
      area: "Kuala Lumpur",
      status: "In Stock",
      utilizationDays: 0,
    },
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBins = bins.length;
    const inStock = bins.filter((b) => b.status === "In Stock").length;
    const dispatched = bins.filter((b) => b.status === "Dispatched").length;
    const inTransit = bins.filter((b) => b.status === "In Transit").length;
    const inMaintenance = bins.filter((b) => b.status === "Maintenance").length;
    const utilizationRate = ((dispatched + inTransit) / totalBins) * 100;

    // Area distribution
    const areaDistribution = bins.reduce((acc, bin) => {
      if (bin.status === "Dispatched" || bin.status === "In Transit") {
        acc[bin.area] = (acc[bin.area] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Bin type distribution
    const typeDistribution = bins.reduce((acc, bin) => {
      acc[bin.binType] = (acc[bin.binType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBins,
      inStock,
      dispatched,
      inTransit,
      inMaintenance,
      utilizationRate,
      areaDistribution,
      typeDistribution,
    };
  }, [bins]);

  // Filtering logic
  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      const matchesSearch =
        bin.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = areaFilter === "all" || bin.area === areaFilter;
      const matchesStatus = statusFilter === "all" || bin.status === statusFilter;
      const matchesBinType = binTypeFilter === "all" || bin.binType === binTypeFilter;

      return matchesSearch && matchesArea && matchesStatus && matchesBinType;
    });
  }, [bins, searchTerm, areaFilter, statusFilter, binTypeFilter]);

  const handleExport = () => {
    const csvContent = [
      ["Serial Number", "Bin Type", "Area", "Status", "Dispatch Date", "Customer", "Utilization Days"],
      ...filteredBins.map((b) => [
        b.serialNumber,
        b.binType,
        b.area,
        b.status,
        b.dispatchDate || "N/A",
        b.customerName || "N/A",
        b.utilizationDays.toString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bin-report-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Bin report exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-100 text-green-700">In Stock</Badge>;
      case "Dispatched":
        return <Badge className="bg-blue-100 text-blue-700">Dispatched</Badge>;
      case "In Transit":
        return <Badge className="bg-orange-100 text-orange-700">In Transit</Badge>;
      case "Maintenance":
        return <Badge className="bg-red-100 text-red-700">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-8 h-8 text-green-600" />
              Bin Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Bin inventory tracking, dispatch statistics, and asset utilization analysis
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/reports")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports Summary
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Bins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalBins}</p>
                  <p className="text-xs text-blue-100 mt-1">In inventory</p>
                </div>
                <Package className="w-10 h-10 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                In Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.inStock}</p>
                  <p className="text-xs text-green-100 mt-1">Available</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Dispatched
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.dispatched}</p>
                  <p className="text-xs text-purple-100 mt-1">In use</p>
                </div>
                <TrendingDown className="w-10 h-10 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.inTransit}</p>
                  <p className="text-xs text-orange-100 mt-1">Moving</p>
                </div>
                <Activity className="w-10 h-10 text-orange-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">
                Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.utilizationRate.toFixed(0)}%</p>
                  <p className="text-xs text-red-100 mt-1">Rate</p>
                </div>
                <BarChart3 className="w-10 h-10 text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Area-wise Dispatch Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Area-wise Dispatch Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.areaDistribution).map(([area, count]) => (
                <div
                  key={area}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{area}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">Bins dispatched</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search serial, customer, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={binTypeFilter} onValueChange={setBinTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Bin Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.keys(stats.typeDistribution).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {Object.keys(stats.areaDistribution).map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleExport} className="gap-2 bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bin Inventory Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Bin Inventory Details</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredBins.length} of {bins.length} bins
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Serial Number
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Bin Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Area
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Dispatch Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Utilization Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBins.map((bin) => (
                    <tr
                      key={bin.serialNumber}
                      className="border-b border-gray-100 hover:bg-green-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {bin.serialNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{bin.binType}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{bin.area}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(bin.status)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {bin.customerName || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {bin.dispatchDate || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900">
                          {bin.utilizationDays} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BinReports;

