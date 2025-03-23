import { BraydenStats, DEFAULT_STATS } from '../types/BraydenTypes';
import logger from '../utils/logger';

type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Toggle sleep state
 */
export const toggleSleep = ({ 
  stats, 
  setStats, 
  saveData 
}: { 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<any> 
}) => {
  const now = Date.now();
  logger.debug("Toggling sleep state, was: " + (stats.isAwake ? "awake" : "asleep"));
  
  setStats(prev => ({
    ...prev,
    isAwake: !prev.isAwake,
    lastUpdated: now, // Update timestamp when sleep state changes
  }));
  
  // Immediate save when sleep is toggled
  saveData().catch(error => {
    logger.error(`Error saving sleep toggle: ${error}`);
  });
  
  logger.debug("Sleep state changed to: " + (!stats.isAwake ? "awake" : "asleep"));
};

/**
 * Fast forward time
 */
export const fastForwardTime = (setIsFastForwarding: StateDispatch<boolean>) => {
  setIsFastForwarding(prev => {
    const newValue = !prev;
    logger.debug("Fast forward mode: " + (newValue ? "ON" : "OFF"));
    return newValue;
  });
};

/**
 * Reset Brayden stats
 */
export const resetBrayden = ({ 
  setStats, 
  saveData 
}: { 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<any> 
}) => {
  setStats(DEFAULT_STATS);
  saveData().catch(error => {
    logger.error(`Error saving after reset: ${error}`);
  });
  logger.info("Brayden stats reset to default");
};

/**
 * Revive Brayden after death
 */
export const reviveBrayden = ({ 
  stats, 
  setStats, 
  saveData 
}: { 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<any>
}) => {
  if (stats.isDead) {
    setStats(prev => ({
      ...prev,
      health: 50, // Revive with half health
      hunger: 30,
      energy: 50,
      happiness: 30,
      isDead: false,
      lastUpdated: Date.now()
    }));
    saveData().catch(error => {
      logger.error(`Error saving after revive: ${error}`);
    });
    logger.info("Brayden revived from death state");
  }
};

// Default stats used for reset
export const DEFAULT_STATS: BraydenStats = {
  health: 100,
  hunger: 50,
  happiness: 50,
  energy: 100,
  money: 20,
  level: 1,
  experience: 0,
  streak: 0,
  lastLogin: Date.now(),
  lastUpdated: Date.now(),
  isAwake: true,
  isDead: false,
  isDizzy: false
}; 