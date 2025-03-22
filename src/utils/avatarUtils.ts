import { BraydenStats } from '../types/BraydenTypes';
import { Collectible } from '../data/collectibles';

/**
 * Get mood description based on Brayden's stats
 */
export const getMoodDescription = (stats: BraydenStats): string => {
  if (!stats.isAwake) return "Sleeping";
  if (stats.isDizzy) return "Dizzy";
  if (stats.isDead) return "Fainted";
  if (stats.hunger < 20) return "Hungry";
  if (stats.energy < 20) return "Tired";
  if (stats.happiness < 30) return "Sad";
  if (stats.happiness > 70) return "Happy";
  return "Neutral";
};

/**
 * Get cosmetic position on the avatar
 */
export const getCosmeticPosition = (slot: string, size: number): any => {
  switch (slot) {
    case 'hat':
      return {
        position: 'absolute',
        top: -size * 0.2,
        alignSelf: 'center',
        zIndex: 10,
      } as any;
    case 'glasses':
      return {
        position: 'absolute',
        top: size * 0.2,
        alignSelf: 'center',
        zIndex: 15,
      } as any;
    case 'shirt':
      return {
        position: 'absolute',
        top: size * 0.45,
        alignSelf: 'center',
        zIndex: 5,
      } as any;
    case 'accessory':
      return {
        position: 'absolute',
        top: size * 0.3,
        right: size * 0.1,
        zIndex: 8,
      } as any;
    case 'background':
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      } as any;
    default:
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
      } as any;
  }
};

/**
 * Get size for a cosmetic item
 */
export const getCosmeticSize = (slot: string, size: number): {width: number, height: number} => {
  switch (slot) {
    case 'hat':
      return {
        width: size * 0.5,
        height: size * 0.3
      };
    case 'glasses':
      return {
        width: size * 0.4,
        height: size * 0.15
      };
    case 'shirt':
      return {
        width: size * 0.7,
        height: size * 0.4
      };
    case 'accessory':
      return {
        width: size * 0.3,
        height: size * 0.3
      };
    case 'background':
      return {
        width: size,
        height: size
      };
    default:
      return {
        width: size * 0.4,
        height: size * 0.4
      };
  }
};

/**
 * Get color for a cosmetic item based on rarity
 */
export const getCosmeticColor = (item: Collectible, theme: any): string => {
  if (!item) return theme.colors.primary;
  
  switch (item.rarity) {
    case 'common': return '#AAAAAA';
    case 'uncommon': return '#55AA55';
    case 'rare': return '#5555FF';
    case 'legendary': return '#AA55AA';
    default: return theme.colors.primary;
  }
};

/**
 * Get background color based on rarity
 */
export const getBackgroundColor = (item: Collectible): string => {
  switch (item.rarity) {
    case 'legendary': return 'rgba(170, 85, 170, 0.15)';
    case 'rare': return 'rgba(85, 85, 255, 0.15)';
    case 'uncommon': return 'rgba(85, 170, 85, 0.15)';
    default: return 'rgba(170, 170, 170, 0.1)';
  }
};

/**
 * Lighten a color by a specified amount
 */
export const lightenColor = (color: string, amount: number): string => {
  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Increase RGB values
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Darken a color by a specified amount
 */
export const darkenColor = (color: string, amount: number): string => {
  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Decrease RGB values
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Get detailed information for a specific cosmetic
 */
export const getCosmeticDetail = (item: Collectible, slot: string) => {
  // No detail, return null
  if (!item) return null;
  
  return {
    name: item.name,
    icon: item.icon,
    rarity: item.rarity,
    slot,
    id: item.id
  };
}; 