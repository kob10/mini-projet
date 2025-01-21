const initialState = {
  logs: JSON.parse(localStorage.getItem('trackingLogs')) || [],
};

const ADD_LOG = 'ADD_LOG';
const CLEAR_LOGS = 'CLEAR_LOGS';
const UPDATE_LOG = 'UPDATE_LOG';

export const addLog = (log) => ({
  type: ADD_LOG,
  payload: log,
});

export const updateLog = (log) => ({
  type: UPDATE_LOG,
  payload: log,
});

export const clearLogs = () => ({
  type: CLEAR_LOGS,
});

function trackingReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_LOG:
      const updatedLogs = Array.isArray(action.payload) 
        ? action.payload 
        : [...state.logs, action.payload];
      localStorage.setItem('trackingLogs', JSON.stringify(updatedLogs));
      return { ...state, logs: updatedLogs };
      
    case UPDATE_LOG:
      const newLogs = state.logs.map(log =>
        log.id === action.payload.id ? action.payload : log
      );
      localStorage.setItem('trackingLogs', JSON.stringify(newLogs));
      return { ...state, logs: newLogs };
      
    case CLEAR_LOGS:
      localStorage.removeItem('trackingLogs');
      return { ...state, logs: [] };
      
    default:
      return state;
  }
}

export default trackingReducer;