import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Keyboard,
  Platform
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import SendBird from 'sendbird';
import SplashScreen from 'react-native-splash-screen'
import OneSignal from 'react-native-onesignal';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk-next";
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Geolocation from '@react-native-community/geolocation';
import RoundTextInput from '../../components/RoundTextInput'
import RoundButton from '../../components/RoundButton'
import Button from '../../components/Button'
import LoadingOverlay from '../../components/LoadingOverlay'
import BackgroundImage from '../../components/BackgroundImage'
import OrText from '../../components/OrText'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Styles from '../../theme/Styles'
import {
  TOAST_SHOW_TIME,
  ONE_SIGNAL_APP_ID,
  GOOGLE_SIGNIN_WEB_CLIENT_ID,
  GOOGLE_SIGNIN_IOS_CLIENT_ID,
  SENDBIRD_APP_ID,
  Status
} from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import * as Storage from '../../services/Storage'
import { isValidEmail, checkInternetConnectivity } from '../../functions'
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';

var sb = new SendBird({ appId: SENDBIRD_APP_ID });

class LoginScreen extends Component {
  notification_type = -1;
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      remember: false,
      isLoading: false,
      errorMessage: null,
    }
  }

  async componentDidMount() {
    this.loadGlobalData();
    this.initLocationService();
    this.initPush();

    GoogleSignin.configure({
      scopes: [],
      webClientId: GOOGLE_SIGNIN_WEB_CLIENT_ID,
      offlineAccess: true,
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '',
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: GOOGLE_SIGNIN_IOS_CLIENT_ID,
    });

    this.restoreUser();
  }

  async restoreUser() {
    // Update User ID.
    const user_id = await Storage.USERID.get();
    if (user_id && user_id.length > 0) {
      this.props.dispatch({
        type: actionTypes.RESTORE_USER,
        user_id: user_id
      });
    } else {
     SplashScreen.hide();
    }
  }

  componentWillUnmount() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loginUserStatus != this.props.loginUserStatus) {
      if (this.props.loginUserStatus == Status.SUCCESS) {
        this.loginSuccess();
      } else if (this.props.loginUserStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }
    }

    if (prevProps.loginWithSocialStatus != this.props.loginWithSocialStatus) {
      if (this.props.loginWithSocialStatus == Status.SUCCESS) {
        this.loginWithSocialSuccess();
      } else if (this.props.loginWithSocialStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }
    }

    if (prevProps.getJobStatus != this.props.getJobStatus) {
      if (this.props.getJobStatus == Status.SUCCESS) {
        this.getJobSuccess();
      } else if (this.props.getJobStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }
    }

    if (prevProps.restoreUserStatus != this.props.restoreUserStatus) {
      if (this.props.restoreUserStatus == Status.SUCCESS && this.props.currentUser && this.props.currentUser._id) {
        this.onMoveHome(false);
      } else if (this.props.restoreUserStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
        SplashScreen.hide();
      }
    }
  }

  loadGlobalData() {
    this.props.dispatch({
      type: actionTypes.GET_GLOBAL_DATA,
    });

    var years = [];
    const nowYear = new Date().getFullYear();
    for (var i = nowYear; i >= 1950; i--) {
      years.push(i);
    }
    this.props.dispatch({
      type: actionTypes.SET_YEARS,
      years: years,
    });
  }


  initPush() {
    OneSignal.setAppId(ONE_SIGNAL_APP_ID);

    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("Prompt response:", response);
    });

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened = (openResult) => {
    console.log('openResult: ', openResult);

    if (openResult.notification.payload.additionalData) {
      const notification_type = openResult.notification.payload.additionalData.notification_type;
      const notification_id = openResult.notification.payload.additionalData.notification_id;
      const job_id = openResult.notification.payload.additionalData.job_id;
      const receiver_type = openResult.notification.payload.additionalData.receiver_type;

      if (this.props.currentUser && this.props.currentUser.type == receiver_type) {
        this.notification_type = notification_type;

        // Mark Read for selected notification.
        this.props.dispatch({
          type: actionTypes.MARK_READ_NOTIFICATION,
          notification_id: notification_id,
        });

        // Get Job.
        this.props.dispatch({
          type: actionTypes.GET_JOB,
          job_id: job_id,
        });
      }
    }
  }

  onMoveNotificationPage(notification_type, job) {
    this.props.navigation.navigate('DetailProject', {project: job});
    // if (notification_type == NOTIFICATION_TYPE.SENT_OFFER ||
    //   notification_type == NOTIFICATION_TYPE.CANCEL_OFFER ||
    //   notification_type == NOTIFICATION_TYPE.COMPLETE_JOB ||
    //   notification_type == NOTIFICATION_TYPE.CANCEL_JOB ||
    //   notification_type == NOTIFICATION_TYPE.PAY_JOB ||
    //   notification_type == NOTIFICATION_TYPE.GIVE_REVIEW) {
    //   this.props.navigation.navigate('RequestDetail', {request: job});
    // } else if (notification_type == NOTIFICATION_TYPE.ACCEPT_OFFER ||
    //   notification_type == NOTIFICATION_TYPE.DECLINE_OFFER) {
    //   this.props.navigation.navigate('CustomerRequestDetail', {request: job});
    // }
  }

  onIds = (device) => {
    if (device) {
      console.log("device: ", device);
      const userId = device.userId;
      const pushToken = device.pushToken;

      this.props.dispatch({
        type: actionTypes.SET_PLAYER_ID,
        payload: {
          userId,
          pushToken
        }
      });
    }
  }

  initLocationService() {
    var that =this;

    //Checking for the permission just after component loaded
    if(Platform.OS === 'ios'){
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'Temp Connect needs to Access your location'
              }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.callLocation(that);
          } else {
            // alert("Permission Denied");
          }
        } catch (err) {
          console.warn(err)
        }
      }
      requestLocationPermission();
    }
  }

  callLocation(that){
    Geolocation.getCurrentPosition(
        (position) => {
          this.updateGeolocation(position.coords.latitude, position.coords.longitude);
        },
        (error) =>
            console.log(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    that.watchID = Geolocation.watchPosition((position) => {
          this.updateGeolocation(position.coords.latitude, position.coords.longitude);
        }
    );
  }

  updateGeolocation(lat, lng) {
    this.props.dispatch({
      type: actionTypes.SET_GEO_LOCATION,
      lat: lat,
      lng: lng
    });
  }

  connectSendBird() {
    const currentUser = this.props.currentUser;
    if (sb && currentUser._id != "undefined" && currentUser._id?.length > 0) {
      const userId = currentUser._id;
      var username = "";
      if (currentUser.company && currentUser.company.length > 0) {
        username = currentUser.company;
      }
      else {
        username = currentUser.firstName + " " + currentUser.lastName;
      }
      

      if (userId) {
        var _SELF = this;
        sb.connect(userId, function (user, error) {
          if (_SELF.props.pushToken && _SELF.props.pushToken.length > 0) {
            if (Platform.OS === 'ios') {
              sb.registerAPNSPushTokenForCurrentUser(_SELF.props.pushToken, function(result, error) {
              });
            } else {
              sb.registerGCMPushTokenForCurrentUser(_SELF.props.pushToken, function(result, error) {
              });
            }
          }

          var profileUrl = '';
          if (currentUser.avatar && currentUser.avatar.length > 0) {
            profileUrl = currentUser.avatar;
          }
          sb.updateCurrentUserInfo(username, profileUrl, function(response, error) {
          });

          sb.getTotalUnreadMessageCount(function(number, error) {
            _SELF.props.dispatch({
              type: actionTypes.SET_UNREAD_MESSAGE,
              number: number
            });
          });

          var UserEventHandler = new sb.UserEventHandler();
          UserEventHandler.onTotalUnreadMessageCountUpdated = function(totalCount, countByCustomTypes) {
            _SELF.props.dispatch({
              type: actionTypes.SET_UNREAD_MESSAGE,
              number: totalCount
            });
          };
          sb.addUserEventHandler("USER_EVENT_HANDLER", UserEventHandler);
        });
      }
    }
  }

  async onMoveHome(animate) {
    const { currentUser } = this.props;

    // Reset Page.
    this.setState({isLoading: false, email: '', password: ''});
    this.connectSendBird();

    // Move Next Page.
    var nextScreen = ""
    if (this.props.currentUser.type == "customer") {
      nextScreen = "CustomerDrawer";
    } else {
      nextScreen = "ProviderDrawer";
    }

    this.props.navigation.navigate(nextScreen);

    this.getUnreadMessageCount();

    // Get Unread Messages and Notification Count.
    this.getUnreadNotificationCount();

    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }

  getUnreadNotificationCount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.props.dispatch({
        type: actionTypes.GET_UNREADNUMBER,
        user_id: currentUser._id
      });
    }
  }

  getUnreadMessageCount() {
    if (sb && sb.currentUser) {
      var _SELF = this;
      var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      listQuery.includeEmpty = true;
      listQuery.next(function(response, error) {
        _SELF.setState({isLoading: false, isFirst: false});
        if (response) {
          var unReadCount = 0;
          for (var i = 0; i < response.length; i++) {
            var channel = response[i];
            if (channel.members.length >= 2) {
              unReadCount += channel.unreadMessageCount;
            }
          }

          _SELF.props.dispatch({
            type: actionTypes.SET_UNREAD_MESSAGE,
            number: unReadCount
          });
        }
      });
    }
  }

  onLogin() {
    Keyboard.dismiss();
    this.setState({errorMessage: null});

    let email = this.state.email;
    let password = this.state.password;

    var isValid = true;
    if (email == null || email.length <= 0 || !isValidEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (password == null || password.length <= 0) {
      this.setState({passwordError: Messages.InvalidPassword});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.LOGIN_USER,
          email: email,
          password: password,
          player_id: this.props.playerId,
        });
      });
    }
  }

  onForgotPassword=()=> {
    Keyboard.dismiss();
    this.props.navigation.navigate('ForgotPassword');
  }

  async onApple() {
    const _SELF = this;
    Keyboard.dismiss();

    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      var appleUsers = await Storage.APPLE_USERS.get();
      // performs login
      if (appleAuth.isSupported) {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });

          // get current authentication state for user
          const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

          // use credentialState response to ensure the user is authenticated
          if (credentialState === appleAuth.State.AUTHORIZED) {
            var socialId = '';
            var socialType = 'apple';
            var firstName = '';
            var lastName = '';
            var email = '';
            var avatar = '';

            if (appleAuthRequestResponse.user) {
              socialId = appleAuthRequestResponse.user;
            }

            if (appleAuthRequestResponse.fullName) {
              firstName = appleAuthRequestResponse.fullName.givenName;
              lastName = appleAuthRequestResponse.fullName.familyName;
            }

            if (appleAuthRequestResponse.email) {
              email = appleAuthRequestResponse.email;
            }

            var user = {
              socialId,
              socialType,
              firstName,
              lastName,
              email,
              avatar,
            };
            if (appleUsers && appleUsers.length > 0) {
              var isExisting = false;
              appleUsers.forEach(item => {
                if (item.socialId == user.socialId) {
                  user = item;
                  isExisting = true;
                  return;
                }
              });

              if (!isExisting) {
                appleUsers.push(user);
              }
            } else {
              appleUsers = [user];
            }

            Storage.APPLE_USERS.set(appleUsers);
            _SELF.props.dispatch({
              type: actionTypes.LOGIN_WITH_SOCIAL,
              user: user,
              player_id: _SELF.props.playerId,
            });
          }
        } catch (error) {
          console.log("error: ", error);
          _SELF.toast.show('Apple sign in has been cancelled.', TOAST_SHOW_TIME);
        }
      } else {
        _SELF.toast.show('AppleAuth is not supported on the device.', TOAST_SHOW_TIME);
      }
    } else {
      _SELF.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async onGoogle() {
    const _SELF = this;
    Keyboard.dismiss();

    // Check internet connection.
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({isLoading: true, errorMessage: null});
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        const user = userInfo.user;
        var socialId = '';
        var socialType = 'google';
        var firstName = "";
        var lastName = "";
        var email = "";
        var avatar = "";

        if (user.id) {
          socialId = user.id;
        }

        if (user.photo) {
          avatar = user.photo;
        }

        if (user.givenName) {
          firstName = user.givenName;
        }

        if (user.familyName) {
          lastName = user.familyName;
        }

        if (user.email) {
          email = user.email;
        }

        let new_user = {
          socialId,
          socialType,
          firstName,
          lastName,
          email,
          avatar,
        };

        _SELF.props.dispatch({
          type: actionTypes.LOGIN_WITH_SOCIAL,
          user: new_user,
          player_id: _SELF.props.playerId,
        });

      } catch (error) {
        _SELF.setState({isLoading: false});
        _SELF.toast.show("Google Login has been cancelled.", TOAST_SHOW_TIME);
        console.log("error = ", error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }
    } else {
      _SELF.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async onFB() {
    Keyboard.dismiss();
    const _SELF = this;

    // Check internet connection.
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({isLoading: true, errorMessage: null});
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        function(result) {
          if (result.isCancelled) {
            _SELF.setState({isLoading: false});
            _SELF.toast.show('Facebook Login has been cancelled', TOAST_SHOW_TIME);
          } else {
            AccessToken.getCurrentAccessToken().then((token) => {
              let accessToken = token.accessToken;
              const responseCallback = (error, result) => {
                if (error) {
                  _SELF.setState({isLoading: false});
                  _SELF.toast.show(error, TOAST_SHOW_TIME);
                } else {
                  var socialId = '';
                  var socialType = 'facebook';
                  var firstName = '';
                  var lastName = '';
                  var email = '';
                  var avatar = '';

                  if (result.id) {
                    socialId = result.id;
                  }

                  if (result.first_name) {
                    firstName = result.first_name;
                  }

                  if (result.last_name) {
                    lastName = result.last_name;
                  }

                  if (result.email) {
                    email = result.email;
                  }

                  if (result.picture && result.picture.data && result.picture.data.url) {
                    avatar = result.picture.data.url;
                  }

                  let user = {
                    socialId,
                    socialType,
                    firstName,
                    lastName,
                    email,
                    avatar,
                  };

                  _SELF.props.dispatch({
                    type: actionTypes.LOGIN_WITH_SOCIAL,
                    user: user,
                    player_id: _SELF.props.playerId,
                  });
                }
              }
              const profileRequest = new GraphRequest(
                '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
                null,
                responseCallback,
              );
              new GraphRequestManager().addRequest(profileRequest).start();
            });
          }
        },
        function(error) {
          console.log("Login fail with error: " + error);
          _SELF.setState({isLoading: false});
          _SELF.toast.show('Facebook Login has been failed.', TOAST_SHOW_TIME);
        }
      );
    } else {
      _SELF.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onRegister() {
    Keyboard.dismiss();

    this.loadGlobalData();
    this.props.navigation.navigate('SelectUserType');
  }

  getJobSuccess() {
    if (this.props.selectedJob && this.props.selectedJob._id) {
      this.onMoveNotificationPage(this.notification_type, this.props.selectedJob);
    }
  }

  async loginSuccess() {
    this.setState({isLoading: false});

    this.loadGlobalData();

    const { currentUser, token } = this.props;
    Storage.USERID.set(currentUser._id);
    Storage.TOKEN.set(token);
    this.onMoveHome(true);
  }

  async loginWithSocialSuccess() {
    this.setState({isLoading: false});
    this.loadGlobalData();
    
    if (this.props.needToSignUp) {
      this.props.navigation.navigate('SelectUserType', {user: this.props.currentUser});
    } 
    else {
      const { currentUser, token } = this.props;
      Storage.USERID.set(currentUser._id);
      Storage.TOKEN.set(token);
      this.onMoveHome(true);
    }
  }

  onFailure(message) {
    this.setState({isLoading: false, errorMessage: message});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaView style={{flex: 1}}>
          <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Image
              style={styles.logoImage}
              source={Images.logo}
            />

            {/* Login Form */}
            <View style={styles.formView}>
              <RoundTextInput
                placeholder="Email"
                type="email"
                value={this.state.email}
                errorMessage={this.state.emailError}
                returnKeyType="next"
                onSubmitEditing={() => { this.passwordInput.focus() }}
                onChangeText={(text) => this.setState({email: text, emailError: null})}
              />

              <RoundTextInput
                placeholder="Password"
                type="password"
                value={this.state.password}
                errorMessage={this.state.passwordError}
                returnKeyType="done"
                isShowForgot={true}
                onRefInput={(input) => { this.passwordInput = input }}
                onSubmitEditing={() => {
                  this.onLogin();
                }}
                onChangeText={(text) => this.setState({password: text, passwordError: null})}
                onForgot={this.onForgotPassword}
              />

              <View style={styles.centerView}>
                <RoundButton
                  title="Sign in"
                  theme="white"
                  onPress={() => this.onLogin()} />
                { this.state.errorMessage && <Text style={Styles.errorText}>{this.state.errorMessage}</Text> }
              </View>
              <OrText />
              <View style={styles.socialView}>
                <TouchableOpacity style={styles.socialButton} onPress={() => this.onFB()}>
                  <Image
                    style={styles.socialIcon}
                    source={Images.btn_facebook}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={() => this.onGoogle()}>
                  <Image
                    style={styles.socialIcon}
                    source={Images.btn_google_plus}
                  />
                </TouchableOpacity>
              </View>
              {
                Platform.OS === 'ios' &&
                <View style={{alignItems: 'center', marginVertical: 15}}>
                  <AppleButton
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                      width: '100%',
                      height: 45,
                    }}
                    onPress={() => this.onApple()}
                  />
                </View>
              }
              <Button
                title="CREATE ACCOUNT"
                type={"bold"}
                style={styles.createAccountButton}
                onPress={() => this.onRegister()}
              />
            </View>
          </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        <Toast ref={ref => (this.toast = ref)} />
        { this.state.isLoading && <LoadingOverlay /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  logoImage: {
    resizeMode: 'contain',
    ...ifIphoneX({
      marginTop: 70,
      width: 170,
      height: 140,
    }, {
      marginTop: 20,
      width: 150,
      height: 130,
    })
  },

  formView: {
    width: '85%',
    ...ifIphoneX({
      marginTop: 100,
    }, {
      marginTop: Platform.OS === 'ios' ? 30 : 50,
    })
  },

  centerView: {
    marginTop: Platform.OS === 'ios' ? 5 : 25,
    justifyContent: 'center',
  },

  socialView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  socialIcon: {
    resizeMode: 'contain',
    ...ifIphoneX({
      width: 155,
      height: 53,
    }, {
      width: 150,
      height: 45,
    })
  },

  createAccountButton: {
    marginBottom: 30,
    ...ifIphoneX({
      marginTop: 30,
    }, {
      marginTop: Platform.OS === 'ios' ? 15 : 45,
    })
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
    token: state.user.token,
    needToSignUp: state.user.needToSignUp,
    errorUserMessage: state.user.errorMessage,
    errorJobMessage: state.jobs.errorMessage,
    playerId: state.user.playerId,
    pushToken: state.user.pushToken,
    selectedJob: state.jobs.selectedJob,
    loginUserStatus: state.user.loginUserStatus,
    loginWithSocialStatus: state.user.loginWithSocialStatus,
    markReadNotificationStatus: state.notifications.markReadNotificationStatus,
    getJobStatus: state.jobs.getJobStatus,
    restoreUserStatus: state.user.restoreUserStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);
