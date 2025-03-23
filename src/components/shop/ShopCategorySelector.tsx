import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface ShopCategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const ShopCategorySelector: React.FC<ShopCategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { 
            backgroundColor: selectedCategory === null 
              ? theme.colors.primary 
              : theme.colors.surface,
            borderColor: theme.colors.border
          }
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <MaterialCommunityIcons
          name="view-grid"
          size={22}
          color={selectedCategory === null ? 'white' : theme.colors.text}
        />
        <Text
          style={[
            styles.categoryText,
            {
              color: selectedCategory === null ? 'white' : theme.colors.text,
            },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category.id 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border
            },
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <MaterialCommunityIcons
            name={category.icon}
            size={22}
            color={selectedCategory === category.id ? 'white' : theme.colors.text}
          />
          <Text
            style={[
              styles.categoryText,
              {
                color: selectedCategory === category.id ? 'white' : theme.colors.text,
              },
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    minWidth: 80,
  },
  categoryText: {
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default ShopCategorySelector; 