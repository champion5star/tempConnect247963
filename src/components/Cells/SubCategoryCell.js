import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import FastImage from 'react-native-fast-image'

const sWidth = Dimensions.get('window').width;
const cellWidth = (sWidth - 85) / 4;

export default class SubCategoryCell extends React.Component {
  render() {
    const {selected, category, isTouchable, onChoose} = this.props;
	const ParentTag = isTouchable ? TouchableOpacity : View;
    return (
      <ParentTag style={styles.categoryCell} onPress={() => {
          if (onChoose) {
            onChoose(category.name)}
          }          
        }>
        <FastImage source={{uri: category.icon}} style={styles.categoryIcon} />
        <Text style={styles.titleText}>{category.name}</Text>
        {
          (selected && selected.indexOf(category.name) >= 0) &&
          <Image source={Images.checkbox_selected_green} style={styles.checkboxIcon}/>
        }
      </ParentTag>
    );
  }
}

const styles = StyleSheet.create({
	categoryCell: {
		width: cellWidth,
		marginRight: 10,
		marginBottom: 10,
	},

	categoryIcon: {
		width: cellWidth,
		height: cellWidth,
		resizeMode: 'contain',
	},

	titleText: {
		fontFamily: Fonts.regular,
		textAlign: 'center',
		marginTop: 5,
		fontSize: 12,
	},

	checkboxIcon: {
		width: 20,
		height: 20,
		resizeMode: 'contain',
		position: 'absolute',
		top: 0,
		right: 0,
	},
});