import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarHeadProps {
  size: number;
  avatarState: {
    isDead: boolean;
    isAwake: boolean;
    isDizzy: boolean;
  };
}

const AvatarHead: React.FC<AvatarHeadProps> = ({ size, avatarState }) => {
  const { theme } = useTheme();
  const { isDead, isAwake, isDizzy } = avatarState;
  
  // Calculate sizes based on the parent size
  const headSize = size * 0.5;
  const eyeSize = headSize * 0.15;
  const mouthSize = headSize * 0.25;
  const noseSize = headSize * 0.08;
  const earSize = headSize * 0.2;
  const hairSize = headSize * 0.7;
  
  // Colors
  const skinColor = '#FFDAB9'; // Slightly warmer skin tone
  const blondeColor = '#F7DC6F'; // Natural blonde
  const blondeHighlight = '#FEF160'; // Highlight
  
  return (
    <View 
      style={[
        styles.headContainer,
        {
          width: headSize,
          height: headSize * 1.1,
          borderRadius: headSize / 2,
          backgroundColor: skinColor,
          top: size * 0.25,
          zIndex: 10,
        }
      ]}
    >
      {/* Ears */}
      <View
        style={[
          styles.ear,
          styles.leftEar,
          {
            width: earSize * 0.4,
            height: earSize,
            left: -3,
            backgroundColor: skinColor,
            borderRadius: earSize / 3,
          }
        ]}
      />
      <View
        style={[
          styles.ear,
          styles.rightEar,
          {
            width: earSize * 0.4,
            height: earSize,
            right: -3,
            backgroundColor: skinColor,
            borderRadius: earSize / 3,
          }
        ]}
      />
      
      {/* Modern Hairstyle - Blonde */}
      <View
        style={[
          styles.hair,
          {
            width: hairSize,
            height: hairSize * 0.4,
            top: -headSize * 0.1,
            backgroundColor: blondeColor,
            borderTopLeftRadius: hairSize / 1.5,
            borderTopRightRadius: hairSize / 1.5,
          }
        ]}
      />
      
      {/* Side Hair */}
      <View
        style={[
          styles.sideHair,
          styles.leftSideHair,
          {
            width: headSize * 0.15,
            height: headSize * 0.4,
            left: -2,
            top: headSize * 0.15,
            backgroundColor: blondeColor,
            borderTopLeftRadius: headSize * 0.1,
            borderBottomLeftRadius: headSize * 0.1,
          }
        ]}
      />
      <View
        style={[
          styles.sideHair,
          styles.rightSideHair,
          {
            width: headSize * 0.15,
            height: headSize * 0.4,
            right: -2,
            top: headSize * 0.15,
            backgroundColor: blondeColor,
            borderTopRightRadius: headSize * 0.1,
            borderBottomRightRadius: headSize * 0.1,
          }
        ]}
      />
      
      {/* Hair Highlights */}
      <View
        style={[
          styles.hairHighlight,
          {
            width: hairSize * 0.3,
            height: hairSize * 0.2,
            top: -headSize * 0.05,
            left: headSize * 0.05,
            backgroundColor: blondeHighlight,
            borderRadius: hairSize * 0.15,
            transform: [{ rotate: '15deg' }],
            opacity: 0.6,
          }
        ]}
      />
      
      {/* Cool Hairstyle Bangs */}
      <View
        style={[
          styles.bangs,
          {
            width: hairSize * 0.6,
            height: hairSize * 0.2,
            top: 0,
            right: headSize * 0.1,
            backgroundColor: blondeColor,
            borderTopLeftRadius: hairSize * 0.2,
            borderTopRightRadius: hairSize * 0.1,
            transform: [{ rotate: '-8deg' }],
          }
        ]}
      />
      
      {/* Face container for proper positioning */}
      <View style={styles.faceContainer}>
        {/* Eyes */}
        <View style={styles.eyesContainer}>
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: isDizzy ? eyeSize * 0.8 : eyeSize * 0.5,
                borderRadius: eyeSize / 2,
                backgroundColor: 'white',
                borderWidth: 1.5,
                borderColor: '#333',
                overflow: 'hidden',
              }
            ]}
          >
            <View
              style={[
                styles.pupil,
                {
                  width: eyeSize * 0.4,
                  height: eyeSize * 0.4,
                  borderRadius: eyeSize * 0.2,
                  backgroundColor: isDead ? '#666' : '#1A5276',
                  bottom: isDizzy ? -eyeSize * 0.1 : 0,
                  right: isDizzy ? -eyeSize * 0.1 : 0,
                }
              ]}
            />
            {isAwake && !isDead && (
              <View
                style={[
                  styles.reflection,
                  {
                    width: eyeSize * 0.15,
                    height: eyeSize * 0.15,
                    borderRadius: eyeSize * 0.075,
                    backgroundColor: 'white',
                    top: eyeSize * 0.1,
                    left: eyeSize * 0.05,
                  }
                ]}
              />
            )}
          </View>
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: isDizzy ? eyeSize * 0.8 : eyeSize * 0.5,
                borderRadius: eyeSize / 2,
                backgroundColor: 'white',
                borderWidth: 1.5,
                borderColor: '#333',
                overflow: 'hidden',
              }
            ]}
          >
            <View
              style={[
                styles.pupil,
                {
                  width: eyeSize * 0.4,
                  height: eyeSize * 0.4,
                  borderRadius: eyeSize * 0.2,
                  backgroundColor: isDead ? '#666' : '#1A5276',
                  bottom: isDizzy ? eyeSize * 0.1 : 0,
                  left: isDizzy ? -eyeSize * 0.1 : 0,
                }
              ]}
            />
            {isAwake && !isDead && (
              <View
                style={[
                  styles.reflection,
                  {
                    width: eyeSize * 0.15,
                    height: eyeSize * 0.15,
                    borderRadius: eyeSize * 0.075,
                    backgroundColor: 'white',
                    top: eyeSize * 0.1,
                    left: eyeSize * 0.05,
                  }
                ]}
              />
            )}
          </View>
        </View>
        
        {/* Nose */}
        <View
          style={[
            styles.nose,
            {
              width: noseSize,
              height: noseSize * 1.2,
              borderRadius: noseSize / 4,
              backgroundColor: 'transparent',
              borderBottomWidth: 1.5,
              borderLeftWidth: 1.5,
              borderLeftColor: '#AA8866',
              borderBottomColor: '#AA8866',
              transform: [{ rotate: '45deg' }],
            }
          ]}
        />
        
        {/* Mouth */}
        <View
          style={[
            styles.mouth,
            {
              width: mouthSize,
              height: mouthSize * (isDead ? 0.1 : !isAwake ? 0.1 : isDizzy ? 0.3 : 0.2),
              backgroundColor: isDead || !isAwake ? 'transparent' : '#E74C3C',
              borderBottomWidth: isDead || !isAwake ? 2 : 0,
              borderColor: '#333',
              borderBottomLeftRadius: isDead ? 0 : mouthSize / 2,
              borderBottomRightRadius: isDead ? 0 : mouthSize / 2,
              marginTop: headSize * 0.05,
              transform: [{ scaleY: isDead ? -1 : 1 }],
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  ear: {
    position: 'absolute',
    top: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  leftEar: {
    left: 0,
  },
  rightEar: {
    right: 0,
  },
  hair: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: -1,
  },
  hairHighlight: {
    position: 'absolute',
    zIndex: 1,
  },
  bangs: {
    position: 'absolute',
    zIndex: 1,
  },
  sideHair: {
    position: 'absolute',
    zIndex: -1,
  },
  leftSideHair: {
    left: 0,
  },
  rightSideHair: {
    right: 0,
  },
  faceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '15%',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: '10%',
  },
  eye: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    position: 'absolute',
  },
  reflection: {
    position: 'absolute',
    opacity: 0.9,
  },
  nose: {
    marginBottom: '10%',
  },
  mouth: {
    alignSelf: 'center',
  },
});

export default AvatarHead; 