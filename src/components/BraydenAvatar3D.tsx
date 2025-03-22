import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';
import AvatarHead from './avatar/AvatarHead';
import AvatarBody from './avatar/AvatarBody';
import AvatarBackground from './avatar/AvatarBackground';

interface BraydenAvatar3DProps {
  size?: number;
  style?: any;
  backgroundOnly?: boolean;
}

const BraydenAvatar3D: React.FC<BraydenAvatar3DProps> = ({
  size = 150,
  style,
  backgroundOnly = false,
}) => {
  const { stats } = useBrayden();
  const { theme } = useTheme();
  
  const isDead = stats.isDead;
  const isAwake = stats.isAwake;
  const isDizzy = stats.isDizzy;

  // Determine avatar state
  const avatarState = {
    isDead,
    isAwake,
    isDizzy,
  };
  
  const containerStyle = {
    width: size,
    height: size,
    ...style,
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Background */}
      <AvatarBackground
        size={size}
        backgroundColor={theme.colors.background}
      />
      
      {/* Only render avatar if not backgroundOnly */}
      {!backgroundOnly && (
        <>
          {/* Body - render first (below head) */}
          <AvatarBody
            size={size}
            avatarState={avatarState}
          />
          
          {/* Head - render last (on top) */}
          <AvatarHead
            size={size}
            avatarState={avatarState}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BraydenAvatar3D; 