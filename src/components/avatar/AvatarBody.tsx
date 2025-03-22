import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarBodyProps {
  size: number;
  avatarState: {
    isDead: boolean;
    isAwake: boolean;
    isDizzy: boolean;
  };
}

const AvatarBody: React.FC<AvatarBodyProps> = ({ size, avatarState }) => {
  const { theme } = useTheme();
  const { isDead, isAwake } = avatarState;
  
  // Calculate sizes
  const bodyWidth = size * 0.45;
  const neckWidth = bodyWidth * 0.25;
  const neckHeight = size * 0.08;
  const torsoHeight = size * 0.35;
  const shoulderWidth = bodyWidth * 1.3;
  const armWidth = size * 0.09;
  const armHeight = size * 0.25;
  const handRadius = armWidth * 0.9;
  
  // Colors
  const skinColor = '#FFDAB9'; // Match skin tone from head
  const shirtColor = '#2C3E50'; // Cool dark blue/gray
  const shirtHighlight = '#3498DB'; // Accent color
  
  // Determine arm angle based on state
  const leftArmRotation = isDead ? '-65deg' : (isAwake ? '15deg' : '10deg');
  const rightArmRotation = isDead ? '65deg' : (isAwake ? '-15deg' : '-10deg');
  
  return (
    <View style={[styles.bodyContainer, { width: size, height: size }]}>
      {/* Neck */}
      <View 
        style={[
          styles.neck,
          {
            width: neckWidth,
            height: neckHeight,
            backgroundColor: skinColor,
            top: size * 0.42,
            borderRadius: neckWidth / 4,
          }
        ]}
      />
      
      {/* Shirt Collar */}
      <View 
        style={[
          styles.collar,
          {
            width: neckWidth * 1.8,
            height: neckHeight * 0.9,
            backgroundColor: shirtColor,
            top: size * 0.455,
            borderTopLeftRadius: neckWidth / 2,
            borderTopRightRadius: neckWidth / 2,
          }
        ]}
      />
      
      {/* Torso / Shirt */}
      <View 
        style={[
          styles.torso,
          {
            width: bodyWidth,
            height: torsoHeight,
            backgroundColor: shirtColor,
            top: size * 0.5,
            borderRadius: bodyWidth / 5,
          }
        ]}
      />
      
      {/* Shirt Design (Cool stripe or detail) */}
      <View 
        style={[
          styles.shirtDesign,
          {
            width: bodyWidth * 0.6,
            height: size * 0.04,
            backgroundColor: shirtHighlight,
            top: size * 0.57,
            left: size / 2 - (bodyWidth * 0.6) / 2,
            borderRadius: 4,
            transform: [{ rotate: '0deg' }],
          }
        ]}
      />
      
      {/* Shoulders */}
      <View 
        style={[
          styles.shoulders,
          {
            width: shoulderWidth,
            height: bodyWidth * 0.25,
            backgroundColor: shirtColor,
            top: size * 0.5,
            borderRadius: bodyWidth / 8,
          }
        ]}
      />
      
      {/* Left Arm */}
      <View
        style={[
          styles.arm,
          styles.leftArm,
          {
            width: armWidth,
            height: armHeight,
            backgroundColor: shirtColor,
            top: size * 0.5,
            left: size / 2 - shoulderWidth / 2 + armWidth / 2,
            borderRadius: armWidth / 2,
            transform: [{ rotate: leftArmRotation }],
          }
        ]}
      />
      
      {/* Left Wrist Detail - like a watch or bracelet */}
      <View
        style={[
          styles.wristDetail,
          {
            width: handRadius * 1.4,
            height: handRadius * 0.4,
            backgroundColor: '#34495E',
            top: isDead ? size * 0.65 : size * 0.58,
            left: isDead ? size / 2 - shoulderWidth / 2 - armWidth : size / 2 - shoulderWidth / 2 - armWidth * 0.5,
            borderRadius: handRadius * 0.2,
            transform: [{ rotate: isDead ? '30deg' : '15deg' }],
          }
        ]}
      />
      
      {/* Left Hand */}
      <View
        style={[
          styles.hand,
          {
            width: handRadius * 2,
            height: handRadius * 2,
            backgroundColor: skinColor,
            top: isDead ? size * 0.69 : size * 0.62,
            left: isDead ? size / 2 - shoulderWidth / 2 - armWidth * 1.2 : size / 2 - shoulderWidth / 2 - armWidth * 0.7,
            borderRadius: handRadius,
          }
        ]}
      />
      
      {/* Right Arm */}
      <View
        style={[
          styles.arm,
          styles.rightArm,
          {
            width: armWidth,
            height: armHeight,
            backgroundColor: shirtColor,
            top: size * 0.5,
            right: size / 2 - shoulderWidth / 2 + armWidth / 2,
            borderRadius: armWidth / 2,
            transform: [{ rotate: rightArmRotation }],
          }
        ]}
      />
      
      {/* Right Hand */}
      <View
        style={[
          styles.hand,
          {
            width: handRadius * 2,
            height: handRadius * 2,
            backgroundColor: skinColor,
            top: isDead ? size * 0.69 : size * 0.62,
            right: isDead ? size / 2 - shoulderWidth / 2 - armWidth * 1.2 : size / 2 - shoulderWidth / 2 - armWidth * 0.7,
            borderRadius: handRadius,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  neck: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  collar: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  torso: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  shirtDesign: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  shoulders: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  arm: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftArm: {
    transformOrigin: 'top left',
  },
  rightArm: {
    transformOrigin: 'top right',
  },
  wristDetail: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  hand: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AvatarBody; 