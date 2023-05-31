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
import LoadingOverlay from '../../components/LoadingOverlay'
import BlueInfoBar from '../../components/Provider/BlueInfoBar'
import EarningCell from '../../components/Provider/EarningCell'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import {TOAST_SHOW_TIME, Status} from '../../constants'
import Messages from '../../theme/Messages';

class ProviderEarningsScreen extends Component {
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
      _SELF.initUserInfo();      
    }, 100)
    
    this.focusListener = this.props.navigation.addListener('focus', this.willFocusPage);
  }

  initUserInfo() {
    this.setState({isLoading: true});
    let currentUser = this.props.currentUser;
    this.props.dispatch({
      type: actionTypes.GET_TRANSACTIONS,
      user_id: currentUser._id,
    });
  }

  componentWillUnmount() {
    this.focusListener();
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
    this.setState({ isLoading: false });
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  willFocusPage =()=> {
    this.resetData();    
  }

  resetData() {
    const { currentUser, jobCount, totalPaid, transactions } = this.props;
    this.setState({
      isLoading: false,
      jobCount: jobCount,
      totalPaid: totalPaid,
      transactions: transactions,
      user: currentUser
    });
  }

  getBalance() {
    if (this.state.user) {
      const balance = Math.floor(this.state.user.balance * 100) / 100;
      return "$" + balance.toFixed(2);  
    }    
    return "$0.00";  
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onWithdraw() {
    this.props.navigation.navigate('PaymentMethod');
  }

  render() {
    const { currentUser } = this.props;
    const { jobCount, totalPaid, transactions } = this.state;

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar 
              title="Earnings" 
              leftButton="menu" 
              rightButton={currentUser.balance > 0 ? "balance" : ""}
              rightValue={currentUser.balance > 0 ? "Withdraw" : ""}
              onClickLeftButton={() => this.onMenu()}
              onClickRightButton={() => this.onWithdraw()}
            />

            <View style={styles.container}>
              <View style={styles.contentView}>
                <BlueInfoBar 
                  title1="Balance"  value1={this.getBalance()} 
                  title2="Jobs Worked" value2={jobCount}
                  title3="Total Earned" value3={totalPaid.toFixed(2)} 
                />
              </View>
              <View style={{flex: 1, backgroundColor: 'white'}}>
                {
                  (transactions && transactions.length > 0)
                  ? <FlatList
                      style={styles.listView}
                      data={transactions}
                      ListFooterComponent={(<View style={{height: 80}}/>)}
                      renderItem={({item, index}) => (
                        <EarningCell data={item} />
                      )}
                      keyExtractor={(item, index) => item._id}
                    />
                  : <EmptyView title="No earnings." />
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

  listView: {
    flex: 1,
    backgroundColor: 'white'
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
    transactions: state.user.transactions,
    jobCount: state.user.jobCount,
    totalPaid: state.user.totalPaid,
    getTransactionsStatus: state.user.getTransactionsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderEarningsScreen);