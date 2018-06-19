import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage
    // Button
} from 'react-native';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { FormLabel, FormInput, Button } from 'react-native-elements';

class SignInScreen extends Component {
    static navigationOptions = {
        title: 'Sign In',
        headerStyle: {
            display: 'none'
        }
    }

    // componentDidMount() {
    //     if (AsyncStorage.getItem('userId')) {
    //         this.props.navigation.navigate('ChatScreen')
    //     }
    // }

    state = {
        email: '',
        password: '',
        error: ''
    }

    handleSubmit = async () => {
        // e.preventDefault();
        // this.props.navigation.navigate('Register')
        let { email, password } = this.state;
        await this.props.signInMutation({
            variables: {
                email, password
            }
        }).then(({ data: { signinUser: { token, user: { id, name } } } }) => {
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('userId', id);
            this.props.navigation.navigate('ChatScreen')
            // console.log(name, id, token)
        })
            .catch(error => {
                this.setState({
                    error: 'No user found with that information'
                })
            });

        // console.log(this.state.email, this.state.password)
    }

    renderError = (error) => {
        if (error !== '') {
            return <Text>{error}</Text>
        }
    }
    render() {
        let { email, password, error } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Sign In</Text>
                <FormLabel containerStyle={styles.label}>Email:</FormLabel>
                <FormInput
                    name="email"
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder="Your Email..."
                />
                <FormLabel>Password:</FormLabel>
                <FormInput
                    secureTextEntry
                    name="password"
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder="Your Password..." />
                <Button
                    buttonStyle={styles.button}
                    onPress={this.handleSubmit} title='Sign In' />
            </View>
        );
    }
}

const SIGN_IN_MUTATION = gql`
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

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'aqua',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    label: {
        // alignSelf: 'left',
        textAlign: 'center'
    },
    button: {
        marginTop: 20,
        backgroundColor: 'blue',
        borderRadius: 10,
        width: 160
    }
}

const SignInWithGQL = graphql(SIGN_IN_MUTATION, { name: 'signInMutation' })(SignInScreen);

export default SignInWithGQL;