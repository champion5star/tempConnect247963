import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundImage from '../components/BackgroundImage'
import TopNavBar from '../components/TopNavBar'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';

const FAQs = {
  customer: [
    {
      title: 'How do I hire on Temp Connect?',
      content: 'Sign up on Temp Connect, post a new project, and wait for someone to apply. Then, communicate with your preferred applicant and award the project.'
    },
    {
      title: 'How do I post a project?',
      content: `You can post a project by tapping on the side menu, then choose "Home". Select the " + " button on the upper right corner and fill out the needed details of the project. Once you're done, tap on "Post Job".\r\n\r\nMake sure that you provide enough information about your project.\r\n\r\nIf you want to conduct background checks on applicants of the project, choose "Check Background Screen". Please note that only employers pay the fee, not freelancers.`
    },
    {
      title: 'Can Temp Connect conduct background checks to applicants?',
      content: `Temp Connect partnered with PSBA-accredited Info Cubic to perform background checks on your applicants. You can read more about it at https://infocubic.com/temp-connect\r\n\r\nPlease note that only employers will pay for the background check fee, not freelancers.`
    },
    {
      title: 'How do I edit a project?',
      content: `You can edit an open project by tapping on the side menu, then on "Home". Select "Open" and tap on "Edit" on the project you want to update.`
    },
    {
      title: 'How do I delete a project?',
      content: `You can delete an open project by tapping on the side menu, then under "Home"  menu, select "Open" and tap on "Edit". Look for trash icon respective to the project you want to delete.`
    },
    {
      title: 'How do I send a message to a freelancer?',
      content: `If a freelancer applied to your project, send them a message by going to their profile and selecting "Send Message".`
    },
    {
      title: 'How do I deposit funds in my account?',
      content: `- Go to the slide menu, then choose "Payment".\r\n\- Tap "Deposit" on the upper right corner.\r\n- Choose where you want to deposit from.`
    },
    {
      title: 'How do I change my password?',
      content: `On the slide menu, tap "Change Password".`
    },
    {
      title: 'How do I edit my profile?',
      content: `On the slide menu, tap on your profile picture on the upper left corner.`
    },
    {
      title: 'Should I pay an hourly or a fixed rate?',
      content: `The answer to this depends on your requirements.`
    },
  ],
  provider: [
    {
      title: 'How do I start working in Temp Connect?',
      content: 'Sign up on Temp Connect, search for a project that requires your skills, and wait for the employer to respond to your application.'
    },
    {
      title: 'How do I get employers to notice me?',
      content: `Stand out from other workers by including important details about you, such as your skills and experience.`
    },
    {
      title: 'Where can I edit my profile?',
      content: `On the slide menu, tap on your profile picture to go to your profile screen, where you can make changes.`
    },
    {
      title: 'How can I search for jobs on Temp Connect?',
      content: `Type in what you are looking for on the app homepage.`
    },
    {
      title: 'How can I apply for a job post?',
      content: `Once you see a job post, tap on Apply to see more details and select Apply Now. Make sure to add a cover letter about why the employer should choose you among other applicants.`
    },
    {
      title: 'How do I send a message to the employer if I have questions about the project?',
      content: `You can send message to the employer who posted the job by tapping on Chat, under Home > Proposed and My Jobs > Active.`
    },
    {
      title: 'How do I get hired?',
      content: `When you apply for a project and the employer awards it to you, you can see it in "My Jobs". You can find it in the slide menu.`
    },
    {
      title: 'Where can I find job posts that I applied to?',
      content: `You can find it on the app homepage, under "Proposed".`
    },
    {
      title: 'How do I save a job post that I want to apply in the future?',
      content: `You can tap on the heart button on the upper right side of the job post.`
    },
    {
      title: 'Where can I find job posts that I saved?',
      content: `You can find it on the app homepage, under "Favorites".`
    },
    {
      title: 'Where can I find my earnings?',
      content: `You can find it in the slide menu.`
    },
    {
      title: 'The employer wants me to undergo a background check. Do I have to pay for it?',
      content: `No. Employers will be charged for background checks.`
    },
  ]
}

class FAQScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        activeSections: [],
    }    
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  _renderHeader(section, index, isActive, sections) {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
      >
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive, sections) {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
      >
        <Text
          duration={300}
          easing="ease-out"
          animation={isActive ? 'zoomIn' : false}
          style={styles.contentText}
        >
          {section.content}
        </Text>
      </Animatable.View>
    );
  }

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    const { currentUser } = this.props;
    return (
      <View style={{flex: 1}}>
        <BackgroundImage/>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="FAQs" 
                leftButton="menu" 
                onClickLeftButton={() => this.onMenu()}
              />
              <View style={styles.container}>
                <ScrollView style={{ padding: 20 }} scrollIndicatorInsets={{ right: 1 }}>
                  <View style={{marginBottom: 20}}>
                  <Accordion
                      sections={FAQs[currentUser.type]}
                      underlayColor={'transparent'}
                      sectionContainerStyle={{marginBottom: 15, borderRadius: 10, backgroundColor: 'white'}}
                      activeSections={this.state.activeSections}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                      onChange={this._updateSections}
                  />
                  </View>
                </ScrollView>
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
    backgroundColor: Colors.pageColor,
  },

  headerText: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  contentText: {
    flex: 1,
    fontFamily: Fonts.light,
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    errorMessage: state.user.errorMessage,
    changePasswordStatus: state.user.changePasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(FAQScreen);