import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  icon?: string | React.ReactNode;
  animated?: boolean;
  animationDirection?: 'up' | 'down';
}

const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  maxValue = 100, 
  color, 
  icon,
  animated = false,
  animationDirection = 'up'
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;
  
  // Start animation if enabled
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    let arrowAnimation: Animated.CompositeAnimation;
    
    if (animated) {
      // Pulse animation for the progress bar
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      
      // Arrow animation for direction indicator
      arrowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(arrowAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      
      pulseAnimation.start();
      arrowAnimation.start();
    } else {
      pulseAnim.setValue(0);
      arrowAnim.setValue(0);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
      if (arrowAnimation) {
        arrowAnimation.stop();
      }
    };
  }, [animated, pulseAnim, arrowAnim]);
  
  // Calculate percentage and ensure it's between 0 and 1
  const progress = Math.max(0, Math.min(value / maxValue, 1));
  
  // Determine the color based on the value if not provided
  const determineColor = () => {
    if (color) return color;
    
    if (progress < 0.25) return theme.colors.error;
    if (progress < 0.5) return theme.colors.warning || '#FFA000';
    if (progress < 0.75) return theme.colors.tertiary;
    return theme.colors.primary;
  };
  
  // Calculate animated progress value
  const animatedProgress = animated 
    ? pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          progress, 
          animationDirection === 'up' 
            ? Math.min(1, progress + 0.1) // Increase if direction is up
            : Math.max(0, progress - 0.1) // Decrease if direction is down
        ]
      }) 
    : progress;
    
  // Translate animation for arrow
  const arrowTranslate = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, animationDirection === 'up' ? -5 : 5]
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {typeof icon === 'string' ? (
          <MaterialCommunityIcons 
            name={icon} 
            size={20} 
            color={determineColor()} 
            style={styles.icon}
          />
        ) : icon ? (
          <View style={styles.icon}>{icon}</View>
        ) : null}
        
        <Text
          variant="bodyMedium"
          style={[
            styles.label,
            { color: isDarkMode ? '#E0E0E0' : '#212121' }
          ]}
        >
          {label}
        </Text>
        
        {animated && (
          <Animated.View
            style={{
              transform: [{ translateY: arrowTranslate }],
              marginRight: 5,
            }}
          >
            <MaterialCommunityIcons
              name={animationDirection === 'up' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={animationDirection === 'up' ? theme.colors.tertiary : theme.colors.error}
            />
          </Animated.View>
        )}
        
        <Text
          variant="bodyMedium"
          style={[
            styles.value,
            { color: isDarkMode ? '#E0E0E0' : '#212121' }
          ]}
        >
          {Math.round(value)}/{maxValue}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: `${animatedProgress * 100}%`,
              backgroundColor: determineColor(),
              opacity: animated ? pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1]
              }) : 1,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    flex: 1,
    fontWeight: '500',
  },
  value: {
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});

export default StatBar; 