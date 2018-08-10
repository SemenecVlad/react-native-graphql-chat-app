import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Image from 'react-native-image-progress';
import { inject, observer } from 'mobx-react';


@inject('chatStore')
@observer
class Message extends Component {
    deletePost = async (id) => {
        // await this.props.deletePostMutation({ variables: { id } });
        await this.props.chatStore.deletePost(id)
    }

    render() {
        let { id, userName, files, time, post: { description } } = this.props;
        const defImg = 'https://files.graph.cool/cji3486nr3q4b0191ifdu8j6x/cjia6p3ts091t0156bk0j4a2b';
        return (
            <View style={styles.postStyle} >
                <View style={{ width: 280, justifyContent: 'flex-start' }}>
                    <Text style={styles.messageStyle}>{description}</Text>
                    {files !== undefined ? <Image
                        indicator={ActivityIndicator}
                        source={{ uri: files.url }} style={(files.url === defImg ? { opacity: 1 } : { width: 100, height: 100 })} /> : <View />}
                    <Text style={styles.descriptionStyle}>Message by: {userName}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => this.deletePost(id)}>
                    <Text>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    postStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

// const DELETE_POST_MUTATION = gql`
//   mutation DeletePostMutation($id: ID!) {
//     deletePost(id: $id ) {
//       id
//     }
//   }
// `;

// const MessageWithMutation = graphql(
//     DELETE_POST_MUTATION,
//     { name: 'deletePostMutation' }
// )(Message);

// export default MessageWithMutation;
export default Message;