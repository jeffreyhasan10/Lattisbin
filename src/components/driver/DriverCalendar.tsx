
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Package,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledJob {
  id: string;
  date: Date;
  time: string;
  customer: string;
  location: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  amount: number;
}

const DriverCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'agenda'>('calendar');

  // Mock scheduled jobs data
  const scheduledJobs: ScheduledJob[] = [
    {
      id: "JOB001",
      date: new Date(),
      time: "09:00 AM",
      customer: "ABC Construction",
      location: "Jalan Ampang, KL",
      type: "Construction Waste",
      status: "scheduled",
      amount: 350.00
    },
    {
      id: "JOB002", 
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "11:00 AM",
      customer: "Green Valley Resort",
      location: "Genting Highlands",
      type: "Mixed Waste",
      status: "scheduled",
      amount: 450.00
    },
    {
      id: "JOB003",
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: "02:30 PM", 
      customer: "Sunshine Apartments",
      location: "Petaling Jaya",
      type: "Recyclable",
      status: "completed",
      amount: 280.00
    }
  ];

  // Get jobs for selected date
  const getJobsForDate = (date: Date) => {
    return scheduledJobs.filter(job => 
      job.date.toDateString() === date.toDateString()
    );
  };

  // Get dates that have jobs
  const getDatesWithJobs = () => {
    return scheduledJobs.map(job => job.date);
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "cancelled": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-white border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-3 font-bold text-blue-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            Job Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
              className="text-xs"
            >
              Calendar
            </Button>
            <Button
              variant={view === 'agenda' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('agenda')}
              className="text-xs"
            >
              Agenda
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn("p-3 pointer-events-auto border rounded-lg")}
                modifiers={{
                  hasJob: getDatesWithJobs()
                }}
                modifiersStyles={{
                  hasJob: { 
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontWeight: 'bold'
                  }
                }}
              />
            </div>

            {/* Selected Date Jobs */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {selectedDate ? (
                  `Jobs for ${selectedDate.toDateString()}`
                ) : (
                  'Select a date to view jobs'
                )}
              </h3>
              
              <div className="space-y-3">
                {selectedDateJobs.length > 0 ? (
                  selectedDateJobs.map((job) => (
                    <div key={job.id} className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs border ${getStatusColor(job.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(job.status)}
                              {job.status.toUpperCase()}
                            </div>
                          </Badge>
                          <span className="text-sm font-semibold text-slate-900">{job.time}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">RM{job.amount.toFixed(2)}</span>
                      </div>
                      
                      <h4 className="font-semibold text-slate-900 mb-1">{job.customer}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No jobs scheduled for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Agenda View */
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Jobs</h3>
            {scheduledJobs
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((job) => (
                <div key={job.id} className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs border ${getStatusColor(job.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          {job.status.toUpperCase()}
                        </div>
                      </Badge>
                      <span className="text-sm font-semibold text-slate-700">
                        {job.date.toDateString()} at {job.time}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">RM{job.amount.toFixed(2)}</span>
                  </div>
                  
                  <h4 className="font-semibold text-slate-900 mb-2">{job.customer}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverCalendar;
