import React, { useRef } from 'react';
import { StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  icon,
  color,
  style,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const buttonColor = color || theme.colors.primary;
  const disabledColor = theme.dark 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(0, 0, 0, 0.12)';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: disabled ? disabledColor : buttonColor,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {icon && <Animated.View style={styles.icon}>{icon}</Animated.View>}
        <Text
          variant="labelLarge"
          style={[
            styles.label,
            { color: disabled ? theme.colors.onSurfaceDisabled : '#fff' },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 8,
  },
  label: {
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: 8,
  },
});

export default ActionButton; 