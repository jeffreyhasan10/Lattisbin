import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion"; // Import Framer Motion
import { ArrowUp, ArrowDown } from "lucide-react"; // Add trend icons

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const cardVariants = cva(
  "overflow-hidden transition-all duration-300 bg-white rounded-xl", {
    variants: {
      variant: {
        default: "border-l-4 border-l-simatex-purple shadow-lg hover:shadow-xl",
        success: "border-l-4 border-l-green-500 shadow-lg hover:shadow-xl",
        warning: "border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl",
        danger: "border-l-4 border-l-red-500 shadow-lg hover:shadow-xl",
        info: "border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const iconVariants = cva(
  "h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300", {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-simatex-purple/20 to-simatex-purple/10 text-simatex-purple",
        success: "bg-gradient-to-br from-green-500/20 to-green-500/10 text-green-500",
        warning: "bg-gradient-to-br from-amber-500/20 to-amber-500/10 text-amber-500",
        danger: "bg-gradient-to-br from-red-500/20 to-red-500/10 text-red-500",
        info: "bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-500",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  change,
  variant = "default"
}: MetricCardProps) => {
  // Animation variants for the card
  const cardAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Animation variants for the icon
  const iconAnimationVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 0.6, repeat: 1 } }
  };

  // Animation variants for text elements
  const textAnimationVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } }
  };

  return (
    <motion.div
      variants={cardAnimationVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className={cardVariants({ variant })}>
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <motion.p 
              className="text-sm text-muted-foreground font-medium tracking-wide"
              variants={textAnimationVariants}
              initial="hidden"
              animate="visible"
            >
              {title}
            </motion.p>
            <motion.p 
              className="text-3xl font-bold text-foreground tracking-tight"
              variants={textAnimationVariants}
              initial="hidden"
              animate="visible"
              key={value} // Trigger animation on value change
            >
              {value}
            </motion.p>
            {change && (
              <motion.p
                className={`text-xs flex items-center gap-1.5 font-medium
                  ${trend === 'up' ? 'text-green-500' : 
                    trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}
                variants={textAnimationVariants}
                initial="hidden"
                animate="visible"
                key={change} // Trigger animation on change update
              >
                {trend === 'up' && <ArrowUp className="h-3 w-3" />}
                {trend === 'down' && <ArrowDown className="h-3 w-3" />}
                {change}
              </motion.p>
            )}
          </div>
          <motion.div
            className={iconVariants({ variant })}
            variants={iconAnimationVariants}
            initial="initial"
            animate="pulse"
            whileHover="hover"
          >
            <Icon className="h-7 w-7" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;