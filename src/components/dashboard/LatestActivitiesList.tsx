
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  time: string;
  location: string;
  activity: string;
  status: string;
  driverId: string;
}

const latestActivities: Activity[] = [
  {
    id: "1",
    time: "08:00 AM",
    location: "Site A, Johor",
    activity: "Bin Deployment",
    status: "Completed",
    driverId: "DRV001"
  },
  {
    id: "2",
    time: "10:30 AM",
    location: "Site B, KL",
    activity: "Waste Collection",
    status: "In Transit",
    driverId: "DRV002"
  },
  {
    id: "3",
    time: "02:15 PM",
    location: "Site C, Penang",
    activity: "Maintenance Check",
    status: "Pending",
    driverId: "DRV003"
  },
];

const LatestActivitiesList: React.FC = () => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Latest Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {latestActivities.map((activity) => (
            <li key={activity.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.activity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.location} - {activity.time}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Driver: {activity.driverId}
                  </p>
                </div>
                <Badge variant="secondary">{activity.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LatestActivitiesList;
