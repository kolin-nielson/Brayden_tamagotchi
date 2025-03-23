import { Alert } from 'react-native';
import { Achievement } from '../types/achievement.types';
import logger from '../utils/logger';

type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Unlock achievement
 */
export const unlockAchievement = (
  achievementId: string,
  achievements: Achievement[],
  setAchievements: StateDispatch<Achievement[]>,
  saveData: () => Promise<any>
) => {
  // First check if the achievement ID exists in our list
  const achievementExists = achievements.some(a => a.id === achievementId);
  if (!achievementExists) {
    logger.error(`Attempted to unlock non-existent achievement: ${achievementId}`);
    return;
  }

  const updatedAchievements = achievements.map(achievement => {
    if (achievement.id === achievementId && !achievement.isUnlocked) {
      return { ...achievement, isUnlocked: true };
    }
    return achievement;
  });
  
  // Only update if there was a change
  const wasUnlocked = !achievements.find(a => a.id === achievementId)?.isUnlocked;
  if (wasUnlocked) {
    setAchievements(updatedAchievements);
    saveData().catch(error => {
      logger.error(`Error saving achievement unlock: ${error}`);
    });
    
    // Find the unlocked achievement with better error handling
    const achievement = updatedAchievements.find(a => a.id === achievementId);
    
    // Log for debugging
    logger.info(`Unlocking achievement: ${achievement?.title || achievementId}`);
    
    // Show notification for newly unlocked achievement with more details and proper fallbacks
    Alert.alert(
      "Achievement Unlocked!",
      `"${achievement?.title || achievementId}"\n\n${achievement?.description || "You've unlocked a new achievement!"}`,
      [{ text: "Nice!" }]
    );
  }
};

/**
 * Check if all achievements are unlocked
 */
export const checkAllAchievementsUnlocked = (achievements: Achievement[]): boolean => {
  return achievements.every(achievement => achievement.isUnlocked);
};

/**
 * Get number of unlocked achievements
 */
export const getUnlockedAchievementCount = (achievements: Achievement[]): number => {
  return achievements.filter(a => a.isUnlocked).length;
}; 