import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Divider, Chip, Searchbar, Banner } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useActivity, ActivityType } from '../contexts/ActivityContext';
import { useTheme } from '../contexts/ThemeContext';
import ActivityLogItem from '../components/ActivityLogItem';

// Types for activity filters
interface Filter {
  type: ActivityType | 'all';
  label: string;
  icon: string;
  color: string;
}

const HistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const { activities } = useActivity();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all');
  
  // Define filters
  const filters: Filter[] = [
    { type: 'all', label: 'All', icon: 'filter-variant', color: theme.colors.primary },
    { type: 'feed', label: 'Food', icon: 'food-apple', color: theme.colors.primary },
    { type: 'play', label: 'Play', icon: 'gamepad-variant', color: theme.colors.secondary },
    { type: 'work', label: 'Work', icon: 'laptop', color: theme.colors.tertiary },
    { type: 'sleep', label: 'Sleep', icon: 'sleep', color: '#6A0DAD' },
    { type: 'wake', label: 'Wake', icon: 'alarm', color: '#FF9800' },
  ];
  
  // Handle search and filtering
  const getFilteredActivities = () => {
    let filtered = [...activities].reverse(); // Show newest first
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === activeFilter);
    }
    
    // Apply search filter (if we had more text data in activities, we would search that too)
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => {
        const typeMatch = activity.type.toLowerCase().includes(lowerQuery);
        return typeMatch;
      });
    }
    
    return filtered;
  };
  
  const filteredActivities = getFilteredActivities();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          <MaterialCommunityIcons name="history" size={24} /> Activity History
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          See all of Brayden's past activities
        </Text>
      </View>
      
      {/* Search bar */}
      <Searchbar
        placeholder="Search activities..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />
      
      {/* Filter chips */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item.type}
          renderItem={({ item }) => (
            <Chip
              selected={activeFilter === item.type}
              onPress={() => setActiveFilter(item.type)}
              style={[
                styles.filterChip,
                activeFilter === item.type && { backgroundColor: item.color + '30' }
              ]}
              textStyle={activeFilter === item.type ? { color: item.color } : undefined}
              icon={() => (
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={16}
                  color={activeFilter === item.type ? item.color : theme.colors.onSurfaceVariant}
                />
              )}
            >
              {item.label}
            </Chip>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsList}
        />
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Activities list */}
      {filteredActivities.length === 0 ? (
        <Banner
          visible={true}
          icon={({ size }) => (
            <MaterialCommunityIcons name="information-outline" size={size} color={theme.colors.primary} />
          )}
          actions={[
            {
              label: 'Clear Filters',
              onPress: () => {
                setActiveFilter('all');
                setSearchQuery('');
              },
            },
          ]}
        >
          No activities found with the current filters.
        </Banner>
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => <ActivityLogItem activity={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  searchBar: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  chipsList: {
    paddingVertical: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  divider: {
    marginVertical: 8,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
});

export default HistoryScreen; 