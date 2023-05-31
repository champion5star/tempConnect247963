import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'

export default class TextView extends Component {
    render() {
        const { 
            value,
            editable,
            onChangeText
        } = this.props;
        return (
            <TextInput
                style={[styles.textView, this.props.style]}
                multiline={true}
                underlineColorAndroid='transparent'
                multiline={true}
                editable={editable}  
                onChangeText={onChangeText}
                value={value}
            />
        );
    }
}

const styles = StyleSheet.create({
    textView: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: Colors.textViewColor,
        borderWidth: 1,
        borderColor: '#e8e8ea',
        height: 200,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'top'
    }    
});
