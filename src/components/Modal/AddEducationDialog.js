import React, { Component } from 'react';
import Modal from "react-native-modal";
import { 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Text, 
    TouchableWithoutFeedback, 
    Keyboard, 
    KeyboardAvoidingView, 
    Platform,
} from 'react-native';
import Images from '../../theme/Images';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import RoundTextInput from '../RoundTextInput';
import RoundButton from '../RoundButton'

class AddEducationDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            degree: "",
            fieldOfStudy: "",
            from: "",
            to: "",
            description: "",

            nameError: "",
            degreeError: "",
            fieldOfStudyError: "",
            fromError: "",
            toError: "",
        }
    }

    resetModal=()=> {
       this.setState({
            name: "",
            degree: "",
            fieldOfStudy: "",
            from: "",
            to: "",
            description: "",

            nameError: "",
            degreeError: "",
            fieldOfStudyError: "",
            fromError: "",
            toError: "",
       });
    }

    filterYear(data) {
        var response = [];
        for (var i = 0; i < data.length; i++) {
            const item = data[i];
            response.push({
                id: i,
                label: item.toString(), 
                value: item.toString()
            });
        }
  
        return response;
    }

    onAdd() {
        var isValid = true;
        const { name, degree, fieldOfStudy, from, to, description} = this.state;

        if (!(name && name.length > 0)) {
            this.setState({nameError: "Please type a valid school/college name."});
            isValid = false;
        }

        if (!(degree && degree.length > 0)) {
            this.setState({degreeError: "Please type a valid degree."});
            isValid = false;
        }

        if (!(fieldOfStudy && fieldOfStudy.length > 0)) {
            this.setState({fieldOfStudyError: "Please type a valid field of study."});
            isValid = false;
        }

        if (!(from && from.length > 0)) {
            this.setState({fromError: "Please select a valid from."});
            isValid = false;
        } else if (from > to) {
            this.setState({fromError: "Year To must be later than Year From."});
            isValid = false;
        }

        if (!(to && to.length > 0)) {
            this.setState({toError: "Please select a valid to."});
            isValid = false;
        }

        if (isValid) {
            this.props.onAddEducation({
                name,
                degree,
                fieldOfStudy,
                from,
                to,
                description,
            });
        }
    }

    render() {
        const { years } = this.props;
        const { name, degree, fieldOfStudy, from, to, description, nameError, degreeError, fieldOfStudyError, fromError, toError} = this.state;

        return (
            <Modal isVisible={this.props.isVisible} onModalWillShow={this.resetModal}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding": "height"} enabled>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.contentView}>
                        <View style={styles.headerView}>
                            <Text style={styles.titleText}>Add Education</Text>
                            <TouchableOpacity onPress={this.props.onClose}>
                                <Image source={Images.close_icon} style={styles.closeImage}/>
                            </TouchableOpacity>
                        </View>

                        <RoundTextInput
                            placeholder="School/College Name" 
                            placeholderTextColor={Colors.placeholderTextColor}
                            type="text"
                            theme="gray"
                            value={name} 
                            style={{marginTop: 20}}
                            errorMessage={nameError}
                            returnKeyType="next"                                       
                            onRefInput={(input) => { this.nameInput = input }}
                            onSubmitEditing={() => { this.degreeInput.focus() }}
                            onChangeText={(text) => this.setState({name: text, nameError: null})} 
                        />

                        <RoundTextInput
                            placeholder="Degree" 
                            placeholderTextColor={Colors.placeholderTextColor}
                            type="text"
                            theme="gray"
                            value={degree} 
                            errorMessage={degreeError}
                            returnKeyType="next"                                       
                            onRefInput={(input) => { this.degreeInput = input }}
                            onSubmitEditing={() => { this.fieldOfStudyInput.focus() }}
                            onChangeText={(text) => this.setState({degree: text, degreeError: null})} 
                        />

                        <RoundTextInput
                            placeholder="Field of Study" 
                            placeholderTextColor={Colors.placeholderTextColor}
                            type="text"
                            theme="gray"
                            value={fieldOfStudy} 
                            errorMessage={fieldOfStudyError}
                            returnKeyType="next"                                       
                            onRefInput={(input) => { this.fieldOfStudyInput = input }}
                            onChangeText={(text) => this.setState({fieldOfStudy: text, fieldOfStudyError: null})} 
                        />

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <RoundTextInput
                                placeholder="From" 
                                type="dropdown"
                                theme="gray"
                                data={this.filterYear(years)}
                                value={from} 
                                errorMessage={fromError}
                                style={{width: '47%'}}
                                onChangeText={(text) => this.setState({from: text, fromError: null})} 
                            />
                            <RoundTextInput
                                placeholder="To" 
                                type="dropdown"
                                theme="gray"
                                data={this.filterYear(years)}
                                value={to} 
                                errorMessage={toError}
                                style={{width: '47%'}}
                                onChangeText={(text) => this.setState({to: text, toError: null})} 
                            />                        
                        </View>

                        <RoundTextInput
                            placeholder="Description"
                            type="textview"
                            theme="gray"
                            value={description} 
                            onChangeText={(text) => this.setState({description: text})} 
                        />

                        <RoundButton 
                            title="Add" 
                            theme="gradient" 
                            onPress={() => this.onAdd()} 
                        />
                    </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

export default AddEducationDialog;

const styles = StyleSheet.create({
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

    closeImage: {
        width: 25,
        height: 25,
    },
});