import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Fonts from '../theme/Fonts';
import Images from '../theme/Images';
import PageControl from 'react-native-page-control';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const customerData = [
    {
        image: Images.onboard_bg1,
        title: "Create your account",
        description: "When signing up, complete the form and tell us details about yourself, such as your location, work history, and projects. This will help both employers and workers know more about you.\r\n Don't forget to upload a profile photo.",
        top: 360,
        type: 'customer',
    },
    {
        image: Images.onboard_employee_bg02,
        title: "Welcome to Temp Connect",
        description: "Find the right freelancers for your important projects.",
        top: 400,
        type: 'customer',
    },
    {
        image: Images.onboard_employee_bg03,
        title: "Post jobs and do background checks",
        description: "Create job opportunities for your projects and choose workers that fit the position best. You may also opt to include background checks for your applicants.\r\nWe have partnered with Info Cubic for industry-leading background check services.\r\n\r\nWould you want to know more about Info Cubic?",
        top: 300,
        type: 'customer',
    },
    {
        image: Images.onboard_employee_bg04,
        title: "What is Info Cubic?",
        description: "Info Cubic is accredited by PBSA to perform background checks for Temp Connect.",
        top: 230,
        type: 'customer',
    },
];

const freelancerData = [
    {
        image: Images.onboard_bg1,
        title: "Create your account",
        description: "When signing up, complete the form and tell us details about yourself, such as your location, work history, and projects. This will help both employers and workers know more about you.\r\n Don't forget to upload a profile photo.",
        top: 360,
        type: 'freelancer',
    },
    {
        image: Images.onboard_freelancer_bg02,
        title: "Welcome to Temp Connect",
        description: "Find the right job for you and connect with employers.",
        top: 400,
        type: 'freelancer',
    },
    {
        image: Images.onboard_freelancer_bg03,
        title: "Apply for jobs",
        description: "Find openings that fit your skills, apply and wait for employers to award it to you. Make sure that you provided enough information that will put you ahead of your competitors.",
        top: 325,
        type: 'freelancer',
    }
];

export default class Onboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          pageIndex: 0,
        }
    }
      
    onPressNext=()=> {
        const type = this.props.type;
        const data = (type === 'customer') ? customerData : freelancerData;

        if (this.state.pageIndex < data.length - 1 ) {
            this._carousel.snapToNext(true)
        } else {
            this.props.onSkip();
        }        
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={[styles.cellImage,  (item.type === 'customer' && index === 2) ? {top: -50} : {}]}/>
                <Text style={[styles.title, (item.type === 'customer' && index === 2) ? {marginTop: item.top - 40} : {marginTop: item.top}]}>{ item.title }</Text>
                <Text style={[styles.descriptionText, { paddingHorizontal: 30 } ]}>{ item.description }</Text>

                {
                    (item.type === 'customer' && index === 2) &&
                    <Text style={styles.noteText}>
                        <Text style={styles.boldText}>Note: </Text>Take note that when employers require applications to undergo a background check, the employer will be charged for it. The application will not pay for it.
                    </Text>
                }

                {
                    (item.type === 'customer' && index === 3) &&
                    <View>
                        <View style={styles.cellView}>
                            <Text style={styles.subTitleText}>How to use Info Cubic</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.descriptionText}>Sign up at</Text>
                                <TouchableOpacity onPress={() => this.props.onLink("https://infocubic.com/temp-connect")}><Text style={styles.linkText}>https://infocubic.com/temp-connect</Text></TouchableOpacity>
                            </View>                 
                            <Text style={styles.descriptionText}>to get started.</Text>
                            <Text style={[styles.descriptionText, {marginTop: 20}]}>Choose your industry, let Info Cubic know that you are authorized to request an account on behalf of your organization, and sign the agreement.</Text>           

                            <Text style={[styles.subTitleText, {marginTop: 20}]}>Get Started</Text>
                            <Text style={styles.descriptionText}>Start creating your profile, post opportunities or apply for jobs, and connect with people.</Text>           
                        </View>    
                    </View>
                }

                {
                    (item.type === 'freelancer' && index === 2) &&
                    <Text style={styles.noteText}>
                        <Text style={styles.boldText}>Note: </Text>If an employer wants you to undergo a background check, the employer will be charged for it. You won't pay for it.
                    </Text>
                }
            </View>
        );
    }

    render() {
        const { pageIndex } = this.state;
        const type = this.props.type;
        const data = (type === 'customer') ? customerData : freelancerData;

        return (
            <View style={styles.container}>
                <SafeAreaView>
                    <View style={{alignItems: 'flex-end', height: '100%'}}>
                        <TouchableOpacity style={styles.skipButton} onPress={this.props.onSkip}>
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={data}
                            renderItem={this._renderItem}
                            sliderWidth={width}
                            itemWidth={width}
                            onSnapToItem={(index) => this.setState({ pageIndex: index }) }
                        />
                        <PageControl
                            style={{position:'absolute', left:0, right:0, bottom: 50}}
                            numberOfPages={data.length}
                            currentPage={pageIndex}
                            hidesForSinglePage
                            pageIndicatorTintColor='lightgray'
                            currentPageIndicatorTintColor='gray'
                            indicatorStyle={{borderRadius: 5}}
                            currentIndicatorStyle={{borderRadius: 5}}
                            indicatorSize={{width:8, height:8}}
                        />
                    </View>                
                </SafeAreaView>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: height,
        backgroundColor: 'white',
        zIndex: 10,
    },

    skipButton: {
        marginTop: 20,
        marginRight: 20,
    },  

    skipButtonText: {
        fontFamily: Fonts.regular,
        color: '#323232',
        fontSize: 18,
        textTransform: 'uppercase',
        textAlign: 'right',
    },

    slide: {
        width: width,
        height: width * (1604 / 1125),
    },
    
    title: {
      fontFamily: Fonts.semiBold,
      fontSize: 20,
      color: '#070707',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    
    descriptionText: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: '#070707',
      textAlign: 'center',
    },

    noteText: {
        fontFamily: Fonts.light,
        fontSize: 14,
        color: '#070707',
        marginTop: 20,
        textAlign: 'center',
        paddingHorizontal: 30,
    },

    boldText: {
        fontFamily: Fonts.bold,
    },

    subTitleText: {
        fontFamily: Fonts.semiBold,
        fontSize: 17,
        color: '#070707',
    },

    linkText: {
        marginLeft: 5,
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: '#65c4c5',
    },

    cellView: {
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: 20,
    },

    cellImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: width * (1604 / 1125),
    },

    footer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row', 
        width: '100%', 
        justifyContent: 'center', 
        alignContent: 'center', 
    }
});