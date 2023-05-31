import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Images from '../theme/Images';

export default class Rate extends React.Component {

  getStarSize() {
    const { size } = this.props;
    if (size == "large") {
      return styles.starLargeImage;
    } else if (size == "xlarge") {
      return styles.starXLargeImage;
    }
    return styles.starImage;
  }

	render() {
    const { rate, touchable, onChangeRate } = this.props;
		return (
			<View style={[this.props.style]}>
      {
        touchable
        ? <View style={{flexDirection: 'row', alignItems: 'center'}} >
            <TouchableOpacity onPress={() => onChangeRate(1)} style={this.getStarSize()}>
              <Image style={styles.image100} source={rate >= 1 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onChangeRate(2)} style={this.getStarSize()}>
              <Image style={styles.image100} source={rate >= 2 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onChangeRate(3)} style={this.getStarSize()}>
              <Image style={styles.image100} source={rate >= 3 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onChangeRate(4)} style={this.getStarSize()}>
              <Image style={styles.image100} source={rate >= 4 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onChangeRate(5)} style={this.getStarSize()}>
              <Image style={styles.image100} source={rate >= 5 ? Images.star_selected : Images.star_icon} />
            </TouchableOpacity>
          </View>

        : <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={this.getStarSize()}
              source={rate >= 1 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={rate >= 2 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={rate >= 3 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={rate >= 4 ? Images.star_selected : Images.star_icon}
            />
            <Image
              style={this.getStarSize()}
              source={rate >= 5 ? Images.star_selected : Images.star_icon}
            />
          </View>
      }          
      </View>
	    );
  	}
}

const styles = StyleSheet.create({
	starImage: {
    width: 15,
    height: 15,
    marginRight: 3,
  },

  starLargeImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  starXLargeImage: {
    width: 35,
    height: 35,
    marginRight: 10,
  },

  image100: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});