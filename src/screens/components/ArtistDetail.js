import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    AppRegistry,
    Platform,
    ScrollView,
    Dimensions,
    ImageBackground,
    Linking,
    Modal,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { Icon, Rating, AirbnbRating } from 'react-native-elements';
import appConstant from '../common/appConstant';
import StarRating from 'react-native-star-rating';

const screen = Dimensions.get('window')

const numColumns = 500
export default class ArtistDetail extends React.Component {
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
            artistRate: {},
            artistAlbumList: [],
            venue_albums: [],
            project_albums: '',
            loading: false,
            project_rate_avg: '',
            item: this.props.navigation.state.params.item
        }
        // alert(this.props.navigation.state.params.item.pro_id);
        console.log("this.props.navigation.state.params.item", this.props.navigation.state.params.item);
        this.artistRateReview = this.artistRateReview.bind(this);
    }
    async componentWillMount() {

        try {
            const data = await AsyncStorage.getItem('User');
            const User = JSON.parse(data)
            console.log("User", User.token)
            this.setState({ pro_id: User.id, token: User.token }, () => {
                this.artistRateReview()
            })
            // alert(token)
        } catch (error) {
        }
    }


    onCount = () => {
        this.setState({
            count: this.state.count + 1
        })
    }

    ratingCompleted(rating) {
        alert("Rating is" + rating)
        console.log("Rating is: " + rating)
    }

    artistRateReview() {
        this.setState({ loading: true });
        fetch(appConstant.BASE_URL + appConstant.GETPROJECTWITHRATEREVIEW + '?pro_id=' + this.state.pro_id, {
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

            // console.log("GETPROJECTWITHRATEREVIEW", JSON.stringify(responseJson));
            // alert(JSON.stringify(responseJson))
            this.setState({ loading: false, artistRate: responseJson.results[0] });

        })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Artist Details Error : ", error);
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
    render() {
        const { navigation } = this.props;
        const { item, pro_id, ven_id, artistRate } = this.state;

        return (
            <ScrollView>
                <View style={{ backgroundColor: 'white', flex: 1 }}>

                    <View style={{ flexDirection: 'row', width: screen.width, height: 220 }}>

                        <ImageBackground style={{ width: screen.width, height: 220, position: 'absolute', }} source={(item.pro_thumb_path == null || item.pro_thumb_path == "") ? require('../../Assets/img/placeholder.png') :
                            { uri: appConstant.IMAGE_BASE_URL + item.pro_thumb_path }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ position: 'absolute', top: 15, left: 15 }}>
                                <Icon name='angle-left'
                                    type='font-awesome'
                                    size={35}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </ImageBackground>
                        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', alignSelf: 'flex-end', }}>

                            <Text style={{ color: 'gray', fontSize: 12, marginStart: 9, padding: 5 }}>{item.pro_title}</Text>
                            {/* <Text numberOfLines={1} style={{ color: '#A16E78', fontSize: 20, fontWeight: '600', marginStart: 10 }}>{item.pro_content1}</Text> */}
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ backgroundColor: '#A16E78', borderRadius: 20, marginTop: 5, width: 140, marginStart: 9, paddingEnd: 15, marginBottom: 8 }}
                                    // onPress={()=>alert(artistRate.project_albums[0].ven_id)}
                                    onPress={() => (pro_id == null || pro_id == "") ?
                                        this.props.navigation.navigate('GetStartedAnimation', { from: 'ArtistVenue' })
                                        :
                                        // this.props.navigation.navigate('BookNewGig', { item: artistRate[0].ven_id })}
                                        this.props.navigation.navigate('BookNewGig', { item: item })}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', alignSelf: 'center', padding: 5 }}>{'Book'}</Text>
                                </TouchableOpacity>
                                {this.state.pro_id == "" || this.state.token == "" ?
                                <Icon
                                    reverse
                                    name='comment'
                                    type='font-awesome'
                                    color='#A16E78'
                                    size={13}
                                    style={{ flex: 1, marginBottom: 8 }}
                                    onPress={() => this.props.navigation.navigate('SendMessage', { item: item })}
                                />
                                :null}
                            </View>
                        </View>
                    </View>
                </View>
                {/* </View> */}
                <Text style={styles.staticText}>
                    {/* Singer / SongWriter from London.My influenece range from Eva Cassidy to Adele and a whole muddle of other people in-betwwen.My style has been  described as a female version of Damien Rice with a Lilly Allen twist to it which I'hv always thought was a pretty cool way of describing it!! */}
                    {item.pro_content1}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 0.4 }}>
                        <Icon
                            name='facebook-with-circle'
                            type='entypo'
                            color='#A16E78'
                            size={25}
                            onPress={() => Linking.openURL('http://www.facebook.com')} />
                        <Icon
                            name='instagram'
                            type='font-awesome'
                            color='#A16E78'
                            size={25}
                            onPress={() => Linking.openURL('http://www.instagram.com')} />
                        <Icon
                            name='youtube-with-circle'
                            type='entypo'
                            color='#A16E78'
                            size={25}
                            onPress={() => Linking.openURL('http://www.youtube.com')} />
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', flex: 2.45 }}>
                        <Text style={{ textAlign: 'right', fontSize: 20, color: 'grey', marginStart: 100 }}>Ratings</Text>
                        <AirbnbRating
                            count={5}
                            size={22}
                            showRating={false}
                            ratingColor='#3498db'
                            // onFinishRating={this.ratingCompleted}
                            />
                        

                        {/* <StarRating
                                disabled={false}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.onCount(rating)}
                                fullStarColor={'#A16E78'}
                            /> */}

                        {/* <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={25}
                            rating={this.state.starCount}
                            emptyStarColor={"#fdcb1e"}
                            fullStarColor={"#fdcb1e"}
                        /> */}

                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: 20 }}>
                    <Text style={{ fontSize: 20, color: 'grey', margin: 15, flex: 1.5 }}>Albums</Text>
                    <View style={{ backgroundColor: 'grey', height: 1 }}></View>
                </View>

                <View style={{ height: 110 }}>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FlatList
                                data={this.state.artistRate}
                                numColumns={numColumns}
                                renderItem={({ item }) =>
                                    <TouchableOpacity>
                                        <View style={{ width: 100, height: 100, flexDirection: 'row', marginLeft: 20, }}>
                                            <ImageBackground style={{ width: 100, height: 100, position: 'absolute', }} source={(item.ven_thumb_path == null || item.ven_thumb_path == "") ?
                                                require('../../Assets/img/placeholder.png')
                                                :
                                                { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></ImageBackground>
                                            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', alignSelf: 'flex-end' }}>
                                                <Text style={{ color: '#A16E78', fontSize: 12, padding: 5 }}>{item.pro_title}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.calendar_id}
                            />
                        </View>
                    </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: 20 }}>
                    <Text style={{ fontSize: 20, color: 'grey', margin: 15, flex: 1.5 }}>Review</Text>
                    <View style={{ backgroundColor: 'grey', height: 1, flex: 5 }}></View>
                </View>
                <View>
                    {/* <FlatList
                    extraData={this.state}
                    
                        data={this.state.artistRate}
                        renderItem={({ item ,index}) =>

                        alert(item[index])
                            // <View style={styles.flatview}>
                            //     <ImageBackground style={{ height: 100, width: 50, borderRadius: 10 }}>{item.image}</ImageBackground>
                            //     <View style={{ flexDirection: 'column', marginStart: 10 }}>
                            //         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            //             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 2.5 }}>
                            //                 <Text style={styles.nameVenue}>{item[index].pro_title}</Text>
                            //             </View>
                            //             <View style={{ flexDirection: 'row', alignSelf: 'flex-end', flex: 2, marginStart: 45 }}>
                            //                 <AirbnbRating
                            //                     count={5}
                            //                     size={10}
                            //                     showRating={false}
                            //                     color='black'
                            //                     ratingColor='blue' />
                            //             </View>
                            //         </View>
                            //         <Text style={styles.emailVenue}>{item.calendar_review}</Text>
                            //     </View>
                            // </View>
                        }
                        keyExtractor={item => item.image}
                    /> */}


                    <FlatList
                        data={this.state.artistRate}
                        renderItem={({ item, index }) =>

                            <View style={styles.flatview}>
                                <ImageBackground borderRadius={25} style={{ height: 50, width: 50, }} source={item.ven_thumb_path == null ? require('../../Assets/img/placeholder.png') :
                                    { uri: appConstant.IMAGE_BASE_URL + item.ven_thumb_path }}></ImageBackground>
                                {/* <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                    <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={styles.nameVenue}>{item.pro_title}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginStart: 45, justifyContent:'space-between' }}>
                                            <AirbnbRating
                                                count={5}
                                                size={10}
                                                showRating={false}
                                                ratingColor='blue' />
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={styles.emailVenue}>{item.calendar_review}</Text>

                                </View> */}
                                <View style={{ flex: 1, justifyContent: 'space-between', marginStart: 10 }}>
                                    <Text style={styles.nameVenue}>{item.ven_title}</Text>
                                    <Text style={styles.emailVenue}>{item.calendar_review}</Text>
                                </View>

                                <AirbnbRating
                                    count={5}
                                    size={10}
                                    showRating={false}
                                    ratingColor='blue'
                                    onFinishRating={this.ratingCompleted} />

                            </View>
                        }
                        keyExtractor={item => item.pro_id}
                    />

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
            </ScrollView>

        )
    }
}
const styles = StyleSheet.create({
    elevationLow: {
        width: screen.width,
        height: 160,
        position: 'absolute',
        flexDirection: 'row'
    },
    staticText: {
        textAlign: 'left',
        color: 'grey',
        margin: 15, fontSize: 13
    },
    flatview: {
        //alignSelf: 'center',
        //justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(121,121,121)',
        marginLeft: 20,
        marginRight: 20
    },
    nameVenue: {
        color: '#A16E78',
        // fontSize: 25,
        fontWeight: '700',
        fontFamily: 'Verdana',
        fontSize: 15
    },
    emailVenue: {
        marginTop: 8,
        fontSize: 13,
        color: 'grey',
        marginRight: 40
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,52,52,0.5)"
    },
})

