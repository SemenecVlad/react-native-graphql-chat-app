import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Left, Right } from 'native-base';

class RoomsScreen extends Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue", fontSize: 22 }} name='chat' type="Entypo" />
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
                    <Right>
                        <Button transparent>
                            <Icon name="ios-person-add"
                                type="Ionicons"
                                style={{ marginLeft: 0, marginRight: 0, fontSize: 30 }}
                                onPress={() => this.props.navigation.openDrawer()}
                            />
                        </Button>

                        {/* <Button transparent>
                            <Icon name="delete"
                                type="MaterialIcons"
                                style={{ marginLeft: 0, marginRight: 0, fontSize: 23 }}
                                onPress={() => this.props.navigation.openDrawer()}
                            />
                        </Button> */}
                    </Right>
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