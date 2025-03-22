import { Accelerometer } from 'expo-sensors';
import { BraydenStats, DEFAULT_STATS } from '../types/BraydenTypes';
import { RandomEvent } from '../data/randomEvents';
import { Achievement } from '../data/achievements';
import { Alert } from 'react-native';
import { getBoostMultiplier } from '../utils/braydenUtils';
import { BraydenContextType, StateDispatch, Cosmetic } from '../types/BraydenTypes';

type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

interface AccelerometerSubscription {
  current: { unsubscribe: () => void } | null;
}

/**
 * Accelerometer subscription setup
 */
export const _subscribeToAccelerometer = (
  subscription: AccelerometerSubscription,
  lastShakeTime: { current: number },
  setShakeCount: StateDispatch<number>,
  stats: BraydenStats,
  setStats: StateDispatch<BraydenStats>,
  dizzyCount: { current: number },
  saveData: () => Promise<void>
) => {
  Accelerometer.setUpdateInterval(100);
  
  subscription.current = Accelerometer.addListener(({ x, y, z }) => {
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();
    
    // Detect shake (acceleration > 1.8)
    if (acceleration > 1.8 && now - lastShakeTime.current > 500) {
      lastShakeTime.current = now;
      setShakeCount(prev => prev + 1);
      
      // Make Brayden dizzy if shaken too much
      if (!stats.isDizzy && stats.isAwake) {
        // Check if recently shaken at least 5 times in 3 seconds
        const recentTime = now - 3000;
        if (lastShakeTime.current > recentTime) {
          setStats(prev => ({
            ...prev,
            isDizzy: true,
            happiness: Math.max(0, prev.happiness - 10)
          }));
          
          // Track dizzy count for achievement
          dizzyCount.current += 1;
          saveData();
          
          // Auto-recover from dizziness after a while
          setTimeout(() => {
            setStats(prev => ({
              ...prev,
              isDizzy: false
            }));
          }, 5000);
        }
      }
    }
  });
};

/**
 * Unsubscribe from accelerometer
 */
export const _unsubscribeFromAccelerometer = (subscription: AccelerometerSubscription) => {
  subscription.current?.unsubscribe();
};

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
  saveData: () => Promise<void> 
}) => {
  const now = Date.now();
  console.log("Toggling sleep state, was: ", stats.isAwake ? "awake" : "asleep");
  
  setStats(prev => ({
    ...prev,
    isAwake: !prev.isAwake,
    lastUpdated: now, // Update timestamp when sleep state changes
  }));
  
  // Immediate save when sleep is toggled
  saveData();
  
  console.log("Sleep state changed to: ", !stats.isAwake ? "awake" : "asleep");
};

/**
 * Fast forward time
 */
export const fastForwardTime = (setIsFastForwarding: StateDispatch<boolean>) => {
  setIsFastForwarding(prev => {
    const newValue = !prev;
    console.log("Fast forward mode: " + (newValue ? "ON" : "OFF"));
    return newValue;
  });
};

/**
 * Unlock achievement
 */
export const unlockAchievement = (
  achievementId: string,
  achievements: Achievement[],
  setAchievements: StateDispatch<Achievement[]>,
  saveData: () => Promise<void>
) => {
  // First check if the achievement ID exists in our list
  const achievementExists = achievements.some(a => a.id === achievementId);
  if (!achievementExists) {
    console.error(`Attempted to unlock non-existent achievement: ${achievementId}`);
    return;
  }

  const updatedAchievements = achievements.map(achievement => {
    if (achievement.id === achievementId && !achievement.isUnlocked) {
      return { ...achievement, isUnlocked: true };
    }
    return achievement;
  });
  
  // Only update if there was a change
  const wasUnlocked = !achievements.find(a => a.id === achievementId)?.isUnlocked;
  if (wasUnlocked) {
    setAchievements(updatedAchievements);
    saveData();
    
    // Find the unlocked achievement with better error handling
    const achievement = updatedAchievements.find(a => a.id === achievementId);
    
    // Log for debugging
    console.log(`Unlocking achievement: ID=${achievementId}, Found=${!!achievement}, Title=${achievement?.title}`);
    
    // Show notification for newly unlocked achievement with more details and proper fallbacks
    Alert.alert(
      "Achievement Unlocked!",
      `"${achievement?.title || achievementId}"\n\n${achievement?.description || "You've unlocked a new achievement!"}`,
      [{ text: "Nice!" }]
    );
  }
};

