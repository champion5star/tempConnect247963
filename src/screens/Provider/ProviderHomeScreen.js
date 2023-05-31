import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Keyboard,
  AppState,
  Platform
} from 'react-native';

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import Swiper from 'react-native-swiper'
import BackgroundImage from '../../components/BackgroundImage'
import ProjectCell from '../../components/Cells/ProjectCell'
import TopTabBar from '../../components/TopTabBar'
import ApplySheet from '../../components/ApplySheet'
import TopNavBar from '../../components/TopNavBar'
import SearchBox from '../../components/SearchBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import FilterDialog from '../../components/Modal/FilterDialog'
import EmptyView from '../../components/EmptyView'
import Ads from "../../components/Ads";
import {AdsStatus} from "../../constants";
import Colors from '../../theme/Colors'
import Styles from '../../theme/Styles'
import Fonts from '../../theme/Fonts'
import Messages from '../../theme/Messages'
import { 
  TOAST_SHOW_TIME, 
  Status, 
  NOTIFICATION_TYPE, 
  DEFAULT_DISTANCE,
  ADMOB_IOS_BANNER_ID,
  ADMOB_ANDROID_BANNER_ID, 
  USER_LEVEL,
} from '../../constants.js'

class ProviderHomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKeyword: '',
      keyword: '',
      currentPage: 0,
      selectedProject: null,
      showApplySheet: false,

      originalProjects: [],
      projects: [],
      originalProposedProjects: [],
      proposedProjects: [],
      originalFavoriteProjects: [],
      favoriteProjects: [],
      nearbyAds: [],

      isLoading: false,
      sheetType: null,
      isFilterDialog: false,
      filterCategories: [],
      filters: null,
      isProposal: false,

      appState: AppState.currentState,
      menuClicked: false
    }
  }

  componentDidMount() {
    this.appStateSubscription = AppState.addEventListener('change', nextAppState => {
      const { currentUser } = this.props;
      const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;
      if( level === USER_LEVEL.FREE ){
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          if( this.props.adsPlaying === AdsStatus.CLOSE && this.ads) {
            if (this.state.nearbyAds.length > 0) {
              if (this.ads) {
                this.ads.load(this.state.nearbyAds);
              }
            }
          }

          if( this.props.adsPlaying === AdsStatus.CLICK ) {
            this.props.dispatch({
              type: actionTypes.CLOSE_ADS,
            });
          }

        }
        this.setState({appState: nextAppState});
      }
    });
    this.loadApplyJobs();
    this.loadFavoriteJobs();

    const { currentUser, lat, lng } = this.props;

    if (currentUser) {
      const user_id = currentUser._id;
      const searchFilter = currentUser.searchFilter;
      const keyword = (searchFilter.keyword) ? searchFilter.keyword : "";
      const category = (searchFilter.category) ? searchFilter.category : [];
      const payType = (searchFilter.payType) ? searchFilter.payType : "";
      const location = (searchFilter.location) ? searchFilter.location : "";
      const distance = (searchFilter.distance) ? searchFilter.distance : DEFAULT_DISTANCE;
      const searchLat = (searchFilter.lat) ? searchFilter.lat : lat;
      const searchLng = (searchFilter.lng) ? searchFilter.lng : lng;

      const filters = {
        user_id,
        keyword,
        category: category.join(","),
        payType,
        location,
        distance,
        lat: searchLat,
        lng: searchLng,
      };

      this.setState({filters, filterCategories: category}, () => {
        this.searchJobs(filters);
      });
    }

    this.props.dispatch({
      type: actionTypes.CLOSE_ADS
    });
  }

  componentWillUnmount() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
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

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;

    if (prevProps.jobs != this.props.jobs) {
      this.resetData();
    }

    // Get Geolocation by locaiton.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        var { filters } = this.state;
        const { lat, lng, page } = this.props.geoData;
        if (page == "ProviderHome") {
          filters.lat = lat;
          filters.lng = lng;

          this.setState({ filters }, () => {
            this.searchJobs(filters);
          });
        }
      }
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }
    }

    // Favorite.
    if (prevProps.favoriteJobs != this.props.favoriteJobs) {
      const favoJobs = this.props.favoriteJobs;
      this.setState({
        favoriteProjects: favoJobs,
        originalFavoriteProjects: [...favoJobs]
      });
    }

    // Proposals.
    if (prevProps.proposalJobs != this.props.proposalJobs) {
      const proposalJobs = this.props.proposalJobs;
      this.setState({
        proposedProjects: proposalJobs,
        originalProposedProjects: [...proposalJobs]
      });
    }

    // Apply Proposal.
    if (prevProps.applyStatus != this.props.applyStatus) {
      if (this.props.applyStatus == Status.SUCCESS) {
        this.loadNearByAds();
      } else if (this.props.applyStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }
    }

    if (prevProps.adsPlaying != this.props.adsPlaying) {
      if (this.props.applyStatus == Status.SUCCESS &&
          this.props.adsPlaying === AdsStatus.CLOSE &&
          this.state.isProposal && !this.state.menuClicked) {
          if ( level === USER_LEVEL.FREE ) {
              this.showMessage("Proposal has been successfully sent.");
              this.setState({isProposal: false});
          }
      }
      if (this.props.applyStatus == Status.SUCCESS &&
          this.props.adsPlaying === AdsStatus.CLICK &&
          this.state.isProposal && !this.state.menuClicked) {
        if ( level === USER_LEVEL.FREE ) {
          this.showMessage("Proposal has been successfully sent.");
          this.setState({isProposal: false});
        }
      }
    }
    // Search.
    if (prevProps.searchJobsStatus != this.props.searchJobsStatus) {
      if (this.props.searchJobsStatus == Status.SUCCESS) {
        this.resetData();
      } else if (this.props.searchJobsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }
    }

    // Favorite
    if (prevProps.favoriteStatus != this.props.favoriteStatus) {
      if (this.props.favoriteStatus == Status.SUCCESS) {
        //this.resetData();
        this.setState({isLoading: false});
      } else if (this.props.favoriteStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }
    }

    // unFavorite
    if (prevProps.unfavoriteStatus != this.props.unfavoriteStatus) {
      if (this.props.unfavoriteStatus == Status.SUCCESS) {
        //this.resetData();
        this.setState({isLoading: false});
      } else if (this.props.unfavoriteStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }
    }

    // Withdraw Proposal.
    if (prevProps.withdrawApplyStatus != this.props.withdrawApplyStatus) {
      if (this.props.withdrawApplyStatus == Status.SUCCESS) {
        this.showMessage("Your proposal has been withdrawn.");
        this.setState({isLoading: false});
      } else if (this.props.withdrawApplyStatus == Status.FAILURE) {
        this.onFailure(this.props.errorJobMessage);
      }
    }

    // Get Nearby Ads
    if (prevProps.getAdsStatus != this.props.getAdsStatus) {
      if (this.props.getAdsStatus == Status.SUCCESS) {
        const nearbyAds = this.props.selectedAds;
        if (nearbyAds && nearbyAds.length > 0) {
          this.setState({isLoading: false, nearbyAds: this.props.selectedAds}, () => {
            this.onSuccessApply();
          });
        } else {
          this.setState({isLoading: false});
          if (this.state.isProposal && !this.state.menuClicked) {
            if ( level === USER_LEVEL.FREE ) {
              this.showMessage("Proposal has been successfully sent.");
              this.setState({isProposal: false});
            }
          }
        }

      } else if (this.props.getAdsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
        this.onSuccessApply();
      }
    }
  }

  showMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
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

  resetData() {
    const { jobs } = this.props;
    this.setState({isLoading: false, projects: jobs, originalProjects: [...jobs]});
  }

  loadFavoriteJobs() {
    if (this.props.currentUser) {
      const user = this.props.currentUser;
      const user_id = user._id;

      this.props.dispatch({
        type: actionTypes.GET_FAVORITE_JOBS,
        user_id: user_id
      });
    }
  }

  loadApplyJobs() {
    if (this.props.currentUser) {
      const user = this.props.currentUser;
      const user_id = user._id;

      this.props.dispatch({
        type: actionTypes.GET_APPLY_JOBS,
        user_id: user_id
      });
    }
  }

  onSuccessApply() {
    const { currentUser } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;

    this.setState({
      isProposal: true,
    });
    if (!this.state.menuClicked) {
      if (level === USER_LEVEL.FREE && this.ads) {
        if (this.state.nearbyAds.length > 0) {
          if (this.ads) {
            this.ads.load(this.state.nearbyAds);
          }
        }
      } else {
        this.showMessage("Proposal has been successfully sent.");
      }
    }
  }

  onApplyProject=(project)=> {
    const { currentUser } = this.props;
    this.setState({selectedProject: project, sheetType: "apply"}, () => {
      this.applySheet.resetSheet(project, currentUser, "apply");
      this.setState({ showApplySheet: true });
    });
  }

  onApplyNow=(project, coverText, price, duration)=> {
    const user_id = this.props.currentUser._id;

    this.setState({isLoading: true, showApplySheet: false, menuClicked: false});
    this.props.dispatch({
      type: actionTypes.APPLY,
      user_id: user_id,
      project_id: project._id,
      cover_text: coverText,
      price: price,
      duration: duration
    });

    this.generateNotification(project, NOTIFICATION_TYPE.APPLY_PROJECT);
  }

  onWithdraw=(project)=> {
    Alert.alert(
      '',
      "Are you sure you want to withdraw your application?",
      [
        {text: 'Yes', onPress: () => {
          const user_id = this.props.currentUser._id;

          this.setState({isLoading: true, showApplySheet: false});
          this.props.dispatch({
            type: actionTypes.WITHDRAW_APPLY,
            user_id: user_id,
            project_id: project._id,
          });

          this.generateNotification(project, NOTIFICATION_TYPE.WITHDRAW_PROJECT);
        }},
        {text: 'No', onPress: () => { }},
      ],
      {cancelable: false},
    );
  }

  generateNotification(project, type) {
    const { currentUser } = this.props;
    const n = {
      creator: currentUser._id,
      receiver: project.creator._id,
      job: project._id,
      type: type
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n,
    });
  }

  closeApplySheet=()=> {
    this.setState({ showApplySheet: false });
  }

  onFavorite=(project)=> {
    const { currentUser } = this.props;
    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.FAVORITE,
      project_id: project._id,
      user_id: currentUser._id
    });
  }

  onUnFavorite=(project)=> {
    const { currentUser } = this.props;
    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.UNFAVORITE,
      project_id: project._id,
      user_id: currentUser._id
    });
  }

  onDetailProject=(project)=> {
    console.log("detail project");
    const { currentUser } = this.props;
    this.setState({selectedProject: project, sheetType: "detail"}, () => {
      this.applySheet.resetSheet(project, currentUser, "detail");
      this.setState({ showApplySheet: true });
    });
  }

  onChat=(project)=> {
    const creator = project.creator;
    this.props.navigation.navigate('Chat', {user_id: creator._id});
  }

  _renderForYou() {
    const { currentUser, categories } = this.props;
    const { projects } = this.state;
    return (
      <View style={styles.slide}>
        {
          (projects && projects.length > 0)
          ? <FlatList
              style={styles.listView}
              data={projects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={(<View style={{height: 80}}/>)}
              renderItem={({item, i}) => (
                <ProjectCell
                  project={item}
                  categories={categories}
                  key={i}
                  user={currentUser}
                  onApply={this.onApplyProject}
                  onFavorite={this.onFavorite}
                  onUnFavorite={this.onUnFavorite}
                  onDetail={this.onDetailProject}
                />
              )}
            />
          : <EmptyView title="No projects for you." />
        }
      </View>
    )
  }

  _renderProposals() {
    const { currentUser, categories } = this.props;
    const { proposedProjects } = this.state;
    return (
      <View style={styles.slide}>
        {
          (proposedProjects && proposedProjects.length > 0)
          ? <FlatList
              style={styles.listView}
              data={proposedProjects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={(<View style={{height: 80}}/>)}
              renderItem={({item, i}) => (
                <ProjectCell
                  project={item}
                  categories={categories}
                  key={i}
                  user={currentUser}
                  onDetail={this.onDetailProject}
                  onChat={this.onChat}
                />
              )}
            />
          : <EmptyView title="No proposals." />
        }
      </View>
    )
  }

  _renderFavorites() {
    const { currentUser, categories } = this.props;
    const { favoriteProjects } = this.state;
    return (
      <View style={styles.slide}>
        {
          (favoriteProjects && favoriteProjects.length > 0)
          ? <FlatList
              style={styles.listView}
              data={favoriteProjects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={(<View style={{height: 80}}/>)}
              renderItem={({item, i}) => (
                <ProjectCell
                  project={item}
                  categories={categories}
                  key={i}
                  user={currentUser}
                  onApply={this.onApplyProject}
                  onFavorite={this.onFavorite}
                  onUnFavorite={this.onUnFavorite}
                />
              )}
            />
          : <EmptyView title="No favorite projects." />
        }
      </View>
    )
  }

  _renderItem = ({item, index}) => (
    <JobCell
      key={item.id}
      data={item}
      onChoose={(data) => this.onChoose(data)}
    />
  );

  onEditCategory=()=> {
    this.setState({isFilterDialog: false});
    this.props.navigation.navigate(
      "CategorySelect",
      {
        categories: this.state.filterCategories,
        page: "NewProject",
        onSaveCategory: this.onSaveCategory
      });
  }

  onSaveCategory=(categories)=> {
    this.setState({filterCategories: categories, isFilterDialog: true});
  }

  render() {
    const {
      isLoading,
      filterCategories,
      selectedProject,
      isFilterDialog,
      nearbyAds,
      showApplySheet,
      menuClicked
    } = this.state;
    const { currentUser, categories } = this.props;
    const level = (currentUser && currentUser.level) ? currentUser.level : USER_LEVEL.FREE;

    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets =>
            <View style={{flex: 1, paddingTop: insets.top}} >
              { this._renderHeader() }
              <View style={styles.container}>
                <Swiper
                  style={styles.swiperWrapper}
                  ref={ref => (this.swiper = ref)}
                  showsPagination={false}
                  loop={false}
                  onIndexChanged={this.onSelectPage}
                >
                  { this._renderForYou()}
                  { this._renderProposals()}
                  { this._renderFavorites()}
                </Swiper>
              </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        {
          (level === USER_LEVEL.FREE) 
          ? <View style={Styles.adBanner} >
              <BannerAd 
                size={BannerAdSize.BANNER} 
                unitId={Platform.OS === 'ios' ? ADMOB_IOS_BANNER_ID : ADMOB_ANDROID_BANNER_ID}
                onAdFailedToLoad={(error) => console.log("ads error: ", error)}
              />
            </View>
          : null
        }
        <ApplySheet
          ref={ref => (this.applySheet = ref)}
          isVisible={showApplySheet}
          project={selectedProject}
          onApplyNow={this.onApplyNow}
          onWithdraw={this.onWithdraw}
          onClose={this.closeApplySheet}
        />
        <FilterDialog
          isVisible={isFilterDialog}
          categories={categories}
          selected={filterCategories}
          currentUser={this.props.currentUser}
          onClose={this.onCloseFilterDialog}
          onSearch={this.onSearch}
          onEditCategory={this.onEditCategory}
          onRefresh={() => this.setState({filterCategories: []})}
        />
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
        { !menuClicked && nearbyAds.length > 0 && <Ads ref={ref => (this.ads = ref)}/> }
      </View>
    );
  }
  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Header ///////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderHeader() {
    const { searchKeyword, currentPage } = this.state;
    return (
      <View>
        <TopNavBar
          title="Home"
          leftButton="menu"
          rightButton={currentPage === 0 ? "filter" : ""}
          onClickLeftButton={() => this.onMenu()}
          onClickRightButton={() => this.onFilter()}
        />
        <SearchBox
          value={searchKeyword}
          placeholder="Search..."
          onChangeText={(text) => this.search(text)}
          onClear={() => this.setState({searchKeyword: '',})}
        />
        <TopTabBar
          titles={["FOR YOU", "PROPOSED", "FAVORITES"]}
          currentPage={currentPage}
          onSelectPage={this.onSelectPage}
        />
      </View>
    )
  }

  onMenu() {
    Keyboard.dismiss();
    this.setState({menuClicked: true});
    this.props.navigation.toggleDrawer();
  }

  onFilter=()=> {
    const { currentPage } = this.state;
    if (currentPage === 0) {
      this.setState({isFilterDialog: true});
    }
  }

  onCloseFilterDialog=()=> {
    this.setState({isFilterDialog: false});
  }

  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) {
      if (this.swiper) {
        this.swiper.scrollBy(change, true);
      }
      this.setState({currentPage: page});
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Search ///////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  onSearch=(keyword, payType, location, distance)=> {
    const { currentUser, lat, lng } = this.props;

    if (location && location.length > 0) {
      const filters = {
        user_id: currentUser._id,
        keyword,
        category: this.state.filterCategories.join(","),
        payType,
        location,
        distance
      };

      this.setState({filters, isFilterDialog: false, isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          data: {
            address: location,
            page: 'ProviderHome',
          }
        });
      });
    }
    else {
      const filters = {
        user_id: currentUser._id,
        keyword,
        category: this.state.filterCategories.join(","),
        payType,
        location,
        distance,
        lat,
        lng
      };

      this.setState({isFilterDialog: false}, () => {
        this.searchJobs(filters);
      });
    }
  }

  searchJobs(filters) {
    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.SEARCH_JOBS,
      filters
    });
  }

  // Search on the local.
  search(text) {
    this.setState({searchKeyword: text});
    if (text === null || text.length === 0) {
      this.setState({
        projects: this.state.originalProjects,
        proposedProjects: this.state.originalProposedProjects,
        favoriteProjects: this.state.originalFavoriteProjects,
      });
    } else {
      const list = this.filterProjects(text.toLowerCase(), this.state.originalProjects);
      const proposals = this.filterProjects(text.toLowerCase(), this.state.originalProposedProjects);
      const favorites = this.filterProjects(text.toLowerCase(), this.state.originalFavoriteProjects);

      this.setState({
        projects: list,
        proposedProjects: proposals,
        favoriteProjects: favorites,
      });
    }
  }

  filterProjects(keyword, projects) {
    var result = [];
    for(var i = 0; i < projects.length; i++) {
      const title = projects[i].title.toLowerCase();
      const description = projects[i].description.toLowerCase();
      if (title.indexOf(keyword) >= 0 || description.indexOf(keyword) >= 0) {
        result.push(projects[i]);
      }
    }
    return result;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor
  },

  contentView: {
    flex: 1,
    paddingTop: 27,
  },

  oneRow: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  zipCodeText: {
    fontFamily: Fonts.bold,
    color: '#8d8d8d',
    fontSize: 16,
  },

  blueText: {
    fontFamily: Fonts.bold,
    color: Colors.appColor,
    fontSize: 16,
  },

  slide: {
    flex: 1,
  },

  listView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
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
    selectedAds: state.globals.selectedAds,
    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    adsPlaying: state.globals.adsPlaying,
    getAdsStatus: state.globals.getAdsStatus,
    getGeoDataStatus: state.globals.getGeoDataStatus,

    jobs: state.jobs.jobs,
    favoriteJobs: state.jobs.favoriteJobs,
    proposalJobs: state.jobs.proposalJobs,
    searchJobsStatus: state.jobs.searchJobsStatus,
    favoriteStatus: state.jobs.favoriteStatus,
    unfavoriteStatus: state.jobs.unfavoriteStatus,
    withdrawApplyStatus: state.jobs.withdrawApplyStatus,
    applyStatus: state.jobs.applyStatus,
    errorJobMessage: state.jobs.errorMessage,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderHomeScreen);
