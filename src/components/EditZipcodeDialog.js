import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import Colors from '../theme/Colors'
import FormInput from './FormInput'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class EditZipcodeDialog extends React.Component {
  render() {
    return (
	    <View style={styles.indicatorOverlay}>
          <View style={styles.indicatorBackground}></View>
          <View style={styles.dialogBox}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>Edit Zip Code</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => this.props.onClose()}>
                <Image style={styles.closeIcon} source={Images.close_icon}/>
              </TouchableOpacity>
            </View>

            <View style={styles.contentView}>
              <FormInput
                style={styles.inputText}
                 placeholder="Zip Code" 
                 theme="gray"
                 type="text"
                 align="center"
                 placeholderTextColor="#939393"
                 value={this.props.zipcode} 
                 errorMessage={this.props.errorMessage}
                 onChangeText={(text) => this.props.onChange(text)} />
            </View>

            <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.onApply()}>
              <Text style={styles.bottomButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
	indicatorOverlay: {
    position: 'absolute',
    left: 0,
    top: -100,
    width: width,
    height: height + 100,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
  },

  indicatorBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  dialogBox: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 15,
  },

  headerView: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderColor,
  },

  headerText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%',
  },

  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },

  closeIcon: {
    width: 30,
    height: 30,
  },

  contentView: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderColor, 
  },

  bottomButton: { 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  bottomButtonText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 20, 
  },

  inputText: {
    width: '80%', 
    borderColor: Colors.borderColor, 
    borderWidth: 1, 
    borderRadius: 25
  }
});