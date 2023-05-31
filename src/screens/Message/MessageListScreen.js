import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import SendBird from 'sendbird';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import Colors from '../../theme/Colors'
import ChannelCell from '../../components/Cells/ChannelCell'
import EmptyView from '../../components/EmptyView'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';

var sb = null;

class MessageListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      channelList: [],
    }
  }

  componentDidMount() {
    sb = SendBird.getInstance();
    if (sb && sb.currentUser) {
      this.setState({isLoading: true});
      this.initChannelHandler();
      this.getChannelList();
    }

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getChannelList();
    });   
  }

  componentWillUnmount() {
    this.focusListener();
    sb.removeChannelHandler('ChannelHandler');
  }

  initChannelHandler() {
    console.log("initChannelHandler");
    var _SELF = this;
    var ChannelHandler = new sb.ChannelHandler();
    ChannelHandler.onReconnectSucceeded = function() {
      _SELF.getChannelList();
    };

    ChannelHandler.onReadReceiptUpdated = function(groupChannel) { 
      _SELF.updateChannelList(groupChannel);
    };

    ChannelHandler.onMessageReceived = function(groupChannel) { 
      _SELF.updateChannelList(groupChannel);
    };

    sb.addChannelHandler('ChannelHandler', ChannelHandler);
  }

  updateChannelList(channel) {
    const list = [];
    const { channelList } = this.state;    
    this.setState({channelList: list}, function() {
      var totalUnreadCount = 0;
      var isExisting = false;
      for (var i = 0; i < channelList.length; i++) {
        if (channelList[i].name === channel.name) {
          list.push(channel);
          totalUnreadCount += channel.unreadMessageCount;
          isExisting = true;
        } else {
          list.push(channelList[i]);
          totalUnreadCount += channelList[i].unreadMessageCount;
        }        
      }

      if (!isExisting) {
        list.push(channel);
      };

      this.setState({channelList: list});
      this.props.dispatch({
        type: actionTypes.SET_UNREAD_MESSAGE,
        number: totalUnreadCount
      });
    });
  }

  onUpdateLastMessage=(channel)=> {
    this.updateChannelList(channel);
  }
  
  _onChannelPress=(channel, member)=> {
    this.props.navigation.navigate('Chat', {
      channel: channel, 
      room: member.nickname, 
      onUpdateLastMessage: this.onUpdateLastMessage
    });
    channel.markAsRead();
    channel.unreadMessageCount = 0;
    this.updateChannelList(channel);
  }

  async getChannelList() {
    var _SELF = this;
    var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.includeEmpty = true;
    listQuery.next(function(response, error) {
      _SELF.setState({isLoading: false});
      if (response) {
        var channelList = [];
        for (var i = 0; i < response.length; i++) {
          var channel = response[i];
          if (channel.members.length >= 2 && channel.lastMessage) {
            channelList.push(channel);
          }          
        }

        _SELF.setState({ isFirst: false });        
        _SELF.setState({ 
          channelList: channelList, 
        });  
      } else {
        if (error) {
          console.log('Get Private List Fail.', error);
          return;
        }  
      }
    });
  }

  getUnreadMessageCount(channels) {
    var unreadCount = 0;
    for (var i = 0; i < channels.length; i++) {
      var channel = channels[i];
      unreadCount += channel.unreadMessageCount;
    }

    return unreadCount;
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  render() {
    var currentUser = null;
    if (sb) {
      currentUser = sb.currentUser;
    }
    const { channelList, isLoading } = this.state;

    return (
      <View style={{flex: 1}} forceInset={{ bottom: 'never'}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="Messages" leftButton="menu" onClickLeftButton={() => this.onMenu()}/>
              <View style={{flex: 1, backgroundColor: Colors.pageColor}}>
              {
                (channelList && channelList.length) 
                ? <FlatList
                    style={styles.listView}
                    data={channelList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                      <ChannelCell 
                        currentUser={currentUser}
                        channel={item} 
                        onPress={this._onChannelPress}
                      />
                    )}
                  />
                : <EmptyView title="No messages." />
              }
              </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        { isLoading && <LoadingOverlay/>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  listView: {
    backgroundColor: 'white',
  }
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    pushToken: state.user.pushToken,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageListScreen);