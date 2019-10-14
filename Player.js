import Permissions from 'react-native-permissions';
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

  render() {
    // Add skip song (And another song in playlist)
    // make spooky
    return (
      <View style={styles.container}>
        <View style={styles.metaData}>
          <Text style={styles.songTitle}>
            {this.state.nowPlayingItemName || ' '}
          </Text>
          <Text style={styles.artist}>
            {this.state.nowPlayingItemArtist || ' '}
          </Text>
        </View>
        <AnimatedCircularProgress
          size={120}
          width={15}
          duration={990}
          fill={this.state.progress * 100}
          tintColor="#00e0ff"
          backgroundColor="#3d5875">
          {fill => {
            if (this.state.isPlaying) {
              return (
                <Button
                  onPress={() => {
                    this.NativeMusicPlayer.pause();
                    this.setState({isPlaying: false});
                  }}
                  title="Pause"
                  color="#FF6347"
                />
              );
            } else {
              return (
                <Button
                  onPress={() => {
                    if (this.state.isPlaying === undefined) {
                      this.NativeMusicPlayer.initalizePlayerWithPlaylist(
                        'Spooky',
                      );
                    }
                    this.NativeMusicPlayer.play();
                    this.setState({isPlaying: true});
                  }}
                  title="Play"
                  color="#FF6347"
                />
              );
            }
          }}
        </AnimatedCircularProgress>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  songTitle: {
    textAlign: 'center',
    fontSize: 30,
  },
  artist: {
    textAlign: 'center',
  },
  metaData: {
    margin: 20,
  },
});
