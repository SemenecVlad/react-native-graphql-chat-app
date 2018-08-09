import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator, Image } from 'react-native';

import MessageWrap from '../components/MessageWrap';
import MessageInput from '../components/MessageInput';

import Message from '../components/Message';

import { inject, observer } from 'mobx-react';
import { POSTS_SUBSCRIPTION } from '../queries';
import { Icon, Button, Container, Header, Body, Content, Left, Right, Footer, Item, Input, Spinner } from 'native-base';


@inject('chatStore')
@observer
class ChatScreen extends Component {
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
        loading: false
    }

    static navigationOptions = {
        drawerIcon: (
            <Icon style={{ color: "blue", fontSize: 22 }} name='chat' type="Entypo" />
        )
    }

    handlePost = async () => {
        const { roomId, createPost, defaultRoomId } = this.props.chatStore;
        let roomID = roomId;
        if (roomId === '') {
            roomID = defaultRoomId
        }
        const { description, userId, filesIds } = this.state;
        await createPost(userId, description, filesIds, roomID);
        this.setState({
            description: '',
            loading: false
        })

    }

    uploadFile = () => {
        let file = this.state.file;

        if (file !== null) {
            let data = new FormData();
            data.append('data', file);
            this.setState({
                loading: true
            });
            //console.log(data)
            fetch('https://api.graph.cool/file/v1/cji3486nr3q4b0191ifdu8j6x', {
                method: 'POST',
                body: data,
                name: 'data'
            }).then(response => {
                console.log('file upload response', response);
                return response.json();
            }).then(file => {
                const filesIds = file.id;
                console.log(file, filesIds);
                this.setState({
                    filesIds
                });
                return filesIds;
            }).then(() => {
                this.handlePost();
                this.setState({
                    filesIds: 'cjia6p4gu091u0156homvbqtt',
                    file: null,
                    loading: false
                })
                console.log('[POST SENDED]-state- :', this.state.file)
            }).catch(err => console.log('[ERROR]', err))
        } else {
            // if file not selected in file input then set filesIds value to the default,
            // and get the default 1px line image from storage
            this.setState({
                filesIds: 'cjia6p4gu091u0156homvbqtt'
            });
            this.handlePost();
            // this.props.refresh();
        }
    }

    onChange = e => {
        this.setState({
            file: e.target.files[0]
        });
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
                <Content padder>


                    {
                        posts.map(post => (
                            <Message
                                time={post.createdAt}
                                from="You"
                                id={post.id}
                                key={post.id}
                                userName={post.user.name}
                                post={post}
                                files={post.files[0]}
                            />
                        ))
                    }
                </Content>

                <Footer style={{ backgroundColor: 'white', alignContent: 'center' }}>
                    <Item regular style={{ flex: 1 }}>
                        <Input
                            placeholder="Enter your message..."
                            onChangeText={(description) => this.setState({ description })}
                        />
                    </Item>
                    <Button primary rounded style={{ width: 45, marginTop: 5, paddingLeft: 0, paddingRight: 0 }}
                        onPress={this.uploadFile}
                    >
                        {this.state.loading ? <Spinner /> : <Icon name='send' type='MaterialIcons' style={{ fontSize: 20, marginLeft: 13, marginRight: 0 }} />}

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



export default ChatScreen;