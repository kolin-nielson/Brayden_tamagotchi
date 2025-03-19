import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Icon } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Activity, ActivityType } from '../contexts/ActivityContext';
import { useTheme } from '../contexts/ThemeContext';

interface ActivityLogItemProps {
  activity: Activity;
}

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ activity }) => {
  const { theme } = useTheme();
  
  // Format the timestamp
  const formattedTime = format(new Date(activity.timestamp), 'h:mm a');
  const formattedDate = format(new Date(activity.timestamp), 'MMM d');
  
  // Determine icon and text based on activity type
  const getActivityDetails = (type: ActivityType) => {
    switch (type) {
      case 'feed':
        return {
          icon: 'food-apple',
          color: theme.colors.primary,
          text: 'Brayden ate some food',
        };
      case 'play':
        return {
          icon: 'gamepad-variant',
          color: theme.colors.secondary,
          text: 'Brayden played board games',
        };
      case 'work':
        return {
          icon: 'laptop',
          color: theme.colors.tertiary,
          text: 'Brayden did some programming work',
        };
      case 'sleep':
        return {
          icon: 'sleep',
          color: '#6A0DAD', // Purple for sleep
          text: 'Brayden went to sleep',
        };
      case 'wake':
        return {
          icon: 'alarm',
          color: '#FF9800', // Orange for wake
          text: 'Brayden woke up',
        };
      default:
        return {
          icon: 'information',
          color: theme.colors.primary,
          text: 'Unknown activity',
        };
    }
  };
  
  const { icon, color, text } = getActivityDetails(activity.type);
  
  // Additional details for specific activity types
  const getActivityValues = () => {
    if (!activity.values) return null;
    
    switch (activity.type) {
      case 'feed':
        return `Hunger +${activity.values.hunger || 0}`;
      case 'play':
        return `Happiness +${activity.values.happiness || 0}`;
      case 'work':
        return `Earned $${activity.values.money || 0}`;
      default:
        return null;
    }
  };
  
  const activityValue = getActivityValues();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={styles.title}>{text}</Text>
          {activityValue && (
            <Text variant="bodyMedium" style={styles.value}>{activityValue}</Text>
          )}
          <Text variant="bodySmall" style={styles.time}>{formattedTime} · {formattedDate}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
  },
  value: {
    marginTop: 2,
  },
  time: {
    marginTop: 4,
    opacity: 0.6,
  },
});

export default ActivityLogItem; 