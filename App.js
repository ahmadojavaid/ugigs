/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator,} from 'react-navigation';
import SignArtist from './src/screens/components/SignArtist';
import SignVenue from './src/screens/components/SignVenue';
import RegisterArtist from './src/screens/components/RegisterArtist';
import RegisterVenue from './src/screens/components/RegisterVenue';
import Getstarted from './src/screens/components/Getstarted';
import GetStartedAnimation from './src/screens/components/GetStartedAnimation';
import ForgotPasswordArtist from './src/screens/components/ForgotPasswordArtist';
import ForgotPasswordVenue from './src/screens/components/ForgotPasswordVenue';
import ArtistPenddingGigs from './src/screens/components/ArtistPenddingGigs';
import Explore from './src/screens/components/Explore';
import ArtistVenue from './src/screens/components/ArtistVenue';
import Inbox from './src/screens/components/Inbox';
import Account from './src/screens/components/Account';
import VenueDetail from './src/screens/components/VenueDetail';
import ArtistDetail from './src/screens/components/ArtistDetail';
import ArtistEditProfile from './src/screens/components/ArtistEditProfile';
import VenueEditProfile from './src/screens/components/VenueEditProfile';
import ArtistChangePassword from './src/screens/components/ArtistChangePassword';
import VenueChangePassword from './src/screens/components/VenueChangePassword';
import ArtistChangeEmail from './src/screens/components/ArtistChangeEmail';
import VenueChangeEmail from './src/screens/components/VenueChangeEmail';
import ContactUsArtist from './src/screens/components/contactUsArtist';
import ContactUsVenue from './src/screens/components/contactUsVenue';
import SendMessage from './src/screens/components/SendMessage';
import ArtistReview from './src/screens/components/ArtistReview';
import ChatSection from './src/screens/components/ChatSection';
import BookNewGig from './src/screens/components/BookNewGig';
import VenueLookingFor from './src/screens/components/VenueLookingFor';
import SendMessageVenue from './src/screens/components/SendMessageVenue';
import CalenderAvaibility from './src/screens/components/CalenderAvaibility';
import VenueInbox from './src/screens/components/VenueInbox';
import LookingForData from './src/screens/components/LookingForData';

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
      
    )
  }
}

const TabNavigation = createBottomTabNavigator({
  Explore: {
    screen: Explore,
    navigationOptions: {
      tabBarLabel: 'Explore ',
      header: null,
      tabBarIcon: ({ tintColor }) =>
        <View style={{ backgroundColor: tintColor }}>
          <Image
            style={{ width: 25, height: 25 }}
            source={require('./src/Assets/img/explore_new.png')} />
        </View>
    }
  },
  ArtistPenddingGigs: {
    screen: ArtistPenddingGigs,
    navigationOptions: {
      tabBarLabel: 'Dashboard ',
      header: null,
      tabBarIcon: ({ tintColor }) =>
        <View style={{ backgroundColor: tintColor }}>
          <Image
            style={{ width: 25, height: 25 }}
            source={require('./src/Assets/img/dashboard.png')} />
        </View>
    }
  },

  ArtistVenue: {
    screen: ArtistVenue,
    navigationOptions: {
      tabBarLabel: 'Artist-Venue ',
      header: null,
      tabBarIcon: ({ tintColor }) =>
        <View style={{ backgroundColor: tintColor }}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require('./src/Assets/img/new_artist_venue.png')} />
        </View>
    }
  },
  Inbox: {
    screen: Inbox,
    navigationOptions: {
      tabBarLabel: 'Inbox ',
      header: null,
      tabBarIcon: ({ tintColor }) =>
        <View style={{ backgroundColor: tintColor }}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require('./src/Assets/img/message_new.png')} />
        </View>
    }
  },
  Account: {
    screen: Account,
    navigationOptions: {
      tabBarLabel: 'Account ',
      header: null,
      tabBarIcon: ({ tintColor }) =>
        <View style={{ backgroundColor: tintColor }}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require('./src/Assets/img/account.png')} />
        </View>
    }
  },
},
  {
    tabBarOptions: {
      activeTintColor: 'rgb(161, 110, 120)',
      inactiveTintColor: 'rgb(211,211,211)',
      activeBackgroundColor: '#FFFFFF',
      inactiveBackgroundColor: 'White',
      style: {
        borderTopColor: 'transparent',
      },
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
)

const StackNavigation = createStackNavigator({

  
  GetStartedAnimation: { screen: GetStartedAnimation, navigationOptions: { header: null } },
  Tabs: { screen: TabNavigation, navigationOptions: { header: null } },  
  Getstarted: { screen: Getstarted, navigationOptions: { header: null } },
  GetStartedAnimation: { screen: GetStartedAnimation, navigationOptions: { header: null } },
  RegisterArtist: { screen: RegisterArtist },
  SignArtist: { screen: SignArtist },
  ForgotPasswordArtist: { screen: ForgotPasswordArtist, navigationOptions: {} },
  ForgotPasswordVenue: { screen: ForgotPasswordVenue, navigationOptions: {} },
  ArtistDetail: { screen: ArtistDetail,navigationOptions:{ header:null} },
  VenueDetail: { screen: VenueDetail ,navigationOptions:{ header: null }},
  RegisterVenue: { screen: RegisterVenue },
  SignVenue: { screen: SignVenue },
  ArtistEditProfile: { screen: ArtistEditProfile },
  VenueEditProfile: { screen: VenueEditProfile },
  ArtistChangePassword: { screen: ArtistChangePassword },
  VenueChangePassword: { screen: VenueChangePassword },
  ArtistChangeEmail:{screen: ArtistChangeEmail},
  VenueChangeEmail:{screen: VenueChangeEmail},
  ContactUsArtist:{ screen: ContactUsArtist},
  ContactUsVenue:{ screen: ContactUsVenue},
  SendMessage: {screen: SendMessage},
  ArtistReview: {screen: ArtistReview},
  ChatSection: {screen: ChatSection},
  BookNewGig: {screen: BookNewGig},
  VenueLookingFor: {screen: VenueLookingFor},
  SendMessageVenue: {screen: SendMessageVenue},
  CalenderAvaibility: {screen: CalenderAvaibility},
  VenueInbox: {screen: VenueInbox, navigationOptions:{ header: null }},
  LookingForData: {screen: LookingForData}

})

const AppContainer = createAppContainer(StackNavigation);
console.disableYellowBox = true;


