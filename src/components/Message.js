import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Message extends Component {
    deletePost = async (id) => {
        await this.props.deletePostMutation({ variables: { id } });
        // console.log('Delete');
        this.props.refresh();
    }
    render() {
        let { from, id, userName, files, time, post: { description } } = this.props;
        return (
            <View style={styles.messageStyle} >
                <Text>Message from: {userName}</Text>
                <Text>{description}</Text>
                <TouchableOpacity onPress={() => this.deletePost(id)}>
                    <Text>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    messageStyle: {
        padding: 10,
        backgroundColor: 'aqua',
        marginBottom: 10
    }
}



// return(
//     <div onClick={()=> this.deletePost(id)} className="messageContainer" style={(from === 'You') ? {justifyContent: 'flex-end'} : {justifyContent: 'flex-start'}}>
//         <div className="message" style={(from === 'You') ? {borderBottomRightRadius: '0'} : {borderBottomLeftRadius: '0'}}>

//             <div style={{display: 'flex', justifyContent: 'space-between'}}>
//                 <div style={{marginRight: '20px'}}>{userName}</div>
//                 <div>{time}</div>
//             </div>
//             <br />
//             <div>{description}</div>
//             {files !== undefined ? <a href={files.url} target="_blank"><img alt={files.url} src={files.url} /></a> : ''}
//         </div>
//     </div>
// )


const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: ID!) {
    deletePost(id: $id ) {
      id
    }
  }
`;

const MessageWithMutation = graphql(
    DELETE_POST_MUTATION,
    { name: 'deletePostMutation' }
)(Message);

export default MessageWithMutation;