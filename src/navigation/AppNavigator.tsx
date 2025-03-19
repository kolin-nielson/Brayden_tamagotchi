import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { View } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShopScreen from '../screens/ShopScreen';
import WardrobeScreen from '../screens/WardrobeScreen';
import MiniGameScreen, { MiniGameParams } from '../screens/MiniGameScreen';

// Define the types for our navigation
export type RootStackParamList = {
  Main: undefined;
  MiniGame: { gameType: 'codeRacer' | 'bugSquasher' | 'memoryMatch' };
};

export type MainTabParamList = {
  Home: undefined;
  Shop: undefined;
  Wardrobe: undefined;
  Activity: undefined;
  Settings: undefined;
};

// Combine all params
export type AppNavigatorParams = RootStackParamList & MainTabParamList & MiniGameParams;

// Define navigator types
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Create custom header component
const CustomNavigationBar = ({ navigation, back, options }) => {
  const { theme } = useTheme();
  
  return (
    <Appbar.Header mode="center-aligned" elevated>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : null}
      <Appbar.Content title={options.title} />
      {!back && (
        <Appbar.Action 
          icon="cog" 
          onPress={() => navigation.navigate('Settings')} 
        />
      )}
    </Appbar.Header>
  );
};

// Custom tab bar background to ensure full opacity
const TabBarBackground = () => {
  const { theme } = useTheme();
  return (
    <View 
      style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 65,
        backgroundColor: theme.isDarkMode ? '#121212' : '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    />
  );
};

// Main tab navigator
const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      key={theme.isDarkMode ? 'dark-tabs' : 'light-tabs'}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          // Solid background color - no transparency
          backgroundColor: 'transparent', // Let the background component handle color
          borderTopColor: 'transparent', // Hide default border
          borderTopWidth: 0,
          // Increase elevation significantly and ensure opacity
          elevation: 24,
          // Add Android-specific shadow properties
          shadowOpacity: 1,
          shadowRadius: 8,
          shadowColor: '#000000',
          shadowOffset: { height: -1, width: 0 },
          // Make sure height is sufficient
          height: 65,
          paddingBottom: 8,
          // Add opacity properties to ensure it's fully opaque
          opacity: 1,
          // Add a solid background color fallback
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          // Ensure proper z-index
          zIndex: 1000,
          // Add a small top padding
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          paddingBottom: 2,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerStyle: {
          backgroundColor: theme.colors.cardBackground,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Wardrobe" 
        component={WardrobeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hanger" color={color} size={size} />
          ),
          title: "Cosmetics"
        }}
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// The main app navigator with both tab and stack screens
const AppNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.cardBackground,
        },
        headerTintColor: theme.colors.text,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MiniGame" 
        component={MiniGameScreen}
        options={({ route }) => ({
          title: 
            route.params?.gameType === 'codeRacer' ? 'Code Racer' : 
            route.params?.gameType === 'bugSquasher' ? 'Bug Squasher' :
            'Memory Match',
          headerShown: false, // Hide header for immersive gameplay
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 