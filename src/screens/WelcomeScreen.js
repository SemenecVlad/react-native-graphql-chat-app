import React, { Component } from 'react';
import { Image, ActivityIndicator } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Left, Right, Text, Card, CardItem } from 'native-base';

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
                    <Card>
                        <CardItem header bordered>
                            <Text>Lorem ispum</Text>
                        </CardItem>
                        <CardItem cardBody>
                            <Image indicator={ActivityIndicator} source={{ uri: 'https://techcrunch.com/wp-content/uploads/2017/10/facebook-workplace-chat-desktop-software-screen-share.png?w=730&crop=1' }} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</Text>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem header bordered>
                            <Text>Lorem ispum</Text>
                        </CardItem>
                        <CardItem cardBody>
                            <Image indicator={ActivityIndicator} source={{ uri: 'https://smartybro.com/wp-content/uploads/2018/05/Private-one-to-one-Chat-App-with-Laravel-Vuejs-and-Pusher.jpg' }} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</Text>
                        </CardItem>
                    </Card>
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