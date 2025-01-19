import React from 'react';
import { useSelector } from 'react-redux';
import './CSS/TrackingPanel.css';

function ActivitySummary() {
  const logs = useSelector((state) => state.tracking.logs);

  // Calculate metrics
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
    <div className="summary-container">
      <h2>Activity Summary</h2>
      <ul>
        <li>Total API Calls: {totalApiCalls}</li>
        <li>Most Active User: {mostActiveUser.user} ({mostActiveUser.count} actions)</li>
        <li>Most Used Action: {mostUsedAction.action} ({mostUsedAction.count} times)</li>
        <li>Latest Activity: {latestActivity}</li>
      </ul>
    </div>
  );
}

export default ActivitySummary;
