import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Content } from 'native-base';
import appConstant from '../common/appConstant';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

class ChatInputToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: '',
            pro_thumb_path: '',
            pro_title: '',
            // item: this.props.navigation.state.params.item
        };

    }

    onSend(messages) {
        let formdata = new FormData();
        formdata.append("rep_pm_id", this.props.navigation.state.params.item.pm_id);
        formdata.append("rep_from", this.props.navigation.state.params.item.pm_from);
        formdata.append("rep_body", this.state.messages);
        fetch(appConstant.BASE_URL + appConstant.CHATSENDMESSAGE, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            body: formdata
        }).then((response) => {
            if (this.isJson(response._bodyInit)) {
                return response.json()
            } else {
                return response.text()
            }
        }).then((responseJson) => {
            this.setState((previousState) => {
                return {

                    messages: GiftedChat.append(previousState.messages, messages),

                };

            });
        })
            .catch((error) => {
                console.log
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


    onChangeText = (text) => {
        if (text.length > 0) {
            this.props.onTextChanged({ text: text.trim() })
        }
    };

    onSend = () => {
        const { onSend } = this.props;
        if (this.props && this.props.text && this.props.text.text && this.props.text.text.length > 0) {
            onSend && onSend(this.props.text);
        }
    };


    renderSend = () => {

        const { sendContainer, sendIcon } = styles;

        return (
            <Content style={{ height: 50 }}>
                <TouchableOpacity onPress={this.onSend()}
                    style={sendContainer}>
                    <Icon
                        reverse
                        name='paper-plane'
                        type='font-awesome'
                        size={13}
                        color='#A16E78'
                        //  style={sendIcon}
                        onPress={this.onSend()}
                        style={sendIcon} resizeMode={'contain'} />
                </TouchableOpacity>
            </Content>
        )
    };



    render() {
        const { container, inputContainer, inputStyle } = styles;

        return (

            <View style={container}>
                <View style={{ alignItems: 'flex-end' }}>
                    {this.props.renderActions && this.props.renderActions(this.props)}
                </View>

                <View style={inputContainer}>
                    <TextInput
                        style={inputStyle}
                        placeholder='message'
                        placeholderTextColor='gray'
                        // onChangeText={(text) => this.onChangeText(text)}
                        onChangeText={(text) => this.setState({ text })}
                        multiline
                        // value={this.props.text}
                        {...this.props.textInputProps}
                    />
                </View>
                <View>
                    {this.renderSend()}
                </View>

            </View>

        )
    }
}

export { ChatInputToolBar }

ChatInputToolBar.defaultProps = {
    text: ' ',
};

ChatInputToolBar.propTypes = {
    text: PropTypes.string
};

const styles = StyleSheet.create({
    // sendContainer: {
    //     // backgroundColor: Constant.color.lightblue,
    //     height: 70,
    //     width: 5,
    //     borderRadius: 2.5,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: 'yellow'
    // },
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
        backgroundColor: 'lightgray',
        // backgroundColor: Constant.color.blue,
        alignItems: 'center',
    },
    inputContainer: {
        marginHorizontal: 3,
        flex: 1,
        paddingHorizontal: 4,
        borderRadius: 25,
        marginLeft: 5,
        maxHeight: 25,
        justifyContent: 'center'
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 7
        // fontSize: 20
    },

    sendstyle: {
        height: 5,
        width: 5,
        borderRadius: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 10
    }
});