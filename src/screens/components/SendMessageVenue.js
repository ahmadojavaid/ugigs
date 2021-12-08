import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class SendMessageVenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      message: '',
      pro_id: '',
      item: this.props.navigation.state.params.item,
      pro_id: this.props.navigation.state.params.pro_id,
    }
    this.SendMessageApi = this.SendMessageApi.bind(this);
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "New Message",
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
        <Text style={{ color: '#727272' }}>Cancel</Text>
      </TouchableOpacity>
    ),
    headerTintColor: '#6F8792',
  });

  async componentWillMount() {

    try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
      console.log("User", User.token)
      this.setState({ pro_id: User.id, token: User.token }, () => {
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
    const { item, pro_id, venueRate } = this.state;
    if (this.state.subject == "" || this.state.subject == null || this.state.subject == undefined) {
      alert("Please enter Subject ");
    }
    else if (this.state.message == "" || this.state.message == null || this.state.message == undefined) {
      alert("Please Enter message");
    }

    else {
      let formdata = new FormData();
      formdata.append("ven_id", item.ven_id);
      formdata.append("pro_id", this.state.pro_id);
      formdata.append("subject", this.state.subject);
      formdata.append("message", this.state.message);
      fetch(appConstant.BASE_URL + appConstant.VENUESENDMESSAGE, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.state.token
        },
        body: formdata
      }).then((response) => response.json())
        .then((responseJson) => {

          if (responseJson.success_code == 0) {

            alert(responseJson.message)
          }
          else {
            alert(responseJson.message)
          }
          // alert(JSON.stringify(responseJson.message))
          // console.log("Accept........", responseJson);
          // // this.props.navigation.goBack();
          return responseJson;
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    }
  }
  render() {

    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {/* <TextInput
          style={styles.passwordTextInput}
          placeholderTextColor="#727272"
          placeholder="Name"
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize='none'
          onChangeText={(name) => this.setState({ name })}>
        </TextInput> */}
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
            style={{ color: '#727272', marginTop: 25, borderRadius: 10, backgroundColor: '#e5e5e5', marginLeft: '5%', marginRight: '5%', height: 150, padding: 10 }}
            placeholder="Message"
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(message) => this.setState({ message })}>
          </TextInput>
          <TouchableOpacity onPress={() => this.SendMessageApi()}>
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#6F8792', marginLeft: '5%', marginRight: '5%', marginTop: 30, height: 45, borderRadius: 10 }}>
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
    color: '#727272'
  }
});
AppRegistry.registerComponent('uGigs', () => SendMessageVenue);