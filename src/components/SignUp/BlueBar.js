import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts' 

export default class BlueBar extends React.Component {
  	render() {
		const { title, theme } = this.props;
     	return (
	   		<Text style={[this.props.style, styles.textLabel, (theme === "black") ? styles.blackText : styles.whiteText]}>{this.props.title}</Text>
    );
  }
}

const styles = StyleSheet.create({
	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 16,
		padding: 10,
		textAlign: 'center',
		zIndex: 2,
	},

	whiteText: {
		color: 'rgba(255, 255, 255, 0.6)',
	},

	blackText: {
		color: 'rgba(0, 0, 0, 0.3)',
	}
});