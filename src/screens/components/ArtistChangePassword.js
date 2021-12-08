import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class ArtistChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pro_id: '',
      password: '',
      password_confirmation: '',
      loading: false
    }
    this.artistChangePassword = this.artistChangePassword.bind(this);
  }

  async componentWillMount(){
        try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
     console.log("User",User.token)
     this.setState({ pro_id: User.id ,token: User.token},() => {
      
     })
     // alert(token)
   } catch (error) {
   }
  }

  artistChangePassword() {

    if (this.state.password == "" || this.state.password == null || this.state.password == undefined) {
      alert("Please enter new password");
    }
    else if (this.state.password.length < 6) {
      alert("Password must be more than 6 ");
    }
    else if (this.state.password_confirmation == "" || this.state.password_confirmation == null || this.state.password_confirmation == undefined) {
      alert("Please Enter  confirm Password");
    }
    else if (this.state.password != this.state.password_confirmation){
      alert("Password not match")
    }
    else {

    this.setState({ loading: true });
    let formdata = new FormData();
    formdata.append("password", this.state.password);
    formdata.append("confirm_password",this.state.password_confirmation);
    formdata.append("pro_id", this.state.pro_id);

    fetch(appConstant.BASE_URL + appConstant.CHANGEPASSWORD , {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: formdata,
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("sucessfully artist change password........", responseJson);
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
        console.log("Artist change password Error : ", error);
      });
  }
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
          <Text style={styles.staticText}>Change Password</Text>
          <View style={{ padding: 30, marginTop: 30 }}>

            <TextInput
              style={styles.EmailTextInput}
              placeholder="New Password"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              secureTextEntry={true}
              onSubmitEditing={() => { this.txtconfirmPasword.focus() }}
              blurOnSubmit={false}
              onChangeText={(password) => this.setState({ password })}
              returnKeyType="next"
            >
            </TextInput>
            <TextInput
              ref={(input) => this.txtconfirmPasword = input}
              style={styles.passwordTextInput}
              placeholder="Confirm Password "
              underlineColorAndroid='transparent'
              autoCorrect={false}
              secureTextEntry={true}
              autoCapitalize='none'
              returnKeyType="done"
              onChangeText={(password_confirmation) => this.setState({ password_confirmation })}
            >
            </TextInput>

          </View>

          <View style={{ padding: 30, marginTop: 3 }}>

            <TouchableOpacity style={styles.TouchableSign_in} onPress={this.artistChangePassword.bind(this)}>
              <Text style={styles.TouchableSign_in_Text}>Change</Text>
            </TouchableOpacity>
          </View>
          <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.loading}>
            <View style={styles.loader}>
              <ActivityIndicator size="large" color='#A16E78' animating={true} />
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
    color: '#A16E78'
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
    backgroundColor: '#A16E78'
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
AppRegistry.registerComponent('uGigs', () => ArtistChangePassword);