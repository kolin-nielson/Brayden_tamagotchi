export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  choices: {
    text: string;
    effect: () => void;
  }[];
}

export const createRandomEvents = (context: any): RandomEvent[] => [
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
            money: Math.max(0, prev.money - 15),
            energy: Math.max(0, prev.energy - 10),
            happiness: Math.min(100, prev.happiness + 10),
          }));
          context.gainExperience(15);
        },
      },
    ],
  },
  {
    id: 'found_money',
    title: 'Found Money!',
    description: 'Brayden found some money on the ground!',
    choices: [
      {
        text: 'Keep it',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            money: prev.money + 25,
            happiness: Math.min(100, prev.happiness + 5),
          }));
          context.gainExperience(10);
        },
      },
      {
        text: 'Look for the owner',
        effect: () => {
          context.setStats(prev => ({
            ...prev,
            happiness: Math.min(100, prev.happiness + 15),
            energy: Math.max(0, prev.energy - 10),
          }));
          context.gainExperience(25);
        },
      },
    ],
  },
]; 