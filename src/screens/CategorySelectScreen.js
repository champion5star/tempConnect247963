import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Text,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import * as Storage from '../services/Storage'
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import CategoryCell from '../components/Cells/CategoryCell'
import Messages from '../theme/Messages'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'
import Styles from '../theme/Styles'
import PageTitle from '../components/Labels/PageTitle';
import RoundButton from '../components/RoundButton'

class CategorySelectScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
      selected: [],
      errorMessage: null,
    }
  }

  async componentDidMount() {
    if (this.props.route.params && this.props.route.params.categories) {
      const { categories } = this.props.route.params;
      if (categories) {
        var list = [...categories];
        this.setState({
          selected: list,
        });
      }
    }

    if (this.props.route.params && this.props.route.params.page) {
      const { page } = this.props.route.params;
      if (page == "SignUp") {
        const user = await Storage.SIGNUP_USER.get();
        if (user && user.categories) {
          var list = [...user.categories];
          this.setState({
            selected: list,
          });
        }        
      }
      this.setState({page: page});
    }
  }

  onBack() {
    const { page } = this.state;
    if (page == "NewProject" || page == "ProviderEditProfile") {
      if (this.props.route.params && this.props.route.params.onSaveCategory) {
        const { onSaveCategory } = this.props.route.params;
        onSaveCategory(this.state.selected);
      }
    } 
    else if (page == "SignUp") {
      if (this.props.route.params && this.props.route.params.user) {
        var { user } = this.props.route.params;
        user.categories = this.state.selected;
        Storage.SIGNUP_USER.set(user);
      }
    }
    this.props.navigation.goBack();
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) {
            this.onBack();
          }          
        }},
      ],
      {cancelable: false},
    ); 
  }

  onContinue() {
    const { selected, page } = this.state;
    if (page == "ProviderEditProfile") {
      this.onBack();
    } 
    else if (page == "NewProject") {
      if (selected.length === 0) {
        this.showMessage(Messages.InvalidServices, false);
        return;
      } else {
        this.onBack();
      }
    } 
    else {
      if (selected.length === 0) {
        this.setState({errorMessage: Messages.InvalidServices});
        return;
      }
      
      if (this.props.route.params && this.props.route.params.user) {
        var { user } = this.props.route.params;
        user.categories = this.state.selected;

        Storage.SIGNUP_USER.set(user);
        this.props.navigation.navigate('SignUp2', {user: user});
      }
    }
  }
  
  renderHeader=()=> {
    const { page } = this.state;
    return (
      <View style={{paddingTop: (page == "SignUp") ? 0 : 20}}>
        {
          (page == "SignUp") && <PageTitle title="What are the main services you offer to clients?" />            
        }
      </View>
    )
  }

  renderFooter=()=> {
    const { errorMessage, page } = this.state;
    return (
      <View style={{marginVertical: 20, alignItems: 'center'}} >
        {
          (page == "SignUp") &&
          <View style={{width: '100%', alignItems: 'center'}}>
            <RoundButton 
              title="Continue"
              theme="gradient" 
              style={{width: '90%'}}
              onPress={() => this.onContinue()} 
            />
            { (errorMessage && errorMessage.length > 0) && <Text style={Styles.errorText}>{errorMessage}</Text> }
          </View>
        }
      </View>
    )
  }

  onChooseItem=(category)=> {
    const { selected } = this.state;
    var isExisting = false;
    var index = 0;
    selected.forEach(item => {
      if (item == category) {
        isExisting = true;
        selected.splice(index, 1);
        return;
      }

      index ++;
    });

    if (!isExisting) {
      selected.push(category);
    } 
    this.setState({selected, errorMessage: null});
  }

  render() {
    const { selected, page } = this.state;
    const { categories } = this.props;

    var title = "Welcome!";
    var isShowDone = false;
    if (page == "ProviderEditProfile") {
      title = "Edit Categories";
      isShowDone = true;
    }
    else if (page == "NewProject") {
      title = "Select Categories";
      isShowDone = true;
    }

    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title={title} 
                rightButton={isShowDone ? "done" : null}
                onClickLeftButton={() => this.onBack()}
                onClickRightButton={() => this.onContinue()}
              />
              <View style={styles.container}>
                <View style={styles.contentView}>
                  <FlatList 
                    data={categories}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent = {this.renderHeader()}
                    ListFooterComponent = {this.renderFooter()}
                    renderItem={({ item, index }) => (
                      <CategoryCell 
                        data={item}
                        selected={selected}
                        onChoose={this.onChooseItem}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
        }
      </SafeAreaInsetsContext.Consumer>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  contentView: {
    flex: 1,
  },

  titleText: {
    color: Colors.appColor,
    fontFamily: Fonts.regular, 
    marginLeft: 20,
    fontSize: 18,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    categories: state.globals.categories,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CategorySelectScreen);