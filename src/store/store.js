import { createStore } from 'redux';
import rootReducer from './reducer';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    return undefined;
  }
};


const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {

  }
};

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState
);


store.subscribe(() => {
  saveState(store.getState());
});

export default store;
