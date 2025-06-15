
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayoutContent = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <AdminSidebar collapsed={false} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader 
          onSidebarToggle={toggleSidebar}
          title="Admin Dashboard"
        />
        <main className="flex-1 overflow-auto bg-slate-50 p-4 lg:p-6">
          <div className="h-full w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminLayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
