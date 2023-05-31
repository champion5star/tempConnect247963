import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import Toast from 'react-native-easy-toast'
import Swiper from 'react-native-swiper'
import ProjectCell from '../../components/Cells/ProjectCell'
import TopTabBar from '../../components/TopTabBar'
import TopNavBar from '../../components/TopNavBar'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import LoadingOverlay from '../../components/LoadingOverlay'
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status, JOB_STATUS } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class ProviderMyScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      activeProjects: [],
      completedProjects: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.loadMyJobs();
  }
  
  loadMyJobs() {
    if (this.props.currentUser) {
      this.props.dispatch({
        type: actionTypes.GET_MY_JOBS,
        user_id: this.props.currentUser._id,
        user_type: this.props.currentUser.type,
      }); 
    }
  }  

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.myJobs != this.props.myJobs) {
      this.resetData();
    }
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  resetData() {
    const { myJobs } = this.props;

    var activeProjects = [];
    var completedProjects = [];

    myJobs.forEach(element => {
        if (element.status === JOB_STATUS.PROGRESSING) {
            activeProjects.push(element);
        } else {
            completedProjects.push(element);
        }
    });
    this.setState({isLoading: false, activeProjects: activeProjects, completedProjects: completedProjects});
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

  onDetailProject=(project)=> {
    this.props.navigation.navigate("DetailProject", {project: project});
  }

  onChat=(project)=> {
    const creator = project.creator;
    this.props.navigation.navigate('Chat', {user_id: creator._id});
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
              ListFooterComponent={() => (<View style={{height: 60}}/>)}
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
          (completedProjects && completedProjects.length) 
          ? <FlatList
              style={styles.listView}
              data={completedProjects}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 60}}/>)}
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
          : <EmptyView title="No completed projects." />
        }
      </View>
    )  
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
  
  render() {
    const { currentPage } = this.state;
    const { currentUser } = this.props;
    
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar title="My Jobs" leftButton="menu" onClickLeftButton={() => this.onMenu()}/>
            <TopTabBar 
              titles={["ACTIVE", "COMPLETED"]} 
              currentPage={currentPage} 
              onSelectPage={this.onSelectPage}
            />
            <View style={styles.container}>
              <Swiper 
                style={styles.swiperWrapper} 
                ref={ref => (this.swiper = ref)}
                showsPagination={false} 
                loop={false}
                onIndexChanged={this.onSelectPage}
              >
                { this._renderActive()}
                { this._renderComplete()}
              </Swiper>
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
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
    categories: state.globals.categories,
    myJobs: state.jobs.myJobs,
    errorMessage: state.jobs.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderMyScreen);