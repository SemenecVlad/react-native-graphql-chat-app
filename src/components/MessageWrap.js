import React, { Component } from 'react';
import { ScrollView, Text, Dimensions } from 'react-native';
import Message from './Message';

class MessageWrap extends Component {
    state = {
        message: ''
    }

    componentDidMount() {
        this.props.subscribeToNewPosts();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data.allPosts !== this.props.data.allPosts) {
            this.props.refresh()
        }
    }
    render() {
        const { styles, data: { allPosts }, formatedDate } = this.props;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white', width: Dimensions.get("window").width }}>
                {allPosts && allPosts.map(post => (
                    <Message
                        time={post.createdAt}
                        from="You"
                        id={post.id}
                        key={post.id}
                        userName={post.user.name}
                        post={post}
                        files={post.files[0]}
                    />
                ))}
            </ScrollView>
        )
    }
}

export default MessageWrap;