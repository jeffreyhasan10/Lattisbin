import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Map, History, Truck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const activeTab = location.pathname.split("/").pop() || "dashboard";

  const navItems = [
    { 
      id: "dashboard", 
      label: "Home", 
      icon: Home,
      path: "/driver/dashboard"
    },
    { 
      id: "trips", 
      label: "Trips", 
      icon: Map,
      path: "/driver/trips",
      badge: 3
    },
    { 
      id: "trip-history", 
      label: "History", 
      icon: History,
      path: "/driver/trip-history"
    },
    { 
      id: "lorries", 
      label: "Lorry", 
      icon: Truck,
      path: "/driver/lorries"
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: User,
      path: "/driver/profile"
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-4 py-2.5 sm:py-3 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-4 sm:px-5 py-2 rounded-xl transition-all duration-200 flex-1 max-w-[120px] relative tap-highlight-none ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100"
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${isActive ? "scale-110" : ""} transition-transform`} />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] border-2 border-white shadow-md">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-[11px] sm:text-xs font-medium ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

