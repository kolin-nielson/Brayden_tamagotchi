import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';
import { Shadow } from 'react-native-shadow-2';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Simpler fallback avatar due to the 3D rendering issues
interface BraydenAvatar3DProps {
  size?: number;
}

const BraydenAvatar3D: React.FC<BraydenAvatar3DProps> = ({ size = 220 }) => {
  const { stats, equippedCosmetics } = useBrayden();
  const { theme } = useTheme();
  
  // Animation values
  const dizzyAnim = useRef(new Animated.Value(0)).current;
  const sleepZAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const eyeBlinkAnim = useRef(new Animated.Value(1)).current;
  const headRotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  
  // Start breathing animation
  useEffect(() => {
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    
    breatheLoop.start();
    
    return () => {
      breatheLoop.stop();
    };
  }, [breatheAnim]);
  
  // Start head rotation animation
  useEffect(() => {
    if (stats.isAwake && !stats.isDizzy) {
      const headRotateLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(headRotateAnim, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(headRotateAnim, {
            toValue: -1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(headRotateAnim, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      
      headRotateLoop.start();
      
      return () => {
        headRotateLoop.stop();
      };
    }
  }, [headRotateAnim, stats.isAwake, stats.isDizzy]);
  
  // Start floating animation on mount
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    
    floatLoop.start();
    
    return () => {
      floatLoop.stop();
    };
  }, [floatAnim]);

  // Start pulse animation on mount
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseLoop.start();
    
    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim]);
  
  // Blinking effect for the eyes
  useEffect(() => {
    if (stats.isAwake && !stats.isDizzy) {
      const blinkTimer = setInterval(() => {
        Animated.sequence([
          Animated.timing(eyeBlinkAnim, {
            toValue: 0.1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(eyeBlinkAnim, {
            toValue: 1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]).start();
      }, 3000 + Math.random() * 2000); // Random blinking interval
      
      return () => clearInterval(blinkTimer);
    }
  }, [stats.isAwake, stats.isDizzy, eyeBlinkAnim]);
  
  // Start dizzy animation when isDizzy changes
  useEffect(() => {
    if (stats.isDizzy) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dizzyAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dizzyAnim, {
            toValue: -1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dizzyAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 5 }
      ).start();
    } else {
      dizzyAnim.setValue(0);
    }
  }, [stats.isDizzy]);
  
  // Sleep Z animation
  useEffect(() => {
    if (!stats.isAwake) {
      const zLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(sleepZAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(sleepZAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      
      zLoop.start();
      
      return () => {
        zLoop.stop();
      };
    }
  }, [sleepZAnim, stats.isAwake]);
  
  // Get mood description for text
  const getMoodDescription = () => {
    if (!stats.isAwake) return "Sleeping";
    if (stats.isDizzy) return "Dizzy";
    if (stats.happiness < 30) return "Sad";
    if (stats.happiness > 70) return "Happy";
    return "Neutral";
  };

  // Animation interpolations
  const rotation = dizzyAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg']
  });

  const headRotation = headRotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg']
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8]
  });

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03]
  });

  // Get icons for equipped cosmetics
  const getEquippedItemIcon = (slot: string) => {
    const item = equippedCosmetics[slot];
    if (!item) return null;
    
    return item.icon;
  };
  
  // Get position for each cosmetic type
  const getCosmeticPosition = (slot: string): any => {
    switch (slot) {
      case 'hat':
        return {
          position: 'absolute',
          top: -15, // Position right above the head
          left: 0,
          right: 0,
          zIndex: 10,
          alignItems: 'center',
        } as any;
      case 'glasses':
        return {
          position: 'absolute',
          top: '30%', // Align precisely with the eyes
          left: '-5%',
          right: '-5%',
          zIndex: 15,
          width: '110%',
          alignItems: 'center',
          transform: [
            { rotate: stats.isDizzy ? rotation : headRotation },
          ]
        } as any;
      case 'shirt':
        return {
          position: 'absolute',
          top: 0, // Position at the top of the body component
          left: 0,
          right: 0,
          zIndex: 2,
          alignItems: 'center',
        } as any;
      case 'accessory':
        return {
          position: 'absolute',
          left: -30,
          top: '50%', // Position at the middle of the body
          zIndex: 4,
        } as any;
      case 'background':
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        } as any;
      default:
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3,
        } as any;
    }
  };

  // Get size for each cosmetic type
  const getCosmeticSize = (slot: string) => {
    switch (slot) {
      case 'hat':
        return size * 0.95;
      case 'glasses':
        return size * 0.95;
      case 'shirt':
        return size * 0.4;
      case 'accessory':
        return size * 0.2;
      case 'background':
        return size * 0.2;
      default:
        return size * 0.4;
    }
  };
  
  // Get cosmetic item color based on rarity
  const getCosmeticColor = (slot: string) => {
    const item = equippedCosmetics[slot];
    if (!item) return theme.colors.primary;
    
    switch (item.rarity) {
      case 'common': return '#AAAAAA';
      case 'uncommon': return '#55AA55';
      case 'rare': return '#5555FF';
      case 'legendary': return '#AA55AA';
      default: return theme.colors.primary;
    }
  };
  
  // Define component styles that depend on the size prop inside the component
  const getDynamicStyles = () => {
    return StyleSheet.create({
      // VR Headset
      vrHeadset: {
        width: size * 0.25,
        height: size * 0.12,
        borderRadius: 8,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      },
      vrHeadsetStrap: {
        position: 'absolute',
        top: -8,
        width: size * 0.35,
        height: 4,
        backgroundColor: '#222222',
        borderRadius: 2,
      },
      sunglasses: {
        width: size * 0.25,
        height: size * 0.08,
        borderRadius: 4,
        position: 'relative',
      },
      beanie: {
        width: size * 0.4,
        height: size * 0.2,
        borderRadius: size * 0.2,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      graduationCapTop: {
        width: size * 0.35,
        height: size * 0.1,
        backgroundColor: '#000000',
        borderRadius: 5,
      },
      graduationCapBase: {
        position: 'absolute',
        bottom: 0,
        width: size * 0.4,
        height: 8,
        backgroundColor: '#000000',
        borderRadius: 2,
      },
      graduationCapTassel: {
        position: 'absolute',
        top: 0,
        right: -3,
        width: 4,
        height: size * 0.15,
        backgroundColor: '#FFCC00',
      },
      crown: {
        width: size * 0.25,
        height: size * 0.15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 3,
      },
      businessShirt: {
        width: size * 0.6,
        height: size * 0.35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      hoodie: {
        width: size * 0.6,
        height: size * 0.35,
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
      },
      suit: {
        width: size * 0.6,
        height: size * 0.35,
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
      },
      headphonesBand: {
        width: size * 0.25,
        height: 4,
        backgroundColor: '#111111',
        borderRadius: 2,
      },
    });
  };

  // Get the dynamic styles
  const dynamicStyles = getDynamicStyles();
  
  // Render a cosmetic item with 3D effects
  const renderCosmetic = (slot: string) => {
    const item = equippedCosmetics[slot];
    if (!item) {
      return null;
    }
    
    const iconName = item.icon;
    const iconSize = getCosmeticSize(slot);
    const position = getCosmeticPosition(slot);
    const color = getCosmeticColor(slot);
    
    // Render specific items based on their ID for truly unique appearances
    // GLASSES
    if (slot === 'glasses') {
      // Programmer Glasses (nerd glasses)
      if (item.id === 'glasses_nerd') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: '30%', // Align precisely with the eyes
                left: '-5%',
                right: '-5%',
                zIndex: 15,
                width: '110%',
                alignItems: 'center',
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                ]
              }
            ]}
          >
            <View style={styles.glasses3DContainer}>
              {/* Lenses */}
              <View style={{
                position: 'absolute',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
                <View style={{
                  width: iconSize * 0.24,
                  height: iconSize * 0.24,
                  borderRadius: iconSize * 0.12,
                  backgroundColor: 'rgba(160, 220, 255, 0.3)',
                  marginHorizontal: iconSize * 0.05,
                }} />
                <View style={{
                  width: iconSize * 0.24,
                  height: iconSize * 0.24,
                  borderRadius: iconSize * 0.12,
                  backgroundColor: 'rgba(160, 220, 255, 0.3)',
                  marginHorizontal: iconSize * 0.05,
                }} />
              </View>

              
              <MaterialCommunityIcons 
                name="glasses" 
                size={iconSize * 0.75} 
                color={'rgba(0,0,0,0.2)'} 
                style={[styles.glassesShadow, { transform: [{ translateY: 2 }] }]}
              />
              
              {/* Main glasses frame */}
              <LinearGradient
                colors={[lightenColor('#555555', 15), '#333333', darkenColor('#222222', 15)]}
                style={styles.glasses3D}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
              >
                <MaterialCommunityIcons 
                  name="glasses" 
                  size={iconSize * 0.75} 
                  color={'transparent'}
                />
              </LinearGradient>
            </View>
          </Animated.View>
        );
      }
      
      // VR Glasses
      if (item.id === 'glasses_vr') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: '30%', // Align precisely with the eyes
                left: '-5%',
                right: '-5%',
                zIndex: 15,
                width: '110%',
                alignItems: 'center',
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                ]
              }
            ]}
          >
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* VR Headset main body */}
              <LinearGradient
                colors={['#222222', '#111111', '#000000']}
                style={{
                  width: iconSize * 0.7,
                  height: iconSize * 0.35,
                  borderRadius: 8,
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                {/* Lenses */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                  <View style={{
                    width: iconSize * 0.28,
                    height: iconSize * 0.28,
                    borderRadius: iconSize * 0.14,
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    marginHorizontal: 4,
                    borderWidth: 2,
                    borderColor: '#333',
                  }} />
                  <View style={{
                    width: iconSize * 0.28,
                    height: iconSize * 0.28,
                    borderRadius: iconSize * 0.14,
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    marginHorizontal: 4,
                    borderWidth: 2,
                    borderColor: '#333',
                  }} />
                </View>
              </LinearGradient>
              
              {/* Headset strap */}
              <View style={{
                position: 'absolute',
                top: -8,
                width: iconSize * 0.8,
                height: 6,
                backgroundColor: '#222222',
                borderRadius: 3,
              }} />
              
              {/* Button */}
              <View style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#FF0000',
              }} />
            </View>
          </Animated.View>
        );
      }
      
      // Sunglasses
      if (item.id === 'glasses_sunglasses') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: '30%', // Align precisely with the eyes
                left: '-5%',
                right: '-5%',
                zIndex: 15,
                width: '110%',
                alignItems: 'center',
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                ]
              }
            ]}
          >
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Sunglasses frame */}
              <LinearGradient
                colors={['#444444', '#222222', '#111111']}
                style={{
                  width: iconSize * 0.7,
                  height: iconSize * 0.22,
                  borderRadius: 6,
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                {/* Lenses */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  paddingTop: 2,
                }}>
                  <View style={{
                    width: iconSize * 0.3,
                    height: iconSize * 0.17,
                    borderRadius: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    marginHorizontal: 4,
                    borderWidth: 1,
                    borderColor: '#555',
                  }} />
                  <View style={{
                    width: iconSize * 0.3,
                    height: iconSize * 0.17,
                    borderRadius: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    marginHorizontal: 4,
                    borderWidth: 1,
                    borderColor: '#555',
                  }} />
                </View>
                
                {/* Bridge */}
                <View style={{
                  position: 'absolute',
                  top: 2,
                  width: 12,
                  height: 3,
                  backgroundColor: '#222222',
                }} />
              </LinearGradient>
            </View>
          </Animated.View>
        );
      }
    }
    
    // HATS
    if (slot === 'hat') {
      // Beanie
      if (item.id === 'hat_beanie') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: -10, // Just above the hair
                left: 0,
                right: 0,
                zIndex: 10,
                width: '100%',
                alignItems: 'center',
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#505050', '#404040', '#303030']}
              style={{
                width: size * 0.5,
                height: size * 0.2,
                borderRadius: size * 0.25,
                borderBottomLeftRadius: size * 0.32,
                borderBottomRightRadius: size * 0.32,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.beanieRibbing} />
              <View style={styles.beaniePomPom} />
            </LinearGradient>
          </Animated.View>
        );
      }
      
      // Graduation Cap
      if (item.id === 'hat_graduation') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              position,
              {
                width: '100%',
                alignItems: 'center',
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                  { perspective: 1000 },
                  { rotateX: '10deg' },
                ]
              }
            ]}
          >
            <View style={styles.graduationCapContainer}>
              <View style={dynamicStyles.graduationCapTop} />
              <View style={dynamicStyles.graduationCapBase} />
              <View style={dynamicStyles.graduationCapTassel} />
            </View>
          </Animated.View>
        );
      }
      
      // Crown
      if (item.id === 'hat_crown') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              position,
              {
                width: '100%',
                alignItems: 'center',
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                  { perspective: 1000 },
                  { rotateX: '10deg' },
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#FFD700', '#FFC000', '#FFB000']}
              style={dynamicStyles.crown}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.crownPoint} />
              <View style={styles.crownPoint} />
              <View style={styles.crownPoint} />
              <View style={styles.crownJewel} />
            </LinearGradient>
          </Animated.View>
        );
      }
    }
    
    // SHIRTS
    if (slot === 'shirt') {
      // Business Casual Shirt
      if (item.id === 'shirt_fancy') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              position,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                  { scale: breatheScale },
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0', '#E0E0E0']}
              style={[styles.shirt, { backgroundColor: 'white' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.businessCollar} />
              <View style={styles.businessButton} />
              <View style={styles.businessButton} />
              <View style={styles.businessButton} />
            </LinearGradient>
          </Animated.View>
        );
      }
      
      // Developer Hoodie
      if (item.id === 'shirt_hoodie') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              position,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                  { scale: breatheScale },
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#404040', '#303030', '#202020']}
              style={[styles.shirt, { backgroundColor: '#303030' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.hoodieHood} />
              <View style={styles.hoodieStrings} />
              <View style={styles.hoodiePocket} />
            </LinearGradient>
          </Animated.View>
        );
      }
      
      // Formal Suit
      if (item.id === 'shirt_formal') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              position,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                  { scale: breatheScale },
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#101010', '#050505', '#000000']}
              style={[styles.shirt, { backgroundColor: 'black' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.suitLapel} />
              <View style={styles.suitTie} />
              <View style={styles.suitButton} />
            </LinearGradient>
          </Animated.View>
        );
      }
    }
    
    // ACCESSORIES
    if (slot === 'accessory') {
      // Headphones
      if (item.id === 'accessory_headphones') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: '15%', // Position near the top of the head
                left: -25,
                zIndex: 9,
                transform: [
                  { rotate: stats.isDizzy ? rotation : headRotation },
                ]
              }
            ]}
          >
            <View style={styles.headphonesContainer}>
              <View style={{ 
                width: size * 0.5,
                height: 3,
                backgroundColor: '#111111',
                borderRadius: 2,
                position: 'absolute',
                top: -2,
              }} />
              <View style={{ 
                left: 0,
                width: 15,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#333333',
              }} />
              <View style={{ 
                position: 'absolute',
                right: size * 0.5 - 15, 
                width: 15,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#333333',
              }} />
            </View>
          </Animated.View>
        );
      }
      
      // Watch
      if (item.id === 'accessory_watch') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: '70%',
                left: -25,
                zIndex: 4,
                transform: [
                  { translateY },
                ]
              }
            ]}
          >
            <View style={styles.watchContainer}>
              <View style={styles.watchStrap} />
              <View style={styles.watchFace} />
            </View>
          </Animated.View>
        );
      }
      
      // Coffee Mug
      if (item.id === 'accessory_coffee') {
        return (
          <Animated.View
            style={[
              styles.cosmeticContainer,
              {
                position: 'absolute',
                top: '60%',
                left: -30,
                zIndex: 4,
                transform: [
                  { translateY },
                ]
              }
            ]}
          >
            <View style={styles.coffeeMugContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#F0F0F0', '#E8E8E8']}
                style={styles.coffeeMug}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.coffeeMugHandle} />
                <View style={styles.coffeeMugContents} />
              </LinearGradient>
            </View>
          </Animated.View>
        );
      }
    }
    
    // If we don't have a specific custom render for this item, fall back to the generic rendering
    return (
      <Animated.View
        style={[
          styles.cosmeticContainer,
          position,
          {
            transform: slot === 'hat' || slot === 'glasses' ? 
              [{ rotate: stats.isDizzy ? rotation : headRotation }] :
              [{ translateY }]
          }
        ]}
      >
        <MaterialCommunityIcons 
          name={iconName as any} 
          size={iconSize} 
          color={color} 
        />
      </Animated.View>
    );
  };
  
  // Utility functions for color manipulation
  const lightenColor = (color: string, amount: number): string => {
    // Convert hex to RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Increase RGB values
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const darkenColor = (color: string, amount: number): string => {
    // Convert hex to RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Decrease RGB values
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Render background if equipped
  const renderBackground = () => {
    const background = equippedCosmetics.background;
    if (!background) return null;
    
    const getBackgroundColor = () => {
      switch (background.rarity) {
        case 'legendary': return 'rgba(170, 85, 170, 0.15)';
        case 'rare': return 'rgba(85, 85, 255, 0.15)';
        case 'uncommon': return 'rgba(85, 170, 85, 0.15)';
        default: return 'rgba(170, 170, 170, 0.1)';
      }
    };
    
    // Use a pattern based on the icon for the background
    const renderBackgroundPattern = () => {
      const patternSize = 20;
      const color = getCosmeticColor('background');
      
      return (
        <View style={styles.backgroundPattern}>
          <MaterialCommunityIcons 
            name={background.icon as any} 
            size={patternSize} 
            color={`${color}40`}
            style={{ margin: 10 }}
          />
        </View>
      );
    };
    
    return (
      <View style={[styles.background, { backgroundColor: getBackgroundColor() }]}>
        {renderBackgroundPattern()}
        <MaterialCommunityIcons 
          name={background.icon as any} 
          size={40} 
          color={getCosmeticColor('background')} 
          style={styles.backgroundIcon}
        />
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      {/* Add background */}
      {renderBackground()}
      
      {/* Floor Shadow */}
      <Animated.View
        style={[
          styles.floorShadow,
          {
            width: size * 0.85,
            opacity: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 0.3]
            }),
            transform: [
              { 
                scaleX: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.9]
                })
              }
            ]
          }
        ]}
      />
      
      <Animated.View 
        style={[
          styles.container, 
          { 
            width: size,
            height: size * 1.3,
            transform: [
              { translateY },
              { rotate: stats.isDizzy ? rotation : '0deg' },
            ]
          }
        ]}
      >
        {/* Head with 3D effects */}
        <Animated.View
          style={[
            styles.head,
            {
              transform: [
                { rotate: stats.isDizzy ? '0deg' : headRotation },
                { scale: breatheScale }
              ]
            }
          ]}
        >
          {/* Face Base */}
          <LinearGradient
            colors={['#FFDBAC', '#F1C27D', '#E0AC69'] as const}
            style={styles.faceBase}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
          >
            {/* Subtle shading for 3D effect */}
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
              style={styles.faceShadow}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
            
            {/* Forehead Highlight */}
            <View style={styles.foreheadHighlight} />
            
            {/* Eyes with realistic features */}
            <View style={styles.eyesContainer}>
              {stats.isDizzy ? (
                <>
                  <View style={styles.eyeSocket}>
                    <View style={styles.dizzyEyeContainer}>
                      <View style={styles.dizzyEyeX1} />
                      <View style={styles.dizzyEyeX2} />
                    </View>
                  </View>
                  <View style={styles.eyeSocket}>
                    <View style={styles.dizzyEyeContainer}>
                      <View style={styles.dizzyEyeX1} />
                      <View style={styles.dizzyEyeX2} />
                    </View>
                  </View>
                </>
              ) : !stats.isAwake ? (
                <>
                  <View style={styles.eyeSocket}>
                    <View style={styles.sleepingEye} />
                  </View>
                  <View style={styles.eyeSocket}>
                    <View style={styles.sleepingEye} />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.eyeSocket}>
                    <Animated.View
                      style={[
                        styles.eyeball,
                        { transform: [{ scaleY: eyeBlinkAnim }] }
                      ]}
                    >
                      <View style={styles.eyeIris}>
                        <View style={styles.eyePupil} />
                        <View style={styles.eyeHighlight} />
                      </View>
                    </Animated.View>
                    <View style={styles.eyebrow} />
                  </View>
                  <View style={styles.eyeSocket}>
                    <Animated.View
                      style={[
                        styles.eyeball,
                        { transform: [{ scaleY: eyeBlinkAnim }] }
                      ]}
                    >
                      <View style={styles.eyeIris}>
                        <View style={styles.eyePupil} />
                        <View style={styles.eyeHighlight} />
                      </View>
                    </Animated.View>
                    <View style={styles.eyebrow} />
                  </View>
                </>
              )}
            </View>
            
            {/* Nose */}
            <View style={styles.nose}>
              <View style={styles.nostril} />
              <View style={styles.nostril} />
            </View>
            
            {/* Mouth with different expressions */}
            {stats.isDizzy ? (
              <View style={styles.mouthContainer}>
                <View style={styles.dizzyMouth} />
              </View>
            ) : !stats.isAwake ? (
              <View style={styles.mouthContainer}>
                <View style={styles.sleepingMouth} />
              </View>
            ) : stats.happiness < 30 ? (
              <View style={styles.mouthContainer}>
                <View style={styles.sadMouth} />
              </View>
            ) : stats.happiness > 70 ? (
              <View style={styles.mouthContainer}>
                <View style={styles.happyMouth}>
                  <View style={styles.teeth} />
                  <View style={styles.tongue} />
                </View>
              </View>
            ) : (
              <View style={styles.mouthContainer}>
                <View style={styles.neutralMouth} />
              </View>
            )}
            
            {/* Ears */}
            <View style={[styles.ear, styles.leftEar]} />
            <View style={[styles.ear, styles.rightEar]} />
          </LinearGradient>
          
          {/* Hair */}
          <View style={styles.hairContainer}>
            <LinearGradient
              colors={['#E9CB85', '#D8AB49', '#C99B36'] as const}
              style={styles.hair}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.hairHighlight} />
            </LinearGradient>
          </View>
          
          {/* Equipped glasses */}
          {renderCosmetic('glasses')}
          
          {/* Equipped hat */}
          {renderCosmetic('hat')}
        </Animated.View>
        
        {/* Body with breathing animation */}
        <Animated.View 
          style={[
            styles.body,
            {
              transform: [
                { scale: breatheScale }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['#4B7BF5', '#3D62C1', '#2E4990'] as const}
            style={styles.shirt}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.collar} />
            <View style={styles.shirtHighlight} />
          </LinearGradient>
          
          {/* Equipped shirt as overlay */}
          {renderCosmetic('shirt')}
          
          {/* Equipped accessory */}
          {renderCosmetic('accessory')}
        </Animated.View>
        
        {/* Status effects */}
        {/* Dizzy stars */}
        {stats.isDizzy && (
          <View style={styles.dizzyStarsContainer}>
            <Animated.Text 
              style={[
                styles.dizzyStarsText,
                { 
                  transform: [{ rotate: dizzyAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-30deg', '0deg', '30deg']
                  })}]
                }
              ]}
            >
              ✦
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.dizzyStarsText,
                { 
                  transform: [{ rotate: dizzyAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['30deg', '0deg', '-30deg']
                  })}]
                }
              ]}
            >
              ✧
            </Animated.Text>
            <Animated.Text
              style={[
                styles.dizzyStarsText,
                {
                  transform: [{ rotate: dizzyAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-45deg', '0deg', '45deg']
                  })}]
                }
              ]}
            >
              ✦
            </Animated.Text>
          </View>
        )}
        
        {/* Sleep Z animation */}
        {!stats.isAwake && (
          <Animated.View
            style={[
              styles.sleepZ,
              {
                opacity: sleepZAnim,
                transform: [
                  { translateY: sleepZAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  })},
                  { translateX: sleepZAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  })},
                  { scale: sleepZAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  })},
                  { rotate: '15deg' }
                ],
              },
            ]}
          >
            <Text style={styles.zText}>Z</Text>
          </Animated.View>
        )}
        
        {/* Name tag */}
        <View style={[styles.nameTag, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.nameText}>Brayden</Text>
          <Text style={styles.moodText}>{getMoodDescription()}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  floorShadow: {
    position: 'absolute',
    bottom: -25,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    zIndex: 0,
  },
  container: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  head: {
    width: '85%',
    aspectRatio: 0.9,
    position: 'relative',
    zIndex: 2,
  },
  faceBase: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
    overflow: 'hidden',
    backgroundColor: '#FFDBAC',
    alignItems: 'center',
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  faceShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  foreheadHighlight: {
    position: 'absolute',
    width: '40%',
    height: '15%',
    top: '15%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    position: 'absolute',
    top: '30%',
  },
  eyeSocket: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  eyeball: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#555',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIris: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5D8AA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  eyeHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  eyebrow: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 3,
    backgroundColor: '#805B25',
    borderRadius: 3,
  },
  sleepingEye: {
    width: 18,
    height: 3,
    backgroundColor: '#555',
    borderRadius: 2,
  },
  dizzyEyeContainer: {
    width: 18,
    height: 18,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dizzyEyeX1: {
    width: 18,
    height: 3,
    backgroundColor: '#555',
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  dizzyEyeX2: {
    width: 18,
    height: 3,
    backgroundColor: '#555',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  nose: {
    position: 'absolute',
    top: '53%',
    width: 15,
    height: 18,
    backgroundColor: '#E5BA9C',
    borderRadius: 10,
    transform: [{ rotate: '-10deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  nostril: {
    width: 4,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
  },
  mouthContainer: {
    position: 'absolute',
    bottom: '25%',
    width: '40%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutralMouth: {
    width: 25,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#AB4E52',
    borderWidth: 1,
    borderColor: '#943A3E',
  },
  happyMouth: {
    width: 35,
    height: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#782124',
    overflow: 'hidden',
    alignItems: 'center',
  },
  teeth: {
    width: '90%',
    height: 6,
    backgroundColor: 'white',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: 2,
  },
  tongue: {
    width: 18,
    height: 10,
    borderRadius: 9,
    backgroundColor: '#E56B70',
    marginTop: 4,
  },
  sadMouth: {
    width: 35,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#782124',
    overflow: 'hidden',
    alignItems: 'center',
    transform: [{ scaleY: -0.6 }],
  },
  sleepingMouth: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#AB4E52',
    transform: [{ rotate: '-5deg' }],
  },
  dizzyMouth: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#782124',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ear: {
    position: 'absolute',
    width: 15,
    height: 25,
    backgroundColor: '#E5BA9C',
    borderRadius: 10,
    top: '45%',
  },
  leftEar: {
    left: -8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightEar: {
    right: -8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  hairContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: '40%',
    overflow: 'hidden',
    zIndex: -1,
  },
  hair: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  hairHighlight: {
    position: 'absolute',
    top: 10,
    left: '20%',
    width: '30%',
    height: '30%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    transform: [{ rotate: '-20deg' }],
  },
  shirt: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  collar: {
    position: 'absolute',
    top: 5,
    width: '50%',
    height: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  shirtHighlight: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '30%',
    height: '20%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  body: {
    width: '70%',
    aspectRatio: 0.8,
    position: 'relative',
    zIndex: 1,
    marginTop: -40,
  },
  dizzyStarsContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    zIndex: 100,
  },
  dizzyStarsText: {
    fontSize: 36,
    color: 'gold',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginHorizontal: 8,
  },
  sleepZ: {
    position: 'absolute',
    top: 20,
    right: 30,
    zIndex: 100,
  },
  zText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  nameTag: {
    position: 'absolute',
    bottom: -30,
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  moodText: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  cosmeticContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  background: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    borderRadius: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
    zIndex: -1,
  },
  backgroundIcon: {
    opacity: 0.5,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.2,
  },
  effect3DContainer: {
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    opacity: 0.4,
    transform: [{ translateY: 4 }],
  },
  mainLayer: {
    position: 'absolute',
  },
  highlightLayer: {
    position: 'absolute',
    opacity: 0.2,
    transform: [{ scale: 0.95 }],
  },
  glasses3DContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glasses3D: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  glassesShadow: {
    position: 'absolute',
    opacity: 0.3,
  },
  glassesLensContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassesLeftLens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(160, 220, 255, 0.3)',
    marginRight: 6,
  },
  glassesRightLens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(160, 220, 255, 0.3)',
    marginLeft: 6,
  },
  vrHeadsetDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vrLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
    marginHorizontal: 3,
  },
  vrButton: {
    position: 'absolute',
    top: -4,
    right: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF0000',
  },
  sunglassesFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sunglassesLens: {
    width: 15,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginHorizontal: 3,
  },
  sunglassesBridge: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 2,
    backgroundColor: '#222222',
  },
  beanieRibbing: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  beaniePomPom: {
    position: 'absolute',
    top: -8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  graduationCapContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  crownPoint: {
    width: 8,
    height: 12,
    backgroundColor: '#FFD700',
    marginHorizontal: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  crownJewel: {
    position: 'absolute',
    top: 3,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  businessCollar: {
    position: 'absolute',
    top: 5,
    width: '60%',
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  businessButton: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginVertical: 6,
  },
  hoodieHood: {
    position: 'absolute',
    top: -10,
    width: '60%',
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  hoodieStrings: {
    position: 'absolute',
    top: 16,
    width: 16,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  hoodiePocket: {
    position: 'absolute',
    bottom: 8,
    width: '60%',
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  suitLapel: {
    position: 'absolute',
    top: 8,
    width: '50%',
    height: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  suitTie: {
    position: 'absolute',
    top: 20,
    width: 12,
    height: 30,
    backgroundColor: '#990000',
    borderRadius: 2,
  },
  suitButton: {
    position: 'absolute',
    bottom: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headphonesContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  headphonesLeftCup: {
    position: 'absolute',
    left: -10,
    top: 0,
    width: 12,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  headphonesRightCup: {
    position: 'absolute',
    right: -10,
    top: 0,
    width: 12,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  watchContainer: {
    position: 'relative',
  },
  watchStrap: {
    width: 12,
    height: 24,
    backgroundColor: '#444444',
    borderRadius: 3,
  },
  watchFace: {
    position: 'absolute',
    top: 4,
    left: -2,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#999999',
  },
  coffeeMugContainer: {
    position: 'relative',
  },
  coffeeMug: {
    width: 16,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  coffeeMugHandle: {
    position: 'absolute',
    right: -6,
    top: 4,
    width: 8,
    height: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderLeftWidth: 0,
    borderRadius: 4,
  },
  coffeeMugContents: {
    position: 'absolute',
    top: 3,
    left: 2,
    right: 2,
    height: 8,
    backgroundColor: '#663300',
    borderRadius: 2,
  },
  genericItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BraydenAvatar3D; 