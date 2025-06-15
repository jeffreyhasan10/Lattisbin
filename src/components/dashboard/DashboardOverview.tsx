
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "./DashboardHeader";
import DashboardStatsCards from "./DashboardStatsCards";
import DashboardActivityFeed from "./DashboardActivityFeed";
import DashboardPerformanceMetrics from "./DashboardPerformanceMetrics";
import DashboardDriverTable from "./DashboardDriverTable";
import DashboardOrderTable from "./DashboardOrderTable";
import LorryManagement from "./LorryManagement";
import RentableLorries from "./RentableLorries";

const DashboardOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <DashboardHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <DashboardStatsCards />

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 lg:w-[720px] bg-gray-100 dark:bg-gray-700 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <TabsTrigger 
                value="overview" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="drivers"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                Drivers
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="lorries"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                Lorries
              </TabsTrigger>
              <TabsTrigger 
                value="rentable-lorries"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                Rentable
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
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

            <TabsContent value="lorries" className="space-y-8 mt-8">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 -m-6">
                <LorryManagement />
              </div>
            </TabsContent>

            <TabsContent value="rentable-lorries" className="space-y-8 mt-8">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 -m-6">
                <RentableLorries />
              </div>
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
