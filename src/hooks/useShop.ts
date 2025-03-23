import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { ShopItem, UseItemParams } from '../types/shop.types';
import { useBrayden } from '../contexts/BraydenContext';
import { useDataPersistence } from './useDataPersistence';
import logger from '../utils/logger';
import { SHOP_ITEMS } from '../data/shopItems';

interface UseShopResult {
  items: ShopItem[];
  inventory: { [itemId: string]: number };
  selectedCategory: string | null;
  buyItem: (itemId: string) => void;
  useItem: (params: UseItemParams) => void;
  getItemQuantity: (itemId: string) => number;
  setSelectedCategory: (category: string | null) => void;
  addItemToInventory: (itemId: string, quantity?: number) => void;
  removeItemFromInventory: (itemId: string, quantity?: number) => void;
}

export const useShop = (): UseShopResult => {
  const { stats, setStats } = useBrayden();
  const { saveData, loadData } = useDataPersistence();
  const [items] = useState<ShopItem[]>(SHOP_ITEMS);
  const [inventory, setInventory] = useState<{ [itemId: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load inventory from storage on component mount
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const savedInventory = await loadData<{ [itemId: string]: number }>('inventory', {});
        if (savedInventory) {
          setInventory(savedInventory);
          logger.info('Shop inventory loaded from storage');
        }
      } catch (error) {
        logger.error('Failed to load inventory', error);
      }
    };

    loadInventory();
  }, [loadData]);

  const updateInventory = useCallback((itemId: string, quantity: number) => {
    setInventory(prev => {
      const newInventory = { ...prev };
      
      if (quantity <= 0) {
        // If item quantity would be zero or negative, remove it
        const currentQuantity = newInventory[itemId] || 0;
        if (currentQuantity + quantity <= 0) {
          delete newInventory[itemId];
        } else {
          newInventory[itemId] = currentQuantity + quantity;
        }
      } else {
        newInventory[itemId] = (newInventory[itemId] || 0) + quantity;
      }
      
      // Save after updating state, with the new inventory
      saveData('inventory', newInventory)
        .catch(error => {
          logger.error('Failed to save inventory:', error);
        });
      
      return newInventory;
    });
  }, [saveData]);

  const addItemToInventory = useCallback((itemId: string, quantity = 1) => {
    updateInventory(itemId, quantity);
    
    logger.info(`Added ${quantity} of item ${itemId} to inventory`);
  }, [updateInventory]);

  const removeItemFromInventory = useCallback((itemId: string, quantity = 1) => {
    updateInventory(itemId, -quantity);
    
    logger.info(`Removed ${quantity} of item ${itemId} from inventory`);
  }, [updateInventory]);

  const getItemQuantity = useCallback((itemId: string): number => {
    return inventory[itemId] || 0;
  }, [inventory]);

  const getItemById = useCallback((itemId: string): ShopItem | undefined => {
    return items.find(item => item.id === itemId);
  }, [items]);

  const buyItem = useCallback((itemId: string) => {
    const item = getItemById(itemId);
    
    if (!item) {
      logger.error(`Item with ID ${itemId} not found`);
      return;
    }
    
    if (stats.money < item.price) {
      Alert.alert('Not enough money', 'You need more money to buy this item.');
      return;
    }
    
    // Deduct money
    setStats(prev => {
      const newStats = {
        ...prev,
        money: prev.money - item.price
      };
      saveData('stats', newStats);
      return newStats;
    });
    
    // Add to inventory
    addItemToInventory(itemId);
    
    Alert.alert('Purchase Successful', `You bought ${item.name}!`);
    logger.info(`Purchased item ${item.name} for ${item.price} coins`);
  }, [stats, setStats, addItemToInventory, getItemById, saveData]);

  const applyItemEffects = useCallback((item: ShopItem) => {
    setStats(prev => {
      const newStats = { ...prev };
      
      // Apply healing effects
      if (item.healthRestored) {
        newStats.health = Math.min(100, prev.health + item.healthRestored);
      }
      
      if (item.hungerRestored) {
        newStats.hunger = Math.min(100, prev.hunger + item.hungerRestored);
      }
      
      if (item.energyRestored) {
        newStats.energy = Math.min(100, prev.energy + item.energyRestored);
      }
      
      // Apply stat boosts
      if (item.happinessBoost) {
        newStats.happiness = Math.min(100, prev.happiness + item.happinessBoost);
      }
      
      if (item.energyBoost) {
        newStats.energy = Math.min(100, prev.energy + item.energyBoost);
      }
      
      if (item.healthBoost) {
        newStats.health = Math.min(100, Math.max(0, prev.health + item.healthBoost));
      }
      
      // Cure dizzy state
      if (item.curesDizzy && prev.isDizzy) {
        newStats.isDizzy = false;
      }
      
      // Save the changes
      saveData('stats', newStats);
      
      return newStats;
    });
    
    logger.info(`Applied effects of item ${item.name}`);
  }, [setStats, saveData]);

  const useItem = useCallback(({ itemId, quantity = 1 }: UseItemParams) => {
    const item = getItemById(itemId);
    const itemQuantity = getItemQuantity(itemId);
    
    if (!item) {
      logger.error(`Item with ID ${itemId} not found`);
      return;
    }
    
    if (itemQuantity < quantity) {
      Alert.alert('Not enough items', `You don't have enough ${item.name} to use.`);
      return;
    }
    
    // Apply the item effects
    applyItemEffects(item);
    
    // Remove from inventory
    removeItemFromInventory(itemId, quantity);
    
    Alert.alert('Item Used', `You used ${item.name}!`);
    logger.info(`Used item ${item.name}`);
  }, [getItemById, getItemQuantity, applyItemEffects, removeItemFromInventory]);

  return {
    items,
    inventory,
    selectedCategory,
    buyItem,
    useItem,
    getItemQuantity,
    setSelectedCategory,
    addItemToInventory,
    removeItemFromInventory,
  };
}; 