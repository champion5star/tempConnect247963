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
import EmployeeCell from '../../components/Cells/EmployeeCell'
import EmptyView from '../../components/EmptyView'
import UserFilterDialog from '../../components/Modal/UserFilterDialog'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import Messages from '../../theme/Messages'
import { 
  TOAST_SHOW_TIME, 
  Status,
  USER_TYPE,
} from '../../constants.js'

class SearchEmployeeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      employees: [],
      keyword: null,
      isFilterDialog: false,
      filter: {
        categories: [],
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
      this.searchEmployees();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geolocation by locaiton.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { lat, lng, page } = this.props.geoData;
        if (page == "SearchEmployee") {
          const { filter } = this.state; 
          filter.lat = lat;
          filter.lng = lng;
          this.setState({ filter }, () => {
            this.searchEmployees();
          });
        }
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }
    }

    // Search Employees.
    if (prevProps.searchEmployeesStatus != this.props.searchEmployeesStatus) {
      if (this.props.searchEmployeesStatus == Status.SUCCESS) {
        this.setState({isLoading: false, employees: this.props.employees});
      } 
      else if (this.props.searchEmployeesStatus == Status.FAILURE) {
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
    const { categories } = this.props;
    const { isLoading, isFilterDialog, filter, employees } = this.state;
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
        {insets =>
          <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar
              title="Search Employees"
              leftButton="menu"
              rightButton="filter"
              onClickLeftButton={this.onMenu}
              onClickRightButton={this.onShowFilter}
            />
            <View style={styles.container}>
              { this._renderSearchBox() }
              { 
                (employees && employees.length > 0) 
                ? <FlatList
                    style={styles.listView}
                    data={employees}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                      <EmployeeCell
                        data={item}
                        key={i}
                        onSelect={this.onSelectEmployee}
                      />
                    )}
                  />
                : <EmptyView title="No employees." />
              }
            </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <UserFilterDialog
          isVisible={isFilterDialog}
          ref={ref => (this.filterDialog = ref)}
          userType={USER_TYPE.CUSTOMER}
          filter={filter}
          categories={categories}
          onClose={this.onCloseFilterDialog}
          onSearch={this.onSearch}
          onEditCategory={this.onEditCategory}
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

  onSelectEmployee=(data)=> {
    this.props.navigation.navigate("DetailProvider", {provider: data});
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
        categories: [],
        location: null,
        distance: 100,
        lat,
        lng,
      }
    });
  }

  onEditCategory=(location, distance, categories)=> {
    const { filter } = this.state;
    if (location && location.length > 0) {
        filter.location = location;
    }

    if (distance && distance.length > 0) {
        filter.distance = distance;
    }

    if (categories && categories.length > 0) {
        filter.categories = categories;
    }

    this.setState({filter, isFilterDialog: false});
    this.props.navigation.navigate(
      "CategorySelect",
      {
        categories: filter.categories,
        page: "NewProject",
        onSaveCategory: this.onSaveCategory
      }
    );
  }

  onSaveCategory=(categories)=> {
    const { filter } = this.state;
    filter.categories = categories;
    this.setState({ filter, isFilterDialog: true}, () => {
        if (this.filterDialog) {
          this.filterDialog.setFilter(filter);
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
          placeholder="Search employees..."
          onChangeText={(text) => this.setState({keyword: text})}
          onSubmitEditing={this.searchEmployees}
          onClear={() => this.onClearSearch()}
        />
      </View>
    )
  }

  onClearSearch() {
    this.setState({keyword: null}, () => {
      this.searchEmployees();
    });
  }

  onSearch=(location, distance, categories)=> {
    const { filter } = this.state;
    filter.location = location;
    filter.distance = distance;
    filter.categories = categories;

    this.setState({isFilterDialog: false, isLoading: true, filter});
    if (location && location.length > 0) {
      this.props.dispatch({
        type: actionTypes.GET_GEODATA,
        data: {
          address: location,
          page: 'SearchEmployee',
        }
      });
    }
    else {
      this.searchEmployees();
    }
  }

  searchEmployees=()=> {
    this.setState({isLoading: true});
    const { filter, keyword } = this.state;
    
    this.props.dispatch({
      type: actionTypes.SEARCH_EMPLOYEES,
      data: {
        keyword,
        location: filter.location,
        distance: filter.distance,
        categories: filter.categories,
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
    employees: state.user.employees,
    searchEmployeesStatus: state.user.searchEmployeesStatus,
    errorUserMessage: state.user.errorMessage,

    categories: state.globals.categories,
    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchEmployeeScreen);
