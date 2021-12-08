import React, { Component } from 'react';
import { StyleSheet, Modal, ActivityIndicator, Text, View, ImageBackground, Image, TouchableOpacity, Dimensions, Platform, ScrollView, TextInput, PixelRatio, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
import { Content,} from 'native-base';
const screen = Dimensions.get('window')
import appConstant from '../common/appConstant';

export default class VenueEditProfile extends React.Component {
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
      pro_title: '',
      artistDetailById: [],
      results: [],
      ImageSource: null,
      ven_id: 0,
      isLoading: true,
      loading: false
    }
    this.venueEditProfile = this.venueEditProfile.bind(this);
    this.venueEditProfileByID = this.venueEditProfileByID.bind(this);
  }

  async componentWillMount() {
    try {
      const data = await AsyncStorage.getItem('VenUser');
      const User = JSON.parse(data)
      console.log("VenUser", User)
      this.setState({ ven_id: User.id, token: User.token }, () => {
        this.venueEditProfileByID()
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

  venueEditProfile() {
    const {ven_id,name,region,fullBio,bioShortIntroduction,twitter,facebook,youtube,soundCloud,ImageSource} = this.state;

    if (ImageSource == "" || ImageSource == null || ImageSource == undefined) {
      alert("Please select Profile image ");
    }
    else if  (name == "" || name == null || name == undefined) {
      alert("Please Enter venue Name");
    }
    else if  (region == "" || region == null || region == undefined) {
      alert("Please Enter Town/City");
    }
    else if  (bioShortIntroduction == "" || bioShortIntroduction == null || bioShortIntroduction == undefined) {
      alert("Please Enter Region");
    }
    else if  (fullBio == "" || fullBio == null || fullBio == undefined) {
      alert("Please Enter Venue short introduction");
    }
    else if  (twitter == "" || twitter == null || twitter == undefined) {
      alert("Please Enter full Description");
    }
    else if  (facebook == "" || facebook == null || facebook == undefined) {
      alert("Please Enter Facebook id ");
    }
    // else if  (soundCloud == "" || soundCloud == null || soundCloud == undefined) {
    //   alert("Please Enter Website ");
    // }
    else
    {

    this.setState({ loading: true });
    
    const formData = new FormData();
    
    formData.append('ven_id', ven_id);
    formData.append('ven_title',name );
    formData.append('ven_location', region);
    formData.append('ven_region', fullBio);
    formData.append('ven_intro', bioShortIntroduction);
    formData.append('ven_content1', twitter);
    formData.append('ven_instagram', facebook);
    formData.append('ven_website', youtube);
    // console.log("Sound cloud......................",soundCloud)
    // formData.append('pro_soundcloud', soundCloud);
    // formData.append('image', ImageSource);

    const uriPart = ImageSource.split('.');
    const fileExtension = uriPart[uriPart.length - 1];

    formData.append('image', {
        uri: ImageSource,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`
    });

    fetch(appConstant.BASE_URL + appConstant.VENUEEDITPROFILE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
      body:formData 
    }).then((response) => {
      if (this.isJson(response._bodyInit)) {
        return response.json()
      } else {
        return response.text()
      }
    }).then((responseJson) => {
        console.log("Sucessfully Edit artist...", responseJson);
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            if (responseJson.success_code == 0) {
              this.props.navigation.goBack();
              alert(JSON.stringify(responseJson.message))
            }
            else {
              alert(responseJson.message)
            }
          }, 1000)

        });

        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Fail to sent mail Error : ", error);
      });
  }

  }
  venueEditProfileByID() {
    this.setState({ loading: true });
    
    fetch(appConstant.BASE_URL + appConstant.GETVENUE + '?ven_id=' +  this.state.ven_id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("Sucessfully Edit by id artist...", responseJson);
        this.setState({loading:false,
          artistDetailById: responseJson.results,
          name: responseJson.results.ven_title,
          region: responseJson.results.ven_location,
          fullBio: responseJson.results.ven_map,
          bioShortIntroduction: responseJson.results.ven_intro,
          twitter: responseJson.results.ven_content1,
          facebook: responseJson.results.ven_instagram,
          youtube: responseJson.results.ven_tweets,
          // soundCloud: responseJson.results[0].pro_soundcloud,
          ImageSource: appConstant.IMAGE_BASE_URL + responseJson.results.ven_thumb_path
        },
          () => {
            setTimeout(() => {
              if (responseJson.status_code == 0) {
              //  alert(JSON.stringify(this.state.artistDetailById))
              // alert(responseJson.message)
              }
              else {
                // alert(responseJson.message)
              }
            }, 1000)
          });

        return responseJson;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Fail to sent mail Error : ", error);
      });
  }


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
    headerTitleStyle: { color: '#6F8792', padding: Platform.OS === 'ios' ? 50 : 80 },
    headerStyle: {
      borderBottomColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0
    },
  });

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        // alert(response.uri)
        this.setState({
          ImageSource: response.uri
        });
      }
    });
  }
  render() {
    return (
      
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
      <Content style={{height: 100}}>
        {/* <ScrollView> */}
          <View style={styles.container}>
            <TouchableOpacity>
              <View style={styles.ImageContainer}>
                {this.state.ImageSource === null ? <Image style={styles.ImageContainer} source={require('../../Assets/img/Person.png')} /> :
                  <Image style={styles.ImageContainer} source={{uri : this.state.ImageSource}} >
                  </Image>
                }
              </View>
            </TouchableOpacity>
            <Icon
              reverse
              name='account-edit'
              type='material-community'
              color='#6F8792'
              size={20}
              containerStyle={{ position: 'absolute', top: 80, left: screen.width / 1.75 }}
              onPress={this.selectPhotoTapped.bind(this)}
            />
          </View>
          <View style={{ padding: 30, marginTop: 10 }}>
            <TextInput
              onSubmitEditing={() => { this.txtregion.focus() }}
              blurOnSubmit={false}
              style={styles.EmailTextInput}
              retunKeyLabel={true}
              placeholder="Venue/Name"
              underlineColorAndroid='transparent'
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize='none'
              fontSize={18}
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}>
            </TextInput>
            <TextInput
              ref={(input) => this.txtregion = input}
              onSubmitEditing={() => { this.txtbioshort.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              placeholder="Town/City"
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.region}
              onChangeText={(region) => this.setState({ region })}>
            </TextInput>
            <TextInput
              ref={(input) => this.txtbioshort = input}
              onSubmitEditing={() => { this.txtFullBio.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize='none'
              placeholder="Region"
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.fullBio}
              onChangeText={(fullBio) => this.setState({ fullBio })}>
            </TextInput>
            <TextInput
              ref={(input) => this.txtFullBio = input}
              onSubmitEditing={() => { this.txttwitter.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              placeholder="Venue short introduction"
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.bioShortIntroduction}
              onChangeText={(bioShortIntroduction) => this.setState({ bioShortIntroduction })}>
            </TextInput>
            <TextInput
              ref={(input) => this.txttwitter = input}
              onSubmitEditing={() => { this.txtFacebook.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              placeholder="Full Description"
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.twitter}
              onChangeText={(twitter) => this.setState({ twitter })}>
            </TextInput>
            <TextInput
              ref={(input) => this.txtFacebook = input}
              onSubmitEditing={() => { this.txtYoutube.focus() }}
              blurOnSubmit={false}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              placeholder="Facebook"
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.facebook}
              onChangeText={(facebook) => this.setState({ facebook })}>
            </TextInput>
            <TextInput
              ref={(input) => this.txtYoutube = input}
              // onSubmitEditing={() => { this.txtSoundCloud.focus() }}
              // blurOnSubmit={false}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              placeholder="Web site"
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.youtube}
              onChangeText={(youtube) => this.setState({ youtube })}>
            </TextInput>
            {/* <TextInput
              ref={(input) => this.txtSoundCloud = input}
              style={styles.passwordTextInput}
              retunKeyLabel={true}
              placeholder="Sound Cloud"
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              fontSize={18}
              value={this.state.soundCloud}
              onChangeText={(soundCloud) => this.setState({ soundCloud })}>
            </TextInput> */}


            <TouchableOpacity style={{ backgroundColor: '#6F8792', justifyContent: 'center', marginTop: 40, padding: 10, borderRadius: 10 }}
              onPress={this.venueEditProfile.bind(this)}>
              <Text style={{ color: 'white', alignSelf: 'center', justifyContent: 'center' }}>Save</Text>
            </TouchableOpacity>
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
        {/* </ScrollView> */}
        </Content>
      </TouchableWithoutFeedback>
 
    )
  }
}

const styles = StyleSheet.create({
  EmailTextInput: {
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  EmailTextInput: {

    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  passwordTextInput: {

    marginTop: 25,
    alignContent: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  ImageContainer: {
    borderRadius: 72,
    width: 150,
    height: 150,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',

  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(52,52,52,0.5)'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52,52,52,0.5)"
  },
})
AppRegistry.registerComponent('uGigs', () => VenueEditProfile);







