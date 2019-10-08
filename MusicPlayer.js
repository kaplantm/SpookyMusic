import {NativeModules, NativeEventEmitter} from 'react-native';

class MusicPlayer {
  constructor(props) {
    this.eventEmitter = new NativeEventEmitter(NativeModules.MusicPlayer);
  }

  onProgress = null;
  subscription = null;

  //   addPlayerStateObserver() {
  //     NativeModules.MusicPlayer.addPlayerStateObserver();
  //   }
  setOnPlayerStateChange(onPlayerStateChange) {
    this.stopProgressTracker();

    NativeModules.MusicPlayer.addPlayerStateObserver();

    this.onPlayerStateChangeSubscription = this.eventEmitter.addListener(
      'updatePlayerState',
      ({nowPlayingItemName, nowPlayingItemArtist}) => {
        this.nowPlayingItemName = nowPlayingItemName;
        this.nowPlayingItemArtist = nowPlayingItemArtist;
      },
    );
  }

  stopProgressTracker() {
    NativeModules.MusicPlayer.invalidateProgressTracker();
    this.removeOnProgess();
  }

  playGenre(genre) {
    NativeModules.MusicPlayer.playGenre(genre);
  }

  getCurrentPlaybackTime() {
    NativeModules.MusicPlayer.getCurrentPlaybackTime(
      (error, currentPlaybackTime) => {
        //   this.setState({isOn: isOn});
        // console.log('getCurrentPlaybackTime', currentPlaybackTime);
      },
    );
  }

  getCurrentSongDuration() {
    NativeModules.MusicPlayer.getCurrentSongDuration(
      (error, currentSongDuration) => {
        //   this.setState({isOn: isOn});
        // console.log('getCurrentSongDuration', currentSongDuration);
      },
    );
  }

  setOnProgress(onProgress) {
    this.stopProgressTracker();

    NativeModules.MusicPlayer.initalizeProgressTracker();
    this.subscription = this.eventEmitter.addListener(
      'updateProgress',
      onProgress,
    );
  }

  removeOnProgess() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  removeOnPlayerStateChange() {
    if (this.onPlayerStateChangeSubscription) {
      this.onPlayerStateChangeSubscription.remove();
      this.onPlayerStateChangeSubscription = null;
    }
  }
}

const instance = new MusicPlayer();

export default instance;
