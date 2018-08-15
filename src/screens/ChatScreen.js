import React, { Component } from 'react';
import { ListView, ScrollView, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import MessageWrap from '../components/MessageWrap';
import MessageInput from '../components/MessageInput';

import Message from '../components/Message';
import User from '../components/User';

import { inject, observer } from 'mobx-react';
import { POSTS_SUBSCRIPTION } from '../queries';
import { Icon, Button, Container, Header, Body, Content, Left, Right, List, ListItem, Footer, Separator, Item, Text, Input, Spinner } from 'native-base';
import Modal from 'react-native-modalbox';


@inject('chatStore')
@observer
class ChatScreen extends Component {
    constructor(props) {
        super(props);
        state = {
            isOpen: false,
            isDisabled: false,
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    componentDidMount() {
        this.unsubscribe = this.props.chatStore.subscribePosts('allPosts', 'Post', POSTS_SUBSCRIPTION, this.props.chatStore.roomId);
    }

    componentWillReceiveProps({ roomId }) {
        if (this.unsubscribe) {
            this.unsubscribe()
        }

        this.unsubscribe = this.props.chatStore.subscribePosts('allPosts', 'Post', POSTS_SUBSCRIPTION, this.props.chatStore.roomId);
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }

    state = {
        editRoom: false,
        newRoomName: '',
        modalIsOpen: false,
        deleteModalIsOpen: false,
        usersCount: null,
        description: '',
        file: null,
        filesIds: 'cjia6p4gu091u0156homvbqtt',
        userId: this.props.chatStore.currentUserID,
        msgSendLoading: false,
        uploadLoading: false,
        fileInfoShow: false
    }

    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue", fontSize: 22 }} name='chat' type="Entypo" />
        )
    }

    showFilePicker = async () => {
        // More info on all the options is below in the README...just some common use cases shown here
        var options = {
            title: 'Select Avatar',
            customButtons: [
                { name: 'fb', title: 'Choose Photo from Facebook' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        await ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    file: response,
                    uploadLoading: true
                });

                let file = this.state.file;
                let localUri = response.uri;
                let filename = response.fileName;

                if (file !== null) {
                    const formData = new FormData()
                    const data = {
                        uri: localUri,
                        name: `${filename}.jpg`,
                        type: 'image/jpeg',
                    }

                    formData.append('data', data)

                    const options = {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data',
                        },
                    }

                    return fetch('https://api.graph.cool/file/v1/cji3486nr3q4b0191ifdu8j6x', options)
                        .then((response) => {
                            return response.json()
                        }).then((image) => {
                            console.log(image)
                            this.setState({
                                filesIds: image.id
                            });
                            return image
                        }).then(() => {
                            // this.handlePost();
                            this.setState({
                                // filesIds: 'cjia6p4gu091u0156homvbqtt',
                                file: null,
                                uploadLoading: false,
                                fileInfoShow: true
                            })
                        })
                        .catch(error => console.error(`Error uploading image`))
                }
            }
        });
    }

    handlePost = async () => {
        const { roomId, createPost, defaultRoomId } = this.props.chatStore;
        this.setState({
            msgSendLoading: true
        });
        let roomID = roomId;
        if (roomId === '') {
            roomID = defaultRoomId
        }
        const { description, userId, filesIds } = this.state;
        await createPost(userId, description, filesIds, roomID);
        this.setState({
            description: '',
            msgSendLoading: false,
            filesIds: 'cjia6p4gu091u0156homvbqtt',
            fileInfoShow: false
            // file: null,
        })

    }

    onChange = e => {
        this.setState({
            file: e.target.files[0]
        });
    }
    onClose = () => {
        console.log('Modal just closed');
    }

    renderLogOutRoomBtn = () => {
        const { roomId, defaultRoomId, currentUserID, defaultRoomName, leaveRoom, changeRoom } = this.props.chatStore;
        if (roomId !== defaultRoomId && roomId !== '') {
            return (
                <Button transparent>
                    <Icon name="delete"
                        type="MaterialIcons"
                        style={{ marginLeft: 0, marginRight: 0, fontSize: 23 }}
                        onPress={() => {
                            console.log('RoomID: ', roomId);
                            leaveRoom(currentUserID, roomId);
                            changeRoom(defaultRoomId, defaultRoomName);
                        }}
                    />
                </Button>
            )
        }
    }
    render() {
        const {
            posts,
            postsLoading,
            roomName,
            defaultRoomName,
            usersRoomMembers,
            usersRoomMembersLoading,
            usersNotRoomMembers,
            usersNotRoomMembersLoading,
            updateRoomNameMutation,
            roomId,
            changeRoomName,
            usersRoomMembersCount
        } = this.props.chatStore;
        console.log('RoomID: ', this.props.chatStore.roomId);
        return (

            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{roomName ? roomName : defaultRoomName}</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="ios-person-add"
                                type="Ionicons"
                                style={{ marginLeft: 0, marginRight: 0, fontSize: 30 }}
                                onPress={() => this.refs.modal1.open()}
                            />
                        </Button>

                        {this.renderLogOutRoomBtn()}
                    </Right>
                </Header>
                {postsLoading
                    ? (<Content>
                        <Spinner color='blue' />
                    </Content>)
                    : (<Content padder>


                        {
                            posts.map(post => (
                                <Message
                                    time={post.createdAt}
                                    from="You"
                                    id={post.id}
                                    key={post.id}
                                    userName={post.user.name}
                                    userId={post.user.id}
                                    post={post}
                                    files={post.files[0]}
                                />
                            ))
                        }
                    </Content>)
                }

                {this.state.fileInfoShow ? <Text style={{ paddingHorizontal: 10, color: 'blue' }}>1 file attached</Text> : <Text />}
                <Footer style={{ backgroundColor: 'white', alignContent: 'center' }}>

                    <Item regular style={{ flex: 1 }}>
                        <Input
                            placeholder="Enter your message..."
                            onChangeText={(description) => this.setState({ description })}
                            ref="textInput"
                            value={this.state.description}
                        />
                    </Item>
                    <Button primary rounded style={{ width: 45, marginTop: 5, paddingLeft: 0, paddingRight: 0, justifyContent: 'center' }}
                        onPress={this.showFilePicker}
                    >
                        {this.state.uploadLoading ? <Spinner color='white' size='small' /> : <Icon name='attach-file' type='MaterialIcons' style={{ fontSize: 20, marginLeft: 0, marginRight: 0 }} />}

                    </Button>
                    <Button primary rounded style={{ width: 45, marginTop: 5, paddingLeft: 0, paddingRight: 0, justifyContent: 'center' }}
                        type='submit'
                        onPress={this.handlePost}
                    >
                        {this.state.msgSendLoading ? <Spinner color='white' size='small' /> : <Icon name='send' type='MaterialIcons' style={{ fontSize: 20, marginLeft: 0, marginRight: 0 }} />}

                    </Button>
                </Footer>

                <Modal
                    style={{
                        width: Dimensions.get('window').width - 40,
                        height: Dimensions.get('window').height - 120,
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
                            <Body><Text style={{ color: 'white' }}>Add Users:</Text></Body>
                            <Right>
                                <Button transparent onPress={() => this.refs.modal1.close()}>
                                    <Icon name='close' type="EvilIcons" style={{ color: 'white' }} />
                                </Button>
                            </Right>
                        </Header>
                        <Text style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: 'wheat', color: 'gray' }}>Room members: </Text>
                        <ScrollView style={{ maxHeight: 250, minHeight: 80 }}>

                            <List

                                dataArray={this.props.chatStore.usersRoomMembers}
                                renderRow={user =>
                                    <ListItem style={{ paddingHorizontal: 0, paddingVertical: 0, height: 40, marginHorizontal: 0 }}>
                                        <Left><Text style={{ fontWeight: 'bold' }}> {user.name} </Text></Left>
                                        <Right>
                                            <Button transparent onPress={() => {
                                                this.props.chatStore.leaveRoom(user.id, this.props.chatStore.roomId)
                                            }}>
                                                <Icon name="remove"
                                                    type="FontAwesome"
                                                    style={{ marginLeft: 0, marginRight: 0, fontSize: 20, color: 'red' }}
                                                />
                                            </Button>
                                        </Right>
                                    </ListItem>}
                            />
                        </ScrollView>
                        <Text style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: 'wheat', color: 'gray' }}>Not members: </Text>
                        <Content>

                            <List

                                dataArray={this.props.chatStore.usersNotRoomMembers}
                                renderRow={user =>
                                    <ListItem style={{ paddingVertical: 0, paddingHorizontal: 0, height: 40, marginHorizontal: 0 }}>
                                        <Left><Text style={{ fontWeight: 'bold' }}> {user.name} </Text></Left>
                                        <Right>
                                            <Button transparent onPress={() => {
                                                this.props.chatStore.addUserInRoom(user.id, this.props.chatStore.roomId)
                                            }}>
                                                <Icon name="add-to-list"
                                                    type="Entypo"
                                                    style={{ marginLeft: 0, marginRight: 0, fontSize: 20 }}
                                                />
                                            </Button>
                                        </Right>
                                    </ListItem>}
                            />
                        </Content>

                    </Container>
                </Modal>
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



export default ChatScreen;