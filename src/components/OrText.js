import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Fonts from '../theme/Fonts';

class OrText extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.line}/>
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line}/>
            </View>
        );
    }
}

export default OrText;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },

    line: {
        width: 70,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    orText: {
        fontFamily: Fonts.medium,
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 20,
    },
});