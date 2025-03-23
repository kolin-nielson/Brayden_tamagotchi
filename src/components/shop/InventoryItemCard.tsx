import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ShopItem } from '../../types/shop.types';
import { useTheme } from '../../contexts/ThemeContext';

interface InventoryItemCardProps {
  item: ShopItem;
  quantity: number;
  onUse: () => void;
  onSelect: () => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ 
  item, 
  quantity, 
  onUse, 
  onSelect 
}) => {
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
  
  const renderQuantityBadge = () => {
    return (
      <View 
        style={[
          styles.quantityBadge, 
          { 
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.surface
          }
        ]}
      >
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>
    );
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow
        }
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.itemIconContainer, 
          { borderColor: getRarityColor() }
        ]}
      >
        <MaterialCommunityIcons 
          name={item.icon} 
          size={28} 
          color={getRarityColor()} 
        />
        {renderQuantityBadge()}
      </View>
      
      <View style={styles.itemContent}>
        <Text 
          style={[
            styles.itemName, 
            { color: theme.colors.text }
          ]} 
          numberOfLines={1}
        >
          {item.name}
        </Text>
        
        <Text 
          style={[
            styles.itemDescription, 
            { color: theme.colors.textSecondary }
          ]} 
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.useButton,
          { backgroundColor: theme.colors.success }
        ]}
        onPress={onUse}
      >
        <Text style={styles.useButtonText}>Use</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
  },
  useButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginLeft: 8,
  },
  useButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quantityBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  quantityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default InventoryItemCard; 