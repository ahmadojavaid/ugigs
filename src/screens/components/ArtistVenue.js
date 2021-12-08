import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  FlatList,
  AppRegistry,
  Platform,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  Animated,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import appConstant from '../common/appConstant';

const screen = Dimensions.get('window')
// import SearchBar from 'react-native-searchbar';


class Tabs extends Component {
  state = {
    activeTab: 0,
  }
  render({ children } = this.props) {
    return (
      <View style={styles.container1}>

        <View style={styles.tabsContainer}>

          {children.map(({ props: { title, title1 } }, index) =>
            <TouchableOpacity
              style={[styles.tabContainer,
              index === this.state.activeTab ? styles.tabContainerActive : []
                // index === this.state.activeTab ? styles.tabContainerActive2 : []
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


const numColumns = 2
const { width } = Dimensions.get("window");

export default class ArtistVenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ven_title: '',
      ven_id: '',
      ven_thumb_path: '',
      pro_title: '',
      pro_content1: '',
      pro_content2: '',
      pro_content3: '',
      pro_content4: '',
      pro_tweets: '',
      pro_youtube: '',
      pro_soundcloud: '',
      pro_instagram: '',
      pro_meta_description: '',
      pro_url: '',
      pro_subscription_date: '',
      created_at: '',
      updated_at: '',
      pro_thumb_path: '',
      pro_intro: '',
      ven_content1:'',
      name: '',
      results: [],
      venueSearchList: [],
      artistSearchList: [],
      loading: false
    }
    this.updateSearchArtist = this.updateSearchArtist.bind(this);
    this.updateSearchVenue = this.updateSearchVenue.bind(this);
  }

  componentWillMount() {
      this.updateSearchArtist('');
      this.updateSearchVenue('');
    }

  handleSubmit() {
    getUserInfo(this.state.name)
      .then((responseJson) => {
        if (responseJson.message === 'Not Found') {
          this.setState({
            error: ' not found'
          });
        }
        else {
          this.setState({
            error: false,
            name: ''
          })
        }
      });
  }
  
  updateSearchVenue = (name) => {
    this.setState({ loading: true });
    let formdata = new FormData();
    formdata.append("name", name)

    this.setState({ name }, () =>{
      fetch(appConstant.BASE_URL + appConstant.VENUESEARCHBYNAME, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log("Venuelist.......", responseJson);
          this.setState({ loading: false, venueSearchList: responseJson.results });
          return responseJson;
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log("venue Error : ", error);
        });
    });
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Edit Profile",
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
  });
  updateSearchArtist = name => {
    this.setState({ loading: true });
    this.setState({ name }, () => {
      console.log('name.................', name);
      let formdata = new FormData();
      formdata.append("name", name)

      fetch(appConstant.BASE_URL + appConstant.SEARCHBYNAME, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log("Artistlist.......", responseJson);
          this.setState({ loading: false, artistSearchList: responseJson.results });
          return responseJson;
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log("Artist search Error : ", error);
        });
    });
  };

  
  render() {
    const { name } = this.state;

    return (

      <View style={styles.container}>
        <Tabs>
          <View title="Artist" style={styles.container}>
            <SearchBar
              lightTheme
              placeholder="Search for artist"
              placeholderTextColor='white'
              inputStyle={{ color: 'white' }}
              onChangeText={this.updateSearchArtist}
              value={this.state.name}
              returnKeyType='search'
              inputContainerStyle={{ backgroundColor: '#A16E78', placeholderTextColor: 'white', textAlign: 'center', borderRadius: 10 }}
              containerStyle={{ backgroundColor: 'transprent', padding: 20 }}
              leftIconContainerStyle={{ size: 10 }}
              searchIcon={{ color: 'white' }}
              clearIcon={{ color: 'white' }}
              onClear={() => this.updateSearchArtist('')}
            />
            <ScrollView>
              <FlatList
                data={this.state.artistSearchList}
                numColumns={numColumns}
                renderItem={({ item, index }) =>
                  index == 0 ?
                  <TouchableOpacity  onPress={() => this.props.navigation.navigate('ArtistDetail', { item: item })}>
                    <View style={{ padding: 10, width: screen.width }}>
                      <ImageBackground
                        source={(item.pro_thumb_path == null || item.pro_thumb_path == "" || item.pro_thumb_path == undefined) ? require('../../Assets/img/placeholder.png')
                          :
                          { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}
                        style={{ height: 175 }}
                        resizeMode='stretch'>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', marginTop: 117, paddingVertical: 10 }}>
                          {/* <Text numberOfLines={1} style={{ color: 'gray', fontSize: 12, marginStart: 9, }}>{item.pro_title}</Text> */}
                          <Text numberOfLines={1} style={{ color: '#A16E78', fontSize: 17, fontWeight: '500', marginStart: 9, fontSize: 20 }}>{item.pro_title}</Text>
                          <TouchableOpacity style={{ backgroundColor: '#A16E78', borderRadius: 20, width: 100, marginStart: 9, marginBottom: 5 }}
                            onPress={() => this.props.navigation.navigate('ArtistDetail', { item: item })}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 13 }}>{'Book'}</Text>
                          </TouchableOpacity>
                        </View>
                      </ImageBackground>
                    </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistDetail', { item: item })}>
                    <View style={{ flex: 1, padding: 10, flexWrap: 'wrap' }}>
                      <ImageBackground
                        source={(item.pro_thumb_path == null  ||  item.pro_thumb_path == '' || item.pro_thumb_path == undefined ) ? require('../../Assets/img/placeholder.png') :
                          { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}
                        style={{ height: 175, width: screen.width / 2.3 }}
                        resizeMode='stretch'>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', paddingVertical: 12,marginTop: 127 }}>
                          <Text numberOfLines={1} style={{ color: '#A16E78', fontSize: 17, fontWeight: '500', marginStart: 9, fontSize: 20 }}>{item.pro_title}</Text>
                        </View>
                      </ImageBackground>
                    </View>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.pro_id}
              />
            </ScrollView>
          </View>
          <View title1="Venue" style={styles.container}>
            <SearchBar
              lightTheme
              placeholder="Search for venue"
              placeholderTextColor='white'
              inputStyle={{ color: 'white' }}
              onChangeText={this.updateSearchVenue}
              value={this.state.name}
              returnKeyType='search'
              inputContainerStyle={{ backgroundColor: '#6F8792', placeholderTextColor: 'white', borderRadius: 10, textAlign: 'center' }}
              containerStyle={{ backgroundColor: 'transprent', padding: 20 }}
              leftIconContainerStyle={{ size: 10 }}
              searchIcon={{ color: 'white' }}
              clearIcon={{ color: 'white' }}
              onClear={() => this.updateSearchVenue('')}
            // onPress={this.venueList.bind(this)}
            />
            <ScrollView>
              <FlatList
                data={this.state.venueSearchList}
                numColumns={numColumns}
                renderItem={({ item, index }) =>
                  index == 0 ?
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('VenueDetail', { item: item })}>
                    <View style={{ padding: 10, width: screen.width }}>
                      <ImageBackground
                        source={(item.ven_thumb_path == null || item.ven_thumb_path == "" ) ? require('../../Assets/img/placeholder.png') :
                          { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}
                        style={{ height: 175 }} resizeMode='stretch'
                      >
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', marginTop: 117, paddingVertical: 10 }}>
                          {/* <Text numberOfLines={1} style={{ color: 'gray', fontSize: 12, marginStart: 9, }}>{item.ven_content1}</Text> */}
                          <Text numberOfLines={1} style={{ color: '#6F8792', fontSize: 17, fontWeight: '500', marginStart: 9, fontSize: 20 }}>{item.ven_title}</Text>
                          <TouchableOpacity style={{ backgroundColor: '#6F8792', borderRadius: 20, width:100, marginStart: 9, marginBottom: 5 }}
                            onPress={() => this.props.navigation.navigate('VenueDetail', { item: item })}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 13 }}>{'more info'}</Text>
                          </TouchableOpacity>
                        </View>
                      </ImageBackground>
                    </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('VenueDetail', { item: item })}>
                    <View style={{ flex: 1, padding: 10, flexWrap: 'wrap' }}>
                      <ImageBackground
                        source={(item.ven_thumb_path == null || item.ven_thumb_path == "" ) ? require('../../Assets/img/placeholder.png') :
                          { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}
                        style={{ height: 175, width: screen.width / 2.3 }}
                      >
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', marginTop: 127, paddingVertical: 12 }}>
                          {/* <Text numberOfLines={1} style={{ color: 'gray', fontSize: 12, marginStart: 9, }}>{item.ven_content1}</Text> */}
                          <Text numberOfLines={1} style={{ color: '#6F8792', fontSize: 17, fontWeight: '500', marginStart: 9, fontSize: 20 }}>{item.ven_title}</Text>

                        </View>
                      </ImageBackground>

                    </View>
                    </TouchableOpacity>
                }
                enableEmptySections={true}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
            <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.loading}
        >
          <View style={styles.loader}>
            <ActivityIndicator size="large" color='#A16E78' animating={true} />
          </View>
        </Modal>
          </View>
        </Tabs>
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
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

  flatview: {
    flexDirection: 'row',
    height: 135,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  },
  nameVenue: {
    color: '#6F8792',
    fontSize: 12,
    marginStart: 9,
    padding: 5
  },
  BrandnameVenue: {
    color: '#6F8792',
    fontSize: 20,
    fontWeight: '600',
    marginStart: 9
  },
  BookVenue: {
    backgroundColor: '#6F8792',
    paddingEnd: 10,
    borderRadius: 20,
    width: 55,
    marginStart: 9

  },
  TouchableEdit_in_Text: {
    fontSize: 15,
    textAlign: 'left',
    padding: 9,
    color: '#727272',
    fontWeight: '500'
  },
  searchContainer: {
    flexDirection: "row",
    height: 72,
    borderBottomColor: "#00000033",
    paddingTop: 100
  },
  search: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderRadius: 6,
    backgroundColor: '#A16E78'
  },
  cancelSearch: {
    position: "absolute",
    marginHorizontal: 16,
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52,52,52,0.5)"
  },
});

AppRegistry.registerComponent('uGigs', () => ArtistVenue);




