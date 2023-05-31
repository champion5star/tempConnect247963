import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DocumentPicker from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import Toast from 'react-native-easy-toast'

import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import RoundTextInput from '../../components/RoundTextInput'
import EditAvatar from '../../components/Provider/EditAvatar'
import Colors from '../../theme/Colors'
import Images from '../../theme/Images'
import Fonts from '../../theme/Fonts'
import Styles from '../../theme/Styles'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, ACCOUNT_TYPE } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import AddEducationDialog from '../../components/Modal/AddEducationDialog';
import AddEmploymentDialog from '../../components/Modal/AddEmploymentDialog';
import EducationCell from '../../components/Cells/EducationCell';
import EmploymentCell from '../../components/Cells/EmploymentCell';
import SubCategoryCell from '../../components/Cells/SubCategoryCell'
import { isValidEmail } from '../../functions'
import Messages from '../../theme/Messages'

class ProviderEditProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountType: ACCOUNT_TYPE.PERSONAL,
      id: '',
      avatar: '',
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      locationText: '',
      title: '',
      overview: '',
      hourlyRate: '',
      skills: null,
      categories: [],
      educations: [],
      employments: [],
      resume: null,
      removeResume: false,
      lat: 0,
      lng: 0,
      socialType: null,

      companyError: '',
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      locationError: '',
      titleError: '',
      overviewError: '',
      categoryError: null,
      hourlyRateError: '',
      skillsError: null,

      isAddEducationDialog: false,
      isAddEmploymentDialog: false,
      isLoading: false,
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({
      accountType: (currentUser.company && currentUser.company.length > 0) ? ACCOUNT_TYPE.COMPANY : ACCOUNT_TYPE.PERSONAL,
      id: currentUser._id,
      avatar: currentUser.avatar,
      company: currentUser.company,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      location: currentUser.location,
      locationText: currentUser.location,
      title: currentUser.title,
      overview: currentUser.overview,
      hourlyRate: currentUser.hourlyRate,
      skills: currentUser.skills ? currentUser.skills : [],
      categories: currentUser.categories ? currentUser.categories : [],
      educations: currentUser.educations ? currentUser.educations : [],
      employments: currentUser.employments ? currentUser.employments : [],
      resume: currentUser.resume ? currentUser.resume : null,
      lat: (currentUser.geolocation && currentUser.geolocation.coordinates) ? currentUser.geolocation.coordinates[1] : 0,
      lng: (currentUser.geolocation && currentUser.geolocation.coordinates) ? currentUser.geolocation.coordinates[0] : 0,
      socialType: currentUser.socialType,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Update Profile.
    if (prevProps.updateProviderStatus != this.props.updateProviderStatus) {
      if (this.props.updateProviderStatus == Status.SUCCESS) {
        this.setState({ isLoading: false });
        this.toast.show("Profile has been updated successfully!", TOAST_SHOW_TIME);
      } 
      else if (this.props.updateProviderStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        this.updateProfile(this.props.geoData);  
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
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

  onBack() {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  }

  onMakeChanges() {
    Keyboard.dismiss();
    var isValid = true;

    const {
      accountType,
      company,
      firstName,
      lastName,
      email,
      phone,
      location,
      title,
      overview,
      hourlyRate,
      skills,
      categories,
    } = this.state;

    if (accountType == ACCOUNT_TYPE.COMPANY) {
      // Company.
      if (company == null || company.length == 0) {
        this.setState({ companyError: Messages.InvalidCompany });
        isValid = false;
      }
    }
    else {
      // First Name.
      if (firstName == null || firstName.length == 0) {
        this.setState({ firstNameError: Messages.InvalidFirstname });
        isValid = false;
      }

      // Last Name.
      if (lastName == null || lastName.length == 0) {
        this.setState({ lastNameError: Messages.InvalidLastname });
        isValid = false;
      }
    }

    // Email.
    if (email == null || email.length == 0 || !isValidEmail(email)) {
      this.setState({ emailError: Messages.InvalidEmail });
      isValid = false;
    }

    // Phone.
    if (phone == null || phone.length == 0) {
      this.setState({ phoneError: Messages.InvalidPhone });
      isValid = false;
    }

    // Location.
    if (location == null || location.length == 0) {
      this.setState({ locationError: Messages.InvalidLocation });
      isValid = false;
    }

    // Title.
    if (title == null || title.length == 0) {
      this.setState({ titleError: Messages.InvalidTitle });
      isValid = false;
    }

    // Overview.
    if (overview == null || overview.length == 0) {
      this.setState({ overviewError: Messages.InvalidOverview });
      isValid = false;
    }

    // Hourly Rate.
    if (hourlyRate === null || hourlyRate === "" || isNaN(hourlyRate) || parseFloat(hourlyRate) <= 0) {
      this.setState({ hourlyRateError: Messages.InvalidHourlyRate });
      isValid = false;
    }

    // Skills.
    if (!(skills && skills.length > 0)) {
      isValid = false;
      this.setState({ skillsError: Messages.InvalidSkills });
    }

    // Category.
    if (!(categories && categories.length > 0)) {
      this.setState({ categoryError: Messages.InvalidCategory });
      return;
    }

    if (isValid) {
      this.setState({ isLoading: true }, () => {
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          data: {
            address: location,
            page: 'ProviderEditProfile',
          }
        });
      });
    }
  }

  updateProfile(geoData) {
    const { street_number, route, city, state, county, country, zipcode, lat, lng, page } = geoData;
    if (page == "ProviderEditProfile") {
      const {
        avatarFile,
        id,
        company,
        firstName,
        lastName,
        email,
        phone,
        location,
        title,
        overview,
        hourlyRate,
        skills,
        categories,
        educations,
        employments,
        resume,
      } = this.state;

      const user = {
        id,
        company,
        firstName,
        lastName,
        email,
        phone,
        location,
        avatarFile,
        title,
        overview,
        hourlyRate,
        skills,
        categories,
        educations,
        employments,
        resume,
        street_number, 
        route, 
        city, 
        state, 
        county, 
        country, 
        zipcode,
        lat,
        lng,
      };
  
      this.props.dispatch({
        type: actionTypes.UPDATE_PROVIDER,
        user: user,
      });
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
      this.setState({
        avatar: response.assets[0].uri,
        avatarFile: response.assets[0]
      });
    }
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
      isAddEducationDialog,
      isAddEmploymentDialog,

      avatar,
      company,
      firstName,
      lastName,
      email,
      phone,
      location,
      locationText,

      title,
      overview,
      hourlyRate,
      skills,
      educations,
      employments,
      socialType,

      companyError,
      firstNameError,
      lastNameError,
      emailError,
      phoneError,
      locationError,
      titleError,
      overviewError,
      hourlyRateError,
      skillsError,
      categoryError,
    } = this.state;

    var list = [];
    const { categories } = this.props;
    categories.forEach(c => {
      if (c.subCategories && c.subCategories.length > 0) {
        c.subCategories.forEach(item => {
          if (this.state.categories.indexOf(item.name) >= 0) {
            list.push(item);
          }
        });
      }
    });

    return (
      <View style={{ flex: 1 }}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar title="EDIT PROFILE" align="left" onClickLeftButton={() => this.onBack()} />
            <View style={styles.container}>
              <KeyboardAwareScrollView>
                <View>
                  <View style={styles.profileBox}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <EditAvatar avatar={this.state.avatar} style={{ marginTop: -80 }} onTakePhoto={() => this.onTakePicture()} />
                    </View>
                    {
                      (company && company.length > 0)
                      ? <RoundTextInput
                        label="Company"
                        type="text"
                        theme="gray"
                        maxLength={20}
                        placeholderTextColor={Colors.placeholderTextColor}
                        value={company}
                        errorMessage={companyError}
                        returnKeyType="next"
                        style={{marginTop: 30}}
                        onSubmitEditing={() => { this.emailInput.focus() }}
                        onChangeText={(text) => this.setState({ company: text, companyError: null })}
                      />
                      :  <View style={[styles.rowView, { marginTop: 30 }]}>
                        <RoundTextInput
                          label="First name"
                          type="text"
                          theme="gray"
                          maxLength={20}
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={firstName}
                          errorMessage={firstNameError}
                          style={{ width: '45%' }}
                          returnKeyType="next"
                          onSubmitEditing={() => { this.lastNameInput.focus() }}
                          onChangeText={(text) => this.setState({ firstName: text, firstNameError: null })}
                        />

                        <RoundTextInput
                          label="Last name"
                          type="text"
                          theme="gray"
                          maxLength={20}
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={lastName}
                          errorMessage={lastNameError}
                          style={{ width: '45%' }}
                          returnKeyType="next"
                          onRefInput={(input) => { this.lastNameInput = input }}
                          onSubmitEditing={() => { 
                            if (socialType == null || socialType == "") {
                              this.emailInput.focus()                             
                            }
                            else {
                              this.phoneInput.focus()
                            }
                          }}
                          onChangeText={(text) => this.setState({ lastName: text, lastNameError: null })}
                        />
                      </View>
                    }

                    <RoundTextInput
                      label="Email Address"
                      type="email"
                      theme="gray"
                      editable={(socialType == null || socialType == "") ? true: false}
                      maxLength={30}
                      placeholderTextColor={Colors.placeholderTextColor}
                      value={email}
                      errorMessage={emailError}
                      returnKeyType="next"
                      onRefInput={(input) => { this.emailInput = input }}
                      onSubmitEditing={() => { this.phoneInput.focus() }}
                      onChangeText={(text) => this.setState({ email: text, emailError: null })} />

                    <RoundTextInput
                      label="Phone Number"
                      type="phone"
                      theme="gray"
                      maxLength={20}
                      placeholderTextColor={Colors.placeholderTextColor}
                      value={phone}
                      errorMessage={phoneError}
                      returnKeyType="next"
                      onRefInput={(input) => { this.phoneInput = input }}
                      onSubmitEditing={() => { this.locationInput.focus() }}
                      onChangeText={(text) => this.setState({ phone: text, phoneError: null })} />

                    <RoundTextInput
                      label="Address"
                      type="address"
                      theme="gray"
                      placeholderTextColor={Colors.placeholderTextColor}
                      value={locationText}
                      returnKeyType="next"
                      errorMessage={locationError}
                      onSelectAddress={(address) => this.setState({ location: address, locationText: address })}
                      onRefInput={(input) => { this.locationInput = input }}
                      onChangeText={this.onChangeLocation}
                    />

                    <RoundTextInput
                      label="Write a professional title"
                      type="text"
                      theme="gray"
                      value={title}
                      maxLength={50}
                      errorMessage={titleError}
                      onRefInput={(input) => { this.titleInput = input }}
                      onSubmitEditing={() => { this.overviewInput.focus() }}
                      onChangeText={(text) => this.setState({ title: text, titleError: null })}
                    />

                    <RoundTextInput
                      label="Write a professional overview"
                      type="textview"
                      theme="gray"
                      value={overview}
                      errorMessage={overviewError}
                      onRefInput={(input) => { this.overviewInput = input }}
                      onChangeText={(text) => this.setState({ overview: text, overviewError: null })} />

                    <RoundTextInput
                      label="Set your hourly rate"
                      type="number"
                      theme="gray"
                      maxLength={10}
                      value={hourlyRate}
                      errorMessage={hourlyRateError}
                      onRefInput={(input) => { this.hourlyRateInput = input }}
                      onChangeText={(text) => this.setState({ hourlyRate: text, hourlyRateError: null })}
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
                    
                    { this._renderCategorySection() }
                    { this._renderEducationSection() }
                    { this._renderEmploymentSection() }
                    { this._renderResumeSection() }

                  </View>
                  <View style={styles.centerView}>
                    <RoundButton
                      title="Save Changes"
                      theme="gradient"
                      style={styles.blueButton}
                      onPress={() => this.onMakeChanges()} />
                  </View>
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
        <Toast ref={ref => (this.toast = ref)}/>
        {
          this.state.isLoading
            ? <LoadingOverlay />
            : null
        }
      </View>
    );
  }

  onChangeLocation =(text)=> {
    if (text == null || text == "") {
      this.setState({ location: '', locationText: '', locationError: null })
    }
    else {
      this.setState({ locationText: text, locationError: null })
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// Category //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderCategorySection() {
    const { categoryError } = this.state;

    var list = [];
    const { categories } = this.props;
    categories.forEach(c => {
      if (c.subCategories && c.subCategories.length > 0) {
        c.subCategories.forEach(item => {
          if (this.state.categories.indexOf(item.name) >= 0) {
            list.push(item);
          }
        });
      }
    });
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.rowView}>
          <Text style={styles.titleText}>Category</Text>
          <TouchableOpacity onPress={this.onEditCategory}>
            <Image source={Images.circle_edit_icon} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        {
          // Categories.
          (list.length > 0) &&
          <ScrollView style={{ marginTop: 10, paddingBottom: 10 }} horizontal={true}>
            {
              list.map((item, index) => {
                return (
                  <SubCategoryCell
                    key={index.toString()}
                    category={item}
                    isTouchable={false}
                    selected={false}
                  />
                )
              })
            }
          </ScrollView>
        }
        {categoryError && <Text style={Styles.formErrorText}>{categoryError}</Text>}
      </View>
    )
  }

  onEditCategory = () => {
    this.props.navigation.navigate(
      "CategorySelect",
      {
        categories: this.state.categories,
        page: "ProviderEditProfile",
        onSaveCategory: this.onSaveCategory
      });
  }

  onSaveCategory = (categories) => {
    this.setState({ categories: categories, categoryError: null });
  }

  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Education //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderEducationSection() {
    const { educations } = this.state;
    return (
      <View style={styles.section}>
        <View style={styles.rowView}>
          <Text style={styles.titleText}>Education</Text>
          <TouchableOpacity onPress={this.onAddEducation}>
            <Image source={Images.circle_plus_icon} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        {
          educations && educations.length > 0
            ? <ScrollView style={{ marginTop: 0, padding: 7, marginTop: 10 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                educations.map((item, index) => {
                  return (
                    <EducationCell key={index} index={index} data={item} onDelete={this.onRemoveEducation} />
                  )
                })
              }
            </ScrollView>
            : <Text style={styles.descriptionText}>Tell us about your education history.</Text>
        }
      </View>
    )
  }

  // Education.
  onAddEducation = () => {
    this.setState({ isAddEducationDialog: true });
  }

  onCloseAddEducationDialog = () => {
    this.setState({ isAddEducationDialog: false });
  }

  onAddEducationDialog = (item) => {
    const educations = this.state.educations;
    educations.push(item);
    this.setState({ isAddEducationDialog: false, educations: educations });
  }

  onRemoveEducation = (index) => {
    const educations = this.state.educations;
    educations.splice(index, 1);
    this.setState({ educations: educations });
  }

  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Employment /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderEmploymentSection() {
    const { employments } = this.state;
    return (
      <View style={styles.section}>
        <View style={styles.rowView}>
          <Text style={styles.titleText}>Employment History</Text>
          <TouchableOpacity onPress={this.onAddEmployment}>
            <Image source={Images.circle_plus_icon} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        {
          employments && employments.length > 0
            ? <ScrollView style={{ marginTop: 0, padding: 7, marginTop: 10 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                employments.map((item, index) => {
                  return (
                    <EmploymentCell key={index} index={index} data={item} onDelete={this.onRemoveEmployment} />
                  )
                })
              }
            </ScrollView>
            : <Text style={styles.descriptionText}>Tell us about your employment history.</Text>
        }
      </View>
    )
  }

  // Employment
  onAddEmployment = () => {
    this.setState({ isAddEmploymentDialog: true });
  }

  onCloseAddEmploymentDialog = () => {
    this.setState({ isAddEmploymentDialog: false });
  }

  onAddEmploymentDialog = (item) => {
    const employments = this.state.employments;
    employments.push(item);
    this.setState({ isAddEmploymentDialog: false, employments: employments });
  }

  onRemoveEmployment = (index) => {
    const employments = this.state.employments;
    employments.splice(index, 1);
    this.setState({ employments: employments });
  }

  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// Resume ////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderResumeSection() {
    const { resume } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.titleText}>Resume</Text>
        <Text style={styles.descriptionText}>Please upload your resume. We will use to find the right opportunities for you.</Text>
        <TouchableOpacity onPress={this.selectResume}>
          {
            (resume && resume.name && resume.name.length > 0) 
            ? <View style={styles.resumeBox}>
              <Image source={Images.icon_resume_uploaded} style={styles.uploadedResumeIcon}/>
              <Text style={styles.uploadedResumeText}>{resume.name}</Text>
              <TouchableOpacity style={styles.removeBtn} onPress={this.onRemoveResume}>
                <Image source={Images.red_close_button} style={styles.removeIcon}/>
              </TouchableOpacity>
            </View>
            : <View style={styles.resumeBox}>
              <Image source={Images.icon_resume} style={styles.resumeIcon}/>
              <Text style={styles.uploadResumeText}>Upload Resume</Text>
            </View>
          }
        </TouchableOpacity>
      </View>
    )
  }

  selectResume=async()=> {
    const { resume } = this.state;
    if (resume == null || resume.name == null) {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf],
        });
        this.setState({resume: res, removeResume: false});
  
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }      
    }
    else {
      // Open Resume.
      var name = "";
      var url = null;
      if (resume.url) {
        name = resume.name;
        url = resume.url;
      }
      else if (resume.uri) {
        name = resume.name;
        url = resume.uri;
      }

      if (url) {
        this.props.navigation.navigate('PDFViewer', {url, name});
      }
    }
  }

  onRemoveResume=()=> {
    this.setState({resume: null, removeResume: true});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 60,
  },

  blueButton: {
    width: '90%'
  },

  profileBox: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 86,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
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
    fontSize: 14,
    marginTop: 4,
  },

  plusIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  section: {
    marginTop: 20,
  },

  resumeBox: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  resumeIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    opacity: 0.5,
  },

  uploadResumeText: {
    fontFamily: Fonts.regular,
    marginTop: 10,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
  },

  uploadedResumeIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  uploadedResumeText: {
    fontFamily: Fonts.regular,
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },

  removeIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  removeBtn: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    categories: state.globals.categories,
    years: state.globals.years,

    currentUser: state.user.currentUser,
    errorMessage: state.user.errorMessage,
    updateProviderStatus: state.user.updateProviderStatus,

    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderEditProfileScreen);