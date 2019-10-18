import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  ImageBackground,
} from 'react-native';
import PlayerProgress from './PlayerProgress';

const Player = () => {
  const initialized = false;
  const [progressState, setProgress] = useState(undefined);
  const [nowPlayingItemNameState, setNowPlayingItemName] = useState('');
  const [nowPlayingItemArtistState, setNowPlayingItemArtist] = useState('');

  const NativeMusicPlayer = NativeModules.MusicPlayer;
  const MusicPlayerEventEmitter = new NativeEventEmitter(
    NativeModules.MusicPlayer,
  );

  let updateProgressSubscription;
  let onPlayerStateChangeSubscription;

  useEffect(() => {
    setOnPlayerStateChange();
    setOnProgress(({nowPlayingItemDuration, currentTime}) => {
      if (nowPlayingItemDuration) {
        setProgress(currentTime / nowPlayingItemDuration);
      }
    });
  }, [initialized]);

  function setOnPlayerStateChange(onPlayerStateChange) {
    stopProgressTracker();

    NativeMusicPlayer.addPlayerStateObserver();

    onPlayerStateChangeSubscription = MusicPlayerEventEmitter.addListener(
      'updatePlayerState',
      ({nowPlayingItemName, nowPlayingItemArtist, isPlaying}) => {
        setNowPlayingItemName(nowPlayingItemName);
        setNowPlayingItemArtist(nowPlayingItemArtist);
      },
    );
  }

  function setOnProgress(onProgress) {
    stopProgressTracker();

    NativeMusicPlayer.initalizeProgressTracker();
    updateProgressSubscription = MusicPlayerEventEmitter.addListener(
      'updateProgress',
      onProgress,
    );
  }

  function stopProgressTracker() {
    NativeMusicPlayer.invalidateProgressTracker();
    removeOnProgess();
  }

  function removeOnProgess() {
    if (updateProgressSubscription) {
      updateProgressSubscription.remove();
      updateProgressSubscription = null;
    }
  }

  function removeOnPlayerStateChange() {
    if (onPlayerStateChangeSubscription) {
      onPlayerStateChangeSubscription.remove();
      onPlayerStateChangeSubscription = null;
    }
  }

  function componentWillUnmount() {
    stopProgressTracker();
    removeOnPlayerStateChange();
  }

  return (
    <ImageBackground
      source={require('./assets/dark_gray_skulls.jpg')}
      resizeMode="repeat"
      style={styles.imageBackground}>
      <View style={styles.container}>
        <View style={styles.metaData}>
          <Text style={styles.songTitle}>{nowPlayingItemNameState || ' '}</Text>
          <Text style={styles.artist}>{nowPlayingItemArtistState || ' '}</Text>
        </View>
        <PlayerProgress
          progress={progressState}
          NativeMusicPlayer={NativeMusicPlayer}
        />
      </View>
    </ImageBackground>
  );
};

export default Player;

const styles = StyleSheet.create({
  imageBackground: {flex: 1, width: '100%'},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'hsla(0, 0%, 13%, .8)',
  },
  songTitle: {
    textAlign: 'center',
    color: '#57A2D5',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 2,
  },
  artist: {
    textAlign: 'center',
    fontSize: 20,
    color: '#57A2D5',
    fontWeight: '600',
    letterSpacing: 2,
  },
  metaData: {
    margin: 20,
  },
});
