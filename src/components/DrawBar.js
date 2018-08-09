import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { Container, Content, Header, Body, Button, Icon } from 'native-base';

export default DrawBar extends Component {
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
                            source={require('./src/assets/images/graphql.png')} />
                    </Body>
                </Header>

                <Content>
                    <DrawerItems {...props} />
                    <Button
                        block
                        primary
                    >
                        <Icon name='home' />
                        <Text style={{ color: 'white' }}>Log Out</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
};