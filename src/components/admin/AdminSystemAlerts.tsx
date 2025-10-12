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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  Shield,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Filter,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface SystemAlert {
  id: string;
  type: "payment" | "road-tax" | "insurance" | "maintenance" | "document" | "compliance";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  dueDate: string;
  relatedEntity: string;
  amount?: number;
  actionLink: string;
  status: "active" | "acknowledged" | "resolved";
  createdDate: string;
}

const AdminSystemAlerts: React.FC = () => {
  const navigate = useNavigate();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample alerts data
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: "ALT001",
      type: "payment",
      priority: "critical",
      title: "Overdue Payment - Invoice INV-2024-002",
      description: "Payment from Sarah Lim is 15 days overdue. Amount pending: RM 339.20",
      dueDate: "2024-03-05",
      relatedEntity: "Sarah Lim",
      amount: 339.2,
      actionLink: "/admin/invoicing/details/INV-2024-002",
      status: "active",
      createdDate: "2024-03-20",
    },
    {
      id: "ALT002",
      type: "road-tax",
      priority: "high",
      title: "Road Tax Expiring - LORRY-1001",
      description: "Road tax for LORRY-1001 expires in 7 days. Immediate renewal required to avoid penalties.",
      dueDate: "2024-03-30",
      relatedEntity: "LORRY-1001",
      actionLink: "/admin/fleet",
      status: "active",
      createdDate: "2024-03-23",
    },
    {
      id: "ALT003",
      type: "insurance",
      priority: "high",
      title: "Insurance Renewal Due - LORRY-2001",
      description: "Vehicle insurance for LORRY-2001 expires in 14 days. Schedule renewal immediately.",
      dueDate: "2024-04-07",
      relatedEntity: "LORRY-2001",
      amount: 2500.0,
      actionLink: "/admin/fleet",
      status: "active",
      createdDate: "2024-03-24",
    },
    {
      id: "ALT004",
      type: "payment",
      priority: "high",
      title: "Large Pending Payment - Invoice INV-2024-005",
      description: "Corporate payment of RM 5,500 pending from John Tan. Due date approaching.",
      dueDate: "2024-03-28",
      relatedEntity: "John Tan",
      amount: 5500.0,
      actionLink: "/admin/invoicing/details/INV-2024-005",
      status: "active",
      createdDate: "2024-03-22",
    },
    {
      id: "ALT005",
      type: "maintenance",
      priority: "medium",
      title: "Scheduled Maintenance - LORRY-1002",
      description: "LORRY-1002 is due for 10,000 km service check. Current mileage: 9,850 km.",
      dueDate: "2024-04-01",
      relatedEntity: "LORRY-1002",
      amount: 850.0,
      actionLink: "/admin/fleet",
      status: "active",
      createdDate: "2024-03-23",
    },
    {
      id: "ALT006",
      type: "road-tax",
      priority: "critical",
      title: "Road Tax Expired - LORRY-3001",
      description: "Road tax for LORRY-3001 expired 3 days ago. Vehicle cannot operate legally.",
      dueDate: "2024-03-20",
      relatedEntity: "LORRY-3001",
      actionLink: "/admin/fleet",
      status: "active",
      createdDate: "2024-03-23",
    },
    {
      id: "ALT007",
      type: "insurance",
      priority: "medium",
      title: "Insurance Review - LORRY-1001",
      description: "Annual insurance review due. Compare rates and coverage options.",
      dueDate: "2024-04-15",
      relatedEntity: "LORRY-1001",
      amount: 2200.0,
      actionLink: "/admin/fleet",
      status: "active",
      createdDate: "2024-03-25",
    },
    {
      id: "ALT008",
      type: "payment",
      priority: "medium",
      title: "Payment Reminder - Invoice INV-2024-008",
      description: "Payment of RM 2,800 from Green Solutions due in 5 days.",
      dueDate: "2024-03-28",
      relatedEntity: "Green Solutions Ltd",
      amount: 2800.0,
      actionLink: "/admin/invoicing/details/INV-2024-008",
      status: "active",
      createdDate: "2024-03-23",
    },
    {
      id: "ALT009",
      type: "document",
      priority: "high",
      title: "Driver License Expiring - Mike Johnson",
      description: "Driver license for Mike Johnson expires in 30 days. Ensure renewal before expiry.",
      dueDate: "2024-04-23",
      relatedEntity: "Mike Johnson",
      actionLink: "/admin/drivers",
      status: "active",
      createdDate: "2024-03-24",
    },
    {
      id: "ALT010",
      type: "compliance",
      priority: "medium",
      title: "Monthly Compliance Report Due",
      description: "Submit monthly waste management compliance report to authorities.",
      dueDate: "2024-03-31",
      relatedEntity: "Waste Management",
      actionLink: "/admin/waste",
      status: "active",
      createdDate: "2024-03-25",
    },
    {
      id: "ALT011",
      type: "payment",
      priority: "low",
      title: "Invoice Generated - Invoice INV-2024-015",
      description: "New invoice generated for ABC Construction. Payment terms: 30 days.",
      dueDate: "2024-04-25",
      relatedEntity: "ABC Construction",
      amount: 4200.0,
      actionLink: "/admin/invoicing/details/INV-2024-015",
      status: "active",
      createdDate: "2024-03-25",
    },
    {
      id: "ALT012",
      type: "maintenance",
      priority: "high",
      title: "Urgent Repair Required - LORRY-2002",
      description: "LORRY-2002 reported brake issues. Schedule immediate inspection and repair.",
      dueDate: "2024-03-26",
      relatedEntity: "LORRY-2002",
      amount: 1200.0,
      actionLink: "/admin/fleet",
      status: "active",
      createdDate: "2024-03-25",
    },
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeAlerts = alerts.filter((a) => a.status === "active");
    const criticalAlerts = activeAlerts.filter((a) => a.priority === "critical").length;
    const highPriorityAlerts = activeAlerts.filter((a) => a.priority === "high").length;
    const overdueAlerts = activeAlerts.filter(
      (a) => new Date(a.dueDate) < new Date()
    ).length;
    const dueSoon = activeAlerts.filter((a) => {
      const daysUntil = Math.ceil(
        (new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil > 0 && daysUntil <= 7;
    }).length;

    // Category breakdown
    const byType = activeAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActive: activeAlerts.length,
      criticalAlerts,
      highPriorityAlerts,
      overdueAlerts,
      dueSoon,
      byType,
    };
  }, [alerts]);

  // Filtering logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesPriority =
        priorityFilter === "all" || alert.priority === priorityFilter;
      const matchesType = typeFilter === "all" || alert.type === typeFilter;
      const matchesStatus = statusFilter === "all" || alert.status === statusFilter;

      return matchesPriority && matchesType && matchesStatus;
    });
  }, [alerts, priorityFilter, typeFilter, statusFilter]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [priorityFilter, typeFilter, statusFilter]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "road-tax":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "insurance":
        return <Shield className="w-5 h-5 text-purple-600" />;
      case "maintenance":
        return <Truck className="w-5 h-5 text-orange-600" />;
      case "document":
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case "compliance":
        return <CheckCircle className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "payment":
        return "Payment";
      case "road-tax":
        return "Road Tax";
      case "insurance":
        return "Insurance";
      case "maintenance":
        return "Maintenance";
      case "document":
        return "Document";
      case "compliance":
        return "Compliance";
      default:
        return type;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) {
      return { text: `${Math.abs(days)} days overdue`, color: "text-red-600", isOverdue: true };
    } else if (days === 0) {
      return { text: "Due today", color: "text-orange-600", isOverdue: false };
    } else if (days <= 7) {
      return { text: `Due in ${days} days`, color: "text-amber-600", isOverdue: false };
    } else {
      return { text: `Due in ${days} days`, color: "text-gray-600", isOverdue: false };
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert
      )
    );
    toast.success("Alert acknowledged");
  };

  const handleResolve = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" as const } : alert
      )
    );
    toast.success("Alert marked as resolved");
  };

  const handleTakeAction = (actionLink: string) => {
    navigate(actionLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-8 h-8 text-red-600" />
              Admin System Alerts
            </h1>
            <p className="text-gray-600 mt-1">
              Centralized view of critical system alerts and notifications
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalActive}</p>
                  <p className="text-xs text-blue-100 mt-1">Alerts</p>
                </div>
                <Bell className="w-10 h-10 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">
                Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.criticalAlerts}</p>
                  <p className="text-xs text-red-100 mt-1">Immediate action</p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.highPriorityAlerts}</p>
                  <p className="text-xs text-orange-100 mt-1">Urgent attention</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-orange-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.overdueAlerts}</p>
                  <p className="text-xs text-purple-100 mt-1">Past due date</p>
                </div>
                <XCircle className="w-10 h-10 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">
                Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.dueSoon}</p>
                  <p className="text-xs text-amber-100 mt-1">Within 7 days</p>
                </div>
                <Clock className="w-10 h-10 text-amber-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Category Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Alerts by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div
                  key={type}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 text-center"
                >
                  <div className="flex justify-center mb-2">{getTypeIcon(type)}</div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600 mt-1">{getTypeLabel(type)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="road-tax">Road Tax</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Alerts</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAlerts.length)} of {filteredAlerts.length} alerts
                </p>
              </div>
              {filteredAlerts.length > 0 && (
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
            <div className="space-y-4">
              {paginatedAlerts.map((alert) => {
                const dueInfo = getDaysUntilDue(alert.dueDate);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-2 ${
                      alert.priority === "critical"
                        ? "border-red-200 bg-red-50/50"
                        : alert.priority === "high"
                        ? "border-orange-200 bg-orange-50/50"
                        : "border-gray-200 bg-white"
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getTypeIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {alert.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {alert.description}
                            </p>
                          </div>
                          {getPriorityBadge(alert.priority)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Due Date</p>
                              <p className="font-medium text-gray-900">{alert.dueDate}</p>
                              <p className={`text-xs font-semibold ${dueInfo.color}`}>
                                {dueInfo.text}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-500">Related To</p>
                            <p className="font-medium text-gray-900">{alert.relatedEntity}</p>
                          </div>

                          <div>
                            <p className="text-gray-500">Category</p>
                            <p className="font-medium text-gray-900">
                              {getTypeLabel(alert.type)}
                            </p>
                          </div>

                          {alert.amount && (
                            <div>
                              <p className="text-gray-500">Amount</p>
                              <p className="font-bold text-gray-900">
                                RM {alert.amount.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => handleTakeAction(alert.actionLink)}
                          >
                            Take Action
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          {alert.status === "active" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAcknowledge(alert.id)}
                              >
                                Acknowledge
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleResolve(alert.id)}
                              >
                                Mark Resolved
                              </Button>
                            </>
                          )}
                          {alert.status === "acknowledged" && (
                            <Badge className="bg-blue-100 text-blue-700">
                              Acknowledged
                            </Badge>
                          )}
                          {alert.status === "resolved" && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No alerts found</p>
                <p className="text-sm text-gray-500 mt-1">
                  All systems operating normally
                </p>
              </div>
            )}
            
            {/* Pagination Controls */}
            {filteredAlerts.length > 0 && totalPages > 1 && (
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
      </div>
    </div>
  );
};

export default AdminSystemAlerts;

