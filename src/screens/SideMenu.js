import React from 'react';
import { 
	Text, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  View,
	FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import MenuItem from '../components/MenuItem'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'
import Images from '../theme/Images'
import Fonts from '../theme/Fonts'
import { 
  Status,
  USER_TYPE,
  USER_LEVEL,
} from '../constants.js'

class SideMenu extends React.Component {
	constructor(props) {
    	super(props)

    	this.state = {
	      data: [],
   	}
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.unreadNumber != this.props.unreadNumber) {
      var { data } = this.state;
      var list = [];
      data.forEach(item => {
        if (item.name == "Notifications") {
          item.badge = this.props.unreadNumber;
        }
        list.push(item);
      });
      this.setState({data: list});
    }

    if (prevProps.unreadMessages != this.props.unreadMessages) {
      var { data } = this.state;
      var list = [];
      data.forEach(item => {
        if (item.name == "Messages") {
          item.badge = this.props.unreadMessages;
        }
        list.push(item);
      });
      this.setState({data: list});
    }

    // Check Subscription.
    if (prevProps.changeSubscriptionStatus != this.props.changeSubscriptionStatus) {
      if (this.props.changeSubscriptionStatus == Status.SUCCESS) {
        this.setMenuItems();
      } 
    }
  }

  componentDidMount() {
    this.setMenuItems();
  }

  setMenuItems() {
    const { currentUser } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;
    const socialType = (currentUser && currentUser.socialType) ? currentUser.socialType : null;
    const country = (currentUser && currentUser.country) ? currentUser.country : "";
    const type = (currentUser && currentUser.type) ? currentUser.type : USER_TYPE.CUSTOMER;
    var menuItems = [];

    // Employeer
    if (type === USER_TYPE.CUSTOMER) {
      menuItems = [
        {
          name: 'Home',
          page: 'CustomerMyProject',
          icon: Images.side_home_icon,
        },
        {
          name: 'Search Employees',
          page: 'SearchEmployee',
          icon: Images.side_search_icon,
        },
        {
          name: 'Messages',
          page: 'MessageList',
          icon: Images.side_message_icon,
          badge: this.props.unreadMessages,
        },
        {
          name: 'Notifications',
          page: 'Notification',
          icon: Images.side_notification_icon,
          badge: this.props.unreadNumber,
        },
        {
          name: 'Background Checks',
          page: 'InfoCubic',
          icon: Images.side_info_icon,
        },
        {
          name: 'Payment',
          page: 'TransactionHistory',
          icon: Images.side_earning_icon,
        },
      ];

      if (level === USER_LEVEL.FREE) {
        menuItems.push({
          name: 'Subscription',
          page: 'Subscription',
          icon: Images.side_subscription_icon,
        });
      }
    } 

    // Employee.
    else {
      menuItems = [
        {
          name: 'Home',
          page: 'ProviderHome',
          icon: Images.side_home_icon,
        },
        {
          name: 'My Jobs',
          page: 'ProviderMyJob',
          icon: Images.side_projects_icon,
        },
        {
          name: 'Search Employers',
          page: 'SearchEmployer',
          icon: Images.side_search_icon,
        },
        {
          name: 'Messages',
          page: 'MessageList',
          icon: Images.side_message_icon,
          badge: this.props.unreadMessages,
        },
        {
          name: 'Notifications',
          page: 'Notification',
          icon: Images.side_notification_icon,
          badge: this.props.unreadNumber,
        },
        {
          name: 'Earnings',
          page: 'ProviderEarnings',
          icon: Images.side_earning_icon,
        }
      ];
    }

    if (!(socialType && socialType.length > 0)) {
      menuItems.push({
        name: 'Change Password',
        page: 'ChangePassword',
        icon: Images.side_settings_icon,
      });     
    }

    menuItems.push({
      name: 'FAQs',
      page: 'FAQ',
      icon: Images.side_faq_icon,
    });    

    if (country && country === 'US') {
      menuItems.push({
        name: 'Benefits',
        page: 'Benefits',
        icon: Images.side_benefits_icon,
      });    
    }

    menuItems.push({
      name: 'Terms of Use',
      page: 'Terms',
      icon: Images.side_tos,
    });

    menuItems.push({
      name: 'Privacy Policy',
      page: 'Privacy',
      icon: Images.side_privacy,
    });

    menuItems.push({
      name: 'Sign Out',
      page: 'logout',
      theme: 'bottom'
    });

    this.setState({data: menuItems});
  }

  onSelectItem(item) {
    this.props.navigation.toggleDrawer();

    if (item.page == "logout") {
      this.logout();
    } else {
      this.props.navigation.navigate(item.page);
    }    
  }

  onMoveProfile(type) {
    this.props.navigation.toggleDrawer();
    if (type === "customer") {
      this.props.navigation.navigate('CustomerEditProfile');
    } else {
      this.props.navigation.navigate('ProviderEditProfile');
    }    
  }

  logout() {
    Storage.USERID.remove();
    Storage.CURRENT_USER.remove();
    this.props.navigation.popToTop();

    // Reset Reducer.
    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_USER,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_NOTIFICATION,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_JOB,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_GLOBAL,
      });   
    }, 1000);
  }

  render() {
    const {currentUser} = this.props;
    const avatar = currentUser.avatar ? {uri: currentUser.avatar} : Images.account_icon;
    var name = "";
    if (currentUser.company && currentUser.company.length > 0) {
      name = currentUser.company;
    }
    else {
      name = currentUser.firstName + " " + currentUser.lastName;
    }
    const type = currentUser.type;

    return (
      <View style={{flex: 1}}>
        <Image style={styles.backgroundImage} source={Images.main_bg}/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <View style={styles.container}>
                <View style={styles.profileBox}>
                  <TouchableOpacity style={styles.avatar} onPress={() => this.onMoveProfile(type)}>
                    <Image source={avatar} style={styles.avatarImage}/>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.nameText}>{name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={styles.statusDot}/>
                      <Text style={styles.statusText}>Active</Text>
                    </View>                
                  </View>
                </View>
                <FlatList
                  data={this.state.data}
                  style={{height: '100%', backgroundColor: 'white'}}
                  keyExtractor={item => item.name}
                  ListFooterComponent={() => (<View style={{height: 50}}/>)}
                  renderItem={({ item }) => (
                    <MenuItem
                      data={item}
                      theme={item.name == 'Logout' ? 'red' : ''}
                      onSelectItem={(item) => this.onSelectItem(item)}
                    />
                  )}
              />
              </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
  },
  
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },

  profileBox: {
    paddingTop: 24,
    paddingBottom: 20,    
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 100,
    overflow: 'hidden',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f1f1f1',
    overflow: 'hidden',
    marginRight: 15,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  nameText: {
    fontFamily: Fonts.bold,
    fontSize: 21,
    color: 'white',
  },

  statusText: {
    marginTop: 3,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  statusDot: {
    backgroundColor: '#20ab2c',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
    marginTop: 3,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    unreadNumber: state.notifications.unreadNumber,
    unreadMessages: state.user.unreadMessages,

    changeSubscriptionStatus: state.user.changeSubscriptionStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SideMenu);