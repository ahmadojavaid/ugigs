import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage, Modal, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import appconstant from '../common/appConstant';
import { StackActions, NavigationActions } from 'react-navigation';

export default class SignVenue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ven_email: '',
            ven_password: '',
            token: '',
            ven_id: '',
            loading: false
        }
        this.venueSignIn = this.venueSignIn.bind(this);
    }

    isValidPassword(pwd) {
        if (pwd.length < 8) {
            return false;
        }
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*?]{4,}$/;
        return re.test(pwd);
    }

    isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    venueSignIn() {
        this.setState({ loading: true });

        var signUpJson = {
            ven_email: this.state.ven_email,
            ven_password: this.state.ven_password
        };
        // let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (reg.test(this.state.ven_email) === false) {
            alert("Please enter correct email address");
            return false;
        } else if (this.state.ven_password == "" || this.state.ven_password == null || this.state.ven_password == undefined) {
            alert("Please Enter Password");
        }
        else {

            let formdata = new FormData();
            formdata.append("ven_email", this.state.ven_email)
            formdata.append("ven_password", this.state.ven_password)

            fetch(appconstant.BASE_URL + appconstant.VENUELOGIN, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formdata
            }).then((response) => {
                if (this.isJson(response._bodyInit)) {
                    return response.json()
                } else {
                    return response.text()
                }
            }).then(async (responseJson) => {
                console.log("Login success....", JSON.stringify(responseJson));
                try {
                    let data = {
                        id: responseJson.ven_id,
                        token: responseJson.token,
                    
                    }
                    await AsyncStorage.setItem('VenUser', JSON.stringify(data));
                    this.setState({ loading: false }, () => {
                        setTimeout(() => {

                            if (responseJson.status_code == 0) {

                                if (this.props.navigation.state.params && this.props.navigation.state.params.from == 'Explore') {
                                    this.props.navigation.state.params.onGoBack();
                                    this.props.navigation.goBack();
                                }
                                else if (this.props.navigation.state.params.from == 'ArtistVenue') {
                                    this.props.navigation.navigate('ArtistVenue');
                                }
                                else {
                                    // this.props.navigation.navigate('Explore');
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
                                    });
                                    this.props.navigation.dispatch(resetAction);
                                }
                                // this.props.navigation.goBack();
                                // this.props.navigation.navigate('Explore');
                                // alert(responseJson.message)
                            }
                            else {
                                alert(responseJson.message)
                            }
                        }, 100)
                    });

                    return responseJson;
                }
                catch (error) {
                }
            })
                .catch((error) => {
                    this.setState({ loading: true });
                    console.log(" Venue Login....... error ", error);
                })
        }
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
                    <Text style={styles.staticText}>Sign In</Text>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.information}>
                            You can sign in from here by providing your username and password.Please enter proper email id and password.</Text>
                    </View>
                    <View style={{ padding: 30, marginTop: 30 }}>
                        <TextInput
                            style={styles.EmailTextInput}
                            onSubmitEditing={() => { this.txtPasword.focus() }}
                            blurOnSubmit={false}
                            retunKeyLabel={true}
                            keyboardType="email-address"
                            placeholder="Email Address"
                            onChangeText={(ven_email) => this.setState({ ven_email })}
                            underlineColorAndroid='transparent'
                            returnKeyType="next"
                            autoCorrect={false}
                            autoCapitalize='none'
                            value={this.state.ven_email}>


                        </TextInput>
                        <TextInput
                            ref={(input) => this.txtPasword = input}
                            style={styles.passwordTextInput}
                            placeholder="Password "
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                            returnKeyType="done"
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(ven_password) => this.setState({ ven_password })}
                            value={this.state.ven_password}>
                        </TextInput>
                    </View>

                    <View style={{ padding: 30, marginTop: 3 }}>
                        <TouchableOpacity style={styles.TouchableSign_in}
                            onPress={this.venueSignIn.bind(this)} >
                            <Text style={styles.TouchableSign_in_Text}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.Touchable_ForgotPasword}
                            onPress={() => this.props.navigation.navigate('ForgotPasswordVenue')}>
                            <Text style={styles.Forgot_Text}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: 'center', marginTop: 20, flexDirection: 'row' }}>
                        <Text style={{ color: 'grey' }}>Don't have an account?</Text>
                        <TouchableOpacity style={{ flexDirection: 'row' }}
                            onPress={() => this.props.navigation.navigate('RegisterVenue')}>
                            <Text style={{ color: 'black', fontWeight: 'bold', flexDirection: 'row' }}>Sign up</Text>

                        </TouchableOpacity>
                        <Text style={{ marginStart: 2, color: 'grey' }}>here</Text>
                    </View>
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={this.state.loading}
                    >
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color='#6F8792' animating={true} />
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
        alignItems: 'center'
    },
    Forgot_Text: {
        color: 'black',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        fontSize: 18,
        marginBottom: 7,
        fontWeight: '600'
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,52,52,0.5)"
    },
});
AppRegistry.registerComponent('uGigs', () => SignVenue);
