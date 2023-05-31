import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Platform,
  Keyboard,
  PermissionsAndroid,
} from 'react-native';

import { connect } from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import Toast from 'react-native-easy-toast'

import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import RoundTextInput from '../../components/RoundTextInput'
import EditAvatar from '../../components/Provider/EditAvatar'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import Messages from '../../theme/Messages'
import { TOAST_SHOW_TIME, Status, ACCOUNT_TYPE } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import { isValidEmail } from '../../functions'

class CustomerEditProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountType: ACCOUNT_TYPE.PERSONAL,
      id: '',
      avatar: '',
      avatarFile: '',
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      locationText: '',
      lat: 0,
      lng: 0,
      socialType: null,

      companyError: '',
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      locationError: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser && currentUser._id) {
      var accountType = ACCOUNT_TYPE.PERSONAL;
      if (currentUser.company && currentUser.company.length > 0) {
        accountType = ACCOUNT_TYPE.COMPANY;
      }

      this.setState({
        accountType,
        id: currentUser._id,
        avatar: currentUser.avatar,
        company: currentUser.company,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location,
        locationText: currentUser.location,
        socialType: currentUser.socialType,
        lat: (currentUser.geolocation && currentUser.geolocation.coordinates) ? currentUser.geolocation.coordinates[1] : 0,
        lng: (currentUser.geolocation && currentUser.geolocation.coordinates) ? currentUser.geolocation.coordinates[0] : 0,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Update Profile.
    if (prevProps.updateCustomerStatus != this.props.updateCustomerStatus) {
      if (this.props.updateCustomerStatus == Status.SUCCESS) {
        this.setState({ isLoading: false });
        this.completedProfileUpdate();
      } else if (this.props.updateCustomerStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        this.updateProfile(this.props.geoData);  
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }
    }
  }

  completedProfileUpdate() {
    Alert.alert(
      '',
      'Profile has been updated successfully!',
      [
        {
          text: 'OK', onPress: () => {

          }
        },
      ],
      { cancelable: false },
    );
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

  onBack() {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  }

  onMakeChanges() {
    Keyboard.dismiss();
    var isValid = true;

    const { accountType, company, firstName, lastName, email, phone, location } = this.state;

    if (accountType == ACCOUNT_TYPE.COMPANY) {
      if (company == null || company.length == 0) {
        this.setState({ companyError: Messages.InvalidCompany });
        isValid = false;
      }
    }
    else {
      if (firstName == null || firstName.length == 0) {
        this.setState({ firstNameError: Messages.InvalidFirstname });
        isValid = false;
      }
  
      if (lastName == null || lastName.length == 0) {
        this.setState({ lastNameError: Messages.InvalidLastname });
        isValid = false;
      }
    }

    if (email == null || email.length == 0 || !isValidEmail(email)) {
      this.setState({ emailError: Messages.InvalidEmail });
      isValid = false;
    }

    if (phone == null || phone.length == 0) {
      this.setState({ phoneError: Messages.InvalidPhone });
      isValid = false;
    }

    if (location == null || location.length == 0) {
      this.setState({ locationError: Messages.InvalidLocation });
      isValid = false;
    }


    if (isValid) {
      this.setState({ isLoading: true }, () => {
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          data: {
            address: location,
            page: 'CustomerEditProfile',
          }
        });
      });
    }
  }

  updateProfile(geoData) {
    const { street_number, route, city, state, county, country, zipcode, lat, lng, page } = geoData;
    if (page == "CustomerEditProfile") {
      const { 
        id, 
        company,
        firstName, 
        lastName, 
        email, 
        phone, 
        location, 
        avatarFile, 
      } = this.state;

      const user = {
        id,
        company,
        firstName,
        lastName,
        email,
        phone,
        location,
        avatarFile,
        street_number,
        route,
        city,
        state,
        county,
        country,
        zipcode,
        lat,
        lng
      };
  
      this.props.dispatch({
        type: actionTypes.UPDATE_CUSTOMER,
        user,
      });
    }
  }

  onTakePicture() {
    this.ActionSheet.show();
  }

  async onSelectMedia(index) {
    try {
      if (Platform.OS == "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "App Camera Permission",
                message:"App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.openImagePicker(index);
          }
          else {
            console.log("Camera permission denied");
          }
      }
      else {
        this.openImagePicker(index);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openImagePicker(index) {
    const options = {
      mediaType: 'photo',
    };

    if (index == 0) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          this.addPhoto(response);
        }
      });
    }
    else if (index == 1) {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          this.addPhoto(response);
        }
      });
    }
  }

  async addPhoto(response) {
    if (response && response.assets && response.assets.length > 0) {
      this.setState({
        avatar: response.assets[0].uri,
        avatarFile: response.assets[0]
      });
    }
  }

  render() {
    const { 
      isLoading,
      accountType,
      avatar,
      company,
      firstName,
      lastName,
      email,
      phone,
      location,
      locationText,
      socialType,

      companyError,
      firstNameError,
      lastNameError,
      emailError,
      phoneError,
      locationError,

    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
            {insets => 
              <View style={{flex: 1, paddingTop: insets.top }} >
                <TopNavBar title="EDIT PROFILE" onClickLeftButton={() => this.onBack()} />
                <View style={styles.container}>
                  <KeyboardAwareScrollView>
                    <View>
                      <View style={styles.profileBox}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                          <EditAvatar
                            avatar={avatar}
                            onTakePhoto={() => this.onTakePicture()}
                          />
                        </View>
                        {
                          accountType == ACCOUNT_TYPE.PERSONAL
                          ? <View style={styles.rowView}>
                              <RoundTextInput
                                label="First name"
                                type="text"
                                theme="gray"
                                value={firstName}
                                errorMessage={firstNameError}
                                maxLength={20}
                                style={{ width: '45%' }}
                                returnKeyType="next"
                                onSubmitEditing={() => { this.lastNameInput.focus() }}
                                onChangeText={(text) => this.setState({ firstName: text, firstNameError: null })}
                              />

                              <RoundTextInput
                                label="Last name"
                                type="text"
                                theme="gray"
                                placeholderTextColor={Colors.placeholderTextColor}
                                value={lastName}
                                errorMessage={lastNameError}
                                maxLength={20}
                                style={{ width: '45%' }}
                                returnKeyType="next"
                                onRefInput={(input) => { this.lastNameInput = input }}
                                onSubmitEditing={() => { 
                                  if (socialType == null || socialType == "") {
                                    this.emailInput.focus();
                                  }
                                  else {
                                    this.phoneInput.focus();
                                  }
                                }}
                                onChangeText={(text) => this.setState({ lastName: text, lastNameError: null })}
                              />
                            </View>
                          : <RoundTextInput
                            label="Company"
                            type="text"
                            theme="gray"
                            placeholderTextColor={Colors.placeholderTextColor}
                            value={company}
                            errorMessage={companyError}
                            maxLength={20}
                            returnKeyType="next"
                            onRefInput={(input) => { this.companyInput = input }}
                            onSubmitEditing={() => { 
                              if (socialType == null || socialType == "") {
                                this.emailInput.focus();
                              }
                              else {
                                this.phoneInput.focus();
                              }
                            }}
                            onChangeText={(text) => this.setState({ company: text, companyError: null })}
                          />
                        }

                        <RoundTextInput
                          label="Email Address"
                          type="email"
                          theme="gray"
                          editable={(socialType == null || socialType == "") ? true: false}
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={email}
                          errorMessage={emailError}
                          returnKeyType="next"
                          maxLength={30}
                          onSubmitEditing={() => { this.phoneInput.focus() }}
                          onRefInput={(input) => { this.emailInput = input }}
                          onChangeText={(text) => this.setState({ email: text, emailError: null })} 
                        />

                        <RoundTextInput
                          label="Phone Number"
                          type="phone"
                          theme="gray"
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={phone}
                          errorMessage={phoneError}
                          returnKeyType="next"
                          maxLength={20}
                          onSubmitEditing={() => { this.locationInput.focus() }}
                          onRefInput={(input) => { this.phoneInput = input }}
                          onChangeText={(text) => this.setState({ phone: text, phoneError: null })} />

                        <RoundTextInput
                          label="Address"
                          type="address"
                          theme="gray"
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={locationText}
                          errorMessage={locationError}
                          returnKeyType="done"
                          onSelectAddress={(address) => this.setState({ location: address, locationText: address })}
                          onSubmitEditing={() => { this.onMakeChanges() }}
                          onRefInput={(input) => { this.locationInput = input }}
                          onChangeText={this.onChangeLocation} 
                        />
                      </View>

                      <View style={styles.centerView}>
                        <RoundButton
                          title="Save Changes"
                          theme="gradient"
                          style={styles.blueButton}
                          onPress={() => this.onMakeChanges()} />
                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
            }
        </SafeAreaInsetsContext.Consumer>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Select Image'}
          options={['Camera', 'Photo Library', 'Cancel']}
          cancelButtonIndex={2}
          onPress={(index) => this.onSelectMedia(index)}
        />
        <Toast ref={ref => (this.toast = ref)} />
        { isLoading && <LoadingOverlay /> }
      </View>
    );
  }

  onChangeLocation =(text)=> {
    if (text == null || text == "") {
      this.setState({ location: '', locationText: '', locationError: null })
    }
    else {
      this.setState({ locationText: text, locationError: null })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },

  blueButton: {
    width: '90%'
  },

  profileBox: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 30,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    errorMessage: state.user.errorMessage,
    updateCustomerStatus: state.user.updateCustomerStatus,

    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEditProfileScreen);