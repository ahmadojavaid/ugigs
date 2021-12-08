import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry ,AsyncStorage} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import appConstant from '../common/appConstant';


export default class ArtistChangeEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_confirmation: '',
      loading: false
    }
    this.artistChangeEmailAddress = this.artistChangeEmailAddress.bind(this);
  }

  async componentWillMount() {
    try {
       const data = await AsyncStorage.getItem('User');
       const User = JSON.parse(data)
      console.log("User",User.token)
      this.setState({ pro_id: User.id ,token: User.token},() => {
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


  artistChangeEmailAddress() {

    let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    

    if (this.state.email == "" || this.state.email == null || this.state.email == undefined) {
      alert("Please enter new email");
      return false;
    } 
     else if (reg.test(this.state.email) === false) {
      alert("Please enter correct email address");
    }
    else if (this.state.email_confirmation == "" || this.state.email_confirmation == null || this.state.email_confirmation == undefined) {
      alert("Please Enter  confirm email");
    }
    else if (this.state.email != this.state.email_confirmation){
      alert("Email not match")
    }
    else {
    this.setState({ loading: true });
    let formdata = new FormData();
    formdata.append("email", this.state.email)
    formdata.append("email_confirmation", this.state.email_confirmation)
    formdata.append("pro_id", parseInt(this.state.pro_id))

    fetch(appConstant.BASE_URL + appConstant.ARTISTCHANGEEMAIL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: formdata
    }).then((response) => {
      if (this.isJson(response._bodyInit)) {
        return response.json()
      } else {
        return response.text()
      }
    }).then((responseJson) => {
        console.log("sucessfully artist change Email........", responseJson);
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
        console.log("Artist change Email Error : ", error);
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
          <Text style={styles.staticText}>Change Email</Text>
          <View style={{ padding: 30, marginTop: 30 }}>

            <TextInput
              style={styles.EmailTextInput}
              placeholder="New Email"
              underlineColorAndroid='transparent'
              autoCorrect={false}
              autoCapitalize='none'
              onSubmitEditing={() => { this.txtconfirmPasword.focus() }}
              blurOnSubmit={false}
              onChangeText={(email) => this.setState({ email })}
              returnKeyType="next"
            >
            </TextInput>
            <TextInput
              ref={(input) => this.txtconfirmPasword = input}
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

            <TouchableOpacity style={styles.TouchableSign_in} onPress={this.artistChangeEmailAddress.bind(this)}>
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
AppRegistry.registerComponent('uGigs', () => ArtistChangeEmail);