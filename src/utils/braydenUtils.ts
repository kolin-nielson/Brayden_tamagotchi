import { BraydenStats } from '../types/BraydenTypes';
import { Achievement } from '../data/achievements';
import { Upgrade, getActiveUpgrades, getUpgradeEffectValue, UpgradeEffectType } from '../data/upgrades';

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