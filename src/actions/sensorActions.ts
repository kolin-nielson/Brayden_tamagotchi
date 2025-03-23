import { Accelerometer } from 'expo-sensors';
import { BraydenStats } from '../types/BraydenTypes';
import logger from '../utils/logger';

type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

interface AccelerometerSubscription {
  current: { unsubscribe: () => void } | null;
}

/**
 * Accelerometer subscription setup
 */
export const subscribeToAccelerometer = (
  subscription: AccelerometerSubscription,
  lastShakeTime: { current: number },
  setShakeCount: StateDispatch<number>,
  stats: BraydenStats,
  setStats: StateDispatch<BraydenStats>,
  dizzyCount: { current: number },
  saveData: () => Promise<any>
) => {
  Accelerometer.setUpdateInterval(100);
  
  subscription.current = Accelerometer.addListener(({ x, y, z }) => {
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();
    
    // Detect shake (acceleration > 1.8)
    if (acceleration > 1.8 && now - lastShakeTime.current > 500) {
      lastShakeTime.current = now;
      setShakeCount(prev => prev + 1);
      
      // Make Brayden dizzy if shaken too much
      if (!stats.isDizzy && stats.isAwake) {
        // Check if recently shaken at least 5 times in 3 seconds
        const recentTime = now - 3000;
        if (lastShakeTime.current > recentTime) {
          setStats(prev => ({
            ...prev,
            isDizzy: true,
            happiness: Math.max(0, prev.happiness - 10)
          }));
          
          // Track dizzy count for achievement
          dizzyCount.current += 1;
          saveData().catch(error => {
            logger.error(`Error saving dizzy state: ${error}`);
          });
          
          logger.debug(`Made Brayden dizzy! Dizzy count: ${dizzyCount.current}`);
          
          // Auto-recover from dizziness after a while
          setTimeout(() => {
            setStats(prev => ({
              ...prev,
              isDizzy: false
            }));
            logger.debug("Brayden recovered from dizziness");
          }, 5000);
        }
      }
    }
  });
};

/**
 * Unsubscribe from accelerometer
 */
export const unsubscribeFromAccelerometer = (subscription: AccelerometerSubscription) => {
  subscription.current?.unsubscribe();
}; 