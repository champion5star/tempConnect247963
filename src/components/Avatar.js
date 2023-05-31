import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import FastImage from 'react-native-fast-image'

class Avatar extends Component {
    render() {
        const { avatar, status } = this.props; 
        return (
            <View style={[this.props.style, styles.container]}>
                <View style={styles.avatarBox}>
                    <FastImage
                      style={styles.avatarImage}
                      source={(avatar && avatar != "") ? {uri: avatar} : Images.account_icon}
                    />
                </View>                
                {status && <Text style={styles.statusText}>{status}</Text>}
            </View>
        );
    }
}

export default Avatar;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarBox: {
        width: 140,
        height: 140,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 70,
        overflow: 'hidden',
    },

    avatarImage: {
        width: 130,
        height: 130,
        resizeMode: 'cover',
        borderRadius: 10,        
        borderRadius: 65,
    },

    statusText: {
        borderWidth: 1,
        borderColor: '#e4e8ea',
        borderRadius: 10,
        textTransform: 'uppercase',
        fontFamily: 'OpenSans',
        fontSize: 9,
        borderColor: Colors.ticketColor,
        color: Colors.ticketColor,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: -15,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
});