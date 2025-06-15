
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customer: string;
  date: string;
  location: string;
  status: string;
  driverId: string;
  driverName: string;
}

const latestOrders: Order[] = [
  {
    id: "1",
    customer: "ABC Construction",
    date: "2024-01-20",
    location: "Johor Bahru",
    status: "Pending",
    driverId: "DRV001",
    driverName: "Ahmad Rahman"
  },
  {
    id: "2",
    customer: "XYZ Development",
    date: "2024-01-19",
    location: "Kuala Lumpur",
    status: "Completed",
    driverId: "DRV002",
    driverName: "Lim Wei Ming"
  },
  {
    id: "3",
    customer: "PQR Builders",
    date: "2024-01-18",
    location: "Penang",
    status: "In Transit",
    driverId: "DRV001",
    driverName: "Ahmad Rahman"
  },
];

const LatestOrdersTable: React.FC = () => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Latest Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Driver</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id}>
                  <td className="border-t px-4 py-2">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </td>
                  <td className="border-t px-4 py-2">
                    <div>
                      <p className="font-medium">{order.driverName}</p>
                      <p className="text-xs text-gray-500">{order.driverId}</p>
                    </div>
                  </td>
                  <td className="border-t px-4 py-2">{order.location}</td>
                  <td className="border-t px-4 py-2">
                    <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestOrdersTable;
