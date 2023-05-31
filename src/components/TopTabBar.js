import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Fonts from "../theme/Fonts"
import Colors from "../theme/Colors"

const width = Dimensions.get('window').width;

export default class TopTabBar extends React.Component {
	render() {
		const { titles, currentPage, onSelectPage } = this.props;
		return (
			<View style={[styles.container, this.props.style]}>
				{
					titles.map((title, i) =>
    		    	<TouchableOpacity 
    		    		style={[styles.tabButton, currentPage == i ? styles.selectButton : null, {width: (width / titles.length)}]} 
    		    		onPress={() => onSelectPage(i)} 
    		    		key={i} >
						<Text style={currentPage == i ? styles.buttonSelectText : styles.buttonText}>{title}</Text>
					</TouchableOpacity>	  
    				)
				}
	    	</View>
	    );
  	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
		height: 48,
	},

	tabButton: {
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',		
	},

	selectButton: {
		borderBottomWidth: 3,
		borderBottomColor: Colors.pageColor,
	},

	buttonText: {
		textAlign: 'center',
		fontFamily: Fonts.light,
		color: 'white',
		letterSpacing: 1,
		fontSize: 14,
		opacity: 0.7
	},

	buttonSelectText: {
		textAlign: 'center',
		fontFamily: Fonts.regular,
		letterSpacing: 1,
		fontSize: 14,
		color: 'white',
	},
});