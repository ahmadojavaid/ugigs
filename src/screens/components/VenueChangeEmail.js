import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, As } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class VenueChangeEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_confirmation: '',
      loading: false
    }
    this.venueChangeEmailAddress = this.venueChangeEmailAddress.bind(this);
  }

  async componentWillMount() {
    try {
      const data = await AsyncStorage.getItem('VenUser');
      const VenUser = JSON.parse(data)
      this.setState({ ven_id: VenUser.id, ventoken: VenUser.token }, () => {

      })
    } catch (error) {
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
  venueChangeEmailAddress() {
    this.setState({ loading: true });
    let formdata = new FormData();
    formdata.append("ven_id", parseInt(this.state.ven_id))
      formdata.append("email", this.state.email)
      formdata.append("email_confirmation", this.state.email_confirmation)
     
    fetch(appConstant.BASE_URL + appConstant.CHANGEEMAILADDRESS, {
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
        console.log("sucessfully venue change Email........", responseJson);
        this.setState({ loading: false }, () => {
          setTimeout(() => {
        if (responseJson.success_code == 0) {
          this.props.navigation.goBack()
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
        this.setState({ loading: false });
        console.log("Venue change Email Error : ", error);
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
          <Text style={styles.staticText}>Change Email</Text>
          <View style={{ padding: 30, marginTop: 30 }}>

            <TextInput
              style={styles.EmailTextInput}
              placeholder="New Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(email) => this.setState({ email })}
              returnKeyType="next"
            >
            </TextInput>
            <TextInput
              style={styles.passwordTextInput}
              placeholder="Confirm Email "
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType="done"
              onChangeText={(email_confirmation) => this.setState({ email_confirmation })}
            >
            </TextInput>

          </View>

          <View style={{ padding: 30, marginTop: 3 }}>

            <TouchableOpacity style={styles.TouchableSign_in} onPress={this.venueChangeEmailAddress.bind(this)}>
              <Text style={styles.TouchableSign_in_Text}>Change</Text>
            </TouchableOpacity>
          </View>
          <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.loading}
        >
          <View style={styles.loader}>
            <ActivityIndicator size="large" color='rgb(161,110,120)' animating={true} />
          </View>
        </Modal>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52,52,52,0.5)"
  },
});
AppRegistry.registerComponent('uGigs', () => VenueChangeEmail);