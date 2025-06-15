import React, { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

import {
  Bell,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  MessageSquare,
  LogOut,
  Home,
  Building2,
  Users,
  Package2,
  Truck,
  UserCheck,
  Upload,
  CalendarRange,
  FileText,
  BarChart3,
  ChevronDown,
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle,
  Info,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";

interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
}

interface MenuItem {
  tab: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
  status: "available" | "in-use" | "maintenance";
}

interface MenuGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
}

interface ExpandedGroups {
  systemSetup: boolean;
  management: boolean;
  operations: boolean;
  financials: boolean;
  analytics: boolean;
  system: boolean;
  reports: boolean;
  compliance: boolean;
  logistics: boolean;
  support: boolean;
}

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>({
    systemSetup: false,
    management: true,
    operations: true,
    financials: false,
    analytics: false,
    system: false,
    reports: false,
    compliance: false,
    logistics: false,
    support: false,
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Road tax for lorry ABC123 expires in 30 days", type: "warning", timestamp: "2025-04-19 10:00" },
    { id: 2, message: "Insurance for lorry XYZ789 expires in 15 days", type: "error", timestamp: "2025-04-19 09:30" },
    { id: 3, message: "New booking received", type: "info", timestamp: "2025-04-19 08:45" },
    { id: 4, message: "System update completed", type: "success", timestamp: "2025-04-19 07:00" },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      setSidebarCollapsed(true);
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        mobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, mobileMenuOpen]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileMenuOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
    if (showUserMenu) setShowUserMenu(false);
  }, [showUserMenu]);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu((prev) => !prev);
    if (showNotifications) setShowNotifications(false);
  }, [showNotifications]);

  const menuGroups: MenuGroup[] = [
    {
      id: "systemSetup",
      label: "System Setup",
      icon: Settings,
      items: [
        { tab: "business-register", label: "Business Registration", icon: Building2, description: "Register new businesses", status: "available" },
        { tab: "customer-register", label: "Customer Registration", icon: Users, description: "Add new customers", status: "in-use" },
        { tab: "bin-register", label: "Bin Registration", icon: Package2, description: "Register waste bins", status: "available" },
        { tab: "lorry-register", label: "Lorry Registration", icon: Truck, description: "Add lorries to fleet", status: "maintenance" },
        { tab: "rentable-lorry-register", label: "Rentable Lorry Registration", icon: Truck, description: "Register rentable lorries", status: "available" },
        { tab: "driver-register", label: "Driver Registration", icon: UserCheck, description: "Add new drivers", status: "in-use" },
        { tab: "waste-item-register", label: "Waste Item Registration", icon: Upload, description: "Register waste types", status: "available" },
      ],
    },
    {
      id: "management",
      label: "Management",
      icon: Building2,
      items: [
        { tab: "company", label: "Company Details", icon: Building2, badge: "New", description: "Manage company info", status: "available" },
        { tab: "customers", label: "Customers", icon: Users, badge: "New", description: "View customer details", status: "in-use" },
        { tab: "bins", label: "Bins", icon: Package2, description: "Manage bin inventory", status: "maintenance" },
        { tab: "lorries", label: "Lorries", icon: Truck, description: "View lorry details", status: "available" },
        { tab: "drivers", label: "Drivers", icon: UserCheck, description: "Manage driver accounts", status: "available" },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      icon: Upload,
      items: [
        { tab: "waste", label: "Collections", icon: Upload, badge: "5", description: "Manage waste collections", status: "in-use" },
        { tab: "bookings", label: "Bookings", icon: CalendarRange, badge: "12", description: "View bookings", status: "available" },
      ],
    },
    {
      id: "financials",
      label: "Financials",
      icon: DollarSign,
      items: [
        { tab: "invoices", label: "Invoices", icon: FileText, description: "Manage invoices", status: "available" },
        { tab: "commissions", label: "Commissions", icon: DollarSign, description: "Track commissions", status: "in-use" },
        { tab: "refunds", label: "Refunds", icon: Receipt, description: "Process refunds", status: "maintenance" },
        { tab: "expenses", label: "Expenses", icon: DollarSign, description: "Track expenses", status: "available" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      items: [
        { tab: "reports", label: "Reports", icon: BarChart3, description: "Generate reports", status: "available" },
      ],
    },
    {
      id: "system",
      label: "System",
      icon: Settings,
      items: [
        { tab: "settings", label: "Settings", icon: Settings, description: "Configure system settings", status: "available" },
      ],
    },
  ];

  const shouldShowIconsOnly = !isMobile && sidebarCollapsed;

  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)} />
      )}
      <motion.aside
        ref={sidebarRef}
        initial={{ width: shouldShowIconsOnly ? 70 : 260, x: isMobile ? -260 : 0 }}
        animate={{ width: shouldShowIconsOnly ? 70 : 260, x: isMobile ? (mobileMenuOpen ? 0 : -260) : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col ${isMobile ? "fixed h-full z-50" : "sticky top-0 h-screen"} scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 overflow-visible custom-scrollbar`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
          <motion.div className="flex items-center justify-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-xl">L</span>
            </div>
            {!shouldShowIconsOnly && (
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Lattis<span className="text-blue-600 dark:text-blue-400">EWM</span></h1>
            )}
          </motion.div>
        </div>
        <div className="flex-1 py-4 px-2 overflow-y-auto custom-scrollbar">
          <div className="px-2 mb-4">
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex ${shouldShowIconsOnly ? "justify-center items-center" : "items-center gap-3"} rounded-lg p-2.5 transition-all duration-200 min-h-[44px] shadow-sm ${activeTab === "overview" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                onClick={() => handleTabChange("overview")}
                aria-label="Dashboard Overview"
              >
                <Home className="h-5 w-5 min-w-5 min-h-5" />
                {!shouldShowIconsOnly && <span className="text-sm font-medium">Dashboard</span>}
              </motion.button>
              {shouldShowIconsOnly && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200">
                  Dashboard
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1">
            {menuGroups.map((group) => (
              <div key={group.id}>
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex ${shouldShowIconsOnly ? "justify-center items-center" : "items-center justify-between"} text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 p-2.5 rounded-lg transition-all duration-200 min-h-[44px] hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    {shouldShowIconsOnly ? (
                      <group.icon className="h-5 w-5 min-w-5 min-h-5" />
                    ) : (
                      <>
                        <span>{group.label}</span>
                        <motion.div animate={{ rotate: expandedGroups[group.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                  {shouldShowIconsOnly && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200">
                      {group.label}
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {expandedGroups[group.id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="pl-2">
                      {group.items.map((item) => (
                        <div key={item.tab} className="relative group">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full flex ${shouldShowIconsOnly ? "justify-center items-center" : "items-center gap-3"} rounded-lg p-2.5 transition-all duration-200 min-h-[44px] shadow-sm ${activeTab === item.tab ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            onClick={() => handleTabChange(item.tab)}
                            aria-label={item.label}
                          >
                            <item.icon className="h-5 w-5 min-w-5 min-h-5" />
                            {!shouldShowIconsOnly && (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-sm font-medium truncate">{item.label}</span>
                                {item.badge && (
                                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "available" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" : item.status === "in-use" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </motion.button>
                          {shouldShowIconsOnly && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200">
                              {item.label}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <div className="relative group">
            <div className="flex items-center justify-start gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-base">JD</span>
              </div>
              {!shouldShowIconsOnly && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              )}
            </div>
            {shouldShowIconsOnly && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200">
                John Doe
              </div>
            )}
          </div>
        </div>
      </motion.aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 px-4 py-3 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <motion.button
                ref={menuButtonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={toggleSidebar}
                aria-label={isMobile ? (mobileMenuOpen ? "Close menu" : "Open menu") : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isMobile ? (
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
              <div className="relative w-full max-w-xs hidden sm:block">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search dashboard..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all duration-200"
                  aria-label="Search dashboard"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleNotifications} aria-label="Notifications">
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-medium">{notifications.length}</span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <span>Notifications</span>
                        {notifications.length > 0 && (
                          <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500" onClick={() => setNotifications([])}>
                            Clear all
                          </button>
                        )}
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className={`px-4 py-3 flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-700 ${notification.type === "error" ? "text-red-500" : notification.type === "warning" ? "text-amber-800 dark:text-amber-300" : notification.type === "success" ? "text-emerald-800 dark:text-emerald-300" : "text-blue-800 dark:text-blue-300"} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}>
                            <div className="flex items-center gap-2">
                              {notification.type === "error" && <AlertCircle className="h-4 w-4" />}
                              {notification.type === "warning" && <AlertCircle className="h-4 w-4" />}
                              {notification.type === "success" && <CheckCircle className="h-4 w-4" />}
                              {notification.type === "info" && <Info className="h-4 w-4" />}
                              <div>
                                <span className="flex-1">{notification.message}</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</p>
                              </div>
                            </div>
                            <button onClick={() => dismissNotification(notification.id)} className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ml-2">
                              Dismiss
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">No notifications to display</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleUserMenu} aria-label="User menu">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                    <span className="font-bold text-white text-sm">JD</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                  </div>
                </motion.button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">My Account</div>
                      <button 
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => handleTabChange("settings")}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700" />
                      <button 
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                        onClick={() => navigate("/")}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="mt-3 relative sm:hidden">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all duration-200" aria-label="Search dashboard" />
          </div>
        </motion.header>
        <main className="flex-1 bg-gray-100 dark:bg-gray-950 p-4 sm:p-6">
          <Outlet />
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2025 Lattis EWM. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service", "Support", "Contact Us", "About", "Careers"].map((link) => (
                <a key={link} href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;