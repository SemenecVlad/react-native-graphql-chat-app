import gql from 'graphql-tag';

export const ALL_POSTS_QUERY = gql`
  query AllPostsQuery($id: ID!) {
    allPosts(filter: {
        room: {
          id: $id
        }
      }, orderBy: createdAt_ASC) {
      id
      description
      createdAt
      user{
          name
          id
      }
      files{
          url
      }
    },
    _allUsersMeta(filter: {
        rooms_some: {
          id: $id
        }
      }
      ) {
        count
      }
  }
`;

export const GET_USERS_NOT_ROOM_MEMBERS = gql`
    query getUsersByRoom($roomId: ID){
    allUsers(filter: {
      rooms_none: {
        id: $roomId
      }
    }) {
      id
      name
    }
  }
`;

export const GET_USERS_ROOM_MEMBERS = gql`
  query getUsersByRoom($roomId: ID){
  allUsers(filter: {
    rooms_some: {
      id: $roomId
    }
  }) {
    id
    name
  }
  _allUsersMeta(filter: {rooms_some: {id: $roomId}}) {
    count
  }
}
`;

export const GET_USERS_QUERY = gql`
    query getAllUsers {
        allUsers{
            name
            id
            email
        }
    }
`;

export const GET_ROOMS_QUERY = gql`
    query getAllRooms {
        allRooms {
            id
            name
            _usersMeta {
                count
            }
            _postsMeta {
                count
            }
        }
    } 
`;

export const GET_ROOMS_BY_USER = gql`
    query getRoomsByUser($currentUserID: ID!) {
        allRooms(filter: {
            users_some: {
                id: $currentUserID
            }
        }) {
            id
            name
            _usersMeta {
                count
            }
            _postsMeta {
                count
            }
        }
    }
`;

export const USERS_SUBSCRIPTION = gql`
  subscription {
  User {
      mutation
      node {
        id
        name
      }
      previousValues {
        id
      }
  }
}
`;

export const ROOMS_SUBSCRIPTION = gql`
  subscription {
    Room {
        mutation
        node {
          id
          name
          users {
            id
            name
            email
          }
        }
        previousValues {
          id
        }
    }
  }
`;

export const POSTS_SUBSCRIPTION = gql`
  subscription($roomId: ID!) {
    Post(filter: {
        node: {
            room: {
                id: $roomId
            }
        }
    }) {
        mutation
        node {
          description
          createdAt
          id
          room {
              name
              id
          }
          user {
            name
          }
          files {
            url
          }
        }
        previousValues {
          id
        }
    }
  }
`;

export const DELETE_ROOM_MUTATION = gql`
  mutation DeleteRoom($id: ID!) {
      deleteRoom(id: $id) {
          name
      }
  }
`;

export const CREATE_ROOM_MUTATION = gql`
    mutation createRoom($name: String!, $usersIds: [ID!]) {
        createRoom(name: $name, usersIds: $usersIds) {
            id
            name
        }
    }
`

export const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($userId: ID! ,$description: String!,$filesIds: [ID!], $roomId: ID!) {
    createPost(userId: $userId ,description: $description, filesIds: $filesIds, roomId: $roomId ) {
      id
      description
      files{
          id
          url
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: ID!) {
    deletePost(id: $id ) {
      id
    }
  }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!, $name: String!) {
        createUser(name:$name,authProvider: {email: {email: $email, password: $password}}, roomsIds: "cjjpigz0e17eo01354las7vgc")
        {
            email
            name
            password
        }
    }
`;

export const SIGN_IN_MUTATION = gql`
    mutation SignIn($email: String!, $password: String!) {
        signinUser(email: { email: $email, password: $password }) {
            token
            user{
                id
                name
            }
        }
    }
`;

export const LEAVE_ROOM_MUTATION = gql`
    mutation removeUserFromRoom($userId: ID!, $roomId: ID!) {
    removeFromRoomOnUser(usersUserId:$userId, roomsRoomId:$roomId) {
      roomsRoom {
        name
        id
      }
      usersUser {
        name
        id
      }
    }
  }
`;

export const ADD_USER_IN_ROOM_MUTATION = gql`
  mutation addUserToRoom($userId: ID!, $roomId: ID!) {
  addToRoomOnUser(usersUserId: $userId, roomsRoomId: $roomId) {
    roomsRoom {
      name
    }
    usersUser {
      name
    }
  }
}
`;

export const UPDATE_ROOM_NAME_MUTATION = gql`
    mutation changeRoomName($name: String!, $roomId: ID!) {
    updateRoom(name: $name, id: $roomId) {
      name
      id
      users {
        name
      }
    }
  }
`;

export const EDIT_POST_MUTATION = gql`
    mutation editPost($postId: ID!, $description: String!) {
    updatePost(id: $postId, description: $description) {
      id
      description
    }
  }
`;
