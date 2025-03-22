export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: string; // Icon name for display
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_day',
    title: 'First Day',
    description: 'Play with Brayden for the first time',
    isUnlocked: false,
    icon: 'trophy',
  },
  {
    id: 'level_3',
    title: 'Beginner',
    description: 'Reach level 3 with Brayden',
    isUnlocked: false,
    icon: 'chart-line',
  },
  {
    id: 'level_5',
    title: 'Growing Up',
    description: 'Reach level 5 with Brayden',
    isUnlocked: false,
    icon: 'chart-line',
  },
  {
    id: 'level_10',
    title: 'Expert Caretaker',
    description: 'Reach level 10 with Brayden',
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
    id: 'earn_5000',
    title: 'Fortune Builder',
    description: 'Earn 5000 money total',
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
    id: 'streak_3',
    title: 'Consistent Care',
    description: 'Play 3 days in a row',
    isUnlocked: false,
    icon: 'calendar-check',
  },
  {
    id: 'streak_7',
    title: 'Weekly Dedication',
    description: 'Play 7 days in a row',
    isUnlocked: false,
    icon: 'calendar-check',
  },
  {
    id: 'feed_10',
    title: 'Healthy Diet',
    description: 'Feed Brayden 10 times',
    isUnlocked: false,
    icon: 'food-apple',
  },
  {
    id: 'play_10',
    title: 'Playful Friend',
    description: 'Play with Brayden 10 times',
    isUnlocked: false,
    icon: 'gamepad-variant',
  },
  {
    id: 'work_10',
    title: 'Hard Worker',
    description: 'Make Brayden work 10 times',
    isUnlocked: false,
    icon: 'laptop',
  },
  {
    id: 'energy_90',
    title: 'Energizer',
    description: 'Reach 90 energy or higher',
    isUnlocked: false,
    icon: 'lightning-bolt',
  },
  {
    id: 'happy_90',
    title: 'Pure Joy',
    description: 'Reach 90 happiness or higher',
    isUnlocked: false,
    icon: 'emoticon-happy',
  },
]; 