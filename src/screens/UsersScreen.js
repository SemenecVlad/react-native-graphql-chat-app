import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Left, Right } from 'native-base';

class UsersScreen extends Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue" }} name='people' />
        )
    }
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Users</Text>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text>UsersScreen</Text>
                </Content>
            </Container>
        )
    }
}

export default UsersScreen;