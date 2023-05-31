import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
class LabelFormInput extends Component {
    render() {
        const { value, placeholder, onChangeText, onSubmitEditing, onClear } = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.textInput}
                        placeholderTextColor="#acacac"
                        underlineColorAndroid='transparent'
                        returnKeyType={"search"}
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        onSubmitEditing={onSubmitEditing}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={() => {
                        if (value && value.length > 0 && onClear) {
                            onClear()
                        }
                    }}>
                        <Image
                          style={styles.searchIcon}
                          source={(value && value.length > 0) ? Images.close_icon : Images.search_icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default LabelFormInput;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
        paddingHorizontal: 20,
    },

    content: {
        backgroundColor: 'white',        
        height: 50,
        borderRadius: 25,
        paddingLeft: 25,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D8D8D8',
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.regular, 
        color: 'black',
    },

    searchButton: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    searchIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});