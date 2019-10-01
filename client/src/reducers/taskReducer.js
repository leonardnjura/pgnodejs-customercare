import {
  GET_TASKS,
  ADD_TASK,
  DELETE_TASK,
  TASKS_LOADING
} from '../actions/types';

const initialState = {
  tasks: [],
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        isLoading: true
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.task_id !== action.payload)
      };

    case ADD_TASK:
      return {
        ...state,
        tasks: [action.payload.task, ...state.tasks]
      };
    case TASKS_LOADING:
      return {
        ...state,
        isLoading: true
      };

    default:
      return state;
  }
}
