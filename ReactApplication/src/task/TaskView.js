/**
 * Created by SergiuOros on 11/7/16.
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';

export class TaskView extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <TouchableHighlight onPress={() => this.props.onPress(this.props.task)}>
        <View style={styles.listItemWrapper}>
          <Text style={styles.listItem}>{this.props.task.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    margin: 10,
    color: '#000'
  },
  listItemWrapper: {
   // backgroundColor: '#000'
  }
});