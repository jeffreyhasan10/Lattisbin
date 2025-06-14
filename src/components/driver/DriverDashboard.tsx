
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
      case "in-progress": return "bg-blue-500";
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
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Time and Date */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
          <p className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">{pendingJobs}</span>
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{inProgressJobs}</span>
            </div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{completedJobs}</span>
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">RM{totalPayments}</span>
            </div>
            <p className="text-sm text-gray-600">Collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col"
          onClick={() => navigate("/driver/orders")}
        >
          <FileText className="h-6 w-6 mb-2" />
          <span className="text-sm">My Orders</span>
        </Button>

        <Button 
          className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col"
          onClick={() => navigate("/driver/lorries")}
        >
          <Truck className="h-6 w-6 mb-2" />
          <span className="text-sm">Lorry Select</span>
        </Button>

        <Button 
          className="h-20 bg-green-600 hover:bg-green-700 flex flex-col"
          onClick={() => navigate("/driver/payments")}
        >
          <DollarSign className="h-6 w-6 mb-2" />
          <span className="text-sm">Payments</span>
        </Button>

        <Button 
          className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col"
          onClick={() => navigate("/driver/expenses")}
        >
          <Fuel className="h-6 w-6 mb-2" />
          <span className="text-sm">Expenses</span>
        </Button>
      </div>

      {/* Today's Jobs Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getStatusColor(job.status)}`}>
                  {getStatusIcon(job.status)}
                </div>
                <div>
                  <p className="font-medium text-sm">{job.customerName}</p>
                  <p className="text-xs text-gray-600">{job.binType} - {job.assignedTime}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                RM{job.amount}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-600">
            <Phone className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Office: 03-1234 5678
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Supervisor: 012-345 6789
          </Button>
          <Button variant="destructive" className="w-full" size="sm">
            🚨 Emergency Alert
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
