import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'

const screenWidth = Dimensions.get('window').width;
class NotificationCell extends Component {

    getName(firstName, lastName, company) {
        var name = "";
        if (company && company.length > 0) {
            name = company + " ";
        }
        else {
            name = firstName + " ";
            if (lastName && lastName.length > 0) {
                name += lastName.charAt(0) + " ";
            }
        }
        return name;
    }

    render() {
        const { data, onSelectNotification } = this.props;
        const avatar = (data && data.creator && data.creator.avatar && data.creator.avatar.length > 0) ? {uri: data.creator.avatar} : Images.account_icon;
        const firstName = (data && data.creator && data.creator.firstName) ? data.creator.firstName : "";
        const lastName = (data && data.creator && data.creator.lastName) ? data.creator.lastName : "";
        const company = (data && data.creator && data.creator.company) ? data.creator.company : "";
        const message = (data && data.message) ? data.message : "";
        const time = (data && data.createdAt) ? Moment(this.props.data.createdAt).fromNow(true) : "";
        const isRead = (data && data.isRead) ? data.isRead : false;
        
        return (
            <TouchableOpacity 
                style={[this.props.style, styles.container]} 
                onPress={() => onSelectNotification(data)}
            >
                <View style={styles.contentView}>
                    <FastImage
                      style={styles.image}
                      source={avatar}
                    />
                    <View style={{ flex: 1}}>
                        <Text style={styles.titleText}>
                            {this.getName(firstName, lastName, company)}
                            <Text style={styles.reviewText}>{message}</Text>
                        </Text>
                        <Text style={styles.timeText}>{time} ago</Text>
                    </View>
                </View>
                {
                    !isRead
                    ? <View style={styles.unReadContainer}>
                        <View style={styles.unReadView} />
                      </View>
                    : null
                }                
            </TouchableOpacity>
        );
    }
}

export default NotificationCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },

    contentView: {
        width: screenWidth - 50,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,        
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'gray',
        marginRight: 10,
    },

    titleText: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        fontWeight: 'bold',
        justifyContent: 'center',
    },

    reviewText: {
       fontFamily: 'OpenSans',
       fontSize: 16,
       fontWeight: 'normal',
    },

    timeText: {
        fontFamily: 'OpenSans',
        marginTop: 3,
        fontSize: 14,
        color: Colors.subTextColor,
    },

    unReadContainer: {
        flex: 1,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    unReadView: {
        backgroundColor: Colors.appColor,
        width: 10,
        height: 10,
        borderRadius: 5,
    }
});