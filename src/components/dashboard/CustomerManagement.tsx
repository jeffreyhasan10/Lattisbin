import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Plus, Users, MapPin, Phone, Mail, FileText, MoreHorizontal, Eye, Pencil, Trash2, Download, RotateCcw, Filter, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ErrorBoundary } from 'react-error-boundary';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/dashboard/DataTable";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  orders: number;
  status: "active" | "inactive" | "pending";
  lastOrderDate: string;
  notes?: string;
}

const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown",
    company: "ABC Corp",
    orders: 5,
    status: "active",
    lastOrderDate: "2024-01-15",
    notes: "Regular customer"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    address: "456 Elm St, Anytown",
    company: "XYZ Inc",
    orders: 3,
    status: "inactive",
    lastOrderDate: "2023-12-20",
    notes: "Potential customer"
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-123-4567",
    address: "789 Oak St, Anytown",
    company: "PQR Ltd",
    orders: 8,
    status: "active",
    lastOrderDate: "2024-01-10",
    notes: "VIP customer"
  },
  {
    id: 4,
    name: "Bob Williams",
    email: "bob.williams@example.com",
    phone: "111-222-3333",
    address: "321 Pine St, Anytown",
    company: "LMN Corp",
    orders: 2,
    status: "pending",
    lastOrderDate: "2024-01-01",
    notes: "New customer"
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phone: "444-555-6666",
    address: "654 Maple St, Anytown",
    company: "STU Inc",
    orders: 6,
    status: "active",
    lastOrderDate: "2023-11-25",
    notes: "Discount applied"
  },
  {
    id: 6,
    name: "Diana Miller",
    email: "diana.miller@example.com",
    phone: "777-888-9999",
    address: "987 Cherry St, Anytown",
    company: "UVW Ltd",
    orders: 4,
    status: "inactive",
    lastOrderDate: "2023-10-30",
    notes: "Contacted for feedback"
  },
  {
    id: 7,
    name: "Ethan Davis",
    email: "ethan.davis@example.com",
    phone: "000-111-2222",
    address: "246 Walnut St, Anytown",
    company: "GHI Corp",
    orders: 10,
    status: "active",
    lastOrderDate: "2024-01-05",
    notes: "Loyal customer"
  },
  {
    id: 8,
    name: "Fiona Wilson",
    email: "fiona.wilson@example.com",
    phone: "333-444-5555",
    address: "579 Birch St, Anytown",
    company: "DEF Inc",
    orders: 1,
    status: "pending",
    lastOrderDate: "2023-09-15",
    notes: "Needs follow-up"
  },
  {
    id: 9,
    name: "George Taylor",
    email: "george.taylor@example.com",
    phone: "666-777-8888",
    address: "802 Cedar St, Anytown",
    company: "KLM Ltd",
    orders: 7,
    status: "active",
    lastOrderDate: "2023-08-20",
    notes: "High-value customer"
  },
  {
    id: 10,
    name: "Hannah Moore",
    email: "hannah.moore@example.com",
    phone: "999-000-1111",
    address: "135 Oakwood St, Anytown",
    company: "OPQ Corp",
    orders: 9,
    status: "inactive",
    lastOrderDate: "2023-07-25",
    notes: "Asked for a quote"
  }
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>(DUMMY_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive" | "pending">("all");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    orders: 0,
    status: "pending",
    lastOrderDate: new Date().toISOString().slice(0, 10),
    notes: ""
  });
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    let filtered = [...customers];

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(customer => customer.status === selectedStatus);
    }

    if (sortKey) {
      filtered.sort((a: any, b: any) => {
        const valueA = a[sortKey as keyof Customer];
        const valueB = b[sortKey as keyof Customer];

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        if (typeof valueA === "number" && typeof valueB === "number") {
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }

        return 0;
      });
    }

    return filtered;
  }, [customers, searchQuery, selectedStatus, sortKey, sortDirection]);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }, [sortKey, sortDirection]);

  const handleStatusChange = (id: number, newStatus: Customer["status"]) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === id ? { ...customer, status: newStatus } : customer
      )
    );
  };

  const handleDeleteRequest = (id: number) => {
    setCustomerToDelete(id);
  };

  const confirmDelete = () => {
    if (customerToDelete === null) return;

    setIsDeleting(true);
    setTimeout(() => {
      setCustomers(prev => prev.filter(customer => customer.id !== customerToDelete));
      setCustomerToDelete(null);
      setIsDeleting(false);
      toast({
        title: "Customer Deleted",
        description: "The customer has been successfully removed.",
      });
    }, 1000);
  };

  const cancelDelete = () => {
    setCustomerToDelete(null);
  };

  const handleAddCustomer = () => {
    setIsAddingCustomer(true);
  };

  const handleSaveNewCustomer = () => {
    const id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCustomerWithId: Customer = { id, ...newCustomer };

    setCustomers(prev => [...prev, newCustomerWithId]);
    setIsAddingCustomer(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      orders: 0,
      status: "pending",
      lastOrderDate: new Date().toISOString().slice(0, 10),
      notes: ""
    });
    toast({
      title: "Customer Added",
      description: "A new customer has been successfully added.",
    });
  };

  const handleCancelNewCustomer = () => {
    setIsAddingCustomer(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      orders: 0,
      status: "pending",
      lastOrderDate: new Date().toISOString().slice(0, 10),
      notes: ""
    });
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (value: any) => (
        <a href={`mailto:${value}`} className="text-blue-500 hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (value: any) => (
        <a href={`tel:${value}`} className="text-green-500 hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: "company",
      header: "Company",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (value: any, customer: Customer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {value === "active" && <Badge variant="ghost" className="text-green-500 border-green-500 dark:text-green-400 dark:border-green-400">Active</Badge>}
              {value === "inactive" && <Badge variant="ghost" className="text-gray-500 border-gray-500 dark:text-gray-400 dark:border-gray-400">Inactive</Badge>}
              {value === "pending" && <Badge variant="ghost" className="text-orange-500 border-orange-500 dark:text-orange-400 dark:border-orange-400">Pending</Badge>}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange(customer.id, "active")}>
              <Badge variant="ghost" className="text-green-500 border-green-500 dark:text-green-400 dark:border-green-400">Active</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(customer.id, "inactive")}>
              <Badge variant="ghost" className="text-gray-500 border-gray-500 dark:text-gray-400 dark:border-gray-400">Inactive</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(customer.id, "pending")}>
              <Badge variant="ghost" className="text-orange-500 border-orange-500 dark:text-orange-400 dark:border-orange-400">Pending</Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      key: "lastOrderDate",
      header: "Last Order",
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-10",
      render: (_value: any, customer: Customer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setExpandedCustomerId(customer.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Customer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteRequest(customer.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight">Customer Management</CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>Inactive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAddCustomer}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm ${column.className || ''}`}
                    style={{
                      minWidth: "150px",
                      ...(column.sortable ? { cursor: "pointer" } : {}),
                    }}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                    role={column.sortable ? "button" : undefined}
                    aria-sort={
                      column.sortable && sortKey === String(column.key)
                        ? sortDirection === "asc" ? "ascending" : "descending"
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && sortKey === String(column.key) && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <DataTable columns={[]} data={[]} emptyMessage="No customers found" />
                  </td>
                </tr>
              ) : (
                filteredData.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150">
                    {columns.map((column) => (
                      <td key={`${customer.id}-${String(column.key)}`} className="px-4 py-3 align-middle">
                        {column.render ? column.render(customer[column.key as keyof typeof customer], customer) : String(customer[column.key as keyof typeof customer] || '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {expandedCustomerId && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Additional Details</h4>
              <button
                onClick={() => setExpandedCustomerId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedCustomerId ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Address:</span>
                <p className="text-gray-600 dark:text-gray-400">{customers.find(c => c.id === expandedCustomerId)?.address || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Notes:</span>
                <p className="text-gray-600 dark:text-gray-400">{customers.find(c => c.id === expandedCustomerId)?.notes || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Customer Modal */}
        {isAddingCustomer && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
            <Card className="max-w-md w-full p-6 space-y-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Add New Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newCustomer.company}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="orders">Orders</Label>
                    <Input
                      id="orders"
                      type="number"
                      value={newCustomer.orders}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, orders: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newCustomer.status} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, status: value as Customer["status"] }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lastOrderDate">Last Order Date</Label>
                    <Input
                      id="lastOrderDate"
                      type="date"
                      value={newCustomer.lastOrderDate}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, lastOrderDate: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={handleCancelNewCustomer}>Cancel</Button>
                  <Button onClick={handleSaveNewCustomer}>Save</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={customerToDelete !== null} onOpenChange={(open) => !open && cancelDelete()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to delete this customer?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={confirmDelete}>
                {isDeleting ? (
                  <>
                    Deleting...
                    <RotateCcw className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerManagement;
