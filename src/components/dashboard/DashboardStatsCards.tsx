
import React from "react";
import MetricCard from "./MetricCard";
import { Truck, Users, Package, DollarSign, TrendingUp, Calendar } from "lucide-react";

const DashboardStatsCards: React.FC = () => {
  const statsData = [
    { title: "Total Drivers", value: "24", icon: Users, trend: { value: 12, isPositive: true } },
    { title: "Active Orders", value: "18", icon: Package, trend: { value: 8, isPositive: true } },
    { title: "Fleet Vehicles", value: "12", icon: Truck, trend: { value: 5, isPositive: false } },
    { title: "Monthly Revenue", value: "RM 45,280", icon: DollarSign, trend: { value: 15, isPositive: true } },
    { title: "Completion Rate", value: "94.2%", icon: TrendingUp, trend: { value: 3, isPositive: true } },
    { title: "Scheduled Today", value: "8", icon: Calendar, trend: { value: 2, isPositive: true } },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default DashboardStatsCards;
