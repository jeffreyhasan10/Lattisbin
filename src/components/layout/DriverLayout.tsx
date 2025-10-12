
import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "@/components/driver/BottomNav";
import MobileHeader from "@/components/driver/MobileHeader";

const DriverLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* App Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className="pb-20">
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation - All Devices */}
      <BottomNav />
    </div>
  );
};

export default DriverLayout;
