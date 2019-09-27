import Permissions from 'react-native-permissions';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  NativeModules,
  Button,
} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMediaPermissions: 'undetermined',
      isOn: false,
    };
    this.updateStatus();
  }
  turnOn = () => {
    NativeModules.Bulb.turnOn();
    this.updateStatus();
  };
  turnOff = () => {
    NativeModules.Bulb.turnOff();
    this.updateStatus();
  };
  updateStatus = () => {
    NativeModules.Bulb.getStatus((error, isOn) => {
      this.setState({isOn: isOn});
    });
  };

  // Check the status of a single permission
  componentDidMount() {
    Permissions.check('mediaLibrary').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({hasMediaPermissions: response});
    });
  }

  // Request permission to access photos
  _requestPermission = () => {
    console.log('_requestPermission');
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
    console.log(
      'this.state.hasMediaPermissions',
      this.state.hasMediaPermissions,
    );
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
      console.log('do more stuff');

      NativeModules.Bulb.playGenre('Rock');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Light App!!</Text>
        <Text> Bulb is {this.state.isOn ? 'ON' : 'OFF'}</Text>

        {!this.state.isOn ? (
          <Button onPress={this.turnOn} title="Turn ON " color="#FF6347" />
        ) : (
          <Button onPress={this.turnOff} title="Turn OFF " color="#FF6347" />
        )}
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
