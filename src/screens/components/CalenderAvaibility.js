import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Picker, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';
import DatePicker from 'react-native-datepicker';
import ModalDropdown from 'react-native-modal-dropdown';

export default class CalenderAvaibility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ven_id: '',
      password: '',
      confirm_password: '',
      venueType: '',
      artistType1: '',
      artistType2: '',
      loading: false
    }
    this.addUnavilabelDate = this.addUnavilabelDate.bind(this);
  }

  async componentWillMount() {
    try {
        const data = await AsyncStorage.getItem('User');
        const User = JSON.parse(data)
        console.log("User", User)
        // alert(JSON.stringify(User.id))
        this.setState({ pro_id: User.id, token: User.token }, () => {
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

  isValidPassword(pwd) {
    if (pwd.length < 6) {
      return false;
    }
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*?]{4,}$/;
    return re.test(pwd);
  }
  addUnavilabelDate() {
    // alert(JSON.stringify(this.state.date));
    this.setState({ loading: true })

    let formdata = new FormData();
    formdata.append("date", this.state.date)
    formdata.append("pro_id", parseInt(this.state.pro_id))

    fetch(appConstant.BASE_URL + appConstant.ADDUNAVAILABLEDATE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        // alert(JSON.stringify(responseJson.message))
        // console.log("Accept........", responseJson);

        this.setState({ loading: false }, () => {
          // setTimeout(() => {

            if (responseJson.success_code == 0) {
              this.props.navigation.navigate('ArtistPenddingGigs')
              // alert(responseJson.message)

            }
            else {
              alert(responseJson.message)
            }
          // }, 1000)
        });

        return responseJson;
      })

      .catch((error) => {
        this.setState({ loading: false });
      });
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
      <View style={{ padding: 15 }}>

        
          <DatePicker
            style={{ width: 350, }}
            date={this.state.date}
            minDate={new Date(Date.now())}
            mode="date"
            fontSize={18}
            placeholder="Date"
            placeholderTextColor="#A16E78"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            color='#A16E78'
            customStyles={{
              dateIcon: {
                height: 0,
                width: 0
              },
              dateInput: {
                borderWidth: 0,
                alignItems: 'flex-start',
                color: '#6F8792'
              },
              dateText: {
                color: '#6F8792'
              },
              placeholderText: {
                color: '#6F8792',
                fontSize: 18,
              },

            }}
            onDateChange={(date) => { this.setState({ date: date }) }}
          />
        

        <TouchableOpacity style={styles.TouchableSign_in} onPress={this.addUnavilabelDate}>
          <Text style={styles.TouchableSign_in_Text}>ADD</Text>
        </TouchableOpacity>
      </View>
    )
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
    marginLeft: 20,
    marginRight: 20
  },

  tabContainer: {
    flex: 1,
    padding: 20,
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
    fontWeight: '500',

  },
  TouchableEdit_in_Text_Notes: {
    fontSize: 15,
    textAlign: 'left',
    padding: 9,
    color: '#727272',
    fontWeight: '500',
    height: 150
  },
  TouchableVenueEdit: {
    borderRadius: 10,
    backgroundColor: 'rgb(111, 135, 146)',
    marginTop: 16
  },
});
AppRegistry.registerComponent('uGigs', () => CalenderAvaibility);