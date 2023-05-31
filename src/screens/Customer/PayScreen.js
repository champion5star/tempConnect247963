import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import Moment from 'moment';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast from 'react-native-easy-toast'

import actionTypes from '../../actions/actionTypes';
import BackgroundImage from '../../components/BackgroundImage';
import RoundButton from '../../components/RoundButton'
import TopNavBar from '../../components/TopNavBar'
import LoadingOverlay from '../../components/LoadingOverlay'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Messages from '../../theme/Messages'
import { 
  TOAST_SHOW_TIME, 
  NOTIFICATION_TYPE, 
  Status, 
  DATE_TIME_FORMAT, 
  PAY_TYPE 
} from '../../constants.js'

class PayScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      project: null,
    }    
  }

  componentDidMount() {
    if (this.props.route.params) {
      const { project } = this.props.route.params;
      this.setState({ project });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.payJobStatus != this.props.payJobStatus) {
      if (this.props.payJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.props.currentUser.balance = this.props.balance;
        this.onBack();
      } else if (this.props.payJobStatus == Status.FAILURE) {
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

  onBack() {
    this.props.navigation.goBack();
  }

  onPay() {
    Keyboard.dismiss();

    const { isLoading, project } = this.state;
    if (isLoading) return;

    const { currentUser, fee } = this.props;
    const currentBalance = (currentUser && currentUser.balance) ? currentUser.balance : 0;

    if (project) {
      const freelancer = project.hire.user;
      const { total, subTotal } = this.getTotalPrice(project, fee);

      if (currentBalance >= total) {
  
        // Show confirm dialog.
        Alert.alert(
          '',
          Messages.AskPayQuote,
          [
            {text: 'Yes', onPress: () => {
              // Pay Job.
              this.setState({isLoading: true});
              this.props.dispatch({
                type: actionTypes.PAY_JOB,
                data: {
                  job_id: project._id,
                  customer_id: currentUser._id,
                  provider_id: freelancer._id,
                  total,
                  subTotal,
                }
              });
              this.generateNotification(project, NOTIFICATION_TYPE.PAY_JOB);
            }},
            {text: 'No', onPress: () => {}},
          ]
        );  
      } else {
        // Move Deposit Screen.
        this.props.navigation.navigate('DepositPaymentMethod');
      }
    }
  }

  generateNotification(project, type) {
    const { currentUser } = this.props;
    const n = {
      creator: currentUser._id,
      receiver: project.hire.user._id,
      job: project._id,
      type: type
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n,
    });
  }
  
  getTotalPrice(project, fee) {
    var total = 0;
    var subTotal = 0;

    if (project) {
      if (project.payType === PAY_TYPE.FIXED) {
        subTotal = project.hire.price;
        total = subTotal + (fee / 100) * subTotal;
      } else {
        subTotal = project.hire.price * project.hire.duration;
        total = subTotal + (fee / 100) * subTotal;
      }
    }
    return {
      total, 
      subTotal,
    };
  }

  render() {
    const { currentUser, fee } = this.props;
    const { isLoading, project } = this.state;

    const currentBalance = (currentUser && currentUser.balance) ? currentUser.balance.toFixed(2) : "0";

    var title = "";
    if (project) {
      if (project.hire.user) {
        if (project.hire.user.company && project.hire.user.company.length > 0) {
          title = project.hire.user.company;
        }
        else {
          title = project.hire.user.firstName + " " + project.hire.user.lastName;
        }
      }
    } 

    const { total, subTotal } = this.getTotalPrice(project, fee);

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar title={title} onClickLeftButton={() => this.onBack()}/>          
            <View style={styles.container}>
              <View style={styles.contentView}>
                <Text style={styles.balanceText}>Balance: ${currentBalance}</Text>
                { this._renderOrderDetail(total) }                
                <RoundButton 
                  title="Pay" 
                  theme="gradient" 
                  style={{width: '100%', marginTop: 20}} 
                  onPress={() => this.onPay()} 
                />

                { 
                  (currentBalance < total) && 
                  <Text style={styles.descriptionText}>Your current balance is not enough to make this payment. Tap on PAY to make a deposit.</Text>
                }
              </View>
            </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> } 
      </View>
    );
  }

  ////////////////////////////////////////////////////////////////////////
  //////////////////////////// Order Detail //////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  _renderOrderDetail(total) {
    const { fee } = this.props;
    const { project } = this.state;
    const projectId = (project && project._id) ? project._id : "";
    const title = (project && project.title) ? project.title : "";
    const createdAt = (project && project.hire && project.hire.createdAt) ? Moment(project.hire.createdAt).format(DATE_TIME_FORMAT) : "";
    const price = (project && project.hire && project.hire.price) ? project.hire.price : "";
    const feePrice = price * (fee / 100);
    const duration = (project && project.hire && project.hire.duration) ? project.hire.duration : 0;
    const payType = (project && project.payType) ? project.payType : null;

    var payTypeLabel = "";
    var payTypeUnit = "";
    var durationUnit = "";

    if (payType) {
      if (payType === PAY_TYPE.FIXED) {
        payTypeLabel = "Price: ";
        if (duration > 1) {
          durationUnit = "Days";
        } 
        else {
          durationUnit = "Day";
        }        
      }
      else {
        payTypeLabel = "Hourly Rate: ";
        payTypeUnit = "/hr";
        if (duration > 1) {
          durationUnit = "Hours";
        } 
        else {
          durationUnit = "Hour";
        }        
      }
    }


    return (
      <View style={styles.contractContainer}>
        <View style={styles.infoCell}>
          <Text style={styles.labelText}>Contract ID: </Text>
          <Text style={styles.valueText}>{projectId}</Text>
        </View>

        <View style={styles.infoCell}>
          <Text style={styles.labelText}>Contract Title: </Text>
          <Text style={styles.valueText}>{title}</Text>
        </View>

        <View style={styles.infoCell}>
          <Text style={styles.labelText}>Contract Started: </Text>
          <Text style={styles.valueText}>{createdAt}</Text>
        </View>

        <View style={styles.infoCell}>
          <Text style={styles.labelText}>Duration: </Text>
          <Text style={styles.valueText}>{duration} {durationUnit}</Text>
        </View>

        <View style={styles.infoCell}>
          <Text style={styles.labelText}>{payTypeLabel}</Text>
          <Text style={styles.valueText}>${price}{payTypeUnit}</Text>
        </View>

        <View style={styles.infoCell}>
          <Text style={styles.labelText}>Service Fee:</Text>
          <Text style={styles.valueText}>${feePrice}{payTypeUnit} ({fee}%)</Text>
        </View>

        <View style={styles.infoCell}>
          <Text style={styles.labelText}>Total: </Text>
          <Text style={styles.valueText}>${total.toFixed(2)}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    marginTop: 10,
    padding: 20,
  },
  
  balanceText: {
    marginBottom: 10,
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.appColor,
  },

  balanceValueText: {
    fontFamily: 'OpenSans',
    fontSize: 21,
    fontWeight: 'bold',
  },

  contractContainer: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },

  infoCell: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  labelText: {
    width: '35%',
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    fontSize: 12,
  },

  valueText: {
    width: '55%',
    fontFamily: Fonts.bold,
    color: Colors.textColor,
    fontSize: 12,
  },

  descriptionText: {
    textAlign: 'center',
    fontFamily: Fonts.italic,
    marginTop: 10,
    color: 'gray',
    fontSize: 14,
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
    fee: state.globals.fee,

    balance: state.jobs.balance,
    errorMessage: state.jobs.errorMessage,
    payJobStatus: state.jobs.payJobStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PayScreen);