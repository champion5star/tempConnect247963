import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

class EducationCell extends Component {
    render() {
        const {index, data, isView, onDelete} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.nameText}>{data.name}</Text>
                    <Text style={styles.degreeText}>{data.degree} - {data.fieldOfStudy}</Text>
                    <Text style={styles.descriptionText}>{data.description}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.timeText}>Start: {data.from}</Text>
                        <Text style={[styles.timeText, {marginLeft: 30}]}>End: {data.to}</Text>
                    </View>
                    {
                        !isView && <TouchableOpacity style={styles.closeBtn} onPress={() => onDelete(index)}>
                            <Image source={Images.close_icon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                    }                
                </View>
            </View>
        );
    }
}

export default EducationCell;

const styles = StyleSheet.create({
    container: {
        marginRight: 15,
    },

    content: {
        width: 250,        
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#EFEFEF',
        borderWidth: 0.5,
        borderColor: Colors.borderColor,
    },


    nameText: {
        fontFamily: Fonts.bold,
        fontSize: 20,
    },

    degreeText: {
        fontFamily: Fonts.thin,
        fontSize: 14,
        marginTop: 4,
    },

    descriptionText: {
        opacity: 0.5,
        fontFamily: Fonts.regular,
        fontSize: 14,
        marginTop: 12,
        marginBottom: 12,
    },

    timeText: {
        opacity: 0.5,
        fontFamily: Fonts.bold,
    },

    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    closeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    }

});