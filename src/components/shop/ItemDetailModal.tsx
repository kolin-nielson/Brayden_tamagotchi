import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ShopItem } from '../../types/shop.types';
import { useTheme } from '../../contexts/ThemeContext';

interface ItemDetailModalProps {
  visible: boolean;
  item: ShopItem;
  onClose: () => void;
  onPurchase: () => void;
  canAfford: boolean;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  item,
  onClose,
  onPurchase,
  canAfford
}) => {
  const { theme } = useTheme();
  
  if (!item) return null;
  
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
          borderColor: getRarityColor(),
        };
        break;
      case 'rare':
        style = {
          ...style,
          borderWidth: 3,
          borderColor: getRarityColor(),
          backgroundColor: 'rgba(156, 39, 176, 0.1)', // Light purple background
        };
        break;
      case 'legendary':
        style = {
          ...style,
          borderWidth: 4,
          borderColor: getRarityColor(),
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
      shadowColor: getRarityColor(),
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
                <MaterialCommunityIcons name="star" size={12} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { top: -10, right: 25, transform: [{ rotate: '15deg' }] }]}>
                <MaterialCommunityIcons name="star" size={16} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { bottom: 10, right: -5, transform: [{ rotate: '30deg' }] }]}>
                <MaterialCommunityIcons name="star" size={14} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { bottom: -5, left: 25, transform: [{ rotate: '45deg' }] }]}>
                <MaterialCommunityIcons name="star" size={10} color={getRarityColor()} />
              </View>
            </>
          )}
          
          {item.rarity === 'rare' && (
            <>
              <View style={[styles.star, { top: 0, right: 10 }]}>
                <MaterialCommunityIcons name="star-four-points" size={14} color={getRarityColor()} />
              </View>
              <View style={[styles.star, { bottom: 5, left: 5 }]}>
                <MaterialCommunityIcons name="star-four-points" size={12} color={getRarityColor()} />
              </View>
            </>
          )}
        </View>
      );
    }
    return null;
  };
  
  const renderStatsList = () => {
    const stats = [];
    
    if (item.hungerRestored) {
      stats.push(
        <View key="hunger" style={styles.statItem}>
          <MaterialCommunityIcons name="food-apple" size={18} color={theme.colors.primary} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            +{item.hungerRestored} Hunger
          </Text>
        </View>
      );
    }
    
    if (item.healthBoost) {
      stats.push(
        <View key="healthBoost" style={styles.statItem}>
          <MaterialCommunityIcons 
            name="heart-pulse" 
            size={18} 
            color={item.healthBoost > 0 ? '#00cc44' : '#ff0000'} 
          />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            {item.healthBoost > 0 ? '+' : ''}{item.healthBoost} Health
          </Text>
        </View>
      );
    }
    
    if (item.healthRestored) {
      stats.push(
        <View key="healthRestored" style={styles.statItem}>
          <MaterialCommunityIcons name="heart-plus" size={18} color="#00cc44" />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            +{item.healthRestored} Health
          </Text>
        </View>
      );
    }
    
    if (item.energyBoost) {
      stats.push(
        <View key="energyBoost" style={styles.statItem}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color={theme.colors.secondary} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            {item.energyBoost > 0 ? '+' : ''}{item.energyBoost} Energy
          </Text>
        </View>
      );
    }
    
    if (item.energyRestored) {
      stats.push(
        <View key="energyRestored" style={styles.statItem}>
          <MaterialCommunityIcons name="battery-charging" size={18} color={theme.colors.secondary} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            +{item.energyRestored} Energy
          </Text>
        </View>
      );
    }
    
    if (item.happinessBoost) {
      stats.push(
        <View key="happiness" style={styles.statItem}>
          <MaterialCommunityIcons name="emoticon-happy" size={18} color={theme.colors.tertiary} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            {item.happinessBoost > 0 ? '+' : ''}{item.happinessBoost} Happiness
          </Text>
        </View>
      );
    }
    
    if (item.curesDizzy) {
      stats.push(
        <View key="dizzy" style={styles.statItem}>
          <MaterialCommunityIcons name="head-remove" size={18} color="#9c27b0" />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            Cures Dizzy Status
          </Text>
        </View>
      );
    }
    
    if (item.isOneTimeUse) {
      stats.push(
        <View key="oneTimeUse" style={styles.statItem}>
          <MaterialCommunityIcons name="information" size={18} color={theme.colors.info} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            One-time use item
          </Text>
        </View>
      );
    }
    
    return stats.length > 0 ? (
      <View style={styles.statsList}>
        {stats}
      </View>
    ) : null;
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
          
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor() }]}>
            <Text style={styles.rarityText}>
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </Text>
          </View>
          
          <View style={getDetailedIconContainerStyle()}>
            <MaterialCommunityIcons
              name={item.icon}
              size={50}
              color={getRarityColor()}
              style={getDetailedIconStyle()}
            />
            {renderDetailDecorations()}
          </View>
          
          <Text style={[styles.modalDescription, { color: theme.colors.text }]}>
            {item.description}
          </Text>
          
          {renderStatsList()}
          
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

const styles = StyleSheet.create({
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

export default ItemDetailModal; 