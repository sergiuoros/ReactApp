/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {taskReducer} from './src/task';
import {authReducer} from './src/auth';
import {Router} from './src/core/Router'

const rootReducer = combineReducers({task: taskReducer, auth: authReducer});
const store = createStore(rootReducer, applyMiddleware(thunk, createLogger()));

export default class ReactApplication extends Component {
    render() {
        return (
            <Router store={store}/>
        );
    }
}

AppRegistry.registerComponent('ReactApplication', () => ReactApplication);
