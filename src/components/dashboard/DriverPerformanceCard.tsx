
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DriverMetric {
  id: string;
  name: string;
  status: string;
  totalOrders: number;
  completedOrders: number;
  earnings: number;
  rating: number;
}

interface DriverPerformanceCardProps {
  driverMetrics: DriverMetric[];
}

const DriverPerformanceCard: React.FC<DriverPerformanceCardProps> = ({ driverMetrics }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Driver Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {driverMetrics.map((driver) => (
            <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{driver.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{driver.id}</span>
                    <Badge variant={driver.status === "Active" ? "default" : "secondary"}>
                      {driver.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-gray-100">RM {driver.earnings}</p>
                <p className="text-sm text-gray-500">{driver.completedOrders}/{driver.totalOrders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverPerformanceCard;
