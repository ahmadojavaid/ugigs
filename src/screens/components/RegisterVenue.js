import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, Modal,AsyncStorage, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class RegisterVenue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ven_title: '',
            ven_email: '',
            isLoading: false,
            isVisibleModel: false,
            downloading: false,
            loading: false
        }
        this.registerVenue = this.registerVenue.bind(this);
    }
    isValidPassword(pwd) {
        if (pwd.length < 8) {
            return false;
        }
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*?]{4,}$/;
        return re.test(pwd);
    }
    registerVenue() {
        this.setState({ loading: true });
        // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // let register = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let register = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var letters = /^[A-Za-z]+$/;

        if (this.state.ven_title == "" || this.state.ven_title == null || this.state.ven_title == undefined) {
            alert("Please Enter Name");
            //this.setState({email:text})
            return false;
        } 
        else if (letters.test(this.state.ven_title) === false) {
            alert("Please enter only alphabet");
        }
        else if (this.state.ven_email == "" || this.state.ven_email == null || this.state.ven_email == undefined)
        {
            alert("Please Enter Email address");
        }
        else if (register.test(this.state.ven_email) === false) {
            alert("Please enter correct email address");
        }
        else {
            const formData = new FormData();

            formData.append('ven_title', this.state.ven_title);
            formData.append('ven_email', this.state.ven_email);

            fetch(appConstant.BASE_URL + appConstant.VENUEREGISTER, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            }).then((response) => {
                if (this.isJson(response._bodyInit)) {
                  return response.json()
                } else {
                  return response.text()
                }
              }).then(async(responseJson) => {
                    console.log("Registration...", responseJson);
                    try {
                        let data = {
                            id: responseJson.ven_id,
                            token: responseJson.token
                        }
                        await AsyncStorage.setItem('VenUser', JSON.stringify(data));
                    this.setState({ loading: false }, () => {
                        setTimeout(() => {
                    this.props.navigation.navigate("SignVenue",
                        {
                            "loginResponces": responseJson,
                            "ven_title": this.state.ven_title,
                            "ven_email": this.state.ven_email,
                        });
                        alert(JSON.stringify(responseJson.message))
                        // alert(JSON.stringify(responseJson))
                    // alert('Your registration has been done and password is sent on your mail');
                    if (responseJson.success === true) {
                        // AsyncStorage.setItem('ven_title', responseJson.ven_title);
                        this.setState({ loading: false });
                        console.log(JSON.stringify(responseJson))
                    }
                    else 
                    {
                        alert(JSON.stringify(responseJson.message))
                    }
                }, 1000)
            });
                    return responseJson;
                }
                catch (error) {
                }
                })
                .catch((error) => {
                    this.setState({ loading: false});
                    console.log("Venue Register Error : ", error);
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
    static navigationOptions = ({ navigation, screenProps }) => ({

        headerLeft: (
            <TouchableOpacity style={{ marginLeft: 10 }}>
                <Icon name='angle-left'
                    type='font-awesome'
                    size={35}
                    color='#727272'
                    onPress={() => navigation.navigate('GetStartedAnimation')}
                />
            </TouchableOpacity>
        ),
        headerTintColor: '#fff',
    });


    render() {

      
        return (
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Text style={styles.staticText}>Register a new account</Text>
                    <View style={{ marginTop: 20, textAlign: 'center' }}>

                        <Text style={styles.information}>
                            Please use a valid email address as we will
             send you temporary password for you first login.</Text>
                    </View>
                    <View style={{ padding: 30, marginTop: 30 }}>
                        <TextInput
                            style={styles.EmailTextInput}
                            onSubmitEditing={() => { this.txtPasword.focus() }}
                            blurOnSubmit={false}
                            placeholder="Venue Name"
                            returnKeyType="next"
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(ven_title) => this.setState({ ven_title })}>
                        </TextInput>
                        <TextInput
                            ref={(input) => this.txtPasword = input}
                            style={styles.passwordTextInput}
                            placeholder="Email Address "
                            keyboardType="email-address"
                            returnKeyType="done"
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(ven_email) => this.setState({ ven_email })}>
                        </TextInput>
                    </View>

                    <View style={{ padding: 30, marginTop: 3 }}>

                        <TouchableOpacity style={styles.TouchableSign_in} onPress={this.registerVenue.bind(this)}>
                            <Text style={styles.TouchableSign_in_Text}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'grey' }} >By Signing Up you agree to our</Text>
                        <TouchableOpacity>
                            <Text style={{ fontWeight: 'bold' }}> Privacy Policy & Term and Conditions</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={{ alignSelf: 'center', marginTop: 20, flexDirection: 'row' }}>
                        <Text style={{ color: 'grey' }}>Already have an account?</Text>
                        <TouchableOpacity style={{ flexDirection: 'row' }}
                            onPress={() => this.props.navigation.navigate('SignVenue')}>
                            <Text style={{ color: 'black', fontWeight: 'bold', flexDirection: 'row' }}>Sign in</Text>

                        </TouchableOpacity>
                        <Text style={{ marginStart: 2, color: 'grey' }}>here</Text>
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
        backgroundColor: '#6F8792'
    },
    TouchableSign_in_Text: {
        fontSize: 20,
        textAlign: 'center',
        padding: 15,
        color: 'white'
    },
    Touchable_ForgotPasword: {
        //alignItems: 'center'
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,52,52,0.5)"
      },
});
AppRegistry.registerComponent('uGigs', () => RegisterVenue);