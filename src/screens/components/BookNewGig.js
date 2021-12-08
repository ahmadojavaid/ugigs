import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage, ScrollView } from 'react-native';
import { Icon, withBadge } from 'react-native-elements';
// import Calendar from 'react-native-calendar';
import moment from 'moment';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { Content, } from 'native-base';
import appConstant from '../common/appConstant';


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


export default class BookNewGig extends React.Component {
  initialState = {
    [_today]: { disabled: true }
  }
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      password: '',
      bookMessage: '',
      pro_id: this.props.navigation.state.params.item,
      calendar_id: this.props.navigation.state.params.item,
      ven_id: this.props.navigation.state.params.item,
      selectedStartDate: null,
      _markedDates: '',
      date: '',
      item: this.props.navigation.state.params.item,
      loading: false


    }
    // this.onDateChange = this.onDateChange.bind(this);
    this.callAddGigApi = this.callAddGigApi.bind(this);
    // alert(this.state.calendar_id); 
  }


  async componentWillMount() {
    // alert(JSON.stringify(this.state.ven_id));
    try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
      console.log("User", User.token)
      this.setState({ pro_id: User.id, token: User.token }, () => {
        this.getUnavilabelDate()
      })
    } catch (error) {
    }

    try {
      const vendata = await AsyncStorage.getItem('VenUser');
      const venUser = JSON.parse(vendata)
      console.log("VenUser", venUser)
      this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {
        
      })
    } catch (error) {
    }

  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Select Date",
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
        <Icon name='angle-left'
          type='font-awesome'
          size={35}
          color='#727272'
        />
      </TouchableOpacity>
    ),
    headerTintColor: '#A16E78',
  });


  callAddGigApi() {
    const formData = new FormData();

      formData.append('ven_id', this.state.ven_id);
      formData.append('pro_id', this.state.pro_id);
      formData.append('date', this.state.date);
      formData.append('message', this.state.message);
      // alert(JSON.stringify(formData));
    fetch(appConstant.BASE_URL + appConstant.VENUEBOOKGIGS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.ventoken
      },
      body:formData
    }).then((response) => {
      if (this.isJson(response._bodyInit)) {
        return response.json()
      } else {
        return response.text()
      }
    }).then((responseJson) => {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            if (responseJson.success_code == 0) {
              this.props.navigation.navigate('ArtistPenddingGigs')
              alert(responseJson.message)

            }
            else {
            }
          }, 100)
        });

        return responseJson;
      })

      .catch((error) => {
        this.setState({ loading: false });
      });
  }
  

  
  getUnavilabelDate() {
    fetch(appConstant.BASE_URL + appConstant.GETUNAVAILABLEDATELIST + '?pro_id=' + this.state.pro_id, {
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
        console.log("Accept........", responseJson);

        this.setState({ loading: false }, () => {
        });

        return responseJson;
      }) 

      .catch((error) => {
        console.log("catch........", responseJson);
        this.setState({ loading: false });
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



  
  render() {
    // const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
    return (
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
                '2019-06-11': { selected: true, selectedColor: '#A16E78'},

              }}
              minDate={_today}
              // maxDate={_maxDate}

              // hideArrows={true}
              onDayPress={this.onDaySelect}
              markedDates={this.state._markedDates}
            />


            <TextInput
              // multiline
              style={styles.passwordTextInput}
              placeholderTextColor="#727272"
              placeholder="Type your message"
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(bookMessage) => this.setState({ bookMessage })}>
            </TextInput>
            <TouchableOpacity onPress={this.callAddGigApi} >
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#A16E78', marginLeft: '5%', marginRight: '5%', marginTop: 30, height: 45, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Book</Text>
              </View>
            </TouchableOpacity>
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
      </Content>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
    padding: 10
  },
  passwordTextInput: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: '#e5e5e5',
    height: 50,
    padding: 10
  },
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52,52,52,0.5)"
  },
});
AppRegistry.registerComponent('uGigs', () => BookNewGig);
