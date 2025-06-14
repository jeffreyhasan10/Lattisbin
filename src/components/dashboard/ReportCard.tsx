import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion

export interface ReportCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
}

const ReportCard = ({ title, value, change, trend = 'neutral', icon: Icon }: ReportCardProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 0.6, repeat: 1 } }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } }
  };

  const trendVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.4 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, translateY: -4, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border-gold/20 shadow-lg bg-white rounded-2xl transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <motion.p 
                className="text-sm text-muted-foreground font-display font-medium tracking-wide"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {title}
              </motion.p>
              <motion.p 
                className="text-3xl font-bold font-display bg-gradient-to-r from-navy to-simatex-purple bg-clip-text text-transparent tracking-tight"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                key={value} // Trigger animation on value change
              >
                {value}
              </motion.p>
            </div>
            {Icon && (
              <motion.div
                className="h-12 w-12 rounded-full bg-gradient-to-br from-simatex-purple/20 to-gold/20 flex items-center justify-center shadow-md"
                variants={iconVariants}
                initial="initial"
                animate="pulse"
                whileHover="hover"
              >
                <Icon className="h-6 w-6 text-simatex-purple" />
              </motion.div>
            )}
          </div>
          
          {change && (
            <motion.div
              className="mt-4 flex items-center"
              variants={trendVariants}
              initial="hidden"
              animate="visible"
              key={change} // Trigger animation on change update
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: trend === 'up' ? -10 : trend === 'down' ? 10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <TrendIcon className={`h-4 w-4 mr-1.5 ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 'text-gray-400'
                }`} />
              </motion.div>
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 'text-gray-400'
              }`}>
                {change}
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportCard;