import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';
import Fonts from '../../theme/Fonts'
import { DATE_TIME_FORMAT } from '../../constants'

class EarningCell extends Component {
    render() {
        const { data } = this.props;
        const { job, createdAt } = data;
        const total = data.total.toFixed(2);
        const title = (job && job.title) ? job.title : '';

        return (
            <View style={styles.container}>
                <View style={{width: '70%'}}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.subText}>{moment(createdAt).format(DATE_TIME_FORMAT)}</Text>
                    <Text style={styles.subText}>Completed</Text>
                </View>

                <View>
                    <Text style={styles.priceText}>${total}</Text>
                </View>
            </View>
        );
    }
}

export default EarningCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        backgroundColor: 'white',
    },    

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        marginBottom: 5,
    },

    subText: {
        fontFamily: Fonts.regular,
        color: '#9e9e9e',
    },

    priceText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        textAlign: 'right',
    },

});