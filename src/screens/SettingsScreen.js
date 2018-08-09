import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Left, Right } from 'native-base';

class SettingsScreen extends Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon type='FontAwesome' style={{ color: "blue", fontSize: 22 }} name='cogs' />
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
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Settings</Text>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text>SettingsScreen</Text>
                </Content>
            </Container>
        )
    }
}

export default SettingsScreen;