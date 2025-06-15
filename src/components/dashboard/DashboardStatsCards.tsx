
import React from "react";
import MetricCard from "./MetricCard";
import { Truck, Users, Package, DollarSign, TrendingUp, Calendar, MapPin, Clock } from "lucide-react";

const DashboardStatsCards: React.FC = () => {
  const statsData = [
    { 
      title: "Total Drivers", 
      value: "24", 
      icon: Users, 
      trend: { value: 12, isPositive: true },
      description: "Active fleet drivers"
    },
    { 
      title: "Active Orders", 
      value: "18", 
      icon: Package, 
      trend: { value: 8, isPositive: true },
      description: "Currently in progress"
    },
    { 
      title: "Fleet Vehicles", 
      value: "12", 
      icon: Truck, 
      trend: { value: 5, isPositive: false },
      description: "Available vehicles"
    },
    { 
      title: "Monthly Revenue", 
      value: "RM 45,280", 
      icon: DollarSign, 
      trend: { value: 15, isPositive: true },
      description: "Current month earnings"
    },
    { 
      title: "Completion Rate", 
      value: "94.2%", 
      icon: TrendingUp, 
      trend: { value: 3, isPositive: true },
      description: "Success rate this month"
    },
    { 
      title: "Scheduled Today", 
      value: "8", 
      icon: Calendar, 
      trend: { value: 2, isPositive: true },
      description: "Today's scheduled jobs"
    },
    { 
      title: "Average Distance", 
      value: "24.5 km", 
      icon: MapPin, 
      trend: { value: 1.2, isPositive: false },
      description: "Per delivery route"
    },
    { 
      title: "Avg. Time", 
      value: "2.3 hrs", 
      icon: Clock, 
      trend: { value: 0.5, isPositive: true },
      description: "Per collection job"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        />
      ))}
    </div>
  );
};

export default DashboardStatsCards;
