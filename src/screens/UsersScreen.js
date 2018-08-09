import React, { Component } from 'react';
import { View, Text, Image, ListView } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Left, Right, List, ListItem, Spinner } from 'native-base';
import { inject, observer } from 'mobx-react';

@inject('chatStore')
@observer
class UsersScreen extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue" }} name='people' />
        )
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log('Users: ', this.props.chatStore.users)
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Users</Text>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{
                    flex: 1,
                }}>
                    {this.props.chatStore.usersLoading
                        ? (<Spinner />)
                        : (
                            <List
                                leftOpenValue={50}
                                rightOpenValue={-50}
                                dataSource={this.ds.cloneWithRows(this.props.chatStore.users)}
                                renderRow={user =>
                                    <ListItem>
                                        <Text> {user.name} </Text>
                                    </ListItem>}
                                renderLeftHiddenRow={user =>
                                    <Button full onPress={() => alert('Name: ' + user.name + '; ' + 'Email: ' + user.email)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                    <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                                        <Icon active name="trash" />
                                    </Button>}
                            />
                        )
                    }
                </Content>
            </Container>
        )
    }
}

export default UsersScreen;