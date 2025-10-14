import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Bell,
  Calendar,
  Clock,
  MapPin,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Send,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface CollectionReminder {
  id: string;
  doNumber: string;
  customerName: string;
  location: string;
  binSerialNumber: string;
  binSize: string;
  deliveryDate: string;
  reminderType: "same_day" | "term_based";
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "sent" | "overdue" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedDriver?: string;
  notes?: string;
  createdAt: string;
}

const mockReminders: CollectionReminder[] = [
  {
    id: "REM-001",
    doNumber: "DO-2024-1234",
    customerName: "Tech Plaza Mall",
    location: "Cyberjaya, Selangor",
    binSerialNumber: "ASR-100",
    binSize: "20 Yard (11ft x 6ft x 8ft)",
    deliveryDate: "2024-10-10",
    reminderType: "term_based",
    scheduledDate: "2024-10-17",
    scheduledTime: "09:00",
    status: "overdue",
    priority: "urgent",
    assignedDriver: "Ahmad Rahman",
    notes: "Customer requested morning pickup",
    createdAt: "2024-10-10T14:30:00Z",
  },
  {
    id: "REM-002",
    doNumber: "DO-2024-1235",
    customerName: "Green Valley Resort",
    location: "Mont Kiara, KL",
    binSerialNumber: "ASR-150",
    binSize: "15 Yard (11ft x 4.5ft x 8ft)",
    deliveryDate: "2024-10-14",
    reminderType: "same_day",
    scheduledDate: "2024-10-14",
    scheduledTime: "16:00",
    status: "scheduled",
    priority: "high",
    assignedDriver: "Ahmad Rahman",
    createdAt: "2024-10-14T08:00:00Z",
  },
  {
    id: "REM-003",
    doNumber: "DO-2024-1236",
    customerName: "Sunrise Apartments",
    location: "Petaling Jaya",
    binSerialNumber: "LSR-200",
    binSize: "10 Yard (10ft x 4ft x 7ft)",
    deliveryDate: "2024-10-12",
    reminderType: "term_based",
    scheduledDate: "2024-10-19",
    scheduledTime: "10:30",
    status: "scheduled",
    priority: "medium",
    assignedDriver: "Azman Ali",
    createdAt: "2024-10-12T11:20:00Z",
  },
];

