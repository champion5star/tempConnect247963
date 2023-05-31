import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Toast from 'react-native-easy-toast'
import Pdf from 'react-native-pdf';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import { checkInternetConnectivity } from '../../functions'
import { TOAST_SHOW_TIME } from '../../constants.js'
import Messages from '../../theme/Messages'

const sWidth = Dimensions.get('window').width;

export default class PDFViewerScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        name: null,
        url: null,
    }
  }

  async componentDidMount() {
    if (this.props.route.params && this.props.route.params.url) {
      const { url, name } = this.props.route.params;
      this.setState({url, name});
    }

    const isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { name, url } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <View style={styles.container}>
                <TopNavBar title={name} onClickLeftButton={() => this.onBack()}/>
                <Pdf
                  source={{uri: url}}
                  onLoadComplete={(numberOfPages,filePath)=>{
                    console.log(`number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page,numberOfPages)=>{
                    console.log(`current page: ${page}`);
                  }}
                  onError={(error)=>{
                    console.log(error);
                  }}
                  onPressLink={(uri)=>{
                    console.log(`Link presse: ${uri}`)
                  }}
                  style={styles.pdf}
                />
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

  pdf: {
    flex: 1,
    width: sWidth,
    backgroundColor: 'white',
  }
})
