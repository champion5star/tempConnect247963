import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getDurationUnit } from '../../functions'
import Rate from '../Rate'
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

export default class ProposalCell extends Component {
    render() {
        const {data, onDeclineApply, onHire} = this.props;
        return (
            <View style={styles.container}>
                { this._renderHeader() }
                <Text style={styles.coverText}>{data.coverText}</Text>          
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => onDeclineApply(data)}>
                        <Text style={[styles.btnText, styles.redText]}>Decline</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorLine}/>
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => onHire(data)}>
                        <Text style={[styles.btnText, styles.greenText]}>Hire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderHeader() {
        const { data, project, onDetailProvider } = this.props;
        const reviewScore = (data && data.creator && data.creator.reviewScore) ? data.creator.reviewScore : 0;
        const avatar = data.creator.avatar ? {uri: data.creator.avatar} : Images.account_icon;
        var name = '';
        if (data && data.creator) {
            if (data.creator.company && data.creator.company.length > 0) {
                name = (data && data.creator && data.creator.company) ? data.creator.company : "";
            }
            else {
                const firstName = (data && data.creator && data.creator.firstName) ? data.creator.firstName : "";
                const lastName = (data && data.creator && data.creator.lastName) ? data.creator.lastName : "";
                name = firstName + " " + lastName;
            }
        }

        const durationUnit = getDurationUnit(data.duration, project.payType);

        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onDetailProvider(data.creator)} style={{flexDirection: 'row', alignItems: 'center', width: '50%'}}>
                    <Image source={avatar} style={styles.avatarPhoto} />
                    <View>
                        <Text style={styles.nameText}>{name}</Text>
                        <Rate rate={reviewScore} />
                    </View>
                </TouchableOpacity>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text style={styles.priceText}>${data.price}</Text>
                        <Text style={styles.payTypeText}> / {project.payType}</Text>
                    </View>
                    
                    <Text style={styles.durationText}>{data.duration} {durationUnit}</Text>
                </View>
            </View>   
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 1,
    },

    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },

    avatarPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: Colors.borderColor,
    },

    nameText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        marginBottom: 4,
    },

    locationText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        marginTop: 3,
        color: Colors.textColor,
    },

    coverText: {
        fontFamily: Fonts.regular,
        color: 'gray',
        padding: 10,
        minHeight: 70,
    },

    priceText: {
        fontFamily: Fonts.regular,
        color: Colors.appColor,
        fontSize: 18,
    },

    payTypeText: {
        fontFamily: Fonts.regular,
        color: Colors.grayTextColor,
        fontSize: 13,
        marginBottom: 2,
    },

    durationText: {
       fontFamily: Fonts.light,
       textAlign: 'right', 
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 0,
    },
    
    bottomBtn: {
        width: '50%',
    },

    btnText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 12,
    },

    separatorLine: {
        width: 1,
        height: 30,
        backgroundColor: Colors.borderColor,
    },

    greenText: {
        color: Colors.appColor,
    },

    redText: {
        color: Colors.redColor,
    }
});