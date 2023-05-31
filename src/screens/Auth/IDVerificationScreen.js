import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'

import BackgroundImage from '../../components/BackgroundImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import RoundTextInput from '../../components/RoundTextInput'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import ImagePickerSlider from '../../components/ImagePickerSlider'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { makeRandomText } from '../../functions';
import actionTypes from '../../actions/actionTypes';
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Fonts from '../../theme/Fonts'

class IDVerificationScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      idCards: [],      
      idType: '',
      idNumber: '',
      otherInformation: '',

      idTypeError: '',
      idNumberError: '',
      otherInformationError: '',
    }

    this.idTypes = [
      {
        id: 1,
        label: "Passport",
        value: "Passport"
      },
      {
        id: 2,
        label: "National ID",
        value: "National ID"
      },
      {
        id: 3,
        label: "Citizen",
        value: "Citizen"
      },
      {
        id: 4,
        label: "Driver",
        value: "Driver"
      }
    ];
  }


  onBack() {
    this.props.navigation.goBack();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.registerProviderStatus != this.props.registerProviderStatus) {
      if (this.props.registerProviderStatus == Status.SUCCESS) {
        this.registerProviderSuccess();
      } else if (this.props.registerProviderStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onMoveHome() {
    Alert.alert(
      '',
      Messages.SuccessSignup,
      [
        {text: 'OK', onPress: () => {
          this.setState({isLoading: false}, () => { 
            this.props.navigation.popToTop();
          });           
        }},
      ],
      {cancelable: false},
    );    
  }

  onNext() {
    Keyboard.dismiss();

    const { idCards, idType, idNumber, otherInformation } = this.state;

    var isValid = true;
    if (idCards == null || idCards.length <= 0) {
      let message = Messages.InvalidIDCard;
      this.toast.show(message, TOAST_SHOW_TIME);
      isValid = false;
    }

    if (idType == null || idType.length <= 0) {
      this.setState({idTypeError: Messages.InvalidIDType});
      isValid = false;
    }

    if (idNumber == null || idNumber.length <= 0) {
      this.setState({idNumberError: Messages.InvalidIDNumber});
      isValid = false;
    }

    if (isValid) {
      if (this.props.route.params && this.props.route.params.user) {
        var { user } = this.props.route.params;
        user.idCards = idCards;
        user.idType = idType;
        user.idNumber = idNumber;
        user.idOtherInformation = otherInformation;
        user.player_id = this.props.playerId;

        this.setState({isLoading: true}, () => { 
          this.props.dispatch({
            type: actionTypes.REGISTER_PROVIDER,
            user: user
          });
        });    
      }
    }    
  }

  registerProviderSuccess() {
    this.setState({isLoading: false});
    this.onMoveHome();
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

  onTakePicture() {
    this.ActionSheet.show();
  }

  async onSelectMedia(index) {
    try {
      if (Platform.OS == "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "App Camera Permission",
                message:"App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.openImagePicker(index);
          }
          else {
            console.log("Camera permission denied");
          }
      }
      else {
        this.openImagePicker(index);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openImagePicker(index) {
    const options = {
      mediaType: 'photo',
    };

    if (index == 0) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          this.addPhoto(response);
        }
      });
    }
    else if (index == 1) {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          this.addPhoto(response);
        }
      });
    }
  }

  async addPhoto(response) {
    if (response && response.assets && response.assets.length > 0) {
      const file = response.assets[0];
      var { idCards } = this.state;

      var fileName = "";
      if (file.fileName && file.fileName.length > 0) {
        fileName = file.fileName;
      } else {
        fileName = makeRandomText(20);
      }
      
      idCards.push({
        fileName: fileName,
        type: file.type,
        uri: file.uri
      });
      
      this.setState({
        idCards,
      });
    }
  }

  onRemovePhoto(index) {
    this.state.idCards.splice(index, 1);
    this.setState({
      idCards: this.state.idCards,
    });
  } 

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar title="ID verification" theme="empty" onClickLeftButton={() => this.onBack()}/>          
            <View style={styles.container}>
              <Text style={styles.descriptionText}>For the safety of our users, we must ID verify each provider</Text>
              <KeyboardAwareScrollView>
                <View style={styles.contentView}>
                  <ImagePickerSlider
                    placeholderImage={Images.photo_icon}
                    placeholderText="Take Picture"
                    photos={this.state.idCards} 
                    errorMessage={this.state.idCardsError}
                    onTakePhoto={() => this.onTakePicture()} 
                    onRemovePhoto={(index) => this.onRemovePhoto(index)}
                  />

                  <View style={styles.rowView}>
                    <RoundTextInput
                      placeholder="ID Type" 
                      type="dropdown"
                      theme="gray"
                      data={this.idTypes}
                      value={this.state.idType} 
                      errorMessage={this.state.idTypeError}
                      style={{width: '47%'}}
                      onSubmitEditing={(input) => { this.idNumberInput.focus() }}
                      onChangeText={(text) => this.setState({idType: text, idTypeError: null})} />

                    <RoundTextInput
                    placeholder="ID Number" 
                    type="text"
                    theme="gray"
                    value={this.state.idNumber} 
                    errorMessage={this.state.idNumberError}
                    style={{width: '47%'}}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.otherInformationInput.focus() }}
                    onRefInput={(input) => { this.idNumberInput = input }}
                    onChangeText={(text) => this.setState({idNumber: text, idNumberError: null})}  />

                  </View>       

                  <RoundTextInput
                    placeholder="Other Information" 
                    type="text"
                    theme="gray"
                    value={this.state.otherInformation} 
                    returnKeyType="done"
                    onRefInput={(input) => { this.otherInformationInput = input }}
                    onChangeText={(text) => this.setState({otherInformation: text, errorMessage: null})} />
                </View>

                <View style={styles.viewBottom}>
                  <RoundButton 
                    title="Done" 
                    theme="gradient" 
                    style={styles.nextButton} 
                    onPress={() => this.onNext()} />
                </View>
              </KeyboardAwareScrollView>
            </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Select Image'}
          options={['Camera', 'Photo Library', 'Cancel']}
          cancelButtonIndex={2}
          onPress={(index) => this.onSelectMedia(index)}
        />
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
    paddingTop: 20,
    paddingLeft: 35, 
    paddingRight: 35, 
  },

  viewBottom: {
    marginTop: 80,
    width: '100%',
  },

  nextButton: {
    marginLeft: 30,
    marginRight: 30,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  descriptionText: {
    paddingTop: 40,
    color: 'black',
    textAlign: 'center',
    fontFamily: Fonts.light,
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
    playerId: state.user.playerId,
    registerProviderStatus: state.user.registerProviderStatus
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(IDVerificationScreen);