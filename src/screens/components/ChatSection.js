import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, View, StyleSheet, Text, Image, Dimensions, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// import { ChatInputToolBar } from './ChatInputToolBar';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import { Content } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import appConstant from '../common/appConstant';


const screen = Dimensions.get('window')


export default class ChatSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      rmessage: [],
      date: '',
      pro_thumb_path: '',
      pro_title: '',
      pm_from: '',
      pm_subject: '',
      pm_id: '',
      pm_pro_id: '',
      ven_title: '',
      pm_venue_id: '',
      pm_latest_date: '',
      rep_pm_id:'',
      item: this.props.navigation.state.params.item
    };
  
  }

  async componentWillMount() {

    try {
      const data = await AsyncStorage.getItem('User');
      const User = JSON.parse(data)
      // console.log("User", User.token)
      this.setState({ pro_id: User.id, token: User.token }, () => {
         this.chatHistroy()
      })

      const vendata = await AsyncStorage.getItem('VenUser');
      const venUser = JSON.parse(vendata)
      this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {
      })
    } catch (error) {
    }
  }

  chatHistroy() {
    fetch(appConstant.BASE_URL + appConstant.CHATSENDMESSAGELIST + '?rep_pm_id=' + this.props.navigation.state.params.item.pm_id, {
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
      console.log("CHAT HISTORY", responseJson);
      this.setState({ loading: false, messages: [] }, () => {
      });
      var messageList = [];
      responseJson.results.map((item, index) => {
        let message = {
          _id: item.rep_pm_id,
          text: item.rep_body,
          user: {
            _id: item.rep_pm_id,
            name: item.rep_body,
            isSender: false,
          },
        }
          messageList.push(message); 
      });

      this.setState({messages: messageList})
    })
      .catch((error) => {
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


  static navigationOptions = ({ navigation, screenProps }) => ({
    headerStyle: {
      height: screen.height / 10,
      // padding: 20,
      borderBottomWidth: 1,
    },
    headerLeft: (
      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Icon name='angle-left'
            type='font-awesome'
            size={35}
            color='#727272'
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>

        <Image
          borderRadius={20}
          style={{
            width: 40,
            height: 40,
            marginStart: 20,
            backgroundColor: 'lightgrey',
          }} source={require('../../Assets/img/Person.png')}>
        </Image>
        <View>
          <Text style={{ color: '#727272', marginStart: 20, fontSize: 20, fontWeight: '600' }}>{navigation.state.params.item.ven_title}</Text>
          {/* <Text style={{ color: '#727272', fontSize: 11, marginStart: 20, marginTop: 5 }}>Sat 29 jun, 11:30 A.M</Text> */}
        </View>
      </View>
    ),
    headerTintColor: 'gray',
  });


  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#e5e5e5',
          },
          right: {
            backgroundColor: '#A16E78',
          }
        }}
        textStyle={{
          right: {
            color: 'white',
            fontSize: 14
          },
          left: {
            color: 'black', 
            fontSize: 14
          }
        }}
      />
    );
  }

  renderSend(props) {
    const { sendContainer, sendIcon, sendstyle } = styles;
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <Icon
            reverse
            name='paper-plane'
            type='font-awesome'
            size={13}
            color='#A16E78'
            style={sendIcon}
          />
        </View>
      </Send>
    );
  }

  onSend(messages = []) {
    let formdata = new FormData();
    formdata.append("rep_pm_id", this.props.navigation.state.params.item.pm_id);
    formdata.append("rep_from", this.props.navigation.state.params.item.pm_from);
    formdata.append("rep_body", messages[0].text);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))

    fetch(appConstant.BASE_URL + appConstant.CHATSENDMESSAGE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: formdata
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log("messages data", JSON.stringify(messages))
    })
      .catch((error) => {
        console.log("Error:", error);
        this.setState({ loading: false });
      });
  }


  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderSend={this.renderSend}
        renderBubble={this.renderBubble}
        user={{
            _id: parseInt(rep_pm_id),
            name: this.state.pro_title,
            isSender: true
        }}
      />
    );
  }
}


const styles = StyleSheet.create({
  sendIcon: {
    height: 2.5,
    width: 2.5
  },
  container: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    // backgroundColor: Constant.color.blue,
    alignItems: 'center',
  },
  inputContainer: {
    marginHorizontal: 3,
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
    backgroundColor: 'white',
    // paddingVertical: Constant.isIOS && hp('1.2%') || hp('0.2%'),
    // backgroundColor: Constant.color.white,
    borderRadius: 20,
    maxHeight: 10,
    justifyContent: 'center'
  },
  inputStyle: {
    backgroundColor: 'white',
    fontSize: 20
  },

  sendstyle: {
    height: 5,
    width: 5,
    borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 5
  }
});