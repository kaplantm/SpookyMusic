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
import MusicPlayer from './MusicPlayer';

export default class Player extends Component {
  constructor(props) {
    super(props);
  }

  // Check the status of a single permission
  componentDidMount() {
    console.log('componentDidMount');
    this.MusicPlayer = MusicPlayer;
    this.MusicPlayer.setOnProgress(() => console.log('doggo'));
  }

  componentWillUnmount() {
    this.MusicPlayer.stopProgressTracker();
  }

  onGenreClick = genre => {
    this.MusicPlayer.playGenre('Rock');
  };

  render() {
    return (
      <View style={styles.container}>
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
