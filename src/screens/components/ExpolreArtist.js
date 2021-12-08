import React, { Component } from 'react';

import { StyleSheet, View, Platform, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, Image } from 'react-native';

export default class App extends Component {

  constructor() {
    super();

    this.state = {

    }
  }

  ChangeGridValueFunction = () => {

    if (this.state.GridColumnsValue === true) {
      this.setState({

        GridColumnsValue: false,
        ButtonDefaultText: "CHANGE TO LISTVIEW"

      })
    }
    else {

      this.setState({

        GridColumnsValue: true,
        ButtonDefaultText: "CHANGE TO GRIDVIEW"

      })

    }

  }

  GetGridViewItem(item) {

    Alert.alert(item);

  }

  render() {


    return (

      <View style={styles.MainContainer}>

        <FlatList

          data={FlatlistData}

          renderItem={({ item }) =>

            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>

              <ImageBackground style={styles.ImageComponentStyle}  >{item.image}</ImageBackground>

              <Text onPress={this.GetGridViewItem.bind(this, item.flower_name)} style={styles.ItemTextStyle} numberOfLines={1} >{item.name1}</Text>

            </View>

          }

          numColumns={this.state.GridColumnsValue ? 1 : 2}
          key={(this.state.GridColumnsValue) ? 'ONE COLUMN' : 'TWO COLUMN'}
          keyExtractor={(item, index) => index}

        />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0
  },
  ImageComponentStyle: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    height: 100,
    backgroundColor: '#4CAF50',
    position: 'relative'
  },

  ItemTextStyle: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#4CAF50',
    marginBottom: 5

  },

  ButtonStyle: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FF9800',
    width: '100%',
    height: 50
  },

  ButtonInsideTextStyle: {
    color: '#fff',
    textAlign: 'center',
  }

});


var FlatlistData = [
  {
    id: 1,
    image: <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 100, width: 150 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },
  {
    id: 2,
    image: <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 100, width: 150 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },
  {
    id: 3,
    image: <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 100, width: 150 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },
  {
    id: 4,
    image: <Image source={require('../../Assets/img/grid3.jpeg')} style={{ height: 100, width: 150 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },
  {
    id: 5,
    image: <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 100, width: 150 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },
  {
    id: 6,
    image: <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 100, width: 200 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },
  {
    id: 7,
    image: <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 100, width: 450 }} />,
    name1: "Dreamer Rock",
    BandName: "Whitton club"
  },

];
