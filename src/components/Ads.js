import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback, Dimensions, Linking
} from 'react-native';

import Images from '../theme/Images';
import Video from "react-native-video";
import FastImage from 'react-native-fast-image'
import LoadingOverlay from "./LoadingOverlay";
import {connect} from "react-redux";
import actionTypes from "../actions/actionTypes";
import {AdsStatus, Status} from "../constants";
import {getURLExtension} from "../functions";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
let liveTimer;

class Ads extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedAds: null,
            isAdsCloseShow: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.adsPlaying != this.props.adsPlaying) {
            if (this.props.adsPlaying === AdsStatus.CLICK) {
                console.log("ads click ===========>");
                this.setState({
                    selectedAds: null,
                    isAdsCloseShow: false,
                },
                () => {
                    if(liveTimer) {
                        clearTimeout(liveTimer);
                    }
                });
            }
        }
    }

    load(adsList) {
        const rand = Math.floor(Math.random() * adsList.length);
        this.setState({selectedAds: adsList[rand]}, () => {
            if(liveTimer) {
                clearTimeout(liveTimer);
            }
        });
    }

    onLoading = () => {
        // this.setState({isLoading: true,});
    }

    onCloseAds = () => {
        this.setState({
                selectedAds: null,
                isAdsCloseShow: false,
            },
            () => {
                this.props.dispatch({
                    type: actionTypes.CLOSE_ADS,
                });
                if(liveTimer) {
                    clearTimeout(liveTimer);
                }
            });
    };

    onError = () => {
        this.setState({
                selectedAds: null,
                isAdsCloseShow: false,
            },
            () => {
                if(liveTimer) {
                    clearTimeout(liveTimer);
                }
                this.getFullAds();
            }
        );
    }

    onLoadAds = () => {
        const { selectedAds } = this.state;
        let _SELF = this;
        if (selectedAds && selectedAds.mediasrc) {
            const liveTime = selectedAds.livetime * 1000;
            this.setState({isLoading: false},
                () => {
                    liveTimer = setTimeout(function () {
                        if( getURLExtension(selectedAds.mediasrc) &&
                            getURLExtension(selectedAds.mediasrc).toLowerCase() === 'gif' ) {
                            this.onCloseAds();
                        }
                        _SELF.setState({isAdsCloseShow: true});
                    }, liveTime);
                });
            this.props.dispatch({
                type: actionTypes.ADD_ADS_SHOW,
                id: selectedAds._id
            });
        }
    };

    onAdsClick = () => {
        const { selectedAds } = this.state;
        this.props.dispatch({
            type: actionTypes.ADD_ADS_CLICK,
            id: selectedAds._id
        });

        if (selectedAds.link && selectedAds.link.length > 0) {
            Linking.openURL(selectedAds.link);
        }
    };

    render() {
        const { selectedAds, isLoading, isAdsCloseShow } = this.state;
        let source = '';
        let type = '';
        let width = 0;
        let height = 0;

        if (selectedAds && selectedAds.mediasrc !== '') {
            type = selectedAds.mediatype;
            source = selectedAds.mediasrc;
            width = selectedAds.width;
            height = selectedAds.height;
        }

        return (
            (selectedAds && selectedAds.mediasrc !== '') ? (
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.onAdsClick()}>
                        <View style={styles.adsContainer}>
                            { 
                                selectedAds.mediatype == 'Video' 
                                ? <Video source={{uri: source}}
                                            style={styles.adsContentVideo}
                                            onLoadStart={() => {
                                                this.setState({isLoading: true});
                                                this.onLoading();
                                            }}
                                            onLoad={() => {
                                                this.setState({isLoading: false});
                                                this.onLoadAds();
                                            }}
                                            onEnd={() => this.onCloseAds()}
                                            resizeMode="contain"
                                    />
                                :   <FastImage
                                        source={{uri: source}}
                                        style={styles.adsContent}
                                        resizeMode="contain"
                                        onLoadStart={() => {
                                            this.setState({isLoading: true});
                                            this.onLoading();
                                        }}
                                        onLoadEnd={() => {
                                            this.setState({isLoading: false});
                                            this.onLoadAds();
                                        }}
                                    />
                                }
                            { isAdsCloseShow ? (
                                <TouchableOpacity
                                    style={Platform.OS === 'ios' ? styles.adsColseiOSButton : styles.adsCloseButton}
                                    onPress={() => this.onCloseAds()}
                                >
                                    <Image
                                        style={styles.adsCloseImage}
                                        source={Images.close_ads}
                                    />
                                </TouchableOpacity>
                            ) : null}
                        {isLoading && <LoadingOverlay/>}
                    </View>
                </TouchableWithoutFeedback>
                </View>
            ):
            (
                <></>
            )
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'black',
        left: 0,
        top: 0,
        width: screenWidth,
        height: screenHeight,
        zIndex: 1000
    },

    adsContainer: {
        
    },

    adsContentVideoTransform: {
        width: screenHeight,
        height: screenWidth,
        transform: [{ rotate: '90deg' }],
        aspectRatio: ( screenHeight ) / screenWidth
    },
    adsContentVideo: {
        width: screenWidth,
        height: screenHeight,
        aspectRatio: screenWidth / screenHeight
    },
    adsContentTransform: {
        width: screenHeight,
        height: screenWidth,
        transform: [{ rotate: '90deg' }],
    },

    adsContent: {
        width: screenWidth,
        height: screenHeight,
        resizeMode: 'contain',
    },

    adsColseiOSButton : {
        position: 'absolute',
        top: 50,
        right: 10
    },
    adsCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    adsCloseImage: {
        width: 30,
        height: 30
    }
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.currentUser,
        globals: state.globals,
        applyStatus: state.jobs.applyStatus,
        errorMessage: state.jobs.errorMessage,

        selectedAds: state.globals.selectedAds,
        getAdsStatus: state.globals.getAdsStatus,
        adsPlaying: state.globals.adsPlaying
    };
}

export default connect(mapStateToProps,mapDispatchToProps, null, {forwardRef: true})(Ads);
