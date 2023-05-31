import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import Toast, {DURATION} from 'react-native-easy-toast'
import { LiteCreditCardInput } from "react-native-credit-card-input";

import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import RoundTextInput from '../../components/RoundTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Styles from '../../theme/Styles'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Colors from '../../theme/Colors'

class BankWithdrawScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      cardForm: null,

      amountError: null,
      cardError: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initUserInfo();      
    }, 100)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentUser != this.props.currentUser) {
      this.initUserInfo();    
    }
    
    if (prevProps.withdrawWithBankStatus != this.props.withdrawWithBankStatus) {
      if (this.props.withdrawWithBankStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        Alert.alert(
          '',
          Messages.SuccessWithdraw,
          [
            {text: 'OK', onPress: () => {
              this.props.navigation.pop(2);
            }},
          ]
        ); 
      } else if (this.props.withdrawWithBankStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
      }      
    }
  }

  initUserInfo() {
    if (this.props.currentUser && this.props.currentUser._id) {
      let currentUser = this.props.currentUser;
      const balance = Math.floor(currentUser.balance * 100) / 100 + "";
      this.setState({
        amount: balance,
      })
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

    let amount = this.state.amount;
    const { currentUser } = this.props;
    const balance = Math.floor(currentUser.balance * 100) / 100;
    var isValid = true;

    if (amount === null || amount === "" || isNaN(amount) || parseFloat(amount) <= 0) { 
      this.setState({amountError: Messages.InvalidWithdrawAmount});
      isValid = false;
    } else if (parseFloat(amount) > balance) {
      this.setState({amountError: Messages.InvalidWithdrawAmountMoreThanBalance});
      isValid = false;
    }

    if (this.state.cardForm == null || !this.state.cardForm.valid) {
      this.setState({cardError: Messages.InvalidCard});
      isValid = false;
    }

    if (isValid) {
      
      this.setState({isLoading: true}, () => { 
        let cardNumber = this.state.cardForm.values.number;
        let expiry = this.state.cardForm.values.expiry;
        let cvc = this.state.cardForm.values.cvc;

        this.props.dispatch({
          type: actionTypes.WITHDRAW_WITH_BANK,
          user_id: this.props.currentUser._id,
          cardNumber: cardNumber,
          expiry: expiry,
          cvc: cvc,
          amount: amount
        });
      });      
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="Withdraw To Card" onClickLeftButton={() => this.onBack()}/>
              <View style={styles.container}>
                <KeyboardAwareScrollView>
                  <View style={styles.contentView}>
                    <BlueBar title="Create a withdrawal request with credit card." theme="black" />                
                    <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                      <Image
                        style={styles.bankIcon}
                        source={Images.credit_card}
                      />
                    </View>

                    <RoundTextInput
                      placeholder="Amount" 
                      type="number"
                      theme="gray"
                      placeholderTextColor="#939393"
                      value={this.state.amount} 
                      errorMessage={this.state.amountError}
                      onChangeText={(text) => this.setState({amount: text, amountError: null})} 
                    />               

                    <LiteCreditCardInput ref={cardInput => this.cardInput = cardInput} onChange={(form) => this.onChangeForm(form)} />
                    { this.state.cardError && <Text style={[Styles.errorText, {textAlign: 'left', fontSize: 12, marginLeft: 10}]} >{this.state.cardError}</Text> }

                    <RoundButton 
                      title="Done" 
                      theme="gradient" 
                      style={styles.nextButton} 
                      onPress={() => this.onDone()} 
                    />
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
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
    position: 'absolute',
    bottom: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButton: {
    marginTop: 40,
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
    withdrawWithBankStatus: state.user.withdrawWithBankStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(BankWithdrawScreen);