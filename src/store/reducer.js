
import { combineReducers } from 'redux';
import trackingReducer from './trackingReducer';

const initialAuthState = {
  user: null,  
  isBlocked: false,
  attempts: 0,
};

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const CHANGE_COLOR = 'CHANGE_COLOR';

function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, attempts: 0, isBlocked: false };
    case LOGOUT:
      return { ...state, user: null, attempts: 0, isBlocked: false };
    case CHANGE_COLOR:
      return { ...state, user: { ...state.user, couleur: action.payload } };
    default:
      return state;
  }
}


const initialUsersState = {
  users: [],
};

const ADD_USER = 'ADD_USER';
const SET_USERS = 'SET_USERS';

function usersReducer(state = initialUsersState, action) {
  switch (action.type) {
    case ADD_USER:
      return { ...state, users: [...state.users, action.payload] };
    case SET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
}



const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tracking: trackingReducer,
});

export default rootReducer;
