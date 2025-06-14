import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Plus, Users, MapPin, Phone, Mail, FileText, MoreHorizontal, Eye, Pencil, Trash2, Download, RotateCcw, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DUMMY_CUSTOMERS = [
  {
    id: 1,
    name: "Ahmad Zulkifli",
    company: "Simatex Sdn Bhd",
    email: "ahmad@simatex.my",
    phone: "03-1234 5678",
    address: "No. 12, Jalan Ampang, 50450 Kuala Lumpur",
    status: "active",
  },
  {
    id: 2,
    name: "Lim Wei Ming",
    company: "Green Valley Resort",
    email: "lim.wei@simatex.my",
    phone: "012-345 6789",
    address: "Lot 45, Green Valley, Genting Highlands",
    status: "inactive",
  },
  {
    id: 3,
    name: "Sarah Ahmad",
    company: "Sunshine Apartments",
    email: "sarah.ahmad@example.com",
    phone: "016-789 0123",
    address: "No. 23, Jalan Bukit Bintang, 55100 Kuala Lumpur",
    status: "active",
  },
  {
    id: 4,
    name: "John Doe",
    company: "ABC Construction",
    email: "john.doe@abcconstruction.com",
    phone: "03-9876 5432",
    address: "Lot 7, Jalan Tun Razak, 50400 Kuala Lumpur",
    status: "active",
  },
  {
    id: 5,
    name: "Lim Wei Chong",
    company: "Green Valley Resort",
    email: "lim.chong@greenvalley.com",
    phone: "012-345 6789",
    address: "Warehouse B, Port Klang",
    status: "inactive",
  },
];

const getInitials = (name: string) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface Column<T> {
  key: keyof T | "actions";
  header: string;
  sortable?: boolean;
  visibleOnMobile?: boolean;
  className?: string;
  tooltip?: string;
  render: (value: any, item: T) => JSX.Element;
}

