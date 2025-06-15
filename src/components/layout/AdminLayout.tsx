
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobile={toggleMobileMenu}
        />
        
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ml-0`}>
          <AdminHeader 
            onSidebarToggle={toggleSidebar}
            onMobileMenuToggle={toggleMobileMenu}
            title="Admin Dashboard"
          />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30">
            <div className="container mx-auto p-4 lg:p-6 xl:p-8 max-w-7xl">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
