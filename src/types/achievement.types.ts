export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: string; // Icon name for display
}

export type AchievementID = 
  | 'first_day'
  | 'level_3'
  | 'level_5'
  | 'level_10'
  | 'money_1000'
  | 'earn_5000'
  | 'perfect_balance'
  | 'dizzy_5'
  | 'streak_3'
  | 'streak_7'
  | 'feed_10'
  | 'play_10'
  | 'work_10'
  | 'energy_90'
  | 'happy_90';
  
export interface AchievementState {
  achievements: Achievement[];
  unlockAchievement: (id: AchievementID) => void;
} 