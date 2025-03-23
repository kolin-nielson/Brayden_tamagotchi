export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  category: 'food' | 'medicine' | 'toy' | 'decoration';
  hungerRestored?: number;
  energyRestored?: number;
  energyBoost?: number;
  healthRestored?: number;
  healthBoost?: number;
  happinessBoost?: number;
  curesDizzy?: boolean;
  isOneTimeUse?: boolean;
  createdAt?: number;
}

export interface ShopState {
  items: ShopItem[];
  selectedCategory: string | null;
  inventory: {
    [itemId: string]: number;
  };
}

export interface UseItemParams {
  itemId: string;
  quantity?: number;
}

export interface ShopContextType extends ShopState {
  buyItem: (itemId: string) => void;
  useItem: (params: UseItemParams) => void;
  getItemQuantity: (itemId: string) => number;
  setSelectedCategory: (category: string | null) => void;
  addItemToInventory: (itemId: string, quantity?: number) => void;
  removeItemFromInventory: (itemId: string, quantity?: number) => void;
} 