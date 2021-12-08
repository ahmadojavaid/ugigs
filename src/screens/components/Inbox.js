import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    ScrollView,
    AppRegistry,
    AsyncStorage
} from 'react-native';
import { Icon, Rating, AirbnbRating } from 'react-native-elements';
import appConstant from '../common/appConstant';

export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            region: '',
            bioShortIntroduction: '',
            fullBio: '',
            twitter: '',
            facebook: '',
            youtube: '',
            soundCloud: '',
            pm_latest_date: '',
            pm_subject: '',
            pm_from: '',
            pm_venue_id: '',
            pm_pro_id: '',
            pro_title: '',
            results: [],
            ven_id: '',
            pro_id: '',
            messageList: [],
            messageListVenue:[],
            loading: false,
            selected: 'artistInbox',
        }
        this.common = this.common.bind(this);
    }

    async componentWillMount() {
        this.setState({ loading: true });
        try {
            const data = await AsyncStorage.getItem('User');
            const User = JSON.parse(data)            
            this.setState({ pro_id: User.id, token: User.token }, () => {
                setTimeout(() => {
                    this.setState({ loading: false });
                        this.common();
                   }, 5000);
            })
            
          } catch (error) {
          }
      
          try {
            const Vendata = await AsyncStorage.getItem('VenUser');
            const VenUser = JSON.parse(Vendata)
            console.log("VenUser", VenUser)
            this.setState({ ven_id: VenUser.id, ventoken: VenUser.token }, () => {
                setTimeout(() => {
                    this.setState({ loading: false });
                    this.common();
               }, 5000);
            })
          } catch (error) {
          }
        }



    // async componentWillMount() {
    // try {
    //     const data = await AsyncStorage.getItem('User');
    //     const User = JSON.parse(data)
    //     console.log("User........",User)
    //     const vendata = await AsyncStorage.getItem('VenUser');
    //     const venUser = JSON.parse(vendata)
    //     console.log("VenUser........",venUser)
    //    if(User == null) 

    //       {this.props.navigation.replace('VenueInbox')}
    //    this.setState({ pro_id: User.id ,token: User.token, ven_id: venUser.id, ventoken: venUser.token},() => {
    //     this.inbox()
    //    })
    //  } catch (error) {
    //  }      
    // }

    isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    inbox() {
        // this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.GETMESSAGELIST + '?pro_id=' + this.state.pro_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token
            },
        }).then((response) => {
            if (this.isJson(response._bodyInit)) {
                return response.json()
            } else {
                return response.text()
            }
        }).then((responseJson) => {
            console.log("Meassage..................", responseJson);
            this.setState({ loading: false, messageList: responseJson.results });
            this.forceUpdate()
            // alert(JSON.stringify(responseJson))
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Meassage Error : ", error);
            });
    }

    inboxVenue() {
       
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.VENUEGETMESSAGELIST + '?ven_id=' + this.state.ven_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.ventoken
            },
        }).then((response) => {
            if (this.isJson(response._bodyInit)) {
                return response.json()
            } else {
                return response.text()
            }
        }).then((responseJson) => {
            console.log("Meassage..................", responseJson);
            this.setState({ loading: false, messageListVenue: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Meassage Error : ", error);
            });
    }


    common = () => {
        this.inbox()
        this.inboxVenue()
    }
    render() {
        return (
            <View style={styles.container1}>
                <View style={styles.tabsContainer}>
                    <View
                        style={[styles.tabContainer]}>
                        <Text style={styles.tabText1}>
                            Inbox
                  </Text>
                    </View>
                </View>

                {/* <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Text>Messages not available</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GetStartedAnimation')}>
                        {/* <Text style={{color:'#A16E78'}}>  Sign in </Text> */}
                {/* </TouchableOpacity>
                </View> */}

                <ScrollView>
                    <View>

                        {this.state.ven_id == "" || this.state.token == "" ?
                            <FlatList
                                data={this.state.messageList}
                                renderItem={({ item }) =>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatSection', { item: item })}>
                                        <View style={styles.flatview}>
            <Image borderRadius={25} style={{ width: 50, height: 50, borderRadius: 25 }} source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ? require('../../Assets/img/Person.png') :
                            { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></Image>
                                            <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, color: 'gray' }}>{item.ven_title}</Text>
                                                    {/* <Text style={{ fontSize: 13, color:'gray' }}>{item.pm_latest_date}</Text> */}
                                                </View>
                                                {/* <Text style={styles.nameVenue}>{item.pm_from}</Text> */}
                                                <Text numberOfLines={1} style={styles.emailVenue}>{item.pm_subject}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.image}
                            />
                            :
                            <FlatList
                                data={this.state.messageListVenue}
                                renderItem={({ item }) =>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatSection', { item: item })}>
                                        <View style={styles.flatview}>
                                            <Image borderRadius={25} style={{ width: 50, height: 50, borderRadius: 25 }}  source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ? require('../../Assets/img/Person.png') :
                            { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}>
                                            </Image>
                                            <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, color: 'gray' }}>{item.pro_title}</Text>
                                                    {/* <Text style={{ fontSize: 13, color:'gray' }}>{item.pm_latest_date}</Text> */}
                                                </View>
                                                {/* <Text style={styles.nameVenue}>{item.pm_from}</Text> */}
                                                <Text numberOfLines={1} style={styles.emailVenue}>{item.pm_subject}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.image}
                            />
                        }
                    </View>
                </ScrollView>
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
        )
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20
    },
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    tabText1: {
        marginTop: 20,
        color: '#A16E78',
        fontSize: 20,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1
    },

    flatview: {
        //alignSelf: 'center',
        //justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 20,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(121,121,121)',
        marginLeft: 20,
        marginRight: 20
    },
    nameVenue: {
        // color: 'rgb(161, 110, 120)',
        fontSize: 15,
        fontWeight: '400',
        fontFamily: 'Verdana',
        color: 'black'

    },
    emailVenue: {
        marginTop: 8,
        fontSize: 13,
        color: 'grey',
        marginRight: 40
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,52,52,0.5)"
    },
});

AppRegistry.registerComponent('uGigs', () => Inbox);