// import 'es6-symbol/implement';
import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import graphql from 'mobx-apollo';
import { extendObservable, observable, action } from 'mobx';
import { Provider } from 'mobx-react';

import App from './App';

import {
    EDIT_POST_MUTATION,
    ALL_POSTS_QUERY,
    CREATE_POST_MUTATION,
    CREATE_ROOM_MUTATION,
    UPDATE_ROOM_NAME_MUTATION,
    ROOMS_SUBSCRIPTION,
    REGISTER_MUTATION,
    SIGN_IN_MUTATION,
    GET_ROOMS_QUERY,
    GET_USERS_QUERY,
    GET_USERS_NOT_ROOM_MEMBERS,
    GET_USERS_ROOM_MEMBERS,
    GET_ROOMS_BY_USER,
    ADD_USER_IN_ROOM_MUTATION,
    LEAVE_ROOM_MUTATION,
    DELETE_POST_MUTATION,
    DELETE_ROOM_MUTATION,
    USERS_SUBSCRIPTION
} from './src/queries';


const httpLink = new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cji3486nr3q4b0191ifdu8j6x'
});

const wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.us-west-2.graph.cool/v1/cji3486nr3q4b0191ifdu8j6x',
    options: {
        reconnect: true
    }
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
})

// Mobx store

