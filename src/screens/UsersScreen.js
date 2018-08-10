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

    addNewRoomWithUser = (userName, userId) => {
        this.props.chatStore.createRoom(userName, [this.props.chatStore.currentUserID, userId]);
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
                                rightOpenValue={-100}
                                dataSource={this.ds.cloneWithRows(this.props.chatStore.users)}
                                renderRow={user =>
                                    <ListItem>
                                        <Text style={{ marginLeft: 12, fontWeight: 'bold' }}> {user.name} </Text>
                                    </ListItem>}
                                renderLeftHiddenRow={user =>
                                    <Button full onPress={() => alert('Name: ' + user.name + '; ' + 'Email: ' + user.email)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                renderRightHiddenRow={(user) =>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Button full onPress={
                                            () => {
                                                this.addNewRoomWithUser(user.name, user.id);

                                                this.props.navigation.navigate('Chat');
                                            }
                                        }>
                                            <Icon active name="chat" type="Entypo" style={{ fontSize: 16 }} />
                                        </Button>
                                        <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                                            <Icon active name="trash" />
                                        </Button>
                                    </View>
                                }
                            />
                        )
                    }
                </Content>
            </Container>
        )
    }
}

export default UsersScreen;