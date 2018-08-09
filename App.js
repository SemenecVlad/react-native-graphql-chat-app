import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text
} from 'react-native';
// import { createBottomTabNavigator } from 'react-navigation';

import { DrawerNavigator, DrawerItems, StackNavigator } from 'react-navigation';


import { ApolloProvider } from 'react-apollo';
import { inject, observer } from 'mobx-react'

import SignInScreen from './src/screens/auth/SignInScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import UsersScreen from './src/screens/UsersScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Container, Content, Header, Body, Button, Icon } from 'native-base';

const CustomDrawerContentComponent = (props) => (
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
)

const DrawNav = DrawerNavigator({
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
    contentComponent: CustomDrawerContentComponent
  });

DrawNav.navigationOptions = ({ navigation }) => ({
  header: null
});

const MainStackNav = StackNavigator({
  Login: {
    screen: SignInScreen
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
