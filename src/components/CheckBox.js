import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import Images from '../theme/Images'

export default class CheckBox extends React.Component {
  	render() {
		const { title, value } = this.props;
    	return (
		   	<View style={this.props.title ? styles.containerWithText: styles.container}>
		   		<TouchableOpacity style={styles.checkboxButton} onPress={() => this.props.onChange(!value)}>
		   			{
		   				value 
		   				? <Image style={styles.checkboxIcon} source={Images.checkbox_selected}/>
		   				: <Image style={styles.checkboxIcon} source={Images.checkbox_normal}/>
		   			
		   			}
		   		</TouchableOpacity>
		   		{
		   			title 
		   			? <Text style={styles.textLabel}>{title}</Text>
		   			: null
		   		}
		   		
	    	</View>
    );
  }
}

const styles = StyleSheet.create({
	container: {

	},

	containerWithText: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	checkboxButton: {

	},

	checkboxIcon: {
		width: 22,
		height: 22,
		resizeMode: 'contain',
	},

	textLabel: {
		marginLeft: 10,
		fontFamily: 'OpenSans',
		color: 'white',
	},
});