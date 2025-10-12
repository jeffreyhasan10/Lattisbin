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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UsersRound,
  Plus,
  Search,
  Edit,
  Trash2,
  Key,
  Mail,
  Phone,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Admin" | "Driver" | "Manager";
  department?: string;
  status: "active" | "inactive";
  lastLogin: string;
  createdDate: string;
}

const AdminUserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for new/edit user
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Driver" as SystemUser["role"],
    department: "",
    password: "",
  });

  // Sample users data
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "USR001",
      name: "John Anderson",
      email: "john.anderson@lattisbin.com",
      phone: "+60123456789",
      role: "Super Admin",
      department: "Operations",
      status: "active",
      lastLogin: "2024-03-25 14:30",
      createdDate: "2023-01-15",
    },
    {
      id: "USR002",
      name: "Sarah Chen",
      email: "sarah.chen@lattisbin.com",
      phone: "+60187654321",
      role: "Admin",
      department: "Finance",
      status: "active",
      lastLogin: "2024-03-25 10:15",
      createdDate: "2023-03-20",
    },
    {
      id: "USR003",
      name: "Mike Johnson",
      email: "mike.johnson@lattisbin.com",
      phone: "+60196543210",
      role: "Driver",
      status: "active",
      lastLogin: "2024-03-25 08:00",
      createdDate: "2023-06-10",
    },
    {
      id: "USR004",
      name: "Ahmad Hassan",
      email: "ahmad.hassan@lattisbin.com",
      phone: "+60172223333",
      role: "Driver",
      status: "active",
      lastLogin: "2024-03-24 16:45",
      createdDate: "2023-07-15",
    },
    {
      id: "USR005",
      name: "Lisa Wong",
      email: "lisa.wong@lattisbin.com",
      phone: "+60165554444",
      role: "Manager",
      department: "Operations",
      status: "active",
      lastLogin: "2024-03-25 11:30",
      createdDate: "2023-04-08",
    },
    {
      id: "USR006",
      name: "David Lee",
      email: "david.lee@lattisbin.com",
      phone: "+60143216789",
      role: "Driver",
      status: "inactive",
      lastLogin: "2024-03-10 09:00",
      createdDate: "2023-08-22",
    },
    {
      id: "USR007",
      name: "Emily Tan",
      email: "emily.tan@lattisbin.com",
      phone: "+60198765432",
      role: "Admin",
      department: "IT",
      status: "active",
      lastLogin: "2024-03-25 13:00",
      createdDate: "2023-05-12",
    },
    {
      id: "USR008",
      name: "Raj Kumar",
      email: "raj.kumar@lattisbin.com",
      phone: "+60132221111",
      role: "Driver",
      status: "active",
      lastLogin: "2024-03-25 07:30",
      createdDate: "2023-09-05",
    },
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const inactiveUsers = users.filter((u) => u.status === "inactive").length;

    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      byRole,
    };
  }, [users]);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const resetForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "Driver",
      department: "",
      password: "",
    });
  };

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.phone || !userForm.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newUser: SystemUser = {
      id: `USR${String(users.length + 1).padStart(3, "0")}`,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      department: userForm.department,
      status: "active",
      lastLogin: "Never",
      createdDate: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setShowAddDialog(false);
    resetForm();
    toast.success(`User ${newUser.name} added successfully!`);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: userForm.name,
              email: userForm.email,
              phone: userForm.phone,
              role: userForm.role,
              department: userForm.department,
            }
          : user
      )
    );

    setShowEditDialog(false);
    setSelectedUser(null);
    resetForm();
    toast.success("User updated successfully!");
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
    setShowDeleteDialog(false);
    setSelectedUser(null);
    toast.success("User deleted successfully!");
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;

    // In a real application, this would send a password reset email
    toast.success(`Password reset email sent to ${selectedUser.email}`);
    setShowResetPasswordDialog(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(
      `User ${user?.name} ${user?.status === "active" ? "deactivated" : "activated"}`
    );
  };

  const openEditDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department || "",
      password: "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const openResetPasswordDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setShowResetPasswordDialog(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin":
        return <Badge className="bg-purple-100 text-purple-700">Super Admin</Badge>;
      case "Admin":
        return <Badge className="bg-blue-100 text-blue-700">Admin</Badge>;
      case "Manager":
        return <Badge className="bg-green-100 text-green-700">Manager</Badge>;
      case "Driver":
        return <Badge className="bg-orange-100 text-orange-700">Driver</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <UsersRound className="w-8 h-8 text-blue-600" />
              Admin User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add New User
            </Button>
            <Button onClick={() => navigate("/admin/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-blue-100 mt-1">System users</p>
                </div>
                <UsersRound className="w-12 h-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.activeUsers}</p>
                  <p className="text-xs text-green-100 mt-1">Currently active</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {(stats.byRole["Super Admin"] || 0) + (stats.byRole["Admin"] || 0)}
                  </p>
                  <p className="text-xs text-orange-100 mt-1">Administrator accounts</p>
                </div>
                <Shield className="w-12 h-12 text-orange-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.byRole["Driver"] || 0}</p>
                  <p className="text-xs text-purple-100 mt-1">Driver accounts</p>
                </div>
                <User className="w-12 h-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Accounts</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                </p>
              </div>
              {filteredUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600">Show:</Label>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {user.department || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{user.lastLogin}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResetPasswordDialog(user)}
                          >
                            <Key className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(user.id)}
                            className={
                              user.status === "active"
                                ? "text-red-600 hover:text-red-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {user.status === "active" ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredUsers.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-9 h-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account for the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name *</Label>
                <Input
                  id="add-name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone *</Label>
                <Input
                  id="add-phone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+60123456789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-role">Role *</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) =>
                    setUserForm((prev) => ({ ...prev, role: value as SystemUser["role"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-department">Department</Label>
                <Input
                  id="add-department"
                  value={userForm.department}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, department: e.target.value }))
                  }
                  placeholder="Operations"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-password">Initial Password *</Label>
                <div className="relative">
                  <Input
                    id="add-password"
                    type={showPassword ? "text" : "password"}
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user account information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone *</Label>
                <Input
                  id="edit-phone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) =>
                    setUserForm((prev) => ({ ...prev, role: value as SystemUser["role"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={userForm.department}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, department: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user account? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-600">{selectedUser.role}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog
          open={showResetPasswordDialog}
          onOpenChange={setShowResetPasswordDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Send a password reset email to this user
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-xs text-gray-500 mt-2">
                  A password reset link will be sent to the user's email address.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowResetPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleResetPassword} className="gap-2">
                <Key className="w-4 h-4" />
                Send Reset Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUserManagement;

