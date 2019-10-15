import Permissions from 'react-native-permissions';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  NativeModules,
  NativeEventEmitter,
  ImageBackground,
} from 'react-native';
import PlayerProgress from './PlayerProgress';

export default class Player extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    progress: 0,
  };

  // Check the status of a single permission
  componentDidMount() {
    // console.log('componentDidMount');
    this.NativeMusicPlayer = NativeModules.MusicPlayer;
    this.MusicPlayerEventEmitter = new NativeEventEmitter(
      NativeModules.MusicPlayer,
    );
    this.setOnPlayerStateChange();
    this.setOnProgress(({nowPlayingItemDuration, currentTime}) => {
      //   console.log({currentTime, nowPlayingItemDuration});
      if (nowPlayingItemDuration) {
        this.setState({progress: currentTime / nowPlayingItemDuration});
      }
    });
  }

  setOnPlayerStateChange(onPlayerStateChange) {
    this.stopProgressTracker();

    this.NativeMusicPlayer.addPlayerStateObserver();

    this.onPlayerStateChangeSubscription = this.MusicPlayerEventEmitter.addListener(
      'updatePlayerState',
      ({nowPlayingItemName, nowPlayingItemArtist, isPlaying}) => {
        this.setState({
          nowPlayingItemName,
          nowPlayingItemArtist,
        });
      },
    );
  }

  setOnProgress(onProgress) {
    this.stopProgressTracker();

    this.NativeMusicPlayer.initalizeProgressTracker();
    this.updateProgressSubscription = this.MusicPlayerEventEmitter.addListener(
      'updateProgress',
      onProgress,
    );
  }

  stopProgressTracker() {
    this.NativeMusicPlayer.invalidateProgressTracker();
    this.removeOnProgess();
  }

  removeOnProgess() {
    if (this.updateProgressSubscription) {
      this.updateProgressSubscription.remove();
      this.updateProgressSubscription = null;
    }
  }

  removeOnPlayerStateChange() {
    if (this.onPlayerStateChangeSubscription) {
      this.onPlayerStateChangeSubscription.remove();
      this.onPlayerStateChangeSubscription = null;
    }
  }

  componentWillUnmount() {
    this.stopProgressTracker();
    this.removeOnPlayerStateChange();
  }

  onGenreClick = genre => {
    this.NativeMusicPlayer.playGenre(genre);
  };

  onPause = () => {
    this.NativeMusicPlayer.pause();
    this.setState({isPlaying: false});
  };

  onPlay = () => {
    if (this.state.isPlaying === undefined) {
      this.NativeMusicPlayer.initalizePlayerWithPlaylist('Spooky');
    }
    this.NativeMusicPlayer.play();
    this.setState({isPlaying: true});
  };

  render() {
    // Add skip song (And another song in playlist)
    // make spooky
    return (
      <ImageBackground
        source={require('./assets/dark_gray_skulls.jpg')}
        resizeMode="repeat"
        style={{flex: 1, width: '100%'}}>
        <View style={styles.container}>
          <View style={styles.metaData}>
            <Text style={styles.songTitle}>
              {this.state.nowPlayingItemName || ' '}
            </Text>
            <Text style={styles.artist}>
              {this.state.nowPlayingItemArtist || ' '}
            </Text>
          </View>
          <PlayerProgress
            isPlaying={this.state.isPlaying}
            progress={this.state.progress}
            NativeMusicPlayer={this.NativeMusicPlayer}
            onPause={this.onPause}
            onPlay={this.onPlay}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
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
    color: '#57A2D5',
    fontWeight: '600',
    letterSpacing: 2,
  },
  metaData: {
    margin: 20,
  },
});
