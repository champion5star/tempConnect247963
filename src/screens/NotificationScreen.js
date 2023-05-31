import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast from 'react-native-easy-toast'

import actionTypes from '../actions/actionTypes';
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import NotificationCell from '../components/NotificationCell'
import LoadingOverlay from '../components/LoadingOverlay'
import EmptyView from '../components/EmptyView'
import BottomSheet from '../components/BottomSheet';
import { 
  TOAST_SHOW_TIME, 
  Status,
  BOTTOM_SHEET_TYPE,
} from '../constants.js'
import Colors from '../theme/Colors'
import Messages from '../theme/Messages'

class NotificationScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      refreshing: false,
      isFirst: true,
      isShowMore: false,
      notifications: [],
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.GET_MY_NOTIFICATIONS,
        user_id: currentUser._id,
      }); 
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Get My Notifications.
    if (prevProps.getMyNotificationsStatus != this.props.getMyNotificationsStatus) {
      if (this.props.getMyNotificationsStatus == Status.SUCCESS) {
        this.getMyNotifications();
      } else if (this.props.getMyNotificationsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    // Mark as read all.
    if (prevProps.markReadAllNotificationsStatus != this.props.markReadAllNotificationsStatus) {
      if (this.props.markReadAllNotificationsStatus == Status.SUCCESS) {
        this.setState({ isLoading: false });
      } 
      else if (this.props.markReadAllNotificationsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    // Remove all
    if (prevProps.removeAllNotificationsStatus != this.props.removeAllNotificationsStatus) {
      if (this.props.removeAllNotificationsStatus == Status.SUCCESS) {
        this.setState({ isLoading: false });
      } 
      else if (this.props.removeAllNotificationsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    if (prevProps.notifications != this.props.notifications) {
      this.setState({notifications: this.props.notifications}); 
    }    
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectNotification(n) {
    var new_list = [];
    var notifications = this.state.notifications;
    for (var i = 0; i < notifications.length; i++) {
      var item = notifications[i];
      if (item._id == n._id) {
        item.isRead = true;
      }

      new_list.push(item);
    }

    this.setState({notifications: new_list});

    // Mark Read Notification.
    this.props.dispatch({
      type: actionTypes.MARK_READ_NOTIFICATION,
      notification_id: n._id,
    });
    
    var job = n.job;
    this.props.navigation.navigate('DetailProject', {project: job});
  }

  getMyNotifications() {
    const { notifications } = this.props;
    this.setState({isLoading: false, refreshing: false, isFirst: false, notifications}); 
  }

  onFailure(message) {
    this.setState({isLoading: false, refreshing: false, isFirst: false});
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }    
  }

  onRefresh=()=>{
    this.setState({refreshing:true});
    const { currentUser } = this.props;
    this.props.dispatch({
      type: actionTypes.GET_MY_NOTIFICATIONS,
      user_id: currentUser._id,
    });
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  render() {
    const { notifications, isFirst, isLoading, refreshing, isShowMore } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="Notifications" 
                leftButton="menu" 
                onClickLeftButton={() => this.onMenu()}
                rightButton={(notifications && notifications.length > 0) ? "more": null}
                onClickRightButton={this.onMore}
              />
              <View style={styles.container}>
                <View style={styles.contentView}>
                  {
                    (notifications && notifications.length > 0) 
                    ? <FlatList
                        style={styles.listView}
                        data={notifications}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, i}) => (
                          <NotificationCell 
                            data={item} 
                            key={i} 
                            onSelectNotification={(data) => this.onSelectNotification(data)} />
                        )}
                        onRefresh={this.onRefresh}
                        refreshing={refreshing}
                      />
                    : !isFirst && <EmptyView title="No notifications." />
                  }
                </View>
              </View>
          </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <BottomSheet
          isVisible={isShowMore}
          type={BOTTOM_SHEET_TYPE.NOTIFICATION}
          onSelect={this.onSelectAction}
          onClose={() => this.setState({ isShowMore: false })}
        />
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </View>
    );
  }

  onMore =()=> {
    this.setState({ isShowMore: true });
  }

  onSelectAction =(index)=> {
    this.setState({ isShowMore: false });
    const { currentUser } = this.props;

    // Mark as read all.
    if (index == 0) {
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.MARK_READ_ALL_NOTIFICATIONS,
          data: {
            user_id: currentUser._id,
          },
        }); 
      });
    }

    // Remove all.
    else if (index == 1) {
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.REMOVE_ALL_NOTIFICATIONS,
          data: {
            user_id: currentUser._id,
          },
        }); 
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor
  },

  contentView: {
    flex: 1,
  },

  listView: {
    flex: 1,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    notifications: state.notifications.notifications,
    errorMessage: state.notifications.errorMessage,

    getMyNotificationsStatus: state.notifications.getMyNotificationsStatus,
    markReadAllNotificationsStatus: state.notifications.markReadAllNotificationsStatus,
    removeAllNotificationsStatus: state.notifications.removeAllNotificationsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(NotificationScreen);