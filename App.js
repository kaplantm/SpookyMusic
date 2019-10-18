import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Player from './Player';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMediaPermissions: 'undetermined',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Player />
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
