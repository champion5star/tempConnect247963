import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import Modal from "react-native-modal";
import { 
    BOTTOM_SHEET_TYPE, 
    NOTIFICATION_BOTTOM_SHEET_DATA 
} from '../constants';
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

export default class BottomSheet extends React.Component {
  	render() {
		const { isVisible, type, onClose, onSelect } = this.props;
        var data = [];
        if (type == BOTTOM_SHEET_TYPE.NOTIFICATION) {
            data = NOTIFICATION_BOTTOM_SHEET_DATA;
        }

    	return (
            <Modal
                onBackButtonPress={onClose}
                onBackdropPress={onClose}
                isVisible={isVisible}
                style={styles.container}
            >
                <View style={styles.contentView}>
                    {
                        data.map((item, i) =>
                        <TouchableOpacity 
                            style={styles.row} 
                            key={i} 
                            onPress={() => onSelect(i)}
                        >
                            <Image source={item.icon} style={styles.iconImage} />
                            <Text style={styles.titleText}>{item.title}</Text>
                        </TouchableOpacity>	  
                        )
                    }
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'flex-end',
        margin: 0,
    },

    contentView: {
        backgroundColor: '#F2F2F7',
        paddingTop: 5,
        paddingBottom: 20,
        paddingHorizontal: 15,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        paddingVertical: 15,
        paddingHorizontal: 25,
    },

    iconImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 15,
    },

	titleText: {
		fontSize: 18,
		fontFamily: Fonts.bold,
        color: Colors.textColor,
        textTransform: 'capitalize',
	},
});