import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, DeviceEventEmitter, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

interface BraydenStats {
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: string; // Icon name for display
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  isOwned: boolean;
  isEquipped: boolean;
  type: 'collectible' | 'cosmetic';
  slot?: 'hat' | 'glasses' | 'shirt' | 'accessory' | 'background';
  statBonus?: {
    type: 'work_efficiency' | 'play_boost' | 'all_stats' | 'energy_regen' | 
          'xp_gain' | 'money_boost' | 'happiness_boost' | 'energy_efficiency';
    value: number;
  };
}

interface RandomEvent {
  id: string;
  title: string;
  description: string;
  choices: {
    text: string;
    effect: () => void;
  }[];
}

interface BraydenContextType {
  stats: BraydenStats;
  achievements: Achievement[];
  collectibles: Collectible[];
  feedBrayden: () => void;
  playWithBrayden: () => void;
  workBrayden: () => void;
  resetBrayden: () => void;
  reviveBrayden: () => void; // New function to revive Brayden
  toggleSleep: () => void;
  fastForwardTime: () => void;
  isFastForwarding: boolean;
  // Only keep collectible/cosmetic functions relevant to avatar display
  gainExperience: (amount: number) => void;
  levelUp: () => void;
  activeCollectibles: Collectible[];
  toggleCollectible: (id: string) => void;
  triggerRandomEvent: () => void;
  currentEvent: RandomEvent | null;
  completeEvent: (choiceIndex: number) => void;
  playMiniGame: (gameType: string) => void;
  // Shop functions
  purchaseCollectible: (id: string, autoEquip: boolean) => boolean;
  // Cosmetic functions
  equippedCosmetics: { [key: string]: Collectible | null };
  equipCosmetic: (id: string) => boolean;
  unequipCosmetic: (slot: string) => void;
  // Money earning function
  earnMoney: (amount: number, energyCost: number, happinessCost: number) => void;
}

const DEFAULT_STATS: BraydenStats = {
  hunger: 65, // Start hunger
  happiness: 75,
  energy: 90,
  money: 40, // Start money
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

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_day',
    title: 'First Day',
    description: 'Play with Brayden for the first time',
    isUnlocked: false,
    icon: 'trophy',
  },
  {
    id: 'level_5',
    title: 'Growing Up',
    description: 'Reach level 5 with Brayden',
    isUnlocked: false,
    icon: 'chart-line',
  },
  {
    id: 'money_1000',
    title: 'Money Maker',
    description: 'Earn 1000 money total',
    isUnlocked: false,
    icon: 'cash-multiple',
  },
  {
    id: 'perfect_balance',
    title: 'Perfect Balance',
    description: 'Have all stats above 90 at the same time',
    isUnlocked: false,
    icon: 'scale-balance',
  },
  {
    id: 'dizzy_5',
    title: 'Dizzy Wizard',
    description: 'Make Brayden dizzy 5 times',
    isUnlocked: false,
    icon: 'rotate-3d-variant',
  },
  {
    id: 'streak_7',
    title: 'Weekly Dedication',
    description: 'Play 7 days in a row',
    isUnlocked: false,
    icon: 'calendar-check',
  },
];

// Collectible items
const COLLECTIBLES: Collectible[] = [
  {
    id: 'happy_poster',
    name: 'Happy Poster',
    description: 'A motivational poster that boosts happiness',
    isOwned: false,
    isEquipped: false,
    rarity: 'common',
    icon: 'image',
    type: 'cosmetic',
    slot: 'background',
  },
  {
    id: 'coffee_machine',
    name: 'Coffee Machine',
    description: 'Boosts energy recovery',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'coffee',
    type: 'cosmetic',
    slot: 'hat',
  },
  {
    id: 'investment_book',
    name: 'Investment Book',
    description: 'Learn to earn more money',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'book',
    type: 'cosmetic',
    slot: 'glasses',
  },
  {
    id: 'gourmet_cookbook',
    name: 'Gourmet Cookbook',
    description: 'Learn to cook better meals',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'food-variant',
    type: 'cosmetic',
    slot: 'shirt',
  },
  {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'Increases chance of good random events',
    isOwned: false,
    isEquipped: false,
    rarity: 'legendary',
    icon: 'clover',
    type: 'cosmetic',
    slot: 'accessory',
  },
];

// Random events
const createRandomEvents = (context: any): RandomEvent[] => [
  {
    id: 'unexpected_bonus',
    title: 'Unexpected Bonus!',
    description: 'Brayden received an unexpected bonus at work!',
    choices: [
      {
        text: 'Save it',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            money: prev.money + 50,
          }));
          context.gainExperience(20);
        },
      },
      {
        text: 'Treat yourself',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            money: prev.money + 25,
            happiness: Math.min(100, prev.happiness + 15),
          }));
          context.gainExperience(15);
        },
      },
    ],
  },
  {
    id: 'power_outage',
    title: 'Power Outage!',
    description: 'There\'s a power outage in Brayden\'s building!',
    choices: [
      {
        text: 'Light candles and rest',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            energy: Math.min(100, prev.energy + 20),
            happiness: Math.max(0, prev.happiness - 5),
          }));
          context.gainExperience(10);
        },
      },
      {
        text: 'Go to a coffee shop',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            money: Math.max(0, prev.money - 10),
            energy: Math.max(0, prev.energy - 10),
            happiness: Math.min(100, prev.happiness + 5),
          }));
          context.gainExperience(15);
        },
      },
    ],
  },
  {
    id: 'friend_visit',
    title: 'Friend Visits!',
    description: 'Brayden\'s friend has come to visit!',
    choices: [
      {
        text: 'Go out for dinner',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            money: Math.max(0, prev.money - 20),
            happiness: Math.min(100, prev.happiness + 25),
            hunger: Math.min(100, prev.hunger + 30),
          }));
          context.gainExperience(25);
        },
      },
      {
        text: 'Stay in and chat',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            happiness: Math.min(100, prev.happiness + 15),
            energy: Math.max(0, prev.energy - 5),
          }));
          context.gainExperience(15);
        },
      },
    ],
  },
  {
    id: 'coding_challenge',
    title: 'Coding Challenge',
    description: 'Brayden found an interesting coding challenge online!',
    choices: [
      {
        text: 'Work on it',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            energy: Math.max(0, prev.energy - 15),
            happiness: Math.min(100, prev.happiness + 10),
          }));
          context.gainExperience(30);
        },
      },
      {
        text: 'Skip it',
        effect: () => {
          // No immediate effect
          context.gainExperience(5);
        },
      },
    ],
  },
];

// Mini-game definitions with updated rewards and costs
const MINI_GAMES = {
  codeRacer: {
    rewards: {
      xp: 50,
      money: 25,
    },
    costs: {
      energy: 15,
      hunger: 10,
    }
  },
  bugSquasher: {
    rewards: {
      xp: 40,
      energy: 15,
    },
    costs: {
      energy: 10,
      hunger: 12,
    }
  },
  memoryMatch: {
    rewards: {
      xp: 30,
      happiness: 20,
    },
    costs: {
      energy: 8,
      hunger: 8,
    }
  }
};

// Add a complete list of all shop items
const initialShopItems: Array<Omit<Collectible, 'isOwned' | 'isEquipped'> & {
  price: number;
}> = [
  // Glasses
  {
    id: 'glasses_nerd',
    name: 'Programmer Glasses',
    description: 'Stylish glasses for the coding genius.',
    price: 120,
    icon: 'glasses',
    rarity: 'uncommon' as const,
    type: 'cosmetic' as const,
    slot: 'glasses' as const,
  },
  {
    id: 'glasses_vr',
    name: 'VR Glasses',
    description: 'Experience virtual reality coding.',
    price: 250,
    icon: 'virtual-reality',
    rarity: 'rare' as const,
    type: 'cosmetic' as const,
    slot: 'glasses' as const,
  },
  {
    id: 'glasses_sunglasses',
    name: 'Cool Sunglasses',
    description: 'Look cool while coding in the sun.',
    price: 150,
    icon: 'sunglasses',
    rarity: 'uncommon' as const,
    type: 'cosmetic' as const,
    slot: 'glasses' as const,
  },
  
  // Hats
  {
    id: 'hat_beanie',
    name: 'Cozy Beanie',
    description: 'A warm beanie to keep your thoughts warm.',
    price: 140,
    icon: 'hat-fedora',
    rarity: 'uncommon' as const,
    type: 'cosmetic' as const,
    slot: 'hat' as const,
  },
  {
    id: 'hat_graduation',
    name: 'Graduation Cap',
    description: 'Show off your smarts with this scholarly cap.',
    price: 200,
    icon: 'school',
    rarity: 'rare' as const,
    type: 'cosmetic' as const,
    slot: 'hat' as const,
  },
  {
    id: 'hat_crown',
    name: 'Royal Crown',
    description: 'Feel like coding royalty with this majestic crown.',
    price: 400,
    icon: 'crown',
    rarity: 'legendary' as const,
    type: 'cosmetic' as const,
    slot: 'hat' as const,
  },
  
  // Shirts
  {
    id: 'shirt_fancy',
    name: 'Business Casual Shirt',
    description: 'Look professional and feel confident.',
    price: 150,
    icon: 'tshirt-crew',
    rarity: 'uncommon' as const,
    type: 'cosmetic' as const,
    slot: 'shirt' as const,
  },
  {
    id: 'shirt_hoodie',
    name: 'Developer Hoodie',
    description: 'The classic programmer attire for late-night coding sessions.',
    price: 200,
    icon: 'hoodie',
    rarity: 'uncommon' as const,
    type: 'cosmetic' as const,
    slot: 'shirt' as const,
  },
  {
    id: 'shirt_formal',
    name: 'Formal Suit',
    description: 'Dress to impress for those important meetings.',
    price: 300,
    icon: 'tie',
    rarity: 'rare' as const,
    type: 'cosmetic' as const,
    slot: 'shirt' as const,
  },
  
  // Accessories
  {
    id: 'accessory_headphones',
    name: 'Premium Headphones',
    description: 'Block distractions with these noise-cancelling headphones.',
    price: 250,
    icon: 'headphones',
    rarity: 'rare' as const,
    type: 'cosmetic' as const,
    slot: 'accessory' as const,
  },
  {
    id: 'accessory_watch',
    name: 'Smart Watch',
    description: 'Keep track of your productivity with this tech accessory.',
    price: 300,
    icon: 'watch',
    rarity: 'rare' as const,
    type: 'cosmetic' as const,
    slot: 'accessory' as const,
  },
  {
    id: 'accessory_coffee',
    name: 'Coffee Mug',
    description: 'A programmer\'s best friend - always by your side.',
    price: 100,
    icon: 'coffee',
    rarity: 'common' as const,
    type: 'cosmetic' as const,
    slot: 'accessory' as const,
  },
  
  // Backgrounds
  {
    id: 'background_office',
    name: 'Modern Office',
    description: 'A sleek workspace background for the professional coder.',
    price: 350,
    icon: 'desktop-tower-monitor',
    rarity: 'rare' as const,
    type: 'cosmetic' as const,
    slot: 'background' as const,
  },
  {
    id: 'background_nature',
    name: 'Nature Retreat',
    description: 'Code surrounded by the calming presence of nature.',
    price: 280,
    icon: 'tree',
    rarity: 'uncommon' as const,
    type: 'cosmetic' as const,
    slot: 'background' as const,
  },
  {
    id: 'background_space',
    name: 'Space Station',
    description: 'Code among the stars in this futuristic space setting.',
    price: 500,
    icon: 'space-station',
    rarity: 'legendary' as const,
    type: 'cosmetic' as const,
    slot: 'background' as const,
  },
];

