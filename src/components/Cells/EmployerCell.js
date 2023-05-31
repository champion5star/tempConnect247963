import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import FastImage from 'react-native-fast-image'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import { calcDistance } from '../../functions';

const sWidth = Dimensions.get('window').width;

export default class EmployerCell extends React.Component {

	onSelect=()=> {
		const { data, onSelect } = this.props;
		if (onSelect) {
			onSelect(data);
		}
	}

  	render() {
		const { data, lat, lng } = this.props;
		const avatar = (data && data.avatar && data.avatar.length > 0) ? {uri: data.avatar} : Images.account_icon;
		
		var name = "";
		if (data && data.company && data.company.length > 0) {
			name = (data && data.company) ? data.company : "";
		}
		else {
			const firstName = (data && data.firstName) ? data.firstName : "";
			const lastName = (data && data.lastName) ? data.lastName : "";
			name = firstName + " " + lastName;
		}

        const lat1 = (data && data.geolocation) ? data.geolocation.coordinates[1] : 0;
        const lng1 = (data && data.geolocation) ? data.geolocation.coordinates[0] : 0;

        const distance = calcDistance(lat, lng, lat1, lng1, "N");

    	return (
			<TouchableOpacity style={styles.container} onPress={this.onSelect}>
				<FastImage source={avatar} style={styles.avatarImage} />
				<View>
					<Text style={styles.nameText}>{name}</Text>
                    <View style={styles.locationRow}>
                        <Image source={Images.icon_location} style={styles.locationIcon}/>
                        <Text style={styles.locationText}>{distance} miles</Text>
                    </View>
				</View>
			</TouchableOpacity>	    
    	);
  	}
}

const styles = StyleSheet.create({
	container: { 
        marginHorizontal: 20,
        paddingBottom: 20,
		flexDirection: 'row',
	},

	avatarImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
		resizeMode: 'cover',
		backgroundColor: Colors.borderColor,
		marginRight: 15,
	},

	nameText: {
		fontFamily: Fonts.regular,
		fontSize: 16,
		width: sWidth - 110,
		color: Colors.textColor,
		marginTop: 3,
		marginBottom: 4,
	},

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },

    locationIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 3,
    },

	locationText: {
		fontFamily: Fonts.light,
		fontSize: 13,
		color: Colors.textColor,
	},
});