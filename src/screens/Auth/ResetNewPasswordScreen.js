import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'

import actionTypes from '../../actions/actionTypes';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import RoundTextInput from '../../components/RoundTextInput'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH } from '../../constants.js'
import LoadingOverlay from '../../components/LoadingOverlay'
import Messages from '../../theme/Messages'

class ResetNewPasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
      passwordError: '',
      passwordConfirmError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.resetPasswordStatus != this.props.resetPasswordStatus) {
      if (this.props.resetPasswordStatus == Status.SUCCESS) {
        this.resetPasswordSuccess();
      } else if (this.props.resetPasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  moveLoginPage() {
    this.props.navigation.popToTop();
  }

  onResetPassword() {
    Keyboard.dismiss();

    if (this.props.route.params && this.props.route.params.email) {
      const { email } = this.props.route.params;
      const { newPassword, newPasswordConfirm} = this.state;

      var isValid = true;
      if (newPassword == null || newPassword.length <= 0) {
        this.setState({passwordError: Messages.InvalidPassword});
        isValid = false;
      } else if (newPassword.length < PASSWORD_MIN_LENGTH) {
        this.setState({passwordError: Messages.ShortPasswordError});
        isValid = false;
      }
  
      if (newPasswordConfirm == null || newPasswordConfirm.length <= 0) {
        this.setState({passwordConfirmError: Messages.InvalidConfirmPassword});
        isValid = false;
      } else if (newPassword != newPasswordConfirm) {
        this.setState({passwordConfirmError: Messages.InvalidPasswordNotMatch});
        isValid = false;
      }
  
      if (isValid) {
        this.setState({isLoading: true}, () => { 
          this.props.dispatch({
            type: actionTypes.RESET_PASSWORD,
            email: email,
            password: newPassword
          });        
        });      
      }
    }
  }

  resetPasswordSuccess() {
    this.setState({isLoading: false});
    this.moveLoginPage();   
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
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaView style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <TopNavBar title="Reset Password" onClickLeftButton={() => this.onBack()}/>
            <View style={styles.contentView}>
              <RoundTextInput
              autoFocus={true}
              placeholder="New Password" 
              type="password"
              placeholderTextColor="#939393"
              errorMessage={this.state.passwordError}
              value={this.state.newPassword} 
              returnKeyType="next"
              onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
              onChangeText={(text) => this.setState({newPassword: text, passwordError: null})} />

              <RoundTextInput
                placeholder="Confirm New Password" 
                type="password"
                placeholderTextColor="#939393"
                errorMessage={this.state.passwordConfirmError}
                value={this.state.newPasswordConfirm} 
                returnKeyType="done"
                onRefInput={(input) => { this.confirmPasswordInput = input }}
                onChangeText={(text) => this.setState({newPasswordConfirm: text, passwordConfirmError: null})} 
                onSubmitEditing={() => { 
                  this.onResetPassword() 
                }}
              />

              <RoundButton 
                title="RESET PASSWORD" 
                theme="white" 
                style={styles.registerButton} 
                onPress={() => this.onResetPassword()} />

            </View>
          </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
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
  },

  contentView: {
    padding: 35,
    marginTop: 15,
  },

  viewBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 20,
  },

  registerButton: {
    marginTop: 20,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    resultMessage: state.user.resultMessage,
    errorMessage: state.user.errorMessage,
    resetPasswordStatus: state.user.resetPasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ResetNewPasswordScreen);