const CollectionReminderSystem: React.FC = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<CollectionReminder[]>(mockReminders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<CollectionReminder | null>(null);

  // Form states for create/edit
  const [formData, setFormData] = useState({
    doNumber: "",
    customerName: "",
    location: "",
    binSerialNumber: "",
    binSize: "",
    deliveryDate: "",
    reminderType: "term_based" as "same_day" | "term_based",
    scheduledDate: "",
    scheduledTime: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    assignedDriver: "",
    notes: "",
  });

  // Filter and search reminders
  const filteredReminders = useMemo(() => {
    return reminders.filter((reminder) => {
      const matchesSearch =
        reminder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.binSerialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || reminder.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || reminder.priority === priorityFilter;
      const matchesType = typeFilter === "all" || reminder.reminderType === typeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [reminders, searchTerm, statusFilter, priorityFilter, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: reminders.length,
      scheduled: reminders.filter((r) => r.status === "scheduled").length,
      overdue: reminders.filter((r) => r.status === "overdue").length,
      completed: reminders.filter((r) => r.status === "completed").length,
      urgent: reminders.filter((r) => r.priority === "urgent").length,
    };
  }, [reminders]);

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      sent: "bg-purple-100 text-purple-700 border-purple-200",
      overdue: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return variants[status as keyof typeof variants] || variants.scheduled;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const handleCreateReminder = () => {
    if (!formData.doNumber || !formData.scheduledDate || !formData.scheduledTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReminder: CollectionReminder = {
      id: `REM-${String(reminders.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    setReminders([...reminders, newReminder]);
    setShowCreateModal(false);
    resetForm();
    toast.success("Collection reminder created successfully!", {
      description: `Scheduled for ${formData.scheduledDate} at ${formData.scheduledTime}`,
    });
  };

  const handleEditReminder = () => {
    if (!selectedReminder) return;

    setReminders(
      reminders.map((r) =>
        r.id === selectedReminder.id
          ? { ...r, ...formData, status: r.status }
          : r
      )
    );
    setShowEditModal(false);
    setSelectedReminder(null);
    resetForm();
    toast.success("Reminder updated successfully!");
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      setReminders(reminders.filter((r) => r.id !== id));
      toast.success("Reminder deleted successfully!");
    }
  };

  const handleSendReminder = (reminder: CollectionReminder) => {
    setReminders(
      reminders.map((r) =>
        r.id === reminder.id ? { ...r, status: "sent" as const } : r
      )
    );
    toast.success("Reminder sent!", {
      description: `Notification sent to ${reminder.assignedDriver}`,
    });
  };

  const handleMarkCompleted = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, status: "completed" as const } : r
      )
    );
    toast.success("Collection marked as completed!");
  };

  const openEditModal = (reminder: CollectionReminder) => {
    setSelectedReminder(reminder);
    setFormData({
      doNumber: reminder.doNumber,
      customerName: reminder.customerName,
      location: reminder.location,
      binSerialNumber: reminder.binSerialNumber,
      binSize: reminder.binSize,
      deliveryDate: reminder.deliveryDate,
      reminderType: reminder.reminderType,
      scheduledDate: reminder.scheduledDate,
      scheduledTime: reminder.scheduledTime,
      priority: reminder.priority,
      assignedDriver: reminder.assignedDriver || "",
      notes: reminder.notes || "",
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      doNumber: "",
      customerName: "",
      location: "",
      binSerialNumber: "",
      binSize: "",
      deliveryDate: "",
      reminderType: "term_based",
      scheduledDate: "",
      scheduledTime: "",
      priority: "medium",
      assignedDriver: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="h-8 w-8 text-blue-600" />
                Collection Reminder System
              </h1>
              <p className="text-gray-600 mt-1">
                Schedule and track bin collection reminders
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Reminder
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Reminders</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Scheduled</p>
                <p className="text-3xl font-bold">{stats.scheduled}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-100">Overdue</p>
                <p className="text-3xl font-bold">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Completed</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100">Urgent</p>
                <p className="text-3xl font-bold">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="same_day">Same Day</SelectItem>
                <SelectItem value="term_based">Term Based</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
              setTypeFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reminders List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReminders.map((reminder) => (
          <Card
            key={reminder.id}
            className={`hover:shadow-lg transition-shadow ${
              reminder.status === "overdue" ? "border-l-4 border-l-red-500" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {reminder.customerName}
                      </h3>
                      <p className="text-sm text-gray-600">DO: {reminder.doNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusBadge(reminder.status)}>
                        {reminder.status}
                      </Badge>
                      <Badge className={getPriorityBadge(reminder.priority)}>
                        {reminder.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{reminder.binSerialNumber} - {reminder.binSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{reminder.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Scheduled: {reminder.scheduledDate} at {reminder.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span>Driver: {reminder.assignedDriver || "Not assigned"}</span>
                    </div>
                  </div>

                  {reminder.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{reminder.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  {reminder.status === "scheduled" && (
                    <Button
                      size="sm"
                      onClick={() => handleSendReminder(reminder)}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Now
                    </Button>
                  )}
                  {reminder.status !== "completed" && reminder.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkCompleted(reminder.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(reminder)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReminders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No reminders found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters or create a new reminder
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Reminder Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedReminder(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showEditModal ? "Edit Reminder" : "Create Collection Reminder"}
            </DialogTitle>
            <DialogDescription>
              Schedule a reminder for bin collection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>DO Number *</Label>
                <Input
                  placeholder="DO-2024-XXXX"
                  value={formData.doNumber}
                  onChange={(e) => setFormData({ ...formData, doNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Bin Serial Number *</Label>
                <Input
                  placeholder="ASR-100"
                  value={formData.binSerialNumber}
                  onChange={(e) => setFormData({ ...formData, binSerialNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Customer Name *</Label>
              <Input
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div>
              <Label>Location *</Label>
              <Input
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <Label>Bin Size</Label>
              <Input
                placeholder="e.g., 20 Yard (11ft x 6ft x 8ft)"
                value={formData.binSize}
                onChange={(e) => setFormData({ ...formData, binSize: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Reminder Type *</Label>
                <Select
                  value={formData.reminderType}
                  onValueChange={(value: "same_day" | "term_based") =>
                    setFormData({ ...formData, reminderType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same_day">Same Day</SelectItem>
                    <SelectItem value="term_based">Term Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scheduled Date *</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Scheduled Time *</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Assigned Driver</Label>
              <Input
                placeholder="Enter driver name"
                value={formData.assignedDriver}
                onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Enter any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={showEditModal ? handleEditReminder : handleCreateReminder}>
              {showEditModal ? "Update Reminder" : "Create Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionReminderSystem;

