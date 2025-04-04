import { ShopItem } from '../types/shop.types';

export const SHOP_ITEMS: ShopItem[] = [
  // Food items
  {
    id: 'apple',
    name: 'Apple',
    description: 'A fresh, juicy apple. Restores a small amount of hunger.',
    price: 10,
    icon: 'food-apple',
    rarity: 'common',
    category: 'food',
    hungerRestored: 10,
    healthBoost: 2,
    energyBoost: 5,
  },
  {
    id: 'burger',
    name: 'Burger',
    description: 'A delicious burger. Restores a moderate amount of hunger.',
    price: 30,
    icon: 'hamburger',
    rarity: 'common',
    category: 'food',
    hungerRestored: 35,
    energyBoost: 10,
    happinessBoost: 5,
    healthBoost: -5, // Unhealthy food
  },
  {
    id: 'pizza',
    name: 'Pizza Slice',
    description: 'A slice of cheesy pizza. Restores hunger and gives happiness.',
    price: 25,
    icon: 'pizza',
    rarity: 'common',
    category: 'food',
    hungerRestored: 25,
    happinessBoost: 10,
    healthBoost: -3, // Slightly unhealthy
  },
  {
    id: 'salad',
    name: 'Healthy Salad',
    description: 'A nutritious salad. Restores hunger and boosts health.',
    price: 40,
    icon: 'food-fork-drink',
    rarity: 'uncommon',
    category: 'food',
    hungerRestored: 20,
    healthBoost: 15,
    energyBoost: 5,
    happinessBoost: -5, // Not the most delicious
  },
  {
    id: 'cake',
    name: 'Birthday Cake',
    description: 'A festive birthday cake! Major happiness boost but not healthy.',
    price: 100,
    icon: 'cake-variant',
    rarity: 'rare',
    category: 'food',
    hungerRestored: 40,
    happinessBoost: 30,
    healthBoost: -10, // Very unhealthy
    energyBoost: 15,
  },
  {
    id: 'superfood',
    name: 'Superfood Meal',
    description: 'The ultimate balanced meal. Restores all stats significantly.',
    price: 200,
    icon: 'silverware-variant',
    rarity: 'legendary',
    category: 'food',
    hungerRestored: 70,
    healthBoost: 30,
    energyBoost: 40,
    happinessBoost: 20,
  },
  
  // Medicine items
  {
    id: 'bandaid',
    name: 'Band-Aid',
    description: 'A simple adhesive bandage. Restores a small amount of health.',
    price: 15,
    icon: 'bandage',
    rarity: 'common',
    category: 'medicine',
    healthRestored: 10,
  },
  {
    id: 'medicine',
    name: 'Medicine',
    description: 'Basic medicine. Restores a moderate amount of health.',
    price: 35,
    icon: 'pill',
    rarity: 'common',
    category: 'medicine',
    healthRestored: 25,
  },
  {
    id: 'first_aid',
    name: 'First Aid Kit',
    description: 'A well-stocked first aid kit. Significantly restores health.',
    price: 75,
    icon: 'medical-bag',
    rarity: 'uncommon',
    category: 'medicine',
    healthRestored: 50,
  },
  {
    id: 'dizzy_cure',
    name: 'Dizziness Relief',
    description: 'Cures dizziness immediately.',
    price: 50,
    icon: 'head-sync',
    rarity: 'uncommon',
    category: 'medicine',
    curesDizzy: true,
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'A boost of energy in a can. Restores energy but slightly reduces health.',
    price: 30,
    icon: 'bottle-tonic',
    rarity: 'common',
    category: 'medicine',
    energyRestored: 40,
    healthBoost: -5, // Side effect
  },
  {
    id: 'vitamin',
    name: 'Multivitamin',
    description: 'Daily vitamins for overall well-being.',
    price: 30,
    icon: 'pill',
    rarity: 'common',
    category: 'medicine',
    healthBoost: 10,
    energyBoost: 5,
  },
  {
    id: 'miracle_cure',
    name: 'Miracle Cure',
    description: 'A legendary medicine that heals all ailments and fully restores health.',
    price: 500,
    icon: 'flask-round-bottom',
    rarity: 'legendary',
    category: 'medicine',
    healthRestored: 100,
    energyRestored: 50,
    curesDizzy: true,
  },
  
  // Toys/Entertainment items
  {
    id: 'ball',
    name: 'Bouncy Ball',
    description: 'A simple ball for play. Boosts happiness.',
    price: 20,
    icon: 'basketball',
    rarity: 'common',
    category: 'toy',
    happinessBoost: 15,
    energyBoost: -5, // Uses energy to play
  },
  {
    id: 'puzzle',
    name: 'Puzzle Game',
    description: 'A stimulating puzzle. Boosts happiness and a small health boost from mental exercise.',
    price: 40,
    icon: 'puzzle',
    rarity: 'uncommon',
    category: 'toy',
    happinessBoost: 20,
    healthBoost: 5,
    energyBoost: -10, // Uses mental energy
  },
  {
    id: 'video_game',
    name: 'Video Game',
    description: 'An entertaining video game. Major happiness boost!',
    price: 100,
    icon: 'gamepad-variant',
    rarity: 'rare',
    category: 'toy',
    happinessBoost: 40,
    energyBoost: -15, // Uses energy to play
  },
  {
    id: 'vr_headset',
    name: 'VR Headset',
    description: 'An immersive virtual reality experience. Legendary entertainment!',
    price: 300,
    icon: 'virtual-reality',
    rarity: 'legendary',
    category: 'toy',
    happinessBoost: 70,
    energyBoost: -25, // Uses a lot of energy
  },
  
  // Decoration items (one-time use)
  {
    id: 'plant',
    name: 'Small Plant',
    description: 'A small decorative plant for ambiance.',
    price: 50,
    icon: 'flower',
    rarity: 'common',
    category: 'decoration',
    isOneTimeUse: true,
  },
  {
    id: 'poster',
    name: 'Cool Poster',
    description: 'A decorative poster to personalize your space.',
    price: 75,
    icon: 'image',
    rarity: 'uncommon',
    category: 'decoration',
    isOneTimeUse: true,
  },
  {
    id: 'lamp',
    name: 'Fancy Lamp',
    description: 'A stylish lamp to light up your room.',
    price: 150,
    icon: 'lamp',
    rarity: 'rare',
    category: 'decoration',
    isOneTimeUse: true,
  },
  {
    id: 'aquarium',
    name: 'Fish Tank',
    description: 'A beautiful aquarium with tropical fish.',
    price: 350,
    icon: 'fishbowl',
    rarity: 'legendary',
    category: 'decoration',
    isOneTimeUse: true,
  },
]; 