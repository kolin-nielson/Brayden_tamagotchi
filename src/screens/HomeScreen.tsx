import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Easing, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text, Surface, Badge, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBrayden } from '../contexts/BraydenContext';
import { useActivity, ActivityType } from '../contexts/ActivityContext';
import { useTheme } from '../contexts/ThemeContext';
import BraydenAvatar3D from '../components/BraydenAvatar3D';
import StatBar from '../components/StatBar';
import ActionButton from '../components/ActionButton';
import { getBoostDescription, getBoostMultiplier } from '../utils/braydenUtils';
import { UpgradeEffectType } from '../data/upgrades';

type RootStackParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
  MiniGame: { gameType: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { stats, feedBrayden, playWithBrayden, workBrayden, resetBrayden, toggleSleep, fastForwardTime, isFastForwarding, achievements, currentEvent, completeEvent, playMiniGame, reviveBrayden, triggerRandomEvent, upgrades } = useBrayden();
  const { addActivity } = useActivity();
  
  // Animation for fast-forward effect
  const clockRotation = useRef(new Animated.Value(0)).current;
  
  // Modal states
  const [showAchievements, setShowAchievements] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  
  // Fast-forward animation effect
  useEffect(() => {
    let clockAnimation: Animated.CompositeAnimation;
    
    if (isFastForwarding) {
      clockAnimation = Animated.loop(
        Animated.timing(clockRotation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      clockAnimation.start();
    } else {
      clockRotation.setValue(0);
    }
    
    return () => {
      if (clockAnimation) {
        clockAnimation.stop();
      }
    };
  }, [isFastForwarding, clockRotation]);
  
  // Check sleep state changes
  useEffect(() => {
    let previousIsAwake = stats.isAwake;
    
    return () => {
      if (previousIsAwake !== stats.isAwake) {
        addActivity(stats.isAwake ? 'wake' : 'sleep');
        previousIsAwake = stats.isAwake;
      }
    };
  }, [stats.isAwake, addActivity]);
  
  // Handle feeding Brayden
  const handleFeed = () => {
    feedBrayden();
    addActivity('feed', { hunger: 20 });
  };
  
  // Handle playing with Brayden
  const handlePlay = () => {
    playWithBrayden();
    addActivity('play', { happiness: 15, energy: -10 });
  };
  
  // Handle making Brayden work
  const handleWork = () => {
    workBrayden();
    addActivity('work', { money: 20, energy: -15, happiness: -5 });
  };
  
  // Get status message based on Brayden's state
  const getStatusMessage = () => {
    if (stats.isDead) {
      return "Brayden has died! Revive him to continue playing.";
    } else if (stats.isDizzy) {
      return "Brayden feels dizzy!";
    } else if (!stats.isAwake) {
      return isFastForwarding ? "Brayden is in deep sleep (time accelerated)" : "Brayden is sleeping...";
    } else if (stats.health < 30) {
      return "Brayden is critically ill!";
    } else if (stats.energy < 20) {
      return "Brayden is exhausted!";
    } else if (stats.hunger < 20) {
      return "Brayden is starving!";
    } else if (stats.happiness < 20) {
      return "Brayden is very unhappy!";
    } else if (stats.health < 50) {
      return "Brayden isn't feeling well.";
    } else if (stats.energy < 40) {
      return "Brayden is tired.";
    } else if (stats.hunger < 40) {
      return "Brayden is hungry.";
    } else if (stats.happiness < 40) {
      return "Brayden is sad.";
    } else {
      return "Brayden is doing well!";
    }
  };

  // Show level and XP progress
  const getLevelProgress = () => {
    const xpForNextLevel = stats.level * 100;
    return (stats.experience / xpForNextLevel) * 100;
  };

  // Handle random event choices
  const handleEventChoice = (choiceIndex: number) => {
    completeEvent(choiceIndex);
  };
  
  // Handle mini-game selection
  const handleMiniGameSelect = (gameType: string) => {
    // Navigate directly to the mini-game screen
    navigation.navigate('MiniGame', { gameType });
  };

  // Get active upgrade bonuses to display
  const getActiveBoosts = () => {
    const boostTypes: UpgradeEffectType[] = [
      'money_multiplier', 
      'xp_multiplier', 
      'energy_efficiency', 
      'happiness_gain',
      'hunger_efficiency'
    ];
    
    return boostTypes.filter(type => {
      const multiplier = getBoostMultiplier(type, stats);
      return multiplier > 1; // Only show if there's an active boost
    });
  };

  // Format boost type name for display
  const formatBoostName = (boostType: UpgradeEffectType): string => {
    switch (boostType) {
      case 'money_multiplier': return 'Money Gain';
      case 'xp_multiplier': return 'XP Gain';
      case 'energy_efficiency': return 'Energy Efficiency';
      case 'happiness_gain': return 'Happiness Gain';
      case 'hunger_efficiency': return 'Hunger Restoration';
      case 'health_regeneration': return 'Health Regen';
      default: return boostType.replace('_', ' ');
    }
  };

  // Render Achievement Modal
  const renderAchievementsModal = () => {
    return (
      <Modal
        visible={showAchievements}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAchievements(false)}
      >
        <View style={styles.modalContainer}>
          <Surface style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>
                Achievements
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowAchievements(false)}
              />
            </View>
            
            <Text style={[styles.modalSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Unlock these by completing various activities
            </Text>

            <FlatList
              data={achievements}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Surface 
                  style={[
                    styles.achievementItem, 
                    { 
                      backgroundColor: item.isUnlocked 
                        ? theme.colors.surface 
                        : theme.colors.surfaceVariant,
                      borderLeftColor: item.isUnlocked 
                        ? theme.colors.primary 
                        : 'transparent',
                    }
                  ]}
                >
                  <View style={[
                    styles.achievementIcon,
                    {
                      backgroundColor: item.isUnlocked 
                        ? theme.colors.primaryContainer 
                        : theme.colors.surfaceVariant,
                    }
                  ]}>
                    <MaterialCommunityIcons 
                      name={item.icon as any} 
                      size={24} 
                      color={item.isUnlocked ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                    />
                  </View>
                  
                  <View style={styles.achievementText}>
                    <Text style={[
                      styles.achievementTitle,
                      { 
                        color: item.isUnlocked 
                          ? theme.colors.onSurface 
                          : theme.colors.onSurfaceVariant,
                        opacity: item.isUnlocked ? 1 : 0.7,
                      }
                    ]}>
                      {item.title}
                    </Text>
                    
                    <Text style={[
                      styles.achievementDesc,
                      { 
                        color: item.isUnlocked 
                          ? theme.colors.onSurfaceVariant 
                          : theme.colors.onSurfaceVariant,
                        opacity: item.isUnlocked ? 0.8 : 0.5,
                      }
                    ]}>
                      {item.description}
                    </Text>
                  </View>
                  
                  {item.isUnlocked ? (
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={24} 
                      color={theme.colors.primary} 
                      style={styles.achievementStatus}
                    />
                  ) : (
                    <MaterialCommunityIcons 
                      name="lock" 
                      size={24} 
                      color={theme.colors.onSurfaceVariant} 
                      style={styles.achievementStatus}
                    />
                  )}
                </Surface>
              )}
              contentContainerStyle={styles.achievementsList}
            />
          </Surface>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Status card */}
        <Surface style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={styles.statusText}>
            {getStatusMessage()}
          </Text>
        </Surface>
        
        {/* Avatar and Sleep Toggle */}
        <View style={styles.avatarContainer}>
          {/* Sleep/Wake Toggle Button */}
          <IconButton
            icon={stats.isAwake ? "power-sleep" : "power"}
            iconColor={theme.colors.onPrimary}
            style={[styles.sleepToggle, { backgroundColor: theme.colors.primary }]}
            size={24}
            onPress={toggleSleep}
          />
          
          {/* Fast Forward Button - only visible when sleeping */}
          {!stats.isAwake && (
            <IconButton
              icon={isFastForwarding ? "pause" : "fast-forward"}
              iconColor={theme.colors.onPrimary}
              style={[styles.fastForwardToggle, { 
                backgroundColor: isFastForwarding ? theme.colors.error : theme.colors.secondary 
              }]}
              size={24}
              onPress={fastForwardTime}
            />
          )}
          
          {/* Fast-forward animation indicator */}
          {isFastForwarding && (
            <Animated.View
              style={[
                styles.fastForwardIndicator,
                {
                  transform: [
                    {
                      rotate: clockRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ]
                }
              ]}
            >
              <MaterialCommunityIcons 
                name="clock-fast" 
                size={30} 
                color={theme.colors.primary} 
              />
            </Animated.View>
          )}
          
          {/* Use 3D Avatar instead of the 2D one */}
          <BraydenAvatar3D size={220} />
          
          {/* Dead indicator overlay */}
          {stats.isDead && (
            <View style={styles.deadOverlay}>
              <MaterialCommunityIcons 
                name="emoticon-dead-outline" 
                size={60} 
                color="#ff0000" 
              />
              <Text style={styles.deadText}>BRAYDEN DIED!</Text>
              <Button 
                mode="contained" 
                style={styles.reviveButton} 
                onPress={() => {
                  // Check if player has enough money
                  if (stats.money >= 100) {
                    // Use the destructured reviveBrayden function
                    reviveBrayden();
                  } else {
                    Alert.alert("Not enough money", "You need 100 money to revive Brayden. Earn more money first.");
                  }
                }}
              >
                Revive ($100)
              </Button>
            </View>
          )}
          
          {/* Sleep badge indicator */}
          {!stats.isAwake && (
            <Badge
              size={24}
              style={[styles.sleepBadge, { 
                backgroundColor: isFastForwarding ? theme.colors.secondary : theme.colors.primary 
              }]}
            >
              ZZZ
            </Badge>
          )}
          
          {/* Dizzy badge indicator */}
          {stats.isDizzy && (
            <Badge
              size={24}
              style={[styles.dizzyBadge, { backgroundColor: theme.colors.error }]}
            >
              !
            </Badge>
          )}
        </View>
        
        {/* Stats section */}
        <Surface style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Stats
          </Text>
          
          <StatBar
            label="Health"
            value={stats.health}
            color={
              stats.health < 20 ? '#ff0000' : 
              stats.health < 50 ? '#ff9900' : 
              '#00cc44'
            }
            icon="heart-pulse"
            animated={false}
            animationDirection={undefined}
          />
          
          <StatBar
            label="Hunger"
            value={stats.hunger}
            color={stats.hunger < 20 ? theme.colors.error : theme.colors.primary}
            icon="food-apple"
            animated={isFastForwarding && !stats.isAwake}
            animationDirection="down"
          />
          
          <StatBar
            label="Happiness"
            value={stats.happiness}
            color={stats.happiness < 20 ? theme.colors.error : theme.colors.tertiary}
            icon="emoticon-happy"
            animated={isFastForwarding && !stats.isAwake}
            animationDirection="down"
          />
          
          <StatBar
            label="Energy"
            value={stats.energy}
            color={stats.energy < 20 ? theme.colors.error : theme.colors.secondary}
            icon="lightning-bolt"
            animated={isFastForwarding && !stats.isAwake}
            animationDirection="up"
          />
          
          {/* Money display */}
          <View style={styles.moneyContainer}>
            <View style={styles.moneyIconContainer}>
              <MaterialCommunityIcons 
                name="cash-multiple" 
                size={24} 
                color={theme.colors.success} 
              />
            </View>
            <Text style={[styles.moneyText, { color: theme.colors.onBackground }]}>
              ${stats.money}
            </Text>
          </View>
          
          {/* Experience display */}
          <View style={styles.experienceContainer}>
            <Text style={[styles.experienceText, { color: theme.colors.onBackground }]}>
              Level {stats.level} - XP: {stats.experience}/{stats.level * 100}
            </Text>
            <View style={styles.experienceBar}>
              <View 
                style={[
                  styles.experienceFill, 
                  { 
                    width: `${getLevelProgress()}%`,
                    backgroundColor: theme.colors.primary 
                  }
                ]} 
              />
            </View>
          </View>
        </Surface>
        
        {/* Active Boosts */}
        <Surface style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="arrow-up-bold-circle" size={24} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>Active Boosts</Text>
          </View>
          
          {getActiveBoosts().length > 0 ? (
            <View style={styles.boostsList}>
              {getActiveBoosts().map((boostType) => (
                <View key={boostType} style={styles.boostItem}>
                  <Text style={[styles.boostName, { color: theme.colors.onSurface }]}>
                    {formatBoostName(boostType)}:
                  </Text>
                  <Text style={[styles.boostValue, { color: theme.colors.primary }]}>
                    {getBoostDescription(boostType, stats)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.noBoosts, { color: theme.colors.onSurfaceVariant }]}>
              No active boosts. Buy upgrades to enhance your abilities!
            </Text>
          )}
        </Surface>
        
        {/* Actions section */}
        <Surface style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Actions
          </Text>
          
          <View style={styles.buttonsContainer}>
            <ActionButton
              label="Feed"
              onPress={handleFeed}
              icon={<MaterialCommunityIcons name="food-apple" size={20} color="#fff" />}
              color={theme.colors.primary}
              disabled={!stats.isAwake || stats.money < 5}
            />
            
            <ActionButton
              label="Play Games"
              onPress={handlePlay}
              icon={<MaterialCommunityIcons name="gamepad-variant" size={20} color="#fff" />}
              color={theme.colors.secondary}
              disabled={!stats.isAwake || stats.energy < 10}
            />
            
            <ActionButton
              label="Code"
              onPress={handleWork}
              icon={<MaterialCommunityIcons name="laptop" size={20} color="#fff" />}
              color={theme.colors.tertiary}
              disabled={!stats.isAwake || stats.energy < 15}
            />

            <ActionButton
              label="Achievements"
              onPress={() => setShowAchievements(true)}
              icon={<MaterialCommunityIcons name="trophy" size={20} color="#fff" />}
              color={theme.colors.success}
              disabled={stats.isDead}
            />
          </View>
        </Surface>
        
        {/* Mini Games section */}
        <Surface style={[styles.miniGamesCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Mini Games
          </Text>
          
          <Text style={styles.miniGamesDesc}>Play fun mini games to earn rewards!</Text>
          
          <View style={styles.miniGamesGrid}>
            <TouchableOpacity 
              style={[styles.miniGameItem, { backgroundColor: theme.colors.primaryContainer }]}
              onPress={() => handleMiniGameSelect('codeRacer')}
              disabled={!stats.isAwake || stats.energy < 5}
            >
              <MaterialCommunityIcons name="keyboard" size={28} color={theme.colors.primary} />
              <Text style={[styles.miniGameTitle, { color: theme.colors.onBackground }]}>Code Racer</Text>
              <Text style={[styles.miniGameReward, { color: theme.colors.onSurfaceVariant }]}>+$25, +50 XP</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.miniGameItem, { backgroundColor: theme.colors.secondaryContainer }]}
              onPress={() => handleMiniGameSelect('bugSquasher')}
              disabled={!stats.isAwake || stats.energy < 5}
            >
              <MaterialCommunityIcons name="bug" size={28} color={theme.colors.secondary} />
              <Text style={[styles.miniGameTitle, { color: theme.colors.onBackground }]}>Bug Squasher</Text>
              <Text style={[styles.miniGameReward, { color: theme.colors.onSurfaceVariant }]}>+15 Energy, +40 XP</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.miniGameItem, { backgroundColor: theme.colors.tertiaryContainer }]}
              onPress={() => handleMiniGameSelect('memoryMatch')}
              disabled={!stats.isAwake || stats.energy < 5}
            >
              <MaterialCommunityIcons name="cards" size={28} color={theme.colors.tertiary} />
              <Text style={[styles.miniGameTitle, { color: theme.colors.onBackground }]}>Memory Match</Text>
              <Text style={[styles.miniGameReward, { color: theme.colors.onSurfaceVariant }]}>+20 Happiness, +30 XP</Text>
            </TouchableOpacity>
          </View>
        </Surface>
        
        {/* History button - regular button instead of FAB */}
        <Button 
          mode="contained"
          icon="history"
          onPress={() => navigation.navigate('History')}
          style={styles.historyButton}
        >
          View History
        </Button>
      </View>

      {renderAchievementsModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  statusCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  statusText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  statsCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },
  actionsCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  moneyIconContainer: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  moneyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  experienceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  experienceBar: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    marginLeft: 10,
  },
  experienceFill: {
    height: '100%',
    borderRadius: 5,
  },
  buttonsContainer: {
    marginTop: 8,
  },
  historyButton: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
  sleepBadge: {
    position: 'absolute',
    top: 140,
    right: '35%',
  },
  sleepToggle: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  dizzyBadge: {
    position: 'absolute',
    top: 140,
    right: '35%',
  },
  fastForwardToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  fastForwardIndicator: {
    position: 'absolute',
    top: -20,
    zIndex: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 5,
  },
  miniGamesCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },
  miniGamesDesc: {
    marginBottom: 12,
    opacity: 0.7,
  },
  miniGamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  miniGameItem: {
    width: '31%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  miniGameTitle: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  miniGameReward: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    textAlign: 'center',
  },
  deadOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 20,
  },
  deadText: {
    color: '#ff0000',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  reviveButton: {
    marginTop: 10,
    backgroundColor: '#00cc44',
  },
  boostsList: {
    marginTop: 8,
  },
  boostItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  boostName: {
    fontSize: 14,
  },
  boostValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noBoosts: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  achievementsList: {
    paddingBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
  },
  achievementStatus: {
    marginLeft: 8,
  },
});

export default HomeScreen; 