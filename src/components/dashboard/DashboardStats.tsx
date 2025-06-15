
import React from "react";
import { Users, Package, DollarSign, TrendingUp, UserCheck } from "lucide-react";
import ReportCard from "./ReportCard";

interface DriverMetric {
  id: string;
  name: string;
  status: string;
  totalOrders: number;
  completedOrders: number;
  earnings: number;
  rating: number;
}

interface DashboardStatsProps {
  driverMetrics: DriverMetric[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ driverMetrics }) => {
  const activeDrivers = driverMetrics.filter(d => d.status === "Active").length;
  const totalDrivers = driverMetrics.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <ReportCard
        title="Total Revenue"
        amount={125000}
        change="+12.5%"
        trend="up"
        icon={DollarSign}
      />
      <ReportCard
        title="Active Customers"
        amount={342}
        change="+8.2%"
        trend="up"
        icon={Users}
      />
      <ReportCard
        title="Active Drivers"
        amount={activeDrivers}
        change={`${activeDrivers}/${totalDrivers}`}
        trend="up"
        icon={UserCheck}
      />
      <ReportCard
        title="Bins Deployed"
        amount="1,247"
        change="-2.1%"
        trend="down"
        icon={Package}
      />
      <ReportCard
        title="Revenue Growth"
        amount="15.3%"
        change="+3.2%"
        trend="up"
        icon={TrendingUp}
      />
    </div>
  );
};

export default DashboardStats;
