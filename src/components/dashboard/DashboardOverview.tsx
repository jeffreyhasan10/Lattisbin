
import React from "react";
import DashboardHeaderSection from "./DashboardHeaderSection";
import DashboardStats from "./DashboardStats";
import RevenueChart from "./RevenueChart";
import DriverPerformanceCard from "./DriverPerformanceCard";
import LatestOrdersTable from "./LatestOrdersTable";
import LatestActivitiesList from "./LatestActivitiesList";

const driverMetrics = [
  {
    id: "DRV001",
    name: "Ahmad Rahman",
    status: "Active",
    totalOrders: 45,
    completedOrders: 43,
    earnings: 2850,
    rating: 4.8
  },
  {
    id: "DRV002", 
    name: "Lim Wei Ming",
    status: "Active",
    totalOrders: 52,
    completedOrders: 50,
    earnings: 3200,
    rating: 4.9
  },
  {
    id: "DRV003",
    name: "Raj Kumar",
    status: "Inactive",
    totalOrders: 28,
    completedOrders: 26,
    earnings: 1650,
    rating: 4.6
  }
];

const DashboardOverview = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <DashboardHeaderSection />

      {/* Key Metrics Cards */}
      <DashboardStats driverMetrics={driverMetrics} />

      {/* Driver Performance and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <DriverPerformanceCard driverMetrics={driverMetrics} />
      </div>

      {/* Latest Orders and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestOrdersTable />
        <LatestActivitiesList />
      </div>
    </div>
  );
};

export default DashboardOverview;
