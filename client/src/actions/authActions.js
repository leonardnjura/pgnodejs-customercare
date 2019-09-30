import axios from 'axios';
import { returnErrors } from './errorActions';

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';

// DETERMINE USER
// fired when App component mounts
// check token in localstorage & load determine whoami [GET api/auth/user]
export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING }); // will set isLoading in auth reducer to true
  axios
    .get('api/auth/personnel', tokenConfig(getState))// whoami?
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data // user obj + token
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status)); // see import for obj body
      console.log({err})
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// SIGNUP USER
export const registerUser = ({ personnel_fname, personnel_onames, personnel_phone, personnel_password }) => dispatch => {
  // headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  // request body
  const body = JSON.stringify({ personnel_fname, personnel_onames, personnel_phone, personnel_password });

  axios
    .post('/api/auth/signup', body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data // user obj + token
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

// LOGIN
export const login = ({ personnel_phone, personnel_password }) => dispatch => {
  // headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  // request body
  const body = JSON.stringify({ personnel_phone, personnel_password });

  axios
    .post('/api/auth/signin', body, config)
    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data // user obj + token
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// LOGOUT
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// SETUP HEADERS WITH TOKEN
export const tokenConfig = getState => {
  // get token from localstorage
  const token = getState().auth.token; // will get value of token in auth reducer

  // headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // token?, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};

// SETUP HEADERS WITHOUT TOKEN
export const tokenlessConfig = () => {
  // headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  return config;
};
