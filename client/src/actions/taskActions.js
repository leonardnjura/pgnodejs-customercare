import axios from 'axios';
import {
  GET_TASKS,
  ADD_TASK,
  DELETE_TASK,
  TASKS_LOADING,
  INCREMENT_TASKS_PAGE,
  LOAD_MORE_TASKS
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getTasksFoo = () => dispatch => {
  dispatch(setTasksLoading()); // Spin that loader until data placed in reducer
  axios
    .get('/api/tasks') //see proxy in pkg json
    .then(res =>
      dispatch({
        type: GET_TASKS,
        payload: res.data.tasks
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.tasks, err.response.status))
    );
};

export const getTasks = pageNo => dispatch => {
  dispatch(setTasksLoading()); // Spin that loader until data placed in reducer
  axios
    .get(`/api/tasks?pageNo=${pageNo}`) //see proxy in pkg json
    .then(res => {
      const vitu = res.data.tasks;
      const nextTasks = vitu.map(task => ({
        task_id: task.task_id,
        customer_first_name: task.customer_first_name,
        customer_last_name: task.customer_last_name,
        task_status_name: task.task_status_name,
        personnel_id: task.personnel_id,
        customer_comments: task.customer_comments
      }));

      // Merges the next tasks into our existing tasks
      dispatch({
        // type: GET_TASKS,
        type: LOAD_MORE_TASKS,
        payload: nextTasks
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.tasks, err.response.status))
    );
};

export const addTask = task => (dispatch, getState) => {
  axios
    .post('/api/tasks', task, tokenConfig(getState)) // pass in new object created by api into reducer
    .then(res =>
      dispatch({
        type: ADD_TASK,
        payload: res.data
      })
    )
    .catch(err => console.log({ err }));
};

export const deleteTask = id => (dispatch, getState) => {
  //getState has token
  axios
    .delete(`/api/tasks/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_TASK,
        payload: id
      })
    )
    .catch(err => console.log({ err }));
};

export const setTasksLoading = () => {
  return {
    type: TASKS_LOADING
  };
};

export const incrementTasksPage = () => {
  return {
    type: INCREMENT_TASKS_PAGE
  };
};