const chatStore = new class {
    constructor() {
        extendObservable(this, {
            get allPosts() {
                return graphql({
                    client,
                    query: ALL_POSTS_QUERY,
                    variables: {
                        id: (this.roomId ? this.roomId : this.defaultRoomId)
                    },
                    fetchPolicy: "network-only",
                })
            },
            get postsError() {
                return (this.allPosts.error && this.allPosts.error.message) || null;
            },
            get postsLoading() {
                return this.allPosts.loading;
            },
            get posts() {
                return (this.allPosts.data && this.allPosts.data.allPosts) || [];
            },
            get allUsers() {
                return graphql({
                    client,
                    query: GET_USERS_QUERY
                });
            },
            get usersError() {
                return (this.allUsers.error && this.allUsers.error.message) || null;
            },
            get usersLoading() {
                return this.allUsers.loading;
            },
            get users() {
                return (this.allUsers.data && this.allUsers.data.allUsers) || [];
            },
            get AllusersNotRoomMembers() {
                return graphql({
                    client,
                    query: GET_USERS_NOT_ROOM_MEMBERS,
                    variables: {
                        roomId: this.roomId
                    }
                });
            },
            get usersNotRoomMembers() {
                return (this.AllusersNotRoomMembers.data && this.AllusersNotRoomMembers.data.allUsers) || [];
            },
            get usersNotRoomMembersLoading() {
                return (this.AllusersNotRoomMembers.loading);
            },
            get AllusersRoomMembers() {
                return graphql({
                    client,
                    query: GET_USERS_ROOM_MEMBERS,
                    variables: {
                        roomId: this.roomId
                    }
                });
            },
            get usersRoomMembers() {
                return (this.AllusersRoomMembers.data && this.AllusersRoomMembers.data.allUsers) || [];
            },
            get usersRoomMembersCount() {
                return (this.AllusersRoomMembers.data && this.AllusersRoomMembers.data._allUsersMeta) || [];
            },
            get usersRoomMembersLoading() {
                return (this.AllusersRoomMembers.loading);
            },
            get allRooms() {
                return graphql({
                    client,
                    query: GET_ROOMS_BY_USER,
                    variables: {
                        currentUserID: this.currentUserID
                    }
                });
            },
            get roomsError() {
                return (this.allRooms.error && this.allRooms.error.message) || null;
            },
            get roomsLoading() {
                return this.allRooms.loading;
            },
            get rooms() {
                return (this.allRooms.data && this.allRooms.data.allRooms) || [];
            }
        });

        this.subscribe('allRooms', 'Room', ROOMS_SUBSCRIPTION);
        this.subscribe('allUsers', 'User', USERS_SUBSCRIPTION);
    }



    @action subscribe = (prop, node, document) => this[prop].ref.subscribeToMore({
        document,
        updateQuery: (current, { subscriptionData }) => {
            const prev = current[prop];
            const next = subscriptionData.data[node];
            console.log(next.mutation);
            console.log(prev)

            if (next.mutation === 'CREATED') {
                return { [prop]: prev.concat([next.node]) }
            }

            if (next.mutation === 'UPDATED') {
                const updated = prev.slice();
                const index = updated.findIndex(({ id }) => id === next.node.id);
                updated[index] = next.node;
                return { [prop]: updated };
            }

            if (next.mutation === 'DELETED') {
                return {
                    [prop]: prev.filter(({ id }) => id !== next.previousValues.id)
                }
            }
        }
    });

    @action subscribePosts = (prop, node, document, roomId) => this[prop].ref.subscribeToMore({
        document,
        variables: {
            roomId
        },
        updateQuery: (current, { subscriptionData }) => {
            const prev = current[prop];
            const next = subscriptionData.data[node];
            console.log(next.mutation);
            console.log(prev)
            if (!subscriptionData) {
                return { [prop]: prev };
            }

            if (next.mutation === 'CREATED') {
                return { [prop]: prev.concat([next.node]) }
            }

            if (next.mutation === 'UPDATED') {
                const updated = prev.slice();
                const index = updated.findIndex(({ id }) => id === next.node.id);
                updated[index] = next.node;
                return { [prop]: updated };
            }

            if (next.mutation === 'DELETED') {
                return {
                    [prop]: prev.filter(({ id }) => id !== next.previousValues.id)
                }
            }
        }
    });

    @action updateRoomNameMutation = (name, roomId) => client.mutate({
        mutation: UPDATE_ROOM_NAME_MUTATION,
        variables: { name, roomId }
    }).catch(error => console.log(error));

    @action editPost = (postId, description) => client.mutate({
        mutation: EDIT_POST_MUTATION,
        variables: { postId, description }
    }).catch(error => console.log(error));

    @action addUserInRoom = (userId, roomId) => client.mutate({
        mutation: ADD_USER_IN_ROOM_MUTATION,
        variables: { userId, roomId },
        refetchQueries: [
            {
                query: GET_USERS_ROOM_MEMBERS,
                variables: {
                    roomId: this.roomId
                }
            },
            {
                query: GET_USERS_NOT_ROOM_MEMBERS,
                variables: {
                    roomId: this.roomId
                }
            }
        ]
    }).catch(error => console.log(error));

    @action leaveRoom = (userId, roomId) => client.mutate({
        mutation: LEAVE_ROOM_MUTATION,
        variables: { userId, roomId },
        refetchQueries: [
            {
                query: GET_ROOMS_QUERY
            },
            {
                query: GET_USERS_ROOM_MEMBERS,
                variables: {
                    roomId: this.roomId
                }
            },
            {
                query: GET_USERS_NOT_ROOM_MEMBERS,
                variables: {
                    roomId: this.roomId
                }
            }
        ]
    }).catch(error => console.log(error));

    @action signIn = (email, password) => client.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email, password }
    }).catch(error => console.log(error));

    @action register = (email, password, name) => client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { email, password, name }
    }).catch(error => console.log(error));

    @action createPost = (userId, description, filesIds, roomId) => client.mutate({
        mutation: CREATE_POST_MUTATION,
        variables: { userId, description, filesIds, roomId }
    }).catch(error => console.log(error));

    @action deletePost = id => client.mutate({
        mutation: DELETE_POST_MUTATION,
        variables: { id }
    }).catch(error => console.log(error));

    @action createRoom = (name, usersIds) => client.mutate({
        mutation: CREATE_ROOM_MUTATION,
        variables: { name, usersIds },
        //--!!!!!-- TODO: Remove refetch... it must correct work without it, but works only with first room(update UI),
        // in other rooms UI doesn't updates, only when manually refresh browser, you can see changes
        refetchQueries: [
            {
                query: GET_ROOMS_QUERY
            }
        ]
    }).catch(error => console.log(error));

    @action deleteRoom = id => client.mutate({
        mutation: DELETE_ROOM_MUTATION,
        variables: { id }
    }).catch(error => console.log(error));

    @observable roomId = "cjjpigz0e17eo01354las7vgc";
    @observable currentUserID = '';
    @action changeUserID(userID) {
        this.currentUserID = userID;
    }
    @observable roomName = "";
    @observable editMessage = false;
    @action showEditMessageInput = () => { this.editMessage = true };
    @action hideEditMessageInput = () => { this.editMessage = false };
    defaultRoomId = "cjjpigz0e17eo01354las7vgc";
    defaultRoomName = "general";

    @action changeRoom = (roomId, roomName) => {
        this.roomId = roomId;
        this.roomName = roomName;
    }

    @action changeRoomName = (roomName) => {
        this.roomName = roomName;
    }
}();

const Root = props => (
    <Provider {...{ chatStore }}>
        <App client={client} />
    </Provider>
);

AppRegistry.registerComponent('RN_chat', () => Root);
