import { useState, useEffect, useRef, useCallback } from 'react';
import { BraydenStats } from '../types/BraydenTypes';
import { logger } from '../utils/logger';

interface UseFastForwardProps {
  isAwake: boolean;
  onUpdate: (stats: Partial<BraydenStats>) => void;
}

export function useFastForward({ isAwake, onUpdate }: UseFastForwardProps) {
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const fastForwardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Toggle fast-forward state
  const toggleFastForward = useCallback(() => {
    setIsFastForwarding(prev => !prev);
  }, []);
  
  // Effect to handle fast-forward timer
  useEffect(() => {
    if (isFastForwarding && !isAwake) {
      logger.info('Fast forward activated');
      
      // Clear any existing interval
      if (fastForwardIntervalRef.current) {
        clearInterval(fastForwardIntervalRef.current);
      }
      
      // Create new interval
      fastForwardIntervalRef.current = setInterval(() => {
        // Fast-forward sleep recovery
        const newEnergy = Math.min(100, isAwake ? 0 : 20);
        logger.debug(`Fast forward sleep recovery - Energy: +${newEnergy}`);
        
        // Update stats through callback
        onUpdate({
          health: Math.max(0, -5),
          hunger: Math.max(0, -20),
          happiness: Math.max(0, -10),
          energy: Math.min(100, newEnergy),
        });
      }, 10000); // 10 seconds
      
      return () => {
        if (fastForwardIntervalRef.current) {
          clearInterval(fastForwardIntervalRef.current);
          fastForwardIntervalRef.current = null;
        }
      };
    } else {
      // Clean up interval when not fast-forwarding
      if (fastForwardIntervalRef.current) {
        clearInterval(fastForwardIntervalRef.current);
        fastForwardIntervalRef.current = null;
      }
    }
  }, [isFastForwarding, isAwake, onUpdate]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (fastForwardIntervalRef.current) {
        clearInterval(fastForwardIntervalRef.current);
        fastForwardIntervalRef.current = null;
      }
    };
  }, []);
  
  return { isFastForwarding, toggleFastForward };
} 