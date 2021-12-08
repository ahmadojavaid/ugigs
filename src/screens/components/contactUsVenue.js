import React, { Component } from 'react';
import {StyleSheet, Text, View,TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard ,AppRegistry} from 'react-native';
import { Icon } from 'react-native-elements';

export default class ContactUsVenue  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      telephone:'',
      message:''
    }
    this.contactUS = this.contactUS.bind(this);
  }
  contactUS() {
    this.setState({ loading: true });

    fetch('http://192.168.0.79:9009/api/v1/contactUs', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({

        name: this.state.name,
        email: this.state.email,
        telephone: this.state.telephone,
        message: this.state.message

      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("contact us...", responseJson);
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            if (responseJson.status_code == 0) {
              this.props.navigation.goBack();
              alert(responseJson.message)
            }
            else {
              alert(responseJson.message)
            }
          }, 1000)
        });

        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: true });
        console.log("Fail to sent mail Error : ", error);
      });
  }

  
  static navigationOptions = ({ navigation, screenProps }) => ({

    headerLeft: (
      <TouchableOpacity style={{ marginLeft: 10 }}>
        <Icon name='angle-left'
          type='font-awesome'
          size={35}
          color='#727272'
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>
    ),
    headerTintColor: '#fff',
  });


  render() {
    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.staticText}>Contact Us</Text>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.information}>
            {'Welcome to U GIGS, for all queries please fill in the boxes and leave us a message. One of the team will respond as soon as possible.Or you can email us directly at...\nEmail. theteam@ugigs.co.uk\nDont fancy this? Why dont you head over to our \nsocial media pages listed at the bottom of the page.'}</Text>
          </View>

          <View style={{ padding: 30, marginTop: 30 }}>

            <TextInput
              style={styles.EmailTextInput}
              onSubmitEditing={() => {this.txtEmail.focus()}}
              blurOnSubmit={false}
              placeholder="Name"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(name) => this.setState({ name })}
              returnKeyType="next"
            >
            </TextInput>
            <TextInput
              ref={(input) => this.txtEmail =input}
              onSubmitEditing={() => { this.txtTelephone.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              placeholder="Email"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType="next"
              onChangeText={(email) => this.setState({ email })}
            >
            </TextInput>
            <TextInput
              ref={(input) => this.txtTelephone =input}
              onSubmitEditing={() => { this.txtMessage.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              placeholder="Telephone"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType="next"
              onChangeText={(telephone) => this.setState({ telephone })}
            >
            </TextInput>
            <TextInput
              ref={(input) => this.txtMessage =input}
              style={styles.passwordTextInput}
              placeholder="Message"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType="done"
              onChangeText={(message) => this.setState({ message })}
            >
            </TextInput>

          </View>

          <View style={{ padding: 30, marginTop: 3 }}>

            <TouchableOpacity style={styles.TouchableSign_in} onPress={this.contactUS.bind(this)}>
              <Text style={styles.TouchableSign_in_Text}>Submit</Text>
            </TouchableOpacity>
          </View>
         
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(255,255,255)',
    padding: 10
  },
  staticText: {
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 30,
    color: '#6F8792'
  },
  information: {
    alignSelf: 'center',
    color: 'grey',
    justifyContent: 'space-around',
    textAlign: 'center'
  },

  EmailTextInput: {
    textAlign: 'center',
    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center',

  },
  passwordTextInput: {
    textAlign: 'center',
    marginTop: 25,
    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  signincorner: {
    flex: 1,
    borderRadius: 20
  },
  TouchableSign_in: {
    borderRadius: 20,
    backgroundColor: '#6F8792'
  },
  TouchableSign_in_Text: {
    fontSize: 20,
    textAlign: 'center',
    padding: 15,
    color: 'white'
  },
  Touchable_ForgotPasword: {
    alignItems: 'center'
  },
  Forgot_Text: {
    color: 'black',
    fontWeight: 'bold'
  },
});
AppRegistry.registerComponent('uGigs', () => ContactUsVenue);