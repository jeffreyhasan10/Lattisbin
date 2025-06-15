
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "./DashboardHeader";
import DashboardStatsCards from "./DashboardStatsCards";
import DashboardActivityFeed from "./DashboardActivityFeed";
import DashboardPerformanceMetrics from "./DashboardPerformanceMetrics";
import DashboardDriverTable from "./DashboardDriverTable";
import DashboardOrderTable from "./DashboardOrderTable";
import DriveBookingManagement from "./DriveBookingManagement";

const DashboardOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <DashboardHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <DashboardStatsCards />

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl p-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px] bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/40 transition-all duration-300 font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="drivers"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/40 transition-all duration-300 font-medium"
              >
                Drivers
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/40 transition-all duration-300 font-medium"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="drive-booking"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/40 transition-all duration-300 font-medium"
              >
                Drive Booking
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/40 transition-all duration-300 font-medium"
              >
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <DashboardActivityFeed />
                <DashboardPerformanceMetrics />
              </div>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-8 mt-8">
              <DashboardDriverTable />
            </TabsContent>

            <TabsContent value="orders" className="space-y-8 mt-8">
              <DashboardOrderTable />
            </TabsContent>

            <TabsContent value="drive-booking" className="space-y-8 mt-8">
              <DriveBookingManagement />
            </TabsContent>

            <TabsContent value="performance" className="space-y-8 mt-8">
              <DashboardPerformanceMetrics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
