import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Dimensions, Platform, ScrollView,AppRegistry,AsyncStorage} from 'react-native';
import {Icon} from 'react-native-elements';

const screen = Dimensions.get('window')
export default class GetStartedAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        pro_id: '',
        ven_id: '',
        
    }
   
}

  async componentWillMount() {
    try {
        const data = await AsyncStorage.getItem('User');
        const User = JSON.parse(data)
        console.log("User", User)
        this.setState({ pro_id: User.id, token: User.token }, () => {
          // alert(this.state.pro_id)
          
        })
    } catch (error) {
    }

    try {
        const vendata = await AsyncStorage.getItem('VenUser');
        const venUser = JSON.parse(vendata)
        console.log("VenUser", venUser)
        this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {
        })
    } catch (error) {
    }
}

onArtistSignIn = () => {
  this.props.navigation.navigate('SignArtist',{from: this.props.navigation.state.params && this.props.navigation.state.params.from})
}

onVenueSignIn = () => {
  this.props.navigation.navigate('SignVenue',{from: this.props.navigation.state.params && this.props.navigation.state.params.from})
}


  static navigationOptions = ({ navigation, screenProps }) => ({
    // title: "Edit Profile",
  tabBarVisible: false
  });

  render() {
    return (
      <View>
       
          <ImageBackground style={{ width: screen.width, height: screen.height }} source={require('../../Assets/img/backgroundimage.png')}>
          {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{  position: 'absolute',top:20,left:15 }}>
            <Icon name='angle-left'
                type='font-awesome'
                size={35}
                color='white'
            />
        </TouchableOpacity> */}
            <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: Platform.OS === 'ios' ? screen.height / 4 : screen.height / 5 }}>
              <Image style={{ width: 125, height: 125, alignSelf: 'center', justifyContent: 'center' }} source={require('../../Assets/img/icon.png')} />

              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, marginTop: screen.height / 4, paddingHorizontal: 30, paddingVertical: 15, padding: 10, alignSelf: 'center', }}
                onPress={() => this.onArtistSignIn()}>
                <Text style={{ color: '#A16E78', fontWeight: 'bold', fontSize: 20 }}>Register a new Artist OR Sign in</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, marginTop: 10, paddingHorizontal: 30, paddingVertical: 15, padding: 10, alignSelf: 'center', }}
                onPress={() => this.onVenueSignIn()}>
                <Text style={{ color: '#6F8792', fontWeight: 'bold', fontSize: 20 }}>Register a new Venue OR Sign in</Text>
              </TouchableOpacity>

            </View>
          </ImageBackground>
       
      </View>
    )
  }
}

AppRegistry.registerComponent('uGigs', () => GetStartedAnimation);