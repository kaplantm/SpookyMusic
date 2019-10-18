import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const PlayerProgress = ({
  isPlaying,
  progress,
  NativeMusicPlayer,
  onPause,
  onPlay,
}) => {
  return (
    <AnimatedCircularProgress
      size={200}
      width={15}
      backgroundWidth={25}
      duration={990}
      fill={progress * 100}
      tintColor="#FF6347"
      backgroundColor="hsla(0, 0%, 40%, 1)">
      {fill => {
        if (isPlaying) {
          return (
            <TouchableOpacity onPress={onPause}>
              <Text style={styles.musicControlText}>Pause</Text>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity onPress={onPlay}>
              <Text style={styles.musicControlText}>Play</Text>
            </TouchableOpacity>
          );
        }
      }}
    </AnimatedCircularProgress>
  );
};

const styles = StyleSheet.create({
  musicControlText: {
    textAlign: 'center',
    color: '#FF6347',
    fontSize: 30,
    fontWeight: '600',
  },
});

export default PlayerProgress;
