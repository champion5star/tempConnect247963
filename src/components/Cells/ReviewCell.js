import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import Rate from '../Rate'
import Colors from '../../theme/Colors'
import Moment from 'moment';
import Images from '../../theme/Images';
import { DATE_TIME_FORMAT } from '../../constants'

const screenWidth = Dimensions.get('window').width;

class ReviewCell extends Component {
    render() {
        const { data } = this.props;
        const avatar = (data.creator && data.creator.avatar) ? {uri: data.creator.avatar} : Images.account_icon;
        var name = "";
        if (data.creator && data.creator.company && data.creator.company.length > 0) {
            name = (data.creator && data.creator.name) ? data.creator.name : "";
        }
        else {
            const firstName = (data.creator && data.creator.firstName) ? data.creator.firstName : "";
            const lastName = (data.creator && data.creator.lastName) ? data.creator.lastName : "";
            name = firstName + " " + lastName;
        }
        const score = (data && data.score) ? data.score : 0;
        const text = (data && data.text) ? data.text : "";
        const time = Moment(data.createdAt).format(DATE_TIME_FORMAT);

        return (
            <View style={[this.props.style, styles.container]}>
                <Image
                  style={styles.image}
                  source={avatar}
                />

                <View style={styles.contentView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.titleText}>{name}</Text>
                        <Rate rate={score} />                            
                    </View>
                    <Text style={styles.reviewText}>{text}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                </View>
            </View>
        );
    }
}

export default ReviewCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        padding: 10,
    },

    image: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 15,
    },

    contentView: {
        width: screenWidth - 70
    },

    titleText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        marginRight: 7,
        fontWeight: 'bold',
    },

    reviewText: {
       fontFamily: 'OpenSans',
       marginTop: 2,
       fontSize: 12,
    },

    timeText: {
        fontFamily: 'OpenSans',
        marginTop: 5,
        fontSize: 12,
        color: Colors.subTextColor,
    }

});