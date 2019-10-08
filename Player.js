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
import MusicPlayer from './MusicPlayer';

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
    this.MusicPlayer = MusicPlayer;
    this.MusicPlayer.setOnPlayerStateChange();
    this.MusicPlayer.setOnProgress(({nowPlayingItemDuration, currentTime}) => {
      //   console.log({currentTime, nowPlayingItemDuration});
      if (nowPlayingItemDuration) {
        this.setState({progress: currentTime / nowPlayingItemDuration});
      }
    });
  }

  componentWillUnmount() {
    this.MusicPlayer.stopProgressTracker();
    this.MusicPlayer.removeOnPlayerStateChange();
  }

  onGenreClick = genre => {
    this.MusicPlayer.playGenre('Rock');
  };

  render() {
    // console.log('state progress', this.state.progress);
    return (
      <View style={styles.container}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          duration={990}
          fill={this.state.progress * 100}
          tintColor="#00e0ff"
          //   onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor="#3d5875"
        />
        <Button
          onPress={() => this.onGenreClick('Rock')}
          title="Rock"
          color="#FF6347"
        />
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
});
