import React, { Component } from 'react';
import { Dimensions, Button, Modal, StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ImageBackground, TextInput, FlatList, ScrollView, AppRegistry, AsyncStorage, NativeMethodsMixin } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ModalDropdown from 'react-native-modal-dropdown';
// import Modal from 'react-native-modal';
import appConstant from '../common/appConstant';
import moment from 'moment';
import { Icon, SearchBar } from 'react-native-elements';

const screen = Dimensions.get('window')
const numColumns = 1000
class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      activeTab1: 1,
      activeTab2: 2,
    }

  }
  render({ children } = this.props) {
    return (
      <View style={styles.container1}>
        <View style={styles.tabsContainer}>

          {children.map(({ props: { title, title1, title2 } }, index) =>
            <TouchableOpacity style={[styles.tabContainer,
            index === this.state.activeTab ? styles.tabContainerActive : []]}
              onPress={() => this.setState({ activeTab: index })} key={index}>
              <Text style={styles.tabText1}>{title}</Text>
              <Text style={styles.tabText2}>{title1}</Text>
              <Text style={styles.tabText1}>{title2}</Text>
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

export default class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      type: '',
      region: '',
      dateVenue: '',
      regionVenue: '',
      isVisibleModel: false,
      chosenDate: new Date(),
      isDateTimePickerVisible: false,
      loading: false,
      pro_id: '',
      pro_thumb_path: '',
      pro_title: '',
      pro_content1: '',
      ven_thumb_path: '',
      ven_title: '',
      ven_content1: '',
      ven_id: '',
      venueFeature: [],
      artistFeature: [],
      artistSearchProject: [],
      venueSearchProject: [],
      venueFeture: [],
      artistType: '',
      selected: 'pending',
      isModalVisible: true,
      typeOfArtist: [],
      typeOfObjectArtist: [],
      typeOfObjectVenue: [],
      typeOfVenue: [],
      regionType: [],
      typeOfArtistKey: '',
      typeOfVenueKey: '',
      selectedRegion: '',
      selectedVenueRegion: '',
      selectedLastMinGig: '',
      search: '',
      lastMinGig: [],
      lastMinGigSearchList: []
    }

    this.setDate = this.setDate.bind(this);
    this.setDateVenue = this.setDateVenue.bind(this);
    this.artistFeatureList = this.artistFeatureList.bind(this);
    this.venueFeatureList = this.venueFeatureList.bind(this);
    this.typeOfArtistList = this.typeOfArtistList.bind(this);
    this.artistRegionList = this.artistRegionList.bind(this);
    this.typeOfVenueList = this.typeOfVenueList.bind(this);
    this.lastMinGigList = this.lastMinGigList.bind(this);
    this.lastMinGigSearch = this.lastMinGigSearch.bind(this);
    
  }

  async componentWillMount() {
    this.typeOfVenueList()
    this.typeOfArtistList()
    this.artistRegionList()
    // this.lastMinGigList()
    try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
      // console.log("User", User.token)
      this.setState({ pro_id: User.id, token: User.token }, () => {
        this.artistFeatureList()
        this.lastMinGigList()
        // this.lastMinGigSearch()
      })
    } catch (error) {
    }

    try {
      const Vendata = await AsyncStorage.getItem('VenUser');
      const VenUser = JSON.parse(Vendata)
      console.log("VenUser", VenUser)
      this.setState({ ven_id: VenUser.id, ventoken: VenUser.token }, () => {
        this.venueFeatureList()
        // alert(this.state.ven_id)
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

  setDate(newDate) {
    var dateObj = new Date(newDate);
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('DD-MM-YYYY');
    this.setState({ Artistdate: momentString });
    console.log('date formate', momentString);
  }

  setDateVenue(newDateVenue) {
    var dateObjVenue = new Date(newDateVenue);
    var momentObjVenue = moment(dateObjVenue);
    var momentStringVenue = momentObjVenue.format('DD-MM-YYYY');
    this.setState({ Venuedate: momentStringVenue });
    console.log('date formate', momentStringVenue);
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

  artistRegionList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.ARTISTREGION, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Type of artist", responseJson);
        this.setState({ loading: false, regionType: responseJson.results });
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("artist region List Error : ", error);
      });
  }



  lastMinGigList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.GETLASTMINGIGLIST + '?type=""', {
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
      console.log("lastmingig", responseJson);
      this.setState({ loading: false }, () => {
        if (responseJson.success_code == 0) {
          this.setState({ lastMinGig: responseJson.results })
          this.forceUpdate();
        }
        else {
          console.log("lastmingig after", this.state.lastMinGig);
          // alert(JSON.stringify(this.state.lastMinGig))
        }
      });
      return responseJson;
    })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("lastmingigError : ", error);
      });
  }


  lastMinGigSearch() {
    this.setState({ loading: true });
    let formdata = new FormData();
    console.log(this.state.typeOfArtistId)

    formdata.append("type", this.state.typeOfArtistId);

    fetch(appConstant.BASE_URL + appConstant.GETLASTMINGIGLISTBYTYPE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: formdata,
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(" last min gig Search Artist", responseJson);
        this.setState({ loading: false }, () => {
          if (responseJson.success_code == 0) {
            this.setState({ lastMinGigSearchList: responseJson.results })
            this.forceUpdate();
          }
          else if (responseJson.success_code == 1) {
            alert(responseJson.message)
          }
        });
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Search Error : ", error);
      });
  }



  typeOfVenueList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.TYPEOFVENUE, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Type of venue", responseJson);
        this.setState({ loading: false });
        if (responseJson.success_code == 0) {
          this.state.typeOfObjectVenue = responseJson.results;
          this.forceUpdate();
          responseJson.results.map((item, index) => {
            this.state.typeOfVenue.push(item.cat_name);
          })
        }
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("type of venue List Error : ", error);
      });
  }
  artistSearch() {
    this.setState({ loading: true });
    let formdata = new FormData();
    console.log(this.state.typeOfArtistId)
    console.log(this.state.Artistdate)
    console.log(this.state.selectedRegion)
    formdata.append("type", this.state.typeOfArtistId);
    formdata.append("date", this.state.Artistdate);
    formdata.append("region", this.state.selectedRegion);

    fetch(appConstant.BASE_URL + appConstant.SEARCHPROJECT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.ventoken
      },
      body: formdata,
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success_code === 0) {
          console.log("Search Artist", responseJson);
          this.setState({ loading: false, artistSearchProject: responseJson.results });
          this.forceUpdate();
        }
        else if (responseJson.success_code === 1) {
          this.setState({ loading: false })
          alert(responseJson.message)
        }
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Search Error : ", error);
      });
  }


  venueSearch() {
    // this.setState({ loading: true });
    let formdata = new FormData();

    console.log(this.state.typeOfVenueId)
    console.log(this.state.Venuedate)
    console.log(this.state.selectedRegion)

    formdata.append("type", this.state.typeOfVenueId);
    formdata.append("date", this.state.Venuedate);
    formdata.append("region", this.state.selectedVenueRegion);

    fetch(appConstant.BASE_URL + appConstant.SEARCHVENUE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: formdata,
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success_code === 0) {
          console.log("Search Venue", responseJson);
          this.setState({ loading: false, venueSearchProject: responseJson.results });
          this.forceUpdate();
        }
        else if (responseJson.success_code === 1) {
          this.setState({ loading: false })
          alert(responseJson.message)
        }
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Search venue error  : ", error);
      });
  }



  artistFeatureList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.GETPROJECTLIST, {
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
      console.log("Artist Feature List............", responseJson);
      this.setState({ loading: false, artistFeature: responseJson.results });
      this.forceUpdate();
      return responseJson;
    })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Artist Feature List Error : ", error);
      });
  }


  venueFeatureList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.GETVENUELIST, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.ventoken
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Venue Feature List", responseJson);
        this.setState({ loading: false, venueFeature: responseJson.results });
        this.forceUpdate()
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Venue Feature List Error : ", error);
      });
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


  onArtistTypeSelect = (index, type) => {
    const { typeOfObjectArtist } = this.state;
    let id = typeOfObjectArtist.find(x => x.cat_name == type).cat_id
    this.setState({ typeOfArtistId: id, typeOfArtistKey: type })
  };


  onArtistRegion = (index, type) => {
    this.setState({ selectedRegion: type })
  };


  onVenueTypeSelect = (index, typeVenue) => {
    const { typeOfObjectVenue } = this.state;
    let id = typeOfObjectVenue.find(x => x.cat_name == typeVenue).cat_id
    this.setState({ typeOfVenueId: id, typeOfVenueKey: typeVenue, })
  };

  onVenueRegion = (index, type) => {
    this.setState({ selectedVenueRegion: type })
  };

  onLastMinGigs = (index, type) => {
    const { typeOfObjectArtist } = this.state;
    let id = typeOfObjectArtist.find(x => x.cat_name == type).cat_id
    this.setState({ typeOfArtistId: id, typeOfArtistKey: type })
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    return (
      <View style={styles.container}>
        <Tabs>
          <View title="Artist" style={styles.content} onPress={() => this.setState({ date: '' })}>
            <ScrollView>
              <View>
                <View>
                  <ImageBackground style={{ width: screen.width, height: screen.height / 2.1 }} source={require('../../Assets/img/backgroundimage.png')}>
                    <View style={{ width: screen.width, height: screen.height / 2.1, backgroundColor: 'rgba(255, 255, 255, 0.49)' }}>
                      <View style={{ padding: 37, marginTop: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <ModalDropdown
                            options={this.state.typeOfArtist}
                            defaultValue={"Type of artist"}
                            onSelect={(index, type) => this.onArtistTypeSelect(index, type)}
                            value={this.state.typeOfArtistKey}
                            textStyle={{
                              fontSize: 18,
                              color: "#A16E78"
                            }}
                            dropdownStyle={styles.dd_options} />
                          <Icon name='angle-down'
                            type='font-awesome'
                            color='#A16E78'
                            size={28}
                          />

                        </View>
                        <View style={{ height: 1, backgroundColor: '#A16E78' }}></View>

                        <DatePicker
                          style={{ width: 350, }}
                          date={this.state.date}
                          minDate={new Date(Date.now())}
                          mode="date"
                          fontSize={18}
                          placeholder="Date"
                          placeholderTextColor="#A16E78"
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
                              color: '#A16E78'
                            },
                            dateText: {
                              color: '#A16E78'
                            },
                            placeholderText: {
                              color: '#A16E78',
                              fontSize: 18,
                            },
                          }}
                          // onDateChange={(date) => this.setDate(date)}
                          onDateChange={(date) => this.setState({ date: date }) }
                        />
                        <View style={{ height: 1, backgroundColor: '#A16E78' }}></View>


                        <View style={{ marginTop: 10 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ModalDropdown
                              options={this.state.regionType}
                              defaultValue={"Region"}
                              onSelect={(index, type) => this.onArtistRegion(index, type)}
                              value={this.state.regionType}
                              textStyle={{
                                fontSize: 18,
                                color: "#A16E78"
                              }}
                              dropdownStyle={styles.dd_options} />
                            <Icon name='angle-down'
                              type='font-awesome'
                              color='#A16E78'
                              size={28}
                            />
                          </View>
                          <View style={{ height: 1, backgroundColor: '#A16E78' }}></View>

                        </View>
                      </View>
                      {this.state.pro_id == "" || this.state.token == "" ?
                        <View style={{ paddingHorizontal: 90 }}>
                          <TouchableOpacity style={{ backgroundColor: '#A16E78', borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', padding: 6 }}>Search</Text></TouchableOpacity>
                        </View>
                        :
                        <View style={{ paddingHorizontal: 90 }}>
                          <TouchableOpacity style={{ backgroundColor: '#A16E78', borderRadius: 10 }} onPress={this.artistSearch.bind(this)}>
                            <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', padding: 6 }}>Search</Text></TouchableOpacity>
                        </View>
                      }
                    </View>
                  </ImageBackground>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: 20 }}>
                  <Text style={{ fontSize: 20, color: 'grey', margin: 15, }}>Featured Artists</Text>
                  <View style={{ backgroundColor: 'grey', height: 1, flex: 1 }}></View>
                </View>


                {this.state.pro_id == "" || this.state.token == "" ?

                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 }}>
                    <Text style={{ color: 'grey' }}>You must be logged in to view this feature. </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignArtist', { from: 'Explore', onGoBack: () => this.componentWillMount() })}>
                      <Text style={{ marginTop: 10, color: '#A16E78', fontWeight: 'bold', }}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{ height: 180 }}>
                      <FlatList
                        data={this.state.artistSearchProject}
                        numColumns={numColumns}
                        renderItem={({ item }) =>

                          <TouchableOpacity onPress={(pro_id) => this.props.navigation.navigate('ArtistDetail', { item: item })}>
                            <View style={{ width: 170, height: 160, flexDirection: 'row', marginLeft: 25, marginTop: 20 }}>
                              <ImageBackground
                                style={{ width: 170, height: 160, position: 'absolute' }}
                                source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ?
                                  require('../../Assets/img/placeholder.png')
                                  :
                                  { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}
                                resizeMode='stretch'>{item.image}</ImageBackground>
                              <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.85)', alignSelf: 'flex-end' }}>
                                <Text numberOfLines={1} style={{ color: 'gray', fontSize: 12, marginStart: 9, padding: 5 }}>{item.pro_title}</Text>
                                <Text numberOfLines={1} style={{ color: '#A16E78', fontSize: 17, fontWeight: '500', marginStart: 9, fontSize: 20 }}>{item.pro_content1}</Text>

                              </View>
                            </View>
                          </TouchableOpacity>
                        }
                        keyExtractor={item => item.pro_id}
                      />

                    </View>

                  </ScrollView>
                }
              </View>
            </ScrollView>
          </View>
          <View title1="Venue" style={styles.content}>

            <ScrollView>
              <View>

                <ImageBackground style={{ width: screen.width, height: screen.height / 2.1 }} source={require('../../Assets/img/backgroundimage.png')}>
                  <View style={{ width: screen.width, height: screen.height / 2.1, backgroundColor: 'rgba(255, 255, 255, 0.49)' }}>
                    <View style={{ padding: 37, marginTop: 30 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <ModalDropdown
                          options={this.state.typeOfVenue}
                          defaultValue={"Type of venue"}
                          onSelect={(index, typeVenue) => this.onVenueTypeSelect(index, typeVenue)}
                          value={this.state.typeOfVenueKey}
                          textStyle={{
                            fontSize: 18,
                            color: "rgb(111,135,146)"
                          }}
                          dropdownStyle={styles.dd_optionsVenue} />
                        <Icon name='angle-down'
                          type='font-awesome'
                          color='rgb(111,135,146)'
                          size={28}
                        />

                      </View>
                      <View style={{ height: 1, backgroundColor: 'rgb(111,135,146)' }}></View>

                      <DatePicker
                        style={{ width: 350 }}
                        date={this.state.dateVenue}
                        minDate={new Date(Date.now())}
                        mode="date"
                        fontSize={18}
                        placeholder="Date"
                        placeholderTextColor="rgb(111,135,146)"
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
                            color: 'rgb(111,135,146)'
                          },
                          dateText: {
                            color: 'rgb(111,135,146)'
                          },
                          placeholderText: {
                            color: 'rgb(111,135,146)',
                            fontSize: 18
                          }
                        }}
                        // onDateChange={(dateVenue) => this.setDateVenue(dateVenue) }
                        onDateChange={(dateVenue) => { this.setState({ dateVenue: dateVenue }) }}
                      />
                      <View style={{ height: 1, backgroundColor: 'rgb(111,135,146)' }}></View>


                      <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <ModalDropdown
                            options={this.state.regionType}
                            defaultValue={"Region"}
                            onSelect={(index, type) => this.onVenueRegion(index, type)}
                            value={this.state.regionType}
                            textStyle={{
                              fontSize: 18,
                              color: "rgb(111,135,146)"
                            }}
                            dropdownStyle={styles.dd_optionsVenue} />
                          <Icon name='angle-down'
                            type='font-awesome'
                            color='rgb(111,135,146)'
                            size={28}
                          />
                        </View>
                        <View style={{ height: 1, backgroundColor: 'rgb(111,135,146)' }}></View>
                      </View>
                    </View>
                    {this.state.ven_id == "" || this.state.token == "" ?

                      <View style={{ paddingHorizontal: 90 }}>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(111,135,146)', borderRadius: 10 }}  >
                          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', padding: 6 }}>Search</Text></TouchableOpacity>
                      </View>
                      : <View style={{ paddingHorizontal: 90 }}>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(111,135,146)', borderRadius: 10 }} onPress={this.venueSearch.bind(this)} >
                          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', padding: 6 }}>Search</Text></TouchableOpacity>
                      </View>}
                  </View>
                </ImageBackground>
              </View>

              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: 20 }}>
                  <Text style={{ fontSize: 20, color: 'grey', margin: 15 }}>Featured Venues</Text>
                  <View style={{ backgroundColor: 'grey', height: 1, flex: 1 }}></View>
                </View>

                {this.state.ven_id == "" || this.state.token == "" ?

                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 }}>
                    <Text style={{ color: 'grey' }}>You must be logged in to view this feature. </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignVenue', {
                      from: 'Explore',
                      onGoBack: () => this.componentWillMount(),
                    })}>
                      <Text style={{ marginTop: 10, color: '#6F8792', fontWeight: 'bold', }}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={{ height: 210 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      <FlatList
                        data={this.state.venueSearchProject}
                        numColumns={numColumns}
                        renderItem={({ item }) =>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('VenueDetail', { item: item })}>
                            <View style={{ width: 170, height: 160, flexDirection: 'row', marginLeft: 25, marginTop: 20 }}>
                              <ImageBackground
                                style={{ width: 170, height: 160, position: 'absolute' }}
                                source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                                  { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}
                                resizeMode='stretch'>{item.image}</ImageBackground>
                              <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.85)', alignSelf: 'flex-end' }}>
                                <Text numberOfLines={1} style={{ color: 'gray', fontSize: 12, marginStart: 9, padding: 5 }}>{item.ven_content1}</Text>
                                <Text numberOfLines={1} style={{ color: '#6F8792', fontSize: 17, fontWeight: '500', marginStart: 9, fontSize: 20 }}>{item.ven_title}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        }
                        keyExtractor={item => item.ven_id}
                      />
                    </ScrollView>
                  </View>
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

          <View title2="Last min Gigs" style={styles.content}>

            <View style={{ flexDirection: 'row', padding: 25 }}>
              <View style={{ backgroundColor: 'lightgrey', flexDirection: 'row', padding: 15, borderRadius: 5, justifyContent: 'space-between' }}>
                <View style={{ backgroundColor: 'rgb(111,135,146)', width: '84%', borderRadius: 5, padding: 10 }}>
                  <ModalDropdown
                    options={this.state.typeOfArtist}
                    defaultValue={"Search Requested Artist"}
                    onSelect={(index, type) => this.onLastMinGigs(index, type)}
                    value={this.state.typeOfArtist}
                    textStyle={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: '500'
                    }}
                    dropdownStyle={styles.dd_optionsLastMinGigs} />

                </View>
                <View style={{ backgroundColor: 'rgb(111,135,146)', justifyContent: 'center', borderRadius: 5, paddingHorizontal: 5 }}>
                  <Icon style={{ marginLeft: '5%' }} name='search' type='font-awesome' size={25} color='white' onPress={() => this.lastMinGigSearch()}></Icon>
                </View>
              </View>
            </View>

            <FlatList
              data={this.state.lastMinGigSearchList}
              renderItem={({ item }) =>
                <View style={styles.flatview}>
                  <Image borderRadius={3} style={{ height: 100, width: 100 }} source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                    { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}></Image>
                  <View style={{ flexDirection: 'column', marginStart: 10 }}>
                    <Text style={styles.nameVenue}>{item.pro_title}</Text>
                    {/* <Text style={styles.emailVenue}>Date:</Text>
                    <Text style={{ marginTop: 10, color: 'grey' }}>{item.look_date} </Text> */}
                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('SendMessageVenue')}>
                      <Text style={{ marginTop: 10, color: '#6F8792', fontWeight: '600' }}>Enquire</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              }
              keyExtractor={item => item.image}
            />
          </View>
        </Tabs>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  EmailTextInput1: {
    borderBottomWidth: 1,
    justifyContent: 'center',
    color: 'rgb(111,135,146)'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgb(237,237,238)',
  },
  button1: {
    flexDirection: 'row',
    backgroundColor: 'rgb(237,237,238)',
    padding: 20,
    height: 70,
  },
  buttonVenue: {
    flexDirection: 'row',
    backgroundColor: 'rgb(237,237,238)',
    padding: 20,
    height: 90,
    justifyContent: 'space-around'
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
    // marginLeft: 20,
    // marginRight: 20

  },
  tabContainer: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
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
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabText2: {
    color: 'rgb(111,135,146)',
    fontSize: 20,
    fontFamily: 'Avenir',
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
    color: 'rgb(161,110,120)',
    fontWeight: 'bold'
  },
  EmailTextInput: {
    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center',
    color: 'rgb(161,110,120)'
  },
  passwordTextInput: {
    color: 'rgb(161,110,120)',
    marginTop: 25,
    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  passwordTextInput1: {
    color: 'rgb(111,135,146)',
    marginTop: 25,
    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52,52,52,0.5)"
  },
  dd_btn: {
    backgroundColor: 'white',
    height: '65%',
    borderRadius: 8
  },
  dd_options: {
    width: '82%',
    height: '15%',
    borderColor: '#A16E78',
    borderWidth: 2,
    borderRadius: 3,
  },
  dd_optionsVenue: {
    width: '82%',
    height: '15%',
    borderColor: '#6F8792',
    borderWidth: 2,
    borderRadius: 3,
  },
  dd_optionsLastMinGigs: {
    width: '60%',
    height: '15%',
    borderColor: '#6F8792',
    borderWidth: 2,
    borderRadius: 3,
  },
  flatview: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(121,121,121)',
    marginLeft: 20,
    marginRight: 20
  },
  nameVenue: {
    color: 'rgb(161, 110, 120)',
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
})

AppRegistry.registerComponent('uGigs', () => Explore);
