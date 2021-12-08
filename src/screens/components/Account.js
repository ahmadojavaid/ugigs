import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, AppRegistry, Linking, AsyncStorage, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { email } from 'react-native-email';
import appConstant from '../common/appConstant';
import { StackActions, NavigationActions } from 'react-navigation';

class Tabs extends Component {
    state = {
        activeTab: 0,
    }


    render({ children } = this.props) {
        return (
            <ScrollView>
                <View style={styles.container1}>

                    <View style={styles.tabsContainer}>

                        {children.map(({ props: { title, title1 } }, index) =>
                            <TouchableOpacity
                                style={[styles.tabContainer,
                                index === this.state.activeTab ? styles.tabContainerActive : [],
                                index === this.state.activeTab1 ? styles.tabContainerActive2 : []
                                ]}

                                onPress={() => this.setState({ activeTab: index })}
                                key={index}>
                                <Text style={styles.tabText1}>
                                    {title}
                                </Text>
                                <Text style={styles.tabText2}>
                                    {title1}
                                </Text>
                            </TouchableOpacity>
                        )}

                    </View>
                    <View style={styles.contentContainer}>
                        {children[this.state.activeTab]}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            pro_id: '',
            results: [],
            loading: false,
            selected: 'Pendding',
        };
        this.artistDeleteAccount = this.artistDeleteAccount.bind(this);
        this.venueDeleteAccount = this.venueDeleteAccount.bind(this);
        this.deleteConfirmationArtist = this.deleteConfirmationArtist.bind(this);
        this.deleteConfirmationVenue = this.deleteConfirmationVenue.bind(this);
        this.logoutArtist = this.logoutArtist.bind(this);
        this.logoutVenue = this.logoutVenue.bind(this);
    }

    async componentWillMount() {

        // alert("press")
        try {
            const data = await AsyncStorage.getItem('User');
            const User = JSON.parse(data)
            const vendata = await AsyncStorage.getItem('VenUser');
            const venUser = JSON.parse(vendata)
            console.log("User.......................", User)
            
            if(User == null && venUser == null) 

          {this.props.navigation.replace('GetStartedAnimation')}
          
            this.setState({ pro_id: User.id, token: User.token, ven_id: venUser.id, ventoken: venUser.token }, () => {                
            })
        } catch (error) {
        }

        // try {
        //     const vendata = await AsyncStorage.getItem('VenUser');
        //     const venUser = JSON.parse(vendata)
        //     console.log("VenUser", venUser)
        //     this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {
        //     })
        // } catch (error) {
        // }
    }