const DataTable = <T extends { id: number }>({
  columns,
  data,
  className = "",
  emptyMessage = "No data found.",
}: {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
}) => {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    },
    [sortKey, sortDirection]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return [...data];

    return [...data].sort((a, b) => {
      const valueA = a[sortKey as keyof T];
      const valueB = b[sortKey as keyof T];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });
  }, [data, sortKey, sortDirection]);

  const toggleRowExpansion = useCallback(
    (id: number) => {
      setExpandedRowId(expandedRowId === id ? null : id);
    },
    [expandedRowId]
  );

  const mobileColumns = useMemo(
    () => columns.filter((col) => col.visibleOnMobile !== false),
    [columns]
  );
  const hiddenColumns = useMemo(
    () => columns.filter((col) => col.visibleOnMobile === false),
    [columns]
  );

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="border rounded-lg border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {(isMobile ? mobileColumns : columns).map((column) => (
                  <th
                    key={String(column.key)}
                    className={`text-gray-700 dark:text-gray-200 font-medium px-4 py-3 ${column.className || ""}`}
                    style={{
                      minWidth: column.key === "name" ? "250px" : "150px",
                      cursor: column.sortable ? "pointer" : undefined,
                    }}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                    role={column.sortable ? "button" : undefined}
                    aria-sort={
                      column.sortable && sortKey === String(column.key)
                        ? sortDirection
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
                      {column.tooltip && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <span className="ml-1 cursor-help text-gray-400">?</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>{column.tooltip}</DropdownMenuLabel>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </th>
                ))}
                {isMobile && hiddenColumns.length > 0 && (
                  <th className="w-12 px-2" aria-hidden="true"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      (isMobile ? mobileColumns : columns).length +
                      (isMobile && hiddenColumns.length > 0 ? 1 : 0)
                    }
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                <>
                  {sortedData.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150"
                    >
                      {(isMobile ? mobileColumns : columns).map((column) => (
                        <td
                          key={`${row.id}-${String(column.key)}`}
                          className={`px-4 py-3 align-middle ${column.className || ""}`}
                          style={{
                            maxWidth: column.key === "name" ? "250px" : "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {column.render(
                            column.key === "actions" 
                              ? null 
                              : row[column.key as keyof T], 
                            row
                          )}
                        </td>
                      ))}
                      {isMobile && hiddenColumns.length > 0 && (
                        <td className="px-2 py-3 w-12">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleRowExpansion(row.id)}
                            aria-label={
                              expandedRowId === row.id
                                ? "Collapse row details"
                                : "Expand row details"
                            }
                            className="p-1 h-7 w-7"
                          >
                            {expandedRowId === row.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {isMobile && expandedRowId !== null && (
                    <tr className="bg-gray-50 dark:bg-gray-900/30">
                      <td colSpan={mobileColumns.length + 1} className="px-4 py-4">
                        <div className="space-y-3 text-sm">
                          {hiddenColumns.map((column) => {
                            const row = sortedData.find(r => r.id === expandedRowId);
                            if (!row) return null;
                            return (
                              <div
                                key={`expanded-${expandedRowId}-${String(column.key)}`}
                                className="flex justify-between items-center"
                              >
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {column.header}:
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 max-w-xs break-words">
                                  {column.render(
                                    column.key === "actions" 
                                      ? null 
                                      : row[column.key as keyof T], 
                                    row
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterState, setFilterState] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(DUMMY_CUSTOMERS);

  // Simple debounce implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesFilter =
        filterState === "all" || customer.status === filterState;
      return matchesSearch && matchesFilter;
    });
  }, [customers, debouncedSearchTerm, filterState]);

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCustomers = useMemo(() => {
    if (!sortField) return filteredCustomers;

    return [...filteredCustomers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredCustomers, sortField, sortDirection]);

  const openViewDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setSelectedCustomer(null);
    setIsViewDialogOpen(false);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedCustomer(null);
    setIsEditDialogOpen(false);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedCustomer(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      closeDeleteDialog();
    }
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.company}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      visibleOnMobile: false,
      render: (value) => <p className="text-sm text-gray-700 truncate">{value}</p>,
    },
    {
      key: "phone",
      header: "Phone",
      sortable: true,
      render: (value) => <p className="text-sm text-gray-700">{value}</p>,
    },
    {
      key: "address",
      header: "Address",
      sortable: false,
      visibleOnMobile: false,
      render: (value) => <p className="text-sm text-gray-700 truncate">{value}</p>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <Badge className={value === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (_, item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open actions menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openViewDialog(item)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(item)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDeleteDialog(item)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Management</h1>
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
            aria-label="Search customers"
          />
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={sortedCustomers} />
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Company:</strong> {selectedCustomer.company}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
              <p><strong>Status:</strong> {selectedCustomer.status}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeViewDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const newCustomer: Customer = {
                id: customers.length + 1,
                name: formData.get("name") as string,
                company: formData.get("company") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                address: formData.get("address") as string,
                status: formData.get("status") as string,
              };
              setCustomers((prev) => [...prev, newCustomer]);
              closeAddDialog();
            }}
            className="space-y-4"
          >
            <Input name="name" placeholder="Name" required />
            <Input name="company" placeholder="Company" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="phone" placeholder="Phone" required />
            <Input name="address" placeholder="Address" required />
            <Select name="status" defaultValue="active" required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="submit">Add</Button>
              <Button variant="outline" onClick={closeAddDialog}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const updatedCustomer: Customer = {
                  id: selectedCustomer.id,
                  name: formData.get("name") as string,
                  company: formData.get("company") as string,
                  email: formData.get("email") as string,
                  phone: formData.get("phone") as string,
                  address: formData.get("address") as string,
                  status: formData.get("status") as string,
                };
                setCustomers((prev) =>
                  prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
                );
                closeEditDialog();
              }}
              className="space-y-4"
            >
              <Input name="name" defaultValue={selectedCustomer.name} placeholder="Name" required />
              <Input name="company" defaultValue={selectedCustomer.company} placeholder="Company" required />
              <Input name="email" type="email" defaultValue={selectedCustomer.email} placeholder="Email" required />
              <Input name="phone" defaultValue={selectedCustomer.phone} placeholder="Phone" required />
              <Input name="address" defaultValue={selectedCustomer.address} placeholder="Address" required />
              <Select name="status" defaultValue={selectedCustomer.status} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit">Save</Button>
                <Button variant="outline" onClick={closeEditDialog}>Cancel</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedCustomer?.name}?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
            <Button variant="outline" onClick={closeDeleteDialog}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
