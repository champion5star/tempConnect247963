import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../components/BackgroundImage'
import Toast from 'react-native-easy-toast'
import TopNavBar from '../components/TopNavBar'
import LoadingOverlay from '../components/LoadingOverlay'
import ThankYouDialog from '../components/Modal/ThankYouDialog'
import { TOAST_SHOW_TIME, Status, BENEFIT_TYPE } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import Fonts from '../theme/Fonts';
import Images from '../theme/Images';
import Messages from '../theme/Messages'
import Colors from '../theme/Colors'

class BenefitsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isShowResultDialog: false,
    }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sendBenefitStatus != this.props.sendBenefitStatus) {
      if (this.props.sendBenefitStatus == Status.SUCCESS) {
        this.setState({isShowResultDialog: true, isLoading: false});
      } 
      else if (this.props.sendBenefitStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onAction=(type)=> {
    const { currentUser } = this.props;
    const company = (currentUser && currentUser.company) ? currentUser.company : "";
    const firstName = (currentUser && currentUser.firstName) ? currentUser.firstName : "";
    const lastName = (currentUser && currentUser.lastName) ? currentUser.lastName : "";

    var name = "";
    if (company && company.length > 0) {
      name = company;
    }
    else {
      name = firstName + " " + lastName;    
    }
    

    const email = (currentUser && currentUser.email) ? currentUser.email : "";
    const phone = (currentUser && currentUser.phone) ? currentUser.phone : "";

    this.setState({isLoading: true}, () => { 
      this.props.dispatch({
        type: actionTypes.SEND_BENEFIT,
        data: {
          type, 
          name, 
          email, 
          phone
        },
      });
    });  
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onFailure(message) {
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
    this.setState({isLoading: false});
  }

  render() {
    const { isShowResultDialog } = this.state;
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
                <TopNavBar 
                title="Benefits" 
                leftButton="menu" 
                onClickLeftButton={() => this.onMenu()}
                />
                <View style={styles.container}>
                  <ScrollView>
                    <View style={styles.contentView}>
                      <View style={styles.section}>
                        <Image source={Images.icon_benefit_health}  style={[styles.sectionIcon, styles.sectionHealthIcon]}/>
                        <Text style={[styles.sectionTitle, {color: '#ff3f40'}]}>Health Insurance</Text>
                        <Text style={styles.sectionDescription}>
                          Connect with a Health Insurance specialist to explore individual and group insurance options.
                        </Text>
                        <View style={styles.separatorLine}/>
                        <TouchableOpacity style={[styles.btn, styles.btnHealth]} onPress={() => this.onAction(BENEFIT_TYPE.HEALTH_INSURANCE)} >
                          <Text style={styles.btnText}>Click Here</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.section}>
                        <Image source={Images.icon_benefit_free_financial}  style={[styles.sectionIcon, styles.sectionFreeIcon]}/>
                        <Text style={[styles.sectionTitle, {color: '#5eaf08'}]}>Free Financial Review</Text>
                        <Text style={styles.sectionDescription}>
                          How to make your money thrive.
                        </Text>
                        <View style={styles.separatorLine}/>
                        <TouchableOpacity style={[styles.btn, styles.btnFree]} onPress={() => this.onAction(BENEFIT_TYPE.FREE_FINANCIAL_REVIEW)} >
                          <Text style={styles.btnText}>Click Here</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <ThankYouDialog isVisible={isShowResultDialog} onClose={() => this.setState({isShowResultDialog: false})} />
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
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    padding: 25,
  },

  section: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },

  sectionIcon: {
    
  },

  sectionHealthIcon: {
    width: 100,
    height: 94,
    resizeMode: 'contain',
  },

  sectionFreeIcon: {
    width: 100,
    height: 74,
    resizeMode: 'contain',
  },

  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
  },

  sectionDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },

  separatorLine: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    marginVertical: 15,
  },

  btn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
  },

  btnHealth: {
    backgroundColor: '#ff3f40',
  },

  btnFree: {
    backgroundColor: '#5eaf08',
  },

  btnText: {
    color: 'white',
    fontSize: 18,
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
    textAlign: 'center',
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
    sendBenefitStatus: state.user.sendBenefitStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(BenefitsScreen);