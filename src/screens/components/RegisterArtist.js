import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback,AsyncStorage, Keyboard, AppRegistry, Modal, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';


export default class RegisterArtist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pro_title: '',
            pro_email: '',
            isLoading: false,
            isVisibleModel: false,
            downloading: false,
            loading: false
        }
        this.registerArtist = this.registerArtist.bind(this);
    }
    isValidPassword(pwd) {
        if (pwd.length < 8) {
            return false;
        }
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*?]{4,}$/;
        return re.test(pwd);
    }
    registerArtist() {
        this.setState({ loading: true });
        // let register = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let register = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var letters = /^[A-Za-z]+$/;

        if (this.state.pro_title == "" || this.state.pro_title == null || this.state.pro_title == undefined) {
            alert("Please Enter Name");
            return false;
        } 
        else if (letters.test(this.state.pro_title) === false) {
            alert("Please enter only alphabet");
        }
        else if (this.state.pro_email == "" || this.state.pro_email == null || this.state.pro_email == undefined)
        {
            alert("Please Enter Email address");
        }
        
        else if (register.test(this.state.pro_email) === false) {
            alert("Please enter correct email address");
        }
        else {

            const formData = new FormData();

            formData.append('pro_title', this.state.pro_title);
            formData.append('pro_email', this.state.pro_email);

            fetch(appConstant.BASE_URL + appConstant.ARTISTREGISTER , {
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
                    try{
                        let data = {id : responseJson.pro_id,
                            token : responseJson.token}
                            await AsyncStorage.setItem('User', JSON.stringify(data));
                        
                    this.setState({ loading: false }, () => {
                        setTimeout(() => {
                    
                            
                    // alert('Your registration has been done and password is sent on your mail');
                    if (responseJson.status_code === 0) {
                        this.props.navigation.navigate("SignArtist",
                        {
                            "loginResponces": responseJson,
                            "pro_title": this.state.pro_title,
                            "pro_email": this.state.pro_email,
                        });
                        alert(responseJson.message)
                        
                        // AsyncStorage.setItem('pro_title', responseJson.pro_title);
                        this.setState({ loading: false });
                        console.log(JSON.stringify(responseJson))
                    
                    }
                    else 
                    {
                        alert(responseJson.message)
                    }
                }, 1000)
                      });
                    return responseJson;
                    }
                    catch (error) {
                    }
                })
            
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log("Registration Error : ", error);
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
                            placeholder="Artist Name"
                            returnKeyType="next"
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(pro_title) => this.setState({ pro_title })}>
                        </TextInput>
                        <TextInput
                            ref={(input) => this.txtPasword = input}
                            style={styles.passwordTextInput}
                            placeholder="Email Address "
                            keyboardType="email-address"
                            returnKeyType="done"
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(pro_email) => this.setState({ pro_email })}>
                        </TextInput>
                    </View>

                    <View style={{ padding: 30, marginTop: 3 }}>

                        <TouchableOpacity style={styles.TouchableSign_in} onPress={this.registerArtist.bind(this)}>
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
                            onPress={() => this.props.navigation.navigate('SignArtist')}>
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
        //alignItems: 'center'
    },
    Forgot_Text: {
        // marginStart: 2,
        color: 'black',
        fontWeight: 'bold',
        paddingEnd: 30
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,52,52,0.5)"
      },
});

AppRegistry.registerComponent('uGigs', () => RegisterArtist);
 
