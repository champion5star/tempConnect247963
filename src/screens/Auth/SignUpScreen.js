import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import SendBird from 'sendbird';

import TopNavBar from '../../components/TopNavBar'
import BackgroundImage from '../../components/BackgroundImage'
import CustomerPage from '../../components/SignUp/CustomerPage'
import Onboard from '../../components/Onboard';
import LoadingOverlay from '../../components/LoadingOverlay'
import { 
  TOAST_SHOW_TIME, 
  Status, 
  PASSWORD_MIN_LENGTH,
  USER_TYPE,
  ACCOUNT_TYPE,
} from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import * as Storage from '../../services/Storage'
import { isValidEmail } from '../../functions'
import Messages from '../../theme/Messages'

var sb;
class SignUpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowOnboard: true,
      agreeTerms: false,
      isLoading: false,
      isEmailEdiable: true,
      accountType: ACCOUNT_TYPE.PERSONAL,
      user: {
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        location: '',
        locationText: '',
        password: '',
        confirmPassword: '',
        infoCubicAccount: '',
        infoCubicUsername: '',
        infoCubicPassword: '',

        firstNameError: '',
        lastNameError: '',
        companyError: '',
        emailError: '',
        phoneError: '',
        passwordError: '',
        confirmPasswordError: '',
      }
    }
  }

  async componentDidMount() {
    sb = SendBird.getInstance();

    var existingUser = this.state.user;
    if (this.props.route.params && this.props.route.params.type) {
      const { type } = this.props.route.params;
      existingUser.type = type;
    }

    if (this.props.route.params && this.props.route.params.user) {
      const { user } = this.props.route.params;
      if (user) {
        if (user.socialId) {
          existingUser.socialId = user.socialId;
        }
  
        if (user.socialType) {
          existingUser.socialType = user.socialType;
        }
  
        if (user.company) {
          existingUser.company = user.company;
        }

        if (user.firstName) {
          existingUser.firstName = user.firstName;
        }
  
        if (user.lastName) {
          existingUser.lastName = user.lastName;
        }
  
        if (user.email) {
          existingUser.email = user.email;
        }
  
        if (user.avatar) {
          existingUser.avatar = user.avatar;
        }
  
        if (user.phone) {
          existingUser.phone = user.phone;
        }
  
        if (user.location) {
          existingUser.location = user.location;
          existingUser.locationText = user.location;
        }
  
        if (user.password) {
          existingUser.password = user.password;
        }
  
        if (user.confirmPassword) {
          existingUser.confirmPassword = user.confirmPassword;
        }

        if (user.socialId && user.socialId.length > 0 && user.email && user.email.length > 0) {
          this.setState({ isEmailEdiable: false });      
        }
      }
    }
    this.setState({ user: existingUser });
  }

  componentDidUpdate(prevProps, prevState) {
    // Check Email.
    if (prevProps.checkEmailStatus != this.props.checkEmailStatus) {
      if (this.props.checkEmailStatus == Status.SUCCESS) {
        const address = this.state.user.location;
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          data: {
            address,
            page: 'SignUp',
          }
        });
      } 
      else if (this.props.checkEmailStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        this.moveNextPage();
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }
    }

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
    const { currentUser, token } = this.props;
    this.setState({ isLoading: false });
    Storage.USERID.set(currentUser._id);
    Storage.TOKEN.set(token);
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

  onBack() {
    if (this.props.route.params && this.props.route.params.saveUserInput) {
      const { saveUserInput } = this.props.route.params;
      saveUserInput(this.state.user);
    }
    this.props.navigation.goBack();
  }

  onTerms() {
    Keyboard.dismiss();
    this.props.navigation.navigate('Terms');
  }

  onChangeUser(key, value) {
    var user = this.state.user;
    if (key == "firstName") {
      user.firstName = value;
      user.firstNameError = "";
    } 
    else if (key == "lastName") {
      user.lastName = value;
      user.lastNameError = "";
    } 
    else if (key == "company") {
      user.company = value;
      user.companyError = "";
    } 
    else if (key == "email") {
      user.email = value;
      user.emailError = "";
    } 
    else if (key == "phone") {
      user.phone = value;
      user.phoneError = "";
    } 
    else if (key == "locationText") {
      user.locationText = value;
      user.locationError = "";
    } 
    else if (key == "location") {
      user.location = value;
      user.locationText = value;
      user.locationError = "";
    } 
    else if (key == "password") {
      user.password = value;
      user.passwordError = "";
    } 
    else if (key == "confirmPassword") {
      user.confirmPassword = value;
      user.confirmPasswordError = "";
    }
    this.setState({ user: user });
  }

  onRegister() {
    Keyboard.dismiss();

    var isValid = true;
    const { user, accountType, agreeTerms } = this.state;
    
    if (accountType == ACCOUNT_TYPE.PERSONAL) {
      if (user.firstName == null || user.firstName.length == 0) {
        user.firstNameError = Messages.InvalidFirstname;
        isValid = false;
      }
  
      if (user.lastName == null || user.lastName.length == 0) {
        user.lastNameError = Messages.InvalidLastname;
        isValid = false;
      }
    }
    else {
      if (user.company == null || user.company.length == 0) {
        user.companyError = Messages.InvalidCompany;
        isValid = false;
      }
    }

    if (user.email == null || user.email.length == 0 || !isValidEmail(user.email)) {
      user.emailError = Messages.InvalidEmail;
      isValid = false;
    }

    if (user.phone == null || user.phone.length == 0) {
      user.phoneError = Messages.InvalidPhone;
      isValid = false;
    }

    if (user.location == null || user.location.length == 0) {
      user.locationError = Messages.InvalidLocation;
      isValid = false;
    }

    if (user.socialId == null) {
      if (user.password == null || user.password.length == 0) {
        user.passwordError = Messages.InvalidPassword;
        isValid = false;
      }
      else if (user.password.length < PASSWORD_MIN_LENGTH) {
        user.passwordError = Messages.ShortPasswordError;
        isValid = false;
      }

      if (user.confirmPassword == null || user.confirmPassword.length == 0) {
        user.confirmPasswordError = Messages.InvalidConfirmPassword;
        isValid = false;
      } else if (user.confirmPassword != user.password) {
        user.confirmPasswordError = Messages.InvalidPasswordNotMatch;
        isValid = false;
      }
    }

    if (!agreeTerms) {
      this.toast.show(Messages.InvalidTerms, TOAST_SHOW_TIME);
      isValid = false;
    }

    if (isValid) {
      this.setState({ isLoading: true }, () => {
        this.props.dispatch({
          type: actionTypes.CHECK_EMAIL,
          email: user.email,
        });
      });
    } else {
      this.setState({ user });
    }
  }

  moveNextPage() {
    Keyboard.dismiss();
    
    const { lat, lng, street_number, route, city, state, county, country, zipcode, page } = this.props.geoData;
    if (page == "SignUp") {
      this.setState({ isLoading: false });
      var { user } = this.state;
      user.lat = lat;
      user.lng = lng;
      user.street_number = street_number;
      user.route = route;
      user.city = city;
      user.state = state;
      user.county = county;
      user.country = country;
      user.zipcode = zipcode;
  
      Storage.SIGNUP_USER.set(user);
      
      if (user.type == USER_TYPE.CUSTOMER) {
        // this.props.navigation.navigate(
        //   "SignupInfoCubic", {user}
        // );
        user.infoCubicAccountNumber = null;
        user.player_id = this.props.playerId;

        this.setState({isLoading: true}, () => { 
          this.props.dispatch({
            type: actionTypes.REGISTER_CUSTOMER,
            user,
          });
        });

      }
      else {
        this.props.navigation.navigate(
          "CategorySelect",
          {
            user,
            page: "SignUp",
          }
        );
      }
    }
  }

  onFailure(message) {
    this.setState({ isLoading: false });
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onSkipOnboard = async () => {
    const { user } = this.state;
    this.setState({ isShowOnboard: false });

    if (user.type === USER_TYPE.CUSTOMER) {
      Storage.IS_CUSTOMER_TUTORIAL.set();
    } else {
      Storage.IS_PROVIDER_TUTORIAL.set();
    }
  }

  onLink = (url) => {
    Linking.openURL(url);
  }

  render() {
    const { isLoading, isShowOnboard, agreeTerms, user, accountType, isEmailEdiable } = this.state;
    const type = user && user.type ? user.type : USER_TYPE.CUSTOMER;

    return (
      <View style={{ flex: 1 }}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets =>
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="Sign Up" theme="empty" onClickLeftButton={() => this.onBack()} />
              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <CustomerPage
                    user={user}
                    type={type}
                    isEmailEdiable={isEmailEdiable}
                    accountType={accountType}
                    agreeTerms={agreeTerms}
                    onChangeAgree={(select) => this.setState({ agreeTerms: select })}
                    onChangeUser={(key, value) => this.onChangeUser(key, value)}
                    onChangeAccountType={(accountType) => this.setState({accountType})}
                    onTerms={() => this.onTerms()}
                    onRegister={() => this.onRegister()}
                  />
                </View>
              </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)} />
        { isLoading && <LoadingOverlay />}
        { isShowOnboard && <Onboard type={type} onSkip={this.onSkipOnboard} onLink={this.onLink} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
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
    token: state.user.token,
    errorMessage: state.user.errorMessage,
    playerId: state.user.playerId,
    checkEmailStatus: state.user.checkEmailStatus,

    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
    registerCustomerStatus: state.user.registerCustomerStatus,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);