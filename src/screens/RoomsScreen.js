import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Left, Right } from 'native-base';

class RoomsScreen extends Component {

    static navigationOptions = {
        drawerIcon: (
            <Image
                source={require('../assets/images/chat_icon.png')}
                style={{ height: 24, width: 24 }}
            />
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
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Rooms List</Text>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text>RoomsScreen</Text>
                </Content>
            </Container>
        )
    }
}

export default RoomsScreen;