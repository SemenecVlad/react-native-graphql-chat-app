import React, { Component } from 'react';
import { View, ScrollView, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import { FormInput } from 'react-native-elements';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import MessageWrap from '../components/MessageWrap';
import MessageInput from '../components/MessageInput';

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
            <Query query={ALL_POSTS_QUERY}>
                {({ ...data, subscribeToMore, loading }) => {
                    if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff" /></View>
                    return (
                        <View style={styles.container}>
                            <MessageWrap
                                {...data}
                                refresh={() => data.refetch()}
                                subscribeToNewPosts={() => subscribeToMore({
                                    document: POSTS_SUBSCRIPTION,
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const newPost = subscriptionData.data.Post.node;
                                        const delPost = subscriptionData.data.Post.previousValues;
                                        if (!subscriptionData.data) return prev;
                                        if (delPost !== null) {
                                            return Object.assign({}, prev, {
                                                allPosts: [...prev.allPosts].splice(delPost.id, 1)
                                            });
                                        }
                                        return Object.assign({}, prev, {
                                            allPosts: [newPost, ...prev.allPosts]
                                        });
                                    }
                                })}
                            />
                            <MessageInput
                                refresh={() => data.refetch()}
                                userId={this.state.userId}
                            />
                        </View>)
                }}
            </Query>
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