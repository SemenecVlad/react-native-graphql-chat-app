import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
// import { withRouter } from 'react-router-dom';
import { FormInput, Button } from 'react-native-elements';
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag';
import CameraRollPicker from 'react-native-camera-roll-picker';
import ImagePicker from 'react-native-image-picker';


class MessageInput extends Component {
    state = {
        description: '',
        file: null,
        filesIds: 'cjia6p4gu091u0156homvbqtt',
        avatarSource: ''
    }

    handlePost = async () => {
        const { description, filesIds } = this.state;
        const { userId } = this.props;
        await this.props.createPostMutation({ variables: { description, userId, filesIds } }).catch(err => console.log('[POST ERROR]', err))
        this.setState({
            description: '',
        });

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
                    file: response
                });
                // let source = { uri: response.uri };

                // // You can also display the image using data:
                // // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                // console.log(source)

                // this.setState({
                //     avatarSource: source
                // });
                // console.log('State', this.state.avatarSource)
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
                            this.handlePost();
                            this.setState({
                                filesIds: 'cjia6p4gu091u0156homvbqtt',
                                file: null
                            })
                        })
                        .catch(error => console.error(`Error uploading image`))
                }
            }
        });
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
                <Button
                    onPress={this.showFilePicker}
                    title='File'
                />
            </View>
        )
    }
}

const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($userId: ID!, $description: String!, $filesIds: [ID!]) {
                                createPost(userId: $userId, description: $description, filesIds: $filesIds) {
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