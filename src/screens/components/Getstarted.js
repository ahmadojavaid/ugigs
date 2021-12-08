
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Platform, AppRegistry } from 'react-native';

const screen = Dimensions.get('window')

export default class Getstarted extends React.Component {

  render() {
    return (
      <View>
        <ImageBackground style={styles.imageBackground} source={require('../../Assets/img/backgroundimage.png')}>
          <View style={styles.container}>
            <Image style={styles.image} source={require('../../Assets/img/icon.png')} />
          </View>
          <TouchableOpacity style={styles.touchableOpacity}
            onPress={() => this.props.navigation.navigate('GetStartedAnimation')}>
            <Text style={{ color: 'red', fontSize: 15 }}>GET STARTED</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    width: screen.width,
    height: screen.height
  },
  image: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 125,
    height: 125
  },
  touchableOpacity: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 20,
    width: "100%",
    height: 50
  }
});
AppRegistry.registerComponent('uGigs', () => Getstarted);
