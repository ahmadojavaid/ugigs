import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      message: '',
      pro_id: '',
      item: this.props.navigation.state.params.item,
      // ven_id: this.props.navigation.state.params.ven_id,
      // ven_id:''
    }
    this.SendMessageApi = this.SendMessageApi.bind(this);
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "New Message",
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
        <Text style={{color:'#727272'}}>Cancel</Text>
      </TouchableOpacity>
    ),
    headerTintColor: '#A16E78',
  });

  async componentWillMount() {
    // alert(this.state.ven_id);
    try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
      console.log("User", User.token)
      this.setState({ pro_id: User.id, token: User.token }, () => {
        // this.SendMessageApi()
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

  SendMessageApi() {
    const { item, ven_id, venueRate } = this.state;
    if (this.state.subject == "" || this.state.subject == null || this.state.subject == undefined) {
      alert("Please Enter Subject ");
    }
    
    else if (this.state.message == "" || this.state.message == null || this.state.message == undefined) {
      alert("Please Enter Message");
    }
   
    else {
      let formdata = new FormData();
      formdata.append("ven_id", this.state.ven_id);
      formdata.append("pro_id", item.pro_id);
      formdata.append("subject", this.state.subject);
      formdata.append("message", this.state.message);
      
    fetch(appConstant.BASE_URL + appConstant.SENDMESSAGE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.ventoken
      },
      body: formdata
    }).then((response) => {
      if (this.isJson(response._bodyInit)) {
        return response.json()
      } else {
        return response.text()
      }
    }).then((responseJson) => {
        console.log("Send Message........", responseJson);
        alert(responseJson.message)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }
  }

  isJson = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  render() {

    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        
        <TextInput
          style={styles.passwordTextInput}
          placeholderTextColor="#727272"
          placeholder="Subject"
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize='none'
          onChangeText={(subject) => this.setState({ subject })}>
        </TextInput>
        <TextInput
          multiline
          placeholderTextColor="#727272"
          numberOfLines={5}
          style={{color: '#727272', marginTop: 25, borderRadius: 10, backgroundColor: '#e5e5e5', marginLeft: '5%', marginRight: '5%', height: 150, padding: 10 }}
          placeholder="Message"
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize='none'
          onChangeText={(message) => this.setState({ message })}>
        </TextInput>

        <TouchableOpacity onPress={() => this.SendMessageApi()}>
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#A16E78', marginLeft: '5%', marginRight: '5%', marginTop: 30, height: 45, borderRadius: 10 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
    padding: 10
  },
  passwordTextInput: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: '#e5e5e5',
    height: 45,
    padding: 10,
    color:'#727272'
  }
});
AppRegistry.registerComponent('uGigs', () => SendMessage);