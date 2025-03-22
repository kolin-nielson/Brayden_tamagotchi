import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';
import { Surface, Button } from 'react-native-paper';
import { Upgrade } from '../data/upgrades';

// Define food items with their costs and effects
const FOOD_ITEMS = [
  {
    id: 'apple',
    name: 'Apple',
    description: 'A healthy snack to keep hunger at bay.',
    price: 5,
    icon: 'food-apple',
    rarity: 'common',
    type: 'food',
    hungerRestored: 15,
    healthBoost: 2,
  },
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'A delicious meal that provides a good energy boost.',
    price: 15,
    icon: 'pizza',
    rarity: 'uncommon',
    type: 'food',
    hungerRestored: 30,
    happinessBoost: 5,
  },
  {
    id: 'burger',
    name: 'Burger',
    description: 'A filling burger that restores lots of hunger.',
    price: 20,
    icon: 'hamburger',
    rarity: 'uncommon',
    type: 'food',
    hungerRestored: 40,
    happinessBoost: 8,
  },
  {
    id: 'salad',
    name: 'Salad',
    description: 'A nutritious salad that improves health significantly.',
    price: 25,
    icon: 'food',
    rarity: 'uncommon',
    type: 'food',
    hungerRestored: 25,
    healthBoost: 10,
  },
  {
    id: 'cake',
    name: 'Cake',
    description: 'A sweet treat that brings lots of happiness.',
    price: 30,
    icon: 'cake',
    rarity: 'rare',
    type: 'food',
    hungerRestored: 20,
    happinessBoost: 15,
  },
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'A caffeinated drink that provides an energy boost.',
    price: 10,
    icon: 'coffee',
    rarity: 'common',
    type: 'food',
    hungerRestored: 5,
    energyBoost: 15,
  },
  {
    id: 'sushi',
    name: 'Sushi',
    description: 'Premium food that provides balance to all stats.',
    price: 40,
    icon: 'food-variant',
    rarity: 'rare',
    type: 'food',
    hungerRestored: 35,
    healthBoost: 5,
    happinessBoost: 10,
  },
  {
    id: 'smoothie',
    name: 'Health Smoothie',
    description: 'A nutritious drink packed with vitamins.',
    price: 35,
    icon: 'cup',
    rarity: 'rare',
    type: 'food',
    hungerRestored: 25,
    healthBoost: 15,
    energyBoost: 5,
  },
  {
    id: 'icecream',
    name: 'Ice Cream',
    description: 'A cold treat that brings joy but not much nutrition.',
    price: 15,
    icon: 'ice-cream',
    rarity: 'uncommon',
    type: 'food',
    hungerRestored: 10,
    happinessBoost: 20,
  },
  {
    id: 'energydrink',
    name: 'Energy Drink',
    description: 'A highly caffeinated beverage for when you need to stay awake.',
    price: 25,
    icon: 'bottle-tonic',
    rarity: 'rare',
    type: 'food',
    hungerRestored: 5,
    energyBoost: 30,
    healthBoost: -5,
  },
];

// Define medicine items with their costs and effects
const MEDICINE_ITEMS = [
  {
    id: 'firstaid',
    name: 'First Aid Kit',
    description: 'Basic medical supplies to improve health.',
    price: 30,
    icon: 'medical-bag',
    rarity: 'uncommon',
    type: 'medicine',
    healthRestored: 30,
  },
  {
    id: 'vitamins',
    name: 'Vitamins',
    description: 'Dietary supplements to boost overall health.',
    price: 20,
    icon: 'pill',
    rarity: 'common',
    type: 'medicine',
    healthRestored: 15,
    energyBoost: 5,
  },
  {
    id: 'antidote',
    name: 'Antidote',
    description: 'Cures the dizzy status effect immediately.',
    price: 50,
    icon: 'pill',
    rarity: 'rare',
    type: 'medicine',
    curesDizzy: true,
    healthRestored: 10,
  },
  {
    id: 'energybooster',
    name: 'Energy Booster',
    description: 'A shot of pure energy when you need it most.',
    price: 40,
    icon: 'battery-charging',
    rarity: 'rare',
    type: 'medicine',
    energyRestored: 40,
  },
  {
    id: 'superfood',
    name: 'Superfood',
    description: 'Advanced nutrition that helps all stats.',
    price: 60,
    icon: 'food-apple-outline',
    rarity: 'legendary',
    type: 'medicine',
    healthRestored: 20,
    hungerRestored: 20,
    energyRestored: 20,
    happinessBoost: 10,
  },
];

// Combine all shop items
const ALL_SHOP_ITEMS = [...FOOD_ITEMS, ...MEDICINE_ITEMS];

interface ItemDetailModalProps {
  visible: boolean;
  item: any;
  onClose: () => void;
  onPurchase: () => void;
  canAfford: boolean;
}

// Item detail modal component
const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  item,
  onClose,
  onPurchase,
  canAfford,
}) => {
  const { theme } = useTheme();
  
  if (!item) return null;
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return theme.colors.secondary;
      case 'uncommon': return theme.colors.primary;
      case 'rare': return '#9c27b0'; // Purple
      case 'legendary': return '#ffab00'; // Gold
      default: return theme.colors.secondary;
    }
  };
  
  const getDetailedIconContainerStyle = () => {
    let style = {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: 20,
      backgroundColor: 'rgba(0,0,0,0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    };
    
    // Add rarity-specific styles
    switch (item.rarity) {
      case 'uncommon':
        style = {
          ...style,
          borderWidth: 2,
          borderColor: getRarityColor(item.rarity),
        };
        break;
      case 'rare':
        style = {
          ...style,
          borderWidth: 3,
          borderColor: getRarityColor(item.rarity),
          backgroundColor: 'rgba(156, 39, 176, 0.1)', // Light purple background
        };
        break;
      case 'legendary':
        style = {
          ...style,
          borderWidth: 4,
          borderColor: getRarityColor(item.rarity),
          backgroundColor: 'rgba(255, 171, 0, 0.15)', // Light gold background
        };
        break;
      default:
        break;
    }
    
    return style;
  };
  
  const getDetailedIconStyle = () => {
    return {
      shadowColor: getRarityColor(item.rarity),
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: item.rarity === 'legendary' ? 0.8 : 
                    item.rarity === 'rare' ? 0.6 :
                    item.rarity === 'uncommon' ? 0.4 : 0.2,
      shadowRadius: item.rarity === 'legendary' ? 12 : 
                    item.rarity === 'rare' ? 8 :
                    item.rarity === 'uncommon' ? 5 : 3,
    };
  };
  
  const renderDetailDecorations = () => {
    if (item.rarity === 'rare' || item.rarity === 'legendary') {
      return (
        <View style={styles.decorations}>
          {item.rarity === 'legendary' && (
            <>
              <View style={[styles.star, { top: -5, left: -5, transform: [{ rotate: '0deg' }] }]}>
                <MaterialCommunityIcons name="star" size={12} color={getRarityColor(item.rarity)} />
              </View>
              <View style={[styles.star, { top: -10, right: 25, transform: [{ rotate: '15deg' }] }]}>
                <MaterialCommunityIcons name="star" size={16} color={getRarityColor(item.rarity)} />
              </View>
              <View style={[styles.star, { bottom: 10, right: -5, transform: [{ rotate: '30deg' }] }]}>
                <MaterialCommunityIcons name="star" size={14} color={getRarityColor(item.rarity)} />
              </View>
              <View style={[styles.star, { bottom: -5, left: 25, transform: [{ rotate: '45deg' }] }]}>
                <MaterialCommunityIcons name="star" size={10} color={getRarityColor(item.rarity)} />
              </View>
            </>
          )}
          
          {item.rarity === 'rare' && (
            <>
              <View style={[styles.starIcon, { top: 0, right: 10 }]}>
                <MaterialCommunityIcons name="star-four-points" size={14} color={getRarityColor(item.rarity)} />
              </View>
              <View style={[styles.starIcon, { bottom: 5, left: 5 }]}>
                <MaterialCommunityIcons name="star-four-points" size={12} color={getRarityColor(item.rarity)} />
              </View>
            </>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{item.name}</Text>
          
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
            <Text style={styles.rarityText}>
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </Text>
          </View>
          
          <View style={getDetailedIconContainerStyle()}>
            <MaterialCommunityIcons
              name={item.icon}
              size={50}
              color={getRarityColor(item.rarity)}
              style={getDetailedIconStyle()}
            />
            {renderDetailDecorations()}
          </View>
          
          <Text style={[styles.modalDescription, { color: theme.colors.text }]}>
            {item.description}
          </Text>
          
          <View style={styles.statsList}>
            {item.hungerRestored && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="food-apple" size={18} color={theme.colors.primary} />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  +{item.hungerRestored} Hunger
                </Text>
              </View>
            )}
            
            {item.healthBoost && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons 
                  name="heart-pulse" 
                  size={18} 
                  color={item.healthBoost > 0 ? '#00cc44' : '#ff0000'} 
                />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  {item.healthBoost > 0 ? '+' : ''}{item.healthBoost} Health
                </Text>
              </View>
            )}
            
            {item.healthRestored && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="heart-plus" size={18} color="#00cc44" />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  +{item.healthRestored} Health
                </Text>
              </View>
            )}
            
            {item.energyBoost && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="lightning-bolt" size={18} color={theme.colors.secondary} />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  +{item.energyBoost} Energy
                </Text>
              </View>
            )}
            
            {item.energyRestored && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="battery-charging" size={18} color={theme.colors.secondary} />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  +{item.energyRestored} Energy
                </Text>
              </View>
            )}
            
            {item.happinessBoost && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="emoticon-happy" size={18} color={theme.colors.tertiary} />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  +{item.happinessBoost} Happiness
                </Text>
              </View>
            )}
            
            {item.curesDizzy && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="head-remove" size={18} color="#9c27b0" />
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  Cures Dizzy Status
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.priceContainer}>
            <MaterialCommunityIcons name="cash" size={22} color={theme.colors.success} />
            <Text style={[styles.priceText, { color: theme.colors.text }]}>
              ${item.price}
            </Text>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose, { backgroundColor: theme.colors.error }]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.buttonBuy, 
                { 
                  backgroundColor: canAfford ? theme.colors.primary : theme.colors.disabled,
                  opacity: canAfford ? 1 : 0.6,
                }
              ]}
              onPress={onPurchase}
              disabled={!canAfford}
            >
              <Text style={styles.textStyle}>
                {canAfford ? 'Buy Now' : 'Not Enough Money'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ShopScreen = () => {
  const { stats, earnMoney } = useBrayden();
  const { theme } = useTheme();
  
  // State for filtering and modal
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Filtered items based on currentFilter
  const filteredItems = ALL_SHOP_ITEMS.filter(item => {
    if (currentFilter === 'all') return true;
    return item.type === currentFilter;
  });
  
  // Handle item selection
  const selectItem = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
    setPurchaseSuccess(false);
  };
  
  // Handle purchasing the item
  const handlePurchase = () => {
    if (!selectedItem) return;
    
    // Check if player can afford the item
    if (stats.money < selectedItem.price) {
      Alert.alert(
        "Not Enough Money",
        "You don't have enough money to purchase this item.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Apply item effects
    let newStats = { ...stats };
    
    // Subtract money for the purchase
    newStats.money -= selectedItem.price;
    
    // Apply item effects based on type
    if (selectedItem.type === 'food' || selectedItem.type === 'medicine') {
      if (selectedItem.hungerRestored) {
        newStats.hunger = Math.min(100, newStats.hunger + selectedItem.hungerRestored);
      }
      
      if (selectedItem.healthBoost) {
        newStats.health = Math.min(100, Math.max(0, newStats.health + selectedItem.healthBoost));
      }
      
      if (selectedItem.healthRestored) {
        newStats.health = Math.min(100, newStats.health + selectedItem.healthRestored);
      }
      
      if (selectedItem.energyBoost) {
        newStats.energy = Math.min(100, newStats.energy + selectedItem.energyBoost);
      }
      
      if (selectedItem.energyRestored) {
        newStats.energy = Math.min(100, newStats.energy + selectedItem.energyRestored);
      }
      
      if (selectedItem.happinessBoost) {
        newStats.happiness = Math.min(100, newStats.happiness + selectedItem.happinessBoost);
      }
      
      if (selectedItem.curesDizzy && newStats.isDizzy) {
        newStats.isDizzy = false;
      }
    }
    
    // Update player stats by manipulating money, which triggers the earnMoney function
    earnMoney(-selectedItem.price, 0, 0); // This will subtract money but not affect energy/happiness
    
    // Update other stats directly
    if (selectedItem.hungerRestored) {
      newStats.hunger = Math.min(100, stats.hunger + selectedItem.hungerRestored);
    }
    
    if (selectedItem.healthBoost || selectedItem.healthRestored) {
      const healthChange = (selectedItem.healthBoost || 0) + (selectedItem.healthRestored || 0);
      newStats.health = Math.min(100, Math.max(0, stats.health + healthChange));
    }
    
    if (selectedItem.energyBoost || selectedItem.energyRestored) {
      const energyChange = (selectedItem.energyBoost || 0) + (selectedItem.energyRestored || 0);
      newStats.energy = Math.min(100, stats.energy + energyChange);
    }
    
    if (selectedItem.happinessBoost) {
      newStats.happiness = Math.min(100, stats.happiness + selectedItem.happinessBoost);
    }
    
    if (selectedItem.curesDizzy && stats.isDizzy) {
      newStats.isDizzy = false;
    }
    
    // Show success message
    setPurchaseSuccess(true);
    Alert.alert(
      "Purchase Successful!",
      `You have purchased ${selectedItem.name}!`,
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
  };
  
  // Check if player can afford an item
  const canAffordItem = (price: number) => {
    return stats.money >= price;
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return theme.colors.secondary;
      case 'uncommon': return theme.colors.primary;
      case 'rare': return '#9c27b0'; // Purple
      case 'legendary': return '#ffab00'; // Gold
      default: return theme.colors.secondary;
    }
  };
  
  const renderShopItem = ({ item, index }: { item: any, index: number }) => {
    const canAfford = canAffordItem(item.price);
    
    const getCustomItemStyle = () => {
      let style = {
        ...styles.itemContainer,
        backgroundColor: theme.colors.surface,
        opacity: canAfford ? 1 : 0.6,
      };
      
      // Add rarity-specific styles
      switch (item.rarity) {
        case 'uncommon':
          style = {
            ...style,
            borderLeftWidth: 4,
            borderLeftColor: getRarityColor(item.rarity),
          };
          break;
        case 'rare':
          style = {
            ...style,
            borderLeftWidth: 6,
            borderLeftColor: getRarityColor(item.rarity),
            backgroundColor: 'rgba(156, 39, 176, 0.05)', // Light purple background
          };
          break;
        case 'legendary':
          style = {
            ...style,
            borderWidth: 2,
            borderColor: getRarityColor(item.rarity),
            backgroundColor: 'rgba(255, 171, 0, 0.1)', // Light gold background
          };
          break;
        default:
          break;
      }
      
      return style;
    };
    
    const getIconContainerStyle = () => {
      let style = {
        ...styles.iconContainer,
        backgroundColor: 'rgba(0,0,0,0.1)',
      };
      
      // Add rarity-specific styles
      switch (item.rarity) {
        case 'uncommon':
          style = {
            ...style,
            borderWidth: 2,
            borderColor: getRarityColor(item.rarity),
          };
          break;
        case 'rare':
          style = {
            ...style,
            borderWidth: 2,
            borderColor: getRarityColor(item.rarity),
            backgroundColor: 'rgba(156, 39, 176, 0.1)', // Light purple background
          };
          break;
        case 'legendary':
          style = {
            ...style,
            borderWidth: 3,
            borderColor: getRarityColor(item.rarity),
            backgroundColor: 'rgba(255, 171, 0, 0.1)', // Light gold background
          };
          break;
        default:
          break;
      }
      
      return style;
    };
    
    const getIconStyle = () => {
      return {
        shadowColor: getRarityColor(item.rarity),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: item.rarity === 'legendary' ? 0.8 : 
                      item.rarity === 'rare' ? 0.6 :
                      item.rarity === 'uncommon' ? 0.4 : 0.2,
        shadowRadius: item.rarity === 'legendary' ? 8 : 
                      item.rarity === 'rare' ? 6 :
                      item.rarity === 'uncommon' ? 4 : 2,
      };
    };
    
    const renderRarityDecorations = () => {
      if (item.rarity === 'rare' || item.rarity === 'legendary') {
        return (
          <View style={styles.decorations}>
            {item.rarity === 'legendary' && (
              <>
                <View style={[styles.star, { top: -2, left: -2, transform: [{ rotate: '0deg' }] }]}>
                  <MaterialCommunityIcons name="star" size={8} color={getRarityColor(item.rarity)} />
                </View>
                <View style={[styles.star, { top: -5, right: 15, transform: [{ rotate: '15deg' }] }]}>
                  <MaterialCommunityIcons name="star" size={10} color={getRarityColor(item.rarity)} />
                </View>
                <View style={[styles.star, { bottom: 5, right: -2, transform: [{ rotate: '30deg' }] }]}>
                  <MaterialCommunityIcons name="star" size={8} color={getRarityColor(item.rarity)} />
                </View>
              </>
            )}
            
            {item.rarity === 'rare' && (
              <>
                <View style={[styles.starIcon, { top: 0, right: 5 }]}>
                  <MaterialCommunityIcons name="star-four-points" size={8} color={getRarityColor(item.rarity)} />
                </View>
                <View style={[styles.starIcon, { bottom: 0, left: 5 }]}>
                  <MaterialCommunityIcons name="star-four-points" size={8} color={getRarityColor(item.rarity)} />
                </View>
              </>
            )}
          </View>
        );
      }
      return null;
    };

    return (
      <TouchableOpacity
        style={getCustomItemStyle()}
        onPress={() => selectItem(item)}
        disabled={!canAfford}
      >
        <View style={getIconContainerStyle()}>
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            color={getRarityColor(item.rarity)}
            style={getIconStyle()}
          />
          {renderRarityDecorations()}
        </View>
        
        <View style={styles.itemDetails}>
          <Text 
            style={[
              styles.itemName, 
              { 
                color: theme.colors.text,
                fontWeight: 
                  item.rarity === 'legendary' ? 'bold' : 
                  item.rarity === 'rare' ? '600' : 'normal'
              }
            ]}
          >
            {item.name}
          </Text>
          
          <Text 
            style={[
              styles.itemDescription, 
              { 
                color: theme.colors.textSecondary,
                fontSize: 12,
              }
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
        
        <View style={styles.priceTag}>
          <MaterialCommunityIcons name="cash" size={14} color={theme.colors.success} />
          <Text style={[styles.priceValue, { color: theme.colors.text }]}>
            ${item.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Shop
      </Text>
      
      <View style={styles.balance}>
        <MaterialCommunityIcons name="cash-multiple" size={24} color={theme.colors.success} />
        <Text style={[styles.balanceText, { color: theme.colors.text }]}>
          ${stats.money}
        </Text>
      </View>
      
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            currentFilter === 'all' ? { 
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.primary,
            } : { 
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: 'transparent',
            }
          ]}
          onPress={() => setCurrentFilter('all')}
        >
          <Text 
            style={[
              styles.filterText, 
              { 
                color: currentFilter === 'all' 
                  ? theme.colors.onPrimaryContainer 
                  : theme.colors.onSurfaceVariant 
              }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            currentFilter === 'food' ? { 
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.primary,
            } : { 
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: 'transparent',
            }
          ]}
          onPress={() => setCurrentFilter('food')}
        >
          <MaterialCommunityIcons 
            name="food-apple" 
            size={16} 
            color={currentFilter === 'food' 
              ? theme.colors.onPrimaryContainer 
              : theme.colors.onSurfaceVariant
            } 
          />
          <Text 
            style={[
              styles.filterText, 
              { 
                color: currentFilter === 'food' 
                  ? theme.colors.onPrimaryContainer 
                  : theme.colors.onSurfaceVariant 
              }
            ]}
          >
            Food
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            currentFilter === 'medicine' ? { 
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.primary,
            } : { 
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: 'transparent',
            }
          ]}
          onPress={() => setCurrentFilter('medicine')}
        >
          <MaterialCommunityIcons 
            name="medical-bag" 
            size={16}
            color={currentFilter === 'medicine' 
              ? theme.colors.onPrimaryContainer 
              : theme.colors.onSurfaceVariant
            } 
          />
          <Text 
            style={[
              styles.filterText, 
              { 
                color: currentFilter === 'medicine' 
                  ? theme.colors.onPrimaryContainer 
                  : theme.colors.onSurfaceVariant 
              }
            ]}
          >
            Medicine
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.subheader, { color: theme.colors.textSecondary }]}>
        Purchase items to help Brayden survive and thrive!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderShopItem}
        contentContainerStyle={styles.listContent}
      />
      
      {selectedItem && (
        <ItemDetailModal
          visible={modalVisible}
          item={selectedItem}
          onClose={() => setModalVisible(false)}
          onPurchase={handlePurchase}
          canAfford={canAffordItem(selectedItem.price)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 14,
    marginTop: 8,
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsList: {
    width: '100%',
    marginVertical: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    marginLeft: 8,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#FF6B6B',
  },
  buttonBuy: {
    backgroundColor: '#4CAF50',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  decorations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  star: {
    position: 'absolute',
  },
  starIcon: {
    position: 'absolute',
  },
  rarityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rarityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default ShopScreen; 