/**
 * Trigger a random event
 */
export const triggerRandomEvent = ({ 
  randomEvents, 
  setCurrentEvent 
}: { 
  randomEvents: RandomEvent[], 
  setCurrentEvent: StateDispatch<RandomEvent | null> 
}) => {
  const randomIndex = Math.floor(Math.random() * randomEvents.length);
  setCurrentEvent(randomEvents[randomIndex]);
};

/**
 * Complete a random event
 */
export const completeEvent = ({ 
  currentEvent, 
  choiceIndex, 
  setCurrentEvent 
}: { 
  currentEvent: RandomEvent | null, 
  choiceIndex: number, 
  setCurrentEvent: StateDispatch<RandomEvent | null> 
}) => {
  if (currentEvent && currentEvent.choices[choiceIndex]) {
    currentEvent.choices[choiceIndex].effect();
    setCurrentEvent(null);
  }
};

/**
 * Reset Brayden stats
 */
export const resetBrayden = ({ 
  setStats, 
  saveData 
}: { 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<void> 
}) => {
  setStats(DEFAULT_STATS);
  saveData();
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
  saveData: () => Promise<void>
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
    saveData();
  }
};

/**
 * Feed Brayden
 */
export const feedBrayden = ({ 
  stats, 
  setStats, 
  saveData, 
  unlockAchievement 
}: { 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<void>,
  unlockAchievement: (id: string) => void
}) => {
  if (stats.isDead) {
    Alert.alert("Can't feed Brayden", "Brayden has fainted and needs to be revived first!");
    return;
  }
  
  if (stats.hunger >= 100) {
    Alert.alert("Full!", "Brayden is already full!");
    return;
  }
  
  const hungerBoostMultiplier = getBoostMultiplier('hunger_efficiency', stats);
  const happinessCost = stats.hunger > 90 ? 5 : 0; // Overfeeding reduces happiness
  
  // Apply boost to hunger gain
  const baseHunger = 15;
  const hungerGain = Math.floor(baseHunger * hungerBoostMultiplier);
  
  console.log(`Feed: Hunger gain=${hungerGain} (base=${baseHunger}, multiplier=${hungerBoostMultiplier})`);
  
  setStats(prev => ({
    ...prev,
    hunger: Math.min(100, prev.hunger + hungerGain),
    happiness: Math.max(0, prev.happiness - happinessCost),
    lastUpdated: Date.now()
  }));
  
  // Track feeding for achievement
  unlockAchievement('feed_10');
  
  saveData();
};

/**
 * Play with Brayden
 */
export const playWithBrayden = ({ 
  stats, 
  setStats, 
  saveData, 
  unlockAchievement 
}: { 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<void>,
  unlockAchievement: (id: string) => void
}) => {
  if (stats.isDead) {
    Alert.alert("Can't play", "Brayden has fainted and needs to be revived first!");
    return;
  }
  
  if (stats.energy < 10) {
    Alert.alert("Too tired!", "Brayden is too tired to play right now!");
    return;
  }
  
  // Apply boosts
  const happinessBoostMultiplier = getBoostMultiplier('happiness_gain', stats);
  const energyEfficiencyMultiplier = 1 - getBoostMultiplier('energy_efficiency', stats);
  const xpMultiplier = getBoostMultiplier('xp_multiplier', stats);
  
  // Calculate values with boosts
  const baseHappiness = 10;
  const baseEnergyCost = 8;
  const baseXp = 5;
  
  const happinessGain = Math.floor(baseHappiness * happinessBoostMultiplier);
  const energyCost = Math.max(1, Math.floor(baseEnergyCost * energyEfficiencyMultiplier));
  const xpGain = Math.ceil(baseXp * xpMultiplier);
  
  console.log(`Play: Happiness gain=${happinessGain} (base=${baseHappiness}, multiplier=${happinessBoostMultiplier})`);
  console.log(`Play: Energy cost=${energyCost} (base=${baseEnergyCost}, efficiency=${energyEfficiencyMultiplier})`);
  console.log(`Play: XP gain=${xpGain} (base=${baseXp}, multiplier=${xpMultiplier})`);
  
  // Update stats 
  setStats(prev => ({
    ...prev,
    happiness: Math.min(100, prev.happiness + happinessGain),
    energy: Math.max(0, prev.energy - energyCost),
    lastUpdated: Date.now()
  }));
  
  // Award XP separately
  gainExperience({
    amount: xpGain,
    stats,
    setStats,
    saveData,
    unlockAchievement
  });
  
  // Track play sessions for achievement
  unlockAchievement('play_10');
  
  saveData();
};

