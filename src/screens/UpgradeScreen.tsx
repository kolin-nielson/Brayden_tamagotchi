import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, Badge, ProgressBar } from 'react-native-paper';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';
import { Upgrade, getUpgradeNextLevelCost, UpgradeCategory } from '../data/upgrades';

const UpgradeScreen = () => {
  const { stats, upgrades, purchaseUpgrade } = useBrayden();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<UpgradeCategory>('productivity');
  
  // Filter upgrades by category and unlock status
  const getUpgradesByCategory = (category: UpgradeCategory) => {
    return upgrades.filter(item => 
      item.category === category && item.isUnlocked
    );
  };
  
  // Check if player can afford an upgrade
  const canAfford = (upgrade: Upgrade): boolean => {
    const cost = getUpgradeNextLevelCost(upgrade);
    return stats.money >= cost && upgrade.level < upgrade.maxLevel;
  };
  
  // Get price label for an upgrade
  const getPriceLabel = (upgrade: Upgrade): string => {
    if (upgrade.level >= upgrade.maxLevel) {
      return 'MAX LEVEL';
    }
    
    return `$${getUpgradeNextLevelCost(upgrade)}`;
  };
  
  // Render a single upgrade item
  const renderUpgradeItem = ({ item }: { item: Upgrade }) => {
    const isMaxLevel = item.level >= item.maxLevel;
    const isAffordable = canAfford(item);
    
    return (
      <Surface
        style={[
          styles.upgradeItem,
          { 
            backgroundColor: theme.colors.surface,
            opacity: isMaxLevel ? 0.7 : 1
          }
        ]}
      >
        <View style={styles.upgradeIconContainer}>
          <MaterialCommunityIcons
            name={item.icon as any}
            size={40}
            color={theme.colors.primary}
            style={styles.upgradeIcon}
          />
          {item.level > 0 && (
            <Badge
              style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}
              size={24}
            >
              {item.level}
            </Badge>
          )}
        </View>
        
        <View style={styles.upgradeInfo}>
          <Text style={[styles.upgradeName, { color: theme.colors.onSurface }]}>
            {item.name}
          </Text>
          <Text style={[styles.upgradeDescription, { color: theme.colors.onSurfaceVariant }]}>
            {item.description}
          </Text>
          
          {/* Level progress */}
          {!isMaxLevel && (
            <View style={styles.levelContainer}>
              <Text style={[styles.levelText, { color: theme.colors.onSurfaceVariant }]}>
                Level {item.level}/{item.maxLevel}
              </Text>
              <ProgressBar
                progress={item.level / item.maxLevel}
                color={theme.colors.primary}
                style={styles.levelProgress}
              />
            </View>
          )}
          
          {isMaxLevel && (
            <Text style={[styles.maxLevelText, { color: theme.colors.error }]}>
              Maximum Level Reached
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.buyButton,
            { 
              backgroundColor: isAffordable && !isMaxLevel 
                ? theme.colors.primary 
                : theme.colors.surfaceVariant
            }
          ]}
          onPress={() => {
            if (!isMaxLevel) {
              purchaseUpgrade(item.id);
            }
          }}
          disabled={!isAffordable || isMaxLevel}
        >
          <Text style={[
            styles.buyButtonText,
            { 
              color: isAffordable && !isMaxLevel 
                ? theme.colors.onPrimary 
                : theme.colors.onSurfaceVariant
            }
          ]}>
            {isMaxLevel ? 'MAX' : getPriceLabel(item)}
          </Text>
        </TouchableOpacity>
      </Surface>
    );
  };
  
  // Category buttons
  const categories: UpgradeCategory[] = ['productivity', 'health', 'learning', 'money'];
  
  const renderCategoryButton = (category: UpgradeCategory) => {
    const isSelected = category === selectedCategory;
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Get icon for each category
    const getCategoryIcon = (cat: UpgradeCategory): string => {
      switch (cat) {
        case 'productivity': return 'laptop';
        case 'health': return 'heart-pulse';
        case 'learning': return 'school';
        case 'money': return 'cash';
        default: return 'star';
      }
    };
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { 
            backgroundColor: isSelected 
              ? theme.colors.primaryContainer 
              : theme.colors.surfaceVariant
          }
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <MaterialCommunityIcons
          name={getCategoryIcon(category) as any}
          size={24}
          color={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
        <Text
          style={[
            styles.categoryText,
            { 
              color: isSelected 
                ? theme.colors.primary 
                : theme.colors.onSurfaceVariant
            }
          ]}
        >
          {categoryName}
        </Text>
      </TouchableOpacity>
    );
  };
  
  // Filter upgrades by selected category
  const filteredUpgrades = getUpgradesByCategory(selectedCategory);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name="arrow-up-bold-circle" 
          size={32} 
          color={theme.colors.primary} 
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          Upgrades
        </Text>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons 
            name="cash" 
            size={24} 
            color={theme.colors.primary}
          />
          <Text style={[styles.moneyText, { color: theme.colors.onBackground }]}>
            ${stats.money}
          </Text>
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <View key={category} style={styles.categoryWrapper}>
            {renderCategoryButton(category)}
          </View>
        ))}
      </View>
      
      <FlatList
        data={filteredUpgrades}
        renderItem={renderUpgradeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.upgradesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Surface style={[styles.emptyContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialCommunityIcons 
              name="lock" 
              size={48} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No upgrades available in this category.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
              Level up to unlock more upgrades!
            </Text>
          </Surface>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  moneyText: {
    fontWeight: 'bold',
    marginLeft: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryWrapper: {
    flex: 1,
    paddingHorizontal: 4,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  upgradesList: {
    paddingBottom: 20,
  },
  upgradeItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  upgradeIconContainer: {
    marginRight: 12,
    position: 'relative',
  },
  upgradeIcon: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 12,
  },
  levelBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 6,
  },
  levelContainer: {
    marginTop: 4,
  },
  levelText: {
    fontSize: 12,
    marginBottom: 4,
  },
  levelProgress: {
    height: 4,
    borderRadius: 2,
  },
  maxLevelText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  buyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  buyButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default UpgradeScreen; 