import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import MessageWrap from '../components/MessageWrap';
import MessageInput from '../components/MessageInput';
import { Icon, Button, Container, Header, Body, Content, Left, Right, Footer, Item, Input } from 'native-base';


class ChatScreen extends Component {
    componentDidMount() {
        if (this.state.userId === null) {
            this.props.navigation.navigate('Auth')
        }

        this.getUserId();
        console.log(this.getUserId())
    }

    state = {
        userId: null,
    }

    static navigationOptions = {
        drawerIcon: (
            <Image
                source={require('../assets/images/chat_icon.png')}
                style={{ height: 24, width: 24 }}
            />
        )
    }

    getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            console.log('getUserId', id);
            if (id !== null) {
                this.setState({
                    userId: id
                })
            }
        } catch (error) {
            this.setState({
                error
            })
        }
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
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Chat</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="ios-person-add"
                                type="Ionicons"
                                style={{ marginLeft: 0, marginRight: 0, fontSize: 30 }}
                                onPress={() => this.props.navigation.openDrawer()}
                            />
                        </Button>

                        <Button transparent>
                            <Icon name="delete"
                                type="MaterialIcons"
                                style={{ marginLeft: 0, marginRight: 0, fontSize: 23 }}
                                onPress={() => this.props.navigation.openDrawer()}
                            />
                        </Button>
                    </Right>
                </Header>
                <Content contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text>ChatScreen</Text>
                </Content>

                <Footer style={{ backgroundColor: 'white', alignContent: 'center' }}>
                    <Item regular style={{ flex: 1 }}>
                        <Input placeholder="Enter your message..." />
                    </Item>
                    <Button primary rounded style={{ width: 45, marginTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                        <Icon name='send' type='MaterialIcons' style={{ fontSize: 20, marginLeft: 13, marginRight: 0 }} />
                    </Button>
                </Footer>
            </Container>
        )
    }
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'aqua',
    },
}

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
      id
      description
      createdAt
      user{
          name
      }
      files{
          url
      }
    }
  }
`;

const POSTS_SUBSCRIPTION = gql`
  subscription {
      Post(filter: {
          mutation_in: [CREATED, DELETED]
      }) {
          node {
              description
              createdAt
              id
              user {
                  name
              }
              files {
                  url
              }
          }
          previousValues {
              id
          }
      }
  }
`;

export default ChatScreen;