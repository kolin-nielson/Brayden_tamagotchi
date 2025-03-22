import { BraydenStats } from '../types/BraydenTypes';

export type UpgradeCategory = 'productivity' | 'health' | 'learning' | 'money';
export type UpgradeEffectType = 'happiness_gain' | 'energy_efficiency' | 'money_multiplier' | 'xp_multiplier' | 'hunger_efficiency' | 'health_regeneration';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: UpgradeCategory;
  effect: UpgradeEffectType;
  baseValue: number; // Base effect value at level 1
  increment: number; // Value added per level
  level: number;
  maxLevel: number;
  baseCost: number; // Cost for level 1
  isUnlocked: boolean;
  unlockRequirement?: {
    type: 'level' | 'money' | 'upgrade';
    value: number; // Level requirement, money amount, or prerequisite upgrade level
    upgradeId?: string; // ID of prerequisite upgrade
  };
}

// Define all upgrades
export const UPGRADES: Upgrade[] = [
  // Productivity Upgrades
  {
    id: 'keyboard',
    name: 'Keyboard Upgrade',
    description: 'Better keyboard for faster work. Increases money earned from working.',
    icon: 'keyboard',
    category: 'productivity',
    effect: 'money_multiplier',
    baseValue: 0.1, // +10% money from work at level 1
    increment: 0.1, // +10% per level
    level: 0,
    maxLevel: 5,
    baseCost: 200,
    isUnlocked: true,
  },
  {
    id: 'coffee_machine',
    name: 'Coffee Machine',
    description: 'Coffee reduces energy cost when working.',
    icon: 'coffee',
    category: 'productivity',
    effect: 'energy_efficiency',
    baseValue: 0.1, // Reduces energy cost by 10% at level 1
    increment: 0.1, // Additional 10% per level
    level: 0,
    maxLevel: 3,
    baseCost: 350,
    isUnlocked: true,
  },
  {
    id: 'monitor',
    name: 'Monitor Upgrade',
    description: 'Better monitors for improved productivity and learning.',
    icon: 'monitor',
    category: 'productivity',
    effect: 'xp_multiplier',
    baseValue: 0.15, // +15% XP at level 1
    increment: 0.15, // +15% per level
    level: 0,
    maxLevel: 4,
    baseCost: 500,
    isUnlocked: true,
  },
  {
    id: 'desk',
    name: 'Ergonomic Desk',
    description: 'Work more comfortably for longer periods.',
    icon: 'desk',
    category: 'productivity',
    effect: 'energy_efficiency',
    baseValue: 0.15, // Reduces energy cost by 15% at level 1
    increment: 0.15, // Additional 15% per level
    level: 0,
    maxLevel: 3,
    baseCost: 800,
    isUnlocked: false,
    unlockRequirement: {
      type: 'level',
      value: 5
    }
  },
  
  // Health Upgrades
  {
    id: 'fridge',
    name: 'Refrigerator',
    description: 'Store healthier food for better nutrition.',
    icon: 'fridge',
    category: 'health',
    effect: 'hunger_efficiency',
    baseValue: 0.2, // 20% more efficient hunger restoration 
    increment: 0.2, // +20% per level
    level: 0,
    maxLevel: 3,
    baseCost: 300,
    isUnlocked: true,
  },
  {
    id: 'bed',
    name: 'Bed Upgrade',
    description: 'Better bed for improved sleep quality.',
    icon: 'bed-empty',
    category: 'health',
    effect: 'health_regeneration',
    baseValue: 0.05, // +5% health regeneration when sleeping
    increment: 0.05, 
    level: 0,
    maxLevel: 4,
    baseCost: 450,
    isUnlocked: true,
  },
  {
    id: 'fitness',
    name: 'Fitness Equipment',
    description: 'Exercise equipment for better health.',
    icon: 'dumbbell',
    category: 'health',
    effect: 'health_regeneration',
    baseValue: 0.1, // +10% health regeneration when awake
    increment: 0.1,
    level: 0,
    maxLevel: 3,
    baseCost: 650,
    isUnlocked: false,
    unlockRequirement: {
      type: 'level',
      value: 4
    }
  },
  
  // Learning Upgrades
  {
    id: 'books',
    name: 'Books',
    description: 'Books for increased learning efficiency.',
    icon: 'book-open-variant',
    category: 'learning',
    effect: 'xp_multiplier',
    baseValue: 0.2, // +20% XP gain at level 1
    increment: 0.2, // +20% per level
    level: 0,
    maxLevel: 5,
    baseCost: 400,
    isUnlocked: true,
  },
  {
    id: 'study_desk',
    name: 'Study Desk',
    description: 'Dedicated study space for focused learning.',
    icon: 'desk-lamp',
    category: 'learning',
    effect: 'energy_efficiency',
    baseValue: 0.1, // 10% reduced energy cost for studying
    increment: 0.1,
    level: 0,
    maxLevel: 3,
    baseCost: 600,
    isUnlocked: false,
    unlockRequirement: {
      type: 'level',
      value: 3
    }
  },
  
  // Money Upgrades
  {
    id: 'wallet',
    name: 'Wallet Upgrade',
    description: 'Better organization of finances.',
    icon: 'wallet',
    category: 'money',
    effect: 'money_multiplier',
    baseValue: 0.15, // +15% money earned at level 1
    increment: 0.15, // +15% per level
    level: 0,
    maxLevel: 4,
    baseCost: 250,
    isUnlocked: true,
  },
  {
    id: 'investment',
    name: 'Investment Knowledge',
    description: 'Learn to make better financial decisions.',
    icon: 'chart-line',
    category: 'money',
    effect: 'money_multiplier',
    baseValue: 0.25, // +25% money earned at level 1
    increment: 0.25, // +25% per level
    level: 0,
    maxLevel: 3,
    baseCost: 1000,
    isUnlocked: false,
    unlockRequirement: {
      type: 'level',
      value: 7
    }
  },
];

// Helper functions
export const getUpgradeById = (id: string): Upgrade | undefined => {
  return UPGRADES.find(upgrade => upgrade.id === id);
};

export const getUpgradeNextLevelCost = (upgrade: Upgrade): number => {
  if (upgrade.level >= upgrade.maxLevel) return 0;
  return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
};

export const getActiveUpgrades = (upgrades: Upgrade[]): Upgrade[] => {
  return upgrades.filter(upgrade => upgrade.level > 0);
};

export const getUpgradeEffectValue = (upgrade: Upgrade): number => {
  return upgrade.baseValue + (upgrade.increment * (upgrade.level - 1));
};

// Get all upgrades that apply to a specific effect type
export const getUpgradesByEffectType = (upgrades: Upgrade[], effectType: UpgradeEffectType): Upgrade[] => {
  return upgrades.filter(upgrade => upgrade.effect === effectType && upgrade.level > 0);
};

// Calculate total effect value for a specific effect type from all active upgrades
export const getTotalEffectValue = (upgrades: Upgrade[], effectType: UpgradeEffectType): number => {
  const relevantUpgrades = getUpgradesByEffectType(upgrades, effectType);
  return relevantUpgrades.reduce((total, upgrade) => {
    return total + getUpgradeEffectValue(upgrade);
  }, 0);
}; 