import React, { Component } from 'react';
import { View, Dimensions, Image } from 'react-native';
// import { FormLabel, FormInput, Button } from 'react-native-elements';

import { inject, observer } from 'mobx-react';

import { Container, Header, Content, Form, Icon, Item, Input, Label, Button, Text, Spinner } from 'native-base';

@inject('chatStore')
@observer
class RegisterScreen extends Component {
    static navigationOptions = {
        title: 'Sign In',
        headerStyle: {
            display: 'none'
        }
    }

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
        await this.props.chatStore.register(email, password, name)
            .then((data) => {
                // console.log(data)
                this.props.navigation.navigate('Login')
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
            <Container>
                <Content style={{ marginLeft: 10, marginRight: 10, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 }}>
                        <Image
                            source={require('../../assets/images/graphql.png')}
                            style={{
                                width: 260,
                                height: 120
                            }}
                        />
                    </View>
                    <View>
                        <Text>{error}</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Icon active name='account-box' type="MaterialCommunityIcons" />
                            <Label style={{ paddingLeft: 10 }}>Username</Label>
                            <Input
                                name='name'
                                onChangeText={(name) => this.setState({ name })}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Icon active name='email' type="MaterialIcons" />
                            <Label style={{ paddingLeft: 10 }}>Email</Label>
                            <Input
                                name='email'
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </Item>
                        <Item floatingLabel last style={{ marginBottom: 0 }}>
                            <Icon active name='lock' type="Entypo" />
                            <Label style={{ paddingLeft: 10 }}>Password</Label>
                            <Input
                                onChangeText={(password) => this.setState({ password })}
                                name='password'
                                secureTextEntry
                            />
                        </Item>
                        <Item floatingLabel last style={{ marginBottom: 20 }}>
                            <Icon active name='lock' type="Entypo" />
                            <Label style={{ paddingLeft: 10 }}>Password Confirm</Label>
                            <Input
                                onChangeText={(passwordConfirm) => this.setState({ passwordConfirm })}
                                name='passwordConfirm'
                                secureTextEntry
                            />
                        </Item>
                        <Button block
                            onPress={this.handleSubmit}
                        >
                            <Text>Create User</Text>
                        </Button>

                        <Content style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', marginBottom: 10 }}>Already have an account? Please </Text>
                            <Button bordered block
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                <Text>Sign In</Text>
                            </Button>
                        </Content>
                    </Form>
                </Content>
            </Container>

        );
    }
}

{/* <View style={styles.container}>
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
</View> */}

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

// const REGISTER_MUTATION = gql`
//     mutation Register($email: String!, $password: String!, $name: String!) {
//         createUser(name:$name,authProvider: {email: {email: $email, password: $password}})
//         {
//             email
//             name
//             password
//         }
//     }
// `;

// const RegisterWithGQL = graphql(REGISTER_MUTATION, { name: 'registerMutation' })();

export default RegisterScreen;
