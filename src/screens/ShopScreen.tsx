import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';
import { Surface } from 'react-native-paper';
import ScreenLayout from '../components/common/ScreenLayout';
import ShopItemCard from '../components/shop/ShopItemCard';
import InventoryItemCard from '../components/shop/InventoryItemCard';
import ShopCategorySelector from '../components/shop/ShopCategorySelector';
import ItemDetailModal from '../components/shop/ItemDetailModal';
import EmptyInventory from '../components/shop/EmptyInventory';
import { useShopContext } from '../contexts/ShopContext';
import { ShopItem, ShopContextType } from '../types/shop.types';

// Shop categories
const CATEGORIES = [
  { id: 'food', label: 'Food', icon: 'food-apple' },
  { id: 'medicine', label: 'Medicine', icon: 'medical-bag' },
  { id: 'toy', label: 'Toys', icon: 'gamepad-variant' },
  { id: 'decoration', label: 'Decor', icon: 'lamp' },
];

const ShopScreen: React.FC = () => {
  const { theme } = useTheme();
  const { stats } = useBrayden();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default state values in case context isn't ready
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Safely access shop context
  let shopContext: ShopContextType | undefined;
  try {
    shopContext = useShopContext();
  } catch (e) {
    if (!error) {
      setError("Shop is currently unavailable");
      console.error("ShopContext error:", e);
    }
  }
  
  const { 
    items = [], 
    inventory = {}, 
    selectedCategory = null,
    buyItem = () => Alert.alert("Shop unavailable", "Please try again later"),
    useItem = () => Alert.alert("Shop unavailable", "Please try again later"),
    getItemQuantity = () => 0,
    setSelectedCategory = () => {}
  } = shopContext || {};

  useEffect(() => {
    // Check if context loaded properly
    if (shopContext) {
      setIsLoading(false);
      setError(null);
    } else {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [shopContext]);
  
  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading shop...</Text>
        </View>
      </ScreenLayout>
    );
  }
  
  if (error) {
    return (
      <ScreenLayout>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="store-off" size={64} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <Text style={[styles.errorSubtext, { color: theme.colors.textSecondary }]}>
            Please restart the app to try again
          </Text>
        </View>
      </ScreenLayout>
    );
  }
  
  // Filter items based on selected category
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory) 
    : items;
  
  // Get inventory items with quantities
  const inventoryItems = items.filter(item => 
    inventory[item.id] && inventory[item.id] > 0
  );
  
  const handleBuyItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    if (stats.money < item.price) {
      Alert.alert('Not enough money', 'You need more money to buy this item.');
      return;
    }
    
    buyItem(itemId);
  };
  
  const handleUseItem = (itemId: string) => {
    useItem({ itemId });
  };
  
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  const handleOpenItemDetail = (item: ShopItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  const handleCloseItemDetail = () => {
    setModalVisible(false);
  };
  
  const handlePurchaseFromModal = () => {
    if (selectedItem) {
      handleBuyItem(selectedItem.id);
      setModalVisible(false);
    }
  };
  
  const renderShopItem = ({ item }: { item: ShopItem }) => (
    <ShopItemCard
      item={item}
      canAfford={stats.money >= item.price}
      onPress={() => handleOpenItemDetail(item)}
    />
  );
  
  const renderInventoryItem = ({ item }: { item: ShopItem }) => (
    <InventoryItemCard
      item={item}
      quantity={getItemQuantity(item.id)}
      onUse={() => handleUseItem(item.id)}
      onSelect={() => handleOpenItemDetail(item)}
    />
  );
  
  const renderTabContent = () => {
    if (activeTab === 'shop') {
      return (
        <View style={styles.tabContent}>
          <ShopCategorySelector
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          
          <FlatList
            data={filteredItems}
            renderItem={renderShopItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.tabContent}>
          {inventoryItems.length > 0 ? (
            <FlatList
              data={inventoryItems}
              renderItem={renderInventoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <EmptyInventory />
          )}
        </View>
      );
    }
  };
  
  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.moneyContainer}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color={theme.colors.success} />
            <Text style={[styles.moneyText, { color: theme.colors.text }]}>
              ${stats.money}
            </Text>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'shop' && [styles.activeTab, { borderColor: theme.colors.primary }],
              { backgroundColor: theme.colors.surface }
            ]}
            onPress={() => setActiveTab('shop')}
          >
            <MaterialCommunityIcons
              name="shopping"
              size={22}
              color={activeTab === 'shop' ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'shop' ? theme.colors.primary : theme.colors.textSecondary,
                },
              ]}
            >
              Shop
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'inventory' && [styles.activeTab, { borderColor: theme.colors.primary }],
              { backgroundColor: theme.colors.surface }
            ]}
            onPress={() => setActiveTab('inventory')}
          >
            <MaterialCommunityIcons
              name="bag-personal"
              size={22}
              color={activeTab === 'inventory' ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'inventory' ? theme.colors.primary : theme.colors.textSecondary,
                },
              ]}
            >
              Inventory
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderTabContent()}
      </View>
      
      {selectedItem && (
        <ItemDetailModal
          visible={modalVisible}
          item={selectedItem}
          onClose={handleCloseItemDetail}
          onPurchase={handlePurchaseFromModal}
          canAfford={stats.money >= selectedItem.price}
        />
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  moneyText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderWidth: 2,
  },
  tabText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default ShopScreen; 