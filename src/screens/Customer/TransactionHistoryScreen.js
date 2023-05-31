import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast, {DURATION} from 'react-native-easy-toast'

import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import BlueInfoBar from '../../components/Provider/BlueInfoBar'
import EarningCell from '../../components/Provider/EarningCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView';
import {TOAST_SHOW_TIME, Status} from '../../constants'
import Messages from '../../theme/Messages';

class TransactionHistoryScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      jobCount: 0,
      totalPaid: 0,
      transactions: [],
      user: null,
    }    
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initData();      
    }, 100)
    
    this.focusListener = this.props.navigation.addListener('focus', this.willFocusPage);
  }

  initData() {
    this.setState({isLoading: true});
    let currentUser = this.props.currentUser;
    this.props.dispatch({
      type: actionTypes.GET_TRANSACTIONS,
      user_id: currentUser._id,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.transactions != this.props.transactions) {
      this.resetData();
    }

    if (prevProps.getTransactionsStatus != this.props.getTransactionsStatus) {
      if (this.props.getTransactionsStatus == Status.SUCCESS) {
        this.resetData();
      } else if (this.props.getTransactionsStatus == Status.FAILURE) {      
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

  willFocusPage =()=> {
    this.initData();    
  }

  componentWillUnmount() {
    this.focusListener();
  }

  resetData() {
    let jobCount = this.props.jobCount;
    let totalPaid = this.props.totalPaid;
    let transactions = this.props.transactions;

    this.setState({
      isLoading: false,
      jobCount: jobCount,
      totalPaid: totalPaid,
      transactions: transactions
    });
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onDeposit() {
    this.props.navigation.navigate('DepositPaymentMethod');
  }

  getBalance() {
    let currentUser = this.props.currentUser;
    return "$" + currentUser.balance.toFixed(2);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="Transactions" 
                leftButton="menu" 
                rightButton="balance"
                rightValue="Deposit"
                onClickLeftButton={() => this.onMenu()}
                onClickRightButton={() => this.onDeposit()}
              />

              <View style={styles.container}>
                <View style={styles.contentView}>
                  <BlueInfoBar 
                    title1="Balance"  value1={this.getBalance()} 
                    title2="My Projects" value2={this.state.jobCount}
                    title3="Total Paid" value3={this.state.totalPaid.toFixed(2)} 
                  />
                </View>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                  {
                    (this.state.transactions && this.state.transactions.length > 0)
                    ? <FlatList
                        style={styles.listView}
                        data={this.state.transactions}
                        ListFooterComponent={(<View style={{height: 80}}/>)}
                        renderItem={({item, index}) => (
                          <EarningCell data={item} />
                        )}
                        keyExtractor={(item, index) => item._id}
                      />
                    : <EmptyView title="No transactions." />
                  }
                </View>
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
  },

  contentView: {
    marginTop: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 2,
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
    jobCount: state.user.jobCount,
    totalPaid: state.user.totalPaid,
    transactions: state.user.transactions,
    errorMessage: state.user.errorMessage,
    getTransactionsStatus: state.user.getTransactionsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(TransactionHistoryScreen);