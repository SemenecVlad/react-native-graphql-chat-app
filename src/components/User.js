import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon, Button, Text, Container, Header, Body, Content, Left, Right, Footer, Item, Input, Spinner } from 'native-base';
import { inject, observer } from 'mobx-react';

@inject('chatStore')
@observer
class User extends Component {
    state = {
        editMessage: false,
    }
    render() {
        let { name, btnName, btnClick, key, id } = this.props;
        return (
            <View key={key} id={id} >
                <Text>{name}</Text>
                <Button transparent onPress={btnClick}>
                    <Icon name="ios-person-add"
                        type="Ionicons"
                        style={{ marginLeft: 0, marginRight: 0, fontSize: 30 }}
                    />
                </Button>
            </View>
        )
    }
}

const styles = {
    edit: {
        background: 'transparent',
        border: 'none',
        color: 'black'
    },
    delete: {
        background: 'transparent',
        border: 'none',
        color: 'red'
    }
}

export default User;