
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import DriverSidebar from "@/components/driver/DriverSidebar";
import DriverHeader from "@/components/driver/DriverHeader";

const DriverLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full dashboard-bg">
        <DriverSidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col">
          <DriverHeader 
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
            title="Driver Dashboard"
          />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DriverLayout;
