import {
  GET_TASKS,
  ADD_TASK,
  DELETE_TASK,
  TASKS_LOADING,
  INCREMENT_TASKS_PAGE,
  LOAD_MORE_TASKS
} from '../actions/types';

const initialState = {
  tasks: [],
  hasMore: true,
  isLoading: false,
  pageNo: 1,
  error: false
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

    case LOAD_MORE_TASKS:
      return {
        ...state,
        hasMore: state.tasks.length < 50,
        isLoading: false,
        tasks: [...state.tasks, ...action.payload]
      };

    case INCREMENT_TASKS_PAGE:
      return {
        ...state,
        pageNo: state.pageNo + 1
      };

    default:
      return state;
  }
}
