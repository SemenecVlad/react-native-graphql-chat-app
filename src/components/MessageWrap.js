import React, { Component } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
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
            <ScrollView
                style={style.wrapperStyles}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollView.scrollToEnd({ animated: true });
                }}>
                <View style={{ flexDirection: 'column-reverse' }}>{allPosts && allPosts.map(post => (
                    <Message
                        time={post.createdAt}
                        from="You"
                        id={post.id}
                        key={post.id}
                        userName={post.user.name}
                        post={post}
                        files={post.files[0]}
                    />
                ))}</View>
            </ScrollView>
        )
    }
}


const style = {
    wrapperStyles: {
        flex: 1,
        backgroundColor: 'white',
        width: Dimensions.get("window").width,
    }
}

export default MessageWrap;