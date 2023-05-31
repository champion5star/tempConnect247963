import React, { Component } from 'react';
import {
  Platform,
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import { requestOneTimePayment, requestDeviceData } from 'react-native-paypal';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import Toast, {DURATION} from 'react-native-easy-toast'

import {TOAST_SHOW_TIME, Status} from '../../constants'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import RoundTextInput from '../../components/RoundTextInput'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Colors from '../../theme/Colors'

class PaypalDepositScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      amountError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getPaypalClientTokenStatus != this.props.getPaypalClientTokenStatus) {
      if (this.props.getPaypalClientTokenStatus == Status.SUCCESS) {
        const token = this.props.paypalClientToken;
        this.depositeWithPaypal(token);
      } else if (this.props.getPaypalClientTokenStatus == Status.FAILURE) {      
        this.onFailure(this.props.errorMessage);
      }      
    }

    if (prevProps.processPaypalDepositStatus != this.props.processPaypalDepositStatus) {
      if (this.props.processPaypalDepositStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        Alert.alert(
          '',
          Messages.SuccessDeposit,
          [
            {text: 'OK', onPress: () => {
              this.props.navigation.pop(2);
            }},
          ]
        );  
      } else if (this.props.processPaypalDepositStatus == Status.FAILURE) {      
        this.onFailure(this.props.errorMessage);
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

  async depositeWithPaypal(token) {
    const { amount } = this.state;
    const { currentUser } = this.props;
    try {
      const { nonce, payerId, email, firstName, lastName, phone } = await requestOneTimePayment(token, {
          amount: amount,
          currency: 'USD',
          shippingAddressRequired: false,
          userAction: 'commit',
          intent: 'authorize', 
        }
      );

      const { deviceData } = await requestDeviceData(token);
      const data = {
        user_id: currentUser._id,
        amount,
        nonce,
        payerId,
        email,
        firstName,
        lastName,
        phone,
        deviceData
      };

      this.props.dispatch({
        type: actionTypes.PROCESS_PAYPAL_DEPOSIT,
        data: data,
      });
    } catch (error) {
      this.setState({isLoading: false});
      console.log("error: ", error);
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDone() {
    Keyboard.dismiss();

    const amount = this.state.amount;
    var isValid = true;
    if (amount === null || amount === "" || isNaN(amount) || parseFloat(amount) < 10) {
      this.setState({amountError: Messages.InvalidDepositAmount});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.GET_PAYPAL_CLIENT_TOKEN,
        });
      });
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <BackgroundImage />
          <SafeAreaInsetsContext.Consumer>
          {(insets) => 
            <View style={{ paddingTop: insets.top, flex: 1 }}>
              <TopNavBar 
                title="Deposit From Paypal"
                align="left" 
                onClickLeftButton={() => this.onBack()}
              />
              <View style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding": ""} enabled>
                  <View style={styles.contentView}>
                    <BlueBar title="Deposit amount from your paypal." theme="black"/>
                    <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                      <Image
                        style={styles.bankIcon}
                        source={Images.paypal}
                      />
                    </View>

                    <RoundTextInput
                      label="Deposit Amount" 
                      type="number"
                      theme="gray"
                      maxLength={10}
                      placeholderTextColor="#939393"
                      value={this.state.amount} 
                      errorMessage={this.state.amountError}
                      onSubmitEditing={() => { 
                        this.onDone() 
                      }}
                      onChangeText={(text) => this.setState({amount: text, amountError: null})} 
                    />               

                  </View>
                </KeyboardAvoidingView>

                <View style={styles.viewBottom}>
                  <RoundButton 
                    title="Done" 
                    theme="gradient" 
                    style={styles.nextButton} 
                    onPress={() => this.onDone()} />
                </View>
              </View>
              <Toast ref={ref => (this.toast = ref)} />
              {
                this.state.isLoading
                ? <LoadingOverlay />
                : null
              }        
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    paddingTop: 20,
    paddingLeft: 35, 
    paddingRight: 35, 
  },

  bankIcon: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },

  viewBottom: {
    marginTop: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButton: {
    marginTop: 20,
    width: '90%'
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
    paypalClientToken: state.user.paypalClientToken,
    getPaypalClientTokenStatus: state.user.getPaypalClientTokenStatus,
    processPaypalDepositStatus: state.user.processPaypalDepositStatus,
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaypalDepositScreen);