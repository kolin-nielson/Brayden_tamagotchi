import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useAvatarAnimations = (isDizzy: boolean, isAwake: boolean) => {
  // Animation values
  const dizzyAnim = useRef(new Animated.Value(0)).current;
  const sleepZAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const eyeBlinkAnim = useRef(new Animated.Value(1)).current;
  const headRotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  
  // Start breathing animation
  useEffect(() => {
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    
    breatheLoop.start();
    
    return () => {
      breatheLoop.stop();
    };
  }, [breatheAnim]);
  
  // Start head rotation animation
  useEffect(() => {
    if (isAwake && !isDizzy) {
      const headRotateLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(headRotateAnim, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(headRotateAnim, {
            toValue: -1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(headRotateAnim, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      
      headRotateLoop.start();
      
      return () => {
        headRotateLoop.stop();
      };
    }
  }, [headRotateAnim, isAwake, isDizzy]);
  
  // Start floating animation on mount
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    
    floatLoop.start();
    
    return () => {
      floatLoop.stop();
    };
  }, [floatAnim]);

  // Start pulse animation on mount
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseLoop.start();
    
    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim]);
  
  // Blinking effect for the eyes
  useEffect(() => {
    if (isAwake && !isDizzy) {
      const blinkTimer = setInterval(() => {
        Animated.sequence([
          Animated.timing(eyeBlinkAnim, {
            toValue: 0.1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(eyeBlinkAnim, {
            toValue: 1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]).start();
      }, 3000 + Math.random() * 2000); // Random blinking interval
      
      return () => clearInterval(blinkTimer);
    }
  }, [isAwake, isDizzy, eyeBlinkAnim]);
  
  // Animation starters
  const startDizzyAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dizzyAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(dizzyAnim, {
          toValue: -1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(dizzyAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 5 }
    ).start();
  };
  
  const startSleepAnimation = () => {
    const zLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sleepZAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sleepZAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    
    zLoop.start();
  };
  
  // Derived values
  const headRotation = headRotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg']
  });
  
  const rotation = dizzyAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg']
  });
  
  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03]
  });
  
  return {
    // Raw animation values
    dizzyAnim,
    sleepZAnim,
    floatAnim,
    pulseAnim,
    eyeBlinkAnim,
    headRotateAnim,
    breatheAnim,
    
    // Derived values
    headRotation,
    rotation,
    breatheScale,
    
    // Animation starters
    startDizzyAnimation,
    startSleepAnimation
  };
}; 