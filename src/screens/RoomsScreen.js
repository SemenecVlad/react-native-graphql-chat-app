import React, { Component } from 'react';
import { View, Text, Image, ListView, Dimensions, AsyncStorage } from 'react-native';
import { Icon, Button, Container, Header, Body, Content, Footer, FooterTab, Left, Right, List, ListItem, Spinner, Input, Item, Label } from 'native-base';
import Modal from 'react-native-modalbox';
import { inject, observer } from 'mobx-react';

@inject('chatStore')
@observer
class RoomsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isDisabled: false,
            newRoomName: '',
            userId: ''
        };
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }


    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue", fontSize: 22 }} name='chat' type="Entypo" />
        )
    }

    render() {
        const onClose = () => {
            console.log('Modal just closed');
        }

        const onClosingState = (state) => {
            console.log('the open/close of the swipeToClose just changed');
        }
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log('Rooms: ', this.props.chatStore.rooms);
        console.log('UserID: ', this.props.chatStore.currentUserID);
        console.log('RoomID: ', this.props.chatStore.roomId);

        // console.log('UserID_AsyncStorage: ', this._userId());
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Rooms List</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="ios-person-add"
                                type="Ionicons"
                                style={{ marginLeft: 0, marginRight: 0, fontSize: 30 }}
                                onPress={() => this.refs.modal1.open()}
                            />
                        </Button>


                    </Right>
                </Header>

                {this.props.chatStore.roomsLoading
                    ? (
                        <Content>
                            <Spinner color='blue' />
                        </Content>
                    )
                    : (
                        <Content>
                            <List
                                leftOpenValue={50}
                                rightOpenValue={-50}
                                dataSource={this.ds.cloneWithRows(this.props.chatStore.rooms)}
                                renderRow={room =>
                                    <ListItem>
                                        <Left><Text style={{ marginLeft: 12, fontWeight: 'bold' }}> {room.name} </Text></Left>
                                        <Right style={{ flexDirection: 'row' }}>
                                            <Text note style={{ marginRight: 5, opacity: 0.5 }}>
                                                Swipe
                                            </Text>
                                            <Icon name="arrow-forward" />

                                        </Right>

                                    </ListItem>}
                                renderLeftHiddenRow={room =>
                                    <Button full onPress={() => alert(`Name: ${room.name}`)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                renderRightHiddenRow={(room) =>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Button full warning onPress={
                                            () => {
                                                this.props.chatStore.changeRoom(room.id, room.name);
                                                console.log(this.props.chatStore.roomId);
                                                this.props.navigation.navigate('Chat');
                                            }
                                        }>
                                            <Icon active name="chat" type="Entypo" style={{ fontSize: 16 }} />
                                        </Button>

                                    </View>}
                            />

                        </Content>
                    )
                }

                <Modal
                    style={{
                        width: Dimensions.get('window').width - 40,
                        height: 300,
                        marginTop: 20
                    }}
                    ref={"modal1"}
                    onClosed={this.onClose}
                    backdropPressToClose={false}
                    position="top"
                    backButtonClose={true}
                >
                    <Container>
                        <Header>
                            <Left>
                                <Icon name='chat' type='Entypo' style={{ color: 'white', fontSize: 20, paddingLeft: 10 }} />
                            </Left>
                            <Body><Text style={{ color: 'white' }}>Add new room</Text></Body>
                            <Right>
                                <Button transparent onPress={() => this.refs.modal1.close()}>
                                    <Text style={{ color: 'white' }}>
                                        <Icon name='close' type="EvilIcons" />
                                    </Text>
                                </Button>
                            </Right>
                        </Header>
                        <Content padder >
                            <Item floatingLabel>
                                <Icon active name='email' type="MaterialIcons" />
                                <Label style={{ paddingLeft: 10 }}>Enter room name:</Label>
                                <Input
                                    name="room"
                                    onChangeText={(room) => this.setState({ newRoomName: room })}
                                    value={this.state.newRoomName}
                                />
                            </Item>
                        </Content>

                        <Footer style={{ backgroundColor: 'white', justifyContent: 'space-between' }} >
                            <FooterTab>
                                <Button block success type="submit" onPress={() => {
                                    this.props.chatStore.createRoom(this.state.newRoomName, [this.props.chatStore.currentUserID]);
                                    this.refs.modal1.close();
                                    this.setState({
                                        newRoomName: ''
                                    });
                                }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                                        Create Room
                                    </Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </Container>
                </Modal>
            </Container >
        )
    }
}

export default RoomsScreen;