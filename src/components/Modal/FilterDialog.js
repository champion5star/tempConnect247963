import React, { Component } from 'react';
import Modal from "react-native-modal";
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Slider from '@react-native-community/slider';
import { 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Text, 
    Platform,
    ScrollView,
} from 'react-native';
import Images from '../../theme/Images';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import RoundTextInput from '../RoundTextInput';
import RoundButton from '../RoundButton'
import SubCategoryCell from '../Cells/SubCategoryCell'
import { PAY_TYPES, MAX_DISTANCE, DEFAULT_DISTANCE } from '../../constants'

class FilterDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            payType: '',
            location: '',
            locationText: '',
            distance: DEFAULT_DISTANCE,
        }
    }

    componentDidMount() {
        const user = this.props.currentUser;
        if (user && user._id) {
            const keyword = (user.searchFilter && user.searchFilter.keyword) ? user.searchFilter.keyword : '';
            const payType = (user.searchFilter && user.searchFilter.payType) ? user.searchFilter.payType : '';
            const location = (user.searchFilter && user.searchFilter.location) ? user.searchFilter.location : '';
            const distance = (user.searchFilter && user.searchFilter.distance) ? user.searchFilter.distance : DEFAULT_DISTANCE;

            this.setState({
                keyword,
                payType,
                location,
                locationText: location,
                distance,
            });
        }        
    }

    onRefresh=()=> {
        const { onRefresh } = this.props;
        this.setState({
            keyword: '',
            payType: '',
            location: '',
            distance: DEFAULT_DISTANCE,
        })

        if (onRefresh) {
            onRefresh();
        }
    }

    filterData(data) {
        var response = [];
        for (var i = 0; i < data.length; i++) {
          const item = data[i];
          response.push({
            id: item._id, 
            label: item.name, 
            value: item._id
          });
        }
        return response;
    }

    render() {
        const { keyword, payType, location, locationText, distance } = this.state;
        
        return (
            <Modal isVisible={this.props.isVisible}>
                <KeyboardAwareScrollView style={styles.mainScroll}>
                    <View style={styles.contentView}>
                        <View style={styles.headerView}>
                            <Text style={styles.labelText}>Filter</Text>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity onPress={this.onRefresh}>
                                    <Image source={Images.refresh} style={styles.refreshImage}/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.props.onClose}>
                                    <Image source={Images.close_icon} style={styles.closeImage}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <RoundTextInput
                            label="Keyword" 
                            placeholderTextColor={Colors.placeholderTextColor}
                            type="text"
                            theme="gray"
                            value={keyword} 
                            style={{marginTop: 20}}
                            returnKeyType="next"                                       
                            onChangeText={(text) => this.setState({keyword: text})} 
                        />

                        <RoundTextInput
                            label="Location"
                            type="address"
                            theme="gray"
                            value={locationText}
                            returnKeyType="done"
                            onSelectAddress={(address) => this.setState({ location: address, locationText: address })}
                            onRefInput={(input) => { this.locationInput = input }}
                            onChangeText={this.onChangeLocation} 
                        />

                        { this._renderDistance() }

                        <RoundTextInput
                            label="Pay Type" 
                            placeholder="Select a pay type"
                            type="dropdown"
                            theme="gray"
                            data={PAY_TYPES}
                            value={payType} 
                            onChangeText={(text) => this.setState({payType: text})} 
                        />
                        
                        { this._renderCategory() }

                        <RoundButton 
                            title="Search" 
                            theme="gradient" 
                            style={{marginTop: 30}}
                            onPress={() => this.props.onSearch(
                                keyword, 
                                payType,
                                location,
                                distance,
                            )} 
                        />
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        );
    }

    onChangeLocation =(text)=> {
        if (text == null || text == "") {
            this.setState({ location: '', locationText: '', locationError: null })
        }
        else {
            this.setState({ locationText: text, locationError: null })
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Category. ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderCategory() {
        const { categories, onEditCategory, selected } = this.props;

        var list = [];
        categories.forEach(c => {
            if (c.subCategories && c.subCategories.length > 0) {
                c.subCategories.forEach(item => {
                    if (selected && selected.indexOf(item.name) >= 0) {
                        list.push(item);
                    }
                });
            }
        });

        return (
            <View style={styles.categoryView}>
                {
                    (list.length > 0)
                    ? <View>
                        <View style={styles.rowView}>
                            <Text style={styles.labelText}>Category</Text>
                            <TouchableOpacity onPress={onEditCategory}>
                                <Image source={Images.icon_circle_plus} style={styles.plusIcon}/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{marginTop: 0, marginTop: 10}} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                            list.map((item, index) => {
                                return (
                                <SubCategoryCell 
                                    key={index.toString()} 
                                    category={item} 
                                    selected={false}
                                    isTouchable={false}
                                />
                                )
                            })
                            }
                        </ScrollView>
                    </View>
                    : <View>
                        <Text style={[styles.labelText, {marginBottom: 10}]}>Category</Text>
                        <View style={styles.inputBox}>
                            <TouchableOpacity onPress={onEditCategory}>
                                <Image source={Images.icon_circle_plus} style={styles.plusIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }

    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Distance. ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderDistance() {
        const { distance } = this.state;
        var distanceText = distance > 1 ? distance + " Miles" : distance + " Mile";
        return (
            <View style={styles.distanceView}>
                <View style={styles.distanceHeader}>
                    <Text style={styles.labelText}>Distance</Text>
                    <Text style={styles.distanceText}>{distanceText}</Text>
                </View>
                <Slider
                    style={{width: '100%', height: 40}}
                    value={distance}
                    minimumValue={1}
                    maximumValue={MAX_DISTANCE}
                    minimumTrackTintColor={Colors.appColor}
                    maximumTrackTintColor={Platform.OS == "ios" ? "#f8f8fa" : Colors.appColor}
                    step={1}
                    onValueChange={(value) => this.setState({distance: value})}
                />
            </View>
        )
    }
}

export default FilterDialog;

const styles = StyleSheet.create({
    mainScroll: {
        ...ifIphoneX({
			marginTop: 50,
		}, {
			marginTop: 20,
		}),
    },

    contentView: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
    },

    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 20,
    },
    
    refreshImage: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 2,
    },

    closeImage: {
        width: 25,
        height: 25,
    },

    categoryView: {
        
    },

    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    labelText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: '#ACACAC',
    },

    inputBox: {
        paddingVertical: 2,
        borderRadius: 5,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8fa',
        borderWidth: 1,
        borderColor: '#d6d6d7',
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    plusIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },

    distanceView: {
        marginBottom: 20,
    },

    distanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    distanceText: {
        fontFamily: Fonts.regular,
        color: Colors.appColor,
        fontSize: 13,
    },
});