import React, { Component } from 'react';
import Modal from "react-native-modal";
import Slider from '@react-native-community/slider';
import { 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Text, 
    TouchableWithoutFeedback, 
    Keyboard, 
    KeyboardAvoidingView, 
    ScrollView,
    Platform
} from 'react-native';
import Images from '../../theme/Images';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import RoundTextInput from '../RoundTextInput';
import RoundButton from '../RoundButton'
import SubCategoryCell from '../Cells/SubCategoryCell'
import { 
    MAX_DISTANCE, 
    DEFAULT_DISTANCE,
    USER_TYPE, 
} from '../../constants'

export default class UserFilterDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            location: '',
            locationText: '',
            distance: DEFAULT_DISTANCE,
        }
    }

    componentDidMount() {
        const { filter } = this.props;
        this.setFilter(filter);
    }

    setFilter(filter) {
        var categories = [];
        var location = '';
        var distance = DEFAULT_DISTANCE;

        if (filter && filter.categories) {
            categories = filter.categories;
        }

        if (filter && filter.location) {
            location = filter.location;
        }

        if (filter && filter.distance) {
            distance = filter.distance;
        }

        this.setState({
            categories,
            location,
            locationText: location,
            distance,
        });
    }

    onRefresh=()=> {
        const { onRefresh } = this.props;
        this.setState({
            categories: [],
            location: '',
            distance: DEFAULT_DISTANCE,
        })

        if (onRefresh) {
            onRefresh();
        }
    }

    render() {
        const { userType } = this.props;
        const { location, locationText, categories } = this.state;
        
        return (
            <Modal isVisible={this.props.isVisible}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding": ""} enabled>
                        <View style={styles.contentView}>
                            <View style={styles.header}>
                                <Text style={styles.titleText}>Filter</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={this.onRefresh}>
                                        <Image source={Images.refresh} style={styles.refreshImage}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={this.props.onClose}>
                                        <Image source={Images.close_icon} style={styles.closeImage}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.body}>
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
                                { userType === USER_TYPE.PROVIDER && this._renderCategory(categories) }

                                <RoundButton 
                                    title="Search" 
                                    theme="gradient" 
                                    style={{marginTop: 30}}
                                    onPress={this.onSearch} 
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
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

    onSearch=()=> {
        const { location, distance, categories } = this.state;

        const { onSearch } = this.props;
        if (onSearch) {
            onSearch(location, distance, categories);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Category. ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderCategory(selected) {
        const { categories } = this.props;
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
                            <TouchableOpacity onPress={this.onEditCategory}>
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
                            <TouchableOpacity onPress={this.onEditCategory}>
                                <Image source={Images.icon_circle_plus} style={styles.plusIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }

    onEditCategory=()=> {
        const { categories, location, distance } = this.state;
        const { onEditCategory } = this.props;
        if (onEditCategory) {
            onEditCategory(location, distance, categories);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Distance. ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    _renderDistance() {
        const { distance } = this.state;
        var distanceText = '';
        if (distance <= 1) {
            distanceText = distance + " Mile";
        }
        else {
            distanceText = distance + " Miles";
        }

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

const styles = StyleSheet.create({
    contentView: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        textAlign: 'center',
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

    body: {
        paddingTop: 20,
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