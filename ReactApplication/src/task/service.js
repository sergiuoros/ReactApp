/**
 * Created by SergiuOros on 11/7/16.
 */
import {getLogger} from '../core/utils';
import {apiUrl, authHeaders} from '../core/api';
const log = getLogger('task/service');
const action = (type, payload) => ({type, payload});

const SAVE_TASK_STARTED = 'task/saveStarted';
const SAVE_TASK_SUCCEEDED = 'task/saveSucceeded';
const SAVE_TASK_FAILED = 'task/saveFailed';
const CANCEL_SAVE_TASK = 'task/cancelSave';

const LOAD_TASKS_STARTED = 'task/loadStarted';
const LOAD_TASKS_SUCCEEDED = 'task/loadSucceeded';
const LOAD_TASKS_FAILED = 'task/loadFailed';
const CANCEL_LOAD_TASKS = 'task/cancelLoad';

export const loadTasks = () => (dispatch, getState) => {
  log(`loadTasks started`);
  dispatch(action(LOAD_TASKS_STARTED));
  let ok = false;
  return fetch(`${apiUrl}tasks`, {method: 'GET', headers: authHeaders(getState().auth.token)})
    .then(res => {
      ok = res.ok;
      return res.json();
    })
    .then(json => {
      log(`loadTasks ok: ${ok}, json: ${JSON.stringify(json)}`);
      if (!getState().task.isLoadingCancelled) {
        dispatch(action(ok ? LOAD_TASKS_SUCCEEDED : LOAD_TASKS_FAILED, json));
      }
    })
    .catch(err => {
      log(`loadTasks err = ${err.message}`);
      if (!getState().task.isLoadingCancelled) {
        dispatch(action(LOAD_TASKS_FAILED, {issue: [{error: err.message}]}));
      }
    });
};
export const cancelLoadTasks = () => action(CANCEL_LOAD_TASKS);

export const saveTask = (task) => (dispatch, getState) => {
  const body = JSON.stringify(task);
  log(`saveTask started`);
  dispatch(action(SAVE_TASK_STARTED));
  let ok = false;
  const url = task._id ? `${apiUrl}tasks/${task._id}` : `${apiUrl}tasks`;
  const method = task._id ? `PUT` : `POST`;
  return fetch(url, {method, headers: authHeaders(getState().auth.token), body})
    .then(res => {
      ok = res.ok;
      return res.json();
    })
    .then(json => {
      log(`saveTask ok: ${ok}, json: ${JSON.stringify(json)}`);
      if (!getState().task.isSavingCancelled) {
        dispatch(action(ok ? SAVE_TASK_SUCCEEDED : SAVE_TASK_FAILED, json));
      }
    })
    .catch(err => {
      log(`saveTask err = ${err.message}`);
      if (!getState().isSavingCancelled) {
        dispatch(action(SAVE_TASK_FAILED, {issue: [{error: err.message}]}));
      }
    });
};
export const cancelSaveTask = () => action(CANCEL_SAVE_TASK);

export const taskReducer = (state = {items: [], isLoading: false, isSaving: false}, action) => { //newState (new object)
  switch(action.type) {
    case LOAD_TASKS_STARTED:
      return {...state, isLoading: true, isLoadingCancelled: false, issue: null};
    case LOAD_TASKS_SUCCEEDED:
      return {...state, items: action.payload.data, isLoading: false};
    case LOAD_TASKS_FAILED:
      return {...state, issue: action.payload.issue, isLoading: false};
    case CANCEL_LOAD_TASKS:
      return {...state, isLoading: false, isLoadingCancelled: true};
    case SAVE_TASK_STARTED:
      return {...state, isSaving: true, isSavingCancelled: false, issue: null};
    case SAVE_TASK_SUCCEEDED:
      let items = [...state.items];
      let index = items.findIndex((i) => i._id == action.payload._id);
      if (index != -1) {
        items.splice(index, 1, action.payload.data);
      } else {
        items.push(action.payload.data);
      }
      return {...state, items, isSaving: false};
    case SAVE_TASK_FAILED:
      return {...state, issue: action.payload.issue, isSaving: false};
    case CANCEL_SAVE_TASK:
      return {...state, isSaving: false, isSavingCancelled: true};
    default:
      return state;
  }
};

