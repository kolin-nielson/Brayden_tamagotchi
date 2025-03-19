import React from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { BraydenProvider } from './src/contexts/BraydenContext';
import { ActivityProvider } from './src/contexts/ActivityContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings that might be related to third-party libraries
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <BraydenProvider>
          <ActivityProvider>
            <AppNavigator />
          </ActivityProvider>
        </BraydenProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
