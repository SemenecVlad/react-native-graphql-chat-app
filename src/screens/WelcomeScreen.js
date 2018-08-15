import React, { Component } from 'react';
import { Icon, Button, Container, Header, Body, Content, Left, Right, Text } from 'native-base';

class WelcomeScreen extends Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue" }} name='home' />
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
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>What's New</Text>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                    <Text>Here will be some news</Text>
                </Content>
            </Container>
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