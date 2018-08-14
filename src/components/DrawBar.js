import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { DrawerItems } from 'react-navigation';
import { Container, Content, Header, Body, Button, Icon } from 'native-base';
import { inject, observer } from 'mobx-react';

@inject('chatStore')
@observer
export default class DrawBar extends Component {
    static navigationOptions = {
        header: null
    };
    render() {
        return (
            <Container>
                <Header style={{ height: 150, backgroundColor: 'white' }}>
                    <Body>
                        <Image
                            style={styles.drawerImage}
                            source={require('../assets/images/graphql.png')} />
                    </Body>
                </Header>

                <Content>
                    <DrawerItems {...this.props} />
                    <Button
                        block
                        primary
                        onPress={() => { this.props.chatStore.logout(); this.props.navigation.navigate('Login'); }}
                    >
                        <Icon name='home' />
                        <Text style={{ color: 'white' }}>Log Out</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'aqua',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    drawerImage: {
        width: 260,
        height: 120
    }
};