import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
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
    
    console.log("Fast forward activated");
    const fastForwardTimer = setInterval(() => {
      if (!stats.isDead) {
        // Instead of calling updateStats multiple times in a loop,
        // simulate passing of more time in a single update by using a larger hoursPassed value
        const now = Date.now();
        
        // Simulate 20 minutes passing at once (adjusted from 30 for better balance)
        const simulatedTime = now + (20 * 60 * 1000);
        
        if (!stats.isAwake) {
          // While sleeping, energy increases, hunger decreases slower
          setStats(prev => {
            // Calculate new values with accelerated time (20 minutes)
            const hoursPassed = 0.33; // 20 minutes
            const newEnergy = Math.min(100, prev.energy + hoursPassed * 20); // Balanced rate
            const newHunger = Math.max(0, prev.hunger - hoursPassed * 1); // Slower decay
            
            console.log("Fast forward sleep recovery - Energy: ", prev.energy, " -> ", newEnergy);
            
            return {
            ...prev,
              energy: newEnergy,
              hunger: newHunger,
              lastUpdated: simulatedTime,
            };
          });
        } else {
          // Regular stat decay while awake
          setStats(prev => {
            // Calculate new values with accelerated time
            const hoursPassed = 0.33; // 20 minutes
            const newHunger = Math.max(0, prev.hunger - hoursPassed * 4);
            const newEnergy = Math.max(0, prev.energy - hoursPassed * 3);
            const newHappiness = Math.max(0, prev.happiness - hoursPassed * 2);
            
            // If hunger or energy is critically low, decrease health
            const healthChange = 
              (newHunger < 15 ? -hoursPassed * 4 : 0) + 
              (newEnergy < 15 ? -hoursPassed * 4 : 0);
            
            const newHealth = Math.max(0, prev.health + healthChange);
            const isDead = newHealth <= 0;
            
            console.log("Fast forward stat update - Energy: ", prev.energy, " -> ", newEnergy);
            
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
        }
        
        // Save data after the update
    saveData();
        console.log("Fast forwarding time...");
      }
    }, 1500); // Run more frequently - changed from 2000ms to 1500ms

    return () => clearInterval(fastForwardTimer);
  }, [isFastForwarding, stats.isDead, stats.isAwake, saveData]);

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
    loadData();
    
    // Subscribe to accelerometer for shake detection
    BraydenActions._subscribeToAccelerometer(
      subscription, 
      lastShakeTime, 
      setShakeCount, 
      stats, 
      setStats, 
      dizzyCount, 
      saveData
    );
    
    // Check for achievements on load
    checkForAchievements(stats, achievements, unlockAchievement, totalMoneyEarned, dizzyCount);
    
    // Return cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      BraydenActions._unsubscribeFromAccelerometer(subscription);
    };
  }, []);

  // Update stats according to time passed when app opens
  const updateStats = () => {
      const now = Date.now();
    const hoursPassed = (now - stats.lastUpdated) / (1000 * 60 * 60);
    
    if (hoursPassed < 0.01) {
      console.log("Time passed too short, skipping update: ", hoursPassed);
      return; // Skip if less than about half a minute
    }
    
    console.log("Updating stats, hours passed: ", hoursPassed);
    
    // Don't decay stats while sleeping
    if (!stats.isAwake) {
      // While sleeping, energy increases, hunger decreases slower
      setStats(prev => {
        // Calculate new values
        // Balanced energy recovery - faster but not too fast
        const newEnergy = Math.min(100, prev.energy + hoursPassed * 20); 
        // Slower hunger decrease during sleep
        const newHunger = Math.max(0, prev.hunger - hoursPassed * 1); 
        
        console.log("Sleep recovery - Energy: ", prev.energy, " -> ", newEnergy);
          
          return {
          ...prev,
            energy: newEnergy,
          hunger: newHunger,
          lastUpdated: now,
          };
        });
      saveData(); // Make sure to save after updating stats
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
          
      console.log("Regular stat update - Energy: ", prev.energy, " -> ", newEnergy);
      
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
    
    saveData();
  };

  // Load data from persistent storage
  const loadData = async () => {
    try {
      const statsData = await AsyncStorage.getItem('stats');
      if (statsData) {
        const parsedStats = JSON.parse(statsData);
        setStats({ ...DEFAULT_STATS, ...parsedStats, lastUpdated: Date.now() });
      }

      const achievementsData = await AsyncStorage.getItem('achievements');
      if (achievementsData) {
        const parsedAchievements = JSON.parse(achievementsData);
        
        // Make sure all achievements are included, even new ones added in updates
        const mergedAchievements = ACHIEVEMENTS.map(achievement => {
          const savedAchievement = parsedAchievements.find((a: Achievement) => a.id === achievement.id);
          return savedAchievement || achievement;
        });
        
        setAchievements(mergedAchievements);
      }

      const upgradesData = await AsyncStorage.getItem('upgrades');
      if (upgradesData) {
        const parsedUpgrades = JSON.parse(upgradesData);
        
        // Make sure all upgrades are included, even new ones added in updates
        const mergedUpgrades = UPGRADES.map(upgrade => {
          const savedUpgrade = parsedUpgrades.find((u: Upgrade) => u.id === upgrade.id);
          return savedUpgrade || upgrade;
        });
        
        setUpgrades(mergedUpgrades);
      }

      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Save data to persistent storage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('stats', JSON.stringify(stats));
      await AsyncStorage.setItem('achievements', JSON.stringify(achievements));
      await AsyncStorage.setItem('upgrades', JSON.stringify(upgrades));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Unlock achievement
  const unlockAchievement = (id: string) => {
    BraydenActions.unlockAchievement(id, achievements, setAchievements, saveData);
  };

  // Function wrappers
  const feedBrayden = () => {
    BraydenActions.feedBrayden({ 
      stats, 
      setStats, 
      saveData,
      unlockAchievement
    });
  };

  const playWithBrayden = () => {
    BraydenActions.playWithBrayden({ 
      stats, 
      setStats, 
      saveData,
      unlockAchievement
    });
  };

  const workBrayden = () => {
    BraydenActions.workBrayden({ 
      stats, 
      setStats, 
      saveData, 
      totalMoneyEarned,
      unlockAchievement
    });
  };

  const resetBrayden = () => {
    BraydenActions.resetBrayden({ setStats, saveData });
  };

  const reviveBrayden = () => {
    BraydenActions.reviveBrayden({ setStats, saveData });
  };

  const toggleSleep = () => {
    BraydenActions.toggleSleep({ stats, setStats, saveData });
  };

  const fastForwardTime = () => {
    BraydenActions.fastForwardTime(setIsFastForwarding);
  };

  const gainExperience = (amount: number) => {
    BraydenActions.gainExperience({ amount, stats, setStats, saveData, unlockAchievement });
  };

  const levelUp = () => {
    BraydenActions.levelUp({ stats, setStats, saveData });
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
      saveData,
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
    saveData();
    
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
      saveData, 
      unlockAchievement 
    });
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
        saveData
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