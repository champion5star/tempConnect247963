import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import FastImage from 'react-native-fast-image'

export default class HeaderInfoBar extends React.Component {
  render() {
    return (
	    <View style={styles.container}>
	    	<Text style={styles.titleText}>{this.props.title}</Text>
	    	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
	    		{
	    			this.props.isSearch 
	    			? <TouchableOpacity style={styles.notificationButton} onPress={() => this.props.onSearch()}>
		    			<Image
				          style={styles.notificationImage}
				          source={Images.search_icon}
					    />
		    		  </TouchableOpacity>
	    			: null
	    		}

	    		<TouchableOpacity style={styles.notificationButton} onPress={() => this.props.onNotification()}>
	    			<Image
			          style={styles.notificationImage}
			          source={Images.notification_icon}
				    />
				    {
				    	this.props.unReadCount
				    	? <View style={styles.badgeView}>
						  	<Text style={styles.badgeText}>{this.props.unReadCount}</Text>
						  </View>				    
				    	: null				    	
				    }				    
	    		</TouchableOpacity>

	    		<TouchableOpacity style={styles.avatar} onPress={() => this.props.onProfile()}>
	    			<FastImage
			          style={styles.image}
			          source={this.props.user && this.props.user.avatar ? {uri: this.props.user.avatar} : Images.account_icon}
				    />
	    		</TouchableOpacity>
	    	</View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Colors.navColor,
	},

	titleText: {
		textAlign: 'left',
		fontFamily: 'OpenSans',
		fontSize: 26,
		fontWeight: 'bold',
		color: 'white',
	},

	badgeView: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: '#f12105',
		justifyContent: 'center',
		alignItems: 'center',		
		position: 'absolute',
		right: -5,
		top: -3,
	},

	badgeText: {
		fontSize: 10,
		fontWeight: 'bold',
		fontFamily: 'OpenSans',
		textAlign: 'center',
		color: 'white',
	},

	notificationButton: {
		width: 24,
		height: 24,
		marginLeft: 15,
	},

	notificationImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},

	avatar: {
		marginLeft: 15,
		width: 30,
		height: 30,
		borderRadius: 15,
		overflow: 'hidden',
	},

	image: {
		width: 30,
		height: 30,
		borderRadius: 15,
		resizeMode: 'cover',
	},
});