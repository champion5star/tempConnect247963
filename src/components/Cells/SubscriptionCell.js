import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, Dimensions } from 'react-native';
import { SUBSCRIPTION_MONTHLY, SUBSCRIPTION_YEARLY } from '../../constants'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'

const win = Dimensions.get('window');

export default class SubscriptionCell extends React.Component {
  	render() {
        const { data, index, selectedIndex, onSelect } = this.props;
        const productId = data.productId;
        var title = "Monthly";
        var subTitle = "";
        // const price = data.localizedPrice;
        var price = "$0.99";
        if (productId == SUBSCRIPTION_YEARLY) {
            title = "Yearly";
            subTitle = "(Break down to $0.5/mo)";
            price = "$5.99";
        }
    	return (
            <TouchableOpacity onPress={() => onSelect(index)}>
                <View style={[styles.container, selectedIndex == index ? {borderColor: Colors.appColor, borderWidth: 3} : {}]}>
                    <Text style={styles.titleText}>
                        {title}
                    </Text>
                    <Text style={styles.priceText}>{price}</Text>
                    {
                        (subTitle && subTitle.length > 0) 
                        ? <Text style={styles.subTitleText}>{subTitle}</Text>
                        : null
                    }
                </View>
            </TouchableOpacity>
        );
  }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        alignItems: 'center',
    },

    titleText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        textTransform: 'uppercase',
    },

    recommendedText: {
        fontFamily: Fonts.regular,
        fontSize: 10,
        backgroundColor: Colors.appColor2,
        color: 'white',
        marginLeft: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
        textTransform: 'uppercase',
    },

    subTitleText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: 'gray',
    },

    priceText: {
        fontFamily: Fonts.bold,
        fontSize: 40,
        marginVertical: 5,
        color: Colors.textColor,
    },
});