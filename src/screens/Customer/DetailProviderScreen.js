import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast from 'react-native-easy-toast'

import actionTypes from '../../actions/actionTypes';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import TopTabBar from '../../components/TopTabBar'
import FeedbackProject from '../../components/Cells/FeedbackProject'
import EducationCell from '../../components/Cells/EducationCell';
import EmploymentCell from '../../components/Cells/EmploymentCell';
import EmptyView from '../../components/EmptyView';
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import LoadingOverlay from '../../components/LoadingOverlay'
import { kFormatter } from '../../functions';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';
import Messages from '../../theme/Messages';

class DetailProviderScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      provider: null,
      currentPage: 0,
      projects: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.provider) {
      const { provider } = this.props.route.params;
      this.setState({provider});

      // Load Job.
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
            type: actionTypes.GET_USER,
            user_id: provider._id,
            is_update: false,
        });
    });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getUserStatus != this.props.getUserStatus) {
      if (this.props.getUserStatus == Status.SUCCESS) {
        this.setState({isLoading: false, provider: this.props.user});
      } else if (this.props.getUserStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }
  }

  onBack() {
    this.props.navigation.goBack();
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

  onMoveChat=()=> {
    const user = this.state.provider;
    this.props.navigation.navigate('Chat', {user_id: user._id});
  }

  filterCategory(list) {
    var result = [];
    const { categories } = this.props;

    list.forEach(item => {
      categories.forEach(c => {
        var isExisting = false;
        if (c.subCategories) {
          c.subCategories.forEach(record => {
            if (item == record.name) {
              result.push(record);
              isExisting = true;
              return;
            }
          });
        }

        if (isExisting) {
          return;
        }
      });
    });

    return result;
  }

  render() {
    const { provider, projects, currentPage } = this.state;
    var name = "";
    if (provider && provider.company && provider.company.length > 0) {
      name = provider ? provider.company : "";
    }
    else {
      const firstName = provider ? provider.firstName : "";
      const lastName = provider ? provider.lastName : "";
      name = provider ? firstName + " " + lastName: "";
    }

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
          {(insets) =>
            <View style={{ paddingTop: insets.top, flex: 1 }}>
              <TopNavBar
                title={name}
                rightButton="chat"
                onClickLeftButton={() => this.onBack()}
                onClickRightButton={this.onMoveChat}
              />
              <TopTabBar 
                titles={["OVERVIEW", "HISTORY"]} 
                currentPage={currentPage} 
                onSelectPage={(index) => this.setState({currentPage: index})}
              />
              <View style={styles.container}>
                { currentPage == 0 && this._renderOverview() } 
                { currentPage == 1 && this._renderHistory() } 
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

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Overview /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
    _renderOverview=()=> {
      const { provider } = this.state;
      const totalEarned = (provider && provider.totalEarned) ? provider.totalEarned : 0;
      const totalProjects = (provider && provider.projects) ? provider.projects.length : 0;
      const list = (provider && provider.categories) ? provider.categories : [];
      const categories = this.filterCategory(list);
      const skills = (provider && provider.skills) ? provider.skills : [];
      var name = "";
      if (provider) {
        if (provider.company && provider.company.length > 0) {
          name = provider.company;
        }
        else {
          name = provider.firstName + " " + provider.lastName;
        }
      }

      return (
        <ScrollView>
          <View style={styles.slide}>
              {
                provider &&
                <View style={styles.aboutContainer}>
                  <View style={[styles.section, styles.aboutHeader]}>
                    <Image style={styles.avatarPhoto} source={provider.avatar ? {uri: provider.avatar} : Images.account_icon} />
                    <View style={{width: '75%'}}>
                      <Text style={styles.nameText}>{name}</Text>
                      {/* <View style={styles.oneRow}>
                        <Image source={Images.pin_icon} style={styles.leftIcon} />
                        <Text style={styles.infoText}>{provider.location}</Text>
                      </View>

                      <View style={styles.oneRow}>
                        <Image source={Images.mail} style={styles.leftIcon} />
                        <Text style={styles.infoText}>{provider.email}</Text>
                      </View>

                      <View style={styles.oneRow}>
                        <Image source={Images.phone} style={styles.leftIcon} />
                        <Text style={styles.infoText}>{provider.phone}</Text>
                      </View> */}

                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.titleText}>{provider.title}</Text>
                    <Text style={styles.overviewText}>{provider.overview}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                      <View style={{width: '33%'}}>
                        <Text style={styles.contentText}>${provider.hourlyRate}/hr</Text>
                        <Text style={styles.contentLabelText}>Hourly rate</Text>
                      </View>
                      <View style={{width: '33%'}}>
                      <Text style={styles.contentText}>${kFormatter(totalEarned)}</Text>
                        <Text style={styles.contentLabelText}>Total earned</Text>
                      </View>
                      <View style={{width: '33%'}}>
                        <Text style={styles.contentText}>{totalProjects}</Text>
                        <Text style={styles.contentLabelText}>Projects</Text>
                      </View>
                    </View>
                  </View>
                  {
                    // Skills.
                    (skills && skills.length > 0) &&
                    <View style={[styles.section, {paddingBottom: 10}]}>
                      <Text style={styles.sectionTitle}>Skills: </Text>
                      <View style={styles.skillsContainer}>
                      {
                        skills.map((skill, i) =>
                          <Text style={styles.skillCell} key={i.toString()}>{skill}</Text>
                        )
                      }
                      </View>
                    </View>
                  }
                  {
                    // Categories.
                    (categories && categories.length > 0) &&
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Category: </Text>
                      <View style={styles.categoryContainer}>
                        {
                          categories.map((item, index) => {
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
                    </View>
                  }
                  {
                    // Education.
                    (provider && provider.educations && provider.educations.length > 0) &&
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Education: </Text>
                      <ScrollView style={{marginTop: 0, marginTop: 10}} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                          provider.educations.map((item, index) => {
                            return (
                              <EducationCell key={index.toString()} data={item} isView={true} />
                            )
                          })
                        }
                      </ScrollView>
                    </View>
                  }
                  {
                    // Employment History.
                    (provider && provider.employments && provider.employments.length > 0) &&
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Employment History: </Text>
                      <ScrollView style={{marginTop: 0, marginTop: 10}} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                          provider.employments.map((item, index) => {
                            return (
                              <EmploymentCell key={index.toString()} data={item} isView={true} />
                            )
                          })
                        }
                      </ScrollView>
                    </View>
                  }
                  {
                    // Resume.
                    (provider && provider.resume && provider.resume.name) &&
                    <View>
                      <Text style={styles.sectionTitle}>Resume: </Text>
                      <TouchableOpacity onPress={() => this.onViewResume(provider.resume)}>
                        <View style={styles.resumeBox}>
                          <Image source={Images.icon_resume_uploaded} style={styles.uploadedResumeIcon}/>
                          <Text style={styles.uploadedResumeText}>{provider.resume.name}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  }
                </View>
            }
        </View>
      </ScrollView>
    )
  }

  onViewResume=(resume)=> {
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

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// History //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderHistory=()=> {
    {
      const { provider } = this.state;
      var projects = [...provider.projects];
      projects.sort(
        (a, b) => b.hire.createdAt - a.hire.createdAt
      );

      return (
        <View style={styles.historyPage}>
          {
            (projects && projects.length > 0) 
            ? <ScrollView style={{paddingHorizontal: 15}}>
              {
                projects.map((item, index) => {
                  return (
                    <FeedbackProject project={item} key={index.toString()}/>
                  )
                })
              }
            </ScrollView>
            : <EmptyView title="No job history." />
          }
        </View>
      )
    }
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
    padding: 20,
  },

  aboutContainer: {

  },

  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },

  avatarPhoto:{
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: Colors.grayTextColor,
  },

  nameText: {
    fontFamily: Fonts.bold,
    color: Colors.appColor,
    fontSize: 20,
    // marginBottom: 10,
  },

  infoText: {
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    fontSize: 14,
  },

  hourlyRateText: {
    marginTop: 5,
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    fontSize: 14,
  },

  oneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  leftIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
    resizeMode: 'contain',
  },

  titleText: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },

  overviewText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textColor,
  },

  contentLabelText: {
    textAlign: 'center',
    fontFamily: Fonts.light,
    color: Colors.textColor,
    fontSize: 14,
    marginTop: 5,
  },

  contentText: {
    textAlign: 'center',
    fontFamily: Fonts.bold,
    color: 'black',
    fontSize: 20,
    letterSpacing: 0.5,
  },

  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 7,
  },

  skillCell: {
    color: 'white',
    backgroundColor: Colors.appColor,
    marginRight: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },

  sectionTitle: {
    marginTop: 15,
    fontFamily: Fonts.regular,
    color: Colors.textColor,
    fontSize: 16,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
  },

  categoryIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 5,
    marginBottom: 5,
  },

  historyPage: {
    flex: 1,
    paddingVertical: 5,
  },

  resumeBox: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    backgroundColor: 'white',
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
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
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    user: state.user.user,
    categories: state.globals.categories,
    errorMessage: state.user.errorMessage,
    getUserStatus: state.user.getUserStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(DetailProviderScreen);
