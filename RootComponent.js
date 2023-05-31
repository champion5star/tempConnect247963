/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';

import {
  View,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'
import { Status } from './src/constants';
import Ads from './src/components/Ads';

class RootComponent extends Component {
  constructor() {
    super();
    this.state = {
      nearbyAds: [],
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    // Get Nearby Ads
    if (prevProps.getAdsStatus != this.props.getAdsStatus) {
      if (this.props.getAdsStatus == Status.SUCCESS) {
        const nearbyAds = this.props.selectedAds;
        if (nearbyAds && nearbyAds.length > 0) {
          this.setState({ nearbyAds });
          if (this.ads) {
            this.ads.load(nearbyAds);
          }            
        }
      }
    }
  }

  render() {
    const { nearbyAds } = this.state;
    return (
      <View style={{flex: 1}}>
        <AppNavigator />
        { nearbyAds.length > 0 && <Ads ref={ref => (this.ads = ref)}/> }
      </View>
    );
  }
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    selectedAds: state.globals.selectedAds,
    adsPlaying: state.globals.adsPlaying,
    getAdsStatus: state.globals.getAdsStatus,
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(RootComponent);
