import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, DeviceEventEmitter, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

// Import new modularized files
import { BraydenStats, DEFAULT_STATS } from '../types/BraydenTypes';
import { Achievement, ACHIEVEMENTS } from '../data/achievements';
import { RandomEvent, createRandomEvents } from '../data/randomEvents';
import { BraydenContextType } from '../types/ContextTypes';
import { getBoostMultiplier, getStatBoost, checkForAchievements } from '../utils/braydenUtils';
import * as BraydenActions from '../actions/braydenActions';
import { Upgrade, UPGRADES } from '../data/upgrades';
import { loadBraydenData, saveBraydenData } from '../utils/braydenUtils';
import logger from '../utils/logger';
import { useDataPersistence } from '../hooks/useDataPersistence';

// Create context
export const BraydenContext = createContext<BraydenContextType | null>(null);

export const BraydenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management
  const [stats, setStats] = useState<BraydenStats>(DEFAULT_STATS);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADES);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [randomEvents, setRandomEvents] = useState<RandomEvent[]>([]);
  const [shakeCount, setShakeCount] = useState(0);
  const lastShakeTime = useRef(0);
  const subscription = useRef<any>(null);
  const totalMoneyEarned = useRef(0);
  const dizzyCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get data persistence hooks
  const { 
    saveData,
    saveBraydenData, 
    loadData, 
    loadBraydenData,
    removeData,
    isLoading: dataIsLoading,
    isError: dataIsError
  } = useDataPersistence();

  // Save data to persistent storage - defined early to avoid reference issues
  const saveGameState = useCallback((): Promise<any> => {
    return saveBraydenData(stats, achievements, upgrades)
      .catch(error => {
        logger.error('Failed to save game state:', error);
        setError('Failed to save data');
        throw error; // Re-throw to propagate the error
      });
  }, [stats, achievements, upgrades, saveBraydenData]);

  // Initialize random events with context
  useEffect(() => {
    setRandomEvents(createRandomEvents({ setStats, gainExperience }));
  }, []);

  // Background process timer
  useEffect(() => {
    const decayTimer = setInterval(() => {
      if (!stats.isDead) updateStats();
    }, 60000); // Update every minute

    return () => clearInterval(decayTimer);
  }, [stats]);

  // Fast forward timer - runs more frequently when enabled
  useEffect(() => {
    if (!isFastForwarding) return;
    
    const fastForwardTimer = setInterval(() => {
      if (!stats.isDead) {
        // Simulate passage of time
        const now = Date.now();
        const lastUpdateTime = stats.lastUpdated;
        const timeDiff = now - lastUpdateTime;
        
        // In fast forward mode, we'll simulate at least 5 minutes passing
        // even if the actual time difference is smaller
        const minimumTimeDiffInFF = 5 * 60 * 1000; // 5 minutes in milliseconds
        const effectiveTimeDiff = Math.max(timeDiff, minimumTimeDiffInFF);
        
        const hoursPassed = effectiveTimeDiff / (1000 * 60 * 60);
        
        if (hoursPassed > 0) {
          // Simulate what would happen over this time
          setStats(prev => {
            // Calculate stat changes based on awake/asleep state
            let newHunger, newEnergy, newHappiness, healthChange;
            
            if (!prev.isAwake) {
              // Sleeping: energy increases, hunger decreases slower
              newHunger = Math.max(0, prev.hunger - hoursPassed * 1);
              newEnergy = Math.min(100, prev.energy + hoursPassed * 40);
              newHappiness = prev.happiness; // Happiness stays constant while sleeping
              healthChange = 0; // No health change while sleeping
              
              logger.debug(`Sleep FF - Hours: ${hoursPassed.toFixed(2)}, Energy: ${prev.energy.toFixed(1)} -> ${newEnergy.toFixed(1)}, Hunger: ${prev.hunger.toFixed(1)} -> ${newHunger.toFixed(1)}`);
            } else {
              // Awake: all stats decrease
              newHunger = Math.max(0, prev.hunger - hoursPassed * 4);
              newEnergy = Math.max(0, prev.energy - hoursPassed * 3);
              newHappiness = Math.max(0, prev.happiness - hoursPassed * 2);
              
              // Health changes if stats are critical
              healthChange = 
                (newHunger < 15 ? -hoursPassed * 4 : 0) +
                (newEnergy < 15 ? -hoursPassed * 4 : 0);
            }
            
            const newHealth = Math.max(0, prev.health + healthChange);
            const isDead = newHealth <= 0;
            
            // Simulate up to current time
            const simulatedTime = now;
            
            return {
              ...prev,
              hunger: newHunger,
              energy: newEnergy,
              happiness: newHappiness,
              health: newHealth,
              isDead: isDead,
              lastUpdated: simulatedTime,
            };
          });
          
          // Save data after the update
          saveGameState().catch(error => {
            logger.error(`Error saving during fast forward: ${error}`);
          });
          logger.debug("Fast forwarding time...");
        }
      }
    }, 1500); // Run more frequently - changed from 2000ms to 1500ms

    return () => clearInterval(fastForwardTimer);
  }, [isFastForwarding, stats.isDead, stats.isAwake, saveGameState]);

  // Check for streak updates
  useEffect(() => {
    const checkStreakUpdate = () => {
      const now = new Date();
      const lastDate = new Date(stats.lastUpdated);
      
      // Only check when a day changes
      if (now.getDate() !== lastDate.getDate() || 
          now.getMonth() !== lastDate.getMonth() || 
          now.getFullYear() !== lastDate.getFullYear()) {
        
        // If last played was yesterday, increment streak
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.getDate() === yesterday.getDate() && 
            lastDate.getMonth() === yesterday.getMonth() && 
            lastDate.getFullYear() === yesterday.getFullYear()) {
          setStats(prev => ({
            ...prev,
            streak: prev.streak + 1,
          }));
          
          // Check for streak achievement
          if (stats.streak + 1 >= 7) {
      unlockAchievement('streak_7');
    }
        } else if (now.getTime() - lastDate.getTime() > 86400000) {
          // Reset streak if more than one day passed
          setStats(prev => ({
            ...prev,
            streak: 1, // Reset to 1 for today
          }));
        }
      }
    };
    
    checkStreakUpdate();
  }, [stats.lastUpdated]);

  // Data persistence
  useEffect(() => {
    loadInitialState();
    
    // Subscribe to accelerometer
    BraydenActions._subscribeToAccelerometer(
      subscription, 
      lastShakeTime, 
      setShakeCount, 
      stats, 
      setStats, 
      dizzyCount, 
      saveGameState
    );
    
    // Initial stats update to handle time passed while app was closed
    updateStats();
    
    return () => {
      if (subscription.current) {
        BraydenActions._unsubscribeFromAccelerometer(subscription);
      }
    };
  }, []);

  // Update stats based on elapsed time
  const updateStats = () => {
    const now = Date.now();
    const lastUpdateTime = stats.lastUpdated;
    const timeDiff = now - lastUpdateTime;
    
    // Only update if some time has passed (normal mode)
    // In regular mode, we require at least 36 seconds
    if (timeDiff < 36000 && !isFastForwarding) return;
    
    // When sleeping, ensure we have at least a minimum time increment to make changes visible
    let hoursPassed;
    if (!stats.isAwake) {
      // For sleep, always simulate at least 2 minutes passing to ensure visible changes
      const minimumSleepTimeDiff = 2 * 60 * 1000; // 2 minutes in milliseconds
      const effectiveTimeDiff = Math.max(timeDiff, minimumSleepTimeDiff);
      hoursPassed = effectiveTimeDiff / (1000 * 60 * 60);
    } else {
      hoursPassed = timeDiff / (1000 * 60 * 60);
    }
    
    // Don't decay stats while sleeping
    if (!stats.isAwake) {
      // While sleeping, energy increases, hunger decreases slower
      setStats(prev => {
        // Calculate new values
        // Increased energy recovery rate for faster replenishment
        const newEnergy = Math.min(100, prev.energy + hoursPassed * 40);
        // Slower hunger decrease during sleep
        const newHunger = Math.max(0, prev.hunger - hoursPassed * 1); 
        
        logger.debug(`Sleep recovery - Hours passed: ${hoursPassed.toFixed(2)}, Energy: ${prev.energy.toFixed(1)} -> ${newEnergy.toFixed(1)}, Hunger: ${prev.hunger.toFixed(1)} -> ${newHunger.toFixed(1)}`);
          
        return {
          ...prev,
          energy: newEnergy,
          hunger: newHunger,
          lastUpdated: now,
        };
      });
      saveGameState().catch(error => {
        logger.error(`Error saving during sleep recovery: ${error}`);
      });
      return;
    }
    
    // Regular stat decay while awake
    setStats(prev => {
      // Calculate new values with more balanced decay rates
      const newHunger = Math.max(0, prev.hunger - hoursPassed * 4); // Increased from 3 to 4
      const newEnergy = Math.max(0, prev.energy - hoursPassed * 3); // Increased from 2 to 3
      const newHappiness = Math.max(0, prev.happiness - hoursPassed * 2); // Increased from 1.5 to 2
      
      // If hunger or energy is critically low, decrease health
      const healthChange = 
        (newHunger < 15 ? -hoursPassed * 4 : 0) + // Changed from 10 to 15 threshold, reduced penalty
        (newEnergy < 15 ? -hoursPassed * 4 : 0); // Changed from 10 to 15 threshold, reduced penalty
      
      const newHealth = Math.max(0, prev.health + healthChange);
          const isDead = newHealth <= 0;
          
      logger.debug("Regular stat update - Energy: ", prev.energy, " -> ", newEnergy);
      
      // If Brayden just died, trigger alert
      if (!prev.isDead && isDead) {
              Alert.alert(
          "Oh no!",
          "Brayden has fainted from neglect! You need to revive him.",
          [{ text: "OK" }]
        );
          }
          
          return {
        ...prev,
            hunger: newHunger,
        energy: newEnergy,
            happiness: newHappiness,
            health: newHealth,
            isDead: isDead,
          lastUpdated: now,
          };
        });
    
    saveGameState();
  };

  // Load data from persistent storage
  const loadInitialState = useCallback(async () => {
    try {
      const { stats, achievements, upgrades } = await loadBraydenData();
      
      // Update state
      setStats(stats);
      setAchievements(achievements);
      setUpgrades(upgrades);
      
      setIsLoading(false);
    } catch (error) {
      logger.error('Failed to load initial state:', error);
      setIsLoading(false);
      setError('Failed to load data');
    }
  }, [loadBraydenData]);

  // Unlock achievement
  const unlockAchievement = (id: string) => {
    BraydenActions.unlockAchievement(id, achievements, setAchievements, saveGameState);
  };

  // Function wrappers
  const feedBrayden = () => {
    BraydenActions.feedBrayden({ 
      stats, 
      setStats, 
      saveData: saveGameState,
      unlockAchievement
    });
  };

  const playWithBrayden = () => {
    BraydenActions.playWithBrayden({ 
      stats, 
      setStats, 
      saveData: saveGameState,
      unlockAchievement
    });
  };

  const workBrayden = () => {
    BraydenActions.workBrayden({ 
      stats, 
      setStats, 
      saveData: saveGameState, 
      totalMoneyEarned,
      unlockAchievement
    });
  };

  const resetBrayden = () => {
    BraydenActions.resetBrayden({ setStats, saveData: saveGameState });
  };

  const reviveBrayden = () => {
    BraydenActions.reviveBrayden({ stats, setStats, saveData: saveGameState });
  };

  const toggleSleep = () => {
    BraydenActions.toggleSleep({ stats, setStats, saveData: saveGameState });
  };

  const fastForwardTime = () => {
    BraydenActions.fastForwardTime(setIsFastForwarding);
  };

  const gainExperience = (amount: number) => {
    BraydenActions.gainExperience({ amount, stats, setStats, saveData: saveGameState, unlockAchievement });
  };

  const levelUp = () => {
    BraydenActions.levelUp({ stats, setStats, saveData: saveGameState });
  };

  const triggerRandomEvent = () => {
    BraydenActions.triggerRandomEvent({ randomEvents, setCurrentEvent });
  };

  const completeEvent = (choiceIndex: number) => {
    BraydenActions.completeEvent({ currentEvent, choiceIndex, setCurrentEvent });
  };

  const playMiniGame = (gameType: string) => {
    BraydenActions.playMiniGame({ 
      gameType, 
      stats, 
      setStats,
      saveData: saveGameState,
      unlockAchievement
    });
  };

  const purchaseUpgrade = (id: string): boolean => {
    // Find the upgrade
    const upgradeIndex = upgrades.findIndex(upgrade => upgrade.id === id);
    if (upgradeIndex === -1) return false;
    
    const upgrade = upgrades[upgradeIndex];
    
    // Check if already at max level
    if (upgrade.level >= upgrade.maxLevel) return false;
    
    // Calculate cost for next level
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
    
    // Check if player can afford it
    if (stats.money < cost) return false;
    
    // Update player's money and the upgrade's level
    setStats(prev => ({
      ...prev,
      money: prev.money - cost
    }));
    
    const updatedUpgrades = [...upgrades];
    updatedUpgrades[upgradeIndex] = {
      ...upgrade,
      level: upgrade.level + 1
    };
    
    setUpgrades(updatedUpgrades);
    saveGameState();
    
    // Check for achievements related to upgrades
    if (updatedUpgrades[upgradeIndex].level >= updatedUpgrades[upgradeIndex].maxLevel) {
      unlockAchievement('upgrade_max');
    }
    
    // Check if this is the first upgrade purchased
    if (upgrades.every(u => u.level === 0) && updatedUpgrades[upgradeIndex].level > 0) {
      unlockAchievement('first_upgrade');
    }
    
    // Check for achievement for having 5 upgrades
    const totalUpgrades = updatedUpgrades.reduce((count, u) => count + (u.level > 0 ? 1 : 0), 0);
    if (totalUpgrades >= 5) {
      unlockAchievement('five_upgrades');
    }
    
    return true;
  };

  const earnMoney = (amount: number, energyCost: number, happinessCost: number) => {
    BraydenActions.earnMoney({ 
      amount, 
      energyCost, 
      happinessCost, 
      stats, 
      setStats, 
      totalMoneyEarned, 
      saveData: saveGameState, 
      unlockAchievement 
    });
  };

  const checkAndApplyDailyBonus = () => {
    const now = new Date();
    const lastBonusDate = stats.lastDailyBonus ? new Date(stats.lastDailyBonus) : null;
    
    // Check if it's a new day since last bonus
    if (!lastBonusDate || 
        now.getDate() !== lastBonusDate.getDate() || 
        now.getMonth() !== lastBonusDate.getMonth() || 
        now.getFullYear() !== lastBonusDate.getFullYear()) {
      
      // Award daily bonus
      setStats(prev => ({
        ...prev,
        money: prev.money + 50, // Give 50 coins
        energy: Math.min(100, prev.energy + 20), // Restore some energy
        happiness: Math.min(100, prev.happiness + 10), // Boost happiness
        lastDailyBonus: now.getTime(),
      }));
      
      Alert.alert(
        "Daily Bonus!",
        "You received 50 coins, 20 energy, and 10 happiness for playing today!",
        [{ text: "Awesome!" }]
      );
      
      saveGameState();
    }
  };

  const applyMultiActionStatsUpdate = (maxIterations: number) => {
    let iterations = 0;
    let shouldContinue = true;
    
    while (shouldContinue && iterations < maxIterations) {
      // Run a single iteration of stat updates
      const result = applyRandomStatUpdate();
      iterations++;
      
      // Check if we should continue
      shouldContinue = result.shouldContinue;
    }
    
    // Save after batch updates
    saveGameState();
  };

  // Define the missing applyRandomStatUpdate function
  const applyRandomStatUpdate = () => {
    // Simple implementation that just returns shouldContinue: false
    return { shouldContinue: false };
  };

  // Provide context values
  const contextValue: BraydenContextType = {
        stats,
        achievements,
        upgrades,
        feedBrayden,
        playWithBrayden,
        workBrayden,
        resetBrayden,
        reviveBrayden,
        toggleSleep,
        fastForwardTime,
        isFastForwarding,
        gainExperience,
        levelUp,
        triggerRandomEvent,
        currentEvent,
        completeEvent,
        playMiniGame,
        purchaseUpgrade,
        earnMoney,
        setStats,
        setUpgrades,
        saveData: saveGameState
  };

  return (
    <BraydenContext.Provider value={contextValue}>
      {children}
    </BraydenContext.Provider>
  );
};

export const useBrayden = (): BraydenContextType => {
  const context = useContext(BraydenContext);
  if (!context) {
    throw new Error('useBrayden must be used within a BraydenProvider');
  }
  return context;
}; 