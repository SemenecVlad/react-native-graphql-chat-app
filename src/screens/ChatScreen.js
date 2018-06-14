import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ChatScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>ChatScreen</Text>
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

export default ChatScreen;