/**
 * Work with Brayden
 */
export const workBrayden = ({ 
  stats, 
  setStats, 
  saveData, 
  unlockAchievement 
}: { 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<void>,
  unlockAchievement: (id: string) => void
}) => {
  if (stats.isDead) {
    Alert.alert("Can't work", "Brayden has fainted and needs to be revived first!");
    return;
  }
  
  if (stats.energy < 15) {
    Alert.alert("Too tired!", "Brayden is too tired to work right now!");
    return;
  }
  
  // Apply boosts
  const moneyMultiplier = getBoostMultiplier('money_multiplier', stats);
  const energyEfficiencyMultiplier = 1 - getBoostMultiplier('energy_efficiency', stats);
  const xpMultiplier = getBoostMultiplier('xp_multiplier', stats);
  
  // Calculate values with boosts and level scaling
  const baseEarnings = 10 + (stats.level * 2); // Base earnings increase with level
  const baseEnergyCost = 12;
  const baseHappinessCost = 5;
  const baseXp = 10;
  
  const earnings = Math.floor(baseEarnings * moneyMultiplier);
  const energyCost = Math.max(1, Math.floor(baseEnergyCost * energyEfficiencyMultiplier));
  const happinessCost = baseHappinessCost;
  const xpGain = Math.ceil(baseXp * xpMultiplier);
  
  console.log(`Work: Money earned=${earnings} (base=${baseEarnings}, multiplier=${moneyMultiplier})`);
  console.log(`Work: Energy cost=${energyCost} (base=${baseEnergyCost}, efficiency=${energyEfficiencyMultiplier})`);
  console.log(`Work: Happiness cost=${happinessCost}`);
  console.log(`Work: XP gain=${xpGain} (base=${baseXp}, multiplier=${xpMultiplier})`);
  
  // Update stats
  setStats(prev => ({
    ...prev,
    money: prev.money + earnings,
    energy: Math.max(0, prev.energy - energyCost),
    happiness: Math.max(0, prev.happiness - happinessCost),
    lastUpdated: Date.now()
  }));
  
  // Award XP separately
  gainExperience({
    amount: xpGain,
    stats,
    setStats,
    saveData,
    unlockAchievement
  });
  
  // Track work sessions for achievement
  unlockAchievement('work_10');
  
  saveData();
};

/**
 * Gain experience
 */
export const gainExperience = ({ 
  amount, 
  stats, 
  setStats, 
  saveData, 
  unlockAchievement 
}: { 
  amount: number, 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<void>,
  unlockAchievement: (id: string) => void
}) => {
  console.log(`XP System: Adding ${amount} experience points`);
  
  // Calculate experience needed for next level
  const expToNextLevel = stats.level * 100;
  
  // Add experience
  let newExp = stats.experience + amount;
  let newLevel = stats.level;
  
  console.log(`XP System: Current XP=${stats.experience}, New Total=${newExp}, Required for next level=${expToNextLevel}`);
  
  // Check if leveled up
  while (newExp >= expToNextLevel) {
    console.log(`XP System: Level up triggered! Experience overflow: ${newExp}/${expToNextLevel}`);
    newExp -= expToNextLevel;
    newLevel += 1;
    
    // Show level up notification
    Alert.alert(
      "Level Up!",
      `Brayden has reached level ${newLevel}!`,
      [{ text: "Awesome!" }]
    );
    
    // Check for level achievement
    if (newLevel >= 5) {
      unlockAchievement('level_5');
    }
  }
  
  console.log(`XP System: Final values - Level=${newLevel}, XP=${newExp}`);
  
  // Update stats
  setStats(prev => ({
    ...prev,
    experience: newExp,
    level: newLevel,
  }));
  
  saveData();
};

/**
 * Level up manually
 */
export const levelUp = ({ 
  stats, 
  setStats, 
  saveData 
}: { 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  saveData: () => Promise<void> 
}) => {
  setStats(prev => ({
    ...prev,
    level: prev.level + 1,
    experience: 0,
  }));
  saveData();
};

/**
 * Play mini game
 */