    deleteConfirmationArtist() {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete account?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: this.artistDeleteAccount },
            ],
            { cancelable: false },
        );
    }

    deleteConfirmationVenue() {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete account?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: this.venueDeleteAccount },
            ],
            { cancelable: false },
        );
    }

    logoutArtist() {
        AsyncStorage.removeItem('User');
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'GetStartedAnimation' })],
          });
          this.props.navigation.dispatch(resetAction);
        
    }
    logoutVenue() {
        AsyncStorage.removeItem('VenUser');
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'GetStartedAnimation' })],
          });
          this.props.navigation.dispatch(resetAction);
    }

    artistDeleteAccount() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.ARTISTDELETEACCOUNT + '?pro_id=' + this.state.pro_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log("Sucessfully Deleted..............", responseJson);
                this.setState({ loading: false, results: responseJson.results });
                AsyncStorage.removeItem('User', User.id);
                this.props.navigation.navigate('SignVenue')
                alert(responseJson.message)
                console.log(responseJson.message)
                return responseJson;
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(" Deleted Error : ", error);
            });
    }

    venueDeleteAccount() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.VENUEDELETEACCOUNT + '?ven_id=' +this.state.ven_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log("Sucessfully Deleted..............", responseJson);
                this.setState({ loading: false, venueDelete: responseJson.results });
                AsyncStorage.removeItem('VenUser');
                this.props.navigation.navigate('SignVenue')
                alert(responseJson.message)
                console.log(responseJson.message)
                return responseJson;
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(" Deleted Error : ", error);
            });
    }

    state = {
        search: '',
    };

    updateSearch = search => {
        this.setState({ search });
    };

    render() {
        const { search } = this.state;

        return (

            <View style={styles.container}>
                <Tabs>
                    <View title="Artist" style={styles.content}>

                        <View style={{ padding: 15 }}>

                            <TouchableOpacity style={{
                                justifyContent: 'space-between',
                                borderRadius: 10,
                                backgroundColor: 'rgb(233,233,233)',
                                flexDirection: 'row',
                                alignItems: 'center', paddingHorizontal: 10
                            }}
                                onPress={() => this.props.navigation.navigate('ArtistEditProfile')} >
                                <Text style={styles.TouchableEdit_in_Text}>Edit profile/Change Photo</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableEdit}
                                onPress={() => this.props.navigation.navigate('ArtistChangeEmail')}>
                                <Text style={styles.TouchableEdit_in_Text}>Change email</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableEdit}
                                onPress={() => this.props.navigation.navigate('ArtistChangePassword')}>
                                <Text style={styles.TouchableEdit_in_Text}>Change password</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableEdit} onPress={() => this.props.navigation.navigate('ContactUsArtist')} >
                                <Text style={styles.TouchableEdit_in_Text}>Contact us</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.TouchableSign_in}
                                onPress={this.deleteConfirmationArtist}
                            >
                                <Text style={styles.TouchableSign_in_Text}>Delete account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.TouchableSign_in} onPress={ this.logoutArtist}>
                                <Text style={styles.TouchableSign_in_Text}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View title1="Venue" style={styles.contentVenue}>

                        <View style={{ padding: 15 }}>

                            <TouchableOpacity style={{
                                justifyContent: 'space-between',
                                borderRadius: 10,
                                backgroundColor: 'rgb(233,233,233)',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 10
                            }}
                                onPress={() => this.props.navigation.navigate('VenueEditProfile')}>
                                <Text style={styles.TouchableEdit_in_Text}>Edit profile/Change Photo</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableEdit}
                                onPress={() => this.props.navigation.navigate('VenueChangeEmail')}>
                                <Text style={styles.TouchableEdit_in_Text}>Change email</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableEdit}
                                onPress={() => this.props.navigation.navigate('VenueChangePassword')}
                            >
                                <Text style={styles.TouchableEdit_in_Text}>Change password</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableEdit} onPress={() => this.props.navigation.navigate('ContactUsVenue')} >
                                <Text style={styles.TouchableEdit_in_Text}>Contact us</Text>
                                <Icon
                                    name='angle-right'
                                    type='font-awesome'
                                    size={25}
                                    color='#727272' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.TouchableVenueEdit} onPress={this.deleteConfirmationVenue}>
                                <Text style={styles.TouchableSign_in_Text}>Delete account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.TouchableVenueEdit} onPress={this.logoutVenue}>
                                <Text style={styles.TouchableSign_in_Text}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Tabs>

            </View>

        );
    }
}
const styles = StyleSheet.create({
    elevationLow: {
        height: 135,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    content: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentVenue: {
        flex: 1,
        backgroundColor: 'white',
    },
    text: {
        marginHorizontal: 20,
        color: '#A16E78',
        textAlign: 'center',
        fontFamily: 'Avenir',
        fontSize: 18,
    },
    container1: {
        flex: 1,
    },

    tabsContainer: {
        marginTop: 13,
        flexDirection: 'row',
        // marginLeft: 20,
        // marginRight: 20
    },

    tabContainer: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabContainer1: {
        flex: 1,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },

    tabContainerActive: {
        borderBottomColor: '#A16E78',
    },

    tabText1: {
        color: '#A16E78',
        fontSize: 20,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tabText2: {
        color: 'rgb(111, 135, 146)',
        fontSize: 20,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tabContainerActive2: {
        borderBottomColor: 'rgb(111, 135, 146)',
    },
    contentContainer: {
        flex: 1
    },

    containercontent: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 10

    },
    TextTitle: {
        fontSize: 20,
        color: '#A16E78',
        fontWeight: 'bold'
    },

    swipeoutView: {
        height: 50,

    },
    flatview: {
        flexDirection: 'row',
        height: 135,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    nameVenue: {
        color: 'rgb(111, 135, 146)',
        fontSize: 12,
        marginStart: 9,
        padding: 5
    },
    BrandnameVenue: {
        color: 'rgb(111, 135, 146)',
        fontSize: 20,
        fontWeight: '600',
        marginStart: 9
    },
    BookVenue: {
        backgroundColor: 'rgb(111, 135, 146)',
        paddingEnd: 10,
        borderRadius: 20,
        width: 55,
        marginStart: 9

    },
    TouchableSign_in: {
        borderRadius: 10,
        backgroundColor: '#A16E78',
        marginTop: 16
    },
    TouchableSign_in_Text: {
        fontSize: 15,
        textAlign: 'center',
        padding: 9,
        color: 'white'
    },
    TouchableEdit: {
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: 'rgb(233,233,233)',
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 10
    },
    TouchableEdit_in_Text: {
        fontSize: 15,
        textAlign: 'left',
        padding: 9,
        color: '#727272',
        fontWeight: '500'
    },
    TouchableVenueEdit: {
        borderRadius: 10,
        backgroundColor: 'rgb(111, 135, 146)',
        marginTop: 16
    },
});
AppRegistry.registerComponent('uGigs', () => Account);





