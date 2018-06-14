import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import SignInScreen from './src/screens/auth/SignInScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';

const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cji3486nr3q4b0191ifdu8j6x'
});

const wsLink = new WebSocketLink({
  uri: 'wss://subscriptions.us-west-2.graph.cool/v1/cji3486nr3q4b0191ifdu8j6x',
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

const RootNav = createBottomTabNavigator(
  {
    Auth: {
      screen: SignInScreen
    },
    Register: {
      screen: RegisterScreen
    },
    Welcome: {
      screen: WelcomeScreen
    },
    ChatScreen: {
      screen: ChatScreen
    }
  },
  {
    initialRouteName: 'Auth',
    navigationOptions: {
      tabBarVisible: true
    },
  }
);

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RootNav />
      </ApolloProvider>
    );
  }
}

console.disableYellowBox = true;

const styles = StyleSheet.create({
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
});
