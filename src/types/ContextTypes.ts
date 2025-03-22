import { BraydenStats } from './BraydenTypes';
import { Achievement } from '../data/achievements';
import { RandomEvent } from '../data/randomEvents';
import { Upgrade } from '../data/upgrades';
import { Dispatch, SetStateAction } from 'react';

export interface BraydenContextType {
  stats: BraydenStats;
  achievements: Achievement[];
  upgrades: Upgrade[];
  feedBrayden: () => void;
  playWithBrayden: () => void;
  workBrayden: () => void;
  resetBrayden: () => void;
  reviveBrayden: () => void;
  toggleSleep: () => void;
  fastForwardTime: () => void;
  isFastForwarding: boolean;
  gainExperience: (amount: number) => void;
  levelUp: () => void;
  // Random events
  triggerRandomEvent: () => void;
  currentEvent: RandomEvent | null;
  completeEvent: (choiceIndex: number) => void;
  playMiniGame: (gameType: string) => void;
  // Upgrade functions
  purchaseUpgrade: (id: string) => boolean;
  // Money earning function
  earnMoney: (amount: number, energyCost: number, happinessCost: number) => void;
  // State setter functions
  setStats: Dispatch<SetStateAction<BraydenStats>>;
  setUpgrades: Dispatch<SetStateAction<Upgrade[]>>;
  saveData: () => Promise<void>;
} 