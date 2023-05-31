import React from 'react'
import { BottomTabBar } from 'react-navigation-tabs'
import { View, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { StyleSheet } from 'react-native';

const TouchableWithoutFeedbackWrapper = ({
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    ...props
}) => {
    if (props.focused) {props.style.push(styles.tabBarActiveStyle)} 
    else {props.style.push(styles.tabBarStyle)}
    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            testID={testID}
            hitSlop={{
                left: 15,
                right: 15,
                top: 5,
                bottom: 5,
            }}
            accessibilityLabel={accessibilityLabel}
        >
            <View {...props} />
        </TouchableWithoutFeedback>
    )
}

export default TabBarComponent = props => {
    return <BottomTabBar
        {...props}
        style={styles.bottomBarStyle}
        getButtonComponent={() => {
            return TouchableWithoutFeedbackWrapper
        }}
    />
}

const styles = StyleSheet.create({
    bottomBarStyle: {
        height: 60,
        position: 'absolute',
        overflow: 'hidden',
        borderRadius: 15,
        marginHorizontal: 15,
        bottom: 20,
        backgroundColor: 'white',
        borderTopWidth: 0,
        elevation: 5,
    },
    tabBarActiveStyle: {
        borderTopWidth: 4,
        borderTopColor: '#f66a2d',
    },
    tabBarStyle: {
        paddingVertical: 0,
        borderTopWidth: 4,
        borderTopColor: '#00c1c3',
    }
})