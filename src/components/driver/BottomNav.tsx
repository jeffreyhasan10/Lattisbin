import { useNavigate, useLocation } from "react-router-dom";
import { Home, Map, History, Truck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

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

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  const activeTab = location.pathname.split("/").pop() || "dashboard";

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const activeIndex = navItems.findIndex(
      (item) => activeTab === item.id || location.pathname === item.path
    );
    
    if (activeIndex !== -1) {
      const navContainer = document.getElementById('nav-container');
      const buttons = navContainer?.querySelectorAll('button');
      
      if (buttons && buttons[activeIndex]) {
        const button = buttons[activeIndex];
        const containerRect = navContainer?.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        if (containerRect) {
          setIndicatorStyle({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width,
          });
        }
      }
    }
  }, [location.pathname, activeTab]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-gray-200/50 z-50 shadow-lg">
      <div id="nav-container" className="relative flex items-center justify-around px-2 py-2 max-w-screen-xl mx-auto">
        {/* Liquid Glass Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[52px] bg-gradient-to-b from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-lg shadow-blue-500/20 transition-all duration-500 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[60px] z-10 group transition-transform active:scale-95 duration-200"
            >
              <div className="relative">
                <Icon 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive 
                      ? "text-blue-600 stroke-[2.5] scale-110" 
                      : "text-gray-400 group-hover:text-gray-600 group-hover:scale-105"
                  }`} 
                />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white text-[9px] border-2 border-white shadow-md">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-[10px] font-semibold transition-all duration-300 ${
                isActive ? "text-blue-600 scale-105" : "text-gray-400 group-hover:text-gray-600"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

