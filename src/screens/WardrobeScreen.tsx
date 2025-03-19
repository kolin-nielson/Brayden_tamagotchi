import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';
import BraydenAvatar3D from '../components/BraydenAvatar3D';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type CosmeticCategory = 'hat' | 'glasses' | 'shirt' | 'accessory' | 'background';

const WardrobeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { collectibles, equippedCosmetics, equipCosmetic, unequipCosmetic } = useBrayden();
  const [selectedCategory, setSelectedCategory] = useState<CosmeticCategory>('hat');

  // Filter collectibles by category and ownership
  const getOwnedCosmeticsByCategory = (category: CosmeticCategory) => {
    return collectibles.filter((item) => 
      item.type === 'cosmetic' && 
      item.slot === category && 
      item.isOwned
    );
  };

  // Check if an item is equipped
  const isItemEquipped = (itemId: string) => {
    const slot = collectibles.find(item => item.id === itemId)?.slot as CosmeticCategory;
    return equippedCosmetics[slot]?.id === itemId;
  };

  // Handle item selection
  const handleItemPress = (itemId: string) => {
    if (isItemEquipped(itemId)) {
      unequipCosmetic(itemId);
    } else {
      equipCosmetic(itemId);
    }
  };

  // Render category tabs
  const renderCategoryTabs = () => {
    const categories: CosmeticCategory[] = ['hat', 'glasses', 'shirt', 'accessory', 'background'];
    
    return (
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && { 
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.colors.onBackground },
                selectedCategory === category && { color: 'white' }
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render a cosmetic item
  const renderCosmeticItem = ({ item }: { item: any }) => {
    const isEquipped = isItemEquipped(item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.cosmeticItem, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border 
          },
          isEquipped && { 
            borderColor: theme.colors.primary,
            backgroundColor: `${theme.colors.primary}20`,
          }
        ]}
        onPress={() => handleItemPress(item.id)}
      >
        <View style={styles.itemIconContainer}>
          <LinearGradient
            colors={isEquipped ? 
              ['#6A90E0', '#4B7BF5', '#3D62C1'] : 
              ['#E0E0E0', '#D0D0D0', '#C0C0C0']}
            style={styles.itemIconBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={32}
              color={isEquipped ? 'white' : '#555'}
            />
          </LinearGradient>
          {isEquipped && (
            <View style={styles.equippedBadge}>
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={theme.colors.primary}
              />
            </View>
          )}
        </View>
        <Text style={[styles.itemName, { color: theme.colors.onSurface }]} numberOfLines={1}>{item.name}</Text>
        
        <View style={[styles.rarityBadge, getRarityStyle(item.rarity)]}>
          <Text style={styles.rarityText}>{item.rarity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Get style based on item rarity
  const getRarityStyle = (rarity: string) => {
    switch(rarity) {
      case 'common':
        return { backgroundColor: '#AAAAAA' };
      case 'uncommon':
        return { backgroundColor: '#55AA55' };
      case 'rare':
        return { backgroundColor: '#5555FF' };
      case 'legendary':
        return { backgroundColor: '#AA55AA' };
      default:
        return { backgroundColor: '#AAAAAA' };
    }
  };

  // Get items for the selected category
  const cosmeticItems = getOwnedCosmeticsByCategory(selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.avatarContainer}>
        <BraydenAvatar3D size={200} />
      </View>
      
      {renderCategoryTabs()}
      
      <View style={styles.itemsContainer}>
        <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}s
        </Text>
        
        {cosmeticItems.length > 0 ? (
          <FlatList
            data={cosmeticItems}
            renderItem={renderCosmeticItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.itemsGrid}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={48}
              color={theme.colors.text + '80'}
            />
            <Text style={[styles.emptyStateText, { color: theme.colors.text + '80' }]}>
              No {selectedCategory}s owned yet.
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.text + '60' }]}>
              Visit the shop to buy more items!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  categoriesContainer: {
    marginVertical: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemsContainer: {
    flex: 1,
  },
  itemsGrid: {
    paddingBottom: 16,
  },
  cosmeticItem: {
    flex: 1,
    margin: 6,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  itemIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equippedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default WardrobeScreen; 