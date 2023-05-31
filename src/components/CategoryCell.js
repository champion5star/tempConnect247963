import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../theme/Images';

class CategoryCell extends Component {
    render() {
        return (
            <View style={[this.props.style]}>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onChoose(this.props.data)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.labelText}>{this.props.data.name}</Text>
                    </View>

                    { 
                        this.props.isSelected
                        ? <Image
                           style={styles.arrowIcon}
                           source={Images.tick}
                          />   
                        : null
                    }
                    
                </TouchableOpacity>
            </View>
        );
    }
}

export default CategoryCell;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 20,
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',        
    },

    labelText: {
        fontFamily: 'OpenSans',
        color: 'black',
        fontSize: 18,
        marginLeft: 14,
    },

    redText: {
        fontFamily: 'OpenSans',
        color: 'red',
        fontSize: 18
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
        width: 20,
        height: 20,
        resizeMode: 'contain',
    }
});