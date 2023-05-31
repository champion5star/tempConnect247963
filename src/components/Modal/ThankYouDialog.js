import React, { Component } from 'react';
import Modal from "react-native-modal";
import { 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Text, 
} from 'react-native';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

export default class ThankYouDialog extends Component {
    render() {
        const { isVisible, onClose } = this.props;
        return (
            <Modal isVisible={isVisible}>
                <View style={styles.contentView}>
                    <View style={styles.headerView}>
                        <Image source={Images.icon_checkbox} style={styles.checkIcon} />
                        <Text style={styles.titleText}>Thank you!</Text>
                    </View>
                    <Text style={styles.descriptionText}>We will be contacting you soon.</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => onClose()}>
                        <Text style={styles.btnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    contentView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
    },

    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    checkIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },  

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 30,
        marginLeft: 10,
        color: '#5fb9c4'
    },

    descriptionText: {
        fontFamily: Fonts.regular,
        fontSize: 18,
        color: 'black',
    },

    closeBtn: {
        backgroundColor: '#5fb9c4',
        width: '100%',
        marginTop: 30,
        borderRadius: 30,
    },

    btnText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: 'white',
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 15,
    },
});