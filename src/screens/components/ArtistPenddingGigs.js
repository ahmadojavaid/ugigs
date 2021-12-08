import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    ScrollView,
    Dimensions,
    ImageBackground,
    AppRegistry,
    Modal,
    AsyncStorage,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard, TextInput
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';
import BouncingPreloader from 'react-native-bouncing-preloader';
import moment from 'moment';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { Content, } from 'native-base';
import DatePicker from 'react-native-datepicker';
import EventCalendar from 'react-native-events-calendar';
import CalendarPicker from 'react-native-calendar-picker';

const screen = Dimensions.get('window')

const icons = [
    require('../../Assets/img/images2.png'),
    require('../../Assets/img/images2.png')
]


class Tabs extends Component {
    state = {
        activeTab: 0,
        activeTab1: 1,

    }

    render({ children } = this.props) {
        return (
            <View style={styles.container1}>

                <View style={styles.tabsContainer}>

                    {children.map(({ props: { title, title1, title2 } }, index) =>

                        <TouchableOpacity
                            style={[styles.tabContainer,
                            index === this.state.activeTab ? styles.tabContainerActive : [],
                            ]}
                            onPress={() => this.setState({ activeTab: index })}
                            key={index}>
                            <Text style={styles.tabText1}>
                                {title}
                            </Text>
                            <Text style={styles.tabText2}>
                                {title1}
                            </Text>
                            <Text style={styles.tabText1}>
                                {title2}
                            </Text>
                        </TouchableOpacity>
                    )}

                </View>
                <View style={styles.contentContainer}>
                    {children[this.state.activeTab]}
                </View>
            </View>
        );
    }
}

LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'en';

const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(15, 'days').format(_format)

export default class ArtistPenddingGigs extends Component {
    initialState = {
        [_today]: { disabled: true }
    }
    constructor() {
        super();
        this.state = {
            calendar_id: '',
            calendar_date: '',
            calendar_approve: '',
            calendar_message: '',
            calendar_approve_message: '',
            ven_id: '',
            ven_title: '',
            ven_content1: '',
            ven_thumb_path: '',
            pro_thumb_path: '',
            pro_region: '',
            pro_url: '',
            pro_title: '',
            look_date: '',
            look_id: '',
            look_type1: '',
            look_note: '',
            activeView: 0,
            selected: 'Pendding',
            selectedVenue: 'LookingVenue',
            ArtistDate: '',
            isLoading: true,
            downloading: false,
            loading: false,
            token: '',
            artistPending: [],
            artistUpcoming: [],
            artistPrevious: [],
            venueLookingFor: [],
            venuePendding: [],
            venueUpcoming: [],
            pro_id: '',
            venuePrevious: [],
            ventoken: '',
            date: '',
            getUnavailabeldates: [],
            chosenDate: new Date(),
            isDateTimePickerVisible: false,
        };
        this.setDate = this.setDate.bind(this);
        this.artistUpcomingGigs = this.artistUpcomingGigs.bind(this);
        this.artistPendingGigs = this.artistPendingGigs.bind(this);
        this.venueLookingForGigs = this.venueLookingForGigs.bind(this);
        this.getUnavailableDate = this.getUnavailableDate.bind(this);
        // this.addUnavailableDate = this.addUnavailableDate.bind(this);

    }

    async componentWillMount() {
        try {
            const data = await AsyncStorage.getItem('User');
            const User = JSON.parse(data)
            console.log("User", User.token)
            this.setState({ pro_id: User.id, token: User.token }, () => {
                this.artistPreviousGigs()
                this.artistUpcomingGigs()
                this.artistPendingGigs()
                this.getUnavailableDate()

            })
        } catch (error) {
        }

        try {
            const vendata = await AsyncStorage.getItem('VenUser');
            const venUser = JSON.parse(vendata)
            console.log("VenUser", venUser)
            this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {
                // this.venueOnLookingForClick()
                this.venueLookingForGigs()
                this.venuePendingInvites()
                this.venuePreviousGigs()
                this.venueUpcomingGigs()
            })
            // alert(token)
        } catch (error) {
        }
    }
    state = {
        isDateTimePickerVisible: false
    };
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        this.hideDateTimePicker();
    };

    setDate(newDate) {
        var dateObj = new Date(newDate);
        var momentObj = moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        this.setState({ Artistdate: momentString });
    }


    onDaySelect = (day) => {
        const _selectedDay = moment(day.dateString).format(_format);
        // let marked = true;
        let markedDates = {}
        if (this.state._markedDates[_selectedDay]) {
            markedDates = this.state._markedDates[_selectedDay];
            markedDates = { selectedColor: '#A16E78' };
        }
        else {
            markedDates = !this.state._markedDates[_selectedDay];
            markedDates = { selected: markedDates, selectedColor: '#A16E78' };
        }

        // markedDates = { selected: markedDates, selectedColor: '#A16E78' };
        const updatedMarkedDates = { ...this.state._markedDates, ...{ [_selectedDay]: markedDates } }
        this.setState({ _markedDates: updatedMarkedDates, date: _selectedDay });
    }


    getUnavailableDate() {
        this.setState({ loading: true, });
        fetch(appConstant.BASE_URL + appConstant.GETUNAVAILABELDATE + '?pro_id=' + this.state.pro_id, {
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
            console.log("Artist getUnavailabelDate . . . ", responseJson);
            this.setState({ loading: false, getUnavailabeldates: responseJson.results });
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("artist getUnavailabelDate Error : ", error);
            });
    }

    addUnavailableDate() {
        this.setState({ loading: true });
        let formdata = new FormData();
        formdata.append("date", this.state.Artistdate);
        formdata.append("pro_id", this.state.pro_id);

        fetch(appConstant.BASE_URL + appConstant.ADDUNAVAILABELDATE, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token
            },
            body: formdata,
        }).then((response) => {
            if (this.isJson(response._bodyInit)) {
                return response.json()
            } else {
                return response.text()
            }
        }).then((responseJson) => {
            console.log("Artist AddUnavailableDate", responseJson);
            this.setState({ loading: false, artistAddUnavailableDate: responseJson.results });
            this.getUnavailableDate()
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Artist AddUnavailableDate error  : ", error);
            });
    }


    artistUpcomingGigs() {
        this.setState({ loading: true, });
        fetch(appConstant.BASE_URL + appConstant.GETUPCOMINGGIGS + '?pro_id=' + this.state.pro_id, {
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
            this.setState({ loading: false, artistUpcoming: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("artist upcoming Error : ", error);
            });
    }

    artistPendingGigs() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.GETPENDINGGIGS + '?pro_id=' + this.state.pro_id, {
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
            this.setState({ loading: false, artistPending: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("artist Pending Error : ", error);
            });
    }

    artistPreviousGigs() {
        this.setState({ loading: false });
        fetch(appConstant.BASE_URL + appConstant.GETPREVIOUSGIGS + '?pro_id=' + this.state.pro_id, {
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
            console.log("Artist Previous..................", responseJson);
            this.setState({ loading: false, artistPrevious: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("artist Previous Error : ", error);
            });
    }


    venueLookingForGigs() {
        this.setState({ loading: false });
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
    venuePendingInvites() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.GETVENUEPENDINGINVITES + '?ven_id=' + this.state.ven_id, {
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
            console.log("Venue Pending..................", responseJson);
            this.setState({ loading: false, venuePendding: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Venue Pending Error : ", error);
            });
    }
    venueUpcomingGigs() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.GETVENUEUPCOMINGGIGS + '?ven_id=' + this.state.ven_id, {
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
            console.log("Venue Upcoming..................", responseJson);
            this.setState({ loading: false, venueUpcoming: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Venue Upcoming Error : ", error);
            });
    }
    venuePreviousGigs() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.GETVENUEPREVIOUSGIGS + '?ven_id=' + this.state.ven_id, {
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
        }).then(async (responseJson) => {
            console.log("Venue Previous..................", responseJson);
            this.setState({ loading: false, venuePrevious: responseJson.results });
            this.forceUpdate()
            console.log(responseJson.results)
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Venue PreviousError : ", error);
            });
    }
    isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    async OnClickAccept(calendar_id) {

        let formdata = new FormData();
        formdata.append("calendar_id", calendar_id)
        formdata.append("pro_id", this.state.pro_id)

        fetch(appConstant.BASE_URL + appConstant.ARTISTACCEPTGIG, {
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
            console.log("Accept........", responseJson);
            this.artistPendingGigs()
            return responseJson;
        })
            .catch((error) => {
                console.log('accept error. . . . . . .', responseJson)
                this.setState({ loading: false });
            });
    }


    async OnClickReject(calendar_id) {
        let formdata = new FormData();
        formdata.append("calendar_id", calendar_id)
        formdata.append("pro_id", this.state.pro_id)
        formdata.append("message", '')


        fetch(appConstant.BASE_URL + appConstant.ARTISTREJECTGIG, {
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
            console.log("Reject........", responseJson);
            this.artistPendingGigs()
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }

    async VenueOnClickAccept(calendar_id) {
        let formdata = new FormData();
        formdata.append("calendar_id", calendar_id)
        formdata.append("ven_id", this.state.ven_id)
        fetch(appConstant.BASE_URL + appConstant.VENUEACCEPTGIGS, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.ventoken
            },
            body: formdata
        }).then((response) => {
            if (this.isJson(response._bodyInit)) {
                return response.json()
            } else {
                return response.text()
            }
        }).then((responseJson) => {
            console.log("Accept........", responseJson);
            this.venuePendingInvites();
            return responseJson;
        })
            .catch((error) => {
                console.log('accept error. . . . . . .', responseJson)
                this.setState({ loading: false });
            });
    }

    async VenueOnClickReject(calendar_id) {
        let formdata = new FormData();
        formdata.append("calendar_id", calendar_id)
        formdata.append("ven_id", this.state.ven_id)
        formdata.append("message", '')
        fetch(appConstant.BASE_URL + appConstant.VENUEREJEVTGIGS, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.ventoken
            },
            body: formdata
        }).then((response) => {
            if (this.isJson(response._bodyInit)) {
                return response.json()
            } else {
                return response.text()
            }
        }).then((responseJson) => {
            console.log("Reject........", responseJson);
            this.venuePendingInvites()
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }



    async artistDateListDelete(calendar_id) {
        let formdata = new FormData();
        formdata.append("calendar_id", calendar_id)
        fetch(appConstant.BASE_URL + appConstant.DELETEUNAVAILABLEDATE, {
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
            console.log("Reject........", responseJson);
            this.getUnavailableDate()
            return responseJson;
        })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }



    rightButtons = (markData) => {
        let self = this
        return [
            {
                component:
                    <TouchableOpacity onPress={() => self.markCompleted(markData)} style={{
                        backgroundColor: 'green',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        paddingRight: 20
                    }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>Accept</Text>
                        </View>
                    </TouchableOpacity>,
                backgroundColor: 'green',
            }]
    }

    markCompleted() {
        alert('Sucessfully')
    }

    _renderItem = ({ item, index }) => {

        console.log("render_item:", JSON.stringify(item) + index);

        return (

            <Swipeout style={{ backgroundColor: 'white' }} autoClose={true}
                right={[
                    {
                        text: 'Accept',
                        onPress: () => this.OnClickAccept(item.calendar_id),
                        backgroundColor: 'green'
                    },
                    {
                        text: 'Reject',
                        onPress: () => this.OnClickReject(item.calendar_id),
                        backgroundColor: 'red'
                    }
                ]}
            // right={this.rightButtons(FlatListdata1)}
            >
                <View style={styles.flatview}>
                    <ImageBackground borderRadius={3} style={{ height: 100, width: 100, }} source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                        { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></ImageBackground>
                    <View style={{ flex: 1, marginStart: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.name}>{item.ven_title} </Text>
                            {this.state.selected != 'Pendding' ?
                                <Icon onPress={() => this.props.navigation.navigate('ArtistReview')} style={{ marginLeft: '5%' }} name='comment' type='font-awesome' size={25} color='#a9a9a9'></Icon>
                                :
                                null}

                        </View>
                        <Text style={styles.email}>Date:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>
                        </View>
                        <View>
                            <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date}</Text>
                        </View>
                    </View>
                </View>
            </Swipeout>
        );
    }


    _renderItemArtistUpcomning = ({ item, index }) => {

        console.log("render_item:", JSON.stringify(item) + index);

        return (
            <View>
                {this.state.pro_id == "" || this.state.token == "" ?
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('VenueLookingFor')}>
                            <Text style={{ alignSelf: 'center', fontSize: 20, color: '#6F8792', fontWeight: '600' }} >Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.flatview}>
                        <ImageBackground borderRadius={3} style={{ height: 100, width: 100, }} source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                            { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></ImageBackground>
                        <View style={{ flex: 1, marginStart: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <Text style={styles.name}>{item.ven_title}</Text>

                                <Icon onPress={() => this.props.navigation.navigate('SendMessageVenue', { item: item })} style={{ marginLeft: '5%' }} name='comment' type='font-awesome' size={25} color='#a9a9a9'></Icon>

                            </View>
                            <Text style={styles.email}>Reserved Date:</Text>
                            <View style={{ flexDirection: 'row' }}>

                                <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>
                            </View>
                            <View>
                                <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date}</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        );

    }


    _renderItemArtistPrevious = ({ item, index }) => {

        console.log("render_item:", JSON.stringify(item) + index);

        return (

            <View style={styles.flatview}>
                <ImageBackground borderRadius={3} style={{ height: 100, width: 100, }} source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                    { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></ImageBackground>
                <View style={{ flex: 1, marginStart: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <Text style={styles.name}>{item.ven_title}</Text>
                        <Icon onPress={() => this.props.navigation.navigate('ArtistReview', { item: item })} style={{ marginLeft: '5%' }} name='star' type='font-awesome' size={25} color='#a9a9a9'></Icon>
                    </View>
                    <Text style={styles.email} >Booked:</Text>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>
                    </View>
                    <View>
                        <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date}</Text>
                    </View>
                </View>
            </View>

        );

    }

    _renderItemVenuePending = ({ item, index }) => {

        console.log("render_item:", JSON.stringify(item) + index);

        return (
            <View style={styles.flatview}>
                <ImageBackground borderRadius={3} style={{ height: 100, width: 100 }} source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                    { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}></ImageBackground>
                <View style={{ flexDirection: 'column', marginStart: 10, paddingBottom: 5 }}>
                    <Text style={styles.nameVenue}>{item.pro_title}</Text>
                    <Text style={styles.emailVenue}>Booked</Text>

                    <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>

                    <View>
                        <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date} </Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderItemVenuePrevious = ({ item, index }) => {

        console.log("render_item:", JSON.stringify(item) + index);

        return (

            <View style={styles.flatview}>
                <ImageBackground borderRadius={3} style={{ height: 100, width: 100 }} source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                    { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}></ImageBackground>
                <View style={{ flexDirection: 'column', marginStart: 10, paddingBottom: 5, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.nameVenue}>{item.pro_title}</Text>
                        <Icon onPress={() => this.props.navigation.navigate('ArtistReview', { item: item })} style={{ marginLeft: '5%' }} name='star' type='font-awesome' size={25} color='#a9a9a9'></Icon>
                    </View>
                    <Text style={styles.emailVenue}>Booked:</Text>
                    <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>

                    <View>
                        <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date} </Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderItemVenueUpcomnig = ({ item, index }) => {

        console.log("render_item:", JSON.stringify(item) + index);

        return (
            <View style={styles.flatview}>
                <ImageBackground borderRadius={3} style={{ height: 100, width: 100 }} source={item.pro_thumb_path == null ? require('../../Assets/img/placeholder.png') :
                    { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}></ImageBackground>
                <View style={{ flexDirection: 'column', marginStart: 10, paddingBottom: 5, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.nameVenue}>{item.pro_title}</Text>
                        <Icon onPress={() => this.props.navigation.navigate('SendMessage', { item: item })} style={{ marginLeft: '5%' }} name='comment' type='font-awesome' size={25} color='#a9a9a9'></Icon>
                    </View>
                    <Text style={styles.emailVenue} >Reserved Date:</Text>
                    <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>
                    <View>
                        <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date}</Text>
                    </View>
                </View>
            </View>
        );
    }

    _renderItemLookingFor = ({ item, index }) => {
        return (
            <View>
                {index == 0 ?
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('VenueLookingFor')}>
                            <Text style={{ alignSelf: 'center', fontSize: 20, color: '#6F8792', fontWeight: '600' }} >Create New</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        {this.state.ven_id == "" ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: 'grey' }}>You must be Sign in to use this feature. </Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('GetStartedAnimation')}>
                                    <Text style={{ marginTop: 10, color: '#6F8792', fontWeight: 'bold', }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <Swipeout style={{ backgroundColor: 'white' }} autoClose={true}
                                right={[
                                    {
                                        text: 'Accept',
                                        onPress: () => this.VenueOnClickAccept(item.calendar_id),
                                        backgroundColor: 'green'
                                    },
                                    {
                                        text: 'Reject',
                                        onPress: () => this.VenueOnClickReject(item.calendar_id),
                                        backgroundColor: 'red'
                                    }
                                ]}
                            >
                                <View style={styles.flatview}>
                                    <Image borderRadius={3} style={{ height: 100, width: 100 }} source={item.ven_thumb_path == null ? require('../../Assets/img/placeholder.png') :
                                        { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></Image>
                                    <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                        <Text style={styles.nameVenue}>{item.look_type1}</Text>
                                        <Text style={styles.emailVenue}>Date:</Text>
                                        <Text style={{ marginTop: 10, color: 'grey' }}>{item.look_date} </Text>
                                    </View>
                                </View>
                            </Swipeout>
                        }
                    </View>

                }
            </View>

        )
    }

    artistOnUpcomingClick = () => {
        this.setState({ selected: 'Upcoming' })
        this.artistUpcomingGigs()
    }

    artistOnPreviousClick = () => {
        this.setState({ selected: 'Previous' })
        this.artistPreviousGigs()
    }
    venueOnPendingClick = () => {
        this.setState({ selectedVenue: 'PendingInvites' })
        this.venuePendingInvites()
    }
    venueOnUpcomingClick = () => {
        this.setState({ selectedVenue: 'UpcomingVenue' })
        this.venueUpcomingGigs()
    }

    venueOnPreviousClick = () => {
        this.setState({ selectedVenue: 'PreviousVenue' })
        this.venuePreviousGigs()
    }

    render() {
        const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
        return (
            <View style={styles.container}>

                <Tabs>
                    <View title="Artist" style={styles.content}>

                        <View style={styles.buttonVenue}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ selected: 'Pendding' })} >
                                <Text style={[styles.touchabletitleVenue, { color: this.state.selected == 'Pendding' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }]}>Pending</Text>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selected == 'Pendding' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }}>Gigs</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 1 }}
                                active={this.state.activeIndex == 0} onPress={() => this.artistOnUpcomingClick()}>
                                <Text style={[styles.touchabletitleVenue, { color: this.state.selected == 'Upcoming' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }]}>Upcoming</Text>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selected == 'Upcoming' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }}>Gigs</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.artistOnPreviousClick()}>
                                <Text style={[styles.touchabletitleVenue, { color: this.state.selected == 'Previous' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }]}>Previous</Text>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selected == 'Previous' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }}>Gigs</Text>
                            </TouchableOpacity>

                        </View>

                        {this.state.selected == 'Pendding' ?
                            <FlatList 
                                renderItem={this._renderItem}
                                extraData={this.state}
                                data={this.state.artistPending}
                                keyExtractor={item => item.id}
                            />
                            : this.state.selected == 'Upcoming' ?
                                <FlatList
                                    renderItem={this._renderItemArtistUpcomning}
                                    extraData={this.state}
                                    data={this.state.artistUpcoming}
                                    keyExtractor={item => item.id}
                                /> : this.state.selected == 'Previous' ?
                                    <FlatList
                                        renderItem={this._renderItemArtistPrevious}
                                        extraData={this.state}
                                        data={this.state.artistPrevious}
                                        keyExtractor={item => item.id}
                                    /> : null}

                    </View>

                    <View title1="Venue" style={styles.content}>

                        <View style={styles.buttonVenue}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ selectedVenue: 'LookingVenue' })}  >
                                    <Text style={[styles.touchabletitleVenue, { color: this.state.selectedVenue == 'LookingVenue' ? '#6F8792' : 'rgb(211,211,211)' }]}>Looking</Text>
                                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selectedVenue == 'LookingVenue' ? '#6F8792' : 'rgb(211,211,211)' }}>for</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.venueOnPendingClick()}>
                                    <Text style={[styles.touchabletitleVenue, { color: this.state.selectedVenue == 'PendingInvites' ? '#6F8792' : 'rgb(211,211,211)' }]}>Pending </Text>
                                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selectedVenue == 'PendingInvites' ? '#6F8792' : 'rgb(211,211,211)' }}>Invites</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.venueOnUpcomingClick()}>
                                    <Text style={[styles.touchabletitleVenue, { color: this.state.selectedVenue == 'UpcomingVenue' ? '#6F8792' : 'rgb(211,211,211)' }]}>Upcoming </Text>
                                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selectedVenue == 'UpcomingVenue' ? '#6F8792' : 'rgb(211,211,211)' }}>Gigs</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.venueOnPreviousClick()}>
                                    <Text style={[styles.touchabletitleVenue, { color: this.state.selectedVenue == 'PreviousVenue' ? '#6F8792' : 'rgb(211,211,211)' }]}>Previous</Text>
                                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selectedVenue == 'PreviousVenue' ? '#6F8792' : 'rgb(211,211,211)' }}>Gigs</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        {this.state.selectedVenue == 'LookingVenue' ?
                            <FlatList
                                renderItem={this._renderItemLookingFor}
                                extraData={this.state}
                                data={this.state.venueLookingFor}
                                keyExtractor={item => item.id}
                            />
                            :
                            this.state.selectedVenue == 'PendingInvites' ?
                                <FlatList
                                    renderItem={this._renderItemVenuePending}
                                    extraData={this.state}
                                    data={this.state.venuePendding}
                                    keyExtractor={item => item.id}
                                />
                                :
                                this.state.selectedVenue == 'UpcomingVenue' ?
                                    <FlatList
                                        renderItem={this._renderItemVenueUpcomnig}
                                        extraData={this.state}
                                        data={this.state.venueUpcoming}
                                        keyExtractor={item => item.id}
                                    />
                                    :
                                    this.state.selectedVenue == 'PreviousVenue' ?
                                        <FlatList
                                            renderItem={this._renderItemVenuePrevious}
                                            extraData={this.state}
                                            data={this.state.venuePrevious}
                                            keyExtractor={item => item.id}
                                        />
                                        :
                                        null}
                    </View>
                    <View title="Calender" style={styles.content}>

                        <Content style={{ height: 50 }}>
                            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
                                <View style={styles.container}>

                                    <Calendar
                                        style={{
                                            borderColor: 'gray',
                                            height: 350
                                        }}
                                        theme={{
                                            backgroundColor: '#ffffff',
                                            calendarBackground: '#ffffff',
                                            textSectionTitleColor: '#b6c1cd',
                                            selectedDayBackgroundColor: '#00adf5',
                                            selectedDayTextColor: '#ffffff',
                                            todayTextColor: '#A16E78',
                                            dayTextColor: '#2d4150',
                                            textDisabledColor: '#d9e1e8',
                                            arrowColor: '#A16E78',
                                            monthTextColor: '#727272',
                                            textDayFontWeight: '300',
                                            textMonthFontWeight: 'bold',
                                            textDayHeaderFontWeight: '300',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 16,
                                            textDayHeaderFontSize: 16
                                        }}
                                        markedDates={{
                                            '2019-06-11': { dots: [vacation], selected: true, selectedColor: '#A16E78' },

                                        }}
                                        minDate={_today}
                                        // maxDate={_maxDate}
                                        // hideArrows={true}
                                        onDayPress={this.onDaySelect}
                                        markedDates={this.state._markedDates}
                                    />
                                    <TouchableOpacity>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#A16E78', marginLeft: '5%', marginRight: '5%', marginTop: 30, height: 45, borderRadius: 10 }}>
                                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Add</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </Content>



                        {/* <Content style={{ height: 50 }}>
                            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
                                <View style={styles.container}>


                                    <View style={{ padding: 20 }}>
                                        <Text style={{ paddingVertical: 3, fontSize: 18, color: '#A16E78', fontWeight: '600' }}>Add more unavailable dates</Text>
                                        <View style={{ backgroundColor: '#A16E78', padding: 5, borderRadius: 10, flexDirection: 'row' }}>
                                            <DatePicker
                                                style={{ width: 350 }}
                                                date={this.state.Artistdate}
                                                minDate={new Date(Date.now())}
                                                mode="date"
                                                fontSize={18}
                                                placeholder="Date"
                                                placeholderTextColor="#A16E78"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: {
                                                        height: 0,
                                                        width: 0
                                                    },
                                                    dateInput: {
                                                        borderWidth: 0,
                                                        alignItems: 'flex-start',
                                                        color: 'white'
                                                    },
                                                    dateText: {
                                                        color: 'white'
                                                    },
                                                    placeholderText: {
                                                        color: 'white',
                                                        fontSize: 18,
                                                        marginLeft: 10,
                                                        fontWeight: '600'
                                                    }
                                                }}
                                                onDateChange={(date) => { this.setDate(date) }}
                                            />

                                        </View>
                                    </View>


                        <View style={{ paddingHorizontal: 90 }}>
                        <TouchableOpacity style={{ backgroundColor: '#A16E78', borderRadius: 10 }} onPress={() => this.addUnavailableDate()}>
                          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', padding: 6 }}>Add</Text>
                          </TouchableOpacity>
                      </View>



                                    <View style={{ padding: 20 }}>
                                        <View style={{ justifyContent: 'space-around', flexDirection: 'row', backgroundColor: 'lightgrey', padding: 10 }}>
                                            <Text style={{ fontSize: 18, fontWeight: '500', color: '#A16E78' }}>Date</Text>
                                            <Text style={{ fontSize: 18, fontWeight: '500', color: '#A16E78' }}>Venue/Unavailable </Text>
                                        </View>
                                    </View>


                                    <FlatList
                                        data={this.state.getUnavailabeldates}

                                        renderItem={({ item, index }) =>

                                            <View style={{ paddingHorizontal: 20 }}>
                                                <Swipeout style={{ backgroundColor: 'white' }} autoClose={true}
                                                    right={[
                                                        {
                                                            text: 'Delete',
                                                            onPress: () => this.artistDateListDelete(item.calendar_id),
                                                            backgroundColor: 'red'
                                                        }
                                                    ]}>
                                                    <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 20 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#6F8792' }}>{item.calendar_date}</Text>
                                                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#6F8792' }}>{item.calendar_id}</Text>
                                                    </View>
                                                    <View style={{ height: 1, backgroundColor: '#A16E78' }}></View>
                                                </Swipeout>
                                            </View>

                                        }
                                    />


                                </View>
                            </TouchableWithoutFeedback>
                            <Modal
                                transparent={true}
                                animationType={'none'}
                                visible={this.state.loading}
                            >
                                <View style={styles.loader}>
                                    <ActivityIndicator size="large" color='rgb(161,110,120)' animating={true} />
                                </View>
                            </Modal>
                        </Content>  */}
                    </View>
                </Tabs>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    buttonVenue: {
        flexDirection: 'row',
        backgroundColor: 'rgb(237,237,238)',
        padding: 10,
        height: 80,
        justifyContent: 'space-between',
    },
    touchabletitleVenue: {
        flexDirection: 'row',
        color: 'rgb(211,211,211)',
        fontSize: 19,
        textAlign: 'center',
        fontWeight: '400',
        marginLeft: 13
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
    },

    header: {
        margin: 10,
        color: 'white',
        fontFamily: 'Avenir',
        fontSize: 26,
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
        // marginLeft: 5,
        // marginRight: 5,
    },

    tabContainer: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabContainerActive: {
        borderBottomColor: '#A16E78',
    },

    tabText1: {
        color: '#A16E78',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tabText2: {
        color: '#6F8792',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tabContainerActive2: {
        borderBottomColor: '#6F8792',
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
        paddingVertical: 10,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(121,121,121)',
        marginLeft: 20,
        marginRight: 20,
    },
    name: {
        color: '#A16E78',
        fontWeight: '700',
        fontSize: 18
    },
    email: {
        marginTop: 8,
        fontSize: 15,
        color: 'grey'
    },
    nameVenue: {
        color: '#6F8792',
        fontSize: 32,
        fontWeight: '700',

        fontSize: 18
    },
    emailVenue: {
        marginTop: 8,
        fontSize: 15,
        color: 'grey'
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,52,52,0.5)"
    },
});


var swipeoutBtns = [
    {
        text: 'Accept',
        backgroundColor: 'green'
    },
    {
        text: 'Reject',
        backgroundColor: 'red'
    }
]

AppRegistry.registerComponent('uGigs', () => ArtistPenddingGigs);
