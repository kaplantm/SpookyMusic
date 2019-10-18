import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const PlayerProgress = ({isPlaying, progress, NativeMusicPlayer}) => {
  const [isPlayingState, setIsPlaying] = useState(undefined);

  const onPause = () => {
    NativeMusicPlayer.pause();
    setIsPlaying(false);
  };

  const onPlay = () => {
    if (isPlayingState === undefined) {
      NativeMusicPlayer.initalizePlayerWithPlaylist('Spooky');
    }
    NativeMusicPlayer.play();
    setIsPlaying(true);
  };

  function renderControls() {
    const action = isPlayingState ? onPause : onPlay;
    const text = isPlayingState ? 'Pause' : 'Play';
    return (
      <TouchableOpacity onPress={action}>
        <Text style={styles.musicControlText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <AnimatedCircularProgress
      size={200}
      width={15}
      backgroundWidth={25}
      duration={990}
      fill={progress * 100}
      tintColor="#FF6347"
      backgroundColor="hsla(0, 0%, 40%, 1)">
      {renderControls}
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
