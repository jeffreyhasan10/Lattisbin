import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Download, MapPin, Activity, Clock, CheckCircle, DollarSign } from "lucide-react";
import { format } from "date-fns";
import NotificationCenter from "./NotificationCenter";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedDate,
  onDateSelect,
  searchTerm,
  onSearchChange,
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    console.log("Exporting dashboard data...");
    toast({
      title: "Export Started",
      description: "Dashboard data is being exported. You'll receive it shortly.",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Dashboard data has been exported successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Dashboard Overview
            </h1>
            <p className="text-blue-100 text-lg">
              Monitor your fleet operations and performance in real-time
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-200 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-300" />
                <span>Kuala Lumpur, Malaysia</span>
              </div>
              <span className="text-blue-300">•</span>
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5 z-10" />
              <Input
                placeholder="Search drivers, orders, locations..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border-2 border-gray-200 text-black w-full sm:w-80 rounded-xl shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white text-black border-2 border-gray-200 rounded-xl shadow-lg px-6 py-3 font-medium hover:bg-white hover:text-black"
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-black" />
                  {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-2 border-gray-200 shadow-xl rounded-xl">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="bg-white text-black border-2 border-gray-200 rounded-xl shadow-lg px-6 py-3 font-medium hover:bg-white hover:text-black"
            >
              <Download className="mr-2 h-5 w-5 text-black" />
              Export
            </Button>
            
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 [&_.notification-text]:text-black [&_.notification-title]:text-black [&_.notification-description]:text-gray-700 [&_.notification-time]:text-gray-500">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Active Today", 
            value: "24", 
            color: "from-green-500 to-emerald-600",
            icon: <Activity className="h-6 w-6 text-white" />
          },
          { 
            label: "In Progress", 
            value: "18", 
            color: "from-blue-500 to-cyan-600",
            icon: <Clock className="h-6 w-6 text-white" />
          },
          { 
            label: "Completed", 
            value: "156", 
            color: "from-purple-500 to-violet-600",
            icon: <CheckCircle className="h-6 w-6 text-white" />
          },
          { 
            label: "Revenue", 
            value: "RM 12.5K", 
            color: "from-orange-500 to-red-600",
            icon: <DollarSign className="h-6 w-6 text-white" />
          }
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-90 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;