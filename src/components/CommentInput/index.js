import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import Colors from '../../theme/Colors';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

export default class CommentInput extends React.Component{
  constructor(props){
    super(props)
    this.state={ value: '' }
  }
  render() {
  const { props }= this;
  return (
    <View style={[styles.wrapper, props.style]}>
      <TouchableOpacity onPress={props.onImagePress}>
        <Image source={Images.add_image_to_comment} style={{ width: 26, height: 22, marginRight: 12 }} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.container}>
        <TextInput
          {...props}
          value={this.state.value}
          onChangeText={(value) => {
            this.setState({value});
            props.onChangeText && props.onChangeText(value);
          }}
          underlineColorAndroid='transparent'
          ref={props.textRef ? props.textRef : () => {}}
          style={[styles.textInput, props.inputStyle]}
          multiline
          maxLength={1000}
          onSubmitEditing={props.onBlur}
          placeholderTextColor="#888888"
        />
        <TouchableOpacity onPress={props.onPost} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
          <Text style={[styles.postBtn, this.state.value.length === 0 && { color: 'rgba(0, 0, 0, 0.2)' }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  
  container: {
    flex: 1,
    paddingHorizontal: 17,
    borderRadius: 7,
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C6C6C6',
    zIndex: 100,
    minHeight: 40,
  },
  textInput: {
    flex: 1,
    // height: 33,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: 'black',
    maxHeight: 100,
  },
  postBtn: {
    marginLeft: 10,
    marginTop: 7,
    fontSize: 19,
    fontFamily: Fonts.medium,
    color: Colors.appColor,
    alignSelf: 'flex-end',
  },
});
