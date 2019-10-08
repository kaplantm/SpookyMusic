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
import Player from './Player';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMediaPermissions: 'undetermined',
    };
  }

  // Check the status of a single permission
  componentDidMount() {
    // this.MusicPlayer = new MusicPlayer({
    //   onProgress: () => console.log('cats'),
    // });
    Permissions.check('mediaLibrary').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({hasMediaPermissions: response});
    });
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount');
    // this.MusicPlayer.invalidateProgressTracker();
  }
  // Request permission to access photos
  _requestPermission = () => {
    Permissions.request('mediaLibrary').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({hasMediaPermissions: response});
    });
  };

  // This is a common pattern when asking for permissions.
  // iOS only gives you once chance to show the permission dialog,   d
  // after which the user needs to manually enable them from settings.
  // The idea here is to explain why we need access and determine if
  // the user will say no, so that we don't blow our one chance.
  // If the user already denied access, we can ask them to enable it from settings.
  _alertForPhotosPermission() {
    Alert.alert(
      'Can we access your media library?',
      'We need access to play music.',
      [
        {
          text: 'No way',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        this.state.hasMediaPermissions === 'undetermined'
          ? {text: 'OK', onPress: this._requestPermission}
          : {text: 'Open Settings', onPress: Permissions.openSettings},
      ],
    );
  }

  onGenreClick = genre => {
    if (!this.state.hasMediaPermissions === 'authorized') {
      this._alertForPhotosPermission();
    } else {
      // console.log('do more stuff');
      // this.MusicPlayer.playGenre('Rock');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Light App!!</Text>
        <Text> MusicPlayer is {this.state.isOn ? 'ON' : 'OFF'}</Text>

        {!this.state.isOn ? (
          <Button
            onPress={() => this.setState({isOn: true})}
            title="Turn ON "
            color="#FF6347"
          />
        ) : (
          <Button
            onPress={() => this.setState({isOn: false})}
            title="Turn OFF "
            color="#FF6347"
          />
        )}
        {this.state.isOn && <Player />}
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
