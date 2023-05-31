import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'

export default class BlueInfoBar extends React.Component {
  	render() {
    	return (
    		<View style={styles.container}>
    			<View>
					<Text style={styles.labelText}>{this.props.title1}</Text>
    				<Text style={[styles.valueText, styles.greenText]}>{this.props.value1}</Text>		    			
    			</View>

    			<View>
					<Text style={styles.labelText}>{this.props.title2}</Text>					
    				<Text style={styles.valueText}>{this.props.value2}</Text>		    			
    			</View>

				<View>
					<Text style={styles.labelText}>{this.props.title3}</Text>					
    				<Text style={styles.valueText}>${this.props.value3}</Text>		    			
    			</View>
    		</View>
	   		
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		zIndex: 2,
		shadowColor: Colors.appColor,
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0,
		shadowRadius: 10,
		elevation: 5,
	},

	valueText: {
		fontFamily: Fonts.regular,
		fontSize: 20,
		color: 'black',
		textAlign: 'center',
	},

	greenText: {
		color: Colors.appColor,
	},

	labelText: {
		fontFamily: Fonts.light,
		fontSize: 14,
		color: 'black',
		textAlign: 'center',
		marginBottom: 6,
	}
});