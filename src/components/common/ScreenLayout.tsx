import React from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ScreenLayoutProps {
  children: React.ReactNode;
  noSafeArea?: boolean;
  noPadding?: boolean;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ 
  children, 
  noSafeArea = false,
  noPadding = false 
}) => {
  const { theme } = useTheme();
  
  const Container = noSafeArea ? View : SafeAreaView;
  
  return (
    <Container 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.background },
        noPadding && styles.noPadding
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {children}
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPadding: {
    padding: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default ScreenLayout; 