import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import Fonts from '../../theme/Fonts'

export default class PageTitle extends Component {
    render() {
        const { title } = this.props; 
        return (
            <Text style={styles.titleText}>{title}</Text>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        textAlign: 'center',
        fontFamily: Fonts.medium,
        fontSize: 17,
        color: '#353E48',
        marginTop: 30,
        marginBottom: 30,
        paddingHorizontal: 20,
    },   
});