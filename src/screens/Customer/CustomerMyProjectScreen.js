import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import BackgroundImage from '../../components/BackgroundImage'
import Swiper from 'react-native-swiper'
import TopNavBar from '../../components/TopNavBar'
import TopTabBar from '../../components/TopTabBar'
import EmptyView from '../../components/EmptyView'
import ProjectCell from '../../components/Cells/ProjectCell';
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import Styles from '../../theme/Styles'
import { 
  TOAST_SHOW_TIME, 
  Status, 
  JOB_STATUS, 
  ADMOB_IOS_BANNER_ID,
  ADMOB_ANDROID_BANNER_ID 
} from '../../constants.js'

class CustomerMyProjectScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isLoading: false,
        currentPage: 0,
        openProjects: [],
        activeProjects: [],
        completedProjects: [],
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser && currentUser._id) {
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.GET_MY_JOBS,
          user_id: currentUser._id,
          user_type: currentUser.type,
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyJobsStatus != this.props.getMyJobsStatus) {
      if (this.props.getMyJobsStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.updateProjects();
      } else if (this.props.getMyJobsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }

    if (prevProps.myJobs != this.props.myJobs) {
      this.updateProjects();
    }

    // Change Active Page.
    if (prevProps.changeMyProjectActivePageStatus != this.props.changeMyProjectActivePageStatus) {
      if (this.props.changeMyProjectActivePageStatus == Status.SUCCESS) {
        const { myProjectActivePage } = this.props;
        this.onSelectPage(myProjectActivePage);
      }
    }
  }

  updateProjects() {
    const { myJobs } = this.props;
    const openProjects = [];
    const activeProjects = [];
    const completedProjects = [];

    myJobs.forEach(job => {
      if (job.status === JOB_STATUS.OPEN) {
        openProjects.push(job);
      } else if (job.status === JOB_STATUS.PROGRESSING) {
        activeProjects.push(job);
      } else {
        completedProjects.push(job);
      }
    });

    activeProjects.sort(
      (a, b) => b.hire.createdAt - a.hire.createdAt
    );

    completedProjects.sort(
      (a, b) => b.completedAt - a.completedAt
    );

    this.setState({
      openProjects,
      activeProjects,
      completedProjects
    });
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

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onNew() {
    this.props.navigation.navigate('NewProject');
  }

  onDetailProject=(project)=> {
    this.props.navigation.navigate('DetailProject', {project: project});
  }

  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) return this.swiper.scrollBy(change, true);
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }

  onEditProject=(project)=> {
    this.props.navigation.navigate("NewProject", {project: project});
  }

  onChat=(project)=> {
    this.props.navigation.navigate('Chat', {user_id: project.hire.user});
  }

  _renderOpen() {
    const { currentUser, categories } = this.props;
    const { openProjects } = this.state;
    return (
      <View style={styles.slide}>
        {
          (openProjects && openProjects.length > 0)
          ? <FlatList
              style={styles.listView}
              data={openProjects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={(<View style={{height: 80}}/>)}
              renderItem={({item, i}) => (
                <View style={styles.itemContainer}>
                  <ProjectCell
                    project={item}
                    categories={categories}
                    key={i}
                    user={currentUser}
                    onEdit={this.onEditProject}
                    onDetail={this.onDetailProject}
                  />
                </View>
              )}
            />
          : <EmptyView title="No open projects." />
        }
      </View>
    )
  }

  _renderActive() {
    const { currentUser, categories } = this.props;
    const { activeProjects } = this.state;
    return (
      <View style={styles.slide}>
        {
          (activeProjects && activeProjects.length > 0)
          ? <FlatList
              style={styles.listView}
              data={activeProjects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={(<View style={{height: 80}}/>)}
              renderItem={({item, i}) => (
                <ProjectCell
                  project={item}
                  categories={categories}
                  key={i}
                  user={currentUser}
                  onChat={this.onChat}
                  onDetail={this.onDetailProject}
                />
              )}
            />
          : <EmptyView title="No active projects." />
        }
      </View>
    )
  }

  _renderComplete() {
    const { currentUser, categories } = this.props;
    const { completedProjects } = this.state;
    return (
      <View style={styles.slide}>
        {
          (completedProjects && completedProjects.length > 0)
          ? <FlatList
              style={styles.listView}
              data={completedProjects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={(<View style={{height: 80}}/>)}
              renderItem={({item, i}) => (
                <View style={styles.itemContainer}>
                  <ProjectCell
                    project={item}
                    categories={categories}
                    key={i}
                    user={currentUser}
                    onChat={this.onChat}
                    onDetail={this.onDetailProject}
                  />
                </View>
              )}
            />
          : <EmptyView title="No completed projects." />
        }
      </View>
    )
  }

  render() {
    const { isLoading, currentPage } = this.state;
    const { currentUser } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : 0;
    return (
        <View style={{flex: 1}}>
            <BackgroundImage />
            <SafeAreaInsetsContext.Consumer>
            {insets =>
              <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar
                title="My Projects"
                leftButton="menu"
                rightButton="add"
                onClickLeftButton={() => this.onMenu()}
                onClickRightButton={() => this.onNew()}
              />
              <TopTabBar
                titles={["OPEN", "ACTIVE", "COMPLETED"]}
                currentPage={currentPage}
                onSelectPage={this.onSelectPage}
              />
              <Swiper
                style={styles.swiperWrapper}
                ref={ref => (this.swiper = ref)}
                showsPagination={false}
                loop={false}
                onIndexChanged={this.onSwipeIndexChanged}
              >
                { this._renderOpen()}
                { this._renderActive()}
                { this._renderComplete()}
              </Swiper>
              </View>
            }
            </SafeAreaInsetsContext.Consumer>
            {
            (level == 0) &&
              <View style={Styles.adBanner}>
                <BannerAd 
                  size={BannerAdSize.BANNER} 
                  unitId={Platform.OS === 'ios' ? ADMOB_IOS_BANNER_ID : ADMOB_ANDROID_BANNER_ID} 
                />
              </View>
            }
            <Toast ref={ref => (this.toast = ref)}/>
            { isLoading && <LoadingOverlay />  }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperWrapper: {
  },
  slide: {
    flex: 1,
    backgroundColor: Colors.pageColor
  },
  listView: {
    flex: 1,
    padding: 20,
  }
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    lat: state.user.lat,
    lng: state.user.lng,
    currentUser: state.user.currentUser,
    categories: state.globals.categories,

    myJobs: state.jobs.myJobs,
    errorMessage: state.jobs.errorMessage,
    getMyJobsStatus: state.jobs.getMyJobsStatus,

    myProjectActivePage: state.user.myProjectActivePage,
    changeMyProjectActivePageStatus: state.user.changeMyProjectActivePageStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerMyProjectScreen);
