export interface BraydenStats {
  hunger: number;
  happiness: number;
  energy: number;
  money: number;
  isAwake: boolean;
  isDizzy: boolean;
  lastUpdated: number;
  // New gameplay attributes
  level: number;
  experience: number;
  streak: number; // Days in a row played
  health: number; // New health stat
  isDead: boolean; // Death state
}

export const DEFAULT_STATS: BraydenStats = {
  hunger: 60, // Start hunger
  happiness: 75,
  energy: 90,
  money: 400, // Start money
  isAwake: true,
  isDizzy: false,
  lastUpdated: Date.now(),
  // Initialize new gameplay attributes
  level: 1,
  experience: 0,
  streak: 0,
  health: 100, // Start with full health
  isDead: false, // Not dead initially
}; 