export const playMiniGame = ({ 
  gameType, 
  stats, 
  setStats,
  saveData,
  unlockAchievement
}: { 
  gameType: string, 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>,
  saveData: () => Promise<void>,
  unlockAchievement: (id: string) => void
}) => {
  // Pre-check for energy cost
  let requiredEnergy = 0;
  let xpGain = 0;
  
  if (gameType === 'quick') {
    requiredEnergy = 15;
    xpGain = 10;
  } else if (gameType === 'medium') {
    requiredEnergy = 25;
    xpGain = 25;
  } else if (gameType === 'long') {
    requiredEnergy = 35;
    xpGain = 40;
  }
  
  // Check if Brayden has enough energy
  if (stats.energy < requiredEnergy) {
    Alert.alert(
      "Too Tired",
      `Brayden needs at least ${requiredEnergy} energy to play this game.`,
      [{ text: "OK" }]
    );
    return;
  }
  
  console.log(`Mini-game: Playing ${gameType} game, XP gain: ${xpGain}`);
  
  // Implement different game logic based on gameType
  if (gameType === 'quick') {
    // Quick game costs less energy, gives less rewards
    setStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 15),  // Increased from 10
      happiness: Math.min(100, prev.happiness + 20),  // Increased from 15
      hunger: Math.max(0, prev.hunger - 5),  // Added hunger cost
    }));
  } else if (gameType === 'medium') {
    // Medium game
    setStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 25),  // Increased from 20
      happiness: Math.min(100, prev.happiness + 30),  // Increased from 25
      hunger: Math.max(0, prev.hunger - 10),  // Added hunger cost
      money: prev.money + 15,  // Added small money reward
    }));
  } else if (gameType === 'long') {
    // Long game costs more energy but more rewards
    setStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 35),  // Increased from 30
      happiness: Math.min(100, prev.happiness + 40),  // Increased from 35
      hunger: Math.max(0, prev.hunger - 20),  // Added hunger cost
      money: prev.money + 30,  // Added money reward
    }));
  }
  
  // Award XP separately using the gainExperience function
  gainExperience({
    amount: xpGain,
    stats,
    setStats,
    saveData,
    unlockAchievement
  });
};

/**
 * Purchase a collectible
 */
export const purchaseCollectible = ({ 
  id, 
  autoEquip, 
  stats, 
  setStats, 
  collectibles, 
  setCollectibles, 
  equipCosmetic, 
  saveData 
}: { 
  id: string, 
  autoEquip: boolean, 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  collectibles: Collectible[], 
  setCollectibles: StateDispatch<Collectible[]>,
  equipCosmetic: (id: string) => boolean,
  saveData: () => Promise<void> 
}): boolean => {
  console.log("Attempting to purchase item:", id);
  
  // Find the item
  const itemIndex = collectibles.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    console.log("Purchase failed: Item not found");
    return false;
  }
  
  const item = collectibles[itemIndex];
  console.log("Item details:", item.name, "Rarity:", item.rarity, "Type:", item.type);
  
  // Check if already owned
  if (item.isOwned) {
    console.log("Purchase failed: Already owned");
    return false;
  }
  
  // Calculate cost based on rarity
  let cost;
  switch (item.rarity) {
    case 'common':
      cost = 50;
      break;
    case 'uncommon':
      cost = 100;
      break;
    case 'rare':
      cost = 200;
      break;
    case 'legendary':
      cost = 500;
      break;
    default:
      cost = 100;
  }
  
  console.log("Item cost:", cost, "Player money:", stats.money);
  
  // Check if enough money
  if (stats.money < cost) {
    console.log("Purchase failed: Not enough money");
    Alert.alert(
      "Not Enough Money",
      `You need $${cost} to purchase this item.`,
      [{ text: "OK" }]
    );
    return false;
  }
  
  // Purchase item
  setStats(prev => ({
    ...prev,
    money: prev.money - cost,
  }));
  
  const updatedCollectibles = [...collectibles];
  updatedCollectibles[itemIndex] = { ...item, isOwned: true };
  setCollectibles(updatedCollectibles);
  
  // Auto-equip if requested
  if (autoEquip && item.type === 'cosmetic') {
    console.log("Auto-equipping item:", id);
    equipCosmetic(id);
  }
  
  console.log("Purchase successful!");
  
  // Show purchase confirmation
  Alert.alert(
    "Item Purchased!",
    `You bought the ${item.name}!`,
    [{ text: "Nice!" }]
  );
  
  saveData();
  return true;
};

