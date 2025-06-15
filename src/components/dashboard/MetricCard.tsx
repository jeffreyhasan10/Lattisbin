
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

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
  return (
    <Card className={`relative overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-200/20">
              <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/20 pointer-events-none" />
      </CardContent>
    </Card>
  );
};

export default MetricCard;
