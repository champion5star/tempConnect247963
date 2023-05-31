import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import {connect} from 'react-redux';
import actionTypes from '../actions/actionTypes';
import { MENU_COUNT_FOR_ADS } from '../constants';

class TopNavBar extends Component {
	constructor() {
		super();
		this.state = {
		  menuClickCount: 0,
		}
	}

	onClickLeftButton() {
		var { menuClickCount } = this.state;
		const { leftButton, onClickLeftButton } = this.props;
		if (leftButton == 'menu') {
			if (menuClickCount >= MENU_COUNT_FOR_ADS) {
				menuClickCount = 0;
				this.loadNearByAds();
			}
			this.setState({menuClickCount: menuClickCount + 1});
		}
		onClickLeftButton();
	}

	loadNearByAds() {
		console.log("load ads");
		const { currentUser } = this.props;
		this.props.dispatch({
			type: actionTypes.GET_ADS,
			data: {
				lat: currentUser.geolocation.coordinates[1],
				lng: currentUser.geolocation.coordinates[0]
			}
		});
	}

  render() {
	const {
		title,
		leftButton,
		rightButton,
		rightValue,
		onClickLeftButton,
		onClickRightButton
	} = this.props;
    return (
	    <View style={styles.container}>
	    	<TouchableOpacity style={styles.backButton} onPress={() => this.onClickLeftButton()}>
				{
					leftButton == 'menu'
					? <Image
							style={styles.menuIcon}
							source={Images.menu_toggle}
						/>
					: <Image
							style={styles.backButtonIcon}
							source={Images.back_arrow}
						/>
				}
			</TouchableOpacity>
			<Text style={styles.titleText}>{title}</Text>
			{
				rightButton == 'edit' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Text style={styles.buttonText}>EDIT</Text>
				</TouchableOpacity>
			}
			{
				rightButton == 'done' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Text style={styles.buttonText}>DONE</Text>
				</TouchableOpacity>
			}
			{
				rightButton == 'add' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Image source={Images.circle_plus_icon} style={styles.plusImage} />
				</TouchableOpacity>
			}
			{
				rightButton == 'chat' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Image source={Images.chat_bubble} style={styles.plusImage} />
				</TouchableOpacity>
			}
			{
				rightButton == 'balance' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Text style={styles.rightText}>{rightValue}</Text>
				</TouchableOpacity>
			}
			{
				rightButton == 'filter' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Image source={Images.btn_filter} style={styles.plusImage} />
				</TouchableOpacity>
			}
			{
				rightButton == 'trash' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Image source={Images.trash} style={styles.trashImage} />
				</TouchableOpacity>
			}
			{
				rightButton == 'more' && <TouchableOpacity style={styles.rightButton} onPress={onClickRightButton}>
					<Image source={Images.icon_more} style={styles.trashImage} />
				</TouchableOpacity>
			}
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
		...ifIphoneX({
            paddingVertical: 20,
        }, {
            paddingVertical: 17,
        })
	},
	titleText: {
		color: 'white',
		fontFamily: Fonts.regular,
		textAlign: 'center',
		...ifIphoneX({
            fontSize: 25,
        }, {
            fontSize: 22,
        })
	},
	backButton: {
		position: 'absolute',
		left: 20,
	},
	backButtonIcon: {
		resizeMode: 'contain',
		...ifIphoneX({
            width: 30,
			height: 30,
        }, {
            width: 20,
			height: 20,
		})
	},
	menuIcon: {
		width: 40,
		height: 40,
		resizeMode: 'contain',
	},
	rightButton: {
		position: 'absolute',
		right: 20,
	},
	buttonText: {
		color: 'white',
		fontFamily: Fonts.bold,
		fontSize: 17,
	},
	rightText: {
		color: 'white',
		fontFamily: Fonts.regular,
		fontSize: 17,
		paddingTop: 4,
		opacity: 0.8,
	},

	plusImage: {
		width: 37,
		height: 37,
		resizeMode: 'contain',
	},

	trashImage: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
	},
});


function mapDispatchToProps(dispatch) {
	return {
		dispatch
	};
}

function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser,
		adsPlaying: state.globals.adsPlaying,
		getAdsStatus: state.globals.getAdsStatus,
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(TopNavBar);
