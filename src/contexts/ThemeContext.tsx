import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  Provider as PaperProvider, 
  MD3DarkTheme, 
  MD3LightTheme 
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Custom colors
const customColors = {
  primary: '#4CAF50',  // green - represents growth and care
  secondary: '#FF9800', // orange - warmth and energy
  tertiary: '#03A9F4',  // blue - relaxation and calmness
  error: '#F44336',     // red for errors
  success: '#8BC34A',   // light green for success
  warning: '#FFC107',   // amber for warnings
};

// Simple custom light theme
const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
    background: '#F5F5F5',
    surface: '#FFFFFF',
    onSurface: '#212121',
    text: '#212121',
    textSecondary: '#757575',
    cardBackground: '#FFFFFF',
    border: '#E0E0E0',
    disabled: '#BDBDBD',
  },
};

// Simple custom dark theme
const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customColors,
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#E0E0E0',
    text: '#E0E0E0',
    textSecondary: '#AAAAAA',
    cardBackground: '#1E1E1E',
    border: '#333333',
    disabled: '#555555',
  },
};

// Navigation themes
const CustomNavigationLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: customColors.primary,
    background: CustomLightTheme.colors.background,
    card: CustomLightTheme.colors.surface,
    text: CustomLightTheme.colors.onSurface,
  },
};

const CustomNavigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: customColors.primary,
    background: CustomDarkTheme.colors.background,
    card: CustomDarkTheme.colors.surface,
    text: CustomDarkTheme.colors.onSurface,
  },
};

// Create the theme context
type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeContextType {
  theme: typeof CustomLightTheme;
  navigationTheme: typeof CustomNavigationLightTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: CustomLightTheme,
  navigationTheme: CustomNavigationLightTheme,
  mode: 'system',
  setMode: () => {},
  isDarkMode: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Load saved theme mode
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('themeMode');
        if (savedMode) {
          setMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme mode:', error);
      }
    };
    
    loadThemeMode();
  }, []);

  // Save theme mode when it changes
  useEffect(() => {
    const saveThemeMode = async () => {
      try {
        await AsyncStorage.setItem('themeMode', mode);
      } catch (error) {
        console.error('Failed to save theme mode:', error);
      }
    };
    
    saveThemeMode();
  }, [mode]);

  // Update dark mode flag based on mode and system preference
  useEffect(() => {
    if (mode === 'system') {
      setIsDarkMode(systemColorScheme === 'dark');
    } else {
      setIsDarkMode(mode === 'dark');
    }
  }, [mode, systemColorScheme]);

  // Set up themes based on dark mode
  const theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;
  const navigationTheme = isDarkMode ? CustomNavigationDarkTheme : CustomNavigationLightTheme;

  return (
    <ThemeContext.Provider value={{ theme, navigationTheme, mode, setMode, isDarkMode }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={navigationTheme}>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 