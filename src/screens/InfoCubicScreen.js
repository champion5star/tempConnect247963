import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  Keyboard
} from 'react-native';

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'

import actionTypes from '../actions/actionTypes';
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import RoundTextInput from '../components/RoundTextInput'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import Messages from '../theme/Messages'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'
import Images from '../theme/Images';

class InfoCubicScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      infoCubicAccountNumber: null,
      infoCubicUsername: null,
    }    
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({
      infoCubicAccountNumber: currentUser.infoCubicAccountNumber,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Update Infocubic data.
    if (prevProps.updateInfoCubicStatus != this.props.updateInfoCubicStatus) {
      if (this.props.updateInfoCubicStatus == Status.SUCCESS) {
        this.saveSuccess();
      } else if (this.props.updateInfoCubicStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onMenu() {
    Keyboard.dismiss();
    this.props.navigation.toggleDrawer();
  }

  saveSuccess() {
    this.setState({isLoading: false});
    Alert.alert(
      '',
      'Info Cubic has been changed successfully!',
      [
        {text: 'OK', onPress: () => {
          
        }},
      ],
      {cancelable: false},
    ); 
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

  onSave =()=> {
    Keyboard.dismiss();
    var isValid = true;

    var { 
      infoCubicAccountNumber, 
    } = this.state;

    if (infoCubicAccountNumber == null || infoCubicAccountNumber.length == 0) {
      this.setState({infoCubicAccountNumberError: Messages.InvalidCubicAccount});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.UPDATE_INFOCUBIC,
          data: {
            user_id: this.props.currentUser._id,
            infoCubicAccountNumber,
          }          
        });
      });
   }
  }

  render() {
    const { 
      infoCubicAccountNumber, 
      infoCubicAccountNumberError,
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar 
              title="Background Checks" 
              leftButton={"menu"}
              onClickLeftButton={() => this.onMenu()}
            />
            <View style={styles.container}>
              <KeyboardAwareScrollView>
              <View style={styles.contentView}>
                <Image source={Images.cubic_logo} style={styles.logoImage} />
                <Text style={styles.mainDescriptionText}>Please enter your account number to activate your account.</Text>
                <RoundTextInput
                  label="Account Number" 
                  type="text"
                  theme="gray"
                  style={{width: '100%'}}
                  autoCapitalize='none'
                  value={infoCubicAccountNumber} 
                  errorMessage={infoCubicAccountNumberError}
                  returnKeyType="next"                                       
                  onSubmitEditing={() => this.onSave() }
                  onChangeText={(text) => this.setState({infoCubicAccountNumber: text, infoCubicAccountNumberError: null})} 
                />
                <View style={styles.linkView}>
                  <Text style={styles.linkText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => { Linking.openURL('https://infocubic.com/temp-connect') }}>
                      <Text style={styles.linkBoldText}>Register Here</Text>
                  </TouchableOpacity>
                </View>
                <RoundButton 
                  title={"Save"}
                  theme="gradient" 
                  style={styles.saveBtn} 
                  onPress={this.onSave} 
                />
              </View>
              </KeyboardAwareScrollView>
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
    backgroundColor: 'white',
  },

  contentView: {
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
  },

  logoImage: {
    width: 300,
    height: 74,
    resizeMode: 'contain',
    marginBottom: 25,
  },

  mainDescriptionText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
    color: 'gray',
  },

  saveBtn: {
    marginTop: 20,
    width: '100%'
  },

  descriptionText: {
    marginTop: 20,
    fontFamily: Fonts.light,
    color: 'black',
    fontSize: 14,
    paddingHorizontal: 20,
  },

  linkView: {
    marginBottom: 50, 
    flexDirection: 'row',
    alignItems: 'center',
  },

  linkText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textColor,
  },

  linkBoldText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textColor,
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
    updateInfoCubicStatus: state.user.updateInfoCubicStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(InfoCubicScreen);