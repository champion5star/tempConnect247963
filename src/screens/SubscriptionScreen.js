import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';

import {connect} from 'react-redux';
import * as RNIap from 'react-native-iap';
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import { 
    TOAST_SHOW_TIME, 
    Status,
    BUY_CREDIT,
    SUBSCRIPTION_MONTHLY, 
    USER_LEVEL 
} from '../constants.js'
import LoadingOverlay from '../components/LoadingOverlay'
import { checkInternetConnectivity } from '../functions'
import Toast from 'react-native-easy-toast'
import actionTypes from '../actions/actionTypes';
import Messages from '../theme/Messages'
import Images from '../theme/Images'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'
  
class SubscriptionScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      products: [],
      subscriptions: [],
      isRequestSubscription: false,
      selectedPurchase: null,
    }
  }

  componentDidMount() {
    this.initIAP();
  }

  componentDidUpdate(prevProps, prevState) {
    // Buy Credit.
    if (prevProps.buyCreditStatus != this.props.buyCreditStatus) {
      if (this.props.buyCreditStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.makeCompletePurchase();
      } 
      else if (this.props.buyCreditStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.showMessage(Messages.BuyCreditFailed, false);        
      }      
    }

    // Subscription.
    if (prevProps.changeSubscriptionStatus != this.props.changeSubscriptionStatus) {
      if (this.props.changeSubscriptionStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SubscriptionCompleted, true);
        this.makeCompletePurchase();
      } 
      else if (this.props.changeSubscriptionStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SubscriptionFailed, false);        
      }      
    }
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    RNIap.endConnection();
  }

  async initIAP() {
    try {
      await RNIap.initConnection();
      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();  
      }      
      this.getSubscriptions();
    } catch (err) {
      console.log("IAP error: ", err);
      if (err.message) {
        this.toast.show(err.message, TOAST_SHOW_TIME);
      }
    }
  }

  initIAPListener() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          if (this.state.isRequestSubscription) {
            this.finishTransaction(purchase);
          }          
        }
      },
    );

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        if (this.state.isRequestSubscription) {
          Alert.alert(Messages.SubscriptionCancelled, '');
        }        
        this.setState({isLoading: false, isRequestSubscription: false});
      },
    );
  }

  getSubscriptions = async () => {
    const _SELF = this;
    try {
        _SELF.setState({isLoading: true});
        const products = await RNIap.getProducts([BUY_CREDIT]);
        const subscriptions = await RNIap.getSubscriptions([SUBSCRIPTION_MONTHLY]);
        _SELF.setState({products: products, subscriptions: subscriptions, isLoading: false});
        _SELF.initIAPListener();
    } 
    catch (err) {
       console.warn(err.code, err.message);
       _SELF.setState({isLoading: false});
    }
  };

  onBack() {
    this.props.navigation.goBack();
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) this.onBack();
        }},
      ],
      {cancelable: false},
    ); 
  }

  finishTransaction(purchase) {
    const { currentUser } = this.props;
    this.setState({isRequestSubscription: false, isLoading: true, selectedPurchase: purchase});
    if (purchase) {
      if (purchase.productId == BUY_CREDIT) {
        this.props.dispatch({
          type: actionTypes.BUY_CREDIT,
          data: {
            user_id: currentUser._id,
            credit: 1,
          },
      }); 
      }
      else {
        this.props.dispatch({
            type: actionTypes.CHANGE_SUBSCRIPTION,
            user_id: currentUser._id,
            level: USER_LEVEL.MONTHLY,
            subscription: purchase
        }); 
      }
    }
    else {
      this.setState({isLoading: false});
    }
  }

  async makeCompletePurchase() {
    const { selectedPurchase } = this.state;
    if (selectedPurchase) {
      if (Platform.OS === 'ios') {
        await RNIap.finishTransactionIOS(selectedPurchase.transactionId);
      } 
      else if (Platform.OS === 'android') {
        await RNIap.consumePurchaseAndroid(selectedPurchase.purchaseToken);
      }
      await RNIap.finishTransaction(selectedPurchase, false);
    }
  }

  async onSubscribe() {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { subscriptions } = this.state;
      if (subscriptions && subscriptions.length > 0) {
        const productId = SUBSCRIPTION_MONTHLY;
        try {
          this.setState({isLoading: true, isRequestSubscription: true});
          await RNIap.requestPurchase(productId);
        } catch (err) {
          this.setState({isLoading: false, isRequestSubscription: false});
        }
      }
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async onBuyCredit() {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { products } = this.state;
      if (products && products.length > 0) {
        const productId = BUY_CREDIT;
        try {
          this.setState({isLoading: true, isRequestSubscription: true});
          await RNIap.requestPurchase(productId);
        } catch (err) {
          this.setState({isLoading: false, isRequestSubscription: false});
        }
      }
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async onRestore() {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({isLoading: true});
      const availablePurchases = await RNIap.getAvailablePurchases();
      this.setState({isLoading: false});

      if (availablePurchases && availablePurchases.length > 0) {
        const sortedAvailablePurchases = availablePurchases.sort(
          (a, b) => b.transactionDate - a.transactionDate
        );
        const latestPurchase = sortedAvailablePurchases[0];
        this.finishTransaction(latestPurchase);
      }
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  _renderHeader() {
    const { currentUser } = this.props;
    const credit = (currentUser && currentUser.credit) ? currentUser.credit : 0;

    return (
      <View style={[styles.section, styles.header]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Images.icon_credit} style={styles.creditIcon}/>
          <Text style={styles.sectionTitle}>Connect Balance</Text>          
        </View>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text style={styles.creditScore}>{credit}</Text>
          <Text style={styles.creditLabel}>{ credit > 1 ? "Connects" : "Connect"} </Text>
        </View>
      </View>
    )
  }

  _renderBuyNow() {
    const { products } = this.state;
    var price = "$ 9.99";
    if (products && products.length > 0) {
      products.forEach(p => {
        if (p.productId == BUY_CREDIT) {
          price = p.localizedPrice;
          return;
        }
      });
    }

    return (
      <View style={[styles.section, styles.buyBox]}>
        <Text style={styles.sectionTitle}>Single Job Posting</Text>
        <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'flex-end'}}>
          <Text style={styles.creditScore}>{price}</Text>
          <Text style={styles.creditLabel}>/Per Job Posting</Text>
        </View>
        <Text style={styles.descriptionText}>A service fee will be charged for each job posting.</Text>
        <View style={styles.boxFooter}>
          <TouchableOpacity style={styles.btnBuy} onPress={() => this.onBuyCredit()}>
            <Text style={styles.btnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderSubscription() {
    const { currentUser } = this.props;
    const { subscriptions } = this.state;
    var price = "$ 59.99";
    if (subscriptions && subscriptions.length > 0) {
      subscriptions.forEach(p => {
        if (p.productId == SUBSCRIPTION_MONTHLY) {
          price = p.localizedPrice;
          return;
        }
      });
    }

    return (
      <View style={[styles.section, styles.buyBox]}>
        <Text style={styles.sectionTitle}>Premium Membership</Text>
        <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'flex-end'}}>
          <Text style={[styles.creditScore, {color: '#57a4bd'}]}>{price}</Text>
          <Text style={styles.creditLabel}>/Month</Text>
        </View>
        <Text style={styles.descriptionText}>A monthly reoccurring fee will be charged for unlimited job postings.</Text>
        <View style={styles.boxFooter}>
          <TouchableOpacity style={styles.btnSubscribe} onPress={() => this.onSubscribe()}>
            <Text style={styles.btnText}>Subscribe Now</Text>
          </TouchableOpacity>
          {
            (currentUser.level > 0)
            ? <TouchableOpacity style={styles.restoreBtn} onPress={() => this.onRestore()}>
                <Text style={styles.restoreBtnText}>Restore</Text>
              </TouchableOpacity>
            : null
          }
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets =>
            <View style={{flex: 1, paddingTop: insets.top }} >
                <View style={styles.container}>
                    <TopNavBar title="Subscription" onClickLeftButton={() => this.onBack()}/>
                    <ScrollView style={{flex: 1, backgroundColor: '#f3f3f9'}}>
                      <View style={styles.contentView}>
                        { this._renderHeader() }
                        { this._renderBuyNow() }
                        { this._renderSubscription() }
                      </View>
                    </ScrollView>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    flex: 1,
    padding: 20,
  },

  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  creditIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },

  sectionTitle: {
    fontFamily: Fonts.medium,
    color: '#282828',
    fontSize: 18,
  },

  creditScore: {
    fontFamily: Fonts.medium,
    color: '#f4b844',
    fontSize: 25,
  },

  creditLabel: {
    fontFamily: Fonts.regular,
    color: '#9799a1',
    fontSize: 16,
    marginLeft: 3,
    marginBottom: 3,
  },

  descriptionText: {
    marginTop: 5,
    fontFamily: Fonts.regular,
    color: '#282828',
  },

  boxFooter: {
    marginTop: 15,
    marginBottom: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#d6dfeb',
    paddingTop: 15,
  },

  btnBuy: {
    backgroundColor: '#f4b844',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
  },

  btnSubscribe: {
    backgroundColor: '#57a4bd',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
  },

  btnText: {
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
    fontSize: 18,
    color: 'white',
  },

  subscribeButton: {
    marginTop: 20,
    width: '100%',
  },

  restoreBtn: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  restoreBtnText: {
    fontFamily: Fonts.bold,
    color: Colors.appColor,
    fontSize: 16,
  },

  errorText: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: '#fc3434',
    fontSize: 11,
    marginLeft: 10,
    marginTop: 5,
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
    changeSubscriptionStatus: state.user.changeSubscriptionStatus,
    buyCreditStatus: state.user.buyCreditStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SubscriptionScreen);