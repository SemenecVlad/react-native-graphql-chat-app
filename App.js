import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text
} from 'react-native';

import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import { ApolloProvider } from 'react-apollo';
import { inject, observer } from 'mobx-react'

import SignInScreen from './src/screens/auth/SignInScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import UsersScreen from './src/screens/UsersScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DrawBar from './src/components/DrawBar';

const DrawNav = createDrawerNavigator({
  Home: {
    screen: WelcomeScreen
  },
  Rooms: {
    screen: RoomsScreen
  },
  Users: {
    screen: UsersScreen
  },
  Chat: {
    screen: ChatScreen
  },
  Settings: {
    screen: SettingsScreen
  }
}, {
    initialRouteName: 'Home',
    drawerPosition: 'left',
    contentComponent: DrawBar
  });

DrawNav.navigationOptions = ({ navigation }) => ({
  header: null
});

const MainStackNav = createStackNavigator({
  Login: {
    screen: SignInScreen
  },
  Register: {
    screen: RegisterScreen
  },
  Home: {
    screen: DrawNav
  }
},
  {
    initialRouteName: 'Login'
  });

@inject('chatStore')
@observer
export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={this.props.client}>
        <MainStackNav />
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
  drawerImage: {
    width: 260,
    height: 120
  }
});
