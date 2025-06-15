
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import NotificationCenter from "./NotificationCenter";

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
  const handleExport = () => {
    console.log("Exporting dashboard data...");
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-blue-100">Monitor your fleet operations and performance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/90 border-0 text-gray-900 w-full sm:w-64"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-white/90 text-gray-900 border-0 hover:bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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
              className="bg-white/90 text-gray-900 border-0 hover:bg-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
