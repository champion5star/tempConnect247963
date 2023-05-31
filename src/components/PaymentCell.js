import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

class PaymentCell extends Component {
    render() {
        return (
            <View style={[this.props.style]}>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onPress()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        {
                            this.props.method == "paypal"
                            ? <Image
                               style={styles.paypalIcon}
                               source={Images.paypal}
                              />   
                            : null
                        }

                        {
                            this.props.method == "bank"
                            ? <Image
                               style={styles.bankIcon}
                               source={Images.small_bank_icon}
                              />   
                            : null
                        }

                        {
                            this.props.method == "card"
                            ? <Image
                               style={styles.bankIcon}
                               source={Images.credit_card}
                              />   
                            : null
                        }
                        
                        <Text style={styles.labelText}>{this.props.label}</Text>
                    </View>
                    <Image
                       style={styles.arrowIcon}
                       source={Images.arrow_right}
                    />   
                </TouchableOpacity>
            </View>
        );
    }
}

export default PaymentCell;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 22,
        paddingBottom: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    labelText: {
        fontFamily: Fonts.regular,
        color: 'black',
        fontSize: 20,
        marginLeft: 14,
    },

    redText: {
        fontFamily: Fonts.regular,
        color: 'red',
        fontSize: 20
    },

    paypalIcon: {
        width: 30,
        height: 35,
        resizeMode: 'contain',
    },

    bankIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    arrowIcon: {
        width: 10,
        height: 20,
        resizeMode: 'contain',
    }
});