var FlatListdata1 = [
    {
        "name": "Whitton club",
        "email": "very good music effect.it was nice sound track.High qulity music system.we are enjoy this song during",
        "image": <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 50, width: 50, borderRadius: 25 }} />
    },
    {
        "name": "Whitton club",
        "email": "very good music effect.it has nice sound track High qulity music.",
        "image": <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 50, width: 50, borderRadius: 25 }} />
    },
    {
        "name": "Whitton club",
        "email": "very good music effect.it was nice sound track.High qulity music system.we are enjoy this song during",
        "image": <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 50, width: 50, borderRadius: 25 }} />
    },
    {
        "name": "Whitton club",
        "email": "very good music effect.it has nice sound track High qulity music.",
        "image": <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 50, width: 50, borderRadius: 25 }} />
    },
    {
        "name": "Whitton club",
        "email": "very good music effect.it was nice sound track.High qulity music system.we are enjoy this song during",
        "image": <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 50, width: 50, borderRadius: 25 }} />
    },
];
var FlatListDataHorizontal = [
    {
        "image1": <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 100, width: 100, }} />,
        "name1": "Love Mashup"
    },
    {
        "image1": <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 100, width: 100, }} />,
        "name1": "Silent Killer"
    },
    {
        "image1": <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 100, width: 100, }} />,
        "name1": "Dremer Rock"
    },
    {
        "image1": <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 100, width: 100, }} />,
        "name1": "Dremer Rock"
    },
    {
        "image1": <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 100, width: 100, }} />,
        "name1": "Dremer Rock"
    },
]

var FlatlistData = [
    {
        id: 1,
        image: <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
    {
        id: 2,
        image: <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
    {
        id: 3,
        image: <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
    {
        id: 4,
        image: <Image source={require('../../Assets/img/grid3.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
    {
        id: 5,
        image: <Image source={require('../../Assets/img/grid.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
    {
        id: 6,
        image: <Image source={require('../../Assets/img/grid1.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
    {
        id: 7,
        image: <Image source={require('../../Assets/img/grid2.jpeg')} style={{ height: 160, width: 170 }} />,
        name1: "Dreamer Rock",
        BandName: "Whitton club"
    },
];
AppRegistry.registerComponent('uGigs', () => ArtistDetail);

