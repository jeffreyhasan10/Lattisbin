import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { ChevronRight, HelpCircle, Home } from 'lucide-react';

const NotFound = () => {
  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
          <CardHeader className="text-center">
            <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              404
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-2">
              Oops! Page Not Found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <svg
              className="w-32 h-32 md:w-40 md:h-40 text-blue-500/50 dark:text-blue-400/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md"
                aria-label="Return to Dashboard"
              >
                <Link to="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                asChild
                variant="outline"
                className="bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200/30 dark:border-gray-700/30"
                aria-label="Contact Support"
              >
                <a href="mailto:support@lattisewm.com">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </a>
              </Button>
            </motion.div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold">404</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;