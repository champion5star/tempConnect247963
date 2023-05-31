import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert, AppState, Platform
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import RoundTextInput from '../../components/RoundTextInput'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import CublicSelect from '../../components/CubicSelect'
import SubCategoryCell from '../../components/Cells/SubCategoryCell'
import Ads from "../../components/Ads";
import {
  TOAST_SHOW_TIME,
  Status,
  PROJECT_TYPES,
  PAY_TYPES,
  AdsStatus,
  USER_LEVEL
} from '../../constants.js'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Fonts from '../../theme/Fonts'
import Colors from '../../theme/Colors'

class NewProjectScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      title: null,
      category: [],
      description: null,
      location: null,
      locationText: null,
      skills: null,
      type: null,
      payType: null,
      price: null,
      duration: null,
      isCheckCubic: false,
      infoCubicPackage: null,
      lat: 0,
      lng: 0,
      zipcode: null,

      titleError: null,
      categoryError: null,
      descriptionError: null,
      locationError: null,
      typeError: null,
      skillsError: null,
      payTypeError: null,
      priceError: null,
      durationError: null,
      packageError: null,

      isLoading: false,
      packages: [],
      nearbyAds: [],
      appState: AppState.currentState,
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.route.params && this.props.route.params.project) {
      const { project } = this.props.route.params;
      if (project && project._id) {
        const title = project.title ? project.title : "";
        const category = project.category ? project.category : [];
        const description = project.description ? project.description : "";
        const location = project.location ? project.location : [];
        const skills = project.skills ? project.skills : [];
        const type = project.type ? project.type : "";
        const payType = project.payType ? project.payType : "";
        const price = project.initialPrice ? project.initialPrice : "";
        const duration = project.duration ? project.duration.toString() : "";
        const isCheckCubic = project.isCheckCubic ? project.isCheckCubic : false;
        const infoCubicPackage = project.infoCubicPackage ? project.infoCubicPackage : "";

        this.setState({
          id: project._id,
          title,
          category,
          description,
          location,
          locationText: location,
          skills,
          type,
          payType,
          price,
          duration,
          isCheckCubic,
          infoCubicPackage
        });
      }
    }
    else {
      this.setState({skills: []});
    }

    this.getPackages();
  }

  _handleAppStateChange = (nextAppState) => {
    const { currentUser } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : 0;
    if( level == 0 ){
      if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
      ) {
        if( this.props.adsPlaying === AdsStatus.CLICK ) {
          this.props.dispatch({
            type: actionTypes.CLOSE_ADS,
          });
        }
      }
      this.setState({appState: nextAppState});
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geolocation by locaiton.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { lat, lng, zipcode, page } = this.props.geoData;
        if (page == "NewProject") {
          this.setState({
            lat,
            lng,
            zipcode,
          }, () => {
            this.onPostJob();
          });
        }
      } else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }
    }

    // Create.
    if (prevProps.createJobStatus != this.props.createJobStatus) {
      if (this.props.createJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false});

        // Update Current User For Credit.
        if (this.props.selectedUser) {
          this.props.dispatch({
            type: actionTypes.SET_CURRENT_USER,
            payload: this.props.selectedUser
          });
        }
        this.showResultMessage(Messages.NewProjectCreated);
      }
      else if (this.props.createJobStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    // Update.
    if (prevProps.updateJobStatus != this.props.updateJobStatus) {
      if (this.props.updateJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showResultMessage(Messages.ProjectUpdated);
      } else if (this.props.updateJobStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    // Delete.
    if (prevProps.deleteProjectStatus != this.props.deleteProjectStatus) {
      if (this.props.deleteProjectStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showResultMessage(Messages.SuccessDeleteProject);
      } else if (this.props.deleteProjectStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    // Get Infocubic Packages.
    if (prevProps.getInfoCubicPackagesStatus != this.props.getInfoCubicPackagesStatus) {
      if (this.props.getInfoCubicPackagesStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        if (this.props.packages) {
          this.setState({packages: this.props.packages});
        }
      } else if (this.props.getInfoCubicPackagesStatus == Status.FAILURE) {
        this.setState({isLoading: false});
      }
    }
  }

  getPackages() {
    const { currentUser } = this.props;
    if (currentUser.infoCubicAccountNumber && currentUser.infoCubicAccountNumber.length > 0) {
      this.setState({isLoading: true});
      const accountNumber = currentUser.infoCubicAccountNumber;
      this.props.dispatch({
        type: actionTypes.GET_INFOCUBIC_PACKAGES,
        data: {
          accountNumber,
        }
      });
    }
  }

  showResultMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.onBack();
        }},
      ]
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

  loadNearByAds() {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.GET_ADS,
        data: {
          lat: currentUser.geolocation.coordinates[1],
          lng: currentUser.geolocation.coordinates[0]
        }
      });
    });
  }

  onShowAds() {
    const { currentUser } = this.props;
    const { nearbyAds } = this.state;

    const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;
    if(level == USER_LEVEL.FREE && nearbyAds && nearbyAds.length > 0) {
      this.ads.load(nearbyAds);
    }
  }

  onBack() {
    this.props.navigation.pop();
  }

  onSave=()=> {
    Keyboard.dismiss();
    const {
      title,
      category,
      description,
      location,
      locationText,
      skills,
      type,
      payType,
      price,
      duration,
      isCheckCubic,
      infoCubicPackage,
      packages,
    } = this.state;

    var isValid = true;

    if (title == null || title.length <= 0) {
      this.setState({titleError: Messages.InvalidTitle});
      isValid = false;
    }

    if (category == null || category.length <= 0) {
      this.setState({categoryError: Messages.InvalidCategory});
      isValid = false;
    }

    if (description == null || description.length <= 0) {
      this.setState({descriptionError: Messages.InvalidDescription});
      isValid = false;
    }

    if (location == null || location.length <= 0) {
      this.setState({locationError: Messages.InvalidLocation});
      isValid = false;
    }

    if (type == null || type.length <= 0) {
      this.setState({typeError: Messages.InvalidType});
      isValid = false;
    }

    if (skills === null || skills.length === 0) {
      this.setState({skillsError: Messages.InvalidSkills});
      isValid = false;
    }

    if (payType == null || payType.length <= 0) {
      this.setState({payTypeError: Messages.InvalidPayType});
      isValid = false;
    }

    if (price === null || price === "" || price.charAt(0) === "-") {
      if (payType === "Hourly") {
        this.setState({priceError: Messages.InvalidHourlyRate});
      } else {
        this.setState({priceError: Messages.InvalidFixed});
      }
      isValid = false;
    }

    if (duration === null || duration === "" || isNaN(duration) || parseFloat(duration) <= 0) {
      if (payType === "Hourly") {
        this.setState({durationError: Messages.InvalidHourlyDuration});
      } else {
        this.setState({durationError: Messages.InvalidFixedDuration});
      }
      isValid = false;
    }

    if (packages && packages.length > 0) {
      if (isCheckCubic && (infoCubicPackage == null || infoCubicPackage.length <= 0)) {
        this.setState({packageError: Messages.InvalidCubicPackage});
        isValid = false;
      }
    }

    if (isValid) {
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          data: {
            address: location,
            page: 'NewProject',
          }
        });
      });
    }
  }

  onPostJob() {
    const { currentUser } = this.props;
    const {
      id,
      title,
      category,
      description,
      location,
      skills,
      type,
      payType,
      price,
      duration,
      isCheckCubic,
      infoCubicPackage,
      lat,
      lng,
      zipcode,
    } = this.state;

    this.setState({isLoading: true}, () => {
      const creator = currentUser._id;
      const job = {
        title,
        category,
        description,
        location,
        type,
        payType,
        isCheckCubic,
        infoCubicPackage,
        skills,
        price,
        duration,
        creator,
        lat,
        lng,
        zipcode,
      };

      if (id) {
        job.id = id;
        this.props.dispatch({
          type: actionTypes.UPDATE_JOB,
          job: job,
        });
      }
      else {
        const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;
        const credit = (currentUser && currentUser.credit) ? currentUser.credit : 0;
        if (credit > 0 || level > USER_LEVEL.FREE) {
          this.props.dispatch({
            type: actionTypes.CREATE_NEW_JOB,
            job
          });
        }
        else {
          this.setState({isLoading: false});
          Alert.alert(
            '',
            Messages.AskBuyCredit,
            [
              {text: 'Yes', onPress: () => {
                this.props.navigation.navigate('Subscription');
              }},
              {text: 'No', onPress: () => {}},
            ],
            {cancelable: false},
          );
        }
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Render. //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  render() {
    const { currentUser } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : 0;
    const { id } = this.state;

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets =>
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar
                title={id ? "Edit Project" : "New Project"}
                rightButton={id ? "trash" : null}
                onClickLeftButton={() => this.onBack()}
                onClickRightButton={() => this.onTrash()}
              />
              <View style={styles.container}>
                <KeyboardAwareScrollView style={{backgroundColor: '#f3f3f9'}}>
                  {
                    (level == 0)
                    ? this._renderCreditHeader()
                    : null
                  }

                  { this._renderForm() }
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

  onTrash() {
    Alert.alert(
      '',
      Messages.AskDeleteProjectConfirm,
      [
        {text: 'Yes', onPress: () => {
          this.setState({isLoading: true});
          const { id } = this.state;
          this.props.dispatch({
            type: actionTypes.DELETE_PROJECT,
            project_id: id,
          });
        }},
        {text: 'No', onPress: () => { }},
      ],
      {cancelable: false},
    );
  }

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// Credit Header. //////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderCreditHeader() {
    const { currentUser } = this.props;
    const credit = (currentUser && currentUser.credit) ? currentUser.credit : 0;

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Subscription')}>
        <View style={styles.creditHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={Images.icon_credit} style={styles.creditIcon}/>
            <Text style={styles.sectionTitle}>Connect Balance</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={styles.creditScore}>{credit}</Text>
            <Text style={styles.creditLabel}>{credit > 1 ? "Connects" : "Connect"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Input Form /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderForm() {
    const {
      id,
      title,
      description,
      locationText,
      skills,
      type,
      payType,
      price,
      duration,
      isCheckCubic,
      infoCubicPackage,

      titleError,
      descriptionError,
      locationError,
      skillsError,
      typeError,
      payTypeError,
      priceError,
      durationError,
      packageError,

      packages,
    } = this.state;

    return(
      <View style={styles.contentView}>
        { this._renderCategory() }
        <RoundTextInput
          label="Title"
          theme="gray"
          type="text"
          maxLength={150}
          value={title}
          errorMessage={titleError}
          returnKeyType="next"
          onSubmitEditing={() => { this.descriptionInput.focus() }}
          onChangeText={(text) => this.setState({title: text, titleError: null})}
        />

        <RoundTextInput
          label="Description"
          type="textview"
          theme="gray"
          value={description}
          errorMessage={descriptionError}
          onRefInput={(input) => { this.descriptionInput = input }}
          onChangeText={(text) => this.setState({description: text, descriptionError: null})}
        />

        <RoundTextInput
          label="Location"
          type="address"
          theme="gray"
          placeholderTextColor={Colors.placeholderTextColor}
          value={locationText}
          errorMessage={locationError}
          returnKeyType="done"
          onSelectAddress={(address) => this.setState({ location: address, locationText: address, locationError: null })}
          onRefInput={(input) => { this.locationInput = input }}
          onChangeText={this.onChangeLocation}
        />

        <RoundTextInput
          label="Type of Project"
          placeholder="Type of Project"
          type="dropdown"
          theme="gray"
          data={PROJECT_TYPES}
          value={type}
          errorMessage={typeError}
          onChangeText={(text) => this.setState({type: text, typeError: null})}
        />

        {
          skills
          ? <RoundTextInput
            label="Skills"
            type="tags"
            theme="gray"
            value={skills}
            errorMessage={skillsError}
            returnKeyType="next"
            style={{marginBottom: 5}}
            onChangeText={(tags) => this.onChangeSkills(tags)}
          />
          : null
        }

        <RoundTextInput
          label="Pay Type"
          placeholder="Pay Type"
          type="dropdown"
          theme="gray"
          style={{marginTop: 20}}
          data={PAY_TYPES}
          value={payType}
          errorMessage={payTypeError}
          onChangeText={(text) => this.setState({payType: text, payTypeError: null})}
        />

        <RoundTextInput
          label={(payType === "Hourly") ? "Hourly Rate ($)" : "Price ($)"}
          theme="gray"
          type="number"
          keyboardType={Platform.OS === 'ios' ? "numbers-and-punctuation" : "numeric"}
          value={price}
          maxLength={12}
          errorMessage={priceError}
          returnKeyType="next"
          onSubmitEditing={() => { this.durationInput.focus()}}
          onChangeText={(text) => this.onChangePrice(text)}
        />

        <RoundTextInput
          label={(payType === "Hourly") ? "Total Hours" : "Total Days"}
          theme="gray"
          type="number"
          value={duration}
          maxLength={7}
          errorMessage={durationError}
          returnKeyType="next"
          onRefInput={(input) => { this.durationInput = input }}
          onSubmitEditing={() => {
            Keyboard.dismiss()
          }}
          onChangeText={(text) => this.setState({duration: text, durationError: null})}
        />
        {
          (packages && packages.length > 0) &&
          <CublicSelect
            label="Check background screen"
            value={isCheckCubic}
            onSelect={(value) => this.setState({isCheckCubic: value})}
          />
        }
        {
          (isCheckCubic && packages && packages.length > 0) &&
          <RoundTextInput
            label="Packages"
            placeholder="Packages"
            type="dropdown"
            theme="gray"
            data={this.filterPackages(packages)}
            value={infoCubicPackage}
            style={{marginTop: 15}}
            errorMessage={packageError}
            onChangeText={(text) => this.setState({infoCubicPackage: text, packageError: null})}
          />
        }

        <RoundButton
          title={id ? "Save" : "Post Job"}
          theme="gradient"
          style={styles.postBtn}
          onPress={this.onSave}
        />
      </View>
    )
  }

  onChangePrice =(text)=> {
    const price = text.replace(/[^0-9\\.-]/g, '');
    this.setState({price, priceError: null});
  }

  onChangeLocation =(text)=> {
    if (text == null || text == "") {
      this.setState({ location: '', locationText: '', locationError: null })
    }
    else {
      this.setState({ locationText: text, locationError: null })
    }
  }

  // Change Skills.
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

  // Filter Packages.
  filterPackages(data) {
    var response = [];
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      response.push({
        id: item,
        label: item,
        value: item
      });
    }

    return response;
  }

  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// Category //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderCategory() {
    const { category, categoryError } = this.state;
    const { categories } = this.props;

    var list = [];
    categories.forEach(c => {
      if (c.subCategories && c.subCategories.length > 0) {
        c.subCategories.forEach(item => {
          if (category.indexOf(item.name) >= 0) {
            list.push(item);
          }
        });
      }
    });

    return (
      <View style={styles.categoryView}>
        {
          (list.length > 0)
          ? <View style={styles.rowView}>
              <Text style={styles.titleText}>Category</Text>
              <TouchableOpacity onPress={this.onEditCategory}>
                <Image source={Images.icon_circle_plus} style={styles.plusIcon}/>
              </TouchableOpacity>
            </View>
          : <View>
            <Text style={[styles.titleText, {marginBottom: 10}]}>Category</Text>
            <View style={styles.categoryBox}>
              <TouchableOpacity onPress={this.onEditCategory}>
                <Image source={Images.icon_circle_plus} style={styles.plusIcon}/>
              </TouchableOpacity>
            </View>
          </View>
        }
        {
          // Categories.
          (list.length > 0) &&
          <ScrollView style={{marginTop: 0, marginTop: 10}} horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              list.map((item, index) => {
                return (
                  <SubCategoryCell
                    key={index.toString()}
                    category={item}
                    selected={false}
                    isTouchable={false}
                  />
                )
              })
            }
          </ScrollView>
        }

        {
          categoryError
          ? <Text style={styles.errorMessage}>{categoryError}</Text>
          : null
        }
      </View>
    )
  }

  onEditCategory=()=> {
    this.props.navigation.navigate(
      "CategorySelect",
      {
        categories: this.state.category,
        page: "NewProject",
        onSaveCategory: this.onSaveCategory
      });
  }

  onSaveCategory=(categories)=> {
    this.setState({category: categories, categoryError: null});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  contentView: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  postBtn: {
    marginTop: 50,
  },

  categoryView: {
    marginTop: 10,
    marginBottom: 30,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: '#ACACAC',
  },

  plusIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  errorMessage: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: '#fc3434',
    fontSize: 11,
    marginLeft: 10,
    marginTop: 5,
  },

  creditHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
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

  categoryBox: {
    paddingVertical: 2,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8fa',
    borderWidth: 1,
    borderColor: '#d6d6d7',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    lat: state.user.lat,
    lng: state.user.lng,
    categories: state.globals.categories,
    geoData: state.globals.geoData,
    selectedAds: state.globals.selectedAds,

    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,

    errorJobMessage: state.jobs.errorMessage,
    createJobStatus: state.jobs.createJobStatus,
    updateJobStatus: state.jobs.updateJobStatus,
    deleteProjectStatus: state.jobs.deleteProjectStatus,
    selectedUser: state.jobs.selectedUser,

    packages: state.user.packages,
    getInfoCubicPackagesStatus: state.user.getInfoCubicPackagesStatus,
    adsPlaying: state.globals.adsPlaying,
    getAdsStatus: state.globals.getAdsStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewProjectScreen);
