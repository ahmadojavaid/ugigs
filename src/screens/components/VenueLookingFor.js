import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Picker, Image, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import appConstant from '../common/appConstant';
import DatePicker from 'react-native-datepicker';
import ModalDropdown from 'react-native-modal-dropdown'

const artistType = [
  'News',
  'Design',
  'Sales',
  'Marketing',
  'Customer Success',

];

export default class VenueLookingFor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ven_id: '',
      password: '',
      confirm_password: '',
      venueType: '',
      artistType1: '',
      artistType2: '',
      loading: false,
      typeOfArtist: [],
      typeOfVenue: [],
      typeOfObjectArtist: [],
    }
    this.venuePutLookingFor = this.venuePutLookingFor.bind(this);
    this.typeOfArtistList = this.typeOfArtistList.bind(this);
  }

  async componentWillMount() {
    this.typeOfArtistList()
    try {
      const data = await AsyncStorage.getItem('VenUser');
      const VenUser = JSON.parse(data)
      this.setState({ ven_id: VenUser.id, ventoken: VenUser.token }, () => {
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

  typeOfArtistList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.TYPEOFARTIST, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Type of artist", responseJson);
        this.setState({ loading: false });
        if (responseJson.success_code == 0) {
          this.state.typeOfObjectArtist = responseJson.results;
          responseJson.results.map((item, index) => {
            this.state.typeOfArtist.push(item.cat_name);
          })
        }
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("type of artist List Error : ", error);
      });
  }


  venuePutLookingFor() {
    this.setState({ loading: true });
    let formdata = new FormData();
    formdata.append("ven_id", this.state.ven_id)
    formdata.append("date", this.state.date)
    formdata.append("type1", this.state.typeOfArtistId)
    formdata.append("type2", this.state.typeOfArtistId1)
    formdata.append("type3", this.state.typeOfArtistId2)
    formdata.append("note", this.state.notes)

    fetch(appConstant.BASE_URL + appConstant.PUTLOOKINGFOR, {
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
      console.log("sucessfully venue put looking for........", responseJson);
      // this.setState({ loading: false }, () => {
      //   setTimeout(() => {
      if (responseJson.success_code == 0) {
        this.props.navigation.goBack()
        alert(responseJson.message)
      }
      else {
        alert(responseJson.message)
      }
      //   }, 1000)
      // });
      return responseJson;
    })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Venue put looking for Error : ", error);
      });
  }

  onArtistTypeSelect = (index, type) => {
    const { typeOfObjectArtist } = this.state;
    let id = typeOfObjectArtist.find(x => x.cat_name == type).cat_id
    this.setState({ typeOfArtistId: id, typeOfArtistKey: type })
  };

  onArtistType2Select = (index, type) => {
    const { typeOfObjectArtist } = this.state;
    let id = typeOfObjectArtist.find(x => x.cat_name == type).cat_id
    this.setState({ typeOfArtistId1: id, typeOfArtistKey: type })

  };
  onArtistType3Select = (index, type) => {
    const { typeOfObjectArtist } = this.state;
    let id = typeOfObjectArtist.find(x => x.cat_name == type).cat_id
    this.setState({ typeOfArtistId2: id, typeOfArtistKey: type })

  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "New Looking for listing",
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
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ padding: 15 }}>
          <View style={styles.TouchableEdit}>
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
          </View>

          <View style={styles.TouchableEdit}>

            <ModalDropdown
              options={this.state.typeOfArtist}
              defaultValue={"Artist Type"}
              onSelect={(index, type) => this.onArtistTypeSelect(index, type)}
              value={this.state.typeOfArtistKey}
              textStyle={{
                fontSize: 18,
                color: "rgb(111,135,146)"
              }}
              dropdownStyle={styles.dd_options} />

          </View>
          <View style={styles.TouchableEdit}>
            <ModalDropdown
              options={this.state.typeOfArtist}
              defaultValue={"Artist Type"}
              onSelect={(index, type) => this.onArtistType2Select(index, type)}

              textStyle={{
                fontSize: 18,
                color: "rgb(111,135,146)"
              }}
              // dropdownStyle={{ height: 100, width: 351 }} 
              dropdownStyle={styles.dd_options} />
          </View>
          <View style={styles.TouchableEdit}>

            <ModalDropdown
              options={this.state.typeOfArtist}
              defaultValue={"Artist Type"}
              onSelect={(index, type) => this.onArtistType3Select(index, type)}

              textStyle={{
                fontSize: 18,
                color: "rgb(111,135,146)"
              }}
              // dropdownStyle={{ height: 100, width: 351 }} 
              dropdownStyle={styles.dd_options} />
          </View>

          <View style={styles.TouchableEdit} >
            <TextInput
              multiline
              ref={(input) => this.txtArtistType2 = input}
              numberOfLines={5}
              placeholder="Notes"
              retunKeyLabel={true}
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize='none'
              placeholderTextColor="#6F8792"
              value={this.state.notes}
              onChangeText={(notes) => this.setState({ notes })}
              style={styles.TouchableEdit_in_Text_Notes}
            >
            </TextInput>
          </View>

          <TouchableOpacity style={styles.TouchableSign_in} onPress={this.venuePutLookingFor}>
            <Text style={styles.TouchableSign_in_Text}>Create</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: '#6F8792',
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
    alignItems: 'center',
    padding: 10
  },
  TouchableEdit_in_Text: {
    fontSize: 15,
    textAlign: 'left',
    padding: 9,
    color: 'rgb(111, 135, 146)',
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
  dd_optionsVenue: {
    width: '82%',
    height: '15%',
    borderColor: '#6F8792',
    borderWidth: 2,
    borderRadius: 3,
  },
  dd_options: {
    width: '89%',
    height: '10%',
    borderColor: '#6F8792',
    borderWidth: 2,
    borderRadius: 3,
  },
});
AppRegistry.registerComponent('uGigs', () => VenueLookingFor);