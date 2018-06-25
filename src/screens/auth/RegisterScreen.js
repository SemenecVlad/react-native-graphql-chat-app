import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class RegisterScreen extends Component {
    state = {
        email: '',
        password: '',
        passwordConfirm: '',
        name: ''
    }

    handleSubmit = async () => {
        let { email, password, passwordConfirm, name } = this.state;
        if (password !== passwordConfirm) {
            this.setState({
                error: 'Passwords must be an equal! Try again!'
            });
            return;
        }
        await this.props.registerMutation({
            variables: {
                email, password, name
            }
        }).then((data) => {
            // console.log(data)
            this.props.navigation.navigate('Auth')
        })
            .catch((error) => {
                console.log("ЁБА...", error)
                this.setState({
                    error: "Oops! User already exists with that information"
                })
            })
        console.log(name, email, password)
    }
    render() {
        let { email, password, passwordConfirm, name, error } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Register account</Text>

                <FormLabel containerStyle={styles.label}>Name:</FormLabel>
                <FormInput
                    name='name'
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder="Your Name..." />

                <FormLabel>Email:</FormLabel>
                <FormInput
                    name='email'
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder="Your Email..." />

                <FormLabel>Password:</FormLabel>
                <FormInput
                    secureTextEntry
                    name='password'
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder="Your Password..." />

                <FormLabel>Confirm Password:</FormLabel>
                <FormInput
                    secureTextEntry
                    name='passwordConfirm'
                    value={this.state.passwordConfirm}
                    onChangeText={(passwordConfirm) => this.setState({ passwordConfirm })}
                    placeholder="Confirm Password..." />
                <Button
                    buttonStyle={styles.button}
                    onPress={this.handleSubmit} title='Register' />
                <View style={{ marginTop: 10, width: Dimensions.get("window").width }}>
                    <Text style={{ textAlign: 'center' }}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}>
                        <Text style={{ textAlign: 'center', color: 'blue', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

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
    button: {
        marginTop: 20,
        backgroundColor: 'blue',
        borderRadius: 10,
        width: 160
    }
}

const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!, $name: String!) {
        createUser(name:$name,authProvider: {email: {email: $email, password: $password}})
        {
            email
            name
            password
        }
    }
`;

const RegisterWithGQL = graphql(REGISTER_MUTATION, { name: 'registerMutation' })(RegisterScreen);

export default RegisterWithGQL;
