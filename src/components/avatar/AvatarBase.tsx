import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BraydenStats } from '../../types/BraydenTypes';

interface AvatarBaseProps {
  size: number;
  stats: BraydenStats;
  theme: any;
  breatheAnim: Animated.Value;
  pulseAnim: Animated.Value;
  children?: React.ReactNode;
}

export const AvatarBase: React.FC<AvatarBaseProps> = ({ 
  size, 
  stats, 
  theme,
  breatheAnim,
  pulseAnim,
  children
}) => {
  // Interpolations for animations
  const translateY = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5]
  });

  return (
    <View style={styles.container}>
      {/* Floor shadow for 3D effect */}
      <Animated.View
        style={[
          styles.floorShadow,
          {
            width: size * 0.7,
            transform: [
              { scaleX: breatheAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05]
              })},
              { scaleY: breatheAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95]
              })}
            ]
          }
        ]}
      />
      
      {/* Main avatar container with floating animation */}
      <Animated.View
        style={[
          styles.avatarBaseContainer,
          {
            transform: [
              { translateY }
            ]
          }
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  floorShadow: {
    position: 'absolute',
    bottom: -10,
    height: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 0,
  },
  avatarBaseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
}); 