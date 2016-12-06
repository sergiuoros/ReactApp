/**
 * Created by SergiuOros on 11/4/16.
 */
import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import {login} from './service';
import {getLogger, registerRightAction, issueText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('Login');

const LOGIN_ROUTE = 'auth/login';

export class Login extends Component {
  static get routeName() {
    return LOGIN_ROUTE;
  }
  
  static get route() {
    return {name: LOGIN_ROUTE, title: 'Authentication', rightText: 'Login'};
  }
  
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
    log('constructor');
  }
  
  componentWillMount() {
    log('componentWillMount');
    this.updateState();
    registerRightAction(this.props.navigator, this.onLogin.bind(this));
  }
  
  render() {
    log('render');
    const auth = this.state.auth;
    let message = issueText(auth.issue);
    return (
      <View style={styles.content}>
        <ActivityIndicator animating={auth.inprogress} style={styles.activityIndicator} size="large"/>
        <Text>Username</Text>
        <TextInput style={{
          marginTop: 8,
          marginBottom: 15,
          alignSelf: "center",
          textAlign: "center",
          height: 20,
          padding: 0,
          width: 200}}
                   placeholder="type your username here"
                   autoCapitalize= "none"
                   autoCorrect={false}
                   onChangeText={(text) => this.setState({...this.state, username: text})}/>
        <Text>Password</Text>
        <TextInput style={{
          marginTop: 8,
          alignSelf: "center",
          height: 20,
          textAlign: "center",
          width: 200}}
                   placeholder="type your password here"
                   autoCapitalize="none"
                   autoCorrect={false}
                   secureTextEntry={true}
                   onChangeText={(text) => this.setState({...this.state, password: text})}/>
        {message && <Text>{message}</Text>}
      </View>
    );
  }
  
  componentDidMount() {
    log(`componentDidMount`);
    this.unsubscribe = this.props.store.subscribe(() => this.updateState());
  }
  
  componentWillUnmount() {
    log(`componentWillUnmount`);
    this.unsubscribe();
  }
  
  updateState() {
    log(`updateState`);
    this.setState({...this.state, auth: this.props.store.getState().auth});
  }
  
  onLogin() {
    log('onLogin');
    this.props.store.dispatch(login(this.state)).then(() => {
      if (this.state.auth.token) {
        this.props.onAuthSucceeded();
      }
    });
  }
}