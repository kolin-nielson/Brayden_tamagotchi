import React, { createContext, useContext, ReactNode } from 'react';
import { useShop } from '../hooks/useShop';
import { ShopContextType } from '../types/shop.types';

// Create the context with a default undefined value
const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const shopData = useShop();
  
  return (
    <ShopContext.Provider value={shopData}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook for using the shop context
export const useShopContext = (): ShopContextType => {
  const context = useContext(ShopContext);
  
  if (context === undefined) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  
  return context;
}; 