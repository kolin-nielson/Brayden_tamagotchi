import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BraydenStats } from '../../types/BraydenTypes';
import { Collectible } from '../../data/collectibles';
import { getCosmeticPosition, getCosmeticSize, getCosmeticColor } from '../../utils/avatarUtils';

interface AvatarAccessoriesProps {
  size: number;
  stats: BraydenStats;
  theme: any;
  equippedCosmetics: { [key: string]: Collectible | null };
}

export const AvatarAccessories: React.FC<AvatarAccessoriesProps> = ({ 
  size, 
  stats, 
  theme,
  equippedCosmetics 
}) => {
  // Helper function to render a cosmetic if it exists
  const renderCosmetic = (slot: string) => {
    const cosmetic = equippedCosmetics[slot];
    if (!cosmetic) return null;
    
    // Get positioning and size based on the slot
    const position = getCosmeticPosition(slot, size);
    const iconColor = getCosmeticColor(cosmetic, theme);
    
    // Function to get custom item rendering based on item id
    const renderCustomItem = (itemId: string, iconSize: number, enhancedColor: string) => {
      switch(itemId) {
        // HAT ITEMS
        case 'hat_beanie':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.beanieBase, { 
                backgroundColor: enhancedColor,
                width: '75%',
                height: '50%',
                top: '35%',
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }]} />
              <View style={[styles.beanieFold, { 
                backgroundColor: `${enhancedColor}D0`,
                width: '75%',
                height: '18%',
                bottom: '18%',
                borderRadius: 15,
              }]} />
              <View style={[styles.beaniePom, { 
                backgroundColor: 'white',
                width: 15,
                height: 15,
                top: '20%',
                borderRadius: 7.5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
              }]} />
              <View style={[styles.beanieRibbing1, { 
                backgroundColor: `${enhancedColor}80`,
                width: '70%',
                height: 3,
                bottom: '28%',
              }]} />
              <View style={[styles.beanieRibbing2, { 
                backgroundColor: `${enhancedColor}80`,
                width: '70%',
                height: 3,
                bottom: '23%',
              }]} />
            </View>
          );
        case 'hat_graduation':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.graduationCapBase, { 
                backgroundColor: '#222',
                width: '68%',
                height: '22%',
                bottom: '25%',
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 3,
              }]} />
              <View style={[styles.graduationCapTop, { 
                backgroundColor: '#222',
                width: '78%',
                height: '6%',
                bottom: '47%',
                borderRadius: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
              }]} />
              <View style={[styles.graduationTassel, { 
                backgroundColor: enhancedColor,
                width: 5,
                height: '42%',
                top: '18%',
                right: '30%',
                borderRadius: 2.5,
                shadowColor: enhancedColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
              }]} />
              <View style={[styles.graduationButton, { 
                backgroundColor: enhancedColor,
                width: 10,
                height: 10,
                top: '18%',
                alignSelf: 'center',
                borderRadius: 5,
                shadowColor: enhancedColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
              }]} />
            </View>
          );
        case 'hat_crown':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.crownBase, { 
                backgroundColor: '#FFDF00',
                width: '80%',
                height: '35%',
                bottom: '15%',
                borderRadius: 10,
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 5,
              }]} />
              <View style={[styles.crownPoint, { 
                backgroundColor: '#FFDF00',
                width: 10,
                height: 16,
                left: '25%',
                top: '20%',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }]} />
              <View style={[styles.crownPoint, { 
                backgroundColor: '#FFDF00',
                width: 10,
                height: 16,
                left: '38%',
                top: '20%',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }]} />
              <View style={[styles.crownPoint, { 
                backgroundColor: '#FFDF00',
                width: 10,
                height: 16,
                left: '50%',
                top: '20%',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }]} />
              <View style={[styles.crownPoint, { 
                backgroundColor: '#FFDF00',
                width: 10,
                height: 16,
                left: '62%',
                top: '20%',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }]} />
              <View style={[styles.crownGem, { 
                backgroundColor: '#FF2D55',
                width: 10,
                height: 10,
                left: '30%',
                top: '35%',
                borderRadius: 5,
                shadowColor: '#FF2D55',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 3,
              }]} />
              <View style={[styles.crownGem, { 
                backgroundColor: '#1E88E5',
                width: 10, 
                height: 10,
                left: '50%',
                top: '35%',
                borderRadius: 5,
                shadowColor: '#1E88E5',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 3,
              }]} />
              <View style={[styles.crownGem, { 
                backgroundColor: '#43A047',
                width: 10,
                height: 10,
                left: '70%',
                top: '35%',
                borderRadius: 5,
                shadowColor: '#43A047',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 3,
              }]} />
            </View>
          );
        
        // GLASSES ITEMS
        case 'glasses_nerd':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.glassesFrame, { 
                borderColor: enhancedColor,
                borderWidth: 2.5,
                width: '90%',
                height: '25%',
                top: '40%',
                borderRadius: 3,
              }]} />
              <View style={[styles.glassesLens, { 
                backgroundColor: `${enhancedColor}15`,
                borderWidth: 1.5,
                borderColor: enhancedColor,
                width: '36%',
                height: '46%',
                top: '30%',
                left: '12%',
                borderRadius: 22,
              }]} />
              <View style={[styles.glassesLens, { 
                backgroundColor: `${enhancedColor}15`,
                borderWidth: 1.5,
                borderColor: enhancedColor,
                width: '36%',
                height: '46%',
                top: '30%',
                right: '12%',
                borderRadius: 22,
              }]} />
              <View style={[styles.glassesBridge, { 
                backgroundColor: enhancedColor,
                width: '12%',
                height: 2.5,
                top: '40%',
                alignSelf: 'center',
              }]} />
              <View style={[styles.glassesArm, { 
                backgroundColor: enhancedColor,
                width: '28%',
                height: 2.5,
                top: '38%',
                left: '5%',
                transform: [{ rotate: '-15deg' }]
              }]} />
              <View style={[styles.glassesArm, { 
                backgroundColor: enhancedColor,
                width: '28%',
                height: 2.5,
                top: '38%',
                right: '5%',
                transform: [{ rotate: '15deg' }]
              }]} />
            </View>
          );
        case 'glasses_vr':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.vrHeadset, { 
                backgroundColor: '#222',
                width: '92%',
                height: '58%',
                top: '26%',
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 3,
              }]} />
              <View style={[styles.vrVisor, { 
                backgroundColor: enhancedColor,
                width: '86%',
                height: '38%',
                top: '36%',
                borderRadius: 12,
                shadowColor: enhancedColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }]} />
              <View style={[styles.vrStrap, { 
                backgroundColor: '#444',
                width: '95%',
                height: '14%',
                top: '16%',
                borderRadius: 8,
              }]} />
              <View style={[styles.vrDetail1, { 
                backgroundColor: '#666',
                width: 5,
                height: 12,
                top: '46%',
                right: '18%',
                borderRadius: 2.5,
              }]} />
              <View style={[styles.vrDetail2, { 
                backgroundColor: '#666',
                width: 5,
                height: 12,
                top: '46%',
                left: '18%',
                borderRadius: 2.5,
              }]} />
            </View>
          );
        case 'glasses_sunglasses':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.sunglassesFrame, { 
                backgroundColor: enhancedColor,
                width: '92%',
                height: 4,
                top: '45%',
                borderRadius: 2,
              }]} />
              <View style={[styles.sunglassesLens, { 
                backgroundColor: '#111',
                borderWidth: 1.5,
                borderColor: enhancedColor,
                width: '36%',
                height: '42%',
                top: '30%',
                left: '12%',
                borderRadius: 21,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 1,
              }]} />
              <View style={[styles.sunglassesLens, { 
                backgroundColor: '#111',
                borderWidth: 1.5,
                borderColor: enhancedColor,
                width: '36%',
                height: '42%',
                top: '30%',
                right: '12%',
                borderRadius: 21,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 1,
              }]} />
              <View style={[styles.sunglassesBridge, { 
                backgroundColor: enhancedColor,
                width: '12%',
                height: 4,
                top: '45%',
                alignSelf: 'center',
              }]} />
              <View style={[styles.sunglassesArm, { 
                backgroundColor: enhancedColor,
                width: '28%',
                height: 3,
                top: '43%',
                left: '5%',
                transform: [{ rotate: '-10deg' }]
              }]} />
              <View style={[styles.sunglassesArm, { 
                backgroundColor: enhancedColor,
                width: '28%',
                height: 3,
                top: '43%',
                right: '5%',
                transform: [{ rotate: '10deg' }]
              }]} />
            </View>
          );
        
        // SHIRT ITEMS
        case 'shirt_fancy':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.shirtBase, { 
                backgroundColor: enhancedColor,
                width: '85%',
                height: '75%',
                top: '12%',
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }]} />
              <View style={[styles.shirtNeck, { 
                backgroundColor: `${enhancedColor}E0`,
                width: '30%',
                height: '18%',
                top: '12%',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }]} />
              <View style={[styles.shirtCollar, { 
                backgroundColor: 'white',
                width: '20%',
                height: '12%',
                top: '15%',
                left: '20%',
                borderRadius: 4,
                transform: [{ rotate: '-20deg' }]
              }]} />
              <View style={[styles.shirtCollar, { 
                backgroundColor: 'white',
                width: '20%',
                height: '12%',
                top: '15%',
                right: '20%',
                borderRadius: 4,
                transform: [{ rotate: '20deg' }]
              }]} />
              <View style={[styles.shirtButton, { 
                backgroundColor: '#EEE',
                width: 6,
                height: 6,
                top: '35%',
                borderRadius: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }]} />
              <View style={[styles.shirtButton, { 
                backgroundColor: '#EEE',
                width: 6,
                height: 6,
                top: '48%',
                borderRadius: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }]} />
              <View style={[styles.shirtButton, { 
                backgroundColor: '#EEE',
                width: 6,
                height: 6,
                top: '61%',
                borderRadius: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }]} />
            </View>
          );
        case 'shirt_hoodie':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.hoodieBase, { 
                backgroundColor: enhancedColor,
                width: '88%',
                height: '78%',
                top: '16%',
                borderRadius: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
              }]} />
              <View style={[styles.hoodieHood, { 
                backgroundColor: enhancedColor,
                width: '65%',
                height: '32%',
                top: '2%',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
              }]} />
              <View style={[styles.hoodieHoodInner, { 
                backgroundColor: `${enhancedColor}80`,
                width: '55%',
                height: '26%',
                top: '5%',
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
              }]} />
              <View style={[styles.hoodiePocket, { 
                backgroundColor: `${enhancedColor}A0`,
                width: '42%',
                height: '16%',
                bottom: '12%',
                alignSelf: 'center',
                borderRadius: 8,
              }]} />
              <View style={[styles.hoodiePocketLine, { 
                backgroundColor: `${enhancedColor}D0`,
                width: '42%',
                height: 3,
                bottom: '28%',
                alignSelf: 'center',
              }]} />
              <View style={[styles.hoodieString, { 
                backgroundColor: 'white',
                width: 3,
                height: '17%',
                top: '28%',
                left: '28%',
                transform: [{ rotate: '5deg' }]
              }]} />
              <View style={[styles.hoodieString, { 
                backgroundColor: 'white',
                width: 3,
                height: '17%',
                top: '28%',
                right: '28%',
                transform: [{ rotate: '-5deg' }]
              }]} />
              <View style={[styles.hoodieStringTip, { 
                backgroundColor: 'white',
                width: 5,
                height: 6,
                top: '45%',
                left: '26%',
                borderRadius: 3,
              }]} />
              <View style={[styles.hoodieStringTip, { 
                backgroundColor: 'white',
                width: 5,
                height: 6,
                top: '45%',
                right: '26%',
                borderRadius: 3,
              }]} />
            </View>
          );
        case 'shirt_formal':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.suitBase, { 
                backgroundColor: '#222',
                width: '88%',
                height: '82%',
                top: '12%',
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }]} />
              <View style={[styles.suitLapel, { 
                backgroundColor: '#333',
                width: '16%',
                height: '42%',
                top: '18%',
                left: '24%',
                borderTopWidth: 1.5,
                borderTopColor: '#444',
                transform: [{ rotate: '15deg' }]
              }]} />
              <View style={[styles.suitLapel, { 
                backgroundColor: '#333',
                width: '16%',
                height: '42%',
                top: '18%',
                right: '24%',
                borderTopWidth: 1.5,
                borderTopColor: '#444',
                transform: [{ rotate: '-15deg' }]
              }]} />
              <View style={[styles.suitShirt, { 
                backgroundColor: 'white',
                width: '24%',
                height: '62%',
                top: '18%',
                alignSelf: 'center',
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              }]} />
              <View style={[styles.suitTie, { 
                backgroundColor: enhancedColor,
                width: '12%',
                height: '42%',
                top: '28%',
                alignSelf: 'center',
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                shadowColor: enhancedColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
              }]} />
              <View style={[styles.suitPocket, { 
                backgroundColor: '#2A2A2A',
                width: '14%',
                height: '9%',
                borderRadius: 3,
                top: '40%',
                left: '18%',
              }]} />
              <View style={[styles.suitPocket, { 
                backgroundColor: '#2A2A2A',
                width: '14%',
                height: '9%',
                borderRadius: 3,
                top: '40%',
                right: '18%',
              }]} />
              <View style={[styles.suitButton, { 
                backgroundColor: '#888',
                width: 6,
                height: 6,
                borderRadius: 3,
                top: '58%',
                alignSelf: 'center',
              }]} />
            </View>
          );
        
        // ACCESSORY ITEMS
        case 'accessory_headphones':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.headphoneBand, { 
                backgroundColor: '#222',
                width: '75%',
                height: 7,
                top: '25%',
                borderRadius: 3.5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
              }]} />
              <View style={[styles.headphoneEar, { 
                backgroundColor: enhancedColor,
                width: '34%',
                height: '42%',
                left: '10%',
                bottom: '22%',
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }]} />
              <View style={[styles.headphoneEar, { 
                backgroundColor: enhancedColor,
                width: '34%',
                height: '42%',
                right: '10%',
                bottom: '22%',
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }]} />
              <View style={[styles.headphoneEarInner, { 
                backgroundColor: '#111',
                width: '24%',
                height: '30%',
                left: '15%',
                bottom: '28%',
                borderRadius: 15,
              }]} />
              <View style={[styles.headphoneEarInner, { 
                backgroundColor: '#111',
                width: '24%',
                height: '30%',
                right: '15%',
                bottom: '28%',
                borderRadius: 15,
              }]} />
              <View style={[styles.headphonePadding, { 
                backgroundColor: '#444',
                width: '30%',
                height: '38%',
                left: '12%',
                bottom: '24%',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: '#222',
              }]} />
              <View style={[styles.headphonePadding, { 
                backgroundColor: '#444',
                width: '30%',
                height: '38%',
                right: '12%',
                bottom: '24%',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: '#222',
              }]} />
            </View>
          );
        case 'accessory_watch':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.watchBand, { 
                backgroundColor: '#444',
                width: '42%',
                height: '82%',
                borderRadius: 7,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.35,
                shadowRadius: 2,
              }]} />
              <View style={[styles.watchFace, { 
                backgroundColor: enhancedColor,
                width: '40%',
                height: '40%',
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#222',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
              }]} />
              <View style={[styles.watchScreen, { 
                backgroundColor: '#222',
                width: '30%',
                height: '30%',
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }]} />
              <View style={[styles.watchDetail, { 
                backgroundColor: '#CCC',
                width: 4,
                height: 4,
                borderRadius: 2,
                top: '32%',
                left: '28%',
              }]} />
              <View style={[styles.watchButton, { 
                backgroundColor: '#666',
                width: 5,
                height: 10,
                right: '30%',
                borderTopRightRadius: 2.5,
                borderBottomRightRadius: 2.5,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 1,
              }]} />
            </View>
          );
        case 'accessory_coffee':
          return (
            <View style={styles.customCosmeticContainer}>
              <View style={[styles.coffeeBody, { 
                backgroundColor: enhancedColor,
                width: '58%',
                height: '68%',
                bottom: '8%',
                borderRadius: 9,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }]} />
              <View style={[styles.coffeeTop, { 
                backgroundColor: '#6D4C41',
                width: '48%',
                height: '14%',
                top: '10%',
                alignSelf: 'center',
                borderTopLeftRadius: 7,
                borderTopRightRadius: 7,
              }]} />
              <View style={[styles.coffeeRim, { 
                backgroundColor: `${enhancedColor}D0`,
                width: '52%',
                height: 4,
                top: '24%',
                alignSelf: 'center',
                borderRadius: 2,
                borderTopWidth: 1,
                borderColor: `${enhancedColor}F0`,
              }]} />
              <View style={[styles.coffeeHandle, { 
                borderColor: enhancedColor,
                borderWidth: 3,
                width: '20%',
                height: '32%',
                right: '22%',
                top: '32%',
                borderLeftWidth: 0,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }]} />
              <View style={[styles.coffeeSteam1, { 
                backgroundColor: 'rgba(255,255,255,0.75)',
                width: 4.5,
                height: 12,
                top: '3%',
                left: '35%',
                borderRadius: 2.5,
                transform: [{ rotate: '-12deg' }]
              }]} />
              <View style={[styles.coffeeSteam2, { 
                backgroundColor: 'rgba(255,255,255,0.75)',
                width: 4.5,
                height: 10,
                top: '1%',
                right: '35%',
                borderRadius: 2.5,
                transform: [{ rotate: '12deg' }]
              }]} />
            </View>
          );
          
        default:
          // Fallback to default icon rendering
          return (
            <MaterialCommunityIcons 
              name={cosmetic.icon as any || 'hanger'} 
              size={iconSize} 
              color={enhancedColor}
              style={styles.cosmeticIcon}
            />
          );
      }
    };
    
    // Get item-specific size and zIndex
    let iconSize: number;
    let zIndexValue: number;
    
    // Set z-index based on item type to ensure proper layering
    switch (slot) {
      case 'hat':
        iconSize = size * 0.5; // 50% of avatar size for hats
        zIndexValue = 20; // Above the head
        break;
      case 'glasses':
        iconSize = size * 0.35; // 35% of avatar size for glasses
        zIndexValue = 15; // On the face, above the head
        break;
      case 'shirt':
        iconSize = size * 0.65; // 65% of avatar size for shirts
        zIndexValue = 1; // Below the head
        break;
      case 'accessory':
        // Different z-index for accessories based on position
        iconSize = size * 0.3; // 30% of avatar size for accessories
        // Check specific accessory type for correct z-index
        if (cosmetic.id === 'accessory_headphones') {
          zIndexValue = 18; // Above head but below hat
        } else if (cosmetic.id === 'accessory_watch') {
          zIndexValue = 6; // On arm/wrist area
        } else {
          zIndexValue = 12; // Default accessory z-index
        }
        break;
      default:
        iconSize = size * 0.4;
        zIndexValue = 5;
    }
    
    // Add shadow effect for rare/legendary items
    const isFancyItem = cosmetic.rarity === 'rare' || cosmetic.rarity === 'legendary';
    const shadowStyle = isFancyItem ? {
      shadowColor: iconColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 8,
    } : {};
    
    // Add animation style for legendary items
    const animationStyle = cosmetic.rarity === 'legendary' ? {
      transform: [{ scale: 1.1 }],
    } : {};
    
    // Helper function to get item-specific position adjustments
    const getItemPositionAdjustment = (item: Collectible, size: number): { top?: number, bottom?: number, left?: number, right?: number } => {
      switch(item.id) {
        // HAT POSITIONS
        case 'hat_beanie':
          return { top: -size * 0.42, left: 0 }; // Centered on top of head
        case 'hat_graduation':
          return { top: -size * 0.45, left: 0 }; // Slightly higher for graduation cap
        case 'hat_crown':
          return { top: -size * 0.40, left: 0 }; // Centered on top of head
          
        // GLASSES POSITIONS
        case 'glasses_nerd':
          return { top: -size * 0.18, left: 0 }; // Centered on face at eye level
        case 'glasses_vr':
          return { top: -size * 0.20, left: 0 }; // Covers more of the face
        case 'glasses_sunglasses':
          return { top: -size * 0.16, left: 0 }; // Slightly lower on the face
          
        // SHIRT POSITIONS
        case 'shirt_fancy':
          return { top: size * 0.25, left: 0 }; // Centered below head
        case 'shirt_hoodie':
          return { top: size * 0.22, left: 0 }; // Slightly higher for hoodie
        case 'shirt_formal':
          return { top: size * 0.25, left: 0 }; // Centered below head
          
        // ACCESSORY POSITIONS  
        case 'accessory_headphones':
          return { top: -size * 0.33, left: 0 }; // On top of head
        case 'accessory_watch':
          return { top: size * 0.25, right: -size * 0.28 }; // On wrist area
        case 'accessory_coffee':
          return { bottom: -size * 0.05, left: size * 0.25 }; // Held in hand
        default:
          return {};
      }
    };
    
    const positionAdjustment = getItemPositionAdjustment(cosmetic, size);
    
    // Helper function to enhance colors based on rarity
    const getEnhancedColor = (color: string, rarity: string): string => {
      if (rarity === 'legendary') {
        // Make legendary items more vivid
        if (color.startsWith('#')) {
          // For hex colors, slightly intensify them
          return color;
        }
        // For named colors, return a more vivid version
        const vividColors: Record<string, string> = {
          'red': '#FF3B30',
          'blue': '#007AFF',
          'green': '#34C759',
          'yellow': '#FFCC00',
          'purple': '#AF52DE',
          'orange': '#FF9500',
          'pink': '#FF2D55',
          'brown': '#A2845E',
          'gray': '#8E8E93',
          'black': '#000000',
        };
        return vividColors[color] || color;
      } else if (rarity === 'rare') {
        // Make rare items slightly more intense
        if (color.startsWith('#')) {
          return color;
        }
        return color;
      }
      return color;
    };
    
    const enhancedColor = getEnhancedColor(iconColor, cosmetic.rarity);
    
    // Base container for the cosmetic with positioning
    return (
      <View style={[
        styles.cosmeticContainer, 
        {
          width: iconSize, 
          height: iconSize,
          zIndex: zIndexValue,
          ...positionAdjustment
        }
      ]}>
        {renderCustomItem(cosmetic.id, iconSize, enhancedColor)}
      </View>
    );
  };

  return (
    <View style={styles.accessoriesContainer}>
      {renderCosmetic('hat')}
      {renderCosmetic('glasses')}
      {renderCosmetic('shirt')}
      {renderCosmetic('accessory')}
      
      {/* If Brayden is sleeping, show sleep bubble with Z's */}
      {!stats.isAwake && (
        <View style={[styles.sleepBubble, { right: size * 0.1, top: -size * 0.25 }]}>
          <Text style={styles.sleepZ1}>Z</Text>
          <Text style={styles.sleepZ2}>Z</Text>
          <Text style={styles.sleepZ3}>Z</Text>
        </View>
      )}
      
      {/* If Brayden is dizzy, show dizzy stars */}
      {stats.isDizzy && (
        <View style={styles.dizzyStarsContainer}>
          <Text style={styles.dizzyStar1}>★</Text>
          <Text style={styles.dizzyStar2}>★</Text>
          <Text style={styles.dizzyStar3}>★</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accessoriesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cosmeticContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  cosmetic: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  placeholderCosmetic: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  sleepBubble: {
    position: 'absolute',
    width: 70,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  sleepZ1: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    right: 15,
    bottom: 10,
  },
  sleepZ2: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    right: 25,
    bottom: 20,
  },
  sleepZ3: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    right: 35,
    bottom: 30,
  },
  dizzyStarsContainer: {
    position: 'absolute',
    top: -30,
    right: 10,
    width: 70,
    height: 70,
    zIndex: 20,
  },
  dizzyStar1: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    top: 10,
    right: 10,
  },
  dizzyStar2: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    top: 25,
    right: 25,
  },
  dizzyStar3: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    top: 40,
    right: 5,
  },
  cosmeticIcon: {
    // These styles will make the icons look better on the avatar
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  customCosmeticContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 1, // Base z-index for the container
  },
  beanieBase: {
    width: '75%',
    height: '65%',
    borderRadius: 20,
    position: 'absolute',
    top: '20%',
  },
  beanieFold: {
    width: '75%',
    height: '18%',
    borderRadius: 10,
    position: 'absolute',
    bottom: '22%',
  },
  beaniePom: {
    width: 15,
    height: 15,
    borderRadius: 10,
    position: 'absolute',
    top: '5%',
  },
  beanieRibbing1: {
    width: '70%',
    height: 3,
    position: 'absolute',
    bottom: '35%',
  },
  beanieRibbing2: {
    width: '70%',
    height: 3,
    position: 'absolute',
    bottom: '30%',
  },
  graduationCapBase: {
    width: '70%',
    height: '35%',
    position: 'absolute',
    bottom: '20%',
    borderRadius: 5,
  },
  graduationCapTop: {
    width: '80%',
    height: '8%',
    position: 'absolute',
    bottom: '55%',
    borderRadius: 3,
  },
  graduationTassel: {
    width: 6,
    height: '40%',
    position: 'absolute',
    top: '20%',
    right: '32%',
    borderRadius: 2,
  },
  graduationButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
  },
  crownBase: {
    width: '80%',
    height: '40%',
    borderRadius: 8,
    position: 'absolute',
    bottom: '10%',
  },
  crownPoint: {
    width: 10,
    height: 18,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    top: '5%',
  },
  crownGem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: '20%',
  },
  glassesFrame: {
    width: '85%',
    height: '40%',
    borderWidth: 3,
    borderRadius: 10,
    position: 'absolute',
    top: '30%',
  },
  glassesLens: {
    width: '32%',
    height: '35%',
    borderRadius: 15,
    position: 'absolute',
    top: '32%',
  },
  glassesBridge: {
    width: '15%',
    height: 4,
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  glassesArm: {
    width: '30%',
    height: 3,
    position: 'absolute',
    top: '38%',
  },
  vrHeadset: {
    width: '85%',
    height: '65%',
    borderRadius: 15,
    position: 'absolute',
    top: '15%',
  },
  vrVisor: {
    width: '80%',
    height: '35%',
    borderRadius: 10,
    position: 'absolute',
    top: '20%',
  },
  vrStrap: {
    width: '95%',
    height: '15%',
    position: 'absolute',
    top: '10%',
    borderRadius: 8,
  },
  vrDetail1: {
    width: 5,
    height: 12,
    position: 'absolute',
    top: '30%',
    right: '25%',
    borderRadius: 3,
  },
  vrDetail2: {
    width: 5,
    height: 12,
    position: 'absolute',
    top: '30%',
    left: '25%',
    borderRadius: 3,
  },
  sunglassesFrame: {
    width: '85%',
    height: '12%',
    borderRadius: 6,
    position: 'absolute',
    top: '38%',
  },
  sunglassesLens: {
    width: '32%',
    height: '35%',
    borderRadius: 15,
    position: 'absolute',
    top: '32%',
  },
  sunglassesBridge: {
    width: '15%',
    height: 3,
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
  },
  sunglassesArm: {
    width: '25%',
    height: 3,
    position: 'absolute',
    top: '38%',
  },
  shirtBase: {
    width: '80%',
    height: '75%',
    borderRadius: 15,
    position: 'absolute',
    top: '15%',
  },
  shirtNeck: {
    width: '35%',
    height: '15%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    top: '15%',
  },
  shirtCollar: {
    width: '22%',
    height: '15%',
    borderRadius: 5,
    position: 'absolute',
    top: '20%',
  },
  shirtButton: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    alignSelf: 'center',
  },
  hoodieBase: {
    width: '80%',
    height: '80%',
    borderRadius: 15,
    position: 'absolute',
    top: '15%',
  },
  hoodieHood: {
    width: '65%',
    height: '32%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    top: '5%',
  },
  hoodieHoodInner: {
    width: '55%',
    height: '26%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    top: '8%',
  },
  hoodiePocket: {
    width: '40%',
    height: '15%',
    borderRadius: 8,
    position: 'absolute',
    bottom: '15%',
    alignSelf: 'center',
  },
  hoodiePocketLine: {
    width: '40%',
    height: 2,
    position: 'absolute',
    bottom: '30%',
    alignSelf: 'center',
  },
  hoodieString: {
    width: 2,
    height: '15%',
    position: 'absolute',
    top: '30%',
  },
  hoodieStringTip: {
    width: 4,
    height: 5,
    borderRadius: 2,
    position: 'absolute',
    top: '45%',
  },
  suitBase: {
    width: '85%',
    height: '80%',
    borderRadius: 12,
    position: 'absolute',
    top: '15%',
  },
  suitLapel: {
    width: '16%',
    height: '40%',
    borderTopWidth: 1,
    borderTopColor: '#444',
    position: 'absolute',
    top: '15%',
  },
  suitShirt: {
    width: '24%',
    height: '60%',
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  suitTie: {
    width: '12%',
    height: '42%',
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  suitPocket: {
    width: '14%',
    height: '9%',
    position: 'absolute',
    borderRadius: 3,
    top: '40%',
  },
  suitButton: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: '58%',
    alignSelf: 'center',
  },
  headphoneBand: {
    width: '75%',
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: '30%',
  },
  headphoneEar: {
    width: '34%',
    height: '42%',
    borderRadius: 20,
    position: 'absolute',
    bottom: '22%',
  },
  headphoneEarInner: {
    width: '24%',
    height: '30%',
    borderRadius: 15,
    position: 'absolute',
    bottom: '28%',
  },
  headphonePadding: {
    width: '30%',
    height: '38%',
    borderRadius: 18,
    position: 'absolute',
    bottom: '24%',
    borderWidth: 1,
    borderColor: '#222',
  },
  watchBand: {
    width: '42%',
    height: '82%',
    position: 'absolute',
  },
  watchFace: {
    width: '40%',
    height: '40%',
    borderRadius: 19,
    position: 'absolute',
  },
  watchScreen: {
    width: '30%',
    height: '30%',
    borderRadius: 15,
    position: 'absolute',
  },
  watchDetail: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: '33%',
    left: '28%',
  },
  watchButton: {
    width: 5,
    height: 10,
    position: 'absolute',
    right: '32%',
    borderTopRightRadius: 2.5,
    borderBottomRightRadius: 2.5,
  },
  coffeeBody: {
    width: '58%',
    height: '68%',
    borderRadius: 9,
    position: 'absolute',
    bottom: '8%',
  },
  coffeeTop: {
    width: '48%',
    height: '14%',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
  },
  coffeeRim: {
    width: '52%',
    height: 4,
    position: 'absolute',
    top: '24%',
    alignSelf: 'center',
    borderRadius: 2,
    borderTopWidth: 1,
    borderColor: '#F0',
  },
  coffeeHandle: {
    width: '20%',
    height: '32%',
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    right: '22%',
    top: '32%',
  },
  coffeeSteam1: {
    width: 4.5,
    height: 12,
    borderRadius: 2.5,
    position: 'absolute',
    top: '3%',
    left: '35%',
  },
  coffeeSteam2: {
    width: 4.5,
    height: 10,
    borderRadius: 2.5,
    position: 'absolute',
    top: '1%',
    right: '35%',
  },
}); 