
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "./DashboardHeader";
import DashboardStatsCards from "./DashboardStatsCards";
import DashboardActivityFeed from "./DashboardActivityFeed";
import DashboardPerformanceMetrics from "./DashboardPerformanceMetrics";
import DashboardDriverTable from "./DashboardDriverTable";
import DashboardOrderTable from "./DashboardOrderTable";

const DashboardOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <DashboardHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <DashboardStatsCards />

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[500px] bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
              <TabsTrigger 
                value="overview" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="drivers"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
              >
                Drivers
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
              >
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DashboardActivityFeed />
                <DashboardPerformanceMetrics />
              </div>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
              <DashboardDriverTable />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <DashboardOrderTable />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <DashboardPerformanceMetrics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
