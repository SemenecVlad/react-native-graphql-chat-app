import React, { Component } from 'react';
import { View, Text } from 'react-native';

class WelcomeScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>WelcomeScreen</Text>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'aqua',
    },
}

export default WelcomeScreen;