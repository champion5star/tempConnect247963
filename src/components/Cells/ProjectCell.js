import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import RoundButton from '../RoundButton'
import SmallRate from '../SmallRate';
import Images from '../../theme/Images';
import { 
    JOB_STATUS, 
    DATE_TIME_FORMAT, 
    DATE_FORMAT,
    USER_TYPE,
} from '../../constants'

class ProjectCell extends Component {
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    checkFavorite(project, user) {
        var isFavorite = false;
        project.favorites.forEach(element => {
            if (element.creator === user._id) {
                isFavorite = true;
                return;
            }
        });
        return isFavorite;
    }

    checkApply(project, user) {
        var isApply = false;
        project.proposals.forEach(element => {
            if (element.creator === user._id) {
                isApply = true;
                return;
            }
        });
        return isApply;
    }

    render() {
        const { project, user } = this.props;
        const isApply = this.checkApply(project, user);

        var bookmark = null;
        if (project.status === JOB_STATUS.COMPLETED) {
            bookmark = Images.bookmark_completed;
        } else if(project.status === JOB_STATUS.CANCELED) {
            bookmark = Images.bookmark_cancel;
        } else if(project.status === JOB_STATUS.PROGRESSING) {
            bookmark = Images.bookmark_progress;
        } else if (user.type === "customer" && project.status === JOB_STATUS.OPEN && project.proposals && project.proposals.length > 0) {
            bookmark = Images.bookmark_proposal;
        }
        return (
            <View style={styles.container}>
                { bookmark && <Image source={bookmark} style={styles.bookmark}/> }
                { this._renderHeader() }                
                {
                    project.isCheckCubic &&
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={Images.cubic_logo} style={styles.cublicLogo} />
                        <Text style={styles.infoCubicPackageText} numberOfLines={1} ellipsizeMode="tail">- {project.infoCubicPackage}</Text>
                    </View>
                }
                { this.renderCategories() }
                { this._renderContent() }                  
                <View style={styles.footer}>
                    { 
                        ((project.status === JOB_STATUS.COMPLETED || project.status === JOB_STATUS.CANCELED) && project.review) &&
                        <View style={{borderBottomColor: Colors.borderColor, borderBottomWidth: 1, marginBottom: 10}}>
                            <Text style={styles.feedbackTitle}>Feedback</Text>
                            <Text style={styles.feedbackContent}>{project.review.text}</Text>
                        </View>
                    }
                    { this._renderButtons(isApply) }
                </View>
            </View>
        );
    }

    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Header ///////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderHeader() {
        const { project, user, onFavorite, onUnFavorite } = this.props;
        const isApply = this.checkApply(project, user);
        const isFavorite = this.checkFavorite(project, user);
        var dateText = Moment(project.createdAt).format(DATE_TIME_FORMAT);
        if (project.status === JOB_STATUS.COMPLETED || project.status === JOB_STATUS.CANCELED) {
            dateText = Moment(project.createdAt).format(DATE_FORMAT) + " ~ " + Moment(project.completedAt).format(DATE_FORMAT);
        }

        return (
            <View style={styles.header}>
                <View style={styles.oneRow}>
                    <Text style={styles.typeText}>{project.payType}</Text>
                    <Text style={styles.dateText}>{dateText}</Text>
                </View>   
                <View>
                    {
                        // Favorite.
                        (user.type === "provider" && project.status === JOB_STATUS.OPEN && !isApply) &&
                        <TouchableOpacity onPress={() => {
                            if (isFavorite) {
                                onUnFavorite(project)
                            } else {
                                onFavorite(project)
                            }                                
                            }}>
                            <Image source={isFavorite ? Images.ico_favorite_selected : Images.ico_favorite} style={styles.favIcon} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    /////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Categories /////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    renderCategories() {
        const { project, categories } = this.props;
        var list = [];
        categories.forEach(c => {
        if (c.subCategories && c.subCategories.length > 0) {
            c.subCategories.forEach(item => {
            if (project.category.indexOf(item.name) >= 0) {
                list.push(item);
            }
            });
        }
        });
        return (
            <View style={styles.categoryView}>
                {
                    list.map((item, index) => {
                        return (
                            <Image 
                                key={index.toString()} 
                                source={{uri: item.icon}}
                                style={styles.categoryIcon}
                            />
                        )
                    })
                }
            </View>
        )
    }

    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Content //////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderContent() {
        const { project, user } = this.props;
        const title = (project && project.title) ? project.title : "";
        const location = (project && project.location) ? project.location : 0;
        const description = (project && project.description) ? project.description : "";
        const duration = (project && project.duration) ? project.duration : 0;
        const payType = (project && project.payType) ? project.payType : "";
        const status = (project && project.status) ? project.status : JOB_STATUS.OPEN;

        var price = (project && project.price) ? project.price : 0;
        if (status === JOB_STATUS.OPEN) {
            price = (project && project.initialPrice) ? project.initialPrice : "0";
        }

        return (
            <View style={styles.content}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>{description}</Text>
                <View style={styles.priceContainer}>
                    <View style={styles.oneRow}>
                        <Text style={styles.priceText}>$ {price}</Text>
                        <Text style={styles.priceTypeText}>/ {payType === "Fixed" ? "Fixed Price" : "Hour"}</Text>
                    </View>
                    {
                        (duration && duration > 0)
                        ? <View style={styles.oneRow}>
                            <Text style={styles.priceTypeText}>{payType === "Fixed" ? "Total Days:" : "Total Hours:"}</Text>
                            <Text style={styles.priceText}> {duration}</Text>
                        </View>
                        : null 
                    }
                </View>
                {
                    (location && location.length > 0) 
                    ? <View style={[styles.oneRow, {marginBottom: 15}]}>
                        <Image source={Images.icon_location} style={styles.locationIcon}/>
                        <Text style={styles.locationText}>{location}</Text>
                    </View>
                    : null
                }
                { 
                    ((status === JOB_STATUS.COMPLETED || status === JOB_STATUS.CANCELED) && project.review) 
                    ? <View style={{marginBottom: 15}}>
                        <SmallRate rate={project.review.score}/>
                    </View>
                    : null
                }
            </View>
        )
    }

