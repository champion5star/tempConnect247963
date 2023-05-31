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
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import RoundTextInput from '../../components/RoundTextInput'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Messages from '../../theme/Messages'

class VerificationCodeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      codeError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.verifyCodePasswordStatus != this.props.verifyCodePasswordStatus) {
      if (this.props.verifyCodePasswordStatus == Status.SUCCESS) {
        this.verifyCodePasswordSuccess();
      } else if (this.props.verifyCodePasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  moveResetPassword() {
    if (this.props.route.params && this.props.route.params.email) {
      const { email } = this.props.route.params;
      this.props.navigation.navigate('ResetNewPassword', {email: email});
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onVerify() {
    Keyboard.dismiss();

    if (this.props.route.params && this.props.route.params.email) {
      const { email } = this.props.route.params;
      let code = this.state.code;

      var isValid = true;
      if (code == null || code.length <= 0) {
        this.setState({codeError: Messages.InvalidVerifyCode});
        isValid = false;
      }

      if (isValid) {
        this.setState({isLoading: true}, () => { 
          this.props.dispatch({
            type: actionTypes.VERIFY_CODE_PASSWORD,
            email: email,
            code: code
          });
        });      
      }
    }
  }

  verifyCodePasswordSuccess() {
    this.setState({isLoading: false});
    this.moveResetPassword(); 
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

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaView style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <TopNavBar title="Verify Code" onClickLeftButton={() => this.onBack()}/>
            <View style={styles.contentView}>
              <BlueBar title="We have sent you an access code via Email for email address verification." />              
              <RoundTextInput
                placeholder="Verification Code" 
                type="text"
                autoFocus={true}
                placeholderTextColor="#939393"
                style={{marginTop: 15}}
                errorMessage={this.state.codeError}
                value={this.state.code} 
                returnKeyType="done"
                onSubmitEditing={() => { 
                  this.onVerify() 
                }}
                onChangeText={(text) => this.setState({code: text, codeError: null})} 
              />
              <RoundButton 
                title="Verify" 
                theme="white" 
                style={styles.registerButton} 
                onPress={() => this.onVerify()} 
              />
            </View>
          </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
        <Toast ref={ref => (this.toast = ref)}/>
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
    verifyCodePasswordStatus: state.user.verifyCodePasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(VerificationCodeScreen);