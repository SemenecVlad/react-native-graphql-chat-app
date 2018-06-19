import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
// import { withRouter } from 'react-router-dom';
import { FormInput, Button } from 'react-native-elements';
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag';
import CameraRollPicker from 'react-native-camera-roll-picker';


class MessageInput extends Component {
    state = {
        description: '',
        file: null,
        filesIds: 'cjia6p4gu091u0156homvbqtt',
    }

    handlePost = async () => {
        const { description, filesIds } = this.state;
        const { userId } = this.props;
        await this.props.createPostMutation({ variables: { description, userId, filesIds } }).catch(err => console.log('[POST ERROR]', err))
        this.setState({
            description: '',
        });

    }

    myImages = () => {

    }
    render() {
        let { description } = this.state;
        return (
            <View>
                <FormInput
                    name='description'
                    value={this.state.description}
                    placeholder='Enter your message here'
                    onChangeText={(description) => this.setState({ description })}
                />
                <Button
                    disabled={this.state.description === '' ? true : false}
                    onPress={this.handlePost}
                    title='Send'
                    buttonStyle={{ backgroundColor: 'aqua' }}
                />
                {/* <CameraRollPicker
                    callback={this.myImages}
                    style={{ width: 300, height: 50 }} /> */}
            </View>
        )
    }
}

const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($userId: ID! ,$description: String!,$filesIds: [ID!]) {
    createPost(userId: $userId ,description: $description, filesIds: $filesIds ) {
      id
      description
      files{
          id
          url
      }
    }
  }
`;

const MessageInputWithMutation = compose(
    withApollo,
    graphql(CREATE_POST_MUTATION, { name: 'createPostMutation' })
)(MessageInput)
export default MessageInputWithMutation;