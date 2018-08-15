import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Content, Left, Right, Button, Text, Icon } from 'native-base';
import Image from 'react-native-image-progress';
import { inject, observer } from 'mobx-react';


@inject('chatStore')
@observer
class Message extends Component {
    deletePost = async (id) => {
        await this.props.chatStore.deletePost(id)
    }

    render() {
        let { id, userName, userId, files, time, post: { description } } = this.props;
        const defImg = 'https://files.graph.cool/cji3486nr3q4b0191ifdu8j6x/cjia6p3ts091t0156bk0j4a2b';
        return (
            <Content contentContainerStyle={styles.postStyle} >
                <Left style={{ width: 280, justifyContent: 'flex-start' }}>
                    <Text style={styles.messageStyle}>{description}</Text>
                    {files !== undefined ? <Image
                        indicator={ActivityIndicator}
                        source={{ uri: files.url }} style={(files.url === defImg ? { opacity: 1 } : { width: 100, height: 100 })} /> : <View />}
                    <Text style={styles.descriptionStyle}>Message by: {userName}</Text>
                </Left>

                {(userId === this.props.chatStore.currentUserID)
                    ? (<Right style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Button rounded transparent danger
                            onPress={() => this.deletePost(id)}>
                            <Icon name="delete" style={{ fontSize: 20 }} type="MaterialIcons" />
                        </Button>
                    </Right>)
                    : <Right />}
            </Content>
        )
    }
}

const styles = {
    postStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: 'wheat',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    messageStyle: {
        fontWeight: 'bold'
    },
    descriptionStyle: {
        fontSize: 10
    },
    buttonStyle: {

    }

}

export default Message;