    /////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Footer ////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderButtons (isApply) {
        const { project, user, onEdit, onApply, onDetail, onChat } = this.props;

        return (
            <View>
                {
                    (user.type === USER_TYPE.CUSTOMER && project.status === JOB_STATUS.OPEN) && 
                    <View style={[styles.oneRow, {justifyContent: 'space-between', paddingVertical: 5}]}>
                        <TouchableOpacity style={styles.detailBtn} onPress={() => onEdit(project)}>
                            <Text style={styles.detailBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBtn} onPress={() => onDetail(project)}>
                            <Text style={styles.chatBtnText}>Detail</Text>
                        </TouchableOpacity>
                    </View>                    
                }
                { 
                    (user.type === USER_TYPE.PROVIDER && project.status === JOB_STATUS.OPEN && !isApply) &&
                    <RoundButton 
                        title="APPLY"
                        theme="gradient" 
                        onPress={() => onApply(project)} 
                    />
                }
                {
                    (user.type === USER_TYPE.PROVIDER && project.status === JOB_STATUS.OPEN && isApply) &&
                    <View style={[styles.oneRow, {justifyContent: 'space-between', paddingVertical: 5}]}>
                        <TouchableOpacity style={styles.detailBtn} onPress={() => onDetail(project)}>
                            <Text style={styles.detailBtnText}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBtn} onPress={() => onChat(project)}>
                            <Text style={styles.chatBtnText}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                }                    

                { 
                    (project.status === JOB_STATUS.PROGRESSING || project.status === JOB_STATUS.COMPLETED || project.status === JOB_STATUS.CANCELED) &&
                    <View style={[styles.oneRow, {justifyContent: 'space-between', paddingVertical: 5}]}>
                        <TouchableOpacity style={styles.detailBtn} onPress={() => onDetail(project)}>
                            <Text style={styles.detailBtnText}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBtn} onPress={() => onChat(project)}>
                            <Text style={styles.chatBtnText}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                }    
            </View>
        )
    }
}

export default ProjectCell;
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        padding: 15,
        shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    typeText: {
        fontFamily: Fonts.light,
        fontSize: 12,
        backgroundColor: '#67c7c5',
        color: 'white',    
        paddingVertical: 3,
        paddingHorizontal: 13,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
    },

    dateText: {
        fontFamily: Fonts.regular,   
        color: 'gray',
        fontSize: 12,
        marginTop: 2,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: '#343663',
        marginBottom: 5,
        lineHeight: 24,
    },

    descriptionText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: '#343663',
        marginBottom: 15,
    },

    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    priceText: {
        fontFamily: Fonts.regular,
        color: Colors.greenTextColor,
        fontSize: 22,
    },

    priceTypeText: {
        fontFamily: Fonts.regular,
        color: 'gray',
        fontSize: 14,
        marginLeft: 3,
        marginTop: 3,
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        paddingTop: 10,
    },

    oneRow: {
        flexDirection: 'row',
        alignItems: 'center',
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

    statusText: {
        fontFamily: Fonts.regular,
        color: '#9ea6c1',
        fontSize: 12,
    },

    detailBtn: {
        width: '50%',
        borderRightWidth: 1,
        borderRightColor: Colors.borderColor
    },

    detailBtnText: {
        fontFamily: Fonts.regular,
        color: Colors.appColor,
        textAlign: 'center',
        fontSize: 16,
    },

    chatBtn: {
        width: '50%'
    },

    chatBtnText: {
        fontFamily: Fonts.regular,
        color: Colors.appColor,
        textAlign: 'center',
        fontSize: 16,
    },

    feedbackTitle: {
        fontFamily: Fonts.bold,
        color: Colors.textColor,
        marginBottom: 5,
    },

    feedbackContent: {
        fontFamily: Fonts.light,
        fontSize: 13,
        lineHeight: 15,
        color: Colors.textColor,
        marginBottom: 10,
    },

    bookmark: {
        position: 'absolute',
        right: 5,
        top: 0,
        zIndex: 2,
        width: 40,
        height: 40,
    },

    favIcon: {
        width: 24,
        height: 21,
        resizeMode: 'contain',
    },

    categoryView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 7,
        marginBottom: 5,
    },

    categoryIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 5,
        marginBottom: 5, 
    },

    cublicLogo: {
        width: 100,
        height: 21,
        marginTop: 7,
        resizeMode: 'contain'
    },

    infoCubicPackageText: {
        width: '65%',
        fontFamily: Fonts.regular,
        marginLeft: 5,
        marginTop: 8,
    },

});