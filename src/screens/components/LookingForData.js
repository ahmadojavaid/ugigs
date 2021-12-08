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

export default class LookingForData extends React.Component {
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
            messageList: '',
            loading: false,
            venueLookingFor: '',
        }
    }

    async componentWillMount() {
       
        try {
            const vendata = await AsyncStorage.getItem('VenUser');
            const venUser = JSON.parse(vendata)
            console.log("VenUser", venUser)
            this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {

                this.venueLookingForGigs()

            })
            // alert(token)
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

    venueLookingForGigs() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.VENUEGETLOOKINGFOR + '?ven_id=' + this.state.ven_id, {
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
            // alert(JSON.stringify(responseJson))
            console.log("Venue Looking for..................", responseJson);

            this.setState({ loading: false, venueLookingFor: responseJson.results });
            this.forceUpdate();
            
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Venue Looking for Error : ", error);
            });
    }


    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Looking For",
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
        headerTintColor: '#6F8792',
      });

    render() {

        return (
                <ScrollView>
                    <View>
                        <FlatList
                            data={this.state.venueLookingFor}
                            renderItem={({ item }) =>
                                <View style={styles.flatview}>
                                    <Image borderRadius={3} style={{ height: 100, width: 100 }} source={item.ven_thumb_path == null ? require('../../Assets/img/placeholder.png') :
                                        { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></Image>
                                    <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                        <Text style={styles.nameVenue}>{item.look_type1}</Text>
                                        <Text style={styles.emailVenue}>Date:</Text>
                                        <Text style={{ marginTop: 10, color: 'grey' }}>{item.look_date} </Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SendMessageVenue')}>
                                            <Text style={{ marginTop: 10, color: '#6F8792',fontWeight: '600' }}>Enquire</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            keyExtractor={item => item.image}
                        />
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
                </ScrollView>
                
            
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

AppRegistry.registerComponent('uGigs', () => LookingForData);