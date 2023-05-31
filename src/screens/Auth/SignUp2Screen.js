import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Keyboard,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'

import * as Storage from '../../services/Storage'
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import EditAvatar from '../../components/Provider/EditAvatar'
import RoundTextInput from '../../components/RoundTextInput'
import RoundButton from '../../components/RoundButton'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import AddEducationDialog from '../../components/Modal/AddEducationDialog';
import AddEmploymentDialog from '../../components/Modal/AddEmploymentDialog';
import EducationCell from '../../components/Cells/EducationCell';
import EmploymentCell from '../../components/Cells/EmploymentCell';
import { makeRandomText } from '../../functions';
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'
import Styles from '../../theme/Styles'

class SignUp2Screen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: null,
      title: '',
      overview: '',
      hourlyRate: '',      
      skills: null,      
      educations: [],
      employments: [],
      socialType: null,

      titleError: '',
      overviewError: '',
      hourlyRateError: '',
      skillsError: null,
      errorMessage: null,

      isAddEducationDialog: false,
      isAddEmploymentDialog: false,
    }
  }

  async componentDidMount() {
    const user = await Storage.SIGNUP_USER.get();
    if (user) {
      this.setState({
        avatar: user.avatar ? user.avatar : '',
        title: user.title ? user.title : '',
        overview: user.overview ? user.overview : '',
        hourlyRate: user.hourlyRate ? user.hourlyRate : '',
        skills: user.skills ? user.skills : [],
        educations: user.educations ? user.educations : [],
        employments: user.employments ? user.employments : [],
        socialType: user.socialType,
      });
    }
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

  onFailure(message) {
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
    this.setState({ isLoading: false });
    
  }

  registerProviderSuccess() {
    this.setState({isLoading: false});
    Storage.SIGNUP_USER.remove();
    this.onMoveHome();
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

  onBack() {
    const {
      avatar, 
      title, 
      overview, 
      hourlyRate, 
      skills, 
      educations, 
      employments
    } = this.state;

    if (this.props.route.params && this.props.route.params.user) {
      var { user } = this.props.route.params;
      user.avatar = avatar;
      user.title = title;
      user.overview = overview;
      user.hourlyRate = hourlyRate;
      user.skills = skills;
      user.educations = educations;
      user.employments = employments;
      Storage.SIGNUP_USER.set(user);
    }

    this.props.navigation.goBack();
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ services: selectedItems });
  };

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
      var fileName = "";
      if (file.fileName && file.fileName.length > 0) {
        fileName = file.fileName;
      } else {
        fileName = makeRandomText(20);
      }

      this.setState({
        avatar: {
          fileName,
          type: file.type,
          uri: file.uri 
        },
        errorMessage: null
      });
    }
  }

  onContinue() {
    Keyboard.dismiss();

    // Check validate.
    var isValid = true;
    const {
      avatar, 
      title, 
      overview, 
      hourlyRate, 
      skills, 
      educations, 
      employments,
      socialType,
    } = this.state;

    // Check Avatar.
    if (socialType && socialType.length > 0) {
      if (avatar == null) {
        isValid = false;
        this.setState({errorMessage: Messages.InvalidAvatar});
      }
    }
    else {
      if (!(avatar && avatar.uri)) {
        isValid = false;
        this.setState({errorMessage: Messages.InvalidAvatar});
      }
    }

    // Title.
    if (!(title && title.length > 0)) {
      isValid = false;
      this.setState({titleError: Messages.InvalidTitle});
    }

    // Overview.
    if (!(overview && overview.length > 0)) {
      isValid = false;
      this.setState({overviewError: Messages.InvalidOverview});
    }

    // hourly rate.
    if (hourlyRate === null || hourlyRate === "" || isNaN(hourlyRate) || parseFloat(hourlyRate) <= 0) {
      isValid = false;
      this.setState({hourlyRateError: Messages.InvalidHourlyRate});
    }

    // skills.
    if (!(skills && skills.length > 0)) {
      isValid = false;
      this.setState({skillsError: Messages.InvalidSkills});
    }

    if (isValid) {
      if (this.props.route.params && this.props.route.params.user) {
        var { user } = this.props.route.params;
        user.avatar = avatar;
        user.title = title;
        user.overview = overview;
        user.hourlyRate = hourlyRate;
        user.skills = skills;
        user.educations = educations;
        user.employments = employments;

        if (isValid) {
          this.setState({isLoading: true}, () => { 
            this.props.dispatch({
              type: actionTypes.REGISTER_PROVIDER,
              user: user
            });
          });    
        }    
      }
    }
    
  }

  // Education.
  onAddEducation=()=> {
    this.setState({ isAddEducationDialog: true });
  }

  onCloseAddEducationDialog=()=> {
    this.setState({ isAddEducationDialog: false });
  }

  onAddEducationDialog=(item)=> {
    const { educations } = this.state;
    educations.push(item);
    this.setState({ isAddEducationDialog: false, educations: educations });
  }

  // Employment
  onAddEmployment=()=> {
    this.setState({ isAddEmploymentDialog: true });
  }

  onCloseAddEmploymentDialog=()=> {
    this.setState({ isAddEmploymentDialog: false });
  }

  onAddEmploymentDialog=(item)=> {
    const employments = this.state.employments;
    employments.push(item);
    this.setState({ isAddEmploymentDialog: false, employments: employments });
  }

  onRemoveEducation=(index)=> {
    const educations = this.state.educations;
    educations.splice(index, 1);
    this.setState({educations: educations});
  }

  onRemoveEmployment=(index)=> {
    const employments = this.state.employments;
    employments.splice(index, 1);
    this.setState({employments: employments});
  }

  onChangeSkills(tags) {
    var list = [];
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        if (tag && tag.trim().length > 0) {
          list.push(tag);
        }
      });
    }

    this.setState({skills: list, skillsError: ''});
  }

  render() {
    const { years } = this.props;
    const { 
      avatar,
      isAddEducationDialog, 
      isAddEmploymentDialog, 
      title,
      overview,
      hourlyRate,
      skills,
      educations, 
      employments,
      socialType,
      
      errorMessage,
      titleError,
      overviewError,
      hourlyRateError,
      skillsError,
    } = this.state;
    
    var avatarImage = null;
    if (avatar) {
      if (avatar.uri) {
        avatarImage = (avatar && avatar.uri) ? avatar.uri : null;
      }
      else {
        avatarImage = avatar;
      }
    }

    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar title="Service Details" theme="empty" onClickLeftButton={() => this.onBack()}/>          
            <View style={styles.container}>
              <KeyboardAwareScrollView enableOnAndroid={true}>
                <View style={styles.contentView}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                    <EditAvatar avatar={avatarImage} onTakePhoto={() => this.onTakePicture()} />
                  </View> 

                  <RoundTextInput
                    label="Write a professional title"
                    type="text"
                    theme="gray"
                    value={title} 
                    errorMessage={titleError}
                    returnKeyType="next"
                    onRefInput={(input) => { this.titleInput = input }}
                    onSubmitEditing={() => { this.overviewInput.focus() }}
                    onChangeText={(text) => this.setState({title: text, titleError: null})} 
                  />

                  <RoundTextInput
                    label="Write a professional overview"
                    type="textview"
                    theme="gray"
                    value={overview} 
                    errorMessage={overviewError}
                    onRefInput={(input) => { this.overviewInput = input }}
                    onChangeText={(text) => this.setState({overview: text, overviewError: null})} />

                  <RoundTextInput
                    label="Set your hourly rate"
                    type="number"
                    theme="gray"
                    maxLength={10}
                    returnKeyType="next"
                    value={hourlyRate} 
                    errorMessage={hourlyRateError}
                    onRefInput={(input) => { this.hourlyRateInput = input }}
                    onChangeText={(text) => this.setState({hourlyRate: text, hourlyRateError: null})}
                  />

                  {
                    skills 
                    ? <RoundTextInput
                      label="What skills do you offer clients?"
                      type="tags"
                      theme="gray"
                      value={skills} 
                      errorMessage={skillsError}		               
                      returnKeyType="next"
                      onChangeText={(tags) => this.onChangeSkills(tags)} 
                    />
                    : null
                  }

                  <View style={{marginTop: 10}}>
                    <View style={styles.rowView}>
                      <Text style={styles.titleText}>Education</Text>
                      <TouchableOpacity onPress={this.onAddEducation}>
                        <Image source={Images.circle_plus_icon} style={styles.plusIcon}/>
                      </TouchableOpacity>
                    </View>
                    {
                      educations && educations.length > 0 
                      ? <ScrollView style={{marginTop: 0, padding: 7, marginTop: 10}} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                          educations.map((item, index) => {
                            return (
                              <EducationCell key={index} index={index} data={item} onDelete={this.onRemoveEducation}/>
                            )
                          })
                        }
                      </ScrollView>
                      :  <Text style={styles.descriptionText}>Tell us about your education history.</Text>
                    }                  
                  </View>

                  <View style={{marginTop: 20}}>
                    <View style={styles.rowView}>
                      <Text style={styles.titleText}>Employment History</Text>
                      <TouchableOpacity onPress={this.onAddEmployment}>
                        <Image source={Images.circle_plus_icon} style={styles.plusIcon}/>
                      </TouchableOpacity>
                    </View>
                    {
                      employments && employments.length > 0 
                      ? <ScrollView style={{marginTop: 0, padding: 7, marginTop: 10}} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                          employments.map((item, index) => {
                            return (
                              <EmploymentCell key={index} index={index} data={item} onDelete={this.onRemoveEmployment} />
                            )
                          })
                        }
                      </ScrollView>
                      :  <Text style={styles.descriptionText}>Tell us about your employment history.</Text>
                    }                  
                  </View>

                  <RoundButton 
                    title="Continue" 
                    theme="gradient" 
                    style={styles.continueButton} 
                    onPress={() => this.onContinue()} 
                  />
                  { errorMessage && <Text style={Styles.errorText}>{errorMessage}</Text>}
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <AddEducationDialog 
          isVisible={isAddEducationDialog}
          years={years}
          onClose={this.onCloseAddEducationDialog}
          onAddEducation={this.onAddEducationDialog}
        />

        <AddEmploymentDialog
          isVisible={isAddEmploymentDialog}
          years={years}
          onClose={this.onCloseAddEmploymentDialog}
          onAddEducation={this.onAddEmploymentDialog}
        />
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
    paddingLeft: 30, 
    paddingRight: 30, 
    paddingTop: 40,
    paddingBottom: 100,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  

  centerView: {
    width: '100%',
  },

  continueButton: {
    marginTop: 40,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  titleText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },

  descriptionText: {
    fontFamily: Fonts.thin,
    fontSize: 16,
  },

  plusIcon: {
    width: 25,
    height: 25,
  }
})


function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    years: state.globals.years,

    currentUser: state.user.currentUser,
    token: state.user.token,

    playerId: state.user.playerId,
    registerProviderStatus: state.user.registerProviderStatus,
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUp2Screen);