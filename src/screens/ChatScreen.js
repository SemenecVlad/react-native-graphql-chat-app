import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { FormInput } from 'react-native-elements';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import MessageWrap from '../components/MessageWrap';
import MessageInput from '../components/MessageInput';

const ChatScreen = (props) => (
    <Query query={ALL_POSTS_QUERY}>
        {({ ...data, subscribeToMore }) => {
            return (
                <View style={styles.container}>
                    <MessageWrap
                        {...data}
                        refresh={() => data.refetch()}
                        subscribeToNewPosts={() => subscribeToMore({
                            document: POSTS_SUBSCRIPTION,
                            updateQuery: (prev, { subscriptionData }) => {
                                const newPost = subscriptionData.data.Post.node;
                                if (!subscriptionData.data) return prev;
                                return Object.assign({}, prev, {
                                    allPosts: [newPost, ...prev.allPosts]
                                });
                            }
                        })}
                    />
                    <MessageInput refresh={() => data.refetch()} />
                </View>)
        }}
    </Query>
);


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
          mutation_in: [CREATED]
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
      }
  }
`;

export default ChatScreen;