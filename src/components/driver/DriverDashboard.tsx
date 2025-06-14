
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Camera,
  Phone,
  Navigation,
  Bell,
  User,
  FileText,
  Fuel
} from "lucide-react";
import { toast } from "sonner";

interface DriverSession {
  name: string;
  ic: string;
  phone: string;
  driverId: string;
}

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverSession, setDriverSession] = useState<DriverSession | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dummy job data
  const [jobs] = useState([
    {
      id: "JOB001",
      customerName: "ABC Construction Sdn Bhd",
      customerPhone: "03-9876 5432",
      pickupAddress: "Jalan Ampang, 50450 Kuala Lumpur",
      deliveryAddress: "No. 123, Jalan Tun Razak, 50400 KL",
      binType: "ASR100",
      binSerial: "ASR100-001",
      binSize: "4x12x6ft",
      status: "pending",
      amount: 350.00,
      paymentMethod: "Cash",
      assignedTime: "08:00 AM",
      priority: "high"
    },
    {
      id: "JOB002", 
      customerName: "Green Valley Resort",
      customerPhone: "012-345 6789",
      pickupAddress: "Warehouse B, Port Klang",
      deliveryAddress: "Green Valley Resort, Genting Highlands",
      binType: "LASR100",
      binSerial: "LASR100-045",
      binSize: "6x12x8ft",
      status: "in-progress",
      amount: 450.00,
      paymentMethod: "Online Transfer",
      assignedTime: "10:30 AM",
      priority: "medium"
    },
    {
      id: "JOB003",
      customerName: "Sunshine Apartments",
      customerPhone: "016-789 0123",
      pickupAddress: "Customer Site",
      deliveryAddress: "Sunshine Apartments, Petaling Jaya",
      binType: "PWD100",
      binSerial: "PWD100-023",
      binSize: "3x10x5ft",
      status: "completed",
      amount: 280.00,
      paymentMethod: "Cheque",
      assignedTime: "07:00 AM",
      priority: "low"
    }
  ]);

  useEffect(() => {
    const session = localStorage.getItem("driverSession");
    if (!session) {
      navigate("/driver/login");
      return;
    }
    setDriverSession(JSON.parse(session));

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-500";
      case "in-progress": return "bg-blue-600";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingJobs = jobs.filter(job => job.status === "pending").length;
  const inProgressJobs = jobs.filter(job => job.status === "in-progress").length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const totalPayments = jobs.filter(job => job.status === "completed")
    .reduce((sum, job) => sum + job.amount, 0);

  if (!driverSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-bg min-h-screen">
      <div className="dashboard-content space-y-6">
        {/* Welcome Header */}
        <div className="dashboard-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dashboard-title text-3xl mb-2">Good Morning, {driverSession.name}! 👋</h1>
              <p className="text-gray-600">Ready to make today productive?</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="dashboard-stat-card border-orange-100 hover:border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingJobs}</p>
                </div>
                <div className="dashboard-icon-container bg-orange-100">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat-card border-blue-100 hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{inProgressJobs}</p>
                </div>
                <div className="dashboard-icon-container bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat-card border-green-100 hover:border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedJobs}</p>
                </div>
                <div className="dashboard-icon-container bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat-card border-blue-100 hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Collected</p>
                  <p className="text-2xl font-bold text-blue-600">RM{totalPayments}</p>
                </div>
                <div className="dashboard-icon-container bg-blue-100">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="dashboard-panel">
          <CardHeader className="dashboard-gradient-header">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="dashboard-button-primary flex-col h-20 gap-2"
                onClick={() => navigate("/driver/orders")}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">My Orders</span>
              </Button>

              <Button 
                className="dashboard-button-primary flex-col h-20 gap-2"
                onClick={() => navigate("/driver/lorries")}
              >
                <Truck className="h-6 w-6" />
                <span className="text-sm">Lorry Select</span>
              </Button>

              <Button 
                className="dashboard-button-primary flex-col h-20 gap-2"
                onClick={() => navigate("/driver/payments")}
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Payments</span>
              </Button>

              <Button 
                className="dashboard-button-primary flex-col h-20 gap-2"
                onClick={() => navigate("/driver/expenses")}
              >
                <Fuel className="h-6 w-6" />
                <span className="text-sm">Expenses</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Jobs Summary */}
        <Card className="dashboard-panel">
          <CardHeader className="dashboard-gradient-header">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{job.customerName}</p>
                      <p className="text-sm text-gray-600">{job.binType} - {job.assignedTime}</p>
                      <p className="text-xs text-gray-500">{job.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="dashboard-filter-badge mb-1">
                      RM{job.amount}
                    </Badge>
                    <p className="text-xs text-gray-500">{job.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="dashboard-panel">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-xl">
            <CardTitle className="text-xl flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12" size="sm">
                <Phone className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-gray-500">03-1234 5678</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12" size="sm">
                <Phone className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Supervisor</p>
                  <p className="text-sm text-gray-500">012-345 6789</p>
                </div>
              </Button>
              <Button variant="destructive" className="w-full h-12 text-lg font-semibold" size="sm">
                🚨 Emergency Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
