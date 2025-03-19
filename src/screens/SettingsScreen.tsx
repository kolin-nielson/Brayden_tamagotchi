import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Text, Divider, Button, Card, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useBrayden } from '../contexts/BraydenContext';
import { useActivity } from '../contexts/ActivityContext';

const SettingsScreen: React.FC = () => {
  const { theme, mode, setMode, isDarkMode } = useTheme();
  const { resetBrayden } = useBrayden();
  const { clearActivities } = useActivity();
  
  // Handle theme mode change
  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
  };
  
  // Handle reset confirmation
  const confirmReset = () => {
    Alert.alert(
      'Reset Brayden',
      'Are you sure you want to reset Brayden? This will clear all progress and start fresh.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetBrayden();
            clearActivities();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App info section */}
        <Card style={[styles.headerCard, { backgroundColor: theme.colors.elevation.level2 }]}>
          <Card.Content style={styles.headerContent}>
            <View>
              <Text variant="headlineMedium" style={styles.appName}>
                Brayden Simulator
              </Text>
              <Text variant="bodyMedium" style={styles.appVersion}>
                Version 1.0.0
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="account" 
              size={40} 
              color={theme.colors.primary} 
            />
          </Card.Content>
        </Card>
        
        {/* Appearance settings */}
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          
          <List.Item
            title="Dark Mode"
            description="Toggle between light and dark themes"
            left={(props) => (
              <List.Icon
                {...props}
                icon={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <Switch value={isDarkMode} onValueChange={() => handleThemeChange(isDarkMode ? 'light' : 'dark')} />}
          />
          
          <List.Item
            title="Use System Theme"
            description="Follow your device's theme settings"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />}
            right={(props) => <Switch value={mode === 'system'} onValueChange={(value) => handleThemeChange(value ? 'system' : (isDarkMode ? 'dark' : 'light'))} />}
          />
        </List.Section>
        
        <Divider />
        
        {/* Game settings */}
        <List.Section>
          <List.Subheader>Game Settings</List.Subheader>
          
          <List.Item
            title="Activity History"
            description="View and manage Brayden's activity log"
            left={(props) => <List.Icon {...props} icon="history" color={theme.colors.primary} />}
          />
          
          <List.Item
            title="Notifications"
            description="Customize in-game notifications"
            left={(props) => <List.Icon {...props} icon="bell-outline" color={theme.colors.primary} />}
          />
        </List.Section>
        
        <Divider />
        
        {/* About section */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="How to Play"
            description="Learn how to take care of Brayden"
            left={(props) => <List.Icon {...props} icon="help-circle" color={theme.colors.primary} />}
          />
          
          <List.Item
            title="About Brayden"
            description="A young programmer who loves board games"
            left={(props) => <List.Icon {...props} icon="information" color={theme.colors.primary} />}
          />
        </List.Section>
        
        <Divider />
        
        {/* Data management */}
        <List.Section>
          <List.Subheader>Data Management</List.Subheader>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained-tonal"
              icon="restart"
              onPress={confirmReset}
              style={styles.dangerButton}
              contentStyle={styles.buttonContent}
              buttonColor={theme.colors.errorContainer}
              textColor={theme.colors.error}
            >
              Reset Brayden
            </Button>
          </View>
          
          <Text variant="bodySmall" style={styles.disclaimer}>
            Resetting will delete all data and start over with a fresh version of Brayden.
          </Text>
        </List.Section>
        
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Made with <MaterialCommunityIcons name="heart" size={12} color={theme.colors.error} /> by Kolin
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontWeight: 'bold',
  },
  appVersion: {
    opacity: 0.7,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dangerButton: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  disclaimer: {
    paddingHorizontal: 16,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.7,
  },
});

export default SettingsScreen; 