/**
 * Internal function to equip a cosmetic
 */
export const _equipCosmetic = (
  id: string,
  collectibles: Collectible[],
  equippedCosmetics: { [key: string]: Collectible | null },
  setEquippedCosmetics: StateDispatch<{ [key: string]: Collectible | null }>
): boolean => {
  console.log("_equipCosmetic called for item:", id);
  
  // Find the cosmetic
  const item = collectibles.find(item => item.id === id);
  if (!item) {
    console.log("_equipCosmetic: Item not found");
    return false;
  }
  
  console.log("Item details:", item.name, "Type:", item.type, "Slot:", item.slot, "isOwned:", item.isOwned);
  
  // Check if it's a cosmetic and owned
  if (item.type !== 'cosmetic' || !item.isOwned || !item.slot) {
    console.log("_equipCosmetic: Not a valid cosmetic, owned:", item.isOwned, "type:", item.type, "has slot:", !!item.slot);
    return false;
  }
  
  // Update equipped cosmetics
  setEquippedCosmetics(prev => {
    console.log("Updating equipped cosmetics. Slot:", item.slot);
    return {
      ...prev,
      [item.slot!]: item,
    };
  });
  
  console.log("_equipCosmetic: Success equipping item", id, "to slot", item.slot);
  return true;
};

/**
 * Equip a cosmetic
 */
export const equipCosmetic = ({ 
  id, 
  collectibles, 
  setCollectibles, 
  equippedCosmetics, 
  setEquippedCosmetics, 
  saveData 
}: { 
  id: string, 
  collectibles: Collectible[], 
  setCollectibles: StateDispatch<Collectible[]>, 
  equippedCosmetics: { [key: string]: Collectible | null }, 
  setEquippedCosmetics: StateDispatch<{ [key: string]: Collectible | null }>, 
  saveData: () => Promise<void> 
}): boolean => {
  console.log("equipCosmetic called for item:", id);
  console.log("Current equipped cosmetics:", Object.keys(equippedCosmetics).map(key => `${key}: ${equippedCosmetics[key]?.id || 'none'}`));
  
  const success = _equipCosmetic(id, collectibles, equippedCosmetics, setEquippedCosmetics);
  if (success) {
    // Also update the collectible to be equipped
    const updatedCollectibles = collectibles.map(item => {
      if (item.id === id) {
        return { ...item, isEquipped: true };
      }
      return item;
    });
    
    setCollectibles(updatedCollectibles);
    saveData();
    console.log("equipCosmetic: Item saved as equipped");
  } else {
    console.log("equipCosmetic: Failed to equip item");
  }
  return success;
};

/**
 * Unequip a cosmetic
 */
export const unequipCosmetic = ({ 
  slot, 
  equippedCosmetics, 
  setEquippedCosmetics, 
  saveData 
}: { 
  slot: string, 
  equippedCosmetics: { [key: string]: Collectible | null }, 
  setEquippedCosmetics: StateDispatch<{ [key: string]: Collectible | null }>, 
  saveData: () => Promise<void> 
}) => {
  if (!slot || !equippedCosmetics[slot]) return;
  
  // Remove item from slot
  setEquippedCosmetics(prev => ({
    ...prev,
    [slot]: null,
  }));
  
  saveData();
};

/**
 * Earn money
 */
export const earnMoney = ({ 
  amount, 
  energyCost, 
  happinessCost, 
  stats, 
  setStats, 
  totalMoneyEarned, 
  saveData, 
  unlockAchievement 
}: { 
  amount: number, 
  energyCost: number, 
  happinessCost: number, 
  stats: BraydenStats, 
  setStats: StateDispatch<BraydenStats>, 
  totalMoneyEarned: { current: number }, 
  saveData: () => Promise<void>,
  unlockAchievement: (id: string) => void
}) => {
  // Update stats
  setStats(prev => {
    const newMoney = prev.money + amount;
    // Update total money earned for achievement tracking
    totalMoneyEarned.current += amount;
    
    return {
      ...prev,
      money: newMoney,
      energy: Math.max(0, prev.energy - energyCost),
      happiness: Math.max(0, prev.happiness - happinessCost),
    };
  });
  
  // Check for money achievement
  if (totalMoneyEarned.current >= 1000) {
    unlockAchievement('money_1000');
  }
  
  saveData();
}; 