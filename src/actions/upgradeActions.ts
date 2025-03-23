import { Alert } from 'react-native';
import { BraydenStats } from '../types/BraydenTypes';
import { Upgrade, getUpgradeNextLevelCost, UPGRADES } from '../data/upgrades';
import { StateDispatch } from '../types/BraydenTypes';
import logger from '../utils/logger';

/**
 * Purchase or upgrade an item
 */
export const purchaseUpgrade = ({
  id,
  stats,
  setStats,
  upgrades, 
  setUpgrades,
  saveData
}: { 
  id: string,
  stats: BraydenStats,
  setStats: StateDispatch<BraydenStats>,
  upgrades: Upgrade[],
  setUpgrades: StateDispatch<Upgrade[]>,
  saveData: () => Promise<any>
}): boolean => {
  logger.debug(`Attempting to purchase/upgrade: ${id}`);
  
  const upgradeIndex = upgrades.findIndex(upgrade => upgrade.id === id);
  
  if (upgradeIndex === -1) {
    logger.error(`Upgrade not found: ${id}`);
    Alert.alert("Error", "This upgrade doesn't exist.");
    return false;
  }
  
  const upgrade = upgrades[upgradeIndex];
  
  // Check if upgrade is unlocked and not at max level
  if (!upgrade.isUnlocked) {
    Alert.alert("Locked", "This upgrade is not yet unlocked.");
    return false;
  }
  
  if (upgrade.level >= upgrade.maxLevel) {
    Alert.alert("Max Level", "This upgrade is already at maximum level.");
    return false;
  }
  
  // Calculate cost for the next level
  const cost = getUpgradeNextLevelCost(upgrade);
  
  // Check if player can afford it
  if (stats.money < cost) {
    Alert.alert(
      "Not Enough Money",
      `You need $${cost} to purchase this upgrade.`,
      [{ text: "OK" }]
    );
    return false;
  }
  
  // Purchase the upgrade
  const newLevel = upgrade.isPurchased ? upgrade.level + 1 : 1;
  
  const updatedUpgrades = [...upgrades];
  updatedUpgrades[upgradeIndex] = {
    ...upgrade,
    isPurchased: true,
    level: newLevel
  };
  
  // Deduct money and update stats
  setStats(prev => ({
    ...prev,
    money: prev.money - cost
  }));
  
  // Update upgrades state
  setUpgrades(updatedUpgrades);
  
  // Save changes
  saveData().catch(error => {
    logger.error(`Error saving upgrade purchase: ${error}`);
  });
  
  // Show success message
  Alert.alert(
    "Upgrade Purchased", 
    `You've ${upgrade.isPurchased ? 'upgraded' : 'purchased'} ${upgrade.name} to level ${newLevel}!`,
    [{ text: "Great!" }]
  );
  
  return true;
};

/**
 * Reset all upgrades (for testing or game reset)
 */
export const resetUpgrades = ({
  setUpgrades,
  saveData
}: {
  setUpgrades: StateDispatch<Upgrade[]>,
  saveData: () => Promise<any>
}) => {
  setUpgrades(UPGRADES);
  saveData().catch(error => {
    logger.error(`Error saving upgrades reset: ${error}`);
  });
};

/**
 * Check and unlock new upgrades based on player level
 */
export const checkAndUnlockUpgrades = ({
  stats,
  upgrades,
  setUpgrades,
  saveData
}: {
  stats: BraydenStats,
  upgrades: Upgrade[],
  setUpgrades: StateDispatch<Upgrade[]>,
  saveData: () => Promise<any>
}): boolean => {
  let anyUnlocked = false;
  const updatedUpgrades = [...upgrades];
  
  // Define level-based unlocks
  const levelUnlocks = [
    { level: 3, upgradeId: 'learning_conference' },
    { level: 5, upgradeId: 'money_investments' }
  ];
  
  levelUnlocks.forEach(unlock => {
    if (stats.level >= unlock.level) {
      const index = updatedUpgrades.findIndex(upgrade => upgrade.id === unlock.upgradeId);
      if (index !== -1 && !updatedUpgrades[index].isUnlocked) {
        updatedUpgrades[index] = {
          ...updatedUpgrades[index],
          isUnlocked: true
        };
        anyUnlocked = true;
      }
    }
  });
  
  if (anyUnlocked) {
    setUpgrades(updatedUpgrades);
    saveData().catch(error => {
      logger.error(`Error saving upgrade unlocks: ${error}`);
    });
    
    Alert.alert(
      "New Upgrades Unlocked!",
      "You've reached a new level and unlocked new upgrades. Check them out in the upgrade screen!",
      [{ text: "Awesome!" }]
    );
    return true;
  }
  
  return false;
}; 