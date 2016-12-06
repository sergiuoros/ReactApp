/**
 * Created by popamarina on 11/7/16.
 */
import React, {Component} from 'react';
import {ListView, Text, View, StatusBar, ActivityIndicator} from 'react-native';
import {TaskEdit} from './TaskEdit';
import {TaskView} from './TaskView';
import {loadTasks, cancelLoadTasks} from './service';
import {registerRightAction, getLogger, issueText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('TaskList');
const TASK_LIST_ROUTE = 'task/list';

export class TaskList extends Component {
  static get routeName() {
    return TASK_LIST_ROUTE;
  }
  
  static get route() {
    return {name: TASK_LIST_ROUTE, title: 'Task List', rightText: 'New'};
  }
  
  constructor(props) {
    super(props);
    log('constructor');
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    const taskState = this.props.store.getState().task;
    this.state = {
      isLoading: taskState.isLoading,
      dataSource: this.ds.cloneWithRows(taskState.items || [])
    };
    registerRightAction(this.props.navigator, this.onNewTask.bind(this));
  }
  
  render() {
    log('render');
    let message = issueText(this.state.issue);
    
    return (
      <View style={styles.content}>
        { this.state.isLoading &&
        <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
        }
        {message && <Text>{message}</Text>}
        <ListView
            style={styles.tasksList}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={task => (<TaskView task={task} onPress={(task) => this.onTaskPress(task)}/>)}/>
      </View>
    );
  }
  
  onNewTask() {
    log('onNewTask');
    this.props.navigator.push({...TaskEdit.route});
  }
  
  onTaskPress(task) {
    log('onTaskPress');
    this.props.navigator.push({...TaskEdit.route, data: task});
  }
  
  componentDidMount() {
    log('componentDidMount');
    this._isMounted = true;
    const store = this.props.store;
    this.unsubscribe = store.subscribe(() => {
      log('setState');
      const state = this.state;
      const taskState = store.getState().task;
      console.log(taskState);
      this.setState({
        dataSource: this.ds.cloneWithRows(taskState.items),
        isLoading: false
      });
    });
    store.dispatch(loadTasks());
  }
  
  componentWillUnmount() {
    log('componentWillUnmount');
    this._isMounted = false;
    this.unsubscribe();
    this.props.store.dispatch(cancelLoadTasks());
  }
}
