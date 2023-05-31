import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Fonts from '../theme/Fonts'

export default class Button extends React.Component {
  	render() {
		const { type, title } = this.props;
		
    	return (
		   	<TouchableOpacity style={[this.props.style, styles.buttonContainer]} onPress={() => this.props.onPress()}>
		   		<Text style={[
					(type === 'bold') ? styles.boldText : styles.normalText,
		   			]}>{title}</Text>
	   		</TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
	buttonContainer: {
		alignItems: 'center',
	},

	normalText: {
		fontSize: 15,
		fontFamily: Fonts.bold,
		color: 'white',		
	},

	boldText: {
		fontSize: 18,
		fontFamily: Fonts.medium,
		color: 'rgba(255, 255, 255, 0.7)',		
		letterSpacing: 2,
	},

	underlineText: {
		textDecorationLine: 'underline',
	},
});