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
  ActivityIndicator
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Icon } from 'react-native-elements';
import appConstant from '../screens/common/appConstant';

const screen = Dimensions.get('window')


class Tabs extends Component {
  state = {
    activeTab: 0,
    activeTab1: 1,

  }

  render({ children } = this.props) {
    return (
      <View style={styles.container1}>

        <View style={styles.tabsContainer}>

          {children.map(({ props: { title, title1 } }, index) =>

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



export default class ArtistPenddingGigs extends Component {
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
      ven_thumb_path: '',
      pro_thumb_path: '',
      pro_region: '',
      pro_url: '',
      pro_title: '',
      look_date:'',
      look_id:'',
      look_type1:'',
      look_note:'',
      activeView: 0,
      selected: 'Pendding',
      selectedVenue: 'LookingVenue',
      isLoading: true,
      downloading: false,
      loading: false,
      artistPending:[],
      artistUpcoming:[],
      artistPrevious:[],
      venueLookingFor:[],
      venuePendding:[],
      venueUpcoming:[],
      pro_id: '',
      venuePrevious:[]

    };
    this.artistUpcomingGigs = this.artistUpcomingGigs.bind(this);
    // this.artistPendingGigs = this.artistPendingGigs.bind(this);
    this.venueLookingForGigs = this.venueLookingForGigs.bind(this);
  }

  async componentWillMount(){
    
    try {
      const pro_id = await AsyncStorage.getItem('Pro_Id');    
      this.setState({pro_id:pro_id })
    } catch (error) {
    }

    this.artistUpcomingGigs()
    this.artistPendingGigs()
    this.artistPreviousGigs()
    this.venueLookingForGigs()
    this.venuePendingInvites()
    this.venuePreviousGigs()
    this.venueUpcomingGigs()
  }

  artistUpcomingGigs() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.GETUPCOMINGGIGS + '/5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading: false });
        console.log("Artist Upcomning ..................", responseJson);
        this.setState({ loading: false, artistPending: responseJson.results });
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
    fetch(appConstant.BASE_URL + appConstant.GETPENDINGGIGS + '/5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading: true });
        console.log("Artist Pending..................", responseJson);
        this.setState({ loading: false, artistUpcoming: responseJson.results });
        console.log(responseJson.results)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("artist Pending Error : ", error);
      });
  }

  artistPreviousGigs() {
    // setTimeout(() => {
      this.setState({ loading: false });
    
    // }, 1000);
    fetch(appConstant.BASE_URL + appConstant.GETPREVIOUSGIGS + '5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Artist Previous..................", responseJson);
        this.setState({ loading: false, artistPrevious: responseJson.results });
        console.log(responseJson.results)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("artist Previous Error : ", error);
      });
  }


