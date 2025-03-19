import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ActivityType = 'feed' | 'play' | 'work' | 'sleep' | 'wake';

export interface Activity {
  type: ActivityType;
  timestamp: number;
  values?: {
    [key: string]: number;
  };
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (type: ActivityType, values?: { [key: string]: number }) => void;
  clearActivities: () => void;
}

// Default empty array for activities
const defaultActivities: Activity[] = [];

// Create context with default values
const ActivityContext = createContext<ActivityContextType>({
  activities: defaultActivities,
  addActivity: () => {},
  clearActivities: () => {},
});

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);

  // Load saved activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const savedActivities = await AsyncStorage.getItem('braydenActivities');
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities));
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };
    
    loadActivities();
  }, []);

  // Save activities when they change
  useEffect(() => {
    const saveActivities = async () => {
      try {
        // Only keep the last 100 activities to prevent excessive storage
        const activitiesToSave = activities.slice(-100);
        await AsyncStorage.setItem('braydenActivities', JSON.stringify(activitiesToSave));
      } catch (error) {
        console.error('Failed to save activities:', error);
      }
    };
    
    saveActivities();
  }, [activities]);

  const addActivity = (type: ActivityType, values?: { [key: string]: number }) => {
    const newActivity: Activity = {
      type,
      timestamp: Date.now(),
      values,
    };
    
    setActivities(prev => [...prev, newActivity]);
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        clearActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}; 