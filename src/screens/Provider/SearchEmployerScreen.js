import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import SearchBox from '../../components/SearchBox'
import EmployerCell from '../../components/Cells/EmployerCell'
import EmptyView from '../../components/EmptyView'
import UserFilterDialog from '../../components/Modal/UserFilterDialog'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, USER_TYPE } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Messages from '../../theme/Messages'

class SearchEmployerScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      employers: [],
      keyword: null,
      isFilterDialog: false,
      filter: {
        location: null,
        distance: 100,
        lat: 0,
        lng: 0,
      },
    }
  }

  componentDidMount() {
    const { lat, lng, currentUser } = this.props;
    const { filter } = this.state;

    if (lat == 0 && lng == 0) {
      if (currentUser && currentUser.geolocation) {
        filter.lat = currentUser.geolocation.coordinates[1];
        filter.lng = currentUser.geolocation.coordinates[0];
      }      
    }
    else {
      filter.lat = lat;
      filter.lng = lng;
    }
    
    this.setState({filter}, () => {
      this.searchEmployers();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geolocation by locaiton.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { lat, lng, page } = this.props.geoData;
        if (page == "SearchEmployer") {
          const { filter } = this.state; 
          filter.lat = lat;
          filter.lng = lng;
          this.setState({ filter }, () => {
            this.searchEmployers();
          });
        }
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }
    }

    // Search Employers.
    if (prevProps.searchEmployersStatus != this.props.searchEmployersStatus) {
      if (this.props.searchEmployersStatus == Status.SUCCESS) {
        this.setState({isLoading: false, employers: this.props.employers});
      } 
      else if (this.props.searchEmployersStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }
    }
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

  render() {
    const { lat, lng } = this.props;
    const { isLoading, isFilterDialog, filter, employers } = this.state;
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {insets =>
          <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar
              title="Search Employers"
              leftButton="menu"
              rightButton="filter"
              onClickLeftButton={this.onMenu}
              onClickRightButton={this.onShowFilter}
            />
            <View style={styles.container}>
              { this._renderSearchBox() }
              { 
                (employers && employers.length > 0) 
                ? <FlatList
                    style={styles.listView}
                    data={employers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                      <EmployerCell
                        data={item}
                        key={i}
                        lat={lat}
                        lng={lng}
                        onSelect={this.onSelectEmployer}
                      />
                    )}
                  />
                : <EmptyView title="No employers." />
              }
            </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <UserFilterDialog
          isVisible={isFilterDialog}
          ref={ref => (this.filterDialog = ref)}
          filter={filter}
          userType={USER_TYPE.CUSTOMER}
          onClose={this.onCloseFilterDialog}
          onSearch={this.onSearch}
          onRefresh={this.onResetFilter}
        />
        <Toast ref={ref => (this.toast = ref)} />
        { isLoading && <LoadingOverlay />  }
      </View>
    );
  }

  onMenu=()=> {
    this.props.navigation.toggleDrawer();
  }

  onSelectEmployer=(data)=> {
    this.props.navigation.navigate("DetailCustomer", {user: data});
  }

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////// Filter //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  onShowFilter=()=> {
    const { filter } = this.state;
    if (this.filterDialog) {
      this.filterDialog.setFilter(filter);
    }
    this.setState({isFilterDialog: true});
  }

  onCloseFilterDialog=()=> {
    this.setState({isFilterDialog: false});
  }

  onResetFilter=()=> {
    const { lat, lng } = this.props;
    this.setState({
      filter: {
        location: null,
        distance: 100,
        lat,
        lng,
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Search Box /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  _renderSearchBox() {
    const { keyword } = this.state;
    return (
      <View style={{marginTop: 15}}>
        <SearchBox
          value={keyword}
          placeholder="Search employers..."
          onChangeText={(text) => this.setState({keyword: text})}
          onSubmitEditing={this.searchEmployers}
          onClear={() => this.onClearSearch()}
        />
      </View>
    )
  }

  onClearSearch() {
    this.setState({keyword: null}, () => {
      this.searchEmployers();
    });
  }

  onSearch=(location, distance)=> {
    const { filter } = this.state;
    filter.location = location;
    filter.distance = distance;

    this.setState({isFilterDialog: false, isLoading: true, filter});
    if (location && location.length > 0) {
      this.props.dispatch({
        type: actionTypes.GET_GEODATA,
        data: {
          address: location,
          page: 'SearchEmployer',
        }
      });
    }
    else {
      this.searchEmployers();
    }
  }

  searchEmployers=()=> {
    this.setState({isLoading: true});
    const { filter, keyword } = this.state;
    
    this.props.dispatch({
      type: actionTypes.SEARCH_EMPLOYERS,
      data: {
        keyword,
        location: filter.location,
        distance: filter.distance,
        lat: filter.lat,
        lng: filter.lng
      },
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    employers: state.user.employers,
    searchEmployersStatus: state.user.searchEmployersStatus,
    errorUserMessage: state.user.errorMessage,

    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchEmployerScreen);
