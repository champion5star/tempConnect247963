import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';

import {connect} from 'react-redux';
import stripe from 'tipsi-stripe'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast, {DURATION} from 'react-native-easy-toast'
import { LiteCreditCardInput } from "react-native-credit-card-input";

import BackgroundImage from '../../components/BackgroundImage'
import {STRIPE_KEY, TOAST_SHOW_TIME, Status} from '../../constants'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import RoundTextInput from '../../components/RoundTextInput'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Colors from '../../theme/Colors'
import Styles from '../../theme/Styles'

class CardDepositScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      cardForm: null,
      amountError: '',
      cardError: null,
      isLoading: false,
    }

    stripe.setOptions({
      publishableKey: STRIPE_KEY,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.depositStatus != this.props.depositStatus) {
      if (this.props.depositStatus == Status.SUCCESS) {
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
      } else if (this.props.depositStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onChangeForm(form) {
    this.setState({cardForm: form, cardError: null});
  }

  onDone() {
    Keyboard.dismiss();

    const user_id = this.props.currentUser._id;
    const amount = this.state.amount;
    var isValid = true;

    if (amount === null || amount === "" || isNaN(amount) || parseFloat(amount) < 10) {
      this.setState({amountError: Messages.InvalidDepositAmount});
      isValid = false;
    }

    if (!this.state.cardForm || !this.state.cardForm.valid) {
      this.setState({cardError: Messages.InvalidCard});
      isValid = false;
    }

    if (isValid) {
      
      this.setState({isLoading: true}, () => { 
        const cardNumber = this.state.cardForm.values.number;
        const expiry = this.state.cardForm.values.expiry;
        const cvc = this.state.cardForm.values.cvc;
        const result = expiry.split('/');

        const expMonth = parseInt(result[0]);
        const expYear = parseInt(result[1]);

        const params = {
          number: cardNumber,
          expMonth: expMonth,
          expYear: expYear,
          cvc: cvc,
        }

        const lastDigits = cardNumber.substr(cardNumber.length - 5);

        stripe.createTokenWithCard(params)
        .then(response => {
          const token = response.tokenId;
          const data = {
            user_id: user_id,
            amount: parseFloat(amount),
            payment_type: 'card',
            card_number: lastDigits,
            token: token
          };

          this.props.dispatch({
            type: actionTypes.DEPOSIT,
            data: data,
          });
        })
        .catch(error => {
          console.log("error = ", error);
          this.setState({isLoading: false});
          if (error.message === "A server with the specified hostname could not be found.") {
            this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
          } else {
            this.toast.show(error.message, TOAST_SHOW_TIME);
          }
        });
        // 
      });      
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

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <BackgroundImage />
          <SafeAreaInsetsContext.Consumer>
          {
            insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                  title="Deposit From Card"
                  align="left" 
                  onClickLeftButton={() => this.onBack()}
              />
              <View style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding": ""} enabled>
                  <View style={styles.contentView}>
                    <BlueBar title="Deposit amount from your credit card." theme="black" />
                    <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                      <Image
                        style={styles.bankIcon}
                        source={Images.credit_card}
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
                      onChangeText={(text) => this.setState({amount: text, amountError: null})} />               

                    <LiteCreditCardInput ref={cardInput => this.cardInput = cardInput} onChange={(form) => this.onChangeForm(form)} />
                    { this.state.cardError && <Text style={[Styles.errorText, {textAlign: 'left', fontSize: 12, marginLeft: 10}]} >{this.state.cardError}</Text> }
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
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor
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
    marginTop: 60,
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
    depositStatus: state.user.depositStatus,
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CardDepositScreen);