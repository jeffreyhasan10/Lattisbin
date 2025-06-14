
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className = "",
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <span>{trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
