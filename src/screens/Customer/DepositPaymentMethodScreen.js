import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import PaymentCell from '../../components/PaymentCell'
import Colors from '../../theme/Colors';

class DepositPaymentMethodScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoading: false,
    }    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      const currentUser = this.props.currentUser;
      this.setState({user: currentUser});
    });   
  }

  componentWillUnmount() {
    this.focusListener();
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPaypal() {
    this.props.navigation.navigate('PaypalDeposit');
  }

  onSelectBank() {
    this.props.navigation.navigate('BankDeposit');
  }

  onSelectCard() {
    this.props.navigation.navigate('CardDeposit'); 
  }

  render() {
    const currentUser = this.state.user;
    var balance = "$0.00";  
    if (currentUser) {
      balance = "$" + currentUser.balance.toFixed(2);  
    }

    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
               title="Deposit From"
                align="left" 
                onClickLeftButton={() => this.onBack()}
              />
              <View style={styles.container}>
                <View style={styles.contentView}>
                  <PaymentCell method="card" label="Credit Card" onPress={() => this.onSelectCard()} />
                  <PaymentCell method="paypal" label="Paypal" onPress={() => this.onSelectPaypal()} />
                </View>
              </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(DepositPaymentMethodScreen);