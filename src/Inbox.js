import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TouchableOpacity, ImageBackground, FlatList, ScrollView, AppRegistry,AsyncStorage } from 'react-native';
import { Icon, Rating, AirbnbRating } from 'react-native-elements';
import appConstant from '../src/screens/common/appConstant';

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
            ven_id:'',
            pro_id:'',
            loading: false
        }
    }
    async componentWillMount() {
        try {
            const pro_id = await AsyncStorage.getItem('Pro_Id');
            const ven_id = await AsyncStorage.getItem('Ven_Id');
            this.setState({ ven_id: ven_id })
            this.setState({ pro_id: pro_id })
            // alert(this.state.pro_id)
        } catch (error) {
        }
        this.inbox()
    }


    inbox() {
        
            this.setState({ loading: true });
     
        fetch(appConstant.BASE_URL + appConstant.GETMESSAGELIST + this.state.ven_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Meassage..................", responseJson);
                this.setState({ loading: false, results: responseJson.results });
                console.log(responseJson.results)
                return responseJson;
            })
            .catch((error) => {
               
                console.log("Meassage Error : ", error);
            });
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

                <ScrollView>
                    <View>
                        <FlatList
                            data={this.state.results}
                            renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatSection',{item:item})}>
                                <View style={styles.flatview}>
                                    <Image borderRadius={25} style={{ width: 50, height: 50, borderRadius: 25 }} source={require('./Assets/img/Person.png')}></Image>
                                    <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                            <Text style={{ fontSize: 16, color: 'gray' }}>{item.pro_title}</Text>
                                            {/* <Text style={{ fontSize: 13, color:'gray' }}>{item.pm_latest_date}</Text> */}
                                        </View>
                                        <Text style={styles.nameVenue}>{item.pm_from}</Text>
                                        <Text style={styles.emailVenue}>{item.pm_subject}</Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.image}
                        />
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
        backgroundColor: "#fff"
    },
});

AppRegistry.registerComponent('uGigs', () => Inbox);