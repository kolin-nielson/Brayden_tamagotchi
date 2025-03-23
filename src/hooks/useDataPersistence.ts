import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BraydenStats, DEFAULT_STATS } from '../types/BraydenTypes';
import { Achievement, ACHIEVEMENTS } from '../data/achievements';
import { Upgrade, UPGRADES } from '../data/upgrades';
import logger from '../utils/logger';

export function useDataPersistence() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const saveData = useCallback(async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      logger.debug(`Data saved successfully for key: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Error saving data for key: ${key}`, error);
      setIsError(true);
      return false;
    }
  }, []);

  const saveBraydenData = useCallback(async (
    stats: BraydenStats,
    achievements: Achievement[],
    upgrades: Upgrade[]
  ) => {
    try {
      await saveData('stats', stats);
      await saveData('achievements', achievements);
      await saveData('upgrades', upgrades);
      logger.debug('Brayden data saved successfully');
      return true;
    } catch (error) {
      logger.error('Error saving Brayden data:', error);
      setIsError(true);
      return false;
    }
  }, [saveData]);

  const loadData = useCallback(async <T>(key: string, defaultValue?: T): Promise<T | null> => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return defaultValue || null;
    } catch (error) {
      logger.error(`Error loading data for key: ${key}`, error);
      setIsError(true);
      return defaultValue || null;
    }
  }, []);

  const loadBraydenData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Load stats
      let loadedStats = DEFAULT_STATS;
      const statsData = await loadData<BraydenStats>('stats');
      if (statsData) {
        // Ensure all properties are present (for backward compatibility)
        loadedStats = {
          ...DEFAULT_STATS,
          ...statsData,
          lastUpdated: statsData.lastUpdated || Date.now()
        };
      }

      // Load achievements
      let loadedAchievements = ACHIEVEMENTS;
      const achievementsData = await loadData<Achievement[]>('achievements');
      if (achievementsData) {
        // Make sure all achievements are included, even new ones added in updates
        loadedAchievements = ACHIEVEMENTS.map(achievement => {
          const savedAchievement = achievementsData.find((a: Achievement) => a.id === achievement.id);
          return savedAchievement ? { ...achievement, isUnlocked: savedAchievement.isUnlocked } : achievement;
        });
      }

      // Load upgrades
      let loadedUpgrades = UPGRADES;
      const upgradesData = await loadData<Upgrade[]>('upgrades');
      if (upgradesData) {
        // Make sure all upgrades are included, even new ones added in updates
        loadedUpgrades = UPGRADES.map(upgrade => {
          const savedUpgrade = upgradesData.find((u: Upgrade) => u.id === upgrade.id);
          return savedUpgrade ? { 
            ...upgrade, 
            level: savedUpgrade.level || 0,
            isUnlocked: savedUpgrade.isUnlocked || false
          } : upgrade;
        });
      }
      
      logger.info('Brayden data loaded successfully');
      setIsLoading(false);
      return { stats: loadedStats, achievements: loadedAchievements, upgrades: loadedUpgrades };
    } catch (error) {
      logger.error('Error loading Brayden data:', error);
      setIsError(true);
      setIsLoading(false);
      return { 
        stats: DEFAULT_STATS, 
        achievements: ACHIEVEMENTS,
        upgrades: UPGRADES
      };
    }
  }, [loadData]);

  const removeData = useCallback(async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      logger.debug(`Data removed successfully for key: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Error removing data for key: ${key}`, error);
      return false;
    }
  }, []);

  return {
    saveData,
    saveBraydenData,
    loadData,
    loadBraydenData,
    removeData,
    isLoading,
    isError
  };
} 