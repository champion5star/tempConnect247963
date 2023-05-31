import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Text, 
    TextInput, 
    Keyboard, 
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Moment from 'moment';
import Modal from "react-native-modal";
import RoundButton from './RoundButton';
import { DATE_TIME_FORMAT } from '../constants';
import { filterOnlyDigits } from '../functions'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Styles from '../theme/Styles';
import Messages from '../theme/Messages';

export default class ApplySheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
          coverText: null,
          price: null,
          duration: null,
          errorMessage: null,
          isApplyAlready: false,
        }
    }

    resetSheet(project, user, type) {
        if (project) {
            if (type === "detail") {
                project.proposals.forEach(element => {
                    if (element.creator === user._id) {
                        const coverText = element.coverText ? element.coverText : ''; 
                        const duration = element.duration ? element.duration.toString() : ''; 
                        const price = element.price ? element.price.toString() : ''; 
    
                        this.setState({
                            coverText,
                            duration,
                            price,
                            isApplyAlready: true,
                        })
                        return;
                    }
                });
            } 
            else {
                var duration = "";
                if (project.duration && project.duration > 0) {
                    duration = project.duration.toString();
                }
    
                var price = (project && project.initialPrice) ? project.initialPrice : "";
                if (price.indexOf("-") >= 0) {
                    const array = price.split("-");
                    if (array && array.length > 0) {
                        price = array[0];
                    }
                }

                this.setState({ 
                    coverText: '',
                    price: price.toString(),
                    duration,
                    isApplyAlready: false,
                });
            }
        }
    }

    render() {
        const { isVisible, onClose } = this.props;

        return (
                <Modal 
                    onBackButtonPress={onClose}
                    onBackdropPress={onClose}
                    isVisible={isVisible}
                    style={Platform.OS === 'ios' ? styles.iOSContainer : {margin: 0, flex: 1}}
                >
                    {
                        Platform.OS === 'ios'
                        ? <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                { this._renderContent() }
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                        : <View style={styles.androidContainer}>
                            <KeyboardAwareScrollView>
                                { this._renderContent() } 
                            </KeyboardAwareScrollView>
                        </View>
                    }
                </Modal>
        );
    }

    _renderContent() {
        const { coverText, duration, price, isApplyAlready, errorMessage } = this.state;
        const { project, onClose, onWithdraw } = this.props;

        const payType = (project && project.payType) ? project.payType : "";
        const type = (project && project.type) ? project.type : "";
        const time = (project && project.createdAt) ? Moment(project.createdAt).format(DATE_TIME_FORMAT) : "";
        const isCheckCubic = (project && project.isCheckCubic) ? project.isCheckCubic : false;
        const infoCubicPackage = (project && project.infoCubicPackage) ? project.infoCubicPackage : "";
        const title = (project && project.title) ? project.title : "";
        const description = (project && project.description) ? project.description : "";
        const skills = (project && project.skills) ? project.skills : [];
        const location = (project && project.location) ? project.location : "";

        return (
            <View style={styles.contentView}>
                <View style={styles.header}>
                    <View style={[styles.oneRow, {width: '90%'}]}>
                        <Text style={styles.typeText}>{payType}</Text>
                        <Text style={styles.typeText}>{type}</Text>
                        <Text style={styles.dateText}>{time}</Text>
                    </View>       
                    <TouchableOpacity onPress={onClose}>
                        <Image source={Images.close_icon} style={styles.closeIcon}/>
                    </TouchableOpacity>             
                </View>
                {
                isCheckCubic &&
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={Images.cubic_logo} style={styles.cublicLogo} />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.infoCubicPackageText}>- {infoCubicPackage}</Text>
                </View>                      
                }
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
                <View style={styles.skillsContainer}>
                    {
                        skills.map((skill, i) =>
                            <Text style={styles.skillCell} key={i.toString()}>{skill}</Text>
                        )
                    }
                </View>
                {
                    (location && location.length > 0)
                    ? <View style={styles.locationContainer}>
                        <Image source={Images.icon_location} style={styles.locationIcon}/>
                        <Text style={styles.locationText}>{location}</Text>
                    </View> 
                    : null
                }
                <View style={styles.coverContainer}>
                    <Text style={styles.coverTitle}>Cover Letter</Text>
                    {
                        isApplyAlready 
                        ? <Text style={styles.coverText}>{coverText}</Text>
                        : <TextInput 
                                placeholder="Add a cover letter..." 
                                style={styles.coverTextInput}
                                underlineColorAndroid='transparent'
                                value={coverText}
                                multiline={true}
                                numberOfLines={6}
                                editable={!isApplyAlready}
                                onChangeText={(text) => this.setState({coverText: text, errorMessage: null})}
                            />
                    }

                    
                </View>
                <View style={styles.footer}>
                    <View style={[styles.oneRow, {justifyContent: 'space-between'}]}>
                        <View style={styles.oneRow}>
                            <Text style={styles.priceText}>$</Text>
                            <TextInput 
                                value={price}
                                keyboardType='numeric'
                                style={[styles.durationTextInput, {width: 80}]}
                                underlineColorAndroid='transparent' 
                                editable={!isApplyAlready}
                                maxLength={7}
                                onChangeText={(text) => this.setState({price: text, errorMessage: null})}
                            />
                            <Text style={styles.payTypeText}>/ {payType}</Text>
                        </View>
                        <View style={styles.oneRow}>
                            <Text style={styles.durationLabel}>Total </Text>
                            <Text style={styles.durationLabel}>{payType === "Fixed" ? "Days" : "Hours"}</Text>                                
                            <TextInput 
                                value={duration ? duration.toString() : ""}
                                maxLength={5}
                                keyboardType='numeric'
                                style={styles.durationTextInput}
                                underlineColorAndroid='transparent' 
                                editable={!isApplyAlready}
                                onChangeText={(text) => this.setState({duration: filterOnlyDigits(text), errorMessage: null})}
                            />
                        </View>
                    </View>
                    { errorMessage && <Text style={[Styles.errorText, {marginTop: 20, marginBottom: 0, padding: 0}]}>{errorMessage}</Text> }                        
                    <RoundButton 
                        title={isApplyAlready ? "Withdraw Proposal" : "Apply Now"} 
                        theme="gradient" 
                        style={{marginTop: 20}} 
                        onPress={() => {
                            if (isApplyAlready) {
                                onWithdraw(project)
                            } else {
                                this.onApply()
                            }                            
                        }} 
                    />
                </View>
            </View>
        )
    }

    onApply() {
        Keyboard.dismiss();

        const { coverText, price, duration } = this.state;
        var isValid = true;

        if (coverText == null || coverText.trim().length == 0) {
            this.setState({errorMessage: Messages.InvalidCoverLetter});
            isValid = false;
            return;
        }

        if (price === null || price === "" || isNaN(price) || parseFloat(price) <= 0) {
            this.setState({errorMessage: Messages.InvalidPrice});
            isValid = false;
            return;
        }

        if (duration === null || duration.length === 0 || parseInt(duration) <= 0) {
            this.setState({errorMessage: Messages.InvalidDuration});
            isValid = false;
            return;
        }

        if (isValid) {
            this.props.onApplyNow(this.props.project, coverText, parseFloat(price), parseInt(duration));
        }
    }
}

