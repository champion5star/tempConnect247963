/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import {store, persistor} from './src/store';
import { LogBox } from 'react-native';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import RootComponent from './RootComponent';

export default class Root extends Component {
  constructor() { 
    super(); 
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    Text.defaultProps = {allowFontScaling: false};
    TextInput.defaultProps = {allowFontScaling: false};
  }
  
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<View><Text>Loading</Text></View>} persistor={persistor}>
          <RootComponent />
        </PersistGate>
      </Provider>
    );
  }
};