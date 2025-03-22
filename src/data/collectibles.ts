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

// Collectible items
export const COLLECTIBLES: Collectible[] = [
  // Glasses
  {
    id: 'glasses_nerd',
    name: 'Programmer Glasses',
    description: 'Stylish glasses for the coding genius. +15% coding efficiency.',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'glasses',
    type: 'cosmetic',
    slot: 'glasses',
    statBonus: {
      type: 'work_efficiency',
      value: 15
    }
  },
  {
    id: 'glasses_vr',
    name: 'VR Glasses',
    description: 'Experience virtual reality coding. +25% happiness when playing games.',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'virtual-reality',
    type: 'cosmetic',
    slot: 'glasses',
    statBonus: {
      type: 'play_boost',
      value: 25
    }
  },
  {
    id: 'glasses_sunglasses',
    name: 'Cool Sunglasses',
    description: 'Look cool while coding in the sun. +10% to all stats.',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'sunglasses',
    type: 'cosmetic',
    slot: 'glasses',
    statBonus: {
      type: 'all_stats',
      value: 10
    }
  },
  
  // Hats
  {
    id: 'hat_beanie',
    name: 'Cozy Beanie',
    description: 'A warm beanie to keep your thoughts warm. +8% energy recovery.',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'hat-fedora',
    type: 'cosmetic',
    slot: 'hat',
    statBonus: {
      type: 'energy_regen',
      value: 8
    }
  },
  {
    id: 'hat_graduation',
    name: 'Graduation Cap',
    description: 'Show off your smarts with this scholarly cap. +20% XP gain.',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'school',
    type: 'cosmetic',
    slot: 'hat',
    statBonus: {
      type: 'xp_gain',
      value: 20
    }
  },
  {
    id: 'hat_crown',
    name: 'Royal Crown',
    description: 'Feel like coding royalty with this majestic crown. +30% money from work.',
    isOwned: false,
    isEquipped: false,
    rarity: 'legendary',
    icon: 'crown',
    type: 'cosmetic',
    slot: 'hat',
    statBonus: {
      type: 'money_boost',
      value: 30
    }
  },
  
  // Shirts
  {
    id: 'shirt_fancy',
    name: 'Business Casual Shirt',
    description: 'Look professional and feel confident. +12% happiness.',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'tshirt-crew',
    type: 'cosmetic',
    slot: 'shirt',
    statBonus: {
      type: 'happiness_boost',
      value: 12
    }
  },
  {
    id: 'shirt_hoodie',
    name: 'Developer Hoodie',
    description: 'The classic programmer attire for late-night coding sessions. +15% energy efficiency.',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'hanger',
    type: 'cosmetic',
    slot: 'shirt',
    statBonus: {
      type: 'energy_efficiency',
      value: 15
    }
  },
  {
    id: 'shirt_formal',
    name: 'Formal Suit',
    description: 'Dress to impress for those important meetings. +22% money from all sources.',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'tie',
    type: 'cosmetic',
    slot: 'shirt',
    statBonus: {
      type: 'money_boost',
      value: 22
    }
  },
  
  // Accessories
  {
    id: 'accessory_headphones',
    name: 'Premium Headphones',
    description: 'Block distractions with these noise-cancelling headphones. +18% focus when working.',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'headphones',
    type: 'cosmetic',
    slot: 'accessory',
    statBonus: {
      type: 'work_efficiency',
      value: 18
    }
  },
  {
    id: 'accessory_watch',
    name: 'Smart Watch',
    description: 'Keep track of your productivity with this tech accessory. +10% to all stats.',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'watch',
    type: 'cosmetic',
    slot: 'accessory',
    statBonus: {
      type: 'all_stats',
      value: 10
    }
  },
  {
    id: 'accessory_coffee',
    name: 'Coffee Mug',
    description: 'A programmer\'s best friend - always by your side. +15% energy regeneration.',
    isOwned: false,
    isEquipped: false,
    rarity: 'common',
    icon: 'coffee',
    type: 'cosmetic',
    slot: 'accessory',
    statBonus: {
      type: 'energy_regen',
      value: 15
    }
  },
  
  // Backgrounds
  {
    id: 'background_office',
    name: 'Modern Office',
    description: 'A sleek workspace background for the professional coder. +15% work efficiency.',
    isOwned: false,
    isEquipped: false,
    rarity: 'rare',
    icon: 'desktop-tower-monitor',
    type: 'cosmetic',
    slot: 'background',
    statBonus: {
      type: 'work_efficiency',
      value: 15
    }
  },
  {
    id: 'background_nature',
    name: 'Nature Retreat',
    description: 'Code surrounded by the calming presence of nature. +18% happiness gain.',
    isOwned: false,
    isEquipped: false,
    rarity: 'uncommon',
    icon: 'pine-tree',
    type: 'cosmetic',
    slot: 'background',
    statBonus: {
      type: 'happiness_boost',
      value: 18
    }
  },
  {
    id: 'background_space',
    name: 'Space Station',
    description: 'Code among the stars in this futuristic space setting. +15% to all stats.',
    isOwned: false,
    isEquipped: false,
    rarity: 'legendary',
    icon: 'rocket',
    type: 'cosmetic',
    slot: 'background',
    statBonus: {
      type: 'all_stats',
      value: 15
    }
  },
]; 