  venueLookingForGigs() {
    // setTimeout(() => {
      this.setState({ loading: false });
    // }, 1000);
    fetch('http://192.168.0.79:9009/api/v1/venues/getLookingFor/5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Venue Looking for..................", responseJson);
        this.setState({ loading: false, venueLookingFor: responseJson.results });
        console.log(responseJson.results)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Venue Looking for Error : ", error);
      });
  }
  venuePendingInvites() {
    // setTimeout(() => {
      this.setState({ loading: false });
    // }, 1000);
    fetch('http://192.168.0.79:9009/api/v1/venues/getPendingInvites/5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Venue Pending..................", responseJson);
        this.setState({ loading: false, venuePendding: responseJson.results });
        console.log(responseJson.results)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Venue Pending Error : ", error);
      });
  }
  venueUpcomingGigs() {
    // setTimeout(() => {
      this.setState({ loading: false });
    // }, 1000);
    fetch(appConstant.BASE_URL + appConstant.GETVENUEUPCOMINGGIGS + '/5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Venue Upcoming..................", responseJson);
        this.setState({ loading: false, venueUpcoming: responseJson.results });
        console.log(responseJson.results)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Venue Upcoming Error : ", error);
      });
  }
  venuePreviousGigs() {
    // setTimeout(() => {
      this.setState({ loading: false });
    // }, 1000);
    fetch(appConstant.BASE_URL + appConstant.GETVENUEPREVIOUSGIGS + '/5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Venue Previous..................", responseJson);
        this.setState({ downloading: false, venuePrevious: responseJson.results });
        console.log(responseJson.results)
        return responseJson;
      })
      .catch((error) => {
        this.setState({ downloading: false });
        console.log("Venue PreviousError : ", error);
      });
  }

  rightButtons = (markData) => {
    let self = this
    return [
      {
        component:
          <TouchableOpacity onPress={() => self.markCompleted(markData)} style={{
            backgroundColor: 'green', flex: 1,
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
    
    return <Swipeout style={{ backgroundColor: 'white' }} autoClose={true}
    right={[
      {
        text: 'Accept',
        onPress:() => this.OnClickAccept(item.calendar_id),               
        backgroundColor: 'green'      
      },
      {
        text: 'Reject',
        onPress:() => this.OnClickReject(item.calendar_id),               
        backgroundColor: 'red'      
      }
    ]}
    // right={this.rightButtons(FlatListdata1)}
    >
      <View style={styles.flatview}>
        <ImageBackground borderRadius={3}  style={{ height: 100, width: 100, }}  source={item.ven_thumb_path == null ? require('../Assets/img/placeholder.png') :
                                { uri: 'http://192.168.0.79:9009' + item.ven_thumb_path }}></ImageBackground>
        <View style={{flex:1 , marginStart: 10 }}>
          <View style={{flexDirection:'row', justifyContent: 'space-between'}}> 
            <Text style={styles.name}>{item.ven_title}</Text>
            <Icon onPress={()=> this.props.navigation.navigate('SendMessage', {ven_id: item.ven_id})} style={{marginLeft: '5%'}} name="chat" size={25} color='#a9a9a9' type='material-community'></Icon>
          </View>
          
          <Text style={styles.email}>{item.ven_id}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>
          </View>
          <View>
            <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date}</Text>
          </View>
        </View>
      </View>
    </Swipeout>
   }

   _renderItem1 = ({ item, index }) => {

    console.log("render_item:", JSON.stringify(item) + index);
    
    return <Swipeout style={{ backgroundColor: 'white' }} autoClose={true}
      right={swipeoutBtns}
    // right={this.rightButtons(FlatListdata1)}
    >
      <View style={styles.flatview}>
        <ImageBackground borderRadius={3}  style={{ height: 100, width: 100}}  source={item.ven_thumb_path == null ? require('../Assets/img/placeholder.png') :
                                { uri: 'http://192.168.0.79:9009' + item.ven_thumb_path }}></ImageBackground>
        <View style={{ flexDirection: 'column', marginStart: 10 ,paddingBottom:5}}>
          <Text style={styles.nameVenue}>{item.pro_title}</Text>
          <Text style={styles.emailVenue}>{item.pro_id}</Text>
          
            <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.calendar_approve_message}</Text>
          
          <View>
            <Text style={{ marginTop: 10, color: 'grey' }}>{item.calendar_date}</Text>
          </View>
        </View>
      </View>
    </Swipeout>
   }

   _renderItemLookingFor = ({ item, index }) => {

    // console.log("render_item:", JSON.stringify(item) + index);
    
    return <Swipeout style={{ backgroundColor: 'white' }} autoClose={true}
      right={swipeoutBtns}
      
    // right={this.rightButtons(FlatListdata1)}
    >
    
      <View style={styles.flatview}>
        <ImageBackground borderRadius={3} style={{ height: 100, width: 100 }}  source={item.ven_thumb_path == null ? require('../Assets/img/placeholder.png') :
                                { uri: 'http://192.168.0.79:9009' + item.ven_thumb_path }}></ImageBackground>
        <View style={{ flexDirection: 'column', marginStart: 10 }}>
          <Text style={styles.nameVenue}>{item.look_type1}</Text>
          <Text style={styles.emailVenue}>{item.look_id}</Text>
          
            <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.look_note}</Text>
          
          <View>
            <Text style={{ marginTop: 10, color: 'grey' }}>{item.look_date} </Text>
          </View>
        </View>
      </View>
    </Swipeout>
   }

  async OnClickAccept(calendar_id)
  {
    // let Pro_Id = AsyncStorage.getItem('Pro_Id');
    
    const value = await AsyncStorage.getItem('Pro_Id');
    alert(value + " " + calendar_id);

    fetch('http://192.168.0.79:9009/api/v1/projects/acceptGigs', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendar_id	: calendar_id,
        pro_id: value,       
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Accept........", responseJson);    
        this.props.navigation.goBack();   
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  async OnClickReject(calendar_id)
  {
    const value = await AsyncStorage.getItem('Pro_Id');
    alert(value + " " + calendar_id);

    fetch('http://192.168.0.79:9009/api/v1/projects/rejectGigs', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendar_id	: calendar_id,
        pro_id: value,   
        message: ""    
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Accept........", responseJson);    
        this.props.navigation.goBack();   
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  render() {
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
                active={this.state.activeIndex == 0} onPress={() => this.setState({ selected: 'Upcoming' })}>
                <Text style={[styles.touchabletitleVenue, { color: this.state.selected == 'Upcoming' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }]}>Upcoming</Text>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selected == 'Upcoming' ? 'rgb(161, 110, 120)' : 'rgb(211,211,211)' }}>Gigs</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ selected: 'Previous' })}>
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
                  renderItem={this._renderItem}
                  extraData={this.state}
                  data={this.state.artistUpcoming}
                  keyExtractor={item => item.id}
                /> : this.state.selected == 'Previous' ?
                  <FlatList
                    renderItem={this._renderItem}
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

                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ selectedVenue: 'PendingInvites' })}>
                  <Text style={[styles.touchabletitleVenue, { color: this.state.selectedVenue == 'PendingInvites' ? '#6F8792' : 'rgb(211,211,211)' }]}>Pending </Text>
                  <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selectedVenue == 'PendingInvites' ? '#6F8792' : 'rgb(211,211,211)' }}>Invites</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ selectedVenue: 'UpcomingVenue' })}>
                  <Text style={[styles.touchabletitleVenue, { color: this.state.selectedVenue == 'UpcomingVenue' ? '#6F8792' : 'rgb(211,211,211)' }]}>Upcoming </Text>
                  <Text style={{ flex: 1, textAlign: 'center', fontSize: 19, color: this.state.selectedVenue == 'UpcomingVenue' ? '#6F8792' : 'rgb(211,211,211)' }}>Gigs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ selectedVenue: 'PreviousVenue' })}>
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
              /> : this.state.selectedVenue == 'PendingInvites' ?
                <FlatList
                  renderItem={this._renderItem1}
                  extraData={this.state}
                  data={this.state.venuePendding}
                  keyExtractor={item => item.id}
                />
                : this.state.selectedVenue == 'UpcomingVenue' ?
                  <FlatList
                    renderItem={this._renderItem1}
                    extraData={this.state}
                    data={this.state.venueUpcoming}
                    keyExtractor={item => item.id}
                  /> : this.state.selectedVenue == 'PreviousVenue' ?
                    <FlatList
                      renderItem={this._renderItem1}
                      extraData={this.state}
                      data={this.state.venuePrevious}
                      keyExtractor={item => item.id}
                    /> : null}
          </View>
        </Tabs>
        <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.loading}
          >
          <View style={styles.loader}> 
            <ActivityIndicator size="large" color='#A16E78' animating={true}/>
          </View>
          </Modal>
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
    marginTop:13,
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
    paddingTop: 20,
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

  loader:{
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
