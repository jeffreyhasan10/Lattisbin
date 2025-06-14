
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import DriverSidebar from "@/components/driver/DriverSidebar";
import DriverHeader from "@/components/driver/DriverHeader";

const DriverLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-slate-50">
        <DriverSidebar collapsed={false} />
        <div className="flex-1 flex flex-col min-w-0 ml-4">
          <DriverHeader 
            onSidebarToggle={() => {}}
            title="Driver Dashboard"
          />
          <main className="flex-1 overflow-auto bg-slate-50 p-6">
            <div className="h-full w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DriverLayout;
