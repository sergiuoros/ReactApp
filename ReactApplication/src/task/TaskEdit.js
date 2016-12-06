/**
 * Created by SergiuOros on 11/7/16.
 */
import React, {Component} from 'react';
import {Text, View, TextInput, ActivityIndicator} from 'react-native';
import {saveTask, cancelSaveTask} from './service';
import {registerRightAction, issueText, getLogger} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('TaskEdit');
const TASK_EDIT_ROUTE = 'task/edit';

export class TaskEdit extends Component {
  static get routeName() {
    return TASK_EDIT_ROUTE;
  }
  
  static get route() {
    return {name: TASK_EDIT_ROUTE, title: 'Task Edit', rightText: 'Save'};
  }
  
  constructor(props) {
    log('constructor');
    super(props);
    const nav = this.props.navigator;
    const currentRoutes = nav.getCurrentRoutes();
    const currentRoute = currentRoutes[currentRoutes.length - 1];
    if (currentRoute.data) {
      this.state = {task: {...currentRoute.data}, isSaving: false};
    } else {
      this.state = {task: {assignee: '', name: '', description: '', deadline: ''}, isSaving: false};
    }
    registerRightAction(this.props.navigator, this.onSave.bind(this));
  }
  
  render() {
    log('render');
    const state = this.state;
    let message = issueText(state.issue);
    return (
      <View style={styles.content}>
        { state.isSaving &&
        <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
        }
        <Text>Assignee</Text>
        <TextInput style={{
          marginTop: 8,
          alignSelf: "center",
          height: 20,
          textAlign: "center",
          width: 200}}
                   placeholder="type username"
                   autoCapitalize="none"
                   autoCorrect={false}
                   value={state.task.assignee}
                   onChangeText={(text) => this.updateTaskAssignee(text)}/>
        <Text>Name</Text>
        <TextInput style={{
          marginTop: 8,
          alignSelf: "center",
          height: 20,
          textAlign: "center",
          width: 200}}
                   placeholder="type new name"
                   autoCapitalize="none"
                   autoCorrect={false}
                   value={state.task.name}
                   onChangeText={(text) => this.updateTaskName(text)}/>
        <Text>Description</Text>
        <TextInput style={{
          marginTop: 8,
          alignSelf: "center",
          height: 20,
          textAlign: "center",
          width: 200}}
                   placeholder="type new description"
                   autoCapitalize="none"
                   autoCorrect={false}
                   value={state.task.description}
                   onChangeText={(text) => this.updateTaskDescription(text)}/>
        <Text>Deadline</Text>
        <TextInput style={{
          marginTop: 8,
          alignSelf: "center",
          height: 20,
          textAlign: "center",
          width: 200}}
                   placeholder="type new deadline"
                   autoCapitalize="none"
                   autoCorrect={false}
                   value={state.task.deadline}
                   onChangeText={(text) => this.updateTaskDeadline(text)}/>
        {message && <Text>{message}</Text>}
      </View>
    );
  }
  
  componentDidMount() {
    log('componentDidMount');
    this._isMounted = true;
    const store = this.props.store;
    this.unsubscribe = store.subscribe(() => {
      log('setState');
      const state = this.state;
      const taskState = store.getState().task;
      this.setState({...state, issue: taskState.issue});
    });
  }
  
  componentWillUnmount() {
    log('componentWillUnmount');
    this._isMounted = false;
    this.unsubscribe();
    this.props.store.dispatch(cancelSaveTask());
  }
  
  updateTaskAssignee(text) {
    let newState = {...this.state};
    newState.task.assignee = text;
    this.setState(newState);
  }
  
  updateTaskName(text) {
    let newState = {...this.state};
    newState.task.name = text;
    this.setState(newState);
  }
  
  updateTaskDescription(text) {
    let newState = {...this.state};
    newState.task.description = text;
    this.setState(newState);
  }
  
  updateTaskDeadline(text) {
    let newState = {...this.state};
    newState.task.deadline = text;
    this.setState(newState);
  }
  
  onSave() {
    log('onSave');
    this.props.store.dispatch(saveTask(this.state.task)).then(() => {
      log('onTaskSaved');
      if (!this.state.issue) {
        this.props.navigator.pop();
      }
    });
  }
}