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
  Users,
  MapPin,
  Phone,
  Calendar,
  TrendingUp,
  Download,
  Search,
  Filter,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface CustomerData {
  id: string;
  name: string;
  area: string;
  phone: string;
  totalBookings: number;
  customerType: "Corporate" | "Individual" | "Government";
  joinDate: string;
  lastBooking: string;
  totalSpent: number;
}

const CustomerReports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Sample customer data
  const [customers] = useState<CustomerData[]>([
    {
      id: "C001",
      name: "ABC Construction Sdn Bhd",
      area: "Kuala Lumpur",
      phone: "+60123456789",
      totalBookings: 45,
      customerType: "Corporate",
      joinDate: "2023-01-15",
      lastBooking: "2024-03-20",
      totalSpent: 15600.0,
    },
    {
      id: "C002",
      name: "Sarah Lim",
      area: "Petaling Jaya",
      phone: "+60187654321",
      totalBookings: 12,
      customerType: "Individual",
      joinDate: "2023-06-10",
      lastBooking: "2024-03-18",
      totalSpent: 3240.0,
    },
    {
      id: "C003",
      name: "Ministry of Health",
      area: "Putrajaya",
      phone: "+60388889999",
      totalBookings: 67,
      customerType: "Government",
      joinDate: "2022-11-01",
      lastBooking: "2024-03-22",
      totalSpent: 28900.0,
    },
    {
      id: "C004",
      name: "John Tan",
      area: "Kuala Lumpur",
      phone: "+60196543210",
      totalBookings: 8,
      customerType: "Individual",
      joinDate: "2023-09-20",
      lastBooking: "2024-03-15",
      totalSpent: 1850.0,
    },
    {
      id: "C005",
      name: "Green Solutions Ltd",
      area: "Shah Alam",
      phone: "+60321234567",
      totalBookings: 34,
      customerType: "Corporate",
      joinDate: "2023-03-05",
      lastBooking: "2024-03-21",
      totalSpent: 12400.0,
    },
    {
      id: "C006",
      name: "Mary Wong",
      area: "Petaling Jaya",
      phone: "+60172223333",
      totalBookings: 15,
      customerType: "Individual",
      joinDate: "2023-07-12",
      lastBooking: "2024-03-19",
      totalSpent: 4200.0,
    },
    {
      id: "C007",
      name: "Tech Innovators Sdn Bhd",
      area: "Cyberjaya",
      phone: "+60365554444",
      totalBookings: 28,
      customerType: "Corporate",
      joinDate: "2023-02-18",
      lastBooking: "2024-03-17",
      totalSpent: 9800.0,
    },
    {
      id: "C008",
      name: "City Council",
      area: "Kuala Lumpur",
      phone: "+60388887777",
      totalBookings: 89,
      customerType: "Government",
      joinDate: "2022-08-01",
      lastBooking: "2024-03-23",
      totalSpent: 42500.0,
    },
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalBookings = customers.reduce((sum, c) => sum + c.totalBookings, 0);
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgBookingsPerCustomer = totalBookings / totalCustomers;

    // Area distribution
    const areaDistribution = customers.reduce((acc, customer) => {
      acc[customer.area] = (acc[customer.area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Customer type distribution
    const typeDistribution = customers.reduce((acc, customer) => {
      acc[customer.customerType] = (acc[customer.customerType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCustomers,
      totalBookings,
      totalRevenue,
      avgBookingsPerCustomer,
      areaDistribution,
      typeDistribution,
    };
  }, [customers]);

  // Filtering logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = areaFilter === "all" || customer.area === areaFilter;

      const matchesType =
        customerTypeFilter === "all" || customer.customerType === customerTypeFilter;

      return matchesSearch && matchesArea && matchesType;
    });
  }, [customers, searchTerm, areaFilter, customerTypeFilter]);

  const handleExport = () => {
    const csvContent = [
      ["Customer ID", "Name", "Area", "Phone", "Type", "Total Bookings", "Total Spent (RM)", "Join Date", "Last Booking"],
      ...filteredCustomers.map((c) => [
        c.id,
        c.name,
        c.area,
        c.phone,
        c.customerType,
        c.totalBookings.toString(),
        c.totalSpent.toFixed(2),
        c.joinDate,
        c.lastBooking,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customer-report-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer report exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              Customer Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Customer activity, engagement, and geographical distribution analysis
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                  <p className="text-xs text-blue-100 mt-1">Active customers</p>
                </div>
                <Users className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-xs text-green-100 mt-1">All time bookings</p>
                </div>
                <Calendar className="w-12 h-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    RM {stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-100 mt-1">From customers</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Avg Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {stats.avgBookingsPerCustomer.toFixed(1)}
                  </p>
                  <p className="text-xs text-orange-100 mt-1">Per customer</p>
                </div>
                <BarChart3 className="w-12 h-12 text-orange-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Area Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Customer Distribution by Area
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
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{area}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((count / stats.totalCustomers) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customer, phone, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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

              <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleExport} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Area
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Bookings
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Last Booking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{customer.area}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{customer.customerType}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900">
                          {customer.totalBookings}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900">
                          RM {customer.totalSpent.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{customer.lastBooking}</span>
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

export default CustomerReports;

