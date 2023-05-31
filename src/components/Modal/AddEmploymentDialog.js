import React, { Component } from 'react';
import Modal from "react-native-modal";
import { 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Text, 
    Platform,
    TouchableWithoutFeedback, 
    Keyboard, 
    KeyboardAvoidingView, 
} from 'react-native';
import Images from '../../theme/Images';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import RoundTextInput from '../RoundTextInput';
import RoundButton from '../RoundButton'

class AddEmploymentDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            company: '',
            role: '',
            description: '',
            from: '',
            to: '',

            companyError: "",
            roleError: "",
            fromError: "",
            toError: "",
        }
    }

    resetModal=()=> {
        this.setState({
            company: '',
            role: '',
            description: '',
            from: '',
            to: '',

            companyError: "",
            roleError: "",
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
        const { company, role, from, to, description} = this.state;

        if (!(company && company.length > 0)) {
            this.setState({companyError: "Please type a valid company name."});
            isValid = false;
        }

        if (!(role && role.length > 0)) {
            this.setState({roleError: "Please type a valid role."});
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
                company,
                role,
                from,
                to,
                description,
            });
        }
    }

    render() {
        const { years } = this.props;
        const { company, role, from, to, description, companyError, roleError, fromError, toError} = this.state;

        return (
            <Modal isVisible={this.props.isVisible} onModalWillShow={this.resetModal}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding": "height"} enabled>
                        <View style={styles.contentView}>
                            <View style={styles.headerView}>
                                <Text style={styles.titleText}>Add Employment History</Text>
                                <TouchableOpacity onPress={this.props.onClose}>
                                    <Image source={Images.close_icon} style={styles.closeImage}/>
                                </TouchableOpacity>
                            </View>

                            <RoundTextInput
                                placeholder="Company Name" 
                                theme="gray"
                                placeholderTextColor={Colors.placeholderTextColor}
                                type="text"
                                value={company} 
                                style={{marginTop: 20}}
                                errorMessage={companyError}
                                returnKeyType="next"                                       
                                onSubmitEditing={() => { this.roleInput.focus() }}
                                onChangeText={(text) => this.setState({company: text, companyError: null})} 
                            />

                            <RoundTextInput
                                placeholder="Role" 
                                placeholderTextColor={Colors.placeholderTextColor}
                                type="text"
                                theme="gray"
                                value={role} 
                                errorMessage={roleError}
                                returnKeyType="next"                                       
                                onRefInput={(input) => { this.roleInput = input }}
                                onChangeText={(text) => this.setState({role: text, roleError: null})} 
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
                                    data={this.filterYear(years)}
                                    value={to} 
                                    theme="gray"
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
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

export default AddEmploymentDialog;

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