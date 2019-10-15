import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  NativeModules,
  NativeEventEmitter,
  Button,
} from 'react-native';
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
          return <Button onPress={onPause} title="Pause" color="#FF6347" />;
        } else {
          return <Button onPress={onPlay} title="Play" color="#FF6347" />;
        }
      }}
    </AnimatedCircularProgress>
  );
};

export default PlayerProgress;
