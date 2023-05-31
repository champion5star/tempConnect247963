import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'
import Rate from '../Rate';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'

const sWidth = Dimensions.get('window').width;

export default class EmployeeCell extends React.Component {

	onSelect=()=> {
		const { data, onSelect } = this.props;
		if (onSelect) {
			onSelect(data);
		}
	}

  	render() {
		const { data } = this.props;
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

		const reviewScore = (data && data.reviewScore) ? data.reviewScore : "";

    	return (
			<TouchableOpacity style={styles.container} onPress={this.onSelect}>
				<FastImage source={avatar} style={styles.avatarImage} />
				<View>
					<Text style={styles.nameText}>{name}</Text>
					<Rate rate={reviewScore}/>
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

	locationText: {
		fontFamily: Fonts.light,
		fontSize: 13,
		width: sWidth - 110,
		marginTop: 3,
		color: Colors.textColor,
	},
});