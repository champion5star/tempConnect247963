import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../../theme/Images';

export default class EditAvatar extends Component {
    render() {
        const { avatar } = this.props;
        const avatarImage = avatar ? {uri: avatar} : Images.account_icon;
        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onTakePhoto()}>
                <View style={styles.avatarBox}>
                    <Image
                      style={styles.avatarImage}
                      source={avatarImage}
                    />
                </View>                
                <View style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center', zIndex: 10}}>
                    <Image
                      style={styles.photoIcon}
                      source={Images.white_photo_icon}
                    />
                </View>                
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 130,
    },

    avatarBox: {
        width: '100%',
        height: '100%',
        borderRadius: 65,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f4f4f4',
    },

    avatarImage: {
        width: 115,
        height: 115,
        borderRadius: 57,
        resizeMode: 'cover',
    },

    photoIcon: {
        width: 60,
        height: 47,
        resizeMode: 'contain',
    },
});