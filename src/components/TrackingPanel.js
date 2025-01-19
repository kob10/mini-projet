import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearLogs } from '../store/trackingReducer';
import { useNavigate } from 'react-router-dom';
import './CSS/TrackingPanel.css';

function TrackingPanel() {
  const logs = useSelector((state) => state.tracking.logs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [clearedLogs, setClearedLogs] = useState([]);
  
  const [userNotes, setUserNotes] = useState(() => {
    const savedNotes = localStorage.getItem('trackingUserNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  useEffect(() => {
    localStorage.setItem('trackingUserNotes', JSON.stringify(userNotes));
  }, [userNotes]);

  const getLogId = (log, index) => {
    return log.id || `${log.user}-${log.timestamp}-${index}`;
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      setClearedLogs(logs);
      dispatch(clearLogs());
    }
  };

  const handleUndoClear = () => {
    dispatch({ type: 'SET_LOGS', payload: clearedLogs });
    setClearedLogs([]);
  };

  const handleGoHome = () => {
    navigate('/layout');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['User', 'Action', 'Timestamp', 'Note'],
      ...logs.map((log) => [
        log.user,
        log.action,
        new Date(log.timestamp).toLocaleString(),
        userNotes[log.user] || 'No Note',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracking_logs.csv';
    a.click();
  };

  const handleAddNote = (log) => {
    const note = prompt(`Enter your note for ${log.user}:`);
    if (note) {
      setUserNotes((prevNotes) => ({
        ...prevNotes,
        [log.user]: note,
      }));
    }
  };

  const handleDeleteNote = (user) => {
    setUserNotes((prevNotes) => {
      const updatedNotes = { ...prevNotes };
      delete updatedNotes[user];
      return updatedNotes;
    });
  };

  const filteredLogs = logs
    .filter((log) => {
      const logDate = new Date(log.timestamp);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!filterUser || log.user === filterUser) &&
        (!filterAction || log.action.includes(filterAction)) &&
        (!start || logDate >= start) &&
        (!end || logDate <= end)
      );
    })
    .filter((log) =>
      `${log.user} ${log.action} ${new Date(log.timestamp).toLocaleString()}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // Calculate Summary Metrics
  const totalApiCalls = logs.length;

  const userActivityCount = logs.reduce((acc, log) => {
    acc[log.user] = (acc[log.user] || 0) + 1;
    return acc;
  }, {});

  const mostActiveUser = Object.entries(userActivityCount).reduce(
    (max, [user, count]) => (count > max.count ? { user, count } : max),
    { user: 'N/A', count: 0 }
  );

  const actionCount = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  const mostUsedAction = Object.entries(actionCount).reduce(
    (max, [action, count]) => (count > max.count ? { action, count } : max),
    { action: 'N/A', count: 0 }
  );

  const latestActivity = logs.length
    ? new Date(logs[logs.length - 1].timestamp).toLocaleString()
    : 'No Activity Yet';

  return (
    <div className="panel-container">
      <h2 className="panel-header">Tracking Panel</h2>

      {/* Activity Summary */}
      <div className="summary-container">
        <h3>Activity Summary</h3>
        <ul>
          <li>Total API Calls: {totalApiCalls}</li>
          <li>Most Active User: {mostActiveUser.user} ({mostActiveUser.count} actions)</li>
          <li>Most Used Action: {mostUsedAction.action} ({mostUsedAction.count} times)</li>
          <li>Latest Activity: {latestActivity}</li>
        </ul>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search logs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Filters */}
      <div className="filters">
        <label>
          Filter by User:
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="filter-input"
          >
            <option value="">All Users</option>
            {[...new Set(logs.map((log) => log.user))].map((user, index) => (
              <option key={index} value={user}>
                {user}
              </option>
            ))}
          </select>
        </label>
        <label>
          Filter by Action:
          <input
            type="text"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            placeholder="Enter action"
            className="filter-input"
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
        </label>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <p className="no-logs">No matching logs found.</p>
      ) : (
        <table className="table-style">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => {
              const logId = getLogId(log, index);
              return (
                <tr key={logId}>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{userNotes[log.user] || 'No Note'}</td>
                  <td>
                    <div className="action-zone flex space-x-2">
                      <button
                        onClick={() => handleAddNote(log)}
                        className="btn-note"
                      >
                        Add/Edit Note
                      </button>
                      {userNotes[log.user] && (
                        <button
                          onClick={() => handleDeleteNote(log.user)}
                          className="btn-delete-note"
                        >
                          Delete Note
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="button-group">
        <button onClick={handleClearLogs} className="btn-clear">
          Clear Logs
        </button>
        {clearedLogs.length > 0 && (
          <button onClick={handleUndoClear} className="btn-undo">
            Undo Clear
          </button>
        )}
        <button onClick={exportToCSV} className="btn-export">
          Export Logs
        </button>
        <button onClick={handleGoHome} className="btn-home">
          Go Back to Home
        </button>
      </div>
    </div>
  );
}

export default TrackingPanel;
