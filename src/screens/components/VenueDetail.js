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
  Linking,
  AsyncStorage,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Icon, Rating, AirbnbRating } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
const screen = Dimensions.get('window')
import appConstant from '../common/appConstant';

export default class VenueDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
      pro_id: '',
      pro_title: '',
      pro_content1: '',
      calendar_pro_rate: '',
      ven_id: '',
      ven_title: '',
      ven_content1: '',
      calendar_review: '',
      pro_thumb_path: '',
      results: [],
      venueRate: [],
      venue_albums: [],
      loading: false,
      project_rate_avg: '',
      item: this.props.navigation.state.params.item,
      venueFeature:[],
    }
    this.venueRateReview = this.venueRateReview.bind(this);
  }

  async componentWillMount() {
    //  if(VenUser== null) {
    //    alert('Press')
    //  }
    // try {
    //   const data = await AsyncStorage.getItem('User');
    //   const User = JSON.parse(data)
    //   this.setState({ pro_id: User.id, token: User.token }, () => {
    //   })
    // } catch (error) {
    // }
    try {
      const data = await AsyncStorage.getItem('VenUser');
      const VenUser = JSON.parse(data)
      this.setState({ ven_id: VenUser.id, ventoken: VenUser.token }, () => {
        this.venueRateReview()
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

  ratingCompleted(rating) {
    // console.log("Rating is: " + rating)
  }

  venueFeatureList() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.GETVENUELIST, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Venue Feature List", responseJson);
        this.setState({ loading: false, venueFeature: responseJson.results });
        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Venue Feature List Error : ", error);
      });
  }


  venueRateReview() {
    this.setState({ loading: true });
    fetch(appConstant.BASE_URL + appConstant.GETRATEREVIEW + '?ven_id=' + this.state.ven_id, {
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

      console.log("GETPROJECTWITHRATEREVIEW. . . . . . ", JSON.stringify(responseJson));
      // alert(JSON.stringify(responseJson));
      this.setState({ loading: false, venueRate: responseJson.results[0] });

      return responseJson
    })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("venue Details Error : ", error);
      });
  }
  onStarRatingPress(rating) {
    this.setState({ project_rate_avg: rating });
    alert(this.state.project_rate_avg)
    console.log('Venue rate', this.state.project_rate_avg);
  }


  render() {
    const { navigation } = this.props;
    const { item, ven_id, venueRate } = this.state;
    return (
      <ScrollView>
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <View style={{ width: screen.width, height: 220, flexDirection: 'row', }}>
            <View style={{ flexDirection: 'row', width: screen.width, height: 220 }}>
              <ImageBackground style={{ width: screen.width, height: 220, position: 'absolute', }} source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ position: 'absolute', top: 15, left: 15 }}>
                  <Icon name='angle-left'
                    type='font-awesome'
                    size={35}
                    color='white'
                  />
                </TouchableOpacity>
              </ImageBackground>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', alignSelf: 'flex-end', }}>

                <Text style={{ color: 'gray', fontSize: 12, marginStart: 9, padding: 5 }}>{item.ven_title}</Text>
                {/* <Text numberOfLines={1} style={{ color: '#6F8792', fontSize: 20, fontWeight: '600', marginStart: 10 }}>{item.ven_content1}</Text> */}
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={{ backgroundColor: '#6F8792', borderRadius: 20, marginTop: 5, width: 140, marginStart: 9, paddingEnd: 15, marginBottom: 8 }}
                    onPress={() => ven_id == '' ?
                      this.props.navigation.navigate('GetStartedAnimation')
                      :
                      // this.props.navigation.navigate('BookNewGig', { item: venueRate })}>
                      this.props.navigation.navigate('LookingForData')}>
                    <Text style={{ color: 'white', textAlign: 'center', alignSelf: 'center', padding: 5 }}>{'more information'}</Text>
                  </TouchableOpacity>
                  {this.state.ven_id == "" || this.state.token == "" ?
                  <Icon
                    reverse
                    name='comment'
                    type='font-awesome'
                    color='#6F8792'
                    size={13}
                    style={{ flex: 1, marginBottom: 8 }}

                    // onPress={() => ven_id == '' ?
                    // this.props.navigation.navigate('GetStartedAnimation')
                    // :
                    // this.props.navigation.navigate('SendMessageVenue',{ven_id: this.state.ven_id})}
                    onPress={() => this.props.navigation.navigate('SendMessageVenue',{ item: item })}
                  />
                  :null}
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.staticText}>
          {/* Singer / SongWriter from London.My influenece range from Eva Cassidy to Adele and a whole muddle of other people in-betwwen.My style has been  described as a female version of Damien Rice with a Lilly Allen twist to it which I'hv always thought was a pretty cool way of describing it!! */}
          {item.ven_content1} </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 0.4 }}>
            <Icon
              name='facebook-with-circle'
              type='entypo'
              color='#6F8792'
              size={25}
              onPress={() => Linking.openURL('http://www.facebook.com')}
            />
            <Icon
              name='instagram'
              type='font-awesome'
              color='#6F8792'
              size={25}
              onPress={() => Linking.openURL('http://www.instagram.com')}
            />
            <Icon
              name='youtube-with-circle'
              type='entypo'
              color='#6F8792'
              size={25}
              onPress={() => Linking.openURL('http://www.youtube.com')}
            />
          </View>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end', flex: 2.45 }}>
            <Text style={{ textAlign: 'right', fontSize: 22, color: 'grey', marginStart: 100 }}>Ratings</Text>
            <AirbnbRating
              style={{}}
              count={5}
              size={22}
              showRating={false}
              ratingColor='blue'
            />


            {/* <StarRating
              disabled={false}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              size={10}
              rating={this.state.rating}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'#A16E78'}
            /> */}
          </View>

        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: 20 }}>
          <Text style={{ fontSize: 22, color: 'grey', margin: 15, flex: 1.5 }}>Review</Text>
          <View style={{ backgroundColor: 'grey', height: 1, flex: 5 }}></View>
        </View>

        <View>

          <FlatList
            data={this.state.venueRate}
            renderItem={({ item, index }) =>
              <View style={styles.flatview}>
                <ImageBackground borderRadius={25} style={{ height: 50, width: 50, }} source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                  { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}></ImageBackground>

                <View style={{ flex: 1, justifyContent: 'space-between', marginStart: 10 }}>
                  <Text style={styles.nameVenue}>{item.pro_title}</Text>
                  <Text style={styles.emailVenue}>{item.calendar_review}</Text>
                </View>

                <AirbnbRating
                  count={5}
                  size={10}
                  showRating={false}
                  ratingColor='blue' />

              </View>
            }
            keyExtractor={item => item.ven_id}
          />
          <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.loading}
          >
            <View style={styles.loader}>
              <ActivityIndicator size="large" color='#6F8792' animating={true} />
            </View>
          </Modal>
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  elevationLow: {
    shadowColor: 'black',
    shadowOffset: { width: screen.width, height: 190 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    width: screen.width, height: 160, position: 'absolute'
  },
  staticText: {
    textAlign: 'left',
    color: 'grey',
    margin: 15
  },
  flatview: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(121,121,121)',
    marginLeft: 20,
    marginRight: 20
  },
  nameVenue: {
    color: '#6F8792',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Verdana',
    fontSize: 18
  },
  emailVenue: {
    marginTop: 8,
    fontSize: 15,
    color: 'grey',
    marginRight: 39
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52,52,52,0.5)"
  },
})

AppRegistry.registerComponent('uGigs', () => VenueDetail);