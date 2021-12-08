import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, Dimensions, Modal, ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AppRegistry, AsyncStorage } from 'react-native';
import { Icon, Rating, AirbnbRating } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import appConstant from '../common/appConstant';

const screen = Dimensions.get('window')
export default class ArtistReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: '',
            subject: '',
            message: '',
            pro_id: '',
            pro_thumb_path: '',
            calendar_id: '',
            rating: false,
            // item: this.props.navigation.state.params.item.pro_id
            // item: this.props.navigation.state.params.item
            //   ven_id: this.props.navigation.state.params.ven_id
        }

    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
        console.log('StarCount',this.state.starCount)
    }

    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }


    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Review & Ratings",
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                <Icon name='angle-left'
                    type='font-awesome'
                    size={35}
                    color='#727272'
                    onPress={() => navigation.goBack()}
                />
            </TouchableOpacity>
        ),
        headerTintColor: '#A16E78',
    });

    async componentWillMount() {
        try {
            const data = await AsyncStorage.getItem('User');
            const User = JSON.parse(data)
            console.log("User", User.token)
            this.setState({ pro_id: User.id, token: User.token }, () => {

            })
            // alert(token)
        } catch (error) {
        }
        try {
            const vendata = await AsyncStorage.getItem('VenUser');
            const venUser = JSON.parse(vendata)
            console.log("VenUser", venUser)
            this.setState({ ven_id: venUser.id, ventoken: venUser.token }, () => {
            })
            // alert(token)
        } catch (error) {
        }

    }

    giveRateReview() {
        let formdata = new FormData();
        formdata.append("ven_id", this.state.ven_id);
        formdata.append("pro_id", this.state.pro_id);
        formdata.append("calendar_id", this.props.navigation.state.params.item.calendar_id);
        formdata.append("comments", this.state.message);
        formdata.append("score", this.state.starCount);

        // alert(JSON.stringify(formdata));

        fetch(appConstant.BASE_URL + appConstant.GIVERATEREVIEW, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token
            },
            body: formdata,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Rate........", responseJson);
                this.props.navigation.goBack();
                alert(JSON.stringify(responseJson.message))
                return responseJson;
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log("Rate Error........", error);
            });
    }


    handleStaffRatingChange(item) {
        this.setState()
        
    }
    render() {

        return (

            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <ImageBackground borderRadius={40} style={{
                        marginTop: 20,
                        borderRadius: 40,
                        width: 80,
                        height: 80,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        borderColor: '#9B9B9B',
                        backgroundColor: 'lightgrey',
                    }}
                    source={(this.state.pro_thumb_path == null || this.state.pro_thumb_path == '') ? require('../../Assets/img/placeholder.png') :
                {uri: appConstant.IMAGE_BASE_URL + this.state.pro_thumb_path}}
                        // source={require('../../Assets/img/images.jpeg')}
                    // source={(this.state.pro_thumb_path == null || this.state.pro_thumb_path == '') ? require('./Assets/img/placeholder.png') :
                    //     { uri: appConstant.IMAGE_BASE_URL + this.state.pro_thumb_path }}
                    >

                    </ImageBackground>
                    <View>
                        <Text style={{ alignSelf: 'center', marginTop: 20, color: '#727272', fontSize: 18, fontWeight: '600' }}>RATE YOUR EXPERIENCE </Text>
                        <View style={{ marginTop: 20 }}>
                            {/* <AirbnbRating
                            ratingBackgroundColor='red'
                            type='custom'
                            count={5}
                            size={35}
                            defaultRating={1}
                            showRating={false}
                            ratingColor='blue'
                            onChange={this.handleStaffRatingChange} 
                            onPress={() => this.props.navigation.navigate('ArtistDetail')}/> */}

                            <StarRating
                                disabled={false}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                fullStarColor={'#A16E78'}
                            />
                                    
                        </View>
                        <Text style={{ alignSelf: 'center', marginTop: 20, color: '#727272', fontSize: 15 }}>Tap a star to rate </Text>
                        <TextInput
                            multiline
                            placeholderTextColor="#727272"
                            numberOfLines={5}
                            style={{ marginTop: 25, borderRadius: 10, backgroundColor: '#e5e5e5', height: 150, paddingHorizontal: 10 }}
                            placeholder="Leave a review"
                            returnKeyType="done"
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(message) => this.setState({ message })}>
                        </TextInput>

                        <TouchableOpacity onPress={() => this.giveRateReview()}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#A16E78', marginLeft: '5%', marginRight: '5%', marginTop: 30, height: 45, borderRadius: 10 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Post</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: 'rgb(255,255,255)',
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 20
    },
    passwordTextInput: {
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: 25,
        borderRadius: 10,
        backgroundColor: '#e5e5e5',
        height: 45,
        padding: 10,
        color: '#727272'
    }
});
AppRegistry.registerComponent('uGigs', () => ArtistReview);



