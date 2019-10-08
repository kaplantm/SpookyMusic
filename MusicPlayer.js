import {NativeModules, NativeEventEmitter} from 'react-native';

class MusicPlayer {
  constructor(props) {
    this.eventEmitter = new NativeEventEmitter(NativeModules.MusicPlayer);
  }

  onProgress = null;
  subscription = null;

  stopProgressTracker() {
    NativeModules.MusicPlayer.invalidateProgressTracker();
    this.removeOnProgess();
  }

  playGenre(genre) {
    NativeModules.MusicPlayer.playGenre(genre);
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
}

const instance = new MusicPlayer();

export default instance;
