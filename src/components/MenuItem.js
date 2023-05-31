import React from 'react';
import { 
	Text, 
	Image, 
	StyleSheet, 
	View,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default class MenuItem extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
	   	}
  	}

  	render() {
		const { data, theme } = this.props;
    	return (
			<View style={styles.container}>
				{
					(data.theme === 'bottom') 
					?<TouchableOpacity 
						style={{flexDirection: 'row', alignItems: 'center'}} 
						onPress={() => this.props.onSelectItem(data)}>
						<Text style={styles.bottomText}>{data.name}</Text>
					</TouchableOpacity>
					
					: <TouchableOpacity 
						style={{flexDirection: 'row', alignItems: 'center'}} 
						onPress={() => this.props.onSelectItem(data)}>
						{
							data.icon && 
							<Image source={data.icon} style={styles.iconImage} />
						}
						<View style={styles.nameContainer}>
							<Text style={styles.menuText}>{data.name}</Text>
						</View>	    	
					</TouchableOpacity>
				}
				{
					(data.badge && data.badge > 0)
					? <Text style={styles.badgeText}>{data.badge}</Text>
					: null
				}				
			</View>
	    	
    	);
  	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 16,
	},

	iconImage: {
		width: 40,
		height: 40,
	},

	nameContainer: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.borderColor,
		paddingVertical: 22,
		width: '100%',
	},

	menuText: {
		fontFamily: Fonts.regular,
		color: Colors.textColor,
		marginLeft: 10,
		fontSize: 20,		
		marginTop: 3,
	},

	bottomText: {
		fontFamily: Fonts.regular,
		color: Colors.textColor,
		marginLeft: 10,
		fontSize: 20,	
		...ifIphoneX({
			marginTop: 80,	
        }, {
			marginTop: 30,	
        })
	},

	badgeText: {
		fontFamily: Fonts.regular,
		fontSize: 11,
		backgroundColor: '#ef4458',
		color: 'white',
		position: 'absolute',
		right: 7,
		paddingVertical: 4,
		paddingHorizontal: 7,
		borderRadius: 11,
		overflow: 'hidden',
		textAlign: 'center',
	},
});