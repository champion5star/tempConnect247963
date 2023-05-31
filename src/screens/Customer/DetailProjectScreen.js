import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
  ScrollView,
  Linking,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Moment from 'moment';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import Fonts from '../../theme/Fonts'
import RoundButton from '../../components/RoundButton'
import ProposalCell from '../../components/Cells/ProposalCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import Rate from '../../components/Rate'
import TopTabBar from '../../components/TopTabBar'
import actionTypes from '../../actions/actionTypes';
import RoundTextInput from '../../components/RoundTextInput'
import EmptyView from '../../components/EmptyView'
import Images from '../../theme/Images';
import Messages from '../../theme/Messages';
import Styles from '../../theme/Styles';
import Colors from '../../theme/Colors';

import { 
  checkInternetConnectivity, 
  getDurationUnit 
} from '../../functions'
import { 
  TOAST_SHOW_TIME, 
  Status, 
  JOB_STATUS, 
  NOTIFICATION_TYPE, 
  DATE_TIME_FORMAT, 
  USER_TYPE 
} from '../../constants.js'

const sWidth = Dimensions.get('window').width;

class DetailProjectScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      project: null,
      currentPage: 0,
      rate: 0,
      reviewText: '',
      errorMessage: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.project) {
      const { project } = this.props.route.params;
      this.setState({project: project});

      // Load Job.
      this.setState({isLoading: true}, () => { 
          this.props.dispatch({
              type: actionTypes.GET_JOB,
              job_id: project._id,
          });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {

    // Get Job.
    if (prevProps.getJobStatus != this.props.getJobStatus) {
      if (this.props.getJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false, project: this.props.selectedJob});
      } 
      else if (this.props.getJobStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }      
    }

    // Decline Apply
    if (prevProps.declineApplyStatus != this.props.declineApplyStatus) {
      if (this.props.declineApplyStatus == Status.SUCCESS) {
        this.setState({isLoading: false, project: this.props.selectedJob});
        this.showMessage(Messages.DeclinedProposal, true);
      } 
      else if (this.props.declineApplyStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }      
    }

    // Hire
    if (prevProps.hireStatus != this.props.hireStatus) {
      if (this.props.hireStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.moveMyProjectTab(1);

        this.showMessage(Messages.ProjectStarted, true);
      } 
      else if (this.props.hireStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }      
    }

    // Pay Project
    if (prevProps.payJobStatus != this.props.payJobStatus) {
      if (this.props.payJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false, project: this.props.selectedJob});
        this.moveMyProjectTab(2);
        this.showMessage(Messages.ProjectCompleted, false);
      } 
      else if (this.props.payJobStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }      
    }

    // Cancel Job.
    if (prevProps.cancelJobStatus != this.props.cancelJobStatus) {
      if (this.props.cancelJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false, project: this.props.selectedJob});
        this.moveMyProjectTab(2);
        this.showMessage(Messages.ProjectCancelled, false);
      } 
      else if (this.props.cancelJobStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }      
    }

    // Write Review.
    if (prevProps.writeReviewStatus != this.props.writeReviewStatus) {
      if (this.props.writeReviewStatus == Status.SUCCESS) {
        this.setState({isLoading: false, project: this.props.selectedJob});
        this.showMessage(Messages.ReviewSubmitted, true);
      } 
      else if (this.props.writeReviewStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }      
    }
  }

  moveMyProjectTab(page) {
    this.props.dispatch({
      type: actionTypes.CHANGE_MYPROJECT_ACTIVE_PAGE,
      page: page,
    });
    
    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_MYPROJECT_ACTIVE_PAGE,
      });
    }, 500);
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) {
            this.onBack();
          }          
        }},
      ],
      {cancelable: false},
    ); 
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

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Render ///////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  render() {
    const { currentUser } = this.props;
    const { currentPage, project, isLoading } = this.state;
    var titles = [];
    var isActive = false;
    if (project) {
      if (currentUser.type == USER_TYPE.PROVIDER) {
        if (project.status === JOB_STATUS.PROGRESSING 
          || project.status === JOB_STATUS.COMPLETED 
          || project.status === JOB_STATUS.CANCELED) {
            if (project.hire && project.hire.user && project.hire.user._id == currentUser._id) {
              titles = ["VIEW", "CONTRACT"];
              isActive = true;  
            }
        }
      }
      else {
        if (project.status === JOB_STATUS.OPEN) {
          titles = ["VIEW", "PROPOSALS"];
        }
        else {
          titles = ["VIEW", "CONTRACT"];
          isActive = true;
        }
      }
    }

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="Detail" onClickLeftButton={() => this.onBack()}/>    
              {
                (titles && titles.length > 0) && 
                <TopTabBar 
                  titles={titles} 
                  currentPage={currentPage} 
                  onSelectPage={this.onSelectPage}
                />                  
              }  
              <View style={styles.container}>
                { currentPage === 0 && this._renderView()}
                {
                  (titles && titles.length >= 2 && currentPage === 1)
                  ? isActive ? this._renderContract() : this._renderProposals()
                  : null
                }
              </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </View>
    );
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }

  onSelectPage=(page)=> {
    this.setState({ currentPage: page });
  }

  onDetailProvider=(user)=> {
    if (user && user._id) {
      if (user.type === USER_TYPE.CUSTOMER) {
        this.props.navigation.navigate("DetailCustomer", {user});
      }
      else {
        this.props.navigation.navigate("DetailProvider", {provider: user});
      }
    }    
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Overview /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderView() {
    const { project } = this.state;
    const skills = (project && project.skills) ? project.skills : [];
    const payType = (project && project.payType) ? project.payType : "";
    const type = (project && project.type) ? project.type : "";
    const time = (project && project.createdAt) ? Moment(project.createdAt).format(DATE_TIME_FORMAT) : "";
    const isCheckCubic = (project && project.isCheckCubic) ? project.isCheckCubic : false;
    const title = (project && project.title) ? project.title : "";
    const status = (project && project.status) ? project.status : JOB_STATUS.OPEN;
    var price = (project && project.price) ? project.price : 0;
    if (status === JOB_STATUS.OPEN) {
      price = (project && project.initialPrice) ? project.initialPrice : 0;
    }

    return (
      <View style={styles.slide}>
        {
          project && 
          <ScrollView>
          <View style={{padding: 20}}>
              <View style={styles.oneRow}>
                  <Text style={styles.typeText}>{payType}</Text>
                  <Text style={styles.typeText}>{type}</Text>
                  <Text style={styles.dateText}>{time}</Text>
              </View>                    
              {
                isCheckCubic &&
                <View>
                  <Image source={Images.cubic_logo} style={styles.cublicLogo} />
                  <Text style={styles.infoCubicPackageText}>{project.infoCubicPackage}</Text>
                </View>
              }
              <Text style={styles.titleText}>{title}</Text>
              
              { (project.geolocation && project.geolocation.coordinates) && this._renderLocation() }

              <View style={styles.borderContainer}>
                  <Text style={styles.labelText}>Skills: </Text>
                  <View style={styles.skillsContainer}>
                    {
                      skills.map((skill, i) =>
                        <Text style={styles.skillCell} key={i.toString()}>{skill}</Text>
                      )
                    }
                  </View>
              </View>
              <View style={styles.borderContainer}>
                <Text style={styles.labelText}>Category: </Text>
                { this.renderCategories(project.category) }
              </View>
              <View style={[styles.priceContainer, styles.borderContainer]}>
                  <View style={styles.oneRow}>
                      <Text style={styles.priceText}>$ {price}</Text>
                      <Text style={styles.priceTypeText}>/ {payType === "Fixed" ? "Fixed Price" : "Hour"}</Text>
                  </View>  
                  {
                    (project.duration && project.duration > 0)
                    ? <View style={styles.oneRow}>
                        <Text style={styles.priceTypeText}>{payType === "Fixed" ? "Total Days:" : "Total Hours:"}</Text>
                        <Text style={styles.priceText}> {project.duration}</Text>
                    </View>  
                    : null
                  }
              </View>
              <View style={styles.borderContainer}>
                <Text style={styles.descriptionText}>{project.description}</Text>
              </View>                    
          </View>
        </ScrollView>
        }
      </View>
    )
  }

  // Category.
  renderCategories(category) {
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
            list.map((item, index) => {
            return (
                <Image 
                    key={index.toString()} 
                    source={{uri: item.icon}}
                    style={styles.categoryIcon}
                />
            )
            })
          }
        </View>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Location /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderLocation() {
    const { project } = this.state;
    const location = (project && project.location) ? project.location : "";
    const lat = (project && project.geolocation && project.geolocation.coordinates) ? project.geolocation.coordinates[1] : 0;
    const lng = (project && project.geolocation && project.geolocation.coordinates) ? project.geolocation.coordinates[0] : 0;

    return (
      <View style={styles.borderContainer}>
        <View style={styles.locationHeader}>
          <View>
            <Text style={styles.labelText}>Location: </Text>
            <Text style={styles.locationText}>{location}</Text>
          </View>
          <TouchableOpacity onPress={() => this.getDirection(lat, lng)}>
            <Image source={Images.icon_get_directions} style={styles.directionImage}/>
          </TouchableOpacity>
        </View>
        <MapView
          ref={ref => (this.mapView = ref)}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        >
          <Marker
            title={location}
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
          /> 
        </MapView>
      </View>
    )
  }

  getDirection=(lat1, lng1)=> {
    const { lat, lng } = this.props;
    if (Platform.OS == "ios") {
      Linking.openURL(`maps://app?saddr=${lat},${lng}&daddr=${lat1},${lng1}`)
    }
    else if (Platform.OS == "android") {
      const link = `google.navigation:q=${lat1},${lng1}`;
      Linking.canOpenURL(link).then((supported) => {
        if (supported) {
          Linking.openURL(link);
        }
        else {
          Linking.openURL(`https://www.google.com/maps/search/?saddr=${lat},${lng}&daddr=${lat1},${lng1}`)
        }
      }).catch(err => {
        Linking.openURL(`https://www.google.com/maps/search/?saddr=${lat},${lng}&daddr=${lat1},${lng1}`)
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Contact //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderContract() {
    const { currentUser } = this.props;
    var { project } = this.state;

    var status = "";
    if (project.status === JOB_STATUS.PROGRESSING) {
      status = "Active";
    } else if (project.status === JOB_STATUS.COMPLETED) {
      status = "Completed";
    } else if (project.status === JOB_STATUS.CANCELED) {
      status = "Cancelled";
    }

    var contractUser = (currentUser.type === USER_TYPE.CUSTOMER) ? project.hire.user : project.creator;
    var coverLetter = "";
    project.proposals.forEach(p => {
      if (p.creator._id === project.hire.user._id) {
        coverLetter = p.coverText;
        return;
      }
    });

    var name = "";
    if (contractUser && contractUser.company && contractUser.company.length > 0) {
      name = contractUser.company;
    }
    else {
      name = contractUser.firstName + " " + contractUser.lastName;
    }

    const durationUnit = getDurationUnit(project.hire.duration, project.payType);

    return (
      <View style={styles.slide}>
        { 
          project && 
          <KeyboardAwareScrollView>
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Contract Detail</Text>
                <Text style={styles.statusText}>{status}</Text>
                <Text style={styles.contractDetailText}>Contract ID: {project._id}</Text>
                <Text style={styles.contractDetailText}>Since: {Moment(project.hire.createdAt).format(DATE_TIME_FORMAT)}</Text>
                {
                  (project.status === JOB_STATUS.COMPLETED) &&
                  <Text style={styles.contractDetailText}>Completed At: {Moment(project.completedAt).format(DATE_TIME_FORMAT)}</Text>
                }
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{currentUser.type === USER_TYPE.CUSTOMER ? "Freelancer" : "Client"}</Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TouchableOpacity onPress={() => this.onDetailProvider(contractUser)}>
                    <Image source={contractUser.avatar ? {uri: contractUser.avatar} : Images.account_icon} style={styles.avatarPhoto} />
                  </TouchableOpacity>
                    
                  <View style={{width: '75%'}}>
                    <Text style={styles.nameText}>{name}</Text>
                    <TouchableOpacity style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}} onPress={() => this.onMoveChat(contractUser)}>
                      <Text style={styles.btnText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <View style={[styles.oneRow, {width: '50%'}]}>
                      <Text style={styles.priceText}>$ {project.hire.price}</Text>
                      <Text style={styles.priceTypeText}>/ {project.payType === "Fixed" ? "Fixed Price" : "Hour"}</Text>
                  </View>
                  <View style={[styles.oneRow, {width: '50%'}]}>
                    <Text style={styles.priceTypeText}>Total {durationUnit}: </Text>
                    <Text style={styles.priceText}>{project.hire.duration}</Text>
                  </View>
                </View>              
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Cover Letter</Text>
                <Text style={styles.coverText}>{coverLetter}</Text>
              </View>
              {
                (currentUser.type === USER_TYPE.CUSTOMER && project.status === JOB_STATUS.PROGRESSING) &&
                <View style={{paddingHorizontal: 20}}>
                  <RoundButton 
                    title="Complete" 
                    theme="gradient" 
                    style={{marginTop: 40}} 
                    onPress={this.onComplete}
                  />
                  <RoundButton 
                    title="Cancel" 
                    theme="red" 
                    style={{marginTop: 20, marginBottom: 20}} 
                    onPress={this.onCancel}
                  />
                </View>
              }
              {
                (currentUser.type === USER_TYPE.CUSTOMER
                  && (project.status === JOB_STATUS.COMPLETED || project.status === JOB_STATUS.CANCELED)) 
                && this._renderFeedbackSection()
              }
            </View>
          </KeyboardAwareScrollView>
        }
      </View>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Feedback Section /////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderFeedbackSection() {
    var { project, errorMessage, rate, reviewText } = this.state;
    var isAlreadyReview = false;
    if (project && project.review) {
      rate = project.review.score;
      reviewText = project.review.text;
      isAlreadyReview = true;
    }

    return (
      <View style={styles.feedbackContainer}>
        {
          (!isAlreadyReview) && 
          <Text style={[styles.labelText, {paddingHorizontal: 20, fontFamily: Fonts.light, marginBottom: 20}]}>Share your experience! Your honest feedback provides helpful information to both the freelancer and our community.</Text>
        }
        
        <Rate size="xlarge" touchable={!isAlreadyReview} rate={rate} touchable={true} style={{marginBottom: 20}} onChangeRate={(rate) => this.setState({rate})}/>
        <View style={{ width: '100%', paddingLeft: 25, paddingRight: 25, marginBottom: 20 }}>
        { 
          isAlreadyReview
          ? <Text style={styles.feedbackText}>{reviewText}</Text>
          : <RoundTextInput
            type="textview"
            theme="gray"
            value={reviewText}
            onChangeText={(text) => this.setState({reviewText: text})} 
          />
        }
        </View>
        {
          !isAlreadyReview && 
          <RoundButton 
            title="Write Review" 
            theme="gradient" 
            style={{width: '80%'}} 
            onPress={this.onWriteReview}
          />
        }
        { errorMessage && <Text style={Styles.errorText}>{errorMessage}</Text>}
      </View>
    )
  }

  onComplete=()=> {
    const { project } = this.state;
    this.props.navigation.navigate('Pay', {project: project});
  }

  onCancel=()=> {
    // Show confirm dialog.
    Alert.alert(
      '',
      Messages.AskCancelQuote,
      [
        {text: 'Yes', onPress: () => {
          // Cancel Job.
          const project = this.state.project;    
          this.setState({isLoading: true}, () => { 
            this.props.dispatch({
              type: actionTypes.CANCEL_JOB,
              project_id: project._id,
            });
          });

          this.generateNotification(project, project.hire.user._id, NOTIFICATION_TYPE.CANCEL_JOB);
        }},
        {text: 'No', onPress: () => {}},
      ]
    );  
  }

  onDeclineApply=async(proposal)=> {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const project = this.state.project;    
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.DECLINE_APPLY,
          project_id: project._id,
          proposal_id: proposal._id,
        });
      });
      this.generateNotification(project, proposal.creator, NOTIFICATION_TYPE.DECLINE_APPLY);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onHire=async(proposal)=> {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { currentUser } = this.props;
      const { project } = this.state;    
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.HIRE,
          current_user_id: currentUser._id,
          project_id: project._id,
          user_id: proposal.creator._id,
          price: parseFloat(proposal.price),
          duration: parseInt(proposal.duration),
        });
      });
      this.generateNotification(project, proposal.creator, NOTIFICATION_TYPE.HIRE);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onWriteReview=()=> {
    Keyboard.dismiss();

    const { rate, reviewText } = this.state;
    if (rate <= 0) {
      this.setState({errorMessage: "Please select a rating."});
      return;
    }

    if (reviewText === null || reviewText.length === 0) {
      this.setState({errorMessage: "Please write a review."});
      return;
    }
  
    const { project } = this.state;
    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.WRITE_REVIEW,
      job_id: project._id,
      text: reviewText,
      score: rate
    });

    this.generateNotification(project, project.hire.user._id, NOTIFICATION_TYPE.GIVE_REVIEW);
  }

  generateNotification(project, receiver, type) {
    const { currentUser } = this.props;
    const n = {
      creator: currentUser._id,
      receiver: receiver,
      job: project._id,
      type: type
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n,
    });
  }

  onMoveChat(user) {
    if (user && user._id) {
      this.props.navigation.navigate('Chat', {user_id: user._id});
    }    
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Proposals ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderProposals() {
    const { project } = this.state;
    const proposals = (project && project.proposals) ? project.proposals : [];
    return (
        <View style={styles.slide}>
          {
              (project && proposals.length > 0)
              ? <FlatList
                    style={{padding: 20}}
                    data={proposals}
                    renderItem={({item, index}) => (
                      <ProposalCell 
                        data={item} 
                        project = {project} 
                        key={index.toString()}
                        onDetailProvider={this.onDetailProvider}
                        onDeclineApply={this.onDeclineApply}
                        onHire={this.onHire}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            : <EmptyView title="No proposals." />
          }
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor
  },

  swiperWrapper: {
  },

  slide: {
    flex: 1,
  },

  borderContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingVertical: 15,
  },

  typeText: {
    fontFamily: Fonts.light,
    fontSize: 14,
    backgroundColor: '#67c7c5',
    color: 'white',    
    paddingVertical: 3,
    paddingHorizontal: 13,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 10,
   },

   dateText: {
    fontFamily: Fonts.regular,   
    color: 'gray',
    fontSize: 14,
    marginTop: 2,
  },

  titleText: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.textColor,
    marginBottom: 7,
    marginTop: 10,
    lineHeight: 24,
  },

  descriptionText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 15,
  },

  oneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  skillCell: {
    color: 'white',
    backgroundColor: Colors.appColor,
    marginRight: 5,
    paddingVertical: 4,
    paddingHorizontal: 10, 
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 5,
  },

  labelText: {
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    marginBottom: 5,
  },

  categoryText: {
    fontFamily: Fonts.bold,
    color: Colors.textColor,
    fontSize: 18,
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceText: {
    fontFamily: Fonts.bold,
    color: Colors.greenTextColor,
    fontSize: 24,
  },

  priceTypeText: {
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    fontSize: 14,
    marginLeft: 3,
    marginTop: 3,
  },

  section: {
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1,
    padding: 20,
  },

  sectionLabel: {
    color: 'gray',
    fontFamily: Fonts.regular,
    marginBottom: 5,
  },

  statusText: {
    color: Colors.textColor,
    fontFamily: Fonts.bold,
    fontSize: 24,
    marginBottom: 10,
  },

  contractDetailText: {
    color: Colors.textColor,
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 5,
  },

  avatarPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: 'gray',
  },

  nameText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: 'black',
    marginBottom: 3,
  },

  addressText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textColor,
  },

  coverText: {
    fontFamily: Fonts.regular,
    color: Colors.textColor,    
  },

  btnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.appColor,
    borderWidth: 1,
    borderColor: Colors.appColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  feedbackContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
  },

  cublicLogo: {
    width: 100,
    height: 21,
    marginTop: 7,
    resizeMode: 'contain'
  },

  feedbackText: {
    fontFamily: Fonts.italic,
    color: Colors.textColor,
  },

  infoCubicPackageText: {
    fontFamily: Fonts.regular,
    marginTop: 8,
  },

  categoryView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  categoryIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 5,
    marginBottom: 5, 
  },

  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  locationText: {
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    fontSize: 16,
    width: sWidth - 80,
  },

  directionImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },

  mapView: {
    marginTop: 10,
    width: '100%',
    height: 150,
    borderRadius: 10,
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

    selectedJob: state.jobs.selectedJob,
    errorJobMessage: state.jobs.errorMessage,
    getJobStatus: state.jobs.getJobStatus,
    declineApplyStatus: state.jobs.declineApplyStatus,    
    hireStatus: state.jobs.hireStatus,
    writeReviewStatus: state.jobs.writeReviewStatus,
    payJobStatus: state.jobs.payJobStatus,
    cancelJobStatus: state.jobs.cancelJobStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(DetailProjectScreen);