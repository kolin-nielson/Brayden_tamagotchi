import React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { BraydenStats } from '../../types/BraydenTypes';

interface AvatarEffectsProps {
  size: number;
  stats: BraydenStats;
  theme: any;
  sleepZAnim: Animated.Value;
}

export const AvatarEffects: React.FC<AvatarEffectsProps> = ({ 
  size, 
  stats, 
  theme,
  sleepZAnim
}) => {
  // Interpolations for sleep Z's
  const sleepZScale = sleepZAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8]
  });
  
  const sleepZOpacity = sleepZAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0]
  });

  return (
    <View style={styles.effectsContainer}>
      {/* Hunger indicator */}
      {stats.hunger < 30 && !stats.isDizzy && stats.isAwake && (
        <View 
          style={[
            styles.hungerIndicator, 
            { top: -size * 0.1, right: -size * 0.05 }
          ]}
        >
          <View style={styles.hungerBubble}>
            <View style={styles.hungerIcon} />
            <View style={styles.hungerDroplet1} />
            <View style={styles.hungerDroplet2} />
          </View>
        </View>
      )}
      
      {/* Energy indicator */}
      {stats.energy < 30 && !stats.isDizzy && stats.isAwake && (
        <View 
          style={[
            styles.energyIndicator, 
            { top: -size * 0.15, left: -size * 0.05 }
          ]}
        >
          <View style={styles.energyBubble}>
            <View style={styles.energyBatteryOutline}>
              <View 
                style={[
                  styles.energyBatteryFill,
                  { height: `${stats.energy}%` }
                ]} 
              />
              <View style={styles.energyBatteryTerminal} />
            </View>
          </View>
        </View>
      )}
      
      {/* Sleep Z's animation */}
      {!stats.isAwake && (
        <Animated.View 
          style={[
            styles.sleepZsContainer,
            { 
              top: -size * 0.2, 
              right: -size * 0.05,
              transform: [{ scale: sleepZScale }],
              opacity: sleepZOpacity
            }
          ]}
        >
          <Text style={styles.sleepZ}>Z</Text>
          <Text style={styles.sleepZ}>Z</Text>
          <Text style={styles.sleepZ}>Z</Text>
        </Animated.View>
      )}
      
      {/* Happiness indicator - hearts */}
      {stats.happiness > 80 && !stats.isDizzy && stats.isAwake && (
        <View 
          style={[
            styles.heartsContainer,
            { top: -size * 0.15 }
          ]}
        >
          <Text style={styles.heart}>❤️</Text>
          <Text style={[styles.heart, styles.heartOffset]}>❤️</Text>
          <Text style={styles.heart}>❤️</Text>
        </View>
      )}
      
      {/* Hygiene indicator - stink lines */}
      {stats.hygiene < 30 && !stats.isDizzy && stats.isAwake && (
        <View 
          style={[
            styles.stinkLinesContainer,
            { top: -size * 0.2, right: -size * 0.1 }
          ]}
        >
          <View style={styles.stinkLine1} />
          <View style={styles.stinkLine2} />
          <View style={styles.stinkLine3} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  effectsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    pointerEvents: 'none',
  },
  hungerIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    zIndex: 30,
  },
  hungerBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hungerIcon: {
    width: 20,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#FF9800',
    position: 'relative',
  },
  hungerDroplet1: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    width: 4,
    height: 7,
    backgroundColor: '#FF9800',
    borderRadius: 4,
    transform: [{ rotate: '15deg' }],
  },
  hungerDroplet2: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    width: 4,
    height: 7,
    backgroundColor: '#FF9800',
    borderRadius: 4,
    transform: [{ rotate: '-15deg' }],
  },
  energyIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    zIndex: 30,
  },
  energyBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  energyBatteryOutline: {
    width: 18,
    height: 24,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  energyBatteryFill: {
    width: '100%',
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  energyBatteryTerminal: {
    position: 'absolute',
    top: -6,
    width: 8,
    height: 4,
    backgroundColor: '#555',
    alignSelf: 'center',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  sleepZsContainer: {
    position: 'absolute',
    zIndex: 30,
  },
  sleepZ: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heartsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    zIndex: 30,
  },
  heart: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  heartOffset: {
    marginTop: -10,
  },
  stinkLinesContainer: {
    position: 'absolute',
    width: 30,
    height: 40,
    zIndex: 30,
  },
  stinkLine1: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: '#4E7A31',
    borderRadius: 2,
    top: 5,
    transform: [{ rotate: '45deg' }],
  },
  stinkLine2: {
    position: 'absolute',
    width: 30,
    height: 3,
    backgroundColor: '#4E7A31',
    borderRadius: 2,
    top: 15,
    transform: [{ rotate: '30deg' }],
  },
  stinkLine3: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: '#4E7A31',
    borderRadius: 2,
    top: 25,
    transform: [{ rotate: '60deg' }],
  },
}); 