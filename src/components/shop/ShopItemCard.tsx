import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ShopItem } from '../../types/shop.types';
import { useTheme } from '../../contexts/ThemeContext';

export interface ShopItemCardProps {
  item: ShopItem;
  canAfford: boolean;
  onPress: () => void;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, canAfford, onPress }) => {
  const { theme } = useTheme();
  
  const getRarityColor = () => {
    switch (item.rarity) {
      case 'legendary':
        return '#ffab00';
      case 'rare':
        return '#9c27b0';
      case 'uncommon':
        return theme.colors.primary;
      default:
        return theme.colors.secondary;
    }
  };
  
  const getBorderStyle = () => {
    let style: any = {};
    
    switch (item.rarity) {
      case 'uncommon':
        style = {
          borderLeftWidth: 4,
          borderLeftColor: getRarityColor(),
        };
        break;
      case 'rare':
        style = {
          borderLeftWidth: 6,
          borderLeftColor: getRarityColor(),
          backgroundColor: 'rgba(156, 39, 176, 0.05)', // Light purple background
        };
        break;
      case 'legendary':
        style = {
          borderWidth: 2,
          borderColor: getRarityColor(),
          backgroundColor: 'rgba(255, 171, 0, 0.1)', // Light gold background
        };
        break;
      default:
        break;
    }
    
    return style;
  };
  
  const getIconContainerStyle = () => {
    let style: any = {};
    
    switch (item.rarity) {
      case 'uncommon':
        style = {
          borderWidth: 2,
          borderColor: getRarityColor(),
        };
        break;
      case 'rare':
        style = {
          borderWidth: 2,
          borderColor: getRarityColor(),
          backgroundColor: 'rgba(156, 39, 176, 0.1)', // Light purple background
        };
        break;
      case 'legendary':
        style = {
          borderWidth: 3,
          borderColor: getRarityColor(),
          backgroundColor: 'rgba(255, 171, 0, 0.1)', // Light gold background
        };
        break;
      default:
        break;
    }
    
    return style;
  };
  
  const renderRarityDecorations = () => {
    if (item.rarity === 'rare' || item.rarity === 'legendary') {
      return (
        <View style={styles.decorations}>
          {item.rarity === 'legendary' && (
            <>
              <View style={[styles.star, { top: -2, left: -2, transform: [{ rotate: '0deg' }] }]}>
                <MaterialCommunityIcons name="star" size={8} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { top: -5, right: 15, transform: [{ rotate: '15deg' }] }]}>
                <MaterialCommunityIcons name="star" size={10} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { bottom: 5, right: -2, transform: [{ rotate: '30deg' }] }]}>
                <MaterialCommunityIcons name="star" size={8} color={getRarityColor()} />
              </View>
            </>
          )}
          
          {item.rarity === 'rare' && (
            <>
              <View style={[styles.star, { top: 0, right: 5 }]}>
                <MaterialCommunityIcons name="star-four-points" size={8} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { bottom: 0, left: 5 }]}>
                <MaterialCommunityIcons name="star-four-points" size={8} color={getRarityColor()} />
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
      style={[
        styles.container,
        getBorderStyle(),
        { 
          backgroundColor: theme.colors.surface,
          opacity: canAfford ? 1 : 0.6,
          shadowColor: theme.colors.shadow
        }
      ]}
      onPress={onPress}
      disabled={!canAfford}
    >
      <View 
        style={[
          styles.iconContainer, 
          getIconContainerStyle(),
          { backgroundColor: 'rgba(0,0,0,0.1)' }
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={getRarityColor()}
          style={{
            shadowColor: getRarityColor(),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: item.rarity === 'legendary' ? 0.8 : 
                          item.rarity === 'rare' ? 0.6 :
                          item.rarity === 'uncommon' ? 0.4 : 0.2,
            shadowRadius: item.rarity === 'legendary' ? 8 : 
                          item.rarity === 'rare' ? 6 :
                          item.rarity === 'uncommon' ? 4 : 2,
          }}
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
      
      <View style={[styles.priceTag, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
        <MaterialCommunityIcons name="cash" size={14} color={theme.colors.success} />
        <Text style={[styles.priceValue, { color: theme.colors.text }]}>
          ${item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
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
    position: 'relative',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
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
});

export default ShopItemCard; 