// Create context with default values
const BraydenContext = createContext<BraydenContextType>({
  stats: DEFAULT_STATS,
  achievements: ACHIEVEMENTS,
  collectibles: COLLECTIBLES,
  feedBrayden: () => {},
  playWithBrayden: () => {},
  workBrayden: () => {},
  resetBrayden: () => {},
  reviveBrayden: () => {},
  toggleSleep: () => {},
  fastForwardTime: () => {},
  isFastForwarding: false,
  // Only keep collectible/cosmetic functions relevant to avatar display
  gainExperience: () => {},
  levelUp: () => {},
  activeCollectibles: [],
  toggleCollectible: () => {},
  triggerRandomEvent: () => {},
  currentEvent: null,
  completeEvent: () => {},
  playMiniGame: () => {},
  // Shop functions
  purchaseCollectible: () => false,
  // Cosmetic functions
  equippedCosmetics: {},
  equipCosmetic: () => false,
  unequipCosmetic: () => {},
  // Money earning function
  earnMoney: () => {},
});

export const BraydenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<BraydenStats>(DEFAULT_STATS);
  const [accelerometerSubscription, setAccelerometerSubscription] = useState<any>(null);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  
  // New gameplay state
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [collectibles, setCollectibles] = useState<Collectible[]>(COLLECTIBLES);
  const [activeCollectibles, setActiveCollectibles] = useState<Collectible[]>([]);
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);
  const [dizzyCount, setDizzyCount] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [lastRandomEventTime, setLastRandomEventTime] = useState(0);
  const [randomEvents, setRandomEvents] = useState<RandomEvent[]>([]);
  
  // Track shake timing
  const [lastShake, setLastShake] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  
  // References to store intervals
  const normalIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fastForwardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add state for equipped cosmetics
  const [equippedCosmetics, setEquippedCosmetics] = useState<{ [key: string]: Collectible | null }>({
    hat: null,
    glasses: null,
    shirt: null,
    accessory: null,
    background: null,
  });

  // Load saved stats and game data
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@brayden_data');
        if (jsonValue !== null) {
          // If data exists, parse it
          const data = JSON.parse(jsonValue);
          // Load stats
          setStats(data.stats || DEFAULT_STATS);
          
          // Load achievements 
          setAchievements(data.achievements || ACHIEVEMENTS);
          
          // Load collectibles - ensure all shop items exist
          if (data.collectibles) {
            // Create a map of existing collectibles
            const existingCollectibles = data.collectibles.reduce((map: any, item: Collectible) => {
              map[item.id] = item;
              return map;
            }, {});
            
            // Create the complete collectibles list, using data from existing ones if available
            const completeCollectibles = initialShopItems.map(shopItem => {
              if (existingCollectibles[shopItem.id]) {
                // If this item exists in saved data, use that data
                return existingCollectibles[shopItem.id];
              } else {
                // Otherwise create a new collectible from the shop item
                return {
                  ...shopItem,
                  isOwned: false,
                  isEquipped: false,
                };
              }
            });
            
            setCollectibles(completeCollectibles);
          } else {
            // No collectibles data, initialize with all shop items
            setCollectibles(initialShopItems.map(item => ({
              ...item,
              isOwned: false,
              isEquipped: false,
            })));
          }
          
          // Update equipped cosmetics based on loaded collectibles
          const loadedCollectibles = data.collectibles || [];
          const equipped: {[key: string]: Collectible | null} = {
            hat: null,
            glasses: null,
            shirt: null,
            accessory: null,
            background: null,
          };
          
          // Find equipped items
          loadedCollectibles.forEach((item: Collectible) => {
            if (item.isEquipped && item.slot) {
              equipped[item.slot] = item;
            }
          });
          
          setEquippedCosmetics(equipped);
          
          // Set total money earned from data or initialize
          setTotalMoneyEarned(data.totalMoneyEarned || 0);
          
          // Set level and XP
          setStats(prev => ({
            ...prev,
            level: data.level || 1,
            experience: data.xp || 0,
          }));
        } else {
          // No data, initialize everything
          setStats(DEFAULT_STATS);
          setAchievements(ACHIEVEMENTS);
          setCollectibles(initialShopItems.map(item => ({
            ...item,
            isOwned: false,
            isEquipped: false,
          })));
          setTotalMoneyEarned(0);
          setStats(prev => ({
            ...prev,
            level: 1,
            experience: 0,
          }));
        }
        
        // Check for daily streak
        const lastPlayed = await AsyncStorage.getItem('braydenLastPlayed');
        if (lastPlayed) {
          const today = new Date().setHours(0, 0, 0, 0);
          const lastDay = new Date(parseInt(lastPlayed)).setHours(0, 0, 0, 0);
          const yesterday = today - 86400000; // 24 hours in milliseconds
          
          if (lastDay === yesterday) {
            // Consecutive day
            setStats(prev => ({ ...prev, streak: prev.streak + 1 }));
          } else if (lastDay < yesterday) {
            // Streak broken
            setStats(prev => ({ ...prev, streak: 1 }));
          }
        }
        
        // Save today's date
        await AsyncStorage.setItem('braydenLastPlayed', Date.now().toString());
        
        // Unlock first day achievement if first time
        if (!lastPlayed) {
          unlockAchievement('first_day');
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        // Initialize with defaults on error
        setStats(DEFAULT_STATS);
        setAchievements(ACHIEVEMENTS);
        setCollectibles(initialShopItems.map(item => ({
          ...item,
          isOwned: false,
          isEquipped: false,
        })));
        setTotalMoneyEarned(0);
        setStats(prev => ({
          ...prev,
          level: 1,
          experience: 0,
        }));
      }
    };
    
    loadData();
  }, []);

  // Save all game data when state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('braydenStats', JSON.stringify(stats));
        await AsyncStorage.setItem('braydenAchievements', JSON.stringify(achievements));
        await AsyncStorage.setItem('braydenCollectibles', JSON.stringify(collectibles));
        await AsyncStorage.setItem('braydenActiveCollectibles', JSON.stringify(activeCollectibles));
        await AsyncStorage.setItem('braydenGameData', JSON.stringify({
          totalMoneyEarned,
          dizzyCount,
          lastRandomEventTime,
        }));
        await AsyncStorage.setItem('braydenEquippedCosmetics', JSON.stringify(equippedCosmetics));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };
    
    saveData();
  }, [stats, achievements, collectibles, activeCollectibles, totalMoneyEarned, dizzyCount, lastRandomEventTime, equippedCosmetics]);

  // Check for achievement unlocks
  useEffect(() => {
    // Check level achievement
    if (stats.level >= 5) {
      unlockAchievement('level_5');
    }
    
    // Check money achievement
    if (totalMoneyEarned >= 1000) {
      unlockAchievement('money_1000');
    }
    
    // Check perfect balance achievement
    if (stats.hunger >= 90 && stats.happiness >= 90 && stats.energy >= 90) {
      unlockAchievement('perfect_balance');
    }
    
    // Check dizzy achievement
    if (dizzyCount >= 5) {
      unlockAchievement('dizzy_5');
    }
    
    // Check streak achievement
    if (stats.streak >= 7) {
      unlockAchievement('streak_7');
    }
  }, [stats, totalMoneyEarned, dizzyCount]);

  // Subscribe to accelerometer for shake detection
  useEffect(() => {
    if (Platform.OS !== 'web') {
      _subscribeToAccelerometer();
    }
    
    return () => {
      _unsubscribeFromAccelerometer();
    };
  }, []);

  // Random event check interval
  useEffect(() => {
    // Start random event check interval
    eventCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      // Check if it's been at least 5 minutes since the last event
      if (now - lastRandomEventTime > 5 * 60 * 1000) {
        // 20% chance of random event
        if (Math.random() < 0.2) {
          triggerRandomEvent();
        }
      }
    }, 60000); // Check every minute
    
    return () => {
      if (eventCheckIntervalRef.current) {
        clearInterval(eventCheckIntervalRef.current);
      }
    };
  }, [lastRandomEventTime]);

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (normalIntervalRef.current) {
        clearInterval(normalIntervalRef.current);
      }
      if (fastForwardIntervalRef.current) {
        clearInterval(fastForwardIntervalRef.current);
      }
      if (eventCheckIntervalRef.current) {
        clearInterval(eventCheckIntervalRef.current);
      }
    };
  }, []);

  // Passive stat changes over time, with collectible boosts
  useEffect(() => {
    // Clear any existing intervals first
    if (normalIntervalRef.current) {
      clearInterval(normalIntervalRef.current);
      normalIntervalRef.current = null;
    }
    
    // Calculate collectible boosts
    const getBoostMultiplier = (statType: 'happiness' | 'energy' | 'money' | 'hunger' | 'experience' | 'all') => {
      // No boosts applied anymore, always return 1.0
      return 1.0;
    };
    
    // Start the normal interval for regular updates
    normalIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timePassed = now - stats.lastUpdated;
      const hoursPassed = timePassed / (1000 * 60 * 60);

      // Don't update stats if Brayden is dead
      if (stats.isDead) return;
      
      // Only apply changes if Brayden is awake
      if (stats.isAwake) {
        setStats(prevStats => {
          // Calculate new stat values when awake
          let newHunger = Math.max(0, prevStats.hunger - 10 * hoursPassed);
          let newHappiness = Math.max(0, prevStats.happiness - 4 * hoursPassed);
          let newEnergy = Math.max(0, prevStats.energy - 4 * hoursPassed);
          
          // Calculate health based on other stats
          let healthChange = 0;
          
          // Health decreases when hunger is critical (below 20)
          if (newHunger < 20) {
            healthChange -= (20 - newHunger) * 0.2 * hoursPassed; // Double the health penalty
          }
          
          // Add energy penalty when hungry
          if (newHunger < 30) {
            // When very hungry, energy depletes faster
            const energyPenalty = Math.min(5, (30 - newHunger) * 0.2) * hoursPassed;
            newEnergy = Math.max(0, newEnergy - energyPenalty);
          }
          
          // Add happiness penalty when hungry
          if (newHunger < 25) {
            // When hungry, happiness decreases faster
            const happinessPenalty = Math.min(3, (25 - newHunger) * 0.15) * hoursPassed;
            newHappiness = Math.max(0, newHappiness - happinessPenalty);
          }
          
          // Health decreases when happiness is critical (below 15)
          if (newHappiness < 15) {
            healthChange -= (15 - newHappiness) * 0.1 * hoursPassed;
          }
          
          // Health decreases when energy is critical (below 10)
          if (newEnergy < 10) {
            healthChange -= (10 - newEnergy) * 0.1 * hoursPassed;
          }
          
          // Health recovers slowly when all stats are good
          if (newHunger > 50 && newHappiness > 50 && newEnergy > 50) {
            healthChange += 2 * hoursPassed;
          }
          
          const newHealth = Math.max(0, Math.min(100, prevStats.health + healthChange));
          
          // Check if Brayden has died
          const isDead = newHealth <= 0;
          
          // If Brayden died, trigger death event
          if (isDead && !prevStats.isDead) {
            // setTimeout used to avoid state update during render
            setTimeout(() => {
              Alert.alert(
                "Brayden has died!",
                "You've neglected Brayden for too long and his health has reached zero. Would you like to revive him?",
                [
                  {
                    text: "Revive (Cost: 100 money)",
                    onPress: () => {
                      // Check if player has enough money
                      if (prevStats.money >= 100) {
                        reviveBrayden();
                      } else {
                        Alert.alert("Not enough money", "You need 100 money to revive Brayden. Earn more money first.");
                      }
                    }
                  },
                  {
                    text: "Reset Stats",
                    onPress: () => resetBrayden()
                  }
                ]
              );
            }, 100);
          }
          
          return {
          ...prevStats,
            hunger: newHunger,
            happiness: newHappiness,
            energy: newEnergy,
            health: newHealth,
            isDead: isDead,
          lastUpdated: now,
          };
        });
      } else {
        // Brayden recovers energy while sleeping
        setStats(prevStats => {
          // Calculate new stat values when sleeping
          const newEnergy = Math.min(100, prevStats.energy + 15 * hoursPassed);
          const newHunger = Math.max(0, prevStats.hunger - 5 * hoursPassed);
          const newHappiness = Math.max(0, prevStats.happiness - 1 * hoursPassed);
          
          // Calculate health based on other stats
          let healthChange = 0;
          
          // Health decreases when hunger is critical (below 20)
          if (newHunger < 20) {
            healthChange -= (20 - newHunger) * 0.2 * hoursPassed; // Double the health penalty
          }
          
          // Health decreases slower when sleeping
          if (newHappiness < 15) {
            healthChange -= (15 - newHappiness) * 0.05 * hoursPassed;
          }
          
          // Health recovers while sleeping if hunger and happiness are reasonable
          if (newHunger > 40 && newHappiness > 40) {
            healthChange += 3 * hoursPassed;
          }
          
          const newHealth = Math.max(0, Math.min(100, prevStats.health + healthChange));
          
          // Check if Brayden has died
          const isDead = newHealth <= 0;
          
          // If Brayden died, trigger death event
          if (isDead && !prevStats.isDead) {
            setTimeout(() => {
              Alert.alert(
                "Brayden has died!",
                "You've neglected Brayden for too long and his health has reached zero. Would you like to revive him?",
                [
                  {
                    text: "Revive (Cost: 100 money)",
                    onPress: () => {
                      // Check if player has enough money
                      if (prevStats.money >= 100) {
                        reviveBrayden();
                      } else {
                        Alert.alert("Not enough money", "You need 100 money to revive Brayden. Earn more money first.");
                      }
                    }
                  },
                  {
                    text: "Reset Stats",
                    onPress: () => resetBrayden()
                  }
                ]
              );
            }, 100);
          }
          
          return {
          ...prevStats,
            energy: newEnergy,
            hunger: newHunger,
            happiness: newHappiness,
            health: newHealth,
            isDead: isDead,
          lastUpdated: now,
          };
        });
      }

      // Reset dizzy state after 5 seconds
      if (stats.isDizzy) {
        const dizzyTimePassed = now - lastShake;
        if (dizzyTimePassed > 5000) {
          setStats(prevStats => ({
            ...prevStats,
            isDizzy: false,
        }));
      }
      }
    }, 60000);
    
    return () => {
      if (normalIntervalRef.current) {
        clearInterval(normalIntervalRef.current);
        normalIntervalRef.current = null;
      }
    };
  }, [stats.isAwake, stats.lastUpdated, stats.isDizzy, stats.isDead, lastShake, activeCollectibles, equippedCosmetics]);

  // Fast-forward time effect for sleeping
  useEffect(() => {
    if (isFastForwarding && !stats.isAwake) {
      if (fastForwardIntervalRef.current) {
        clearInterval(fastForwardIntervalRef.current);
      }
      
      // Accelerated time - update every second instead of every minute
      // And simulate hours passing much faster
      fastForwardIntervalRef.current = setInterval(() => {
        const simulatedHoursPassed = 0.5; // 30 minutes per second
        
        setStats(prevStats => ({
          ...prevStats,
          // Fast-forward simulation
          energy: Math.min(100, prevStats.energy + 20 * simulatedHoursPassed),
          hunger: Math.max(0, prevStats.hunger - 8 * simulatedHoursPassed),
          happiness: Math.max(0, prevStats.happiness - 1 * simulatedHoursPassed),
          lastUpdated: Date.now(),
        }));
        
        // Stop fast-forwarding when energy is full
        if (stats.energy >= 95) {
          setIsFastForwarding(false);
        }
      }, 1000); // Update every second
      
      return () => {
        if (fastForwardIntervalRef.current) {
          clearInterval(fastForwardIntervalRef.current);
          fastForwardIntervalRef.current = null;
        }
      };
    } else if (fastForwardIntervalRef.current) {
      // Clean up if not fast-forwarding
      clearInterval(fastForwardIntervalRef.current);
      fastForwardIntervalRef.current = null;
    }
  }, [isFastForwarding, stats.isAwake, stats.energy]);

  const _subscribeToAccelerometer = () => {
    setAccelerometerSubscription(
      Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        
        // Detect shake with threshold
        if (acceleration > 2.5) {
          const timeDiff = now - lastShake;
          
          // Only count as a shake if it's been at least 100ms since last one
          if (timeDiff > 100) {
            setLastShake(now);
            setShakeCount(prevCount => {
              const newCount = (timeDiff < 1500) ? prevCount + 1 : 1;
              
              // If we've detected 3+ shakes within 1.5 seconds, make Brayden dizzy
              if (newCount >= 3) {
                setDizzyCount(prev => prev + 1);
                setStats(prevStats => ({
                  ...prevStats,
                  isDizzy: true,
                  happiness: Math.max(0, prevStats.happiness - 10),
                }));
                // Give XP for making Brayden dizzy (small amount)
                gainExperience(5);
                return 0; // Reset counter
              }
              
              return newCount;
            });
          }
        }
      })
    );
    
    Accelerometer.setUpdateInterval(100); // Check accelerometer 10 times per second
  };

  const _unsubscribeFromAccelerometer = () => {
    accelerometerSubscription && accelerometerSubscription.remove();
    setAccelerometerSubscription(null);
  };

  const toggleSleep = () => {
    setStats(prevStats => {
      // If going to sleep with low energy, automatically start fast-forwarding
      if (prevStats.isAwake && prevStats.energy < 70) {
        setIsFastForwarding(true);
      } else if (!prevStats.isAwake) {
        // If waking up, stop fast-forwarding
        setIsFastForwarding(false);
      }
      
      // Give experience for toggling sleep (encourages proper rest)
      gainExperience(5);
      
      return {
        ...prevStats,
        isAwake: !prevStats.isAwake,
      };
    });
  };
  
  const fastForwardTime = () => {
    if (!stats.isAwake) {
      setIsFastForwarding(prevState => !prevState);
    }
  };

  // Unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, isUnlocked: true } 
          : achievement
      )
    );
    
    // Show achievement notification
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.isUnlocked) {
      Alert.alert(
        '🏆 Achievement Unlocked!',
        `${achievement.title}: ${achievement.description}`,
        [{ text: 'Awesome!' }]
      );
      
      // Give XP for unlocking achievement
      gainExperience(50);
    }
  };

  // Trigger a random event
  const triggerRandomEvent = () => {
    if (randomEvents.length > 0 && !currentEvent) {
      const randomIndex = Math.floor(Math.random() * randomEvents.length);
      setCurrentEvent(randomEvents[randomIndex]);
      setLastRandomEventTime(Date.now());
    }
  };

  // Complete a random event
  const completeEvent = (choiceIndex: number) => {
    if (currentEvent && currentEvent.choices[choiceIndex]) {
      currentEvent.choices[choiceIndex].effect();
      setCurrentEvent(null);
    }
  };

  // Toggle active collectible
  const toggleCollectible = (id: string) => {
    const collectible = collectibles.find(c => c.id === id);
    if (collectible && collectible.isOwned) {
      // Check if it's already active
      if (activeCollectibles.some(c => c.id === id)) {
        // Remove from active
        setActiveCollectibles(prev => prev.filter(c => c.id !== id));
      } else {
        // Add to active (max 3 active at once)
        if (activeCollectibles.length < 3) {
          setActiveCollectibles(prev => [...prev, collectible]);
        } else {
          Alert.alert(
            'Maximum Active Items',
            'You can only have 3 items active at once. Deactivate one first.',
            [{ text: 'OK' }]
          );
        }
      }
    }
  };

  // Gain experience points and check for level up
  const gainExperience = (amount: number) => {
    setStats((prev: BraydenStats) => {
      const xpForNextLevel = prev.level * 100;
      let newXP = prev.experience + amount;
      let newLevel = prev.level;
      
      // Check if we've leveled up
      if (newXP >= xpForNextLevel) {
        newXP -= xpForNextLevel;
        newLevel += 1;
        
        // Show level up notification
        setTimeout(() => {
          Alert.alert(
            'Level Up!',
            `Brayden is now level ${newLevel}! All stats have been boosted.`,
            [{ text: 'OK' }]
          );
        }, 500);
        
        // Level up gives stat boosts
        return {
          ...prev,
          level: newLevel,
          experience: newXP,
          hunger: Math.min(100, prev.hunger + 20),
          energy: Math.min(100, prev.energy + 20),
          happiness: Math.min(100, prev.happiness + 20),
          health: Math.min(100, prev.health + 10),
        };
      } else {
        // Just add XP, no level up
        return {
          ...prev,
          experience: newXP,
        };
      }
    });
  };

  // Level up function (manual level up, for debug)
  const levelUp = () => {
    setStats(prev => ({
      ...prev,
      level: prev.level + 1,
      experience: 0,
      // Bonus stats on level up
      energy: Math.min(100, prev.energy + 20),
      happiness: Math.min(100, prev.happiness + 10),
    }));
  };

  // Play mini-game function
  const playMiniGame = (gameType: string) => {
    if (!stats.isAwake || stats.isDizzy || stats.isDead) return;
    
    // In a real app, this would navigate to a mini-game screen
    // For now, we'll just simulate rewards based on the game type
    const game = MINI_GAMES[gameType as keyof typeof MINI_GAMES];
    if (game) {
      // Apply costs
      setStats(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - (game.costs?.energy || 0)),
        hunger: Math.max(0, prev.hunger - (game.costs?.hunger || 0)),
      }));
      
      // Simulate a successful game and provide rewards
      setStats(prev => ({
        ...prev,
        money: prev.money + (game.rewards.money || 0),
        energy: Math.min(100, prev.energy + (game.rewards.energy || 0)),
        happiness: Math.min(100, prev.happiness + (game.rewards.happiness || 0)),
      }));
      
      // Update total money earned
      if (game.rewards.money) {
        setTotalMoneyEarned((prev: number) => prev + (game.rewards.money || 0));
      }
      
      // Give XP for playing game
      gainExperience(game.rewards.xp || 10);
    }
  };

  const feedBrayden = () => {
    if (!stats.isAwake || stats.isDizzy || stats.isDead) return;
    
    setStats(prevStats => ({
      ...prevStats,
      // Reduced hunger replenishment
      hunger: Math.min(100, prevStats.hunger + 20),
      // Increased cost to feed
      money: Math.max(0, prevStats.money - 20),
    }));
    
    // Same XP for feeding
    gainExperience(15);
  };

  const playWithBrayden = () => {
    if (!stats.isAwake || stats.isDizzy || stats.isDead) return;
    
    setStats(prevStats => ({
      ...prevStats,
      // Same happiness boost
      happiness: Math.min(100, prevStats.happiness + 25),
      // Increased energy cost
      energy: Math.max(0, prevStats.energy - 15),
      // Also costs hunger now
      hunger: Math.max(0, prevStats.hunger - 5),
    }));
    
    // Same XP for playing
    gainExperience(20);
  };

  const workBrayden = () => {
    if (!stats.isAwake || stats.isDizzy || stats.isDead) return;
    
    const moneyEarned = 30;
    
    setStats(prevStats => ({
      ...prevStats,
      // Same money earnings
      money: prevStats.money + moneyEarned,
      // Increased energy cost
      energy: Math.max(0, prevStats.energy - 20),
      // Increased happiness cost
      happiness: Math.max(0, prevStats.happiness - 5),
      // Also costs hunger now
      hunger: Math.max(0, prevStats.hunger - 8),
    }));
    
    // Update total money earned
    setTotalMoneyEarned((prev: number) => prev + moneyEarned);
    
    // Same XP for working
    gainExperience(25);
  };

  const resetBrayden = () => {
    setStats(DEFAULT_STATS);
    // Keep achievements and collectibles for progression
  };

  // New function to revive Brayden
  const reviveBrayden = () => {
    setStats((prev: BraydenStats) => ({
      ...prev,
      health: 50, // Revive with partial health
      hunger: 40, // Revive hungry
      happiness: 30, // Revive unhappy
      energy: 60, // Revive with decent energy
      money: prev.money - 100, // Pay revival cost
      isDead: false // No longer dead
    }));
  };

  // Add shop functions
  const purchaseCollectible = (id: string, autoEquip: boolean = false): boolean => {
    console.log(`Purchase function called for item: ${id} with autoEquip=${autoEquip}`);
    
    // Find the item in the ShopScreen's SHOP_ITEMS
    const shopItem = initialShopItems.find((item) => item.id === id);
    
    if (!shopItem) {
      console.log(`Item not found in shop: ${id}`);
      return false;
    }
    
    // Check if already owned
    const alreadyOwned = collectibles.some(c => c.id === id && c.isOwned);
    if (alreadyOwned) {
      console.log(`Item already owned: ${id}`);
      if (autoEquip) {
        // If already owned and autoEquip is true, just equip it
        _equipCosmetic(id);
      }
      return true;
    }
    
    // Check if can afford
    if (stats.money < shopItem.price) {
      console.log(`Not enough money to buy ${id}. Need ${shopItem.price}, have ${stats.money}`);
      return false;
    }
    
    console.log(`Purchasing item ${id} for ${shopItem.price}`);
    
    // Purchase
    setStats((prev) => ({
      ...prev,
      money: prev.money - shopItem.price,
    }));
    
    // Create the new cosmetic with isOwned=true
    const newCosmetic = {
      ...shopItem,
      isOwned: true,
      isEquipped: autoEquip, // Set isEquipped based on autoEquip parameter
    } as Collectible;
    
    // Update collectible ownership
    setCollectibles((prev) => {
      const updatedCollectibles = prev.map(c => {
        if (c.id === id) {
          console.log(`Setting item ${id} to owned${autoEquip ? ' and equipped' : ''}`);
          return { 
            ...c, 
            isOwned: true,
            isEquipped: autoEquip || c.isEquipped 
          };
        }
        
        // If we're equipping this item, unequip any others in the same slot
        if (autoEquip && c.slot === shopItem.slot && c.isEquipped) {
          return { ...c, isEquipped: false };
        }
        
        return c;
      });
      
      // Make sure the item is in the collectibles array
      const itemExists = updatedCollectibles.some(c => c.id === id);
      if (!itemExists) {
        console.log(`Item ${id} not found in collectibles array, adding it`);
        updatedCollectibles.push(newCosmetic);
      }
      
      return updatedCollectibles;
    });
    
    // If autoEquip is true, update the equipped cosmetics state directly
    if (autoEquip && shopItem.slot) {
      console.log(`Auto-equipping item ${id} in slot ${shopItem.slot}`);
      setEquippedCosmetics((prev) => ({
        ...prev,
        [shopItem.slot]: newCosmetic,
      }));
    }
    
    console.log(`Successfully purchased ${id}`);
    return true;
  };

  // Inner private function for equipping which assumes the item is already owned
  const _equipCosmetic = (id: string): boolean => {
    // Find the collectible
    const cosmetic = collectibles.find(c => c.id === id);
    if (!cosmetic || !cosmetic.slot) {
      return false;
    }
    
    // First unequip any existing item in the same slot
    setCollectibles((prev: Collectible[]) => prev.map(c => {
      if (c.slot === cosmetic.slot && c.isEquipped) {
        return { ...c, isEquipped: false };
      }
      return c;
    }));
    
    // Equip the new one
    setCollectibles((prev: Collectible[]) => prev.map(c => {
      if (c.id === id) {
        return { ...c, isEquipped: true };
      }
      return c;
    }));
    
    // Update equipped cosmetics state
    setEquippedCosmetics((prev: {[key: string]: Collectible | null}) => {
      const newState = {
        ...prev,
        [cosmetic.slot]: cosmetic,
      };
      return newState;
    });
    
    return true;
  };
  
  // Public function that checks if owned first
  const equipCosmetic = (id: string): boolean => {
    // Find the collectible
    const cosmetic = collectibles.find(c => c.id === id);
    
    if (!cosmetic || !cosmetic.isOwned || !cosmetic.slot) {
      return false;
    }
    
    return _equipCosmetic(id);
  };
  
  // Add function to unequip cosmetic
  const unequipCosmetic = (slot: string) => {
    // Find the equipped cosmetic for this slot
    const equipped = collectibles.find(c => c.slot === slot && c.isEquipped);
    
    if (equipped) {
      // Unequip it
      setCollectibles((prev: Collectible[]) => prev.map(c => {
        if (c.id === equipped.id) {
          return { ...c, isEquipped: false };
        }
        return c;
      }));
      
      // Update equipped cosmetics state
      setEquippedCosmetics((prev: {[key: string]: Collectible | null}) => ({
        ...prev,
        [slot]: null,
      }));
    }
  };

  // Add new function to earn money from various activities
  const earnMoney = (amount: number, energyCost: number, happinessCost: number) => {
    if (!stats.isAwake || stats.isDizzy) return;
    
    // Apply boosts from equipped cosmetics
    const getStatBoost = (statType: string): number => {
      // Start with base multiplier
      let multiplier = 1.0;
      
      // Check each equipped cosmetic for relevant bonuses
      Object.values(equippedCosmetics).forEach(item => {
        if (!item || !item.statBonus) return;
        
        // Apply "all_stats" bonus to everything
        if (item.statBonus.type === 'all_stats') {
          multiplier += item.statBonus.value / 100;
        }
        
        // Apply specific stat bonuses
        switch (statType) {
          case 'money':
            if (item.statBonus.type === 'money_boost') {
              multiplier += item.statBonus.value / 100;
            }
            break;
          case 'energy':
            if (item.statBonus.type === 'energy_efficiency') {
              // For energy costs, lower multiplier is better (less energy used)
              multiplier -= item.statBonus.value / 100;
            }
            break;
          case 'work':
            if (item.statBonus.type === 'work_efficiency') {
              multiplier += item.statBonus.value / 100;
            }
            break;
          case 'happiness':
            if (item.statBonus.type === 'happiness_boost') {
              multiplier += item.statBonus.value / 100;
            }
            break;
          case 'xp':
            if (item.statBonus.type === 'xp_gain') {
              multiplier += item.statBonus.value / 100;
            }
            break;
          case 'play':
            if (item.statBonus.type === 'play_boost') {
              multiplier += item.statBonus.value / 100;
            }
            break;
        }
      });
      
      // Ensure energy efficiency doesn't go below minimum value
      if (statType === 'energy') {
        multiplier = Math.max(0.5, multiplier);
      }
      
      return multiplier;
    };
    
    // Get boost multipliers for different stats
    const moneyBoost = getStatBoost('money');
    const energyBoost = getStatBoost('energy'); 
    const xpBoost = getStatBoost('xp');
    
    // Calculate final amounts with boosts
    const finalAmount = Math.round(amount * moneyBoost);
    const finalEnergyCost = Math.round(energyCost * energyBoost);
    
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      money: prevStats.money + finalAmount,
      energy: Math.max(0, prevStats.energy - finalEnergyCost),
      happiness: Math.max(0, prevStats.happiness - happinessCost),
    }));
    
    // Update total money earned
    setTotalMoneyEarned((prev: number) => prev + finalAmount);
    
    // Award XP based on money earned with XP boost
    gainExperience(Math.round((finalAmount / 4) * xpBoost));
    
    return {
      moneyEarned: finalAmount,
      energySpent: finalEnergyCost,
      happinessChange: -happinessCost
    };
  };

  return (
    <BraydenContext.Provider
      value={{
        stats,
        achievements,
        collectibles,
        feedBrayden,
        playWithBrayden,
        workBrayden,
        resetBrayden,
        reviveBrayden,
        toggleSleep,
        fastForwardTime,
        isFastForwarding,
        // Only keep collectible/cosmetic functions relevant to avatar display
        gainExperience,
        levelUp,
        activeCollectibles,
        toggleCollectible,
        triggerRandomEvent,
        currentEvent,
        completeEvent,
        playMiniGame,
        // Shop functions
        purchaseCollectible,
        // Cosmetic functions
        equippedCosmetics,
        equipCosmetic,
        unequipCosmetic,
        // Money earning function
        earnMoney,
      }}
    >
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