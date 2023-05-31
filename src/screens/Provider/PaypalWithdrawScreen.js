import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import Toast, {DURATION} from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import RoundTextInput from '../../components/RoundTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Messages from '../../theme/Messages'
import Colors from '../../theme/Colors'
import Images from '../../theme/Images'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import { isValidEmail } from '../../functions'

class PaypalWithdrawScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paypal: '',
      amount: '0',

      paypalError: '',
      amountError: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initUserInfo();      
    }, 100)
  }

  initUserInfo() {
    const currentUser = this.props.currentUser;
    const balance = Math.floor(currentUser.balance * 100) / 100 + "";
    this.setState({
      amount: balance
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.withdrawWithPaypalStatus != this.props.withdrawWithPaypalStatus) {
      if (this.props.withdrawWithPaypalStatus == Status.SUCCESS) {
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
      } else if (this.props.withdrawWithPaypalStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onRequestWithdraw() {
    Keyboard.dismiss();

    let paypal = this.state.paypal;
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

    if (paypal == null || paypal.length <= 0 || !isValidEmail(paypal)) {
      this.setState({paypalError: Messages.InvalidPaypal});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.WITHDRAW_WITH_PAYPAL,
          user_id: this.props.currentUser._id,
          paypal: paypal,
          amount: amount
        });
      });      
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar title="Withdraw To Paypal" align="left" onClickLeftButton={() => this.onBack()}/>
            <View style={styles.container}>
              <KeyboardAwareScrollView>
                <View style={styles.contentView}>
                  <BlueBar title="Create a withdrawal request with paypal" theme="black"/>
                  <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                    <Image
                      style={styles.paypalIcon}
                      source={Images.paypal}
                    />
                  </View>

                  <RoundTextInput
                    placeholder="Withdraw Amount" 
                    type="number"
                    theme="gray"
                    maxLength={10}
                    placeholderTextColor="#939393"
                    value={this.state.amount} 
                    errorMessage={this.state.amountError}
                    onChangeText={(text) => this.setState({amount: text, amountError: null})} />               

                  <RoundTextInput
                    placeholder="Paypal" 
                    theme="gray"
                    type="email"
                    placeholderTextColor="#939393"
                    value={this.state.paypal} 
                    errorMessage={this.state.paypalError}
                    onChangeText={(text) => this.setState({paypal: text, paypalError: null})} />
                  
                  <RoundButton 
                    title="Request" 
                    theme="gradient" 
                    style={styles.nextButton} 
                    onPress={() => this.onRequestWithdraw()} 
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

  paypalIcon: {
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
    marginTop: 50,
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
    withdrawWithPaypalStatus: state.user.withdrawWithPaypalStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaypalWithdrawScreen);