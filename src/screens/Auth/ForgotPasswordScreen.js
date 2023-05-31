import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'

import actionTypes from '../../actions/actionTypes';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import RoundTextInput from '../../components/RoundTextInput'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import LoadingOverlay from '../../components/LoadingOverlay'
import { isValidEmail } from '../../functions'
import Messages from '../../theme/Messages'

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailError: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.forgotPasswordStatus != this.props.forgotPasswordStatus) {
      if (this.props.forgotPasswordStatus == Status.SUCCESS) {
        this.forgotPasswordSuccess();
      } else if (this.props.forgotPasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  showResultMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.props.navigation.navigate('VerificationCode', {email: this.state.email});
        }},
      ]
    );  
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onResetPassword() {
    Keyboard.dismiss();

    let email = this.state.email;

    var isValid = true;
    if (email == null || email.length <= 0 || !isValidEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.FORGOT_PASSWORD,
          email: email,
        });
      });      
    }
  }

  forgotPasswordSuccess() {
    this.setState({isLoading: false});
    let message = this.props.resultMessage;
    this.showResultMessage(message);
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
        <BackgroundImage/>
        <SafeAreaView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <TopNavBar title="Forgot Password" onClickLeftButton={() => this.onBack()}/>
              <View style={styles.contentView}>
                <BlueBar title="Enter your email address and we will send you a verification code to reset your password." />              
                <RoundTextInput
                  placeholder="Email Address" 
                  type="email"
                  autoFocus={true}
                  placeholderTextColor="#939393"
                  errorMessage={this.state.emailError}
                  value={this.state.email} 
                  returnKeyType="done"
                  style={{marginTop: 20}}
                  onSubmitEditing={() => { 
                    this.onResetPassword() 
                  }}
                  onChangeText={(text) => this.setState({email: text, emailError: null})} 
                />
                <RoundButton 
                  title="Send" 
                  theme="white" 
                  style={styles.registerButton} 
                  onPress={() => this.onResetPassword()}
                />
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
    forgotPasswordStatus: state.user.forgotPasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ForgotPasswordScreen);