
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DriverSidebar from "@/components/driver/DriverSidebar";
import DriverHeader from "@/components/driver/DriverHeader";

const DriverLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <DriverSidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col min-w-0">
          <DriverHeader 
            onSidebarToggle={handleSidebarToggle}
            title="Driver Dashboard"
          />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DriverLayout;
