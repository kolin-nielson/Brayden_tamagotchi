import { RandomEvent } from '../data/randomEvents';
import { logger } from '../utils/logger';

type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Trigger a random event
 */
export const triggerRandomEvent = ({ 
  randomEvents, 
  setCurrentEvent 
}: { 
  randomEvents: RandomEvent[], 
  setCurrentEvent: StateDispatch<RandomEvent | null> 
}) => {
  const randomIndex = Math.floor(Math.random() * randomEvents.length);
  setCurrentEvent(randomEvents[randomIndex]);
  logger.debug(`Triggered random event: ${randomEvents[randomIndex].title}`);
};

/**
 * Complete a random event
 */
export const completeEvent = ({ 
  currentEvent, 
  choiceIndex, 
  setCurrentEvent 
}: { 
  currentEvent: RandomEvent | null, 
  choiceIndex: number, 
  setCurrentEvent: StateDispatch<RandomEvent | null> 
}) => {
  if (currentEvent && currentEvent.choices[choiceIndex]) {
    logger.debug(`Completing event: ${currentEvent.title}, choice: ${choiceIndex}`);
    currentEvent.choices[choiceIndex].effect();
    setCurrentEvent(null);
  } else {
    logger.error('Attempted to complete invalid event or choice');
  }
};

/**
 * Check if event should be triggered based on random probability
 */
export const shouldTriggerEvent = (probability = 0.05): boolean => {
  return Math.random() < probability;
}; 