import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

export default class SmallRate extends React.Component {
	render() {
        const { rate } = this.props;
		return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        style={styles.starImage}
                        source={rate >= 1 ? Images.small_star_selected : Images.small_star}
                    />
                    <Image
                        style={styles.starImage}
                        source={rate >= 2 ? Images.small_star_selected : Images.small_star}
                    />
                    <Image
                        style={styles.starImage}
                        source={rate >= 3 ? Images.small_star_selected : Images.small_star}
                    />
                    <Image
                        style={styles.starImage}
                        source={rate >= 4 ? Images.small_star_selected : Images.small_star}
                    />
                    <Image
                        style={styles.starImage}
                        source={rate >= 5 ? Images.small_star_selected : Images.small_star}
                    />
                </View>
                <Text style={styles.rateText}>{rate}/5</Text>
            </View>
	    );
  	}
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starImage: {
        width: 15,
        height: 15,
        marginRight: 3,
    },

    rateText: {
        fontSize: 16,
        marginLeft: 4,
        fontFamily: Fonts.regular,
        color: '#9b99a9',
        marginTop: 4,
    },
    
});