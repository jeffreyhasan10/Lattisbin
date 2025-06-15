import {
  Users,
  LayoutDashboard,
  TruckIcon, 
  CalendarCheck, 
  FileText, 
  CreditCard, 
  BarChart3,
  Repeat,
  Sigma,
  BookOpenCheck,
  Database
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const FeaturesSection = () => {
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const features = [
    {
      id: "customers",
      name: "Customer Management",
      icon: <Users className="w-5 h-5" />,
      description: "Easily add, edit, and manage clients with detailed information including Malaysian address formats, MyKad numbers, and GST/SST details.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "inventory",
      name: "Bin Inventory",
      icon: <Database className="w-5 h-5" />,
      description: "Track and manage bins by serial number, size, and availability status across multiple locations throughout Malaysia.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "tracking",
      name: "Lorry Tracking",
      icon: <TruckIcon className="w-5 h-5" />,
      description: "Monitor your lorry fleet with real-time tracking, maintenance schedules, and road tax/insurance expiry alerts.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "bookings",
      name: "Bookings",
      icon: <CalendarCheck className="w-5 h-5" />,
      description: "Create delivery orders with flexible scheduling options for same-day or term collections across all Malaysian states.",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "invoicing",
      name: "Invoicing",
      icon: <FileText className="w-5 h-5" />,
      description: "Automatically generate invoices linked to delivery orders, with local tax compliance and Malaysian payment terms.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "payments",
      name: "Payments",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Record and process multiple payment methods including cash, online banking, CDM, and popular Malaysian e-wallets.",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "reports",
      name: "Reports",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Access comprehensive reports for customers, bins, lorries, bookings, and sales with Malaysian tax reporting.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000"
    },
  ];

  const dashboardRoles = [
    {
      id: "admin",
      title: "Admin Dashboard",
      description: "Complete system control with access to all features, customer data, and administrative functions.",
      image: "./assets/lattis.jpg"
    },
    {
      id: "driver",
      title: "Driver Dashboard",
      description: "Optimized for mobility with delivery schedules, navigation, collection confirmations, and payment receipt.",
      image: "./assets/lattis2.jpg"
    }
  ];

  const showSignupPrompt = () => {
    toast.info("Sign up to access our premium bin management system", {
      action: {
        label: "Sign Up",
        onClick: () => setSignupModalOpen(true)
      }
    });
  };

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful <span className="text-gradient">Dashboard Features</span></h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our comprehensive Bin Management System offers a range of powerful features to streamline your waste management operations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-simatex-purple/20 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={showSignupPrompt}
            >
              <div className="w-12 h-12 bg-simatex-purple/10 rounded-lg flex items-center justify-center text-simatex-purple mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.name}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-lg border border-gray-100 opacity-0 animate-fade-in animate-delay-500">
          <h3 className="text-2xl font-semibold mb-8 text-center">Dashboard for Every Role</h3>
          
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              {dashboardRoles.map((role) => (
                <TabsTrigger key={role.id} value={role.id} className="text-base">
                  {role.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dashboardRoles.map((role) => (
              <TabsContent key={role.id} value={role.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h4 className="text-2xl font-semibold mb-4 text-simatex-purple">{role.title}</h4>
                    <p className="text-gray-700 mb-6">{role.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {role.id === "admin" && (
                        <>
                          <li className="flex items-center">
                            <div className="w-6 h-6 bg-simatex-purple/10 rounded-full flex items-center justify-center text-simatex-purple mr-3">
                              <Users size={14} />
                            </div>
                            <span>Complete customer management</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 bg-simatex-purple/10 rounded-full flex items-center justify-center text-simatex-purple mr-3">
                              <LayoutDashboard size={14} />
                            </div>
                            <span>Full system configuration</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 bg-simatex-purple/10 rounded-full flex items-center justify-center text-simatex-purple mr-3">
                              <BarChart3 size={14} />
                            </div>
                            <span>Advanced analytics and reports</span>
                          </li>
                        </>
                      )}
                      
                      {role.id === "driver" && (
                        <>
                          <li className="flex items-center">
                            <div className="w-6 h-6 bg-simatex-purple/10 rounded-full flex items-center justify-center text-simatex-purple mr-3">
                              <TruckIcon size={14} />
                            </div>
                            <span>Route optimization</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 bg-simatex-purple/10 rounded-full flex items-center justify-center text-simatex-purple mr-3">
                              <CalendarCheck size={14} />
                            </div>
                            <span>Collection schedules</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 bg-simatex-purple/10 rounded-full flex items-center justify-center text-simatex-purple mr-3">
                              <BookOpenCheck size={14} />
                            </div>
                            <span>Digital proof of service</span>
                          </li>
                        </>
                      )}
                    </ul>
                    
                    <Button 
                      className="bg-simatex-purple hover:bg-simatex-purple-dark"
                      onClick={showSignupPrompt}
                    >
                      Try the {role.title}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                      <img 
                        src={role.image} 
                        alt={`${role.title} preview`} 
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-6 text-white">
                          <h5 className="font-semibold text-xl">{role.title}</h5>
                          <p className="text-sm text-gray-300">Sign up to access</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;