const styles = StyleSheet.create({
    iOSContainer: {
        margin: 0,
        justifyContent: 'flex-end',
    },

    androidContainer:{
        width: '100%',
        bottom: 0,
        position: 'absolute',
        justifyContent: 'flex-end',
    },
    
    contentView: {
        backgroundColor: 'white',
        paddingTop: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },

    typeText: {
        fontFamily: Fonts.light,
        fontSize: 14,
        backgroundColor: '#67c7c5',
        color: 'white',    
        paddingVertical: 3,
        paddingHorizontal: 13,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
        marginBottom: 10,
    },

    dateText: {
        fontFamily: Fonts.regular,   
        color: 'gray',
        fontSize: 14,
        marginTop: 2,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 22,
        color: '#343663',
        marginTop: 10,
        marginBottom: 10,
        lineHeight: 24,
        paddingHorizontal: 20,
    },

    descriptionText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.subTextColor,
        marginBottom: 15,
        paddingHorizontal: 20,
    },

    oneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    statusText: {
        fontFamily: Fonts.regular,
        color: '#9ea6c1',
        fontSize: 12,
    },

    closeIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
    },

    locationContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 5,
    },

    skillCell: {
        color: 'white',
        backgroundColor: Colors.appColor,
        marginRight: 5,
        marginBottom: 5,
        paddingVertical: 4,
        paddingHorizontal: 10, 
        borderRadius: 12,
        overflow: 'hidden',
    },

    coverContainer: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        paddingVertical: 10,
        marginVertical: 20,
        paddingHorizontal: 20,
    },

    coverTitle: {
        fontFamily: Fonts.regular,
        fontSize: 16,
    },

    coverTextInput: {
        marginTop: 5,
        fontFamily: Fonts.regular,
        color: Colors.textColor,
        height: 150,
        textAlignVertical: "top",
    },

    coverText: {
        marginTop: 5,
        fontFamily: Fonts.regular,
        color: Colors.textColor,
    },

    footer: {
        paddingHorizontal: 20,
        marginBottom: 20
    },

    priceText: {
        fontFamily: Fonts.regular,
        color: Colors.appColor,
        fontSize: 24,
    },

    payTypeText: {
        fontFamily: Fonts.regular,
        color: Colors.subTextColor,
        fontSize: 16,
        marginLeft: 5,
        marginTop: 5,
    },

    durationLabel: {
        fontFamily: Fonts.regular,
        color: Colors.subTextColor,
        fontSize: 16,
    },

    durationTextInput: {
        fontFamily: Fonts.regular,
        fontSize: 18,
        textAlign: 'center',
        color: Colors.textColor,
        backgroundColor: '#f3f3f3',
        paddingHorizontal: 5,
        width: 50,
        height: (Platform.OS === 'ios') ? 35 : 'auto',
        marginHorizontal: 5,
        borderRadius: 10,
    },
    cublicLogo: {
        width: 100,
        height: 21,
        marginTop: 7,
        marginLeft: 18,
        resizeMode: 'contain',
    },

    infoCubicPackageText: {
        fontFamily: Fonts.regular,
        marginLeft: 5,
        marginTop: 8,
        width: '63%',
    },

    locationIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    locationText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: 'gray',
        marginLeft: 5,
    },
});