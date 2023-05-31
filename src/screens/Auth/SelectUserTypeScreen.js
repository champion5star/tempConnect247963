import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import BackgroundImage from '../../components/BackgroundImage'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import Images from '../../theme/Images'
import Fonts from '../../theme/Fonts'

class SelectUserTypeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      type: 'customer',
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.user) {
      const { user } = this.props.route.params;
      this.setState({ user });
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  saveUserDetails = (userObject) => {
    this.setState({
      user: {
        company: userObject.company,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: userObject.email,
        phone: userObject.phone,
        location: userObject.location,
        password: userObject.password,
        confirmPassword: userObject.confirmPassword,
      }
    });
  }

  onContinue(type) {
    this.setState({ type: type });
    this.props.navigation.navigate('SignUp', 
      { 
        type: type, 
        user: this.state.user, 
        saveUserInput: this.saveUserDetails 
      }
    );
  }

  render() {
    const { type } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <BackgroundImage />
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavBar title="" onClickLeftButton={() => this.onBack()} />
          <View style={styles.container}>
            <Image source={Images.logo} style={styles.logoImage} />
            <Text style={styles.titleText}>Hire experts online for any of your projects.</Text>
            <Text style={styles.subTitleText}>Millions of small businesses use freelancers to turn their ideas into reality.</Text>
            <RoundButton
              title="I Want To Hire"
              theme={type === "customer" ? "white" : "outline"}
              style={{ width: '100%', marginTop: 20 }}
              onPress={() => this.onContinue('customer')}
            />

            <RoundButton
              title="I Want To Work"
              theme={type === "provider" ? "white" : "outline"}
              style={{ width: '100%', marginTop: 30 }}
              onPress={() => this.onContinue('provider')}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 35,
    ...ifIphoneX({
      paddingTop: 35,
    }, {
      paddingTop: 0,
    })
  },

  logoImage: {
    width: 170,
    height: 140,
    resizeMode: 'contain',
  },

  titleText: {
    marginTop: 50,
    fontFamily: Fonts.bold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },

  subTitleText: {
    marginVertical: 20,
    fontFamily: Fonts.light,
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
})

export default SelectUserTypeScreen;
