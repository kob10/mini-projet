const initialState = {
    logs: JSON.parse(localStorage.getItem('trackingLogs')) || [], // Load logs from LocalStorage
  };
  
  const ADD_LOG = 'ADD_LOG';
  const CLEAR_LOGS = 'CLEAR_LOGS';
  
  export const addLog = (log) => ({
    type: ADD_LOG,
    payload: log,
  });
  
  export const clearLogs = () => ({
    type: CLEAR_LOGS,
  });
  
  function trackingReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_LOG:
        const updatedLogs = [...state.logs, action.payload];
        localStorage.setItem('trackingLogs', JSON.stringify(updatedLogs)); // Save to LocalStorage
        return { ...state, logs: updatedLogs };
      case CLEAR_LOGS:
        localStorage.removeItem('trackingLogs'); // Clear LocalStorage
        return { ...state, logs: [] };
      default:
        return state;
    }
  }
  
  export default trackingReducer;
  