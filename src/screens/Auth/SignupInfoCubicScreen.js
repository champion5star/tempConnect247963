import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  Keyboard
} from 'react-native';

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {connect} from 'react-redux';
import SendBird from 'sendbird';
import Toast from 'react-native-easy-toast'

import actionTypes from '../../actions/actionTypes';
import * as Storage from '../../services/Storage'
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import RoundTextInput from '../../components/RoundTextInput'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Messages from '../../theme/Messages'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';

var sb;
class SignupInfoCubicScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      infoCubicAccountNumber: null,
      user: null,
    }    
  }

  componentDidMount() {
    sb = SendBird.getInstance();
    if (this.props.route.params && this.props.route.params.user) {
      const { user } = this.props.route.params;

      const infoCubicAccountNumber = (user && user.infoCubicAccountNumber) ? user.infoCubicAccountNumber : "";
      this.setState({user, infoCubicAccountNumber});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Register Customer.
    if (prevProps.registerCustomerStatus != this.props.registerCustomerStatus) {
      if (this.props.registerCustomerStatus == Status.SUCCESS) {
        this.registerCustomerSuccess();
      } else if (this.props.registerCustomerStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }
  }

  async registerCustomerSuccess() {
    this.setState({ isLoading: false });
    Storage.USERID.set(this.props.currentUser._id);
    Storage.SIGNUP_USER.remove();
    this.connectSendBird();
    this.props.navigation.navigate("CustomerDrawer");
  }
  
  connectSendBird() {
    const { currentUser } = this.props;

    if (sb && currentUser._id != "undefined" && currentUser._id?.length > 0) {
      const state = sb.getConnectionState();
      const userId = currentUser._id;

      var username = "";
      if (currentUser.company && currentUser.company.length > 0) {
        username = currentUser.company;
      }
      else {
        username = currentUser.firstName + " " + currentUser.lastName;
      }
      

      if (state === 'CLOSED' && userId) {
        var _SELF = this;
        sb.connect(userId, function (user, error) {
          if (_SELF.props.pushToken && _SELF.props.pushToken.length > 0) {
            if (Platform.OS === 'ios') {
              sb.registerAPNSPushTokenForCurrentUser(_SELF.props.pushToken, function (result, error) {
              });
            } else {
              sb.registerGCMPushTokenForCurrentUser(_SELF.props.pushToken, function (result, error) {
              });
            }
          }
          sb.updateCurrentUserInfo(username, '', function (response, error) {
          });
        });
      }
    }
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

  onSave =()=> {
    Keyboard.dismiss();
    var isValid = true;

    var { 
      infoCubicAccountNumber, 
      user 
    } = this.state;

    if (infoCubicAccountNumber == null || infoCubicAccountNumber.length == 0) {
      this.setState({infoCubicAccountNumberError: Messages.InvalidCubicAccount});
      isValid = false;
    }

    if (isValid) {
        this.setState({isLoading: true}, () => { 
          user.player_id = this.props.playerId;
          user.infoCubicAccountNumber = infoCubicAccountNumber;
          this.props.dispatch({
            type: actionTypes.REGISTER_CUSTOMER,
            user,
          });
      });
    }
  }

  onBack() {
    var { infoCubicAccountNumber, user } = this.state;
    user.infoCubicAccountNumber = infoCubicAccountNumber;
    Storage.SIGNUP_USER.set(user);

    this.props.navigation.goBack();
  }

  onSkip() {
    Keyboard.dismiss();
    var { user } = this.state;
    user.infoCubicAccountNumber = null;
    
    this.setState({isLoading: true}, () => { 
      user.player_id = this.props.playerId;
      this.props.dispatch({
        type: actionTypes.REGISTER_CUSTOMER,
        user: user,
      });
    });
  }

  render() {
    const { 
      infoCubicAccountNumber, 
      infoCubicAccountNumberError,
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar 
              title="Background Checks" 
              leftButton=""
              onClickLeftButton={() => this.onBack()}
            />
            <View style={styles.container}>
              <KeyboardAwareScrollView>
              <View style={styles.contentView}>
                <Image source={Images.cubic_logo} style={styles.logoImage} />
                <Text style={styles.mainDescriptionText}>Please enter your account number to activate your account.</Text>
                <RoundTextInput
                  label="Account Number" 
                  type="text"
                  theme="gray"
                  style={{width: '100%'}}
                  autoCapitalize='none'
                  value={infoCubicAccountNumber} 
                  errorMessage={infoCubicAccountNumberError}
                  returnKeyType="next"                                       
                  onSubmitEditing={() => this.onSave() }
                  onChangeText={(text) => this.setState({infoCubicAccountNumber: text, infoCubicAccountNumberError: null})} 
                />
                <View style={styles.linkView}>
                  <Text style={styles.linkText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => { Linking.openURL('https://infocubic.com/temp-connect') }}>
                      <Text style={styles.linkBoldText}>Register Here</Text>
                  </TouchableOpacity>
                </View>
                <RoundButton 
                  title={"Sign Up"}
                  theme="gradient" 
                  style={styles.saveBtn} 
                  onPress={this.onSave} 
                />
                <TouchableOpacity style={styles.skipBtn} onPress={() => this.onSkip()}>
                    <Text style={styles.skipBtnText}>Skip Now</Text>
                </TouchableOpacity>
              </View>
              </KeyboardAwareScrollView>
            </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)} />
        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  contentView: {
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
  },

  logoImage: {
    width: 300,
    height: 74,
    resizeMode: 'contain',
    marginBottom: 25,
  },

  mainDescriptionText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
    color: 'gray',
  },

  saveBtn: {
    marginTop: 20,
    width: '100%'
  },

  descriptionText: {
    marginTop: 20,
    fontFamily: Fonts.light,
    color: 'black',
    fontSize: 14,
    paddingHorizontal: 20,
  },

  linkView: {
    marginBottom: 50, 
    flexDirection: 'row',
    alignItems: 'center',
  },

  linkText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textColor,
  },

  linkBoldText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textColor,
  },

  skipBtn: {
    marginTop: 10,
  },

  skipBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.85)',
    textDecorationLine: 'underline',
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
    playerId: state.user.playerId,
    pushToken: state.user.pushToken,
    errorMessage: state.user.errorMessage,
    registerCustomerStatus: state.user.registerCustomerStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SignupInfoCubicScreen);