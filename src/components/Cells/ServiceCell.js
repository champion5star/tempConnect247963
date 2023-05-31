import React from 'react';
import {
  View, StyleSheet, Text, TouchableWithoutFeedback, Image,
} from 'react-native';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

export default class ServiceCell extends React.PureComponent {
    getServiceById(id) {
        var service = null;
        this.props.list.forEach(item => {
            if (item._id === id) {
                service = item;
                return;
            }
        });

        return service;
    }

    render() {
        const service = this.getServiceById(this.props.service.service);
        const price = this.props.service.price;

        return (
            <TouchableWithoutFeedback 
                onPress={() => this.props.onChoice({
                    _id: this.props.service._id,
                    service: service,
                    price: this.props.service.price,
                    note: this.props.service.note,
                    others: this.props.service.others,
                })}
            >
                <View style={styles.container}>
                    <Text style={styles.nameText}>{service.name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.priceText}>$ {price}</Text>
                        <Image
                            style={styles.arrowIcon}
                            source={Images.arrow_right}
                        />  
                    </View>                
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },

    nameText: {
        fontFamily: Fonts.regular,
        fontSize: 18,
    },

    priceText: {
        fontFamily: Fonts.regular,
        fontSize: 18,
        marginRight: 10,
    },

    arrowIcon: {
        width: 10,
        height: 20,
        resizeMode: 'contain',
    }
});
