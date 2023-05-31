import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Images from '../theme/Images'
import { ifIphoneX } from 'react-native-iphone-x-helper'

class NavBackImage extends Component {
    render() {
        const { size } = this.props;
        return (
            <Image source={Images.top_gradient_box} style={[styles.navBackImage, size === 'large' ? styles.large : styles.normal]}/>
        );
    }
}

export default NavBackImage;
const styles = StyleSheet.create({
    navBackImage: { 
		position: 'absolute',
        left: 0,
        width: '100%',
		resizeMode: 'contain',
    },
    
    large: {
        ...ifIphoneX({
            top: -300,
        }, {
            top: -350,
        })
    },

    normal: {
        ...ifIphoneX({
            top: -410,
        }, {
            top: -440,
        })
    }
});