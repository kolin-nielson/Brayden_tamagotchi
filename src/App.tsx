import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './contexts/AppContext';
import { BraydenProvider } from './contexts/BraydenContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ShopProvider } from './contexts/ShopContext';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <AppProvider>
              <BraydenProvider>
                <ShopProvider>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </ShopProvider>
              </BraydenProvider>
            </AppProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
} 