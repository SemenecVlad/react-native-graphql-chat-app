import React, { Component } from 'react';
import {
    Image,
    AsyncStorage,
    View
} from 'react-native';
import { Container, Header, Content, Form, Icon, Item, Input, Label, Button, Text, Spinner } from 'native-base';
import { inject, observer } from 'mobx-react';

// import { FormLabel, FormInput, Button } from 'react-native-elements';
@inject('chatStore')
@observer
class SignInScreen extends Component {
    static navigationOptions = {
        title: 'Sign In',
        headerStyle: {
            display: 'none'
        }
    }

    componentDidMount() {
        if (AsyncStorage.getItem('userId') !== undefined && AsyncStorage.getItem('userId') !== '') {
            this.props.navigation.navigate('ChatScreen')
        }
    }

    state = {
        email: null,
        password: null,
        error: '',
        loading: false
    }

    handleSubmit = async () => {
        let { email, password } = this.state;
        this.setState({
            loading: true
        })
        await this.props.chatStore.signIn(email, password)
            .then(({ data: { signinUser: { token, user: { id, name } } } }) => {
                // await AsyncStorage.setItem('token', token);
                // await AsyncStorage.setItem('userId', id);
                this.props.chatStore.changeUserID(id);
                AsyncStorage.setItem('userId', id);
                this.setState({
                    loading: false
                })
                this.props.navigation.navigate('Home');
                console.log(name, id, token);
                console.log('userId from MobX', this.props.chatStore.currentUserID)

            })
            .catch(error => {
                this.setState({
                    loading: false,
                    email: null,
                    password: null,
                    error
                })
            });

        // console.log(this.state.email, this.state.password)
    }


    renderError = () => {
        if (this.state.error) {
            return <Text style={{ paddingHorizontal: 15, paddingVertical: 15, color: 'red', textAlign: 'center', fontWeight: 'bold' }}>No user found with that info</Text>
        }
    }
    render() {
        let { email, password, error, loading } = this.state;
        return (
            <Container>
                <Content style={{ marginLeft: 10, marginRight: 10, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 }}>
                        <Image
                            source={require('../../assets/images/graphql.png')}
                            style={{
                                width: 260,
                                height: 120
                            }}
                        />
                    </View>
                    {this.renderError()}
                    <Form>
                        <Item floatingLabel>
                            <Icon active name='email' type="MaterialIcons" />
                            <Label style={{ paddingLeft: 10 }}>Email</Label>
                            <Input
                                name="email"
                                keyboardType="email-address"
                                onChangeText={(email) => this.setState({ email })}
                                value={this.state.email}
                                onFocus={() => this.setState({ error: '' })}
                            />
                        </Item>
                        <Item floatingLabel last style={{ marginBottom: 20 }}>
                            <Icon active name='lock' type="Entypo" />
                            <Label style={{ paddingLeft: 10 }}>Password</Label>
                            <Input secureTextEntry
                                name="password"
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password}
                            />
                        </Item>

                        <Button block
                            onPress={() => {
                                this.handleSubmit();
                                this.setState({
                                    email: null,
                                    password: null
                                })
                            }}
                        >
                            {loading
                                ? <Spinner color="white" />
                                : <Text>Sign In</Text>
                            }

                        </Button>

                        <Content style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', marginBottom: 10 }}>Don't have account yet?</Text>
                            <Button bordered block
                                onPress={() => this.props.navigation.navigate('Register')}
                            >
                                <Text>Register</Text>
                            </Button>
                        </Content>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default SignInScreen;
