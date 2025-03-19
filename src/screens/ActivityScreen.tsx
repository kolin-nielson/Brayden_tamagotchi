import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useActivity } from '../contexts/ActivityContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBrayden } from '../contexts/BraydenContext';
import { format } from 'date-fns';
import { ActivityIndicator } from 'react-native-paper';

// Get activity icon and color
const getActivityDetails = (type: string) => {
  switch (type) {
    case 'feed':
      return { icon: 'food-apple', color: '#FF9500', label: 'Fed Brayden' };
    case 'play':
      return { icon: 'gamepad-variant', color: '#FF2D55', label: 'Played with Brayden' };
    case 'work':
      return { icon: 'laptop', color: '#5AC8FA', label: 'Brayden worked' };
    case 'sleep':
      return { icon: 'power-sleep', color: '#8A2BE2', label: 'Brayden went to sleep' };
    case 'wake':
      return { icon: 'power', color: '#4CD964', label: 'Brayden woke up' };
    case 'minigame':
      return { icon: 'gamepad-square', color: '#FF3B30', label: 'Played mini-game' };
    case 'purchase':
      return { icon: 'shopping', color: '#007AFF', label: 'Made a purchase' };
    case 'levelup':
      return { icon: 'star', color: '#FFCC00', label: 'Level Up!' };
    default:
      return { icon: 'information', color: '#8E8E93', label: 'Activity' };
  }
};

// Format timestamp to readable date
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Define the type for activity items
interface ActivityItem {
  id: string;
  type: string;
  timestamp: number;
  data?: Record<string, any>;
}

// Add model for money-making activities
interface MoneyMakingActivity {
  id: string;
  title: string;
  description: string;
  reward: number;
  energyCost: number;
  timeCost: number; // in minutes
  icon: string;
  color: string;
  available: boolean;
  cooldown?: number; // in minutes
  lastPerformed?: number;
  level?: number; // minimum level required
}

// Define money-making activities
const MONEY_ACTIVITIES: MoneyMakingActivity[] = [
  {
    id: 'freelance_coding',
    title: 'Freelance Coding',
    description: 'Work on a coding project for a client and earn money.',
    reward: 50,
    energyCost: 20,
    timeCost: 30,
    icon: 'laptop',
    color: '#3498db',
    available: true,
    cooldown: 60, // 1 hour
  },
  {
    id: 'debug_website',
    title: 'Debug Website',
    description: 'Help fix bugs on a website for quick cash.',
    reward: 25,
    energyCost: 10,
    timeCost: 15,
    icon: 'bug',
    color: '#e74c3c',
    available: true,
    cooldown: 30, // 30 minutes
  },
  {
    id: 'tech_tutorial',
    title: 'Create Tutorial',
    description: 'Create a tech tutorial and earn money through views.',
    reward: 40,
    energyCost: 15,
    timeCost: 25,
    icon: 'book-open-page-variant',
    color: '#9b59b6',
    available: true,
    cooldown: 120, // 2 hours
  },
  {
    id: 'stock_investment',
    title: 'Stock Investment',
    description: 'Invest in tech stocks with a chance for high returns.',
    reward: 100,
    energyCost: 5,
    timeCost: 5,
    icon: 'chart-line',
    color: '#2ecc71',
    available: true,
    cooldown: 240, // 4 hours
    level: 3, // only available at level 3+
  },
  {
    id: 'code_competition',
    title: 'Coding Competition',
    description: 'Enter a coding competition with a cash prize.',
    reward: 75,
    energyCost: 30,
    timeCost: 45,
    icon: 'trophy',
    color: '#f39c12',
    available: true,
    cooldown: 360, // 6 hours
    level: 5, // only available at level 5+
  },
  {
    id: 'app_development',
    title: 'App Development',
    description: 'Develop a small app and sell it on the app store.',
    reward: 150,
    energyCost: 40,
    timeCost: 60,
    icon: 'cellphone',
    color: '#1abc9c',
    available: true,
    cooldown: 480, // 8 hours
    level: 8, // only available at level 8+
  }
];

