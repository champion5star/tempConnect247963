import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import { WebView } from 'react-native-webview';
import { checkInternetConnectivity } from '../functions'
import Messages from '../theme/Messages'
import { TOAST_SHOW_TIME } from '../constants.js'

export default class PrivacyScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: null,
    }
  }

  async componentDidMount() {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({link: 'https://tempconnect.app/privacy-policy.html'})
    } else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color='#009688'
        size='large'
        style={styles.ActivityIndicatorStyle}
      />
    );
  }
 

  render() {
    const { link } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <View style={styles.container}>
                <TopNavBar title="Privacy Policy" onClickLeftButton={() => this.onBack()}/>
                {
                  link &&
                  <WebView 
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    renderLoading={this.ActivityIndicatorLoadingView} 
                    startInLoadingState={true}  
                    style={styles.webView}
                    source={{ uri: link }} 
                  />  
                }
              </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  ActivityIndicatorStyle:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  
  }
})
