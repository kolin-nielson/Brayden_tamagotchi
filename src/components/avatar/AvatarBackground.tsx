import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

interface AvatarBackgroundProps {
  size: number;
  backgroundColor: string;
}

const AvatarBackground: React.FC<AvatarBackgroundProps> = ({
  size,
  backgroundColor,
}) => {
  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
      }
    ]}>
      <Surface style={[styles.background, { backgroundColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});

export default AvatarBackground; 