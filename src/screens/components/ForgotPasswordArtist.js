import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, AppRegistry, Modal, ActivityIndicator, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class ForgotPasswordArtist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false
    }
    this.forgotPasswordArtist = this.forgotPasswordArtist.bind(this);
  }

  async componentWillMount() {
    try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
      console.log("User", User.token)
      this.setState({ pro_id: User.id, token: User.token }, () => {

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


  forgotPasswordArtist() {
    // this.setState({ loading: true });
    let register = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.email == "" || this.state.email == null || this.state.email == undefined) {
      alert("Please Enter Email address");
    }


    else if (register.test(this.state.email) === false) {
      alert("Please enter correct email address");
    }
    else {
      let formdata = new FormData();
    formdata.append("email", this.state.email)
    

      fetch(appConstant.BASE_URL + appConstant.ARTISTFORGOTPASSWORD, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.state.token
        },
        body:formdata
      }).then((response) => {
        if (this.isJson(response._bodyInit)) {
          return response.json()
        } else {
          return response.text()
        }
      }).then((responseJson) => {
          console.log("Sucessfully sent to email...", responseJson);
          // this.setState({ loading: false }, () => {
            // setTimeout(() => {
              if (responseJson.success_code == 0) {
                this.props.navigation.navigate('SignArtist')
                //   {
                //     "loginResponces": responseJson,
                //     "email": this.state.email,
                //   }
                // );
                alert(responseJson.message)
              }
              else {
                alert(responseJson.message)
              }
            // }, 1000)
          // });

          return responseJson;
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log("Fail to sent mail Error : ", error);
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
          onPress={() => navigation.navigate('SignArtist')}
        />
      </TouchableOpacity>
    ),
    headerTintColor: '#fff',
  });


  render() {
    return (
      <View style={styles.container}>
        <Image style={{ height: 60, width: 60, justifyContent: 'center', alignSelf: 'center' }} source={require('../../Assets/img/lock.png')} />
        <Text style={styles.staticText}>Forgot your Password ?</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.information}>
            Enter your email Address below the redeem your password</Text>
        </View>
        <View style={{ padding: 30, marginTop: 30 }}>

          <TextInput
            style={styles.passwordTextInput}
            placeholder="Email"
            keyboardType="email-address"
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(email) => this.setState({ email })}>
          </TextInput>
        </View>

        <View style={{ padding: 30, marginTop: 3 }}>

          <TouchableOpacity style={styles.TouchableSign_in} onPress={this.forgotPasswordArtist.bind(this)}>
            <Text style={styles.TouchableSign_in_Text}>Reset Password</Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.loading}
        >
          <View style={styles.loader}>
            <ActivityIndicator size="large" color='#A16E78' animating={true} />
          </View>
        </Modal>
      </View>
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
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 25,
    fontWeight: '600',
    color: '#A16E78',
    marginTop: 50
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
    justifyContent: 'center'
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
AppRegistry.registerComponent('uGigs', () => ForgotPasswordArtist);