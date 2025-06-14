
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ReportCardProps {
  title: string;
  amount: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, amount, change, trend, icon: Icon }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{amount}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${
              trend === "up" ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
