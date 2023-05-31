import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

export default class Label extends React.Component {
  	render() {
		const { title } = this.props;
    	return (
    		<View style={styles.container}>
    			<Image style={styles.sadIcon} source={Images.sad}/>
    			<Text style={[this.props.style, styles.textLabel]}>{title}</Text>
    		</View>	   		
    	);
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		top: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},

	sadIcon: {
		width: 50,
		height: 50,
		marginBottom: 10,
		resizeMode: 'contain',
	},
	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 18,
	}
});