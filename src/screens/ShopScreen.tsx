import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';

// Define shop items with their costs - only cosmetics now
const SHOP_ITEMS = [
  // Glasses
  {
    id: 'glasses_nerd',
    name: 'Programmer Glasses',
    description: 'Stylish glasses for the coding genius. +15% coding efficiency.',
    price: 120,
    icon: 'glasses',
    rarity: 'uncommon',
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
    price: 250,
    icon: 'virtual-reality',
    rarity: 'rare',
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
    price: 150,
    icon: 'sunglasses',
    rarity: 'uncommon',
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
    price: 140,
    icon: 'hanger',
    rarity: 'uncommon',
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
    price: 200,
    icon: 'school',
    rarity: 'rare',
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
    price: 400,
    icon: 'crown',
    rarity: 'legendary',
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
    price: 150,
    icon: 'tshirt-crew',
    rarity: 'uncommon',
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
    price: 200,
    icon: 'hanger',
    rarity: 'uncommon',
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
    price: 300,
    icon: 'tie',
    rarity: 'rare',
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
    price: 250,
    icon: 'headphones',
    rarity: 'rare',
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
    price: 300,
    icon: 'watch',
    rarity: 'rare',
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
    price: 100,
    icon: 'coffee',
    rarity: 'common',
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
    price: 350,
    icon: 'desktop-tower-monitor',
    rarity: 'rare',
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
    price: 280,
    icon: 'tree',
    rarity: 'uncommon',
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
    price: 500,
    icon: 'space-station',
    rarity: 'legendary',
    type: 'cosmetic',
    slot: 'background',
    statBonus: {
      type: 'all_stats',
      value: 15
    }
  },
];

interface ItemDetailModalProps {
  visible: boolean;
  item: any;
  onClose: () => void;
  onPurchase: () => void;
  canAfford: boolean;
  alreadyOwned: boolean;
}

