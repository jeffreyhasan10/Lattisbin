
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6">
        <DashboardHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <DashboardStatsCards />

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-2 bg-transparent gap-1">
                <TabsTrigger 
                  value="overview" 
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 data-[state=active]:border-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="drivers"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 data-[state=active]:border-none"
                >
                  Drivers
                </TabsTrigger>
                <TabsTrigger 
                  value="orders"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 data-[state=active]:border-none"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="lorries"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 data-[state=active]:border-none"
                >
                  Lorries
                </TabsTrigger>
                <TabsTrigger 
                  value="rentable-lorries"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 data-[state=active]:border-none"
                >
                  <span className="hidden sm:inline">Rentable</span>
                  <span className="sm:hidden">Rent</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="performance"
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 data-[state=active]:border-none"
                >
                  <span className="hidden sm:inline">Performance</span>
                  <span className="sm:hidden">Perf</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 lg:p-8">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <DashboardActivityFeed />
                  <DashboardPerformanceMetrics />
                </div>
              </TabsContent>

              <TabsContent value="drivers" className="space-y-6 mt-0">
                <DashboardDriverTable />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6 mt-0">
                <DashboardOrderTable />
              </TabsContent>

              <TabsContent value="lorries" className="space-y-6 mt-0">
                <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-6 -m-6">
                  <LorryManagement />
                </div>
              </TabsContent>

              <TabsContent value="rentable-lorries" className="space-y-6 mt-0">
                <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-6 -m-6">
                  <RentableLorries />
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-0">
                <DashboardPerformanceMetrics />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
