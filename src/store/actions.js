export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const CHANGE_COLOR = 'CHANGE_COLOR';


export const loginSuccess = (user) => ({
    type: 'LOGIN_SUCCESS',
    payload: user,
  });  


export const logout = () => ({
    type: LOGOUT
});


export const changeColor = (newColor) => ({
    type: CHANGE_COLOR,
    payload: newColor
});
export const addUser = (user) => ({
    type: 'ADD_USER',
    payload: user,
  });
  
  export const setUsers = (users) => ({
    type: 'SET_USERS',
    payload: users,
  });
  
  