// Item detail modal component
const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  item,
  onClose,
  onPurchase,
  canAfford,
  alreadyOwned,
}) => {
  const { theme } = useTheme();
  
  if (!item) return null;
  
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#AAAAAA';
      case 'uncommon': return '#55AA55';
      case 'rare': return '#5555FF';
      case 'legendary': return '#AA55AA';
      default: return '#AAAAAA';
    }
  };
  
  const rarityColor = getRarityColor(item.rarity);
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.elevation.level3 }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text, fontWeight: 'bold' }]}>
              {item.name}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.itemIconContainer, { backgroundColor: `${rarityColor}30` }]}>
            <MaterialCommunityIcons name={item.icon} size={64} color={rarityColor} />
          </View>
          
          <Text style={[styles.rarityText, { color: rarityColor, fontWeight: 'bold' }]}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </Text>
          
          <Text style={[styles.itemSlotText, { color: theme.colors.text, opacity: 0.8 }]}>
            Slot: {item.slot.charAt(0).toUpperCase() + item.slot.slice(1)}
          </Text>
          
          <Text style={[styles.itemDescription, { color: theme.colors.text }]}>
            {item.description}
          </Text>
          
          {/* Display stat bonuses if available */}
          {item.statBonus && (
            <View style={styles.statBonusContainer}>
              <Text style={[styles.statBonusTitle, { color: theme.colors.primary }]}>
                Stat Bonus:
              </Text>
              <View style={styles.statBonusContent}>
                <MaterialCommunityIcons 
                  name={
                    item.statBonus.type === 'work_efficiency' ? 'briefcase' :
                    item.statBonus.type === 'play_boost' ? 'gamepad-variant' :
                    item.statBonus.type === 'all_stats' ? 'star' :
                    item.statBonus.type === 'energy_regen' ? 'lightning-bolt' :
                    item.statBonus.type === 'xp_gain' ? 'chart-line' :
                    item.statBonus.type === 'money_boost' ? 'cash-multiple' :
                    item.statBonus.type === 'happiness_boost' ? 'emoticon-happy' :
                    item.statBonus.type === 'energy_efficiency' ? 'battery-charging' :
                    'information'
                  } 
                  size={18} 
                  color={rarityColor} 
                />
                <Text style={[styles.statBonusText, { color: theme.colors.text }]}>
                  +{item.statBonus.value}% {' '}
                  {item.statBonus.type === 'work_efficiency' ? 'Work Efficiency' :
                   item.statBonus.type === 'play_boost' ? 'Play Happiness' :
                   item.statBonus.type === 'all_stats' ? 'All Stats' :
                   item.statBonus.type === 'energy_regen' ? 'Energy Recovery' :
                   item.statBonus.type === 'xp_gain' ? 'XP Gain' :
                   item.statBonus.type === 'money_boost' ? 'Money Gain' :
                   item.statBonus.type === 'happiness_boost' ? 'Happiness' :
                   item.statBonus.type === 'energy_efficiency' ? 'Energy Efficiency' :
                   'Bonus'}
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.priceContainer}>
            <MaterialCommunityIcons name="cash" size={24} color={theme.colors.success} />
            <Text style={[styles.priceText, { color: theme.colors.text, fontWeight: 'bold' }]}>
              {item.price}
            </Text>
          </View>
          
          {alreadyOwned ? (
            <View style={[styles.purchaseButton, { backgroundColor: theme.colors.success }]}>
              <Text style={[styles.purchaseButtonText, { fontWeight: 'bold' }]}>Already Owned</Text>
              <MaterialCommunityIcons name="check" size={20} color="white" />
            </View>
          ) : (
            <TouchableOpacity 
              style={[
                styles.purchaseButton, 
                { 
                  backgroundColor: canAfford 
                    ? theme.colors.primary
                    : theme.colors.disabled
                }
              ]}
              onPress={onPurchase}
              disabled={!canAfford || alreadyOwned}
            >
              <Text style={[styles.purchaseButtonText, { fontWeight: 'bold' }]}>
                {canAfford ? 'Purchase' : 'Not Enough Money'}
              </Text>
              <MaterialCommunityIcons 
                name={canAfford ? 'cart' : 'cash-remove'} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const ShopScreen = () => {
  const { theme } = useTheme();
  const { stats, collectibles, purchaseCollectible, equipCosmetic } = useBrayden();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'hat' | 'glasses' | 'shirt' | 'accessory' | 'background'>('all');
  
  // Filter items based on slot type
  const filteredItems = filter === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.slot === filter);
  
  // Function to handle purchase
  const handlePurchase = () => {
    if (!selectedItem) return;
    
    const canAfford = stats.money >= selectedItem.price;
    const alreadyOwned = collectibles.some(item => item.id === selectedItem.id && item.isOwned);
    
    if (canAfford && !alreadyOwned) {
      // Confirm purchase
      Alert.alert(
        'Confirm Purchase',
        `Are you sure you want to buy ${selectedItem.name} for $${selectedItem.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Buy', 
            onPress: () => {
              console.log(`Attempting to purchase item: ${selectedItem.id}`);
              const success = purchaseCollectible(selectedItem.id, false);
              
              console.log(`Purchase result: ${success ? 'success' : 'failed'}`);
              
              if (success) {
                Alert.alert(
                  'Purchase Successful!',
                  `You've purchased ${selectedItem.name}. Would you like to equip it now?`,
                  [
                    { text: 'No', style: 'cancel' },
                    { 
                      text: 'Equip', 
                      onPress: () => {
                        console.log(`Attempting to equip item after purchase: ${selectedItem.id}`);
                        const equipResult = purchaseCollectible(selectedItem.id, true);
                        console.log(`Equip result: ${equipResult ? 'success' : 'failed'}`);
                      }
                    }
                  ]
                );
              } else {
                Alert.alert(
                  'Purchase Failed',
                  'Something went wrong with your purchase.',
                  [{ text: 'OK' }]
                );
              }
              setSelectedItem(null);
            }
          }
        ]
      );
    } else if (alreadyOwned) {
      Alert.alert(
        'Already Owned',
        `You already own ${selectedItem.name}. Would you like to equip it?`,
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Equip', 
            onPress: () => {
              equipCosmetic(selectedItem.id);
              setSelectedItem(null);
            } 
          }
        ]
      );
    } else {
      Alert.alert(
        'Not Enough Money',
        `You need $${selectedItem.price} to buy this item, but you only have $${stats.money}.`,
        [{ text: 'OK' }]
      );
    }
  };
  
  // Check if item is already owned
  const isItemOwned = (id: string) => {
    return collectibles.some(item => item.id === id && item.isOwned);
  };
  
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#AAAAAA';
      case 'uncommon': return '#55AA55';
      case 'rare': return '#5555FF';
      case 'legendary': return '#AA55AA';
      default: return '#AAAAAA';
    }
  };
  
  // Render shop item
  const renderShopItem = ({ item, index }: { item: any, index: number }) => {
    const owned = isItemOwned(item.id);
    const canAfford = stats.money >= item.price;
    const rarityColor = getRarityColor(item.rarity);
    
    return (
      <TouchableOpacity
        style={[
          styles.shopItem,
          { 
            backgroundColor: theme.colors.cardBackground,
            borderColor: owned ? theme.colors.success : rarityColor,
          }
        ]}
        onPress={() => setSelectedItem(item)}
      >
        <View style={[styles.shopItemIcon, { backgroundColor: `${rarityColor}20` }]}>
          <MaterialCommunityIcons name={item.icon} size={32} color={rarityColor} />
          {owned && (
            <View style={styles.ownedBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.success} />
            </View>
          )}
        </View>
        
        <View style={styles.shopItemInfo}>
          <Text style={[styles.shopItemName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text 
            style={[styles.shopItemDescription, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View style={styles.shopItemBottom}>
            <View style={styles.priceTag}>
              <MaterialCommunityIcons 
                name="cash" 
                size={16} 
                color={canAfford ? theme.colors.success : theme.colors.error} 
              />
              <Text 
                style={[
                  styles.priceTagText, 
                  { color: canAfford ? theme.colors.success : theme.colors.error }
                ]}
              >
                {item.price}
              </Text>
            </View>
            
            <Text style={[styles.slotTag, { color: theme.colors.textSecondary }]}>
              {item.slot}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Add filter buttons to the UI
  const renderHeader = () => (
    <View style={styles.filterContainer}>
      {[
        { key: 'all', label: 'All' },
        { key: 'hat', label: 'Hats' },
        { key: 'glasses', label: 'Glasses' },
        { key: 'shirt', label: 'Shirts' },
        { key: 'accessory', label: 'Accessories' },
        { key: 'background', label: 'Backgrounds' }
      ].map((item) => (
        <View key={`filter-${item.key}`}>
          <TouchableOpacity
            style={[
              styles.filterButton, 
              { 
                backgroundColor: filter === item.key 
                  ? theme.colors.primary 
                  : theme.colors.cardBackground
              }
            ]}
            onPress={() => setFilter(item.key as any)}
          >
            <Text style={{ 
              color: filter === item.key ? 'white' : theme.colors.text 
            }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.balanceContainer}>
        <MaterialCommunityIcons name="cash-multiple" size={24} color={theme.colors.success} />
        <Text style={[styles.balanceText, { color: theme.colors.text }]}>
          Balance: ${stats.money}
        </Text>
      </View>
      
      {renderHeader()}
      
      <FlatList
        data={filteredItems}
        renderItem={renderShopItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.shopList}
      />
      
      {selectedItem && (
        <ItemDetailModal
          visible={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPurchase={handlePurchase}
          canAfford={stats.money >= selectedItem.price}
          alreadyOwned={isItemOwned(selectedItem.id)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  shopList: {
    paddingBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 2,
  },
  shopItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  ownedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  shopItemInfo: {
    flex: 1,
  },
  shopItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shopItemDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  shopItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTagText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  rarityTag: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  slotTag: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemSlotText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  itemDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 30,
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  statBonusContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 12,
  },
  statBonusTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  statBonusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBonusText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ShopScreen; 