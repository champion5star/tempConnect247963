import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import Images from '../theme/Images'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'

export default class CublicSelect extends React.Component {
  	render() {
        const { label, value, onSelect } = this.props;
    	return (
            <View>
                <Text style={styles.labelText}>{label}</Text>
                <TouchableOpacity style={styles.container} onPress={() => onSelect(!value)}>
                    <Image source={Images.cubic_logo} style={styles.cubicImage} />
                    <Image source={value ? Images.round_checkmark_selected : Images.round_checkmark} style={styles.checkBoxImage} />
                </TouchableOpacity>
            </View>		   	
    );
  }
}

const styles = StyleSheet.create({
	container: {
        marginTop: 10,
        height: 65,
        borderRadius: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8fa',
        borderWidth: 1,
        borderColor: '#d6d6d7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    labelText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: '#ACACAC',
        marginLeft: 10,
    },

	cubicImage: {
        width: 150,
        height: 31,
    },

	checkBoxImage: {
        width: 27,
        height: 27,
    },
});