const ActivityScreen = () => {
  const { theme } = useTheme();
  const { activities } = useActivity();
  const { stats, collectibles, workBrayden, gainExperience, activeCollectibles, earnMoney } = useBrayden();
  
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moneyActivities, setMoneyActivities] = useState<MoneyMakingActivity[]>([]);
  
  // Filter options
  const [filterType, setFilterType] = useState<string | null>(null);
  const filteredActivities = filterType 
    ? activities.filter(activity => activity.type === filterType)
    : activities;
  
  // Update money activities based on level and cooldowns
  useEffect(() => {
    // Filter activities based on level requirement and update cooldowns
    const now = Date.now();
    const updatedActivities = MONEY_ACTIVITIES.map(activity => {
      // Check level requirement
      const levelAvailable = !activity.level || stats.level >= activity.level;
      
      // Check cooldown if activity was performed before
      let cooldownActive = false;
      if (activity.lastPerformed && activity.cooldown) {
        const timeSinceLastPerformed = (now - activity.lastPerformed) / (1000 * 60); // in minutes
        cooldownActive = timeSinceLastPerformed < activity.cooldown;
      }
      
      return {
        ...activity,
        available: levelAvailable && !cooldownActive
      };
    });
    
    setMoneyActivities(updatedActivities);
  }, [stats.level, activityHistory]);
  
  // Simulate loading activity history
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // Example history items
      const history = [
        {
          id: '1',
          type: 'work',
          timestamp: Date.now() - 3600000,
          changes: {
            money: +30,
            energy: -15,
            happiness: -5,
          },
        },
        {
          id: '2',
          type: 'play',
          timestamp: Date.now() - 7200000,
          changes: {
            money: -10,
            energy: -10,
            happiness: +20,
          },
        },
        {
          id: '3',
          type: 'feed',
          timestamp: Date.now() - 10800000,
          changes: {
            hunger: +30,
            money: -5,
          },
        },
      ];
      
      setActivityHistory(history);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Level progress display
  const getLevelProgress = () => {
    const xpForNextLevel = stats.level * 100;
    return (stats.experience / xpForNextLevel) * 100;
  };
  
  // Handle activity selection
  const handleActivitySelected = (activity: MoneyMakingActivity) => {
    // Check if player can afford energy cost
    if (stats.energy < activity.energyCost) {
      alert(`Not enough energy! This requires ${activity.energyCost} energy.`);
      return;
    }
    
    // Check if activity is available
    if (!activity.available) {
      if (activity.level && stats.level < activity.level) {
        alert(`You need to be level ${activity.level} to unlock this activity.`);
      } else {
        alert('This activity is on cooldown. Try again later.');
      }
      return;
    }
    
    // Perform the activity and earn money
    const updatedActivity = {
      ...activity,
      lastPerformed: Date.now(),
      available: false
    };
    
    // Calculate happiness cost based on activity type
    const happinessCost = activity.id.includes('competition') ? 15 : 
                         activity.id.includes('freelance') ? 10 : 
                         activity.id.includes('debug') ? 5 : 
                         2; // Default minor happiness cost
    
    // Use the earnMoney function from context
    const result = earnMoney(activity.reward, activity.energyCost, happinessCost);
    
    // Add to activity history
    const newHistoryItem = {
      id: Date.now().toString(),
      type: 'money_activity',
      activityId: activity.id,
      timestamp: Date.now(),
      changes: {
        money: +activity.reward,
        energy: -activity.energyCost,
        happiness: -happinessCost
      },
    };
    
    setActivityHistory([newHistoryItem, ...activityHistory]);
    
    // Mark activity as performed and on cooldown
    setMoneyActivities(prev => 
      prev.map(act => act.id === activity.id ? updatedActivity : act)
    );
    
    alert(`You earned $${activity.reward} from ${activity.title}!`);
  };
  
  // Render money making activity item
  const renderMoneyActivity = (activity: MoneyMakingActivity) => {
    const isLocked = activity.level && stats.level < activity.level;
    
    return (
      <TouchableOpacity
        style={[
          styles.moneyActivityItem,
          {
            backgroundColor: isLocked ? 'rgba(0,0,0,0.1)' : `${activity.color}20`,
            borderColor: activity.color,
            opacity: !activity.available ? 0.6 : 1
          }
        ]}
        onPress={() => handleActivitySelected(activity)}
        disabled={!activity.available || isLocked}
      >
        <View style={[styles.activityIconContainer, { backgroundColor: activity.color }]}>
          <MaterialCommunityIcons name={activity.icon as any} size={24} color="white" />
        </View>
        
        <View style={styles.activityContent}>
          <Text style={[styles.activityTitle, { color: theme.colors.onBackground }]}>
            {activity.title}
          </Text>
          
          <Text style={[styles.activityDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
            {activity.description}
          </Text>
          
          <View style={styles.activityDetails}>
            <View style={styles.activityDetail}>
              <MaterialCommunityIcons name="cash-multiple" size={16} color={theme.colors.success} />
              <Text style={[styles.detailText, { color: theme.colors.success }]}>
                +${activity.reward}
              </Text>
            </View>
            
            <View style={styles.activityDetail}>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                -{activity.energyCost}
              </Text>
            </View>
            
            <View style={styles.activityDetail}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                {activity.timeCost}m
              </Text>
            </View>
          </View>
          
          {isLocked && (
            <View style={styles.lockedBadge}>
              <MaterialCommunityIcons name="lock" size={12} color="white" />
              <Text style={styles.lockedText}>Lvl {activity.level}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.statsOverview}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: theme.colors.onSurface }]}>Level:</Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.level}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: theme.colors.onSurface }]}>XP:</Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.experience} / {stats.level * 100}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: theme.colors.onSurface }]}>Money:</Text>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>${stats.money}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Available Activities
        </Text>
        
        <ScrollView 
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          style={styles.activitiesScrollView}
          contentContainerStyle={styles.activitiesContainer}
        >
          {moneyActivities.map((activity) => (
            <React.Fragment key={activity.id}>
              {renderMoneyActivity(activity)}
            </React.Fragment>
          ))}
        </ScrollView>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 24 }]}>
          Activity History
        </Text>
      </View>
    </View>
  );
  
  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  // Get activity display name
  const getActivityDisplayName = (type: string, item: any) => {
    switch (type) {
      case 'work': return 'Work';
      case 'play': return 'Play';
      case 'feed': return 'Feed';
      case 'money_activity':
        // Use the specific activity's ID
        const activity = MONEY_ACTIVITIES.find(a => a.id === item.activityId);
        return activity ? activity.title : 'Money Activity';
      default: return 'Activity';
    }
  };
  
  // Get activity icon
  const getActivityIcon = (type: string, item: any) => {
    switch (type) {
      case 'work': return 'briefcase';
      case 'play': return 'gamepad-variant';
      case 'feed': return 'food-apple';
      case 'money_activity':
        // Use the specific activity's ID
        const activity = MONEY_ACTIVITIES.find(a => a.id === item.activityId);
        return activity ? activity.icon : 'cash';
      default: return 'calendar';
    }
  };
  
  // Get activity background color
  const getActivityColor = (type: string, item: any) => {
    switch (type) {
      case 'work': return theme.colors.primary;
      case 'play': return theme.colors.tertiary;
      case 'feed': return theme.colors.secondary;
      case 'money_activity':
        // Use the specific activity's ID
        const activity = MONEY_ACTIVITIES.find(a => a.id === item.activityId);
        return activity ? activity.color : theme.colors.success;
      default: return theme.colors.primary;
    }
  };
  
  // Render history item
  const renderHistoryItem = ({ item }: { item: any }) => {
    const { type, timestamp, changes } = item;
    
    return (
      <View style={[styles.activityItem, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: getActivityColor(type, item) }]}>
          <MaterialCommunityIcons name={getActivityIcon(type, item)} size={24} color="white" />
        </View>
        
        <View style={styles.activityContent}>
          <Text style={[styles.activityLabel, { color: theme.colors.text }]}>
            {getActivityDisplayName(type, item)}
          </Text>
          
          <View style={styles.statsChanges}>
            {changes.money !== undefined && (
              <Text
                style={[
                  styles.statChange,
                  { color: changes.money >= 0 ? theme.colors.success : theme.colors.error }
                ]}
              >
                ${changes.money >= 0 ? '+' : ''}{changes.money}
              </Text>
            )}
            
            {changes.energy !== undefined && (
              <Text
                style={[
                  styles.statChange,
                  { color: changes.energy >= 0 ? theme.colors.secondary : theme.colors.error }
                ]}
              >
                Energy: {changes.energy >= 0 ? '+' : ''}{changes.energy}
              </Text>
            )}
            
            {changes.happiness !== undefined && (
              <Text
                style={[
                  styles.statChange,
                  { color: changes.happiness >= 0 ? theme.colors.tertiary : theme.colors.error }
                ]}
              >
                Happiness: {changes.happiness >= 0 ? '+' : ''}{changes.happiness}
              </Text>
            )}
            
            {changes.hunger !== undefined && (
              <Text
                style={[
                  styles.statChange,
                  { color: changes.hunger >= 0 ? theme.colors.success : theme.colors.error }
                ]}
              >
                Hunger: {changes.hunger >= 0 ? '+' : ''}{changes.hunger}
              </Text>
            )}
          </View>
          
          <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>
            {formatTime(timestamp)}
          </Text>
        </View>
      </View>
    );
  };
  
  // If loading
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  // If no history
  if (activityHistory.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="calendar-blank" size={64} color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No activity history yet.
          </Text>
        </View>
      </View>
    );
  }
  
  // With history
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={activityHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  statsOverview: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(100,100,100,0.1)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelBarContainer: {
    height: 20,
    backgroundColor: 'rgba(100,100,100,0.2)',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  levelBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  levelBarText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    top: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  streakText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsChanges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statChange: {
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Money activities styles
  activitiesScrollView: {
    marginBottom: 10,
  },
  activitiesContainer: {
    paddingBottom: 10,
  },
  moneyActivityItem: {
    flexDirection: 'row',
    padding: 12,
    marginRight: 12,
    borderRadius: 10,
    width: 250,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  lockedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: 'bold',
  },
});

export default ActivityScreen; 