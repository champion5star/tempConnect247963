import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Tags from "./react-native-tags"
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import { GOOGLE_API_KEY } from '../constants.js'
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

export default class RoundTextInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
          displayPassword: false,
          showAddressList: false
        }
    }

    render() {
        const { 
            type,
            theme, 
            label, 
            errorMessage,
        } = this.props;

        return (
            <View style={[styles.container, this.props.style]}>
                {
                    (label && label.length > 0) 
                    ? <Text style={styles.labelText}>{label}</Text>
                    : null
                }

                <View style={[theme === 'gray' ? styles.grayContent : styles.content ]}>
                { (type === "text") && this._renderTextField() }
                { (type == "tags") && this._renderTagField() }
                { (type === "number") && this._renderNumberField() }
                { (type === "phone") && this._renderPhoneField() }
                { (type === "email") && this._renderEmailField() }
                { (type === "password") && this._renderPasswordField() }
                { (type === "textview") && this._renderTextViewField() }
                { (type === "address") && this._renderAddressField() }
                { (type === "dropdown") && this._renderDropdownField() }
                </View>              
                {
                    errorMessage
                    ? <Text style={[theme == "white" ? styles.errorWhiteMessage : styles.errorMessage]}>{this.props.errorMessage}</Text>
                    : null
                }
            </View>
        );
    }

    ////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Text Field ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderTextField() {
        const {
            align,
            autoCapitalize,
            autoFocus,
            editable,
            maxLength,
            placeholder,
            theme,
            value,
            returnKeyType,
            onChangeText,
            onRefInput,
            onSubmitEditing,
        } = this.props;

        return (
            <TextInput
                style={[
                    theme == "gray" ? styles.textWhiteInput : styles.textInput,
                    align == "center" ? styles.centerText : null
                ]}
                underlineColorAndroid='transparent'
                placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                autoFocus={autoFocus}
                editable={editable}
                autoCapitalize={autoCapitalize}
                maxLength={maxLength}                        
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                ref={onRefInput}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
        )
    }

    ////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Tag Field ////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderTagField() {
        const { 
            value,
            placeholder,
            onChangeText,
        } = this.props;

        return (
            <Tags
                initialTags={value}
                textInputProps={{
                    placeholder: placeholder,
                    returnKeyType: "done",
                }}
                onChangeTags={tags => onChangeText(tags)}
                onTagPress={(index, tagLabel, event, deleted) =>
                    console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                }
                containerStyle={styles.tagContainer}
                createTagOnReturn={true}
                createTagOnString={[","]}
                inputStyle={styles.tagInput}
                renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                    (tag && tag.trim().length > 0) 
                    ? <TouchableOpacity key={`${tag}-${index}`} style={styles.tagCell} onPress={onPress}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                    : null
                )}
            />
        )
    }

    ////////////////////////////////////////////////////////////////////////
    //////////////////////////// Number Field //////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderNumberField() {
        const {
            align,
            autoFocus,
            editable,
            maxLength,
            theme,
            value,
            keyboardType,
            returnKeyType,
            placeholder,
            onChangeText,
            onRefInput,
            onSubmitEditing,
        } = this.props;

        return (
            <TextInput
                style={[
                    theme == "gray" ? styles.textWhiteInput : styles.textInput,
                    align == "center" ? styles.centerText : null
                ]}
                underlineColorAndroid='transparent'
                autoFocus={autoFocus}
                editable={editable}
                keyboardType={keyboardType ? keyboardType : 'numeric'}
                maxLength={maxLength}
                placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                ref={onRefInput}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
        )
    }
    
    ////////////////////////////////////////////////////////////////////////
    //////////////////////////// Phone Field ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderPhoneField() {
        const {
            align,
            autoFocus,
            editable,
            maxLength,
            placeholder,
            theme,
            value,
            returnKeyType,
            onChangeText,
            onRefInput,
            onSubmitEditing,
        } = this.props;

        return (
            <TextInput
                style={[
                    theme == "gray" ? styles.textWhiteInput : styles.textInput,
                    align == "center" ? styles.centerText : null
                ]}
                underlineColorAndroid='transparent'
                autoFocus={autoFocus}
                editable={editable}
                keyboardType='phone-pad'
                maxLength={maxLength}
                placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                ref={onRefInput}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
        )
    }

    ////////////////////////////////////////////////////////////////////////
    //////////////////////////// Email Field ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderEmailField() {
        const {
            align,
            autoFocus,
            editable,
            maxLength,
            theme,
            placeholder,
            value,
            returnKeyType,
            onChangeText,
            onRefInput,
            onSubmitEditing,
        } = this.props;
        return (
            <TextInput
                autoCapitalize='none'
                editable={editable}
                autoCorrect={false}
                autoFocus={autoFocus}
                maxLength={maxLength}
                style={[
                    theme == "gray" ? styles.textWhiteInput : styles.textInput,
                    align == "center" ? styles.centerText : null
                ]}
                placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                underlineColorAndroid='transparent'
                onChangeText={onChangeText}
                keyboardType='email-address'
                value={value}
                placeholder={placeholder}
                ref={onRefInput}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
        )
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////// Password Field /////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderPasswordField() {
        const { displayPassword } = this.state;
        const {
            align,
            autoFocus,
            editable,
            isShowForgot,
            maxLength,
            placeholder,
            theme,
            value,
            returnKeyType,
            onChangeText,
            onRefInput,
            onSubmitEditing,
            onForgot,
        } = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TextInput
                    textContentType="none"
                    autoFocus={autoFocus}
                    editable={editable}
                    blurOnSubmit={false}
                    maxLength={maxLength}
                    secureTextEntry={!displayPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={[
                        theme == "gray" ? styles.textWhiteInput : styles.textInput,
                        align == "center" ? styles.centerText : null,
                        isShowForgot ? {width: '80%'} : {width: '100%'}
                    ]}
                    placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                    underlineColorAndroid='transparent'
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    ref={onRefInput}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                />
                {
                    isShowForgot && <TouchableOpacity onPress={onForgot}>
                        <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
    ////////////////////////////////////////////////////////////////////////
    /////////////////////////// Textview Field /////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderTextViewField() {
        const {
            autoFocus,
            editable,
            theme,
            maxLength,
            placeholder,
            value,
            returnKeyType,
            onChangeText,
            onRefInput,
            onSubmitEditing,
        } = this.props;

        return (
            <TextInput
                style={[theme == "gray" ? styles.whiteTextView : styles.textView]}
                autoFocus={autoFocus}
                editable={editable}
                underlineColorAndroid='transparent'
                multiline={true}
                numberOfLines={6}
                maxLength={maxLength}
                placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                ref={onRefInput}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
        )
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////// Address Field //////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderAddressField() {
        const { showAddressList } = this.state;
        const { 
            theme,
            autoFocus,
            editable,
            placeholder,
            value,
            maxLength,
            returnKeyType,
            onChangeText,
            onRefInput,
            onSubmitEditing,
            onSelectAddress,

        } = this.props;

        return (
            <GoogleAutoComplete apiKey={GOOGLE_API_KEY} debounce={300} queryTypes="address">
                {({ inputValue, handleTextChange, locationResults, fetchDetails }) => {
                return (
                    <React.Fragment>
                        <TextInput
                            value={value}
                            onChangeText={(text) => {
                                handleTextChange(text);
                                onChangeText(text);
                            }}
                            maxLength={maxLength}
                            editable={editable}
                            autoFocus={autoFocus}
                            underlineColorAndroid='transparent'
                            placeholder={placeholder}
                            placeholderTextColor={theme === "gray" ? Colors.grayTextInputPlaceColor : Colors.roundTextInputPlaceColor}
                            onFocus={ () => this.setState({showAddressList: true}) }
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                            style={theme == "gray" ? styles.textWhiteInput : styles.textInput}
                        />
                        {
                        (value && value.length > 0 && showAddressList)
                        ? <ScrollView style={{ maxHeight: 150 }}>
                            {locationResults.map((el, i) => (
                                <LocationItem
                                {...el}
                                fetchDetails={fetchDetails}
                                key={String(i)}
                                theme={theme}
                                onSelectAddress={(address) => {
                                    this.setState({showAddressList: false});
                                    onChangeText(address)
                                    onSelectAddress(address)
                                }}
                                />
                            ))}
                            </ScrollView>  
                        : null
                        }
                    
                    </React.Fragment>
                )
                }}
            </GoogleAutoComplete>
        )
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////// Dropdown Field /////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    _renderDropdownField() {
        const { value, data, placeholder, onChangeText } = this.props;
        var placeholderDropdown = {
            label: placeholder ? placeholder : "",
            color: Colors.grayTextInputPlaceColor,
            value: null,
        };
        return (
            <RNPickerSelect
                style={{
                    ...pickerStyles,
                    iconContainer: {
                        top: 20,
                        right: 3,
                    },
                }}
                useNativeAndroidPickerStyle={false}
                placeholder={placeholderDropdown}
                placeholderTextColor={Colors.grayTextInputPlaceColor}
                value={value}
                onValueChange={onChangeText}
                items={data}
                Icon={() => {
                    return <Image
                        style={styles.dropdownIcon}
                        source={Images.dropdown_icon}
                    />
                }}
            />
        )
    }
}

const pickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        paddingVertical: 15,
        color: Colors.textColor,
        paddingLeft: 3,
        paddingRight: 17,
        zIndex: 20,
    },
    inputAndroid: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        paddingVertical: 15,
        color: Colors.textColor,
        borderColor: "transparent"
    },
});

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        zIndex: 10,
    },

    content: {
        paddingVertical: 2,
        borderRadius: 15,
        paddingHorizontal: 15,
        backgroundColor: Colors.textInputBackgroundColor,
    },

    grayContent: {
        borderRadius: 5,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8fa',
        borderWidth: 1,
        borderColor: '#d6d6d7',
    },

    labelText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: '#ACACAC',
        marginBottom: 10,
    },

    labelWhiteText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.textColor,
        marginBottom: 10,
    },
    
    textInput: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: 'white',
        borderBottomWidth: 0,
        height: 48,
    },

    textWhiteInput: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: 'black',
        borderBottomWidth: 0,
        height: 48,
    },

    whiteTextView: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        height: 100,
        color: Colors.textColor,
        textAlignVertical: "top",
        marginTop: (Platform.OS === 'ios') ? 3 : 0
    },

    textView: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        height: 100,
        color: 'white',
        textAlignVertical: "top",
    },

    hasShowButtonTextInput: {
        fontSize: 16,
        height: '100%',
        marginRight: 30,
        height: 42,
    },

    whiteText: {
        color: Colors.textColor,
        fontFamily: Fonts.regular,        
    },

    grayText: {
        color: 'black',
        fontFamily: Fonts.regular,
    },

    forgotText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        letterSpacing: 1,
        color: 'white',
        textTransform: 'uppercase',
    },

    formField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    eye_icon: {
        width: 21,
        height: 15,
        resizeMode: 'cover',
    },

    iconView: {
        left: 0,
        top: 7,
        position: 'absolute',
    },

    iconImage: {
        width: 25,
        height: 25,
        resizeMode: 'cover',
    },

    showPasswordButton: {
        position: 'absolute',
        right: 0,
        top: 12,
    },

    errorMessage: {
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: '#fc3434',
        fontSize: 11,
        marginLeft: 10,
        marginTop: 5,
    },

    errorWhiteMessage: {
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: '#fc3434',
        fontSize: 11,
        marginTop: 5,
    },

    centerText: {
        textAlign: 'center'
    },

    dropdownBox: {
        height: 42,   
        backgroundColor: 'red',  
    },

    dropdownIcon: {
        width: 17,
        height: 10,
        opacity: 0.5,
    },

    tagContainer: {
        paddingVertical: 3,
    },

    tagInput: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        backgroundColor: '#f8f8fa',
        height: 50,
        color: Colors.textColor,
        paddingLeft: 0,
    },

    tagCell: {
        marginRight: 5,
        marginBottom: 3,
    },

    tagText: {
        fontFamily: Fonts.regular,
        backgroundColor: Colors.appColor,
        color: 'white',
        fontSize: 14,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
});

