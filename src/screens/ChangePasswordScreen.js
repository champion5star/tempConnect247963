import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'

import actionTypes from '../actions/actionTypes';
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import RoundTextInput from '../components/RoundTextInput'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH } from '../constants.js'
import Messages from '../theme/Messages'
import Colors from '../theme/Colors'

class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      newPassword: '',
      confirmPassword: '',

      passwordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
      isLoading: false,
    }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.changePasswordStatus != this.props.changePasswordStatus) {
      if (this.props.changePasswordStatus == Status.SUCCESS) {
        this.changePasswordSuccess();
      } else if (this.props.changePasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onChangePassword=()=> {
    Keyboard.dismiss();
    var isValid = true;

    if (this.state.password == null || this.state.password.length == 0) {
      this.setState({passwordError: Messages.InvalidPassword});
      isValid = false;
    }

    if (this.state.newPassword == null || this.state.newPassword.length == 0) {
      this.setState({newPasswordError: Messages.InvalidNewPassword});
      isValid = false;
    } else if (this.state.newPassword.length < PASSWORD_MIN_LENGTH) {
      this.setState({newPasswordError: Messages.ShortPasswordError});
      isValid = false;
    }

    if (this.state.confirmPassword === null || this.state.confirmPassword.length === 0) {
      this.setState({confirmPasswordError: Messages.InvalidConfirmPassword});
      isValid = false;
    } else if(this.state.newPassword != this.state.confirmPassword) {
      this.setState({confirmPasswordError: Messages.InvalidPasswordNotMatch});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.CHANGE_PASSWORD,
          user_id: this.props.currentUser._id,
          old_password: this.state.password,
          new_password: this.state.newPassword,
        });
      });  
    }
  }

  onMenu() {
    Keyboard.dismiss();
    this.props.navigation.toggleDrawer();
  }

  changePasswordSuccess() {
    this.setState({isLoading: false});
    Alert.alert(
      '',
      'Password has been changed successfully!',
      [
        {text: 'OK', onPress: () => {
          this.setState({
            password: null,
            newPassword: null,
            confirmPassword: null
          });
        }},
      ],
      {cancelable: false},
    ); 
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

  render() {
    const { password, newPassword, confirmPassword, passwordError, newPasswordError, confirmPasswordError } = this.state;

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar 
              title="Change Password" 
              leftButton="menu" 
              onClickLeftButton={() => this.onMenu()}
            />
            <View style={styles.container}>
              <KeyboardAwareScrollView>
                <View style={styles.contentView}>
                  <RoundTextInput
                  label="Current Password" 
                  type="password"
                  theme="gray"
                  placeholderTextColor="#939393"
                  value={password} 
                  errorMessage={passwordError}
                  returnKeyType="next"                                       
                  onSubmitEditing={() => { this.newPasswordInput.focus() }}
                  onChangeText={(text) => this.setState({password: text, passwordError: null})} />

                  <RoundTextInput
                  label="New Password" 
                  type="password"
                  theme="gray"
                  placeholderTextColor="#939393"
                  value={newPassword} 
                  errorMessage={newPasswordError} 
                  returnKeyType="next"                                       
                  onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
                  onRefInput={(input) => { this.newPasswordInput = input }}
                  onChangeText={(text) => this.setState({newPassword: text, newPasswordError: null})} />

                  <RoundTextInput
                  label="Confirm Password" 
                  type="password"
                  theme="gray"
                  placeholderTextColor="#939393"
                  value={confirmPassword} 
                  returnKeyType="done" 
                  errorMessage={confirmPasswordError}                                      
                  onRefInput={(input) => { this.confirmPasswordInput = input }}
                  onSubmitEditing={this.onChangePassword}
                  onChangeText={(text) => this.setState({confirmPassword: text, confirmPasswordError: null})} />
                </View>
              </KeyboardAwareScrollView>
              <View style={styles.viewBottom}>
                <RoundButton 
                  title="CHANGE PASSWORD" 
                  theme="gradient" 
                  style={styles.registerButton} 
                  onPress={this.onChangePassword} />
              </View>
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
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    padding: 25,
    marginTop: 20,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  registerButton: {
    width: '90%'
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
    errorMessage: state.user.errorMessage,
    changePasswordStatus: state.user.changePasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangePasswordScreen);