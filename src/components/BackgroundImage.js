import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Images from '../theme/Images'

class BackgroundImage extends Component {
    render() {
        return (
            <Image
              style={styles.backgroundImage}
              source={Images.main_bg}
            />
        );
    }
}

export default BackgroundImage;

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '101%',
        height: '101%',
    },
});