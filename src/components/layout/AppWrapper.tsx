
import React from 'react';
import { OrderProvider } from '@/contexts/OrderContext';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <OrderProvider>
      {children}
    </OrderProvider>
  );
};

export default AppWrapper;
