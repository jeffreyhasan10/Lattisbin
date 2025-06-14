import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, MapPin, Package2, Scale, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface CollectionCardProps {
  collection: {
    id: number;
    type: string;
    date: string;
    images: string[];
    weight: string;
    customer: string;
    binSN: string;
    location: string;
  };
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const { type, date, images, weight, customer, binSN, location } = collection;

  const formattedDate = new Date(date).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 h-full flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
          <div className="flex justify-between items-start mb-2">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 font-medium rounded-full px-2.5 py-0.5">
              {type}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-white/10 text-white hover:bg-white/20 dark:hover:bg-gray-700/50 dark:text-gray-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View collection details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-white text-lg font-semibold tracking-tight flex items-center gap-1.5">
            <span>Collection</span>
            <span className="text-blue-200">#{binSN}</span>
          </CardTitle>
          <p className="mt-1 text-xs text-white/80 dark:text-gray-300">{customer}</p>
        </CardHeader>
        <CardContent className="p-4 space-y-4 flex-1 flex flex-col">
          <div className="text-sm space-y-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Package2 className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span>Bin: {binSN}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Scale className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span>Weight: {weight}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Collection Images
            </p>
            <div className="grid grid-cols-3 gap-2">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300 shadow-sm group">
                          <img
                            src={image}
                            alt={`Collection image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-gray-800">
                        <p>Click to view full image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                <div className="col-span-3 text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  No images available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CollectionCard;