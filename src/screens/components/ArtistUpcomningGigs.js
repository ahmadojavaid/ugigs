import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image, FlatList, ScrollView, Dimensions, ImageBackground, AppRegistry
} from 'react-native';
import Swipeout from 'react-native-swipeout';

const ArtistUpcomingGigs = (props) => {   
        return (
            <FlatList

                data={FlatListdata1}
                renderItem={({ item }) =>
                    <Swipeout style={{ backgroundColor: 'white' }} autoClose={true} right={swipeoutBtns} >
                        <View style={styles.flatview}>
                            <ImageBackground style={{ height: 110, width: 100 }}>{item.image}</ImageBackground>
                            <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.email}>{item.email}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: '700', flex: 1, color: 'rgb(121,121,121)', fontSize: 15 }}>{item.Resverd}</Text>
                                </View>
                                <View>
                                    <Text style={{ marginTop: 10, color: 'grey' }}>{item.Date}</Text>
                                </View>
                            </View>
                        </View>
                    </Swipeout>
                }
            />
        )
            }  
const styles = StyleSheet.create({

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
        color: 'rgb(161, 110, 120)',
        fontSize: 32,
        fontWeight: '700',
        fontSize: 18
    },
    email: {
        marginTop: 8,
        fontSize: 15,
        color: 'grey'
    },
    nameVenue: {
        color: 'rgb(111, 135, 146)',
        fontSize: 32,
        fontWeight: '700',

        fontSize: 18
    },
    emailVenue: {
        marginTop: 8,
        fontSize: 15,
        color: 'grey'
    },
});

var swipeoutBtns = [
    {
        text: 'Accept',
        backgroundColor: 'green',
        onPress: this._onPressButton
    },
    {
        text: 'Reject',
        backgroundColor: 'red'
    }
]
const FlatListdata1 = [
    {
        id: 1,
        name: "Whitton club",
        email: "Dreamer Rock",
        Date: "02/02/2019 to 03/02/2019",
        Resverd: "Reserved Date:",
        image: <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 100, width: 100, borderRadius: 10 }} />

    },
    {
        id: 2,
        name: "Whitton club",
        email: "Dreamer Rock",
        Date: "05/02/2019 to 06/02/2019",
        Resverd: "Reserved Date:",
        image: <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 100, width: 100, borderRadius: 10 }} />
    },
    {
        id: 3,
        name: "Whitton club",
        email: "Dreamer Rock",
        Date: "08/03/2019 to 09/02/2019",
        Resverd: "Reserved Date:",
        image: <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 100, width: 100, borderRadius: 10 }} />
    },
    {
        id: 4,
        name: "Whitton club",
        email: "Dreamer Rock",
        Date: "21/03/2019 to 23/03/2019",
        Resverd: "Reserved Date:",
        image: <Image source={require('../../Assets/img/grid3.jpeg')} style={{ height: 100, width: 100, borderRadius: 10 }} />
    },
    {
        id: 5,
        name: "Whitton club",
        email: "Dreamer Rock",
        Date: "02/03/2019 to 03/03/2019",
        Resverd: "Reserved Date:",
        image: <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 100, width: 100, borderRadius: 10 }} />
    },
    {
        id: 6,
        name: "Whitton club",
        email: "Dreamer Rock",
        Date: "02/02/2019 to 05/02/2019",
        Resverd: "Reserved Date:",
        image: <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 100, width: 100, borderRadius: 10 }} />
    },
]
export {ArtistUpcomingGigs};