import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import PaymentCell from '../../components/PaymentCell'
import Colors from '../../theme/Colors'

class PaymentMethodScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.willFocusPage);
  }

  componentWillUnmount() {
    this.focusListener();
  }

  resetData() {
    let currentUser = this.props.currentUser;
    this.setState({user: currentUser});
  }

  willFocusPage = () => {
    this.resetData();
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPaypal() {
    this.props.navigation.navigate('PaypalWithdraw');
  }

  onSelectBank() {
    this.props.navigation.navigate('BankWithdraw');
  }

  getBalance() {
    if (this.state.user) {
      return "$" + this.state.user.balance.toFixed(2);  
    }
    
    return "$0.00";  
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                 title="WITHDRAW TO"
                rightLabel="Balance"
                rightValue={this.getBalance()}
                align="left" 
                onClickLeftButton={() => this.onBack()}
              />
              <View style={styles.container}>
                <View style={styles.contentView}>
                  <PaymentCell method="card" label="Card" onPress={() => this.onSelectBank()} />
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
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaymentMethodScreen);