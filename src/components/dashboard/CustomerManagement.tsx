
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/dashboard/DataTable";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "ABC Construction Sdn Bhd",
    email: "contact@abc-construction.com",
    phone: "+60 3-9876 5432",
    address: "Jalan Ampang, 50450 Kuala Lumpur",
    status: "active",
    joinDate: "2023-01-15",
    totalOrders: 25,
    totalSpent: 12500.00
  },
  {
    id: 2,
    name: "Green Valley Resort",
    email: "info@greenvalley.com",
    phone: "+60 12-345 6789",
    address: "Genting Highlands, Pahang",
    status: "active",
    joinDate: "2023-03-22",
    totalOrders: 18,
    totalSpent: 9800.00
  },
  {
    id: 3,
    name: "Sunshine Apartments",
    email: "management@sunshine.com",
    phone: "+60 16-789 0123",
    address: "Petaling Jaya, Selangor",
    status: "inactive",
    joinDate: "2022-11-08",
    totalOrders: 12,
    totalSpent: 6400.00
  }
];

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customers] = useState(DUMMY_CUSTOMERS);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" },
      inactive: { label: "Inactive", variant: "secondary" as const, className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300" },
      suspended: { label: "Suspended", variant: "destructive" as const, className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const columns = [
    {
      key: "name",
      header: "Customer Name",
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      header: "Contact",
      render: (customer: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{customer.address}</span>
          </div>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (customer: Customer) => getStatusBadge(customer.status)
    },
    {
      key: "stats",
      header: "Statistics",
      render: (customer: Customer) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {customer.totalOrders} orders
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            RM{customer.totalSpent.toFixed(2)}
          </p>
        </div>
      )
    },
    {
      key: "joinDate",
      header: "Join Date",
      render: (customer: Customer) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {new Date(customer.joinDate).toLocaleDateString()}
          </span>
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (customer: Customer) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your customer database</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={filteredCustomers} 
            columns={columns}
            emptyMessage="No customers found"
          />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customers.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Total Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 dark:text-green-400 text-sm font-bold">A</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {customers.filter(c => c.status === 'active').length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Active Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">#</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">RM</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              RM{customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerManagement;
