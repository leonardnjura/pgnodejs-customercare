import axios from 'axios';
import { GET_TASKS, ADD_TASK, DELETE_TASK, TASKS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getTasks = () => dispatch => {
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
