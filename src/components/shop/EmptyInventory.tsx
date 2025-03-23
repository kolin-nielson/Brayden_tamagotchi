import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface EmptyInventoryProps {
  message?: string;
}

const EmptyInventory: React.FC<EmptyInventoryProps> = ({ 
  message = "Your inventory is empty. Visit the shop to buy items!" 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="bag-personal-outline" 
        size={60} 
        color={theme.colors.disabled}
      />
      <Text 
        style={[
          styles.message, 
          { color: theme.colors.textSecondary }
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EmptyInventory; 