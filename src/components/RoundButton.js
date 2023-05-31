import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from "../theme/Colors"
import Fonts from "../theme/Fonts"
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default class RoundButton extends React.Component {
  render() {
	const { theme, title } = this.props;
	var buttonStyle = styles.mainButton;
	var textStyle = styles.mainText;
	if (theme === "round") {
		buttonStyle = styles.roundButton;
	} else if (theme === "blue") {
		buttonStyle = styles.mainButton;
		textStyle = styles.whiteText;
	} else if (theme === "red") {
		buttonStyle = styles.redButton;
		textStyle = styles.whiteText;
	} else if (theme === "outline") {
		buttonStyle = styles.outlineButton;
		textStyle = styles.whiteText;
	} else if (theme === "white") {
		buttonStyle = styles.whiteButton;
		textStyle = styles.mainText;
	} else if (theme === "orange") {
		buttonStyle = styles.orangeButton;
		textStyle = styles.whiteText;
	} else if (theme === "black") {
		buttonStyle = styles.blackButton;
		textStyle = styles.whiteText;
	} else if (theme === "no-border") {
		buttonStyle = styles.noBorderButton;
		textStyle = styles.whiteText;
	}  else if (theme === "no-border-gray") {
		buttonStyle = styles.noBorderButton;
		textStyle = styles.grayText;
	} else if (theme === "gradient") {
		buttonStyle = styles.noBorderButton;
		textStyle = styles.whiteText;
	}

    return (
		<TouchableOpacity style={[this.props.style, styles.container, buttonStyle]} onPress={() => this.props.onPress()}>
			{
				theme === "gradient"
				? <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[Colors.appColor, Colors.appColor2]} style={styles.buttonContainer}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
				  </LinearGradient>
				: <View style={styles.buttonContainer}>
					<Text style={[styles.buttonText, textStyle]}>{title}</Text>
				</View>
			}
			
	    </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 15,
		overflow: 'hidden',
		...ifIphoneX({
			height: 60,
		}, {
			height: 50,
		}),
	},

	buttonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
	}, 

	roundButton: {
		borderRadius: 25,
		backgroundColor: Colors.appColor
	},	

	outlineButton: {
		borderWidth: 2,
		borderColor: 'white',
	},

	mainButton: {
		backgroundColor: Colors.appColor,
		borderWidth: 2,
		borderColor: Colors.appColor,
	},

	blueButton: {
		backgroundColor: '#0089E7',
		borderWidth: 2,
		borderColor: '#0089E7',
	},

	redButton: {
		backgroundColor: Colors.redColor,
		borderWidth: 2,
		borderColor: Colors.redColor,	
	},

	whiteButton: {
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: 'white',
	},

	orangeButton: {
		backgroundColor: '#F66A2D',
		borderWidth: 2,
		borderColor: '#F66A2D',
	},

	blackButton: {
		backgroundColor: '#000',
		borderWidth: 2,
		borderColor: '#000',
	},

	noBorderButton: {

	},

	buttonText: {
		fontFamily: Fonts.bold,
		fontSize: 16,
		textTransform: 'uppercase',
		letterSpacing: 2,		
	},

	roundText: {
		fontFamily: Fonts.bold,
		color: 'white',
		fontSize: 16,
	},

	outlineText: {
		color: Colors.appColor,
	},

	mainText: {
		color: Colors.appColor,
	},

	whiteText: {
		color: 'white',
	},

	blackText: {
		color: 'black',	
	},

	grayText: {
		color: '#939393',
	},
});