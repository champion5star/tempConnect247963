import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';

import Colors from '../../theme/Colors';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';
import { trimEllip } from '../../functions';

export default class ChannelCell extends React.PureComponent {
  getTargetMember(currentUser, channel) {
    var targetMember = null;
    channel.members.forEach(member => {
      if (member.userId !== currentUser.userId) {
        targetMember = member;
        return;
      }
    });
    return targetMember;
  }

  render() {
    const { channel } = this.props;
    const member = this.getTargetMember(this.props.currentUser, channel);
    var lastMessage = '';
    var time = '';
    if (channel.lastMessage) {
      lastMessage = trimEllip(channel.lastMessage.message, 80);
      if (channel.lastMessage.data === 'image') {
        lastMessage = "[image]";
      }
      time = Moment(channel.lastMessage.createdAt).fromNow(true) + " ago";
    }

    
    var avatar = Images.account_icon;
    if (member && member.profileUrl && member.profileUrl.indexOf("https://static.sendbird.com/sample/user_sdk") < 0) {
      avatar = {uri: member.profileUrl}; 
    }

    return (
      <TouchableOpacity onPress={() => this.props.onPress(channel, member)} style={styles.listItem}>
          <View style={{flexDirection: 'row', width: '50%'}}>
            <FastImage source={avatar} style={styles.avatar}/>
            <View>
              <Text style={channel.unreadMessageCount > 0 ? styles.boldTitleLabel : styles.titleLabel}>{member ? member.nickname : ''}</Text>
              <Text style={styles.subText}>{lastMessage}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.timeText}>{time}</Text>
            { 
              channel.unreadMessageCount > 0
                ? <View style={styles.unreadBadge} />
                : null 
            }
          </View>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#D8D8D8',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  boldTitleLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.appColor,
    marginTop: 3,
  },

  titleLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textColor,
    marginTop: 3,
  },

  unreadBadge: {
    backgroundColor: Colors.appColor,
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  subText: {
    fontFamily: Fonts.light,
    fontSize: 14,
    color: Colors.textColor,
    marginTop: 3,
    maxHeight: 36,
  },

  timeText: {
    fontFamily: Fonts.light,
    fontSize: 12,
    color: Colors.textColor,
    marginRight: 7,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, 
    marginRight: 10,
    backgroundColor: 'gray',
  }

});
