import { BraydenStats, DEFAULT_STATS } from '../types/BraydenTypes';
import { Achievement, ACHIEVEMENTS } from '../data/achievements';
import { Upgrade, UPGRADES, getActiveUpgrades, getUpgradeEffectValue, UpgradeEffectType } from '../data/upgrades';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from './logger';

/**
 * Calculate the boost value for a specific stat type
 */
export const getBoostValue = (statType: UpgradeEffectType, stats: BraydenStats): number => {
  // Placeholder until we have the upgrades array from context
  // In real implementation, this would come from the context
  const upgrades: Upgrade[] = []; // This will come from context
  
  // Get active upgrades that affect this stat
  const activeUpgrades = getActiveUpgrades(upgrades);
  const relevantUpgrades = activeUpgrades.filter(upgrade => upgrade.effect === statType);
  
  // Calculate total boost
  let totalBoost = 0;
  for (const upgrade of relevantUpgrades) {
    totalBoost += getUpgradeEffectValue(upgrade);
  }
  
  return totalBoost;
};

/**
 * Convert boost to multiplier (for percentage-based boosts)
 */
export const getBoostMultiplier = (statType: UpgradeEffectType, stats: BraydenStats): number => {
  const boostValue = getBoostValue(statType, stats);
  
  // Convert percentage boost to multiplier (e.g. 0.2 = 20% boost = 1.2x multiplier)
  return 1 + boostValue;
};

/**
 * Get a text description of the boost
 */
export const getBoostDescription = (statType: UpgradeEffectType, stats: BraydenStats): string => {
  const boostValue = getBoostValue(statType, stats);
  if (boostValue <= 0) return 'No boost';
  
  const boostPercent = Math.round(boostValue * 100);
  return `+${boostPercent}%`;
};

/**
 * Calculate the stat boost from equipped items
 */
export const getStatBoost = (statType: string, stats: BraydenStats): number => {
  // This function is maintained for backward compatibility
  // It will be phased out in favor of getBoostValue and getBoostMultiplier
  
  switch (statType) {
    case 'happiness':
      return getBoostValue('happiness_gain', stats);
    case 'energy':
      return getBoostValue('energy_efficiency', stats);
    case 'money':
      return getBoostValue('money_multiplier', stats);
    case 'experience':
      return getBoostValue('xp_multiplier', stats);
    case 'hunger':
      return getBoostValue('hunger_efficiency', stats);
    default:
      return 0;
  }
};

/**
 * Load Brayden's data from AsyncStorage
 */
export const loadBraydenData = async () => {
  try {
    // Load stats
    let loadedStats = DEFAULT_STATS;
    const statsData = await AsyncStorage.getItem('stats');
    if (statsData) {
      const parsedStats = JSON.parse(statsData);
      // Ensure all properties are present (for backward compatibility)
      loadedStats = {
        ...DEFAULT_STATS,
        ...parsedStats,
        lastUpdated: parsedStats.lastUpdated || Date.now()
      };
    }

    // Load achievements
    let loadedAchievements = ACHIEVEMENTS;
    const achievementsData = await AsyncStorage.getItem('achievements');
    if (achievementsData) {
      const parsedAchievements = JSON.parse(achievementsData);
      // Make sure all achievements are included, even new ones added in updates
      loadedAchievements = ACHIEVEMENTS.map(achievement => {
        const savedAchievement = parsedAchievements.find((a: Achievement) => a.id === achievement.id);
        return savedAchievement ? { ...achievement, isUnlocked: savedAchievement.isUnlocked } : achievement;
      });
    }

    // Load upgrades
    let loadedUpgrades = UPGRADES;
    const upgradesData = await AsyncStorage.getItem('upgrades');
    if (upgradesData) {
      const parsedUpgrades = JSON.parse(upgradesData);
      // Make sure all upgrades are included, even new ones added in updates
      loadedUpgrades = UPGRADES.map(upgrade => {
        const savedUpgrade = parsedUpgrades.find((u: Upgrade) => u.id === upgrade.id);
        return savedUpgrade ? { 
          ...upgrade, 
          level: savedUpgrade.level || 0,
          isUnlocked: savedUpgrade.isUnlocked || false
        } : upgrade;
      });
    }
    
    logger.info('Brayden data loaded successfully');
    return { stats: loadedStats, achievements: loadedAchievements, upgrades: loadedUpgrades };
  } catch (error) {
    logger.error('Error loading Brayden data:', error);
    return { 
      stats: DEFAULT_STATS, 
      achievements: ACHIEVEMENTS,
      upgrades: UPGRADES
    };
  }
};

/**
 * Save Brayden's data to AsyncStorage
 */
export const saveBraydenData = async (
  stats: BraydenStats,
  achievements: Achievement[],
  upgrades: Upgrade[]
) => {
  try {
    await AsyncStorage.setItem('stats', JSON.stringify(stats));
    await AsyncStorage.setItem('achievements', JSON.stringify(achievements));
    await AsyncStorage.setItem('upgrades', JSON.stringify(upgrades));
    logger.debug('Brayden data saved successfully');
    return true;
  } catch (error) {
    logger.error('Error saving Brayden data:', error);
    return false;
  }
};

/**
 * Check for achievements that can be unlocked based on current stats
 */
export const checkForAchievements = (
  stats: BraydenStats,
  achievements: Achievement[],
  unlockAchievement: (id: string) => void,
  totalMoneyEarned: { current: number },
  dizzyCount: { current: number }
) => {
  // Level achievements
  if (stats.level >= 3) unlockAchievement('level_3');
  if (stats.level >= 5) unlockAchievement('level_5');
  if (stats.level >= 10) unlockAchievement('level_10');
  
  // Money achievements
  if (stats.money >= 1000) unlockAchievement('money_1000');
  if (totalMoneyEarned.current >= 5000) unlockAchievement('earn_5000');
  
  // Stat achievements
  if (stats.happiness >= 90) unlockAchievement('happy_90');
  if (stats.energy >= 90) unlockAchievement('energy_90');
  
  // Special achievements
  if (dizzyCount.current >= 5) unlockAchievement('dizzy_5');
  if (stats.streak >= 3) unlockAchievement('streak_3');
  if (stats.streak >= 7) unlockAchievement('streak_7');
}; 