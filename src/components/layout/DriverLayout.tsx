
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { NavigationProvider } from "@/contexts/NavigationProvider";
import DriverSidebar from "@/components/driver/DriverSidebar";
import DriverHeader from "@/components/driver/DriverHeader";

const DriverLayoutContent = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <DriverSidebar collapsed={false} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DriverHeader 
          onSidebarToggle={toggleSidebar}
          title="Driver Dashboard"
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 p-4 sm:p-5 lg:p-6">
          <div className="h-full w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const DriverLayout = () => {
  return (
    <NavigationProvider>
      <SidebarProvider defaultOpen={true}>
        <DriverLayoutContent />
      </SidebarProvider>
    </NavigationProvider>
  );
};

export default DriverLayout;
