import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast from 'react-native-easy-toast'

import actionTypes from '../../actions/actionTypes';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import FeedbackProject from '../../components/Cells/FeedbackProject'
import EmptyView from '../../components/EmptyView';
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import LoadingOverlay from '../../components/LoadingOverlay'
import { kFormatter } from '../../functions';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';
import Messages from '../../theme/Messages';

class DetailCustomerScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      projects: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.user) {
      const { user } = this.props.route.params;
      this.setState({user});

      // Load Job.
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.GET_USER,
          user_id: user._id,
          is_update: false,
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getUserStatus != this.props.getUserStatus) {
      if (this.props.getUserStatus == Status.SUCCESS) {
        this.setState({isLoading: false, user: this.props.user});
      } 
      else if (this.props.getUserStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onFailure(message) {
    this.setState({isLoading: false});
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onMoveChat=()=> {
    const { user } = this.state;
    this.props.navigation.navigate('Chat', {user_id: user._id});
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
          {(insets) =>
            <View style={{ paddingTop: insets.top, flex: 1 }}>
              <TopNavBar
                title="Profile"
                rightButton="chat"
                onClickLeftButton={() => this.onBack()}
                onClickRightButton={this.onMoveChat}
              />
              <View style={styles.container}>
                { this._renderOverview() } 
                { this._renderHistory() }
              </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </View>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Overview /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
    _renderOverview=()=> {
      const { user } = this.state;
      const avatar = (user && user.avatar) ? {uri: user.avatar} : Images.account_icon;
      var name = "";
      if (user) {
        if (user.company && user.company.length > 0) {
          name = user.company;
        }
        else {
          name = user.firstName + " " + user.lastName;
        }
      }

      const totalEarned = (user && user.totalEarned) ? user.totalEarned : 0;
      const totalProjects = (user && user.projects) ? user.projects.length : 0;

      return (
        <View>
          {
            user &&
            <View style={styles.aboutContainer}>
              <Image style={styles.avatarPhoto} source={avatar} />
              <Text style={styles.nameText}>{name}</Text>

              <View style={styles.section}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                  <View style={{width: '50%'}}>
                  <Text style={styles.contentText}>${kFormatter(totalEarned)}</Text>
                    <Text style={styles.contentLabelText}>Total paid</Text>
                  </View>
                  <View style={styles.separatorLine} />
                  <View style={{width: '50%'}}>
                    <Text style={styles.contentText}>{totalProjects}</Text>
                    <Text style={styles.contentLabelText}>Projects</Text>
                  </View>
                </View>
              </View>
            </View>
          }
      </View>

    )
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// History //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderHistory=()=> {
    const { user } = this.state;
    var projects = (user && user.projects) ? user.projects : [];
    projects.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    return (
      <ScrollView>
        <View style={{paddingHorizontal: 15}}>
          {
            projects.map((item, index) => {
              return (
                <FeedbackProject 
                  project={item} 
                  key={index.toString()}
                />
              )
            })
          }
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor
  },

  aboutContainer: {
    alignItems: 'center'
  },

  section: {
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1,
  },

  avatarPhoto:{
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.grayTextColor,
    marginTop: 15,
  },

  nameText: {
    fontFamily: Fonts.bold,
    color: Colors.textColor,
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
  },

  separatorLine: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderColor,
    marginBottom: 15,
  },

  contentLabelText: {
    textAlign: 'center',
    fontFamily: Fonts.light,
    color: Colors.textColor,
    fontSize: 14,
    marginTop: 5,
  },

  contentText: {
    textAlign: 'center',
    fontFamily: Fonts.bold,
    color: 'black',
    fontSize: 20,
    letterSpacing: 0.5,
  },

  historyPage: {
    paddingVertical: 5,
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
    user: state.user.user,
    errorMessage: state.user.errorMessage,
    getUserStatus: state.user.getUserStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(